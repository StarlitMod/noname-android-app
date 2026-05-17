package org.apache.cordova.devtools;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.res.AssetManager;
import android.graphics.Color;
import android.util.Log;
import android.view.Gravity;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
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

import androidx.webkit.WebViewAssetLoader;

import java.io.InputStream;

public class AppFloatWindow {
    private static final String TAG = "AppFloatWindow";

    private final Activity activity;
    private ViewGroup container; // 使用 Activity 的 content view
    private FrameLayout floatContainer;
    private View floatView;
    private WebView debugWebView;
    private WebView popupWebView;

    // 窗口状态
    private boolean isShowing = false;
    private boolean isMaximized = false;
    private boolean isMinimized = false;

    // 窗口大小
    private int normalWidth = 400;
    private int normalHeight = 300;
    private int minimizedWidth = 200;
    private int minimizedHeight = 60;

    // 窗口位置
    private int windowX = 100;
    private int windowY = 100;
    private float touchStartX, touchStartY;
    private boolean isDragging = false;

    // ws调试端口
    private String webSocketDebuggerUrl;
    private String devtoolsFrontendUrl;

    private String webViewDomain = "chrome-devtools-frontend.appspot.com";

    // 单例模式
    private static AppFloatWindow instance;

    /**
     * 使用 Activity 初始化
     */
    public static AppFloatWindow getInstance(Activity activity) {
        if (instance == null) {
            instance = new AppFloatWindow(activity);
        } else if (instance.activity != activity) {
            // 如果 Activity 变了，重新创建实例
            instance.destroy();
            instance = new AppFloatWindow(activity);
        }
        return instance;
    }

    private AppFloatWindow(Activity activity) {
        this.activity = activity;
        initWindowSize();
        setupContainer();
    }

    /**
     * 初始化窗口尺寸
     */
    private void initWindowSize() {
        int screenWidth = activity.getResources().getDisplayMetrics().widthPixels;
        int screenHeight = activity.getResources().getDisplayMetrics().heightPixels;

        normalWidth = (int) (screenWidth * 0.7);
        normalHeight = (int) (screenHeight * 0.7);
        minimizedWidth = (int) (screenWidth * 0.25);
        minimizedHeight = dp2px(50);
    }

    /**
     * 设置容器 - 使用 Activity 的 content view
     */
    private void setupContainer() {
        // 获取 Activity 的根布局
        container = (ViewGroup) activity.getWindow().getDecorView();
        createFloatContainer();
    }

    /**
     * 创建悬浮窗容器
     */
    private void createFloatContainer() {
        if (container == null) return;

        // 查找是否已存在容器
        floatContainer = container.findViewWithTag("debug_float_container");

        if (floatContainer == null) {
            floatContainer = new FrameLayout(activity);
            floatContainer.setTag("debug_float_container");
            FrameLayout.LayoutParams containerParams = new FrameLayout.LayoutParams(
                    FrameLayout.LayoutParams.MATCH_PARENT,
                    FrameLayout.LayoutParams.MATCH_PARENT
            );
            floatContainer.setLayoutParams(containerParams);
            floatContainer.setVisibility(View.GONE);

            // 添加到 Activity 的最顶层
            container.addView(floatContainer);
            Log.d(TAG, "创建新的悬浮窗容器");
        }
    }

    /**
     * 设置ws调试端口
     */
    public void setWebSocketDebuggerUrl(String url) {
        this.webSocketDebuggerUrl = url;
        if (isShowing && debugWebView != null && url != null) {
            loadDebugPage();
        }
    }

    /**
     * 设置devtools前端页面
     */
    public void setDevtoolsFrontendUrl(String url) {
        this.devtoolsFrontendUrl = url;
    }

    /**
     * 显示悬浮窗
     */
    public void show() {
        if (isShowing || container == null) return;

        activity.runOnUiThread(() -> {
            try {
                if (floatView == null) {
                    createFloatView();
                }

                if (floatContainer != null) {
                    floatContainer.setVisibility(View.VISIBLE);
                }
                if (floatView != null) {
                    floatView.setVisibility(View.VISIBLE);
                }
                isShowing = true;
                Log.i(TAG, "悬浮窗已显示");

                // 如果已设置ws端口，加载调试页面
                if (webSocketDebuggerUrl != null) {
                    loadDebugPage();
                }
            } catch (Exception e) {
                Log.e(TAG, "显示悬浮窗失败", e);
            }
        });
    }

    /**
     * 创建悬浮窗视图
     */
    private void createFloatView() {
        if (floatContainer == null) return;

        // 先移除旧的悬浮窗（如果存在）
        View oldView = floatContainer.findViewWithTag("debug_float_window");
        if (oldView != null) {
            floatContainer.removeView(oldView);
        }

        // 创建悬浮窗根布局
        FrameLayout rootLayout = new FrameLayout(activity);
        rootLayout.setTag("debug_float_window");
        FrameLayout.LayoutParams rootParams = new FrameLayout.LayoutParams(
            normalWidth,
            normalHeight
        );
        rootParams.leftMargin = windowX;
        rootParams.topMargin = windowY;
        rootLayout.setLayoutParams(rootParams);
        rootLayout.setBackground(createWindowBackground());

        // 创建窗口内容
        createWindowContent(rootLayout);

        floatContainer.addView(rootLayout);
        floatView = rootLayout;
    }

    /**
     * 创建窗口背景
     */
    private android.graphics.drawable.GradientDrawable createWindowBackground() {
        android.graphics.drawable.GradientDrawable drawable = new android.graphics.drawable.GradientDrawable();
        drawable.setColor(Color.WHITE);
        drawable.setCornerRadius(dp2px(8));
        drawable.setStroke(dp2px(1), Color.parseColor("#DDDDDD"));
        return drawable;
    }

    /**
     * 创建窗口内容
     */
    private void createWindowContent(FrameLayout rootLayout) {
        // 主垂直布局
        LinearLayout mainLayout = new LinearLayout(activity);
        mainLayout.setLayoutParams(new FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.MATCH_PARENT
        ));
        mainLayout.setOrientation(LinearLayout.VERTICAL);
        rootLayout.addView(mainLayout);

        // 标题栏
        View titleBar = createTitleBar();
        mainLayout.addView(titleBar);

        // 内容区域容器
        FrameLayout contentContainer = new FrameLayout(activity);
        LinearLayout.LayoutParams contentParams = new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                0
        );
        contentParams.weight = 1;
        contentContainer.setLayoutParams(contentParams);
        contentContainer.setTag("debug_content_container");
        mainLayout.addView(contentContainer);

        // 设置拖动监听
        setupDragListener(titleBar, rootLayout);

        // 添加右下角缩放柄
        addResizeHandle(rootLayout);
    }

    private boolean isResizing = false;
    private float resizeStartX, resizeStartY;
    private int resizeStartWidth, resizeStartHeight;

    private void addResizeHandle(FrameLayout rootLayout) {
        View handle = new View(activity);
        int handleSize = dp2px(16);
        FrameLayout.LayoutParams lp = new FrameLayout.LayoutParams(handleSize, handleSize);
        lp.gravity = Gravity.BOTTOM | Gravity.END;
        lp.rightMargin = dp2px(8);
        lp.bottomMargin = dp2px(8);
        handle.setLayoutParams(lp);
        handle.setBackgroundColor(Color.parseColor("#33000000"));
        handle.setClickable(true);

        handle.setOnTouchListener((v, event) -> {
            FrameLayout.LayoutParams params = (FrameLayout.LayoutParams) rootLayout.getLayoutParams();
            switch (event.getActionMasked()) {
                case MotionEvent.ACTION_DOWN:
                    isResizing = true;
                    resizeStartX = event.getRawX();
                    resizeStartY = event.getRawY();
                    resizeStartWidth = params.width;
                    resizeStartHeight = params.height;
                    return true;
                case MotionEvent.ACTION_MOVE:
                    if (!isResizing) return false;
                    float dx = event.getRawX() - resizeStartX;
                    float dy = event.getRawY() - resizeStartY;
                    int newW = Math.max(dp2px(200), resizeStartWidth + (int) dx);
                    int newH = Math.max(dp2px(160), resizeStartHeight + (int) dy);
                    params.width = newW;
                    params.height = newH;
                    rootLayout.setLayoutParams(params);
                    return true;
                case MotionEvent.ACTION_UP:
                case MotionEvent.ACTION_CANCEL:
                    isResizing = false;
                    return true;
            }
            return false;
        });

        rootLayout.addView(handle);
    }

    /**
     * 创建标题栏
     */
    private View createTitleBar() {
        LinearLayout titleBar = new LinearLayout(activity);
        titleBar.setLayoutParams(new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                dp2px(40)
        ));
        titleBar.setOrientation(LinearLayout.HORIZONTAL);
        titleBar.setGravity(Gravity.CENTER_VERTICAL);
        titleBar.setBackgroundColor(Color.parseColor("#2C3E50"));
        titleBar.setPadding(dp2px(12), 0, dp2px(12), 0);

        // 标题文本
        TextView titleText = new TextView(activity);
        LinearLayout.LayoutParams titleParams = new LinearLayout.LayoutParams(
                0, LinearLayout.LayoutParams.WRAP_CONTENT
        );
        titleParams.weight = 1;
        titleText.setLayoutParams(titleParams);
        titleText.setText("WebView 调试器");
        titleText.setTextColor(Color.WHITE);
        titleText.setTextSize(14);
        titleText.setTypeface(null, android.graphics.Typeface.BOLD);
        titleBar.addView(titleText);

        // 窗口控制按钮
        createWindowButtons(titleBar);

        return titleBar;
    }

    /**
     * 创建窗口控制按钮
     */
    private void createWindowButtons(LinearLayout titleBar) {
        LinearLayout buttonContainer = new LinearLayout(activity);
        buttonContainer.setLayoutParams(new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.WRAP_CONTENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
        ));
        buttonContainer.setOrientation(LinearLayout.HORIZONTAL);

        // 最小化按钮
        View minimizeBtn = createControlButton("-", "#F39C12");
        minimizeBtn.setOnClickListener(v -> minimizeWindow());
        buttonContainer.addView(minimizeBtn);

        // 最大化/还原按钮
        View maximizeBtn = createControlButton("□", "#27AE60");
        maximizeBtn.setOnClickListener(v -> toggleMaximize());
        buttonContainer.addView(maximizeBtn);

        // 关闭按钮
        View closeBtn = createControlButton("×", "#E74C3C");
        closeBtn.setOnClickListener(v -> hide());
        buttonContainer.addView(closeBtn);

        titleBar.addView(buttonContainer);
    }

    /**
     * 创建控制按钮
     */
    @SuppressLint("ClickableViewAccessibility")
    private View createControlButton(String text, String color) {
        TextView button = new TextView(activity);
        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
                dp2px(30), dp2px(30)
        );
        params.setMargins(dp2px(4), 0, 0, 0);
        button.setLayoutParams(params);
        button.setText(text);
        button.setTextColor(Color.WHITE);
        button.setTextSize(16);
        button.setGravity(Gravity.CENTER);
        button.setBackground(createButtonBackground(Color.parseColor(color)));
        button.setClickable(true);

        button.setOnTouchListener((v, event) -> {
            switch (event.getAction()) {
                case MotionEvent.ACTION_DOWN:
                    v.setAlpha(0.7f);
                    break;
                case MotionEvent.ACTION_UP:
                case MotionEvent.ACTION_CANCEL:
                    v.setAlpha(1.0f);
                    break;
            }
            return false;
        });

        return button;
    }

    private android.graphics.drawable.GradientDrawable createButtonBackground(int color) {
        android.graphics.drawable.GradientDrawable drawable = new android.graphics.drawable.GradientDrawable();
        drawable.setColor(color);
        drawable.setCornerRadius(dp2px(4));
        return drawable;
    }

    /**
     * 设置拖动监听
     */
    private void setupDragListener(View dragView, View windowView) {
        dragView.setOnTouchListener(new View.OnTouchListener() {
            @Override
            public boolean onTouch(View v, MotionEvent event) {
                FrameLayout.LayoutParams params = (FrameLayout.LayoutParams) windowView.getLayoutParams();

                switch (event.getAction()) {
                    case MotionEvent.ACTION_DOWN:
                        touchStartX = event.getRawX();
                        touchStartY = event.getRawY();
                        isDragging = false;
                        return true;

                    case MotionEvent.ACTION_MOVE:
                        float deltaX = event.getRawX() - touchStartX;
                        float deltaY = event.getRawY() - touchStartY;

                        if (!isDragging && (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10)) {
                            isDragging = true;
                        }

                        if (isDragging) {
                            params.leftMargin += deltaX;
                            params.topMargin += deltaY;

                            // 限制在屏幕内
                            int maxX = container.getWidth() - windowView.getWidth();
                            int maxY = container.getHeight() - windowView.getHeight();
                            params.leftMargin = Math.max(0, Math.min(params.leftMargin, maxX));
                            params.topMargin = Math.max(0, Math.min(params.topMargin, maxY));

                            windowView.setLayoutParams(params);
                            touchStartX = event.getRawX();
                            touchStartY = event.getRawY();
                        }
                        return true;

                    case MotionEvent.ACTION_UP:
                        if (!isDragging) {
                            v.performClick();
                        }
                        isDragging = false;
                        return true;
                }
                return false;
            }
        });
    }

    /**
     * 最小化窗口
     */
    private void minimizeWindow() {
        if (isMaximized || floatView == null) return;

        activity.runOnUiThread(() -> {
            FrameLayout.LayoutParams params = (FrameLayout.LayoutParams) floatView.getLayoutParams();

            if (isMinimized) {
                // 还原
                params.width = normalWidth;
                params.height = normalHeight;
                isMinimized = false;
                restoreWebView();
            } else {
                // 最小化
                params.width = minimizedWidth;
                params.height = minimizedHeight;
                isMinimized = true;
                hideWebView();
            }

            floatView.setLayoutParams(params);
        });
    }

    /**
     * 最大化/还原窗口
     */
    private void toggleMaximize() {
        if (floatView == null) return;

        activity.runOnUiThread(() -> {
            FrameLayout.LayoutParams params = (FrameLayout.LayoutParams) floatView.getLayoutParams();

            if (isMaximized) {
                // 还原
                params.width = normalWidth;
                params.height = normalHeight;
                params.leftMargin = windowX;
                params.topMargin = windowY;
                isMaximized = false;
            } else {
                // 最大化：保存当前位置/尺寸并填充
                windowX = params.leftMargin;
                windowY = params.topMargin;
                // 保存之前大小
                normalWidth = params.width;
                normalHeight = params.height;

                params.width = FrameLayout.LayoutParams.MATCH_PARENT;
                params.height = FrameLayout.LayoutParams.MATCH_PARENT;
                params.leftMargin = 0;
                params.topMargin = 0;
                isMaximized = true;
            }

            floatView.setLayoutParams(params);
        });
    }

    private void hideWebView() {
        if (debugWebView != null) {
            debugWebView.setVisibility(View.GONE);
        }
    }

    private void restoreWebView() {
        if (debugWebView != null) {
            debugWebView.setVisibility(View.VISIBLE);
        }
    }

    /**
     * 创建调试 WebView
     */
    @SuppressLint("SetJavaScriptEnabled")
    private void createDebugWebView() {
        if (floatView == null) return;

        // 找到内容容器
        FrameLayout contentContainer = floatView.findViewWithTag("debug_content_container");
        if (contentContainer == null) return;

        // 清除现有内容
        contentContainer.removeAllViews();

        // 创建 WebView
        debugWebView = new WebView(activity);
        debugWebView.setLayoutParams(new FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.MATCH_PARENT
        ));

        // 配置 WebView
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

        AssetManager assetManager = activity.getAssets();

        WebViewAssetLoader assetLoader = new WebViewAssetLoader.Builder()
                .setDomain(webViewDomain)
                .setHttpAllowed(true)
                .addPathHandler("/", path -> {
                    try {
                        // 处理 Chrome DevTools 的动态路径
                        // 移除 serve_rev/@[hash]/ 前缀
                        if (path.startsWith("serve_rev/@")) {
                            // 查找第一个斜杠之后的位置（在 @hash 之后）
                            int slashAfterHash = path.indexOf('/', "serve_rev/@".length());
                            if (slashAfterHash != -1) {
                                // 提取 hash 之后的部分
                                path = path.substring(slashAfterHash + 1);
                            } else {
                                // 如果没有斜杠，可能是无效路径
                                path = "inspector.html";
                            }
                        }
                        else if (path.startsWith("serve_internal_file/@")) {
                            // 查找第一个斜杠之后的位置（在 @hash 之后）
                            int slashAfterHash = path.indexOf('/', "serve_internal_file/@".length());
                            if (slashAfterHash != -1) {
                                // 提取 hash 之后的部分
                                path = path.substring(slashAfterHash + 1);
                            } else {
                                // 如果没有斜杠，可能是无效路径
                                path = "inspector.html";
                            }
                        }

                        if (path.isEmpty()) {
                            path = "inspector.html";
                        }

                        InputStream is = assetManager.open("devtools-frontend/" + path, AssetManager.ACCESS_STREAMING);
                        String mimeType = "text/html";
                        String extension = MimeTypeMap.getFileExtensionFromUrl(path);
                        if (extension != null) {
                            if (path.endsWith(".js") || path.endsWith(".mjs")) {
                                // Make sure JS files get the proper mimetype to support ES modules
                                mimeType = "application/javascript";
                            } else if (path.endsWith(".wasm")) {
                                mimeType = "application/wasm";
                            } else {
                                mimeType = MimeTypeMap.getSingleton().getMimeTypeFromExtension(extension);
                            }
                        }
                        return new WebResourceResponse(mimeType, null, is);
                    } catch (Exception e) {
                        e.printStackTrace();
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
            public void onPageFinished(WebView view, String url) {
                Log.i(TAG, "调试页面加载完成: " + url);
            }

            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                return assetLoader.shouldInterceptRequest(request.getUrl());
            }
        });

        // 处理 window.open / popup （DevTools frontend 需要）
        debugWebView.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onCreateWindow(WebView view, boolean isDialog, boolean isUserGesture, android.os.Message resultMsg) {
                Log.e(TAG, "onCreateWindow");
                // 创建并配置一个临时 popup WebView 来承载新窗口内容
                popupWebView = new WebView(view.getContext());
                FrameLayout.LayoutParams lp = new FrameLayout.LayoutParams(
                        FrameLayout.LayoutParams.MATCH_PARENT,
                        FrameLayout.LayoutParams.MATCH_PARENT
                );

                WebSettings pSettings = popupWebView.getSettings();
                pSettings.setJavaScriptEnabled(true);
                pSettings.setDomStorageEnabled(true);
                pSettings.setAllowFileAccess(true);
                pSettings.setAllowContentAccess(true);
                pSettings.setAllowUniversalAccessFromFileURLs(true);
                pSettings.setUseWideViewPort(true);

                // 使用与主 WebView 相同的 assetLoader 拦截（使 devtools 资源可被加载）
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

                // 将 popup 放入浮窗内容容器
                FrameLayout contentContainer = floatView.findViewWithTag("debug_content_container");
                if (contentContainer != null) {
                    contentContainer.addView(popupWebView, lp);
                }

                WebView.WebViewTransport transport = (WebView.WebViewTransport) resultMsg.obj;
                transport.setWebView(popupWebView);
                resultMsg.sendToTarget();
                return true;
            }

            @Override
            public void onCloseWindow(WebView window) {
                // 移除并销毁 popupWebView（优先使用 popupWebView 引用）
                super.onCloseWindow(window);
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

        contentContainer.addView(debugWebView);
    }

    /**
     * 加载调试页面
     */
    private void loadDebugPage() {
        if (webSocketDebuggerUrl == null) {
            Log.e(TAG, "调试端口未设置");
            return;
        }

        activity.runOnUiThread(() -> {
            if (debugWebView == null) {
                createDebugWebView();
            }

            if (debugWebView != null) {
                debugWebView.loadUrl(devtoolsFrontendUrl);
            }
        });
    }

    /**
     * 隐藏悬浮窗
     */
    public void hide() {
        if (!isShowing) return;

        activity.runOnUiThread(() -> {
            if (floatContainer != null) {
                floatContainer.setVisibility(View.GONE);
            }
            isShowing = false;
            Log.i(TAG, "悬浮窗已隐藏");
        });
    }

    /**
     * 切换显示/隐藏
     */
    public void toggle() {
        if (isShowing) {
            hide();
        } else {
            show();
        }
    }

    public boolean isShowing() {
        return isShowing;
    }

    /**
     * 清理资源
     */
    public void destroy() {
        activity.runOnUiThread(() -> {
            if (debugWebView != null) {
                debugWebView.destroy();
                debugWebView = null;
            }

            if (floatContainer != null && container != null) {
                container.removeView(floatContainer);
                floatContainer = null;
            }

            floatView = null;
            isShowing = false;
            instance = null;
        });
    }

    private int dp2px(float dp) {
        float density = activity.getResources().getDisplayMetrics().density;
        return Math.round(dp * density);
    }
}