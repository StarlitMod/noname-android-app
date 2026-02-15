package com.widget.noname.util;

import static com.kongzue.dialogx.dialogs.PopTip.tip;

import android.content.ComponentName;
import android.content.Context;
import android.content.ServiceConnection;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.os.IBinder;
import android.os.ParcelFileDescriptor;
import android.os.RemoteException;
import android.util.Log;

import com.widget.noname.IUserService;
import com.widget.noname.UserService;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import rikka.shizuku.Shizuku;

public class ShizukuUtil {
    private static final String TAG = "ShizukuUtil";

    private static IUserService iUserService;

    public final static int SHIZUKU_PERMISSION_CODE = 10001;

    public interface ShizukuServiceCallback {
        void OnRequestPermissionResult(boolean granted);
        void onServiceConnected();
        void onServiceDisconnected();
    }

    private final static ArrayList<ShizukuServiceCallback> callbacks = new ArrayList<>();

    public static void registerServiceConnection(ShizukuServiceCallback callback) {
        callbacks.add(callback);
    }

    public static void unregisterServiceConnection(ShizukuServiceCallback callback) {
        callbacks.remove(callback);
    }

    private static Shizuku.UserServiceArgs userServiceArgs;

    private static final ServiceConnection shizukuServiceConnection = new ServiceConnection() {
        @Override
        public void onServiceConnected(ComponentName componentName, IBinder iBinder) {
            // Shizuku服务连接成功
            if (iBinder != null && iBinder.pingBinder()) {
                tip("Shizuku服务已连接").iconSuccess().show();
                iUserService = IUserService.Stub.asInterface(iBinder);

                // 创建副本避免并发修改异常
                ArrayList<ShizukuServiceCallback> callbacksCopy;
                synchronized (callbacks) {
                    callbacksCopy = new ArrayList<>(callbacks);
                }
                for (ShizukuServiceCallback callback : callbacksCopy) {
                    callback.onServiceConnected();
                }
            }
        }

        @Override
        public void onServiceDisconnected(ComponentName componentName) {
            // Shizuku服务连接断开
            tip("Shizuku服务已断开").iconError().show();
            iUserService = null;
            // 创建副本避免并发修改异常
            ArrayList<ShizukuServiceCallback> callbacksCopy;
            synchronized (callbacks) {
                callbacksCopy = new ArrayList<>(callbacks);
            }
            for (ShizukuServiceCallback callback : callbacksCopy) {
                callback.onServiceDisconnected();
            }
        }
    };

    public static void initShizuku(Context context) {
        PackageInfo packageInfo;
        try {
            packageInfo = context.getPackageManager().getPackageInfo(context.getPackageName(), 0);

            userServiceArgs = new Shizuku.UserServiceArgs(new ComponentName(context.getPackageName(), UserService.class.getName()))
                    .daemon(false)
                    .processNameSuffix("adb_service")
                    .debuggable((context.getApplicationInfo().flags & ApplicationInfo.FLAG_DEBUGGABLE) != 0)
                    .version(packageInfo.versionCode);

        }
        catch (PackageManager.NameNotFoundException e) {
            userServiceArgs = new Shizuku.UserServiceArgs(new ComponentName(context.getPackageName(), UserService.class.getName()))
                    .daemon(false)
                    .processNameSuffix("adb_service")
                    .debuggable((context.getApplicationInfo().flags & ApplicationInfo.FLAG_DEBUGGABLE) != 0)
                    .version(10000);
        }

        // 添加权限申请监听
        Shizuku.addRequestPermissionResultListener(REQUEST_PERMISSION_RESULT_LISTENER);

        // Shizuku服务启动时调用该监听
        Shizuku.addBinderReceivedListenerSticky(onBinderReceivedListener);

        // Shizuku服务终止时调用该监听
        Shizuku.addBinderDeadListener(onBinderDeadListener);

        try {
            Shizuku.bindUserService(userServiceArgs, shizukuServiceConnection);
        } catch (Exception e) {
            e.printStackTrace();
            // tip("Shizuku服务绑定失败，请手动允许").iconError().show();
        }
    }

    public static void destroyShizuku() {
        // 移除权限申请监听
        Shizuku.removeRequestPermissionResultListener(REQUEST_PERMISSION_RESULT_LISTENER);

        // 移除 Shizuku 服务启动时调用的监听
        Shizuku.removeBinderReceivedListener(onBinderReceivedListener);

        // 移除 Shizuku 服务终止时调用的监听
        Shizuku.removeBinderDeadListener(onBinderDeadListener);

        try {
            Shizuku.unbindUserService(userServiceArgs, shizukuServiceConnection, true);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static boolean checkPermission() {
        try {
            if (Shizuku.isPreV11()) {
                // Pre-v11 is unsupported
                return false;
            }

            if (Shizuku.checkSelfPermission() == PackageManager.PERMISSION_GRANTED) {
                // Granted
                return true;
            }
            else if (Shizuku.shouldShowRequestPermissionRationale()) {
                return false;
            }
        } catch (Exception e) {

        }
        return false;
    }

    public static boolean checkPermission(boolean bool) {
        try {
            if (Shizuku.isPreV11()) {
                // Pre-v11 is unsupported
                tip("当前Shizuku版本不支持动态申请权限").iconError().show();
                return false;
            }

            if (Shizuku.checkSelfPermission() == PackageManager.PERMISSION_GRANTED) {
                // Granted
                return true;
            }
            else if (Shizuku.shouldShowRequestPermissionRationale()) {
                tip("权限申请被用户永久拒绝").iconError().show();
                return false;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    /**
     * 动态申请Shizuku adb shell权限
     */
    public static void requestShizukuPermission() {
       try {
           if (Shizuku.isPreV11()) {
               return;
           }
           if (Shizuku.shouldShowRequestPermissionRationale()) {
               return;
           }
           // 动态申请权限
           tip("正在申请Shizuku权限").show();
           Shizuku.requestPermission(SHIZUKU_PERMISSION_CODE);
       } catch (Exception e) {
           e.printStackTrace();
           tip("Shizuku权限申请失败，请检查Shizuku是否启动").iconError().show();
       }
    }

    private static final Shizuku.OnRequestPermissionResultListener REQUEST_PERMISSION_RESULT_LISTENER = (int requestCode, int grantResult) -> {
        // 是否授予权限
        boolean granted = grantResult == PackageManager.PERMISSION_GRANTED;
        if (granted) {
            tip("Shizuku权限申请成功").iconSuccess().show();
            try {
                Shizuku.bindUserService(userServiceArgs, shizukuServiceConnection);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        else {
            tip("Shizuku权限申请失败").iconError().show();
        }
        // 创建副本避免并发修改异常
        ArrayList<ShizukuServiceCallback> callbacksCopy;
        synchronized (callbacks) {
            callbacksCopy = new ArrayList<>(callbacks);
        }
        for (ShizukuServiceCallback callback : callbacksCopy) {
            callback.OnRequestPermissionResult(granted);
        }
    };

    private static final Shizuku.OnBinderReceivedListener onBinderReceivedListener = () -> {};

    private static final Shizuku.OnBinderDeadListener onBinderDeadListener = () -> {};

    public static boolean isDirectory(String path) throws RemoteException {
        String command = exec("ls -ld \"" + path.replace("\"", "\\\"") + "\" 2>/dev/null");
        if (!command.isEmpty()) {
            char firstChar = command.trim().charAt(0);
            if (firstChar == 'd') return true;
        }

        String command2 = exec("stat -c %F \"" + path.replace("\"", "\\\"") + "\" 2>/dev/null");
        return command2.contains("directory");
    }

    public static boolean isFile(String path) throws RemoteException {
        String command = exec("ls -ld \"" + path.replace("\"", "\\\"") + "\" 2>/dev/null");
        if (!command.isEmpty()) {
            char firstChar = command.trim().charAt(0);
            if (firstChar == '-') return true;
        }

        String command2 = exec("stat -c %F \"" + path.replace("\"", "\\\"") + "\" 2>/dev/null");
        return command2.contains("regular file");
    }

    public static String exec(String command) throws RemoteException {
        if (iUserService == null) {
            Log.e("shizuku", "iUserService is null");
            return "";
        }
        // Log.e("shizuku", "command: " + command);
        // 检查是否存在包含任意内容的双引号
        Pattern pattern = Pattern.compile("\"([^\"]*)\"");
        Matcher matcher = pattern.matcher(command);

        // 下面展示了两种不同的命令执行方法
        if (matcher.find()) {
            ArrayList<String> list = new ArrayList<>();
            Pattern pattern2 = Pattern.compile("\"([^\"]*)\"|(\\S+)");
            Matcher matcher2 = pattern2.matcher(command);

            while (matcher2.find()) {
                if (matcher2.group(1) != null) {
                    // 如果是引号包裹的内容，取group(1)
                    list.add(matcher2.group(1));
                } else {
                    // 否则取group(2)，即普通的单词
                    list.add(matcher2.group(2));
                }
            }

            // 这种方法可用于执行路径中带空格的命令，例如 ls /storage/0/emulated/temp dir/
            // 当然也可以执行不带空格的命令，实际上是要强于另一种执行方式的
            // Log.e("shizuku", "使用execArr" + list);
            String result = iUserService.execArr(list.toArray(new String[0]));
            // Log.e("shizuku", "result: " + result);
            return result;
        } else {
            // 这种方法仅用于执行路径中不包含空格的命令，例如 ls /storage/0/emulated/
            // Log.e("shizuku", "使用execLine" + command);
            String result = iUserService.execLine(command);
            // Log.e("shizuku", "result: " + result);
            return result;
        }
    }

    public static ParcelFileDescriptor startWebViewDebugging() {
        try {
            // 1. 获取Socket并建立桥接
            List<String> sockets = iUserService.getRemoteDevtoolsList();

            if (sockets.isEmpty()) {
                Log.i(TAG, "sockets is empty");
                return null;
            }

            // 获取当前App的PID
            int myPid = android.os.Process.myPid();
            // 筛选出属于本App的WebView
            List<String> myAppSockets = new ArrayList<>();
            for (String socket : sockets) {
                Log.d(TAG, "检查Socket: " + socket);
                // 尝试从socket名称中提取PID
                // 格式：webview_devtools_remote_<PID>
                if (socket.startsWith("webview_devtools_remote_")) {
                    try {
                        String pidStr = socket.substring("webview_devtools_remote_".length());
                        int socketPid = Integer.parseInt(pidStr);

                        if (socketPid == myPid) {
                            myAppSockets.add(socket);
                        }
                    } catch (NumberFormatException e) {
                        Log.w(TAG, "无法解析PID从socket: " + socket);
                    }
                }
            }

            if (myAppSockets.isEmpty()) {
                Log.i(TAG, "sockets is empty");
                return null;
            }

            // 2. 建立桥接
            ParcelFileDescriptor[] socketPair = ParcelFileDescriptor.createSocketPair();
            ParcelFileDescriptor appSide = socketPair[0];
            ParcelFileDescriptor serviceSide = socketPair[1];

            iUserService.bindLocalSocketBridge(myAppSockets.get(0), serviceSide);

            return appSide;

        } catch (Exception e) {
            Log.e(TAG, "Error", e);
            return null;
        }
    }
}
