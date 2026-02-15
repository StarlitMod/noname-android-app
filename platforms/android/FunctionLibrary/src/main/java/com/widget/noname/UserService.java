package com.widget.noname;

import android.net.LocalSocket;
import android.net.LocalSocketAddress;
import android.os.ParcelFileDescriptor;
import android.os.RemoteException;
import android.util.Log;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class UserService extends IUserService.Stub {
    private static final String TAG = "UserService";
    private static final ExecutorService executor = Executors.newCachedThreadPool();

    // 活跃连接管理
    private final Map<String, SocketBridgeSession> activeSessions = new ConcurrentHashMap<>();
    private final List<Process> activeProcesses = Collections.synchronizedList(new ArrayList<>());

    @Override
    public void destroy() throws RemoteException {
        closeAllConnections();
        executor.shutdownNow();
        System.exit(0);
    }

    @Override
    public void exit() throws RemoteException {
        destroy();
    }

    @Override
    public String execLine(String command) throws RemoteException {
        try {
            // 直接使用 sh -c 执行单行命令
            Process process = Runtime.getRuntime().exec(new String[]{"sh", "-c", command});
            // 读取执行结果
            return readResult(process);
        } catch (IOException | InterruptedException e) {
            throw new RemoteException("执行命令失败: " + e.getMessage());
        }
    }

    @Override
    public String execArr(String[] command) throws RemoteException {
        try {
            // 直接执行命令数组，不需要拼接成字符串
            Process process = Runtime.getRuntime().exec(command);
            // 读取执行结果
            return readResult(process);
        } catch (IOException | InterruptedException e) {
            throw new RemoteException("执行命令失败: " + e.getMessage());
        }
    }

    /**
     * 改进的读取结果方法
     */
    public String readResult(Process process) throws IOException, InterruptedException {
        StringBuilder result = new StringBuilder();
        StringBuilder error = new StringBuilder();

        // 使用线程同时读取标准输出和错误输出，避免阻塞
        Thread outputThread = new Thread(() -> {
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    result.append(line).append("\n");
                }
            } catch (IOException e) {
                // 忽略读取异常
            }
        });

        Thread errorThread = new Thread(() -> {
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getErrorStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    error.append(line).append("\n");
                }
            } catch (IOException e) {
                // 忽略读取异常
            }
        });

        outputThread.start();
        errorThread.start();

        // 等待进程结束
        int exitCode = process.waitFor();

        // 等待输出线程结束
        outputThread.join();
        errorThread.join();

        // 如果有错误输出且标准输出为空，返回错误信息
        if (result.length() == 0 && error.length() > 0) {
            return error.toString().trim();
        }

        return result.toString().trim();
    }

    // ==================== 新增的WebView调试方法 ====================

    @Override
    public void bindLocalSocketBridge(String socketName, ParcelFileDescriptor clientSocket) {
        Log.i(TAG, "bindLocalSocketBridge called for @" + socketName);

        executor.execute(() -> {
            LocalSocket localSocket = null;
            try {
                // 1. 连接到WebView的抽象Socket
                localSocket = new LocalSocket();
                LocalSocketAddress address = new LocalSocketAddress(
                        socketName,
                        LocalSocketAddress.Namespace.ABSTRACT
                );
                localSocket.connect(address);

                Log.i(TAG, "Successfully connected to @" + socketName);

                // 2. 获取双向流
                InputStream localInput = localSocket.getInputStream();
                OutputStream localOutput = localSocket.getOutputStream();

                InputStream clientInput = new ParcelFileDescriptor.AutoCloseInputStream(clientSocket);
                OutputStream clientOutput = new ParcelFileDescriptor.AutoCloseOutputStream(clientSocket);

                // 3. 创建会话并保存
                SocketBridgeSession session = new SocketBridgeSession(
                        socketName, localSocket, clientSocket,
                        localInput, localOutput, clientInput, clientOutput
                );
                activeSessions.put(socketName, session);

                // 4. 启动双向数据转发
                session.startForwarding();

                Log.i(TAG, "Bridge established for @" + socketName);

            } catch (Exception e) {
                Log.e(TAG, "Failed to establish bridge for @" + socketName, e);
                try {
                    if (localSocket != null) localSocket.close();
                    clientSocket.close();
                } catch (IOException ignored) {}
            }
        });
    }

    @Override
    public List<String> getRemoteDevtoolsList() {
        List<String> result = new ArrayList<>();
        try {
            // 读取/proc/net/unix文件查找所有devtools_remote Socket
            File unixFile = new File("/proc/net/unix");
            if (!unixFile.exists()) {
                return result;
            }

            BufferedReader reader = new BufferedReader(new FileReader(unixFile));
            String line;
            reader.readLine(); // 跳过标题行

            while ((line = reader.readLine()) != null) {
                line = line.trim();
                if (line.contains("@") && line.contains("webview_devtools_remote_")) {
                    // 解析Socket名称
                    String[] parts = line.split("\\s+");
                    if (parts.length >= 8) {
                        String socketPath = parts[7];
                        if (socketPath.startsWith("@")) {
                            // 去掉@符号
                            String socketFullName = socketPath.substring(1);
                            result.add(socketFullName);
                        }
                    }
                }
            }
            reader.close();

            Log.i(TAG, "Found " + result.size() + " devtools sockets");
        } catch (Exception e) {
            Log.e(TAG, "Failed to get devtools list", e);
        }
        return result;
    }

    /**
     * 通过进程ID获取包名
     * @param pid 进程ID
     * @return 包名，如果找不到返回null
     */
    @Override
    public String getPackageNameByPid(int pid) {
        try {
            // 方法1: 通过/proc/{pid}/cmdline获取（最可靠）
            String cmdlinePath = "/proc/" + pid + "/cmdline";
            String cmdlineCmd = "cat " + cmdlinePath + " 2>/dev/null";
            String cmdlineOutput = execLine(cmdlineCmd);

            if (cmdlineOutput != null && !cmdlineOutput.isEmpty()) {
                // cmdline内容可能是: com.example.app\u0000...，取第一个非空段
                String[] parts = cmdlineOutput.split("\u0000");
                if (parts.length > 0 && !parts[0].isEmpty()) {
                    return parts[0].trim();
                }
            }

            // 方法2: 通过ps命令获取
            String psCmd = "ps -p " + pid + " -o args= 2>/dev/null";
            String psOutput = execLine(psCmd);
            if (psOutput != null && !psOutput.isEmpty()) {
                // ps输出可能是: com.example.app 或 /system/bin/app_process ... com.example.app
                // 提取最后一个看起来像包名的部分
                String[] tokens = psOutput.trim().split("\\s+");
                for (int i = tokens.length - 1; i >= 0; i--) {
                    String token = tokens[i];
                    // 包名通常包含点，且不含斜杠
                    if (token.contains(".") && !token.contains("/") && !token.contains(":")) {
                        return token;
                    }
                }
            }

            // 方法3: 通过进程名匹配（备选）
            String statCmd = "cat /proc/" + pid + "/stat 2>/dev/null | awk '{print $2}'";
            String statOutput = execLine(statCmd);
            if (statOutput != null) {
                // 进程名格式: (com.example.app) 或 (app_process)
                statOutput = statOutput.trim();
                if (statOutput.startsWith("(") && statOutput.endsWith(")")) {
                    String processName = statOutput.substring(1, statOutput.length() - 1);
                    if (processName.contains(".")) {
                        return processName;
                    }
                }
            }

            Log.w(TAG, "无法通过PID " + pid + " 确定包名");
            return null;

        } catch (Exception e) {
            Log.e(TAG, "获取PID " + pid + " 的包名失败", e);
            return null;
        }
    }

    @Override
    public int forwardPort(String socketName, int localPort) {
        try {
            // 使用adb forward命令建立端口转发
            String[] command;
            if (localPort > 0) {
                command = new String[]{"adb", "forward",
                        "tcp:" + localPort, "localabstract:" + socketName};
            } else {
                command = new String[]{"adb", "forward",
                        "tcp:0", "localabstract:" + socketName}; // 自动分配端口
            }

            String output = executeShellCommand(command);
            Log.i(TAG, "adb forward output: " + output);

            // 解析分配的端口
            if (output.contains("->")) {
                String portStr = output.split("->")[0].trim().replace("tcp:", "");
                return Integer.parseInt(portStr);
            }
            return localPort;

        } catch (Exception e) {
            Log.e(TAG, "Failed to forward port for @" + socketName, e);
            return -1;
        }
    }

    @Override
    public void closeAllConnections() {
        Log.i(TAG, "Closing all connections (" + activeSessions.size() + " sessions)");

        // 关闭所有Socket桥接
        for (SocketBridgeSession session : activeSessions.values()) {
            session.close();
        }
        activeSessions.clear();
    }

    // ==================== 辅助方法 ====================

    /**
     * 执行Shell命令（复用原有逻辑）
     */
    private String executeShellCommand(String[] command) {
        Process process = null;
        try {
            process = new ProcessBuilder(command).start();
            activeProcesses.add(process);

            // 读取输出
            BufferedReader outputReader = new BufferedReader(
                    new InputStreamReader(process.getInputStream()));
            BufferedReader errorReader = new BufferedReader(
                    new InputStreamReader(process.getErrorStream()));

            StringBuilder output = new StringBuilder();
            String line;
            while ((line = outputReader.readLine()) != null) {
                output.append(line).append("\n");
            }
            while ((line = errorReader.readLine()) != null) {
                output.append("[ERROR] ").append(line).append("\n");
            }

            int exitCode = process.waitFor();
            activeProcesses.remove(process);

            return "Exit Code: " + exitCode + "\n" + output.toString();

        } catch (Exception e) {
            Log.e(TAG, "Command execution failed: " + Arrays.toString(command), e);
            return "ERROR: " + e.getMessage();
        } finally {
            if (process != null) {
                process.destroy();
            }
        }
    }

    // ==================== 内部类：Socket桥接会话 ====================

    private static class SocketBridgeSession {
        private final String socketName;
        private final LocalSocket localSocket;
        private final ParcelFileDescriptor clientSocket;
        private final InputStream localInput, clientInput;
        private final OutputStream localOutput, clientOutput;
        private volatile boolean isRunning = true;

        SocketBridgeSession(String socketName, LocalSocket localSocket,
                            ParcelFileDescriptor clientSocket,
                            InputStream localInput, OutputStream localOutput,
                            InputStream clientInput, OutputStream clientOutput) {
            this.socketName = socketName;
            this.localSocket = localSocket;
            this.clientSocket = clientSocket;
            this.localInput = localInput;
            this.localOutput = localOutput;
            this.clientInput = clientInput;
            this.clientOutput = clientOutput;
        }

        void startForwarding() {
            // 启动两个方向的转发线程
            executor.execute(this::forwardLocalToClient);
            executor.execute(this::forwardClientToLocal);
        }

        private void forwardLocalToClient() {
            byte[] buffer = new byte[8192];
            try {
                int bytesRead;
                while (isRunning && (bytesRead = localInput.read(buffer)) != -1) {
                    if (bytesRead > 0) {
                        clientOutput.write(buffer, 0, bytesRead);
                        clientOutput.flush();
                    }
                }
            } catch (IOException e) {
                if (isRunning) {
                    Log.d(TAG, "Local->Client forwarding stopped for @" + socketName, e);
                }
            } finally {
                close();
            }
        }

        private void forwardClientToLocal() {
            byte[] buffer = new byte[8192];
            try {
                int bytesRead;
                while (isRunning && (bytesRead = clientInput.read(buffer)) != -1) {
                    if (bytesRead > 0) {
                        localOutput.write(buffer, 0, bytesRead);
                        localOutput.flush();
                    }
                }
            } catch (IOException e) {
                if (isRunning) {
                    Log.d(TAG, "Client->Local forwarding stopped for @" + socketName, e);
                }
            } finally {
                close();
            }
        }

        void close() {
            if (!isRunning) return;
            isRunning = false;

            try {
                localSocket.close();
            } catch (IOException ignored) {}

            try {
                clientSocket.close();
            } catch (IOException ignored) {}

            Log.i(TAG, "Bridge closed for @" + socketName);
        }
    }
}
