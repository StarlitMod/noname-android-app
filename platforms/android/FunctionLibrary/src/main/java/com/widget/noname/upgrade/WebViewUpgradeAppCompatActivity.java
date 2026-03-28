package com.widget.noname.upgrade;

import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;

import androidx.appcompat.app.AppCompatActivity;

import org.apache.cordova.LOG;

public class WebViewUpgradeAppCompatActivity extends AppCompatActivity {
    private static final String TAG = "WebViewUpgradeAppCompatActivity";

    protected void ActivityOnCreate(Bundle extras) {

    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        LOG.e("onCreate", String.valueOf(savedInstanceState));
        super.onCreate(savedInstanceState);

        Bundle extras = getIntent().getExtras();

        WebViewUpgradeUtils webViewUpgradeUtils = new WebViewUpgradeUtils();
        webViewUpgradeUtils.upgrade(this, () -> {
            // 切换到主线程执行
            new Handler(Looper.getMainLooper()).post(() -> ActivityOnCreate(extras));
        });
    }
}
