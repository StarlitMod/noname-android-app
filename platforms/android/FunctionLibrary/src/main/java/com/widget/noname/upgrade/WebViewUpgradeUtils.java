package com.widget.noname.upgrade;

import static com.widget.noname.upgrade.WebViewSelectionActivity.SELECTED_WEBVIEW_PACKAGE;
import static com.widget.noname.upgrade.WebViewSelectionActivity.WEBVIEW_PACKAGES;
import static com.widget.noname.upgrade.WebViewSelectionActivity.hasWebViewLibrary;

import android.app.Activity;
import android.app.ProgressDialog;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.IBinder;
import android.util.Log;
import android.view.KeyEvent;

import com.norman.webviewup.lib.UpgradeCallback;
import com.norman.webviewup.lib.WebViewUpgrade;
import com.norman.webviewup.lib.source.UpgradePackageSource;
import com.norman.webviewup.lib.source.UpgradeSource;
import com.widget.noname.function.functionlibrary.R;
import com.widget.noname.interfaces.WebViewUpgradeInterface;

import cn.hle.skipselfstartmanager.util.MobileInfoUtils;

public class WebViewUpgradeUtils implements WebViewUpgradeInterface {

    private static final String TAG = "WebViewUpgradeUtils";

    private ProgressDialog WebViewUpgradeProgressDialog;

    public static boolean WebviewUpgraded = false;

    private Context context;

    private Activity activity;

    @Override
    public void upgrade(Context context, Runnable callback) {
        this.context = context;
        this.activity = (Activity) context;

        if (SELECTED_WEBVIEW_PACKAGE == null) {
            String systemWebViewPackageName = WebViewUpgrade.getSystemWebViewPackageName();
            PackageManager packageManager = context.getPackageManager();
            // 安卓8以下的设备，选任意安装的,符合条件的WebView App
            if (systemWebViewPackageName == null) {
                for (String packageName : WEBVIEW_PACKAGES) {
                    try {
                        ApplicationInfo appInfo = packageManager.getApplicationInfo(packageName, 0);
                        if (hasWebViewLibrary(appInfo)) {
                            systemWebViewPackageName = packageName;
                            break;
                        }
                    } catch (PackageManager.NameNotFoundException ignored) {

                    }
                }
            }
            SELECTED_WEBVIEW_PACKAGE = context.getSharedPreferences("nonameyuri", Context.MODE_PRIVATE)
                    .getString("selectedWebviewPackage", systemWebViewPackageName);
        }

        boolean useUpgrade = context.getSharedPreferences("nonameyuri", Context.MODE_PRIVATE).getBoolean("useUpgrade", true);

        if (!useUpgrade || WebviewUpgraded) {
            finish(callback);
        }
        else {
            WebviewUpgraded = true;

            if (WebViewUpgradeProgressDialog == null) {
                WebViewUpgradeProgressDialog = new ProgressDialog(context);
                WebViewUpgradeProgressDialog.setTitle(R.string.webview_updating);
                WebViewUpgradeProgressDialog.setCancelable(false);
                WebViewUpgradeProgressDialog.setIndeterminate(false);
                WebViewUpgradeProgressDialog.setProgressStyle(ProgressDialog.STYLE_HORIZONTAL);
                WebViewUpgradeProgressDialog.setMax(100);
                WebViewUpgradeProgressDialog.setProgress(0);
                if (WebViewUpgradeProgressDialog.isShowing()) WebViewUpgradeProgressDialog.hide();
            }

            WebViewUpgrade.addUpgradeCallback(new UpgradeCallback() {
                @Override
                public void onUpgradeProcess(float percent) {
                    if (percent <= 0.9 && !WebViewUpgradeProgressDialog.isShowing()) {
                        WebViewUpgradeProgressDialog.show();
                    }
                    WebViewUpgradeProgressDialog.setProgress((int) (percent * 100));
                }

                @Override
                public void onUpgradeComplete() {
                    Log.e(TAG, "onUpgradeComplete");
                    WebViewUpgradeProgressDialog.setProgress(100);

                    try {
                        PackageInfo upgradePackageInfo = context.getPackageManager().getPackageInfo(SELECTED_WEBVIEW_PACKAGE, 0);
                        if (upgradePackageInfo != null) {

                            if (Build.VERSION.SDK_INT > 34) {
                                String serviceName =  "org.chromium.content.app.SandboxedProcessService0";

                                ServiceConnection mConnection = new ServiceConnection() {
                                    @Override
                                    public void onServiceConnected(ComponentName className, IBinder service) {
                                        Log.e(TAG, serviceName + "服务连接成功");
                                    }

                                    @Override
                                    public void onServiceDisconnected(ComponentName arg0) {
                                        Log.e(TAG, serviceName + "服务意外断开");
                                    }
                                };

                                try {
                                    Intent intent = new Intent();
                                    intent.setClassName(SELECTED_WEBVIEW_PACKAGE, serviceName);
                                    boolean isServiceBound = activity.bindService(intent, mConnection, Context.BIND_AUTO_CREATE);

                                    if (isServiceBound) {
                                        Log.e(TAG, serviceName + "服务已启动并且绑定成功");
                                    }
                                    else {
                                        Log.e(TAG, serviceName + "是服务未启动或不存在");
                                        navigateToAppSettingsAndExit();
                                    }
                                } catch (java.lang.SecurityException e) {
                                    e.printStackTrace();
                                    Log.e(TAG, serviceName + "服务已启动");
                                }
                            }

                            finish(callback);
                        } else {
                            finish(callback);
                        }
                    } catch (Exception e) {
                        finish(callback);
                    }
                }

                @Override
                public void onUpgradeError(Throwable throwable) {
                    Log.e(TAG, "onUpgradeError: " + throwable);
                    // webview不对，比如apks的chrome
                    if (throwable.getMessage() != null && throwable.getMessage().contains("Tried to load an invalid WebView provider")) {
                        // 找系统webview赋值
                        String systemWebViewPackageName = WebViewUpgrade.getSystemWebViewPackageName();
                        // 安卓8以下可能找不到
                        if (systemWebViewPackageName != null) {
                            context.getSharedPreferences("nonameyuri", Context.MODE_PRIVATE)
                                    .edit()
                                    .putString("selectedWebviewPackage", systemWebViewPackageName)
                                    .apply();
                            SELECTED_WEBVIEW_PACKAGE = systemWebViewPackageName;
                            return;
                        }
                    }
                    android.app.AlertDialog.Builder dlg = new android.app.AlertDialog.Builder(context);
                    dlg.setMessage(context.getString(R.string.webview_update_failed, throwable.getMessage() != null ? throwable.getMessage() : context.getString(R.string.common_unknown_reason)));
                    dlg.setTitle("Alert");
                    dlg.setCancelable(false);
                    dlg.setPositiveButton(R.string.common_set_now,
                            (dialog1, which1) -> {
                                changeWebviewProvider();
                                finish(callback);
                            });
                    dlg.setNegativeButton(R.string.common_later,
                            (dialog3, which2) -> {
                                dialog3.dismiss();
                                finish(callback);
                            });
                    dlg.setOnKeyListener((dialog2, keyCode, event) -> {
                        if (keyCode == KeyEvent.KEYCODE_BACK) {
                            finish(callback);
                            return false;
                        }
                        else {
                            changeWebviewProvider();
                            finish(callback);
                            return true;
                        }
                    });
                    dlg.show();
                }
            });

            try {
                // 添加webview
                UpgradeSource upgradeSource = new UpgradePackageSource(
                        context.getApplicationContext(),
                        SELECTED_WEBVIEW_PACKAGE
                );

                String SystemWebViewPackageName = WebViewUpgrade.getSystemWebViewPackageName();
                Log.e(TAG, "SystemWebViewPackageName: " + SystemWebViewPackageName);
                Log.e(TAG, "SelectedWebviewPackage: " + SELECTED_WEBVIEW_PACKAGE);

                // 如果webview就是已经选的
                if (SELECTED_WEBVIEW_PACKAGE.equals(SystemWebViewPackageName)) {
                    finish(callback);
                    return;
                }

                WebViewUpgrade.upgrade(upgradeSource);
            } catch (Exception e) {
                Log.e(TAG, String.valueOf(e));
                finish(callback);
            }
        }
    }

    @Override
    public void navigateToAppSettingsAndExit() {
        android.app.AlertDialog.Builder dlg = new android.app.AlertDialog.Builder(context);
        dlg.setMessage(context.getString(R.string.webview_autostart_permission, SELECTED_WEBVIEW_PACKAGE));
        dlg.setTitle("Alert");
        dlg.setCancelable(false);
        dlg.setPositiveButton(R.string.common_set_now,
                (dialog1, which1) -> {
                    MobileInfoUtils.jumpStartInterface(context, SELECTED_WEBVIEW_PACKAGE);
                    activity.finish();
                    android.os.Process.killProcess(android.os.Process.myPid());
                });
        dlg.setNegativeButton(R.string.common_later,
                (dialog3, which2) -> dialog3.dismiss());
        dlg.setOnKeyListener((dialog2, keyCode, event) -> {
            if (keyCode == KeyEvent.KEYCODE_BACK) {
                return false;
            }
            else {
                MobileInfoUtils.jumpStartInterface(context, SELECTED_WEBVIEW_PACKAGE);
                activity.finish();
                android.os.Process.killProcess(android.os.Process.myPid());
                return true;
            }
        });
        dlg.show();
    }

    @Override
    public void changeWebviewProvider() {
        Intent newIntent = new Intent(context, WebViewSelectionActivity.class);
        newIntent.setAction(Intent.ACTION_VIEW);
        activity.startActivity(newIntent);
        activity.overridePendingTransition(
                android.R.anim.fade_in,
                android.R.anim.fade_out
        );
    }
    
    private void finish(Runnable callback) {
        if (WebViewUpgradeProgressDialog != null) {
            WebViewUpgradeProgressDialog.hide();
            WebViewUpgradeProgressDialog.dismiss();
            WebViewUpgradeProgressDialog = null;
        }
        callback.run();
    }
}
