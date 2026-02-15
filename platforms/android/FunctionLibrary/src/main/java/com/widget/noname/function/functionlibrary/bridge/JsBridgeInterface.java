package com.widget.noname.function.functionlibrary.bridge;

import android.content.Context;
import android.util.Log;
import android.webkit.JavascriptInterface;

import com.widget.noname.util.JsPathUtil;

import java.util.Arrays;

public class JsBridgeInterface {
    public static final String ROOT_URI = "/html/start.html";
    private static final String CALL_TAG = "jsBridge";
    private static final String CONFIG_PREFIX = "noname_0.9_";

    private final Context context;
    private final OnJsBridgeCallback jsBridgeCallback;

    public JsBridgeInterface(Context context, OnJsBridgeCallback callback) {
        this.context = context;
        jsBridgeCallback = callback;
    }

    @JavascriptInterface
    public String getAssetPath() {
        return JsPathUtil.getGameRootPath(context);
    }

    @JavascriptInterface
    public void onGetExtensions(String result) {
        if (null != result) {
            String[] extensions = result.split(",");
            Log.e(CALL_TAG, "getExtensions: " + Arrays.toString(extensions));
            if (null != jsBridgeCallback) {
                jsBridgeCallback.onExtensionGet(extensions);
            }
        } else {
            jsBridgeCallback.onExtensionGet(null);
        }
    }

    @JavascriptInterface
    public void onExtensionStateGet(String ext, boolean state) {
        if (null != jsBridgeCallback) {
            jsBridgeCallback.onExtensionStateGet(ext, state);
        }
    }

    @JavascriptInterface
    public void onServeIpSet() {
        if (null != jsBridgeCallback) {
            jsBridgeCallback.onServeIpSet();
        }
    }

    @JavascriptInterface
    public void onPageStarted() {
        if (null != jsBridgeCallback) {
            jsBridgeCallback.onPageStarted();
        }
    }

    @JavascriptInterface
    public void onRecentIpsUpdate(String value) {
        if (null != jsBridgeCallback) {
            jsBridgeCallback.onRecentIpUpdate(value);
        }
    }

    @JavascriptInterface
    public void onCloseDB() {
        if (null != jsBridgeCallback) {
            jsBridgeCallback.onCloseDB();
        }
    }

    public String getCallTag() {
        return CALL_TAG;
    }
}
