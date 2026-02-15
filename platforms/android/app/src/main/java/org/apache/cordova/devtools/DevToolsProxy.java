package org.apache.cordova.devtools;

import android.content.Context;
import android.os.ParcelFileDescriptor;

import com.widget.noname.util.ShizukuUtil;
import android.util.Log;
import java.io.*;
import java.net.*;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.concurrent.*;
import java.security.MessageDigest;
import java.util.Base64;

public class DevToolsProxy {
    private static final String TAG = "DevToolsProxy";

    private ServerSocket serverSocket;
    private final ExecutorService executor = Executors.newCachedThreadPool();
    private volatile boolean isRunning = false;
    private int proxyPort = 9222;
    private static final String kPageUrlPrefix = "/devtools/page/";
    private final Context context;
    private final Map<String, byte[]> assetCache = new ConcurrentHashMap<>();
    // 活动的 WebSocket 客户端（按 targetId）
    private final Map<String, Socket> activeWsClients = new ConcurrentHashMap<>();

    // MIME类型映射
    private static final Map<String, String> MIME_TYPES = new HashMap<>();
    static {
        MIME_TYPES.put("html", "text/html; charset=utf-8");
        MIME_TYPES.put("htm", "text/html; charset=utf-8");
        MIME_TYPES.put("css", "text/css; charset=utf-8");
        MIME_TYPES.put("js", "application/javascript; charset=utf-8");
        MIME_TYPES.put("mjs", "application/javascript; charset=utf-8");
        MIME_TYPES.put("json", "application/json; charset=utf-8");
        MIME_TYPES.put("png", "image/png");
        MIME_TYPES.put("jpg", "image/jpeg");
        MIME_TYPES.put("jpeg", "image/jpeg");
        MIME_TYPES.put("gif", "image/gif");
        MIME_TYPES.put("svg", "image/svg+xml");
        MIME_TYPES.put("ico", "image/x-icon");
        MIME_TYPES.put("txt", "text/plain; charset=utf-8");
        MIME_TYPES.put("xml", "application/xml; charset=utf-8");
        MIME_TYPES.put("wasm", "application/wasm");
    }

    // 构造器
    public DevToolsProxy(Context context) {
        this.context = context;
    }

    /**
     * 启动代理服务器
     */
    public void start(int port) {
        this.proxyPort = port;

        executor.execute(() -> {
            try {
                serverSocket = new ServerSocket(proxyPort);
                serverSocket.setReuseAddress(true);
                isRunning = true;

                Log.i(TAG, "🌐 WebView Debug Proxy Started on port " + proxyPort);
                Log.i(TAG, "📱 Open Chrome and visit: http://localhost:" + proxyPort);
                Log.i(TAG, "🔧 Or go to: chrome://inspect → Configure... → Add localhost:" + proxyPort);

                while (isRunning) {
                    try {
                        Socket clientSocket = serverSocket.accept();
                        clientSocket.setTcpNoDelay(true);
                        Log.d(TAG, "👤 New connection from: " +
                                clientSocket.getInetAddress().getHostAddress());

                        executor.execute(() -> handleClient(clientSocket));
                    } catch (SocketException e) {
                        if (isRunning) {
                            Log.d(TAG, "Server socket closed");
                        }
                    }
                }

            } catch (IOException e) {
                Log.e(TAG, "❌ Proxy server failed", e);
            } finally {
                Log.i(TAG, "Proxy server stopped");
            }
        });
    }

    /**
     * 处理客户端连接
     */
    private void handleClient(Socket clientSocket) {
        BufferedReader reader = null;
        OutputStream clientOutput = null;
        boolean websocketForwarding = false;

        try {
            reader = new BufferedReader(new InputStreamReader(clientSocket.getInputStream(), StandardCharsets.UTF_8));
            clientOutput = clientSocket.getOutputStream();

            // 1. 读取请求行
            String requestLine = reader.readLine();
            if (requestLine == null || requestLine.isEmpty()) {
                return;
            }

            Log.d(TAG, "Request: " + requestLine);

            // 2. 读取请求头
            Map<String, String> headers = new HashMap<>();
            String line;
            boolean isWebSocket = false;
            String secWebSocketKey = null;

            while ((line = reader.readLine()) != null && !line.isEmpty()) {
                int colonIndex = line.indexOf(':');
                if (colonIndex > 0) {
                    String key = line.substring(0, colonIndex).trim();
                    String value = line.substring(colonIndex + 1).trim();
                    headers.put(key, value);

                    if ("Upgrade".equalsIgnoreCase(key) && "websocket".equalsIgnoreCase(value)) {
                        isWebSocket = true;
                    }

                    if ("Sec-WebSocket-Key".equalsIgnoreCase(key) ||
                            "sec-websocket-key".equalsIgnoreCase(key)) {
                        secWebSocketKey = value;
                    }
                }
            }

            // 3. 根据请求类型分发处理
            String[] requestParts = requestLine.split(" ");
            if (requestParts.length < 2) {
                return;
            }

            String path = requestParts[1];

            if (isWebSocket) {
                // 为每个客户端动态建立一个到 WebView 的桥接（通过 Shizuku）
                ParcelFileDescriptor pfd = ShizukuUtil.startWebViewDebugging();
                if (pfd == null) {
                    sendErrorResponse(clientOutput, 502, "Bad Gateway");
                    return;
                }

                ParcelFileDescriptor.AutoCloseInputStream localWebViewIn = new ParcelFileDescriptor.AutoCloseInputStream(pfd);
                ParcelFileDescriptor.AutoCloseOutputStream localWebViewOut = new ParcelFileDescriptor.AutoCloseOutputStream(pfd);

                try {
                    websocketForwarding = handleWebSocketOverUnixSocket(clientSocket, requestLine, headers, secWebSocketKey, localWebViewIn, localWebViewOut);
                    if (websocketForwarding) {
                        // 转发已在异步线程中启动，不在此处关闭 clientSocket 或 pfd
                        return;
                    }
                } finally {
                    if (!websocketForwarding) {
                        try { localWebViewIn.close(); } catch (IOException ignored) {}
                        try { localWebViewOut.close(); } catch (IOException ignored) {}
                    }
                }
            } else if (path.startsWith("/serve_rev/") ||
                    path.contains("inspector.html") ||
                    path.contains("worker_app.html") ||
                    path.contains("js_app.html") ||
                    path.contains("node_app.html") ||
                    path.contains("web_app.html")) {
                // DevTools前端资源 - 从assets加载
                handleDevToolsFrontend(path, clientOutput);
            } else if (path.startsWith("/json")) {
                // JSON API请求 - 为该请求动态建立桥接并转发
                ParcelFileDescriptor pfd = ShizukuUtil.startWebViewDebugging();
                if (pfd == null) {
                    sendErrorResponse(clientOutput, 502, "Bad Gateway");
                    return;
                }

                ParcelFileDescriptor.AutoCloseInputStream localWebViewIn = new ParcelFileDescriptor.AutoCloseInputStream(pfd);
                ParcelFileDescriptor.AutoCloseOutputStream localWebViewOut = new ParcelFileDescriptor.AutoCloseOutputStream(pfd);

                try {
                    handleJsonApiRequest(clientSocket, requestLine, headers, reader, clientOutput, localWebViewIn, localWebViewOut);
                } finally {
                    try { localWebViewIn.close(); } catch (IOException ignored) {}
                    try { localWebViewOut.close(); } catch (IOException ignored) {}
                }
            } else {
                // 其他HTTP请求转发到Unix域Socket（为该请求动态建立桥接）
                ParcelFileDescriptor pfd = ShizukuUtil.startWebViewDebugging();
                if (pfd == null) {
                    sendErrorResponse(clientOutput, 502, "Bad Gateway");
                    return;
                }

                ParcelFileDescriptor.AutoCloseInputStream localWebViewIn = new ParcelFileDescriptor.AutoCloseInputStream(pfd);
                ParcelFileDescriptor.AutoCloseOutputStream localWebViewOut = new ParcelFileDescriptor.AutoCloseOutputStream(pfd);

                try {
                    forwardHttpToUnixSocket(clientSocket, requestLine, headers, reader, clientOutput, localWebViewIn, localWebViewOut);
                } finally {
                    try { localWebViewIn.close(); } catch (IOException ignored) {}
                    try { localWebViewOut.close(); } catch (IOException ignored) {}
                }
            }

        } catch (Exception e) {
            Log.e(TAG, "❌ Client handling error", e);
        } finally {
            if (!websocketForwarding) {
                try {
                    if (clientOutput != null) clientOutput.close();
                } catch (IOException ignored) {}
                try {
                    if (reader != null) reader.close();
                } catch (IOException ignored) {}
                try {
                    clientSocket.close();
                } catch (IOException ignored) {}
            }
        }
    }

    /**
     * 通过Unix域Socket处理WebSocket连接
     */
    private boolean handleWebSocketOverUnixSocket(Socket clientSocket, String requestLine,
                                               Map<String, String> headers,
                                               String secWebSocketKey,
                                               InputStream webViewInput,
                                               OutputStream webViewOutput) {
        Log.d(TAG, "=== WebSocket Connection Debug ===");
        Log.d(TAG, "Request line: " + requestLine);
        Log.d(TAG, "Headers count: " + headers.size());

        for (Map.Entry<String, String> entry : headers.entrySet()) {
            Log.d(TAG, "  " + entry.getKey() + ": " + entry.getValue());
        }

        try {
            // 1. 解析请求路径
            String[] requestParts = requestLine.split(" ");
            if (requestParts.length < 2) {
                Log.e(TAG, "Invalid request line format");
                throw new IOException("Invalid request line");
            }

            String method = requestParts[0];
            String path = requestParts[1];

            Log.d(TAG, "Parsed path: " + path);
            Log.d(TAG, "Expected prefix: " + kPageUrlPrefix);

            // 2. 检查路径格式
            if (!path.startsWith(kPageUrlPrefix)) {
                Log.e(TAG, "Path does not start with " + kPageUrlPrefix);
                throw new IOException("Invalid WebSocket path");
            }

            // 3. 提取target_id并做规范化（移除查询/片段与尾部斜杠）
            String targetIdRaw = path.substring(kPageUrlPrefix.length());
            String targetId = targetIdRaw;
            // 去掉 ? 或 # 及之后的内容
            int idxQuestion = targetId.indexOf('?');
            int idxHash = targetId.indexOf('#');
            int cutIdx = Integer.MAX_VALUE;
            if (idxQuestion >= 0) cutIdx = Math.min(cutIdx, idxQuestion);
            if (idxHash >= 0) cutIdx = Math.min(cutIdx, idxHash);
            if (cutIdx != Integer.MAX_VALUE) targetId = targetId.substring(0, cutIdx);
            // 去掉末尾的斜杠
            while (targetId.endsWith("/")) targetId = targetId.substring(0, targetId.length() - 1);

            Log.d(TAG, "Target ID raw: " + targetIdRaw + ", normalized: " + targetId);
            Log.d(TAG, "Active websocket targets before handshake: " + activeWsClients.keySet());

            // 如果已有针对该target的活动客户端，优先关闭它，避免两个DevTools前端并存导致“在另一个标签页中暂停”的提示
            try {
                Socket prev = activeWsClients.remove(targetId);
                if (prev != null) {
                    Log.i(TAG, "Found previous websocket client for target: " + targetId + " prev=" + prev + " closed=" + prev.isClosed());
                    try {
                        try { prev.shutdownInput(); } catch (Exception ignored) {}
                        try { prev.shutdownOutput(); } catch (Exception ignored) {}
                        prev.close();
                        Log.i(TAG, "Closed previous websocket client for target: " + targetId);
                    } catch (IOException e) {
                        Log.w(TAG, "Error closing previous websocket client for target: " + targetId, e);
                    }
                }
            } catch (Exception e) {
                Log.w(TAG, "Failed to close previous websocket client for target: " + targetId, e);
            }

            // 4. 构建转发请求
            StringBuilder requestBuilder = new StringBuilder();
            requestBuilder.append(method).append(" ").append(path).append(" HTTP/1.1\r\n");

            // 5. 构建请求头（根据Chromium源码）
            boolean hasConnection = false;
            boolean hasUpgrade = false;

            for (Map.Entry<String, String> entry : headers.entrySet()) {
                String key = entry.getKey();
                String value = entry.getValue();

                // 跳过某些可能引起问题的头部
                if ("Origin".equalsIgnoreCase(key) ||
                        "Sec-WebSocket-Extensions".equalsIgnoreCase(key) ||
                        "Sec-WebSocket-Key".equalsIgnoreCase(key)) {
                    Log.d(TAG, "Skipping header: " + key);
                    continue;
                }

                if ("Connection".equalsIgnoreCase(key) && "Upgrade".equalsIgnoreCase(value)) {
                    hasConnection = true;
                }

                if ("Upgrade".equalsIgnoreCase(key) && "websocket".equalsIgnoreCase(value)) {
                    hasUpgrade = true;
                }

                requestBuilder.append(key).append(": ").append(value).append("\r\n");
            }

            if (!hasConnection) {
                requestBuilder.append("Connection: Upgrade\r\n");
            }

            if (!hasUpgrade) {
                requestBuilder.append("Upgrade: websocket\r\n");
            }

            // 7. 必须包含Sec-WebSocket-Key
            if (secWebSocketKey != null) {
                requestBuilder.append("Sec-WebSocket-Key: ").append(secWebSocketKey).append("\r\n");
            } else {
                // 如果没有提供Key，生成一个
                String generatedKey = generateWebSocketKey();
                requestBuilder.append("Sec-WebSocket-Key: ").append(generatedKey).append("\r\n");
                Log.d(TAG, "Generated WebSocket Key: " + generatedKey);
            }

            requestBuilder.append("\r\n");

            // 8. 发送请求
            String wsRequest = requestBuilder.toString();
            Log.d(TAG, "Final WebSocket request to send:\n" + wsRequest);

            synchronized (webViewOutput) {
                webViewOutput.write(wsRequest.getBytes(StandardCharsets.UTF_8));
                webViewOutput.flush();
            }

            Log.d(TAG, "Request sent, waiting for response...");

            // 9. 读取完整响应
            byte[] responseBytes = readCompleteResponseFromUnixSocket(webViewInput, 5000);

            if (responseBytes == null || responseBytes.length == 0) {
                Log.e(TAG, "Empty response from WebView");
                throw new IOException("No response from WebView");
            }

            // ---- 关键修改：打印原始响应进行调试 ----
            String rawResponse = new String(responseBytes, StandardCharsets.UTF_8);
            Log.d(TAG, "=== RAW RESPONSE FROM WEBVIEW (Text) ===");
            Log.d(TAG, rawResponse);
            Log.d(TAG, "=== END RAW RESPONSE ===");

            // 10. 分析响应状态
            String[] responseLines = rawResponse.split("\r\n");
            if (responseLines.length > 0) {
                String statusLine = responseLines[0];
                Log.d(TAG, "Status line: " + statusLine);

                if (statusLine.contains("101")) {
                    Log.i(TAG, "✅ WebSocket handshake successful");

                    // ---- 关键修复：修正状态行 ----
                    // 将 "101 WebSocket Protocol Handshake" 替换为 "101 Switching Protocols"
                    String standardStatusLine = "HTTP/1.1 101 Switching Protocols";
                    String originalResponse = new String(responseBytes, StandardCharsets.UTF_8);

                    if (originalResponse.startsWith("HTTP/1.1 101 WebSocket Protocol Handshake")) {
                        Log.d(TAG, "⚠️  Fixing non-standard status line...");
                        // 替换第一行
                        String fixedResponse = standardStatusLine + originalResponse.substring(originalResponse.indexOf('\n'));
                        responseBytes = fixedResponse.getBytes(StandardCharsets.UTF_8);
                        Log.d(TAG, "Fixed response: " + fixedResponse.split("\r\n")[0]);
                    }
                    // ---- 修复结束 ----

                    // 转发（可能是修正后的）响应给客户端
                    OutputStream clientOutput = clientSocket.getOutputStream();
                    clientOutput.write(responseBytes);
                    clientOutput.flush();
                    Log.d(TAG, "Handshake response forwarded to client");

                    Log.d(TAG, "Starting WebSocket forwarding...");

                    // 将当前客户端注册为活动会话（用于在新会话到来时关闭旧会话）
                    activeWsClients.put(targetId, clientSocket);
                    Log.i(TAG, "Registered websocket client for target=" + targetId + " socket=" + clientSocket + " hash=" + System.identityHashCode(clientSocket));
                    Log.i(TAG, "activeWsClients: " + activeWsClients);

                    // 主动尝试清理可能残留的 paused 状态（向 WebView 注入一个被掩码的 Debugger.resume）
                    try {
                        String resumeJson = "{\"id\":-1,\"method\":\"Debugger.resume\"}";
                        sendMaskedWebSocketTextFrame(webViewOutput, resumeJson);
                        Log.i(TAG, "Sent Debugger.resume to WebView for target " + targetId + ": " + extractShortJson(resumeJson));
                    } catch (Exception e) {
                        Log.w(TAG, "Failed to send Debugger.resume to WebView for target " + targetId, e);
                    }

                    // 开始双向转发
                    startUnixSocketForwarding(clientSocket, webViewInput, webViewOutput, targetId);
                    return true;
                } else {
                    Log.e(TAG, "WebSocket handshake failed with status: " + statusLine);
                    // 转发原始错误响应
                    OutputStream clientOutput = clientSocket.getOutputStream();
                    clientOutput.write(responseBytes);
                    clientOutput.flush();
                    return false;
                }
            }

            Log.e(TAG, "WebSocket handshake failed");

            // 转发原始错误响应
            OutputStream clientOutput = clientSocket.getOutputStream();
            clientOutput.write(responseBytes);
            clientOutput.flush();
            return false;
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * 生成WebSocket Key
     */
    private String generateWebSocketKey() {
        byte[] randomBytes = new byte[16];
        new Random().nextBytes(randomBytes);
        return Base64.getEncoder().encodeToString(randomBytes);
    }

    /**
     * 从Unix域Socket读取完整响应
     */
    private byte[] readCompleteResponseFromUnixSocket(InputStream webViewInput, int timeoutMs) {
        ByteArrayOutputStream buffer = new ByteArrayOutputStream();
        byte[] data = new byte[4096];
        long startTime = System.currentTimeMillis();
        boolean headersComplete = false;
        int totalBytes = 0;

        Log.d(TAG, "Starting to read complete response, timeout: " + timeoutMs + "ms");

        try {
            while (System.currentTimeMillis() - startTime < timeoutMs) {
                int available = webViewInput.available();
                if (available > 0) {
                    int bytesToRead = Math.min(available, data.length);
                    int bytesRead = webViewInput.read(data, 0, bytesToRead);

                    if (bytesRead > 0) {
                        buffer.write(data, 0, bytesRead);
                        totalBytes += bytesRead;

                        // 检查响应头是否完整
                        if (!headersComplete) {
                            String currentResponse = buffer.toString(StandardCharsets.UTF_8.name());
                            int headerEnd = currentResponse.indexOf("\r\n\r\n");
                            if (headerEnd != -1) {
                                headersComplete = true;
                                Log.d(TAG, "Headers complete at position: " + headerEnd);

                                // 对于WebSocket握手响应，我们不需要Content-Length
                                // 101响应没有body，所以响应已经完整
                                if (currentResponse.contains("101")) {
                                    Log.d(TAG, "Found 101 response, returning complete response");
                                    return buffer.toByteArray();
                                }
                            }
                        }

                        // 短暂等待更多数据
                        Thread.sleep(10);
                    }

                    startTime = System.currentTimeMillis();
                } else {
                    // 没有数据，短暂等待
                    Thread.sleep(50);
                }

                // 如果已经收到一些数据但超时了，返回已接收的数据
                if (totalBytes > 0 && System.currentTimeMillis() - startTime > 100) {
                    Log.d(TAG, "Returning partial response after timeout");
                    return buffer.toByteArray();
                }
            }
        } catch (Exception e) {
            Log.e(TAG, "Error reading from Unix socket", e);
        }

        Log.w(TAG, "Timeout reading response, read " + totalBytes + " bytes");
        byte[] partial = buffer.toByteArray();
        if (partial.length > 0) {
            Log.d(TAG, "Returning partial response");
            return partial;
        }

        return new byte[0];
    }

    /**
     * 处理JSON API请求
     */
    private void handleJsonApiRequest(Socket clientSocket, String requestLine,
                                      Map<String, String> headers,
                                      BufferedReader reader,
                                      OutputStream clientOutput,
                                      InputStream webViewInput,
                                      OutputStream webViewOutput) throws IOException {
        forwardHttpToUnixSocket(clientSocket, requestLine, headers, reader, clientOutput, webViewInput, webViewOutput);
    }

    /**
     * 开始Unix域Socket的双向转发
     */
    private void startUnixSocketForwarding(Socket clientSocket, InputStream webViewInput, OutputStream webViewOutput, String targetId) {
        try {
            clientSocket.setTcpNoDelay(true);
            clientSocket.setSoTimeout(0);

            InputStream clientInput = clientSocket.getInputStream();
            OutputStream clientOutput = clientSocket.getOutputStream();

            final CountDownLatch latch = new CountDownLatch(2);

            // 客户端 -> Unix域Socket
            executor.execute(() -> {
                try {
                    byte[] buffer = new byte[8192];
                    int bytesRead;

                    while ((bytesRead = clientInput.read(buffer)) != -1) {
                        if (bytesRead > 0) {
                            synchronized (webViewOutput) {
                                webViewOutput.write(buffer, 0, bytesRead);
                                webViewOutput.flush();
                                // 只打印实际传递的内容（UTF-8字符串）
                                String content = new String(buffer, 0, bytesRead, StandardCharsets.UTF_8);
                                // Log.d(TAG, "Client->WebView (" + targetId + "): [" + content + "] (" + bytesRead + " bytes)");
                                // detect client commands related to debugger
                                if (content.contains("\"method\":\"Debugger.resume\"")) {
                                    Log.i(TAG, "Client->WebView: Debugger.resume for target " + targetId);
                                } else if (content.contains("\"method\":\"Debugger.enable\"")) {
                                    Log.i(TAG, "Client->WebView: Debugger.enable for target " + targetId);
                                }
                            }
                        }
                    }
                } catch (IOException e) {
                    Log.d(TAG, "Client -> WebView stream ended: " + e.getMessage());
                } finally {
                    latch.countDown();
                    try {
                        clientSocket.shutdownInput();
                    } catch (IOException ignored) {}
                }
            });

            // Unix域Socket -> 客户端
            executor.execute(() -> {
                try {
                    byte[] buffer = new byte[8192];
                    int bytesRead;

                    while ((bytesRead = webViewInput.read(buffer)) != -1) {
                        if (bytesRead > 0) {
                            clientOutput.write(buffer, 0, bytesRead);
                            clientOutput.flush();
                            // 只打印实际传递的内容（UTF-8字符串）
                            String content = new String(buffer, 0, bytesRead, StandardCharsets.UTF_8);
                            // Log.d(TAG, "WebView->Client (" + targetId + "): [" + content + "] (" + bytesRead + " bytes)");
                            if (content.contains("\"method\":\"Debugger.resume\"")) {
                                Log.i(TAG, "WebView->Client: Debugger.resume for target " + targetId);
                            } else if (content.contains("\"method\":\"Debugger.enable\"")) {
                                Log.i(TAG, "WebView->Client: Debugger.enable for target " + targetId);
                            } else if (content.contains("\"method\":\"Overlay.setPausedInDebuggerMessage\"")) {
                                Log.i(TAG, "WebView->Client: Overlay.setPausedInDebuggerMessage for target " + targetId);
                            } else if (content.contains("\"method\":\"Debugger.paused\"")) {
                                Log.i(TAG, "WebView->Client: Debugger.paused detected for target " + targetId);
                                // 构建注入的 CDP 消息
//                                try {
//                                    int injectId = Math.abs(new Random().nextInt());
//                                    String injectJson = "{\"id\":" + injectId + ",\"method\":\"Overlay.setPausedInDebuggerMessage\",\"params\":{\"message\":\"已在调试程序中暂停\"}}";
//                                    Log.i(TAG, "Injecting Overlay.setPausedInDebuggerMessage to WebView for target " + targetId + ": " + extractShortJson(injectJson));
//                                    sendMaskedWebSocketTextFrame(webViewOutput, injectJson);
//                                    Log.i(TAG, "Injection complete for target " + targetId + " id=" + injectId);
//                                } catch (Exception e) {
//                                    Log.e(TAG, "Failed to inject paused-overlay message", e);
//                                }
                            }
                        }
                    }
                } catch (IOException e) {
                    Log.d(TAG, "WebView -> Client stream ended: " + e.getMessage());
                } finally {
                    latch.countDown();
                    try {
                        clientSocket.shutdownOutput();
                    } catch (IOException ignored) {}
                }
            });

            // 等待两个方向都完成
            executor.execute(() -> {
                try {
                    latch.await();
                    clientSocket.close();
                    Log.d(TAG, "WebSocket connection closed");
                } catch (Exception e) {
                    Log.e(TAG, "Error waiting for streams", e);
                } finally {
                    // 确保从活动会话映射中移除，无论正常结束还是异常
                    try {
                        Socket removed = activeWsClients.remove(targetId);
                        Log.i(TAG, "Removed websocket client for target " + targetId + ": " + removed);
                    } catch (Exception ignored) {}

                    // 关闭与WebView的流，通知service端关闭桥接
                    try { webViewInput.close(); } catch (IOException ignored) {}
                    try { webViewOutput.close(); } catch (IOException ignored) {}
                }
            });

        } catch (Exception e) {
            Log.e(TAG, "Failed to start WebSocket forwarding", e);
            try {
                clientSocket.close();
            } catch (IOException ignored) {}
            try { activeWsClients.remove(targetId); } catch (Exception ignored) {}
        }
    }

    // Extract a short JSON snippet for log (avoid huge payloads)
    private String extractShortJson(String s) {
        try {
            int start = s.indexOf('{');
            int end = s.lastIndexOf('}');
            if (start != -1 && end != -1 && end > start) {
                String sub = s.substring(start, end + 1);
                if (sub.length() > 300) return sub.substring(0, 300) + "...";
                return sub;
            }
        } catch (Exception ignored) {}
        return "";
    }

    /**
     * 发送一个被掩码的 WebSocket 文本帧（用于客户端->服务器）
     */
    private void sendMaskedWebSocketTextFrame(OutputStream out, String text) throws IOException {
        if (out == null || text == null) return;
        byte[] payload = text.getBytes(StandardCharsets.UTF_8);

        // 构造帧头
        ByteArrayOutputStream header = new ByteArrayOutputStream();
        // FIN = 1, opcode = 0x1 (text)
        header.write(0x81);

        int payloadLen = payload.length;
        if (payloadLen <= 125) {
            header.write(0x80 | payloadLen); // MASK bit set
        } else if (payloadLen <= 0xFFFF) {
            header.write(0x80 | 126);
            header.write((payloadLen >> 8) & 0xFF);
            header.write(payloadLen & 0xFF);
        } else {
            header.write(0x80 | 127);
            // 8 bytes length
            for (int i = 7; i >= 0; --i) {
                header.write((payloadLen >> (8 * i)) & 0xFF);
            }
        }

        // 生成掩码
        byte[] mask = new byte[4];
        new Random().nextBytes(mask);
        header.write(mask);

        // 掩码并写出payload
        byte[] masked = new byte[payloadLen];
        for (int i = 0; i < payloadLen; i++) {
            masked[i] = (byte) (payload[i] ^ mask[i % 4]);
        }

        synchronized (out) {
            out.write(header.toByteArray());
            if (payloadLen > 0) out.write(masked);
            out.flush();
        }
    }

    /**
     * 转发HTTP请求到Unix域Socket
     */
    private void forwardHttpToUnixSocket(Socket clientSocket, String requestLine,
                                         Map<String, String> headers,
                                         BufferedReader reader,
                                         OutputStream clientOutput,
                                         InputStream webViewInput,
                                         OutputStream webViewOutput) throws IOException {
        try {
            // 1. 构建完整请求
            StringBuilder requestBuilder = new StringBuilder();
            requestBuilder.append(requestLine).append("\r\n");

            // 修改Host头为localhost（无端口）
            for (Map.Entry<String, String> entry : headers.entrySet()) {
                String key = entry.getKey();
                String value = entry.getValue();

                if ("Host".equalsIgnoreCase(key) && value.contains(":")) {
                    value = value.substring(0, value.indexOf(':'));
                }

                requestBuilder.append(key).append(": ").append(value).append("\r\n");
            }

            requestBuilder.append("\r\n");

            // 2. 发送到Unix域Socket
            synchronized (webViewOutput) {
                webViewOutput.write(requestBuilder.toString().getBytes(StandardCharsets.UTF_8));
                webViewOutput.flush();
            }

            // 3. 读取响应并转发
            byte[] response = readCompleteResponseFromUnixSocket(webViewInput, 10000);
            if (response != null && response.length > 0) {
                clientOutput.write(response);
                clientOutput.flush();
            } else {
                sendErrorResponse(clientOutput, 504, "Gateway Timeout");
            }

        } catch (Exception e) {
            Log.e(TAG, "Failed to forward HTTP to Unix Socket", e);
            sendErrorResponse(clientOutput, 500, "Internal Server Error");
        }
    }

    /**
     * 处理DevTools前端资源
     */
    private void handleDevToolsFrontend(String path, OutputStream output) throws IOException {
        try {
            // 处理serve_rev/@hash/路径
            String assetPath = path;
            if (path.startsWith("/serve_rev/@")) {
                int hashEnd = path.indexOf('/', 12);
                if (hashEnd != -1) {
                    assetPath = path.substring(hashEnd);
                }
            }

            if (assetPath.startsWith("/")) {
                assetPath = assetPath.substring(1);
            }

            if (assetPath.isEmpty() || assetPath.equals("devtools-frontend")) {
                assetPath = "devtools-frontend/inspector.html";
            }

            if (!assetPath.startsWith("devtools-frontend/")) {
                assetPath = "devtools-frontend/" + assetPath;
            }

            Log.d(TAG, "Loading asset: " + assetPath);

            byte[] content = loadAsset(assetPath);
            String mimeType = getMimeType(path);

            String response = "HTTP/1.1 200 OK\r\n" +
                    "Content-Type: " + mimeType + "\r\n" +
                    "Content-Length: " + content.length + "\r\n" +
                    "Access-Control-Allow-Origin: *\r\n" +
                    "Connection: close\r\n" +
                    "\r\n";

            output.write(response.getBytes(StandardCharsets.UTF_8));
            output.write(content);
            output.flush();

        } catch (FileNotFoundException e) {
            Log.e(TAG, "Asset not found: " + path);
            sendNotFound(output);
        } catch (Exception e) {
            Log.e(TAG, "Failed to handle DevTools frontend: " + path, e);
            sendServerError(output);
        }
    }

    /**
     * 从assets加载文件
     */
    private byte[] loadAsset(String assetPath) throws IOException {
        if (assetCache.containsKey(assetPath)) {
            return assetCache.get(assetPath);
        }

        InputStream is = context.getAssets().open(assetPath);
        byte[] content = readAllBytes(is);
        assetCache.put(assetPath, content);
        return content;
    }

    /**
     * 发送错误响应
     */
    private void sendErrorResponse(OutputStream output, int code, String message) throws IOException {
        String response = "HTTP/1.1 " + code + " " + message + "\r\n" +
                "Content-Length: 0\r\n" +
                "Connection: close\r\n" +
                "\r\n";
        output.write(response.getBytes(StandardCharsets.UTF_8));
        output.flush();
    }

    private void sendNotFound(OutputStream output) throws IOException {
        sendErrorResponse(output, 404, "Not Found");
    }

    private void sendServerError(OutputStream output) throws IOException {
        sendErrorResponse(output, 500, "Internal Server Error");
    }

    /**
     * 获取MIME类型
     */
    private String getMimeType(String filename) {
        String extension = "";
        int dotIndex = filename.lastIndexOf('.');
        if (dotIndex > 0 && dotIndex < filename.length() - 1) {
            extension = filename.substring(dotIndex + 1).toLowerCase();
        }
        return MIME_TYPES.getOrDefault(extension, "application/octet-stream");
    }

    /**
     * 读取InputStream中的所有字节
     */
    public static byte[] readAllBytes(InputStream inputStream) throws IOException {
        if (inputStream == null) {
            return new byte[0];
        }

        ByteArrayOutputStream buffer = new ByteArrayOutputStream();
        byte[] data = new byte[8192];
        int bytesRead;

        while ((bytesRead = inputStream.read(data, 0, data.length)) != -1) {
            buffer.write(data, 0, bytesRead);
        }

        return buffer.toByteArray();
    }

    /**
     * 停止代理服务器
     */
    public void stop() {
        isRunning = false;
        try {
            if (serverSocket != null && !serverSocket.isClosed()) {
                serverSocket.close();
            }
        } catch (IOException e) {
            Log.e(TAG, "Error stopping server", e);
        }

        executor.shutdown();
        try {
            if (!executor.awaitTermination(5, TimeUnit.SECONDS)) {
                executor.shutdownNow();
            }
        } catch (InterruptedException e) {
            executor.shutdownNow();
        }

        Log.i(TAG, "🛑 Proxy server stopped");
    }

    public int getPort() {
        return proxyPort;
    }

    public boolean isRunning() {
        return isRunning;
    }
}