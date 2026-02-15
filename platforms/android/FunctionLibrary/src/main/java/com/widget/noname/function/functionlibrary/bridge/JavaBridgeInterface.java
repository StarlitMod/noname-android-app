package com.widget.noname.function.functionlibrary.bridge;

import android.text.TextUtils;
import android.util.Log;
import android.webkit.WebView;

import androidx.annotation.NonNull;

public class JavaBridgeInterface {
    private static final String TAG = "JavaBridgeInterface";
    private static final String JS_PREFIX = "javascript:";

    private final WebView webView;

    public JavaBridgeInterface(@NonNull WebView webView) {
        this.webView = webView;
    }

    public void callJs(String js) {
        Log.v(TAG, "callJs: " + js);
        webView.loadUrl(js);
    }

    public void callFun(String funName, Object... param) {
        if (TextUtils.isEmpty(funName)) {
            return;
        }

        String url = toParams(funName, param);
        Log.v(TAG, "callFun: " + url);
        webView.loadUrl(url);
    }

    public String toParams(String funName, Object... params) {
        StringBuilder b = new StringBuilder();
        b.append("javascript:app.").append(funName);

        if (params == null)
            return b.append("();").toString();

        int iMax = params.length - 1;
        if (iMax == -1)
            return b.append("();").toString();

        b.append('(');

        for (int i = 0; ; i++) {
            b.append(params[i]);

            if (i == iMax){
                return b.append(");").toString();
            }

            b.append(", ");
        }
    }
}
