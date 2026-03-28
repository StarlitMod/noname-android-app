/*
       Licensed to the Apache Software Foundation (ASF) under one
       or more contributor license agreements.  See the NOTICE file
       distributed with this work for additional information
       regarding copyright ownership.  The ASF licenses this file
       to you under the Apache License, Version 2.0 (the
       "License"); you may not use this file except in compliance
       with the License.  You may obtain a copy of the License at

         http://www.apache.org/licenses/LICENSE-2.0

       Unless required by applicable law or agreed to in writing,
       software distributed under the License is distributed on an
       "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
       KIND, either express or implied.  See the License for the
       specific language governing permissions and limitations
       under the License.
 */

package com.widget.noname;

import static com.kongzue.dialogx.dialogs.PopTip.tip;

import android.content.ComponentName;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.webkit.WebSettings;
import android.webkit.WebView;

import androidx.appcompat.app.AppCompatDelegate;

import com.widget.noname.function.functionlibrary.bridge.NonameJavaScriptInterface;
import com.widget.noname.engine.CustomWebView;
import com.widget.noname.function.functionlibrary.bridge.JsBridgeInterface;
import com.widget.noname.eventbus.GameExitEvent;
import com.widget.noname.eventbus.SettingsChangeEvent;

import org.apache.cordova.CordovaActivity;
import org.apache.cordova.CordovaWebViewEngine;
import org.greenrobot.eventbus.EventBus;
import org.greenrobot.eventbus.Subscribe;
import org.greenrobot.eventbus.ThreadMode;

import java.net.URI;
import java.net.URISyntaxException;

public class MainActivity extends CordovaActivity {
    private CustomWebView webview;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // 如果是重建，那会失去很多初始化的内容
        // 所以跳转到主界面
        if (savedInstanceState != null) {
            Log.e(TAG, "重建Activity");
            try {
                Intent intent = new Intent();
                intent.setComponent(new ComponentName(getPackageName(), "com.widget.noname.LaunchActivity"));
                startActivity(intent);
                finish();
                this.overridePendingTransition(
                        com.widget.noname.function.functionlibrary.R.anim.zoom_in,
                        com.widget.noname.function.functionlibrary.R.anim.zoom_out
                );
            } catch (Exception e) {
                tip(e.getMessage()).iconError().show();
            }
        }

        if (!EventBus.getDefault().isRegistered(this)) {
            EventBus.getDefault().register(this);
        }

        // enable Cordova apps to be started in the background
        Bundle extras = getIntent().getExtras();
        if (extras != null && extras.getBoolean("cdvStartInBackground", false)) {
            moveTaskToBack(true);
        }

        // 提前替换hostname
        String hostname = Settings.getHostName();
        preferences.set("hostname", hostname);

        if (appView == null) {
            init();
        }
        View view = appView.getView();
        webview = (CustomWebView) view;
        WebSettings settings = webview.getSettings();
        Log.e(TAG, settings.getUserAgentString());
        initWebviewSettings(webview, settings);

        // Set by <content src="index.js" /> in config.xml
        // loadUrl(launchUrl);

        try {
            if (extras != null && extras.getString("importExtensionName") != null) {
                String extName = extras.getString("importExtensionName");
                URI uri = URI.create(buildCustomUrl());
                String newQuery = uri.getQuery();
                String appendQuery = "importExtensionName=" + extName;
                if (newQuery == null) {
                    newQuery = appendQuery;
                } else {
                    newQuery += "&" + appendQuery;
                }
                URI newUri = new URI(uri.getScheme(), uri.getAuthority(), uri.getPath(), newQuery, uri.getFragment());
                Log.e(TAG, newUri.toString());
                loadUrl(newUri.toString());
            }
            else {
                loadCustomUrl();
            }
        } catch (URISyntaxException e) {
            e.printStackTrace();
            loadCustomUrl();
        }

        tip(com.widget.noname.function.functionlibrary.R.string.app_free_warning).iconWarning().show();

        // 日间/夜间 跟随系统
        AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_FOLLOW_SYSTEM);
    }

    @Override
    protected CordovaWebViewEngine makeWebViewEngine() {
        // todo: 支持其他webview
        return super.makeWebViewEngine();
    }

    private void initWebviewSettings(WebView webview, WebSettings settings) {
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        settings.setTextZoom(Settings.getFontSize());
        JsBridgeInterface jsBridgeInterface = new JsBridgeInterface(this, null);
        webview.addJavascriptInterface(jsBridgeInterface, jsBridgeInterface.getCallTag());
        if (!Settings.getDisableLoadAssets()) {
            webview.addJavascriptInterface(new NonameJavaScriptInterface(this, webview, preferences), "NonameAndroidBridge");
        }
        WebView.setWebContentsDebuggingEnabled(true);
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        EventBus.getDefault().post(new GameExitEvent("退出游戏"));
        if (EventBus.getDefault().isRegistered(this)) {
            EventBus.getDefault().unregister(this);
        }
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        Bundle extras = intent.getExtras();
        if (extras != null) {
            String extName = extras.getString("importExtensionName");
            boolean importPackage = extras.getBoolean("importPackage", false);
            if (webview != null) {
                if (extName != null) {
                    webview.evaluateJavascript("(() => {" +
                            "const event = new CustomEvent('importExtension', { " +
                            "detail: { extensionName: '" + extName + "'}" +
                            "});" +
                            "window.dispatchEvent(event);" +
                            "})();", null);
                }
                if (importPackage) {
                    webview.evaluateJavascript("(() => {" +
                            "const event = new CustomEvent('importPackage', { " +
                            "detail: { importPackage: true }" +
                            "});" +
                            "window.dispatchEvent(event);" +
                            "})();", null);
                }
            }
        }
    }

    @Override
    public void onBackPressed() {
        View rootview = getWindow().getDecorView();
        View focusView = rootview.findFocus();
        Log.e(TAG, String.valueOf(focusView));
        if (webview != null && focusView == webview && webview.canGoBack()) {
            webview.goBack();
            Log.e(TAG, "SystemWebView -> " + webview.getUrl());
        }
        else {
            super.onBackPressed();
        }
    }

    // 构建自定义URL
    private String buildCustomUrl() {
        String protocol = Settings.getProtocol();
        String hostname = Settings.getHostName();
        return protocol + "://" + hostname;
    }

    // 加载自定义URL
    private void loadCustomUrl() {
        if (appView == null) {
            return;
        }
        View view = appView.getView();
        WebView webview = (WebView) view;
        WebSettings settings = webview.getSettings();
        String url = buildCustomUrl();
        if (url.startsWith("http")) {
            settings.setAllowFileAccess(false);
            settings.setAllowFileAccessFromFileURLs(false);
            loadUrl(url);
        } else {
            settings.setAllowFileAccess(true);
            settings.setAllowFileAccessFromFileURLs(true);
            loadUrl("file:///android_asset/www/index.html");
        }
    }

    @Subscribe(threadMode = ThreadMode.MAIN)
    public void onSettingsChangeEvent(SettingsChangeEvent event) {
        if (appView == null) {
            return;
        }
        View view = appView.getView();
        WebView webview = (WebView) view;
        WebSettings settings = webview.getSettings();
        switch (event.getKey()) {
            case Settings.KEY_FONT_SIZE: {
                settings.setTextZoom(Settings.getFontSize());
                break;
            }
        }
    }
}
