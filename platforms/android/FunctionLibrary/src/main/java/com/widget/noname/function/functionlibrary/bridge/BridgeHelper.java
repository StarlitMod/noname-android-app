package com.widget.noname.function.functionlibrary.bridge;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.res.AssetManager;
import android.util.Log;
import android.webkit.MimeTypeMap;
import android.webkit.ServiceWorkerClient;
import android.webkit.ServiceWorkerController;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import androidx.webkit.WebViewAssetLoader;

import com.tencent.mmkv.MMKV;
import com.widget.noname.Settings;
import com.widget.noname.common.util.FileConstant;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.text.DateFormat;
import java.text.DateFormatSymbols;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

public class BridgeHelper {
    private static final String TAG = "BridgeHelper";
    private static final String JS_PREFIX = "javascript:";
    // private static final String JS_GET_EXTENSIONS = "javascript:app.getExtensions();";
    private static final String JS_GET_EXTENSIONS = "javascript:typeof app == 'undefined' ? location.reload() : app.getExtensions();";

    private final WebView webView;
    private JavaBridgeInterface javaBridge;
    private final OnJsBridgeCallback jsBridgeCallback;

    public BridgeHelper(WebView webView, OnJsBridgeCallback callback) {
        this.webView = webView;
        jsBridgeCallback = callback;
        init();
    }

    @SuppressLint("SetJavaScriptEnabled")
    private void init() {
        javaBridge = new JavaBridgeInterface(webView);

        webView.setInitialScale(0);
        webView.setVerticalScrollBarEnabled(false);
        final WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setJavaScriptCanOpenWindowsAutomatically(true);
        settings.setLayoutAlgorithm(WebSettings.LayoutAlgorithm.NORMAL);

        settings.setAllowFileAccess(true);

        //We don't save any form data in the application
        settings.setSaveFormData(false);
        settings.setSavePassword(false);

        // Jellybean rightfully tried to lock this down. Too bad they didn't give us a whitelist
        // while we do this
        settings.setAllowUniversalAccessFromFileURLs(true);
        settings.setAllowFileAccessFromFileURLs(true);
        settings.setMediaPlaybackRequiresUserGesture(false);

        // Enable database
        // We keep this disabled because we use or shim to get around DOM_EXCEPTION_ERROR_16
        String databasePath = webView.getContext().getApplicationContext().getDir("database", Context.MODE_PRIVATE).getPath();
        settings.setDatabaseEnabled(true);
        settings.setDatabasePath(databasePath);
        settings.setGeolocationDatabasePath(databasePath);
        settings.setDomStorageEnabled(true);

        settings.setGeolocationEnabled(true);
        // settings.setAppCachePath(databasePath);
        // settings.setAppCacheEnabled(true);

        // settings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);

        JsBridgeInterface jsBridge = new JsBridgeInterface(webView.getContext(), jsBridgeCallback);
        webView.addJavascriptInterface(jsBridge, jsBridge.getCallTag());

        final Context context = webView.getContext();
        AssetManager assetManager =  context.getAssets();
        WebViewAssetLoader.Builder assetLoaderBuilder = new WebViewAssetLoader.Builder()
                .setDomain(Settings.getHostName())
                .setHttpAllowed(true);

        WebViewAssetLoader.AssetsPathHandler assetsPathHandler = new WebViewAssetLoader.AssetsPathHandler(context);
        assetLoaderBuilder.addPathHandler("/android_asset/", path -> {
            // WebResourceResponse response = assetsPathHandler.handle(path);
            // response.setMimeType(mimeType);
            try {
                InputStream is = assetManager.open(path, AssetManager.ACCESS_STREAMING);
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
                WebResourceResponse response = new WebResourceResponse(mimeType, null, is);
                Log.e(TAG, "path: " + path + ", is: " + response.getData());
                return response;
            } catch (IOException e) {
                Log.e(TAG, "assetManager打开" + path + "失败");
                e.printStackTrace();
                return null;
            }
        });

        WebViewAssetLoader.ResourcesPathHandler resourcesPathHandler = new WebViewAssetLoader.ResourcesPathHandler(context);
        assetLoaderBuilder.addPathHandler("/android_res/", path -> {
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
            WebResourceResponse response = resourcesPathHandler.handle(path);
            response.setMimeType(mimeType);
            return response;
        });

        assetLoaderBuilder.addPathHandler("/", path -> {
            try {
                if (path.isEmpty()) {
                    path = "index.html";
                }
                // InputStream is = parentEngine.webView.getContext().getAssets().open("www/" + path, AssetManager.ACCESS_STREAMING);
                // 使其在Asset文件夹中找不到文件时自动读取一次外部存储文件
                InputStream is;
                String[] split = ("www/" + path).split("/");
                String[] newSplit = Arrays.copyOfRange(split, 0, split.length - 1);
                List<String> list = Arrays.asList(assetManager.list(String.join("/", newSplit)));
                Long lastModified = null;
                if (!path.startsWith("game/") && list.contains(split[split.length - 1])) {
                    is = assetManager.open("www/" + path, AssetManager.ACCESS_STREAMING);
                } else {
                    String GameRootPath = MMKV.defaultMMKV().getString(FileConstant.GAME_PATH_KEY, null);
                    if (GameRootPath == null) {
                        GameRootPath = context.getExternalFilesDir(null).getParentFile().getAbsolutePath() + File.separator;
                    }
                    File file = new File(
                            GameRootPath,
                            path
                    );
                    lastModified = file.lastModified();
                    is = new FileInputStream(file);
                }
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
                WebResourceResponse response = new WebResourceResponse(mimeType, null, is);
                if (lastModified != null) {
                    Locale aLocale = Locale.US;
                    @SuppressLint("SimpleDateFormat")
                    DateFormat fmt = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss", new DateFormatSymbols(aLocale));
                    Map<String, String> headers = new HashMap<>();
                    headers.put("last-modified", fmt.format(new Date(lastModified)));
                    if (response.getResponseHeaders() != null) {
                        headers.putAll(response.getResponseHeaders());
                    }
                    response.setResponseHeaders(headers);
                }
                return response;
            } catch (Exception e) {
                e.printStackTrace();
            }
            return null;
        });
        WebViewAssetLoader assetLoader = assetLoaderBuilder.build();

        ServiceWorkerController controller = ServiceWorkerController.getInstance();
        controller.setServiceWorkerClient(new ServiceWorkerClient(){
            @Override
            public WebResourceResponse shouldInterceptRequest(WebResourceRequest request) {
                return assetLoader.shouldInterceptRequest(request.getUrl());
            }
        });

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                String url = request.getUrl().toString();
                String method = request.getMethod();
                Map<String, String> headers = request.getRequestHeaders();
                Log.e(TAG, method + "  " + url + "  " + headers);
                return assetLoader.shouldInterceptRequest(request.getUrl());
            }
        });
        loadUrl();
    }

    private void loadUrl() {
        String protocol = Settings.getProtocol();
        String urlToLoad;
        if ("file".equals(protocol)) {
            webView.getSettings().setAllowFileAccess(true);
            webView.getSettings().setAllowFileAccessFromFileURLs(true);
            urlToLoad = protocol + ":///android_asset" + JsBridgeInterface.ROOT_URI;
        }
        else {
            webView.getSettings().setAllowFileAccess(false);
            webView.getSettings().setAllowFileAccessFromFileURLs(false);
            urlToLoad = protocol + "://" + Settings.getHostName() + "/android_asset" + JsBridgeInterface.ROOT_URI;
        }
        webView.post(() -> webView.loadUrl(urlToLoad));
    }

    public void getExtensions() {
        if (null != webView) {
            webView.post(()-> {
                Log.e(TAG, "webView.url: " + webView.getUrl());
                javaBridge.callJs(JS_GET_EXTENSIONS);
            });
        }
    }

    public void getExtensionState(String extName) {
        if (null != webView) {
            webView.post(()-> javaBridge.callFun("getExtensionState",
                    "'" + extName + "'"));
        }
    }

    public void enableExtension(String extName, boolean enable) {
        if (null != webView) {
            webView.post(() -> javaBridge.callFun("enableExtension",
                    "'" + extName + "'", enable));
        }
    }

    public void removeExtension(String extName) {
        if (null != webView) {
            webView.post(() -> javaBridge.callFun("removeExtension",
                    "'" + extName + "'"));
        }
    }

    public void setServerIp(String ip) {
        if (null != webView) {
            webView.post(() -> javaBridge.callFun("setServerIp",
                    "'" + ip + "'"));
        }
    }

    public void setServerIp(String ip, boolean directStart) {
        if (null != webView) {
            webView.post(() -> javaBridge.callFun("setServerIp",
                    "'" + ip + "'", directStart));
        }
    }
}
