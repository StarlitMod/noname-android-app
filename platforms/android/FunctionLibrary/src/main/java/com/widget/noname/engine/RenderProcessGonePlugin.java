package com.widget.noname.engine;

import android.webkit.RenderProcessGoneDetail;
import android.webkit.WebView;

import com.kongzue.dialogx.dialogs.MessageDialog;

import org.apache.cordova.CordovaPlugin;

import java.util.Locale;

public class RenderProcessGonePlugin extends CordovaPlugin {
    @Override
    public boolean onRenderProcessGone(WebView view, RenderProcessGoneDetail detail) {
        boolean didCrash = detail.didCrash();
        int rendererPriority = detail.rendererPriorityAtExit();

        String reason = didCrash ? "渲染进程崩溃" : "系统为回收内存杀掉了渲染进程";
        MessageDialog.build()
                .setTitle("WebView渲染进程终止")
                .setMessage(String.format(Locale.CHINA,"%s, 优先级: %d", reason, rendererPriority))
                .show();
        // 由于有另一个activity兜底
        return false;
    }
}
