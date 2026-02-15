package org.apache.cordova.devtools;

import android.app.ActivityManager;
import android.content.Context;
import android.os.Build;
import android.util.Log;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.widget.noname.Settings;

import org.apache.cordova.CordovaPlugin;

import java.io.IOException;
import java.net.ConnectException;
import java.net.SocketTimeoutException;
import android.content.Intent;

import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

public class Devtools extends CordovaPlugin {
    private static final String TAG = "CordovaDevtoolsPlugin";

    // 线程管理
    private final ExecutorService executor = Executors.newCachedThreadPool();

    // 状态
    private Integer debugPort = 9222;
    private Context context;
    private DevToolsProxy proxy;
    
    @Override
    protected void pluginInitialize() {
        context = cordova.getContext();
        if (!isDebugging()) startDebugging();
    }

    @Override
    public Object onMessage(String id, Object data) {
        if (id.equals("onPageFinished") && Settings.getDebugMode()) {
            openDebugPage();
        }
        return null;
    }

    @Override
    public void onDestroy() {
        if (isDebugging()) {
            stopDebugging();
        }
        executor.shutdown();
    }

    /**
     * 检查是否正在调试
     */
    public boolean isDebugging() {
        return proxy != null && proxy.isRunning();
    }

    private void startDebugging() {
        try {
            // 不在此处创建全局桥接；每个客户端连接时由代理动态创建桥接
            proxy = new DevToolsProxy(context);
            proxy.start(debugPort);
        } catch (Exception e) {
            Log.i(TAG, e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * 停止调试
     */
    private void stopDebugging() {
        if (proxy != null && proxy.isRunning()) {
            proxy.stop();
            proxy = null;
            Log.i(TAG, "WebView debugging stopped");
        }
    }

    private void openDebugPage() {
        executor.execute(() -> {
            try {
                // 后台线程执行网络请求和JSON解析
                String jsonStr = fetchJsonWithOkHttp();
                if (jsonStr == null || jsonStr.isEmpty()) {
                    throw new RuntimeException("Empty response from proxy");
                }
                Log.e(TAG, "jsonStr: " + jsonStr);
                JSONArray jsonArray = JSONArray.parseArray(jsonStr);
                // webView.getUrl()需要ui线程
                cordova.getActivity().runOnUiThread(() -> {
                    if (!jsonArray.isEmpty()) {
                        boolean findPage = false;
                        String currentUrl = webView.getUrl();
                        // Try to find a best match for the main page. Filter noisy entries like "DevTools Performance Metrics".
                        for (int i = 0; i < jsonArray.size(); i++) {
                            JSONObject page = jsonArray.getJSONObject(i);
                            String type = page.getString("type");
                            if (type == null || !type.equals("page")) {
                                continue;
                            }

                            String title = page.getString("title");
                            if (title != null && title.toLowerCase().contains("devtools performance metrics")) {
                                // skip these noisy performance targets
                                continue;
                            }

                            String pageUrl = page.getString("url");
                            if (pageUrl == null || pageUrl.isEmpty()) continue;

                            boolean match = false;
                            try {
                                if (currentUrl != null) {
                                    // Allow exact match or prefix match to tolerate query/hash differences
                                    if (currentUrl.equals(pageUrl) || currentUrl.startsWith(pageUrl) || pageUrl.startsWith(currentUrl)) {
                                        match = true;
                                    } else {
                                        // As a fallback, compare host+path if possible
                                        if (currentUrl.contains("://") && pageUrl.contains("://")) {
                                            String curNoProto = currentUrl.substring(currentUrl.indexOf("://") + 3);
                                            String pageNoProto = pageUrl.substring(pageUrl.indexOf("://") + 3);
                                            if (curNoProto.startsWith(pageNoProto) || pageNoProto.startsWith(curNoProto)) match = true;
                                        }
                                    }
                                }
                            } catch (Exception ignored) {}

                            if (match) {
                                findPage = true;
                                final String webSocketUrl = page.getString("webSocketDebuggerUrl");
                                final String devtoolsFrontendUrl = page.getString("devtoolsFrontendUrl");
                                // Fix swapped logging (log correct values)
                                Log.e(TAG, "webSocketUrl URL: " + rewriteUrlPortSimple(webSocketUrl, debugPort));
                                Log.e(TAG, "devtoolsFrontendUrl URL: " + rewriteUrlPortSimple(devtoolsFrontendUrl, debugPort));

                                // Launch DevTools Activity in separate process so frontend runs outside of WebView renderer
                                try {
                                    String rewrittenFrontend = rewriteUrlPortSimple(devtoolsFrontendUrl, debugPort);
                                    String rewrittenWs = rewriteUrlPortSimple(webSocketUrl, debugPort);

                                    Intent serviceIntent = new Intent(cordova.getActivity(), DevToolsWindowService.class);
                                    serviceIntent.putExtra("devtoolsFrontendUrl", rewrittenFrontend);
                                    serviceIntent.putExtra("webSocketDebuggerUrl", rewrittenWs);
                                    // 启动 Service（会在 :devtools 进程中运行）
                                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                                        cordova.getActivity().startForegroundService(serviceIntent);
                                    } else {
                                        cordova.getActivity().startService(serviceIntent);
                                    }
                                    Log.i(TAG, "启动调试悬浮窗Service: " + rewrittenFrontend);
                                } catch (Exception e) {
                                    Log.w(TAG, "Failed to start DevtoolsActivity, falling back to float window", e);
                                }
                                break;
                            }
                        }
                        if (!findPage) {
                            Log.e(TAG, "Failed to find page");
                        }
                    }
                });
            } catch (Exception e) {
                Log.e(TAG, "Failed to open debug page", e);
            }
        });
    }

    /**
     * 重写URL中的端口号
     */
    private String rewriteUrlPortSimple(String url, int newPort) {
        if (url == null || url.isEmpty()) {
            return url;
        }

        // 1. 处理webSocketDebuggerUrl
        if (url.startsWith("ws://localhost/")) {
            // 添加端口号
            return "ws://localhost:" + newPort + url.substring("ws://localhost".length());
        }
        else if (url.startsWith("ws://localhost:")) {
            // 替换已有的端口号
            int portStart = url.indexOf(":", 5); // "ws://".length = 5
            int portEnd = url.indexOf("/", portStart);
            if (portEnd != -1) {
                return url.substring(0, portStart + 1) + newPort + url.substring(portEnd);
            }
        }

        // 2. 处理devtoolsFrontendUrl中的ws参数
        if (url.contains("ws=localhost/")) {
            return url.replace("ws=localhost/", "ws=localhost:" + newPort + "/");
        }
        else if (url.contains("ws=localhost:")) {
            // 找到ws参数的位置
            int wsIndex = url.indexOf("ws=localhost:");
            if (wsIndex != -1) {
                int paramStart = wsIndex + "ws=localhost:".length();
                int paramEnd = url.indexOf("/", paramStart);
                if (paramEnd != -1) {
                    // 提取端口号部分
                    String portStr = url.substring(paramStart, paramEnd);
                    try {
                        // 尝试解析端口号，如果是数字就替换
                        Integer.parseInt(portStr);
                        // 替换端口号
                        return url.substring(0, paramStart) + newPort + url.substring(paramEnd);
                    } catch (NumberFormatException e) {
                        // 不是有效的端口号，不做修改
                    }
                }
            }
        }

        return url;
    }

    private String fetchJsonWithOkHttp() {
        OkHttpClient client = new OkHttpClient.Builder()
                .connectTimeout(5, TimeUnit.SECONDS)
                .readTimeout(10, TimeUnit.SECONDS)
                .writeTimeout(5, TimeUnit.SECONDS)
                .build();

        Request request = new Request.Builder()
                .url("http://localhost:" + proxy.getPort() + "/json")
                .addHeader("Accept", "application/json")
                .addHeader("User-Agent", "WebViewDebugProxy/1.0")
                .addHeader("Connection", "close")  // 确保连接关闭
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (response.isSuccessful() && response.body() != null) {
                String jsonStr = response.body().string();
                Log.d(TAG, "Proxy response: " + jsonStr);
                return jsonStr;
            } else {
                Log.e(TAG, "HTTP error: " + response.code() + " " + response.message());
                return null;
            }
        } catch (SocketTimeoutException e) {
            Log.e(TAG, "Proxy connection timeout");
        } catch (ConnectException e) {
            Log.e(TAG, "Cannot connect to proxy at port " + proxy.getPort());
        } catch (IOException e) {
            Log.e(TAG, "IO error connecting to proxy", e);
        } catch (Exception e) {
            Log.e(TAG, "Unexpected error", e);
        }

        return null;
    }
}
