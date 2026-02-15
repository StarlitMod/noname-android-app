package org.apache.cordova.devtools;

import android.annotation.SuppressLint;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.res.AssetManager;
import android.graphics.PixelFormat;
import android.os.Build;
import android.os.IBinder;
import android.util.DisplayMetrics;
import android.util.Log;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.view.inspector.WindowInspector;
import android.webkit.MimeTypeMap;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.core.app.NotificationCompat;
import androidx.webkit.WebViewAssetLoader;

import com.widget.noname.R;

import java.io.InputStream;
import java.util.List;

public class DevToolsWindowService extends Service {
    private static final String TAG = "DevToolsWindowService";

    // WindowManager相关
    private static WindowManager windowManager;
    private static WindowManager.LayoutParams params;
    private static FrameLayout floatView;

    // UI组件
    private static LinearLayout devtoolsWindow;
    private static View titleBar;
    private static WebView debugWebView;
    private static WebView popupWebView;
    private static View resizeHandle;

    // 调试信息
    private static String webSocketDebuggerUrl;
    private static String devtoolsFrontendUrl;

    // 窗口尺寸和位置
    private static int screenWidth;
    private static int screenHeight;
    private static int normalWidth;
    private static int normalHeight;

    // 拖动相关变量
    private static boolean isDragging = false;
    private static boolean isResizing = false;

    // 通知相关
    private static final int NOTIFICATION_ID = 1001;
    private static final String CHANNEL_ID = "devtools_channel";
    private static final String CHANNEL_NAME = "WebView调试工具";

    // 单例控制
    private static boolean isServiceRunning = false;

    @Override
    public void onCreate() {
        super.onCreate();
        Log.d(TAG, "DevToolsWindowService onCreate, 进程: " + getProcessName());

        // 创建通知渠道（Android 8.0+）
        createNotificationChannel();

        // 启动为前台服务
        startAsForegroundService();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        Log.d(TAG, "onStartCommand called");

        // 更新通知
        updateNotification();

        // 读取Intent数据
        if (intent != null) {
            webSocketDebuggerUrl = intent.getStringExtra("webSocketDebuggerUrl");
            devtoolsFrontendUrl = intent.getStringExtra("devtoolsFrontendUrl");
            Log.d(TAG, "Received debug URLs - frontend: " + devtoolsFrontendUrl + ", ws: " + webSocketDebuggerUrl);
        } else {
            Log.w(TAG, "No intent data received, stopping service");
            try {
                stopSelf();
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
            return START_NOT_STICKY;
        }

        // 检查窗口是否存在
        boolean windowExists = isWindowReallyShowing();

        if (!windowExists) {
            // 窗口不存在，创建新窗口
            Log.d(TAG, "Window does not exist, creating new one");
            showFloatingWindow();
        } else {
            // 窗口已存在，只更新 URL 并重新加载页面
            Log.d(TAG, "Window already exists, updating content");
        }

        loadDebugPage();

        // 标记为运行中
        isServiceRunning = true;

        return START_NOT_STICKY; // 改为非粘性，避免自动重启
    }

    /**
     * 清理资源
     */
    private void cleanupResources() {
        try {
            removeFloatingWindow();
            // 重置静态变量
            windowManager = null;
            params = null;
        } catch (Exception e) {
            Log.e(TAG, "清理资源时出错", e);
        }
    }

    /**
     * 创建通知渠道
     */
    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                    CHANNEL_ID,
                    CHANNEL_NAME,
                    NotificationManager.IMPORTANCE_LOW
            );
            channel.setDescription("WebView调试工具运行中");
            channel.setShowBadge(false);

            NotificationManager manager = getSystemService(NotificationManager.class);
            if (manager != null) {
                manager.createNotificationChannel(channel);
            }
        }
    }

    /**
     * 启动为前台服务
     */
    private void startAsForegroundService() {
        Notification notification = createNotification();

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            // Android 10+ 需要指定 foregroundServiceType
            try {
                startForeground(NOTIFICATION_ID, notification, android.content.pm.ServiceInfo.FOREGROUND_SERVICE_TYPE_SPECIAL_USE);
            } catch (Exception e) {
                // 如果失败，尝试普通方式
                startForeground(NOTIFICATION_ID, notification);
            }
        } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            // Android 8.0+ 需要启动为前台服务
            startForeground(NOTIFICATION_ID, notification);
        }
    }

    /**
     * 创建通知
     */
    private Notification createNotification() {
        NotificationCompat.Builder builder = new NotificationCompat.Builder(this, CHANNEL_ID)
                .setContentTitle("WebView调试工具")
                .setContentText("调试工具正在运行中")
                .setSmallIcon(getNotificationIcon())
                .setPriority(NotificationCompat.PRIORITY_LOW)
                .setOngoing(true)
                .setAutoCancel(false);

        return builder.build();
    }

    /**
     * 获取通知图标
     */
    private int getNotificationIcon() {
        // 使用应用图标或默认图标
        return getApplicationInfo().icon != 0
                ? getApplicationInfo().icon
                : android.R.drawable.ic_dialog_info;
    }

    /**
     * 更新通知
     */
    private void updateNotification() {
        if (devtoolsFrontendUrl != null) {
            Notification notification = new NotificationCompat.Builder(this, CHANNEL_ID)
                    .setContentTitle("WebView调试工具")
                    .setContentText("已连接到: " + devtoolsFrontendUrl)
                    .setSmallIcon(getNotificationIcon())
                    .setPriority(NotificationCompat.PRIORITY_LOW)
                    .setOngoing(true)
                    .setAutoCancel(false)
                    .build();

            NotificationManager manager = getSystemService(NotificationManager.class);
            if (manager != null) {
                manager.notify(NOTIFICATION_ID, notification);
            }
        }
    }

    /**
     * 显示悬浮窗
     */
    private void showFloatingWindow() {
        try {
            // 获取WindowManager
            windowManager = (WindowManager) getSystemService(Context.WINDOW_SERVICE);

            // 获取屏幕尺寸
            DisplayMetrics metrics = new DisplayMetrics();
            windowManager.getDefaultDisplay().getMetrics(metrics);
            screenWidth = metrics.widthPixels;
            screenHeight = metrics.heightPixels;

            // 设置默认窗口尺寸
            normalWidth = (int) (screenWidth * 0.7);
            normalHeight = (int) (screenHeight * 0.7);

            // 创建窗口参数
            params = new WindowManager.LayoutParams(
                    normalWidth,
                    normalHeight,
                    getWindowType(),
                    getWindowFlags(),
                    PixelFormat.TRANSLUCENT
            );

            // 设置窗口位置（居中）
            params.gravity = Gravity.TOP | Gravity.START;
            params.x = (screenWidth - normalWidth) / 2;
            params.y = (screenHeight - normalHeight) / 2;

            // 加载布局
            LayoutInflater inflater = LayoutInflater.from(this);
            if (floatView!= null) {
                removeFloatingWindow();
            }
            floatView = (FrameLayout) inflater.inflate(R.layout.devtools_float, null);

            // 获取UI组件
            devtoolsWindow = floatView.findViewById(R.id.devtools_window);
            titleBar = floatView.findViewById(R.id.devtools_title);
            debugWebView = floatView.findViewById(R.id.debug_webview);
            resizeHandle = floatView.findViewById(R.id.resize_handle);
            TextView closeBtn = floatView.findViewById(R.id.devtools_close);

            // 设置关闭按钮
            if (closeBtn != null) {
                closeBtn.setOnClickListener(v -> {
                    Log.d(TAG, "关闭按钮被点击");
                    stopSelf();
                });
            }

            // 设置调试WebView
            setupDebugWebView(debugWebView);

            // 设置拖动功能
            setupDragListeners();

            // 添加到WindowManager
            windowManager.addView(floatView, params);
            Log.d(TAG, "悬浮窗添加成功");

        } catch (Exception e) {
            Log.e(TAG, "添加悬浮窗失败", e);
            stopSelf();
        }
    }

    /**
     * 获取窗口类型（根据Android版本）
     */
    private int getWindowType() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            return WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY;
        } else {
            return WindowManager.LayoutParams.TYPE_PHONE;
        }
    }

    /**
     * 获取窗口标志
     */
    private int getWindowFlags() {
        int flags = WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL |
                WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS |
                WindowManager.LayoutParams.FLAG_WATCH_OUTSIDE_TOUCH |
                WindowManager.LayoutParams.FLAG_HARDWARE_ACCELERATED;

        // 移除 FLAG_NOT_FOCUSABLE，让窗口可以获取焦点
        // 这样WebView才能接收输入事件和唤出输入法

        // 如果是 Android 9.0+，添加额外的标志以改善触摸体验
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
            flags |= WindowManager.LayoutParams.FLAG_LAYOUT_INSET_DECOR;
        }

        return flags;
    }

    /**
     * 设置拖动监听器
     */
    private void setupDragListeners() {
        // 标题栏拖动
        if (titleBar != null) {
            titleBar.setOnTouchListener(new View.OnTouchListener() {
                private float downX, downY;
                private int startX, startY;

                @Override
                public boolean onTouch(View v, MotionEvent event) {
                    if (isResizing || params == null) return false;

                    switch (event.getActionMasked()) {
                        case MotionEvent.ACTION_DOWN:
                            isDragging = true;
                            downX = event.getRawX();
                            downY = event.getRawY();
                            startX = params.x;
                            startY = params.y;
                            break;

                        case MotionEvent.ACTION_MOVE:
                            if (isDragging) {
                                params.x = startX + (int) (event.getRawX() - downX);
                                params.y = startY + (int) (event.getRawY() - downY);
                                updateWindowPosition();
                            }
                            break;

                        case MotionEvent.ACTION_UP:
                        case MotionEvent.ACTION_CANCEL:
                            isDragging = false;
                            break;
                    }
                    return true;
                }
            });
        }

        // 右下角调整大小
        if (resizeHandle != null) {
            resizeHandle.setOnTouchListener(new View.OnTouchListener() {
                private float startTouchX, startTouchY;
                private int startWidth, startHeight;

                @Override
                public boolean onTouch(View v, MotionEvent event) {
                    switch (event.getActionMasked()) {
                        case MotionEvent.ACTION_DOWN:
                            isResizing = true;
                            startTouchX = event.getRawX();
                            startTouchY = event.getRawY();
                            startWidth = params.width;
                            startHeight = params.height;
                            break;

                        case MotionEvent.ACTION_MOVE:
                            if (isResizing) {
                                int dx = (int) (event.getRawX() - startTouchX);
                                int dy = (int) (event.getRawY() - startTouchY);

                                int newWidth = Math.max(dp2px(400), startWidth + dx);
                                int newHeight = Math.max(dp2px(300), startHeight + dy);

                                // 限制最大尺寸
                                newWidth = Math.min(newWidth, screenWidth);
                                newHeight = Math.min(newHeight, screenHeight);

                                params.width = newWidth;
                                params.height = newHeight;
                                updateWindowSize();
                            }
                            break;

                        case MotionEvent.ACTION_UP:
                        case MotionEvent.ACTION_CANCEL:
                            isResizing = false;
                            break;
                    }
                    return true;
                }
            });
        }
    }

    /**
     * 更新窗口位置
     */
    private void updateWindowPosition() {
        try {
            if (windowManager != null && floatView != null) {
                windowManager.updateViewLayout(floatView, params);
            }
        } catch (Exception e) {
            Log.e(TAG, "更新窗口位置失败", e);
        }
    }

    /**
     * 更新窗口尺寸
     */
    private void updateWindowSize() {
        try {
            if (windowManager != null && floatView != null) {
                windowManager.updateViewLayout(floatView, params);
            }
        } catch (Exception e) {
            Log.e(TAG, "更新窗口尺寸失败", e);
        }
    }

    /**
     * 移除悬浮窗
     */
    private void removeFloatingWindow() {
        try {
            if (floatView != null && windowManager != null && floatView.isAttachedToWindow()) {
                if (debugWebView != null) {
                    debugWebView.destroy();
                    debugWebView = null;
                }

                if (popupWebView != null) {
                    popupWebView.destroy();
                    popupWebView = null;
                }
                floatView.removeAllViews();
                windowManager.removeView(floatView);
                floatView = null;
                devtoolsWindow = null;
                titleBar = null;
                resizeHandle = null;
                Log.d(TAG, "悬浮窗移除成功");
            }
        } catch (Exception e) {
            Log.e(TAG, "移除悬浮窗失败", e);
        }
    }

    @SuppressLint("SetJavaScriptEnabled")
    private void setupDebugWebView(WebView debugWebView) {
        if (debugWebView == null) return;

        WebSettings settings = debugWebView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setAllowUniversalAccessFromFileURLs(true);
        settings.setAllowFileAccessFromFileURLs(true);
        settings.setSupportZoom(true);
        settings.setBuiltInZoomControls(true);
        settings.setDisplayZoomControls(false);
        settings.setLoadWithOverviewMode(true);
        settings.setUseWideViewPort(true);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        settings.setSupportMultipleWindows(true);
        settings.setJavaScriptCanOpenWindowsAutomatically(true);

        final String assetsDomain = "chrome-devtools-frontend.appspot.com";
        final WebViewAssetLoader assetLoader = new WebViewAssetLoader.Builder()
                .setDomain(assetsDomain)
                .setHttpAllowed(true)
                .addPathHandler("/", path -> {
                    try {
                        if (path.startsWith("serve_rev/@")) {
                            int slashAfterHash = path.indexOf('/', "serve_rev/@".length());
                            if (slashAfterHash != -1) path = path.substring(slashAfterHash + 1);
                            else path = "inspector.html";
                        }
                        if (path.isEmpty()) path = "inspector.html";
                        AssetManager am = getAssets();
                        InputStream is = am.open("devtools-frontend/" + path, AssetManager.ACCESS_STREAMING);
                        String mimeType = "text/html";
                        String extension = MimeTypeMap.getFileExtensionFromUrl(path);
                        if (extension != null) {
                            if (path.endsWith(".js") || path.endsWith(".mjs")) mimeType = "application/javascript";
                            else if (path.endsWith(".wasm")) mimeType = "application/wasm";
                            else {
                                String mt = MimeTypeMap.getSingleton().getMimeTypeFromExtension(extension);
                                if (mt != null) mimeType = mt;
                            }
                        }
                        return new WebResourceResponse(mimeType, null, is);
                    } catch (Exception e) {
                        Log.w(TAG, "Asset load failed: " + path, e);
                        return null;
                    }
                })
                .build();

        debugWebView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                view.loadUrl(url);
                return true;
            }

            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                return assetLoader.shouldInterceptRequest(request.getUrl());
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                Log.i(TAG, "Devtools page loaded: " + url);
            }
        });

        debugWebView.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onCreateWindow(WebView view, boolean isDialog, boolean isUserGesture, android.os.Message resultMsg) {
                popupWebView = new WebView(view.getContext());
                FrameLayout.LayoutParams lp = new FrameLayout.LayoutParams(
                        FrameLayout.LayoutParams.MATCH_PARENT,
                        FrameLayout.LayoutParams.MATCH_PARENT);
                WebSettings pSettings = popupWebView.getSettings();
                pSettings.setJavaScriptEnabled(true);
                pSettings.setDomStorageEnabled(true);
                pSettings.setAllowFileAccess(true);
                pSettings.setAllowContentAccess(true);
                pSettings.setAllowUniversalAccessFromFileURLs(true);
                pSettings.setUseWideViewPort(true);

                popupWebView.setWebViewClient(new WebViewClient() {
                    @Override
                    public boolean shouldOverrideUrlLoading(WebView view, String url) {
                        view.loadUrl(url);
                        return true;
                    }

                    @Override
                    public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                        return assetLoader.shouldInterceptRequest(request.getUrl());
                    }
                });

                FrameLayout container = floatView.findViewById(R.id.debug_content_container);
                if (container != null) container.addView(popupWebView, lp);

                WebView.WebViewTransport transport = (WebView.WebViewTransport) resultMsg.obj;
                transport.setWebView(popupWebView);
                resultMsg.sendToTarget();
                return true;
            }

            @Override
            public void onCloseWindow(WebView window) {
                try {
                    if (popupWebView != null) {
                        ViewGroup parent = (ViewGroup) popupWebView.getParent();
                        if (parent != null) parent.removeView(popupWebView);
                        popupWebView.destroy();
                        popupWebView = null;
                    } else {
                        ViewGroup parent = (ViewGroup) window.getParent();
                        if (parent != null) parent.removeView(window);
                        window.destroy();
                    }
                } catch (Exception ignored) {}
            }
        });
    }

    private void loadDebugPage() {
        if (webSocketDebuggerUrl == null && devtoolsFrontendUrl == null) {
            Log.w(TAG, "No debug URL provided");
            return;
        }
        if (debugWebView == null) {
            Log.w(TAG, "debugWebView not initialized yet");
            return;
        }
        String url = devtoolsFrontendUrl;
        if (url == null || url.isEmpty()) url = "https://chrome-devtools-frontend.appspot.com/inspector.html";
        Log.d(TAG, "Loading debug page: " + url);
        debugWebView.loadUrl(url);
    }

    private int dp2px(float dp) {
        float density = getResources().getDisplayMetrics().density;
        return Math.round(dp * density);
    }

    /**
     * 获取当前进程名
     */
    private String getProcessName() {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
                return android.app.Application.getProcessName();
            }
            return "";
        } catch (Exception e) {
            return "";
        }
    }

    /**
     * 使用 WindowInspector 检查窗口是否真正显示
     */
    private boolean isWindowReallyShowing() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.R) {
            // Android 11 以下使用传统方法
            return floatView != null && floatView.isAttachedToWindow();
        }

        try {
            // 获取所有窗口视图
            List<View> windowViews = WindowInspector.getGlobalWindowViews();

            if (floatView == null) {
                return false;
            }

            // 遍历所有窗口，查找我们的窗口
            for (View viewRoot : windowViews) {
                if (viewRoot == floatView) {
                    Log.d(TAG, "通过视图引用找到窗口");
                    return true;
                }

                // 比较视图内容
                if (viewRoot != null && viewRoot.findViewById(R.id.devtools_window) != null) {
                    Log.d(TAG, "通过ID找到调试窗口");
                    return true;
                }
            }

            return false;

        } catch (Exception e) {
            Log.e(TAG, "使用 WindowInspector 检查窗口失败", e);
            // 出错时回退到传统方法
            return floatView != null && floatView.isAttachedToWindow();
        }
    }

    @Override
    public void onDestroy() {
        Log.d(TAG, "DevToolsWindowService onDestroy");

        // 标记为停止运行
        isServiceRunning = false;

        // 清理资源
        try {
            cleanupResources();

            // 移除通知
            NotificationManager manager = getSystemService(NotificationManager.class);
            if (manager != null) {
                manager.cancel(NOTIFICATION_ID);
            }
        } catch (Exception e) {
            Log.e(TAG, "清理资源时出错", e);
        }
        super.onDestroy();
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    /**
     * 检查 Service 是否正在运行
     */
    public static boolean isRunning() {
        return isServiceRunning;
    }
}