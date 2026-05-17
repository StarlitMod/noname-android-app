package com.widget.noname.upgrade;

import static com.widget.noname.upgrade.WebViewSelectionActivity.SELECTED_WEBVIEW_PACKAGE;
import static com.widget.noname.upgrade.WebViewSelectionActivity.WEBVIEW_PACKAGES;
import static com.widget.noname.upgrade.WebViewSelectionActivity.hasWebViewLibrary;

import android.app.Activity;
import android.app.ProgressDialog;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.util.Log;
import android.view.KeyEvent;

import com.norman.webviewup.lib.UpgradeCallback;
import com.norman.webviewup.lib.WebViewUpgrade;
import com.norman.webviewup.lib.source.UpgradeAssetSource;
import com.norman.webviewup.lib.source.UpgradePackageSource;
import com.norman.webviewup.lib.source.UpgradeSource;
import com.widget.noname.function.functionlibrary.R;
import com.widget.noname.interfaces.WebViewUpgradeInterface;

import java.io.IOException;

public class WebViewUpgradeUtils implements WebViewUpgradeInterface {

    private static final String TAG = "WebViewUpgradeUtils";

    private ProgressDialog WebViewUpgradeProgressDialog;

    public static boolean WebviewUpgraded = false;

    public static boolean UseAssetWebView = false;

    public static boolean UseNetWorkWebView = false;

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
                    finish(callback);
                }

                @Override
                public void onUpgradeError(Throwable throwable) {
                    Log.e(TAG, "onUpgradeError: " + throwable);
                    throwable.printStackTrace();
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

            String SystemWebViewPackageName = WebViewUpgrade.getSystemWebViewPackageName();
            String SystemWebViewPackageVersion = WebViewUpgrade.getSystemWebViewPackageVersion();
            Log.e(TAG, "SystemWebViewPackageName: " + SystemWebViewPackageName);
            Log.e(TAG, "SystemWebViewPackageVersion: " + SystemWebViewPackageVersion);
            Log.e(TAG, "SelectedWebviewPackage: " + SELECTED_WEBVIEW_PACKAGE);

            try {
                UpgradeSource upgradeSource;

                // 设备已安装webview
                UpgradePackageSource upgradePackageSource = new UpgradePackageSource(
                        context.getApplicationContext(),
                        SELECTED_WEBVIEW_PACKAGE
                );

                upgradeSource = upgradePackageSource;
                // asset内置webview
                String assetWebviewPackageName = hasWebViewApkInAssets(context);
                if (assetWebviewPackageName != null) {
                    String[] result = parsePackageNameAndVersion(assetWebviewPackageName);
                    if (result != null) {
                        String packageName = result[0];  // com.google.android.webview
                        String versionName = result[1];  // 119.0.6045.53
                        Log.e(TAG, "内置webview包名: " + packageName);
                        Log.e(TAG, "内置webview版本: " + versionName);

                        int comparison = compareVersions(versionName, SystemWebViewPackageVersion);

                        if (comparison > 0) {
                            // 使用 asset 中的新版本
                            Log.e(TAG, "Asset 中的 WebView 版本比系统 WebView 新：" + versionName + " > " + SystemWebViewPackageVersion + "，不进行升级操作");
                            upgradeSource = new UpgradeAssetSource(
                                    context,
                                    "webview/" + assetWebviewPackageName);

                            UseAssetWebView = true;

                        } else if (comparison < 0) {
                            // 使用系统已安装的版本
                            Log.e(TAG, "系统已安装的 WebView 版本比Asset 中的 WebView 新：" + SystemWebViewPackageVersion + " > " + versionName + "，不进行升级操作");
                        } else {
                            // 版本号相同，任选其一
                            Log.e(TAG, "Asset 中的 WebView 版本与系统 WebView 版本号相同：" + versionName);
                        }
                    }
                    else {
                        Log.e(TAG, "webview文件名解析失败");
                    }
                }
                else {
                    Log.e(TAG, "无内置webview");
                }

                // 如果webview就是已经选的
                if (upgradeSource == upgradePackageSource && SELECTED_WEBVIEW_PACKAGE.equals(SystemWebViewPackageName)) {
                    Log.e(TAG, "当前选择webview为系统webview，不进行升级操作");
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
    public void changeWebviewProvider() {
        Intent newIntent = new Intent(context, WebViewSelectionActivity.class);
        newIntent.setAction(Intent.ACTION_VIEW);
        activity.startActivity(newIntent);
        activity.overridePendingTransition(
                android.R.anim.fade_in,
                android.R.anim.fade_out
        );
    }

    /**
     * 检查 assets 目录中是否存在 webview/webview.apk 文件
     * @param context Android 上下文对象
     * @return 如果文件存在返回 文件名，否则返回 null
     */
    public String hasWebViewApkInAssets(Context context) {
        try {
            // 尝试列出 assets/webview 目录下的文件
            String[] files = context.getAssets().list("webview");

            if (files != null) {
                // 检查列表中是否包含 apk 文件
                for (String fileName : files) {
                    if (fileName.endsWith(".apk")) {
                        return fileName;
                    }
                }
            }

            return null;
        } catch (IOException e) {
            return null;
        }
    }

    /**
     * 从 APK 文件名中解析包名和版本号
     * 格式：{包名}_{版本号}.apk
     * 例如：com.google.android.webview_119.0.6045.53.apk
     *
     * @param fileName APK 文件名
     * @return 包含包名和版本号的数组，[0] 为包名，[1] 为版本号；如果解析失败返回 null
     */
    public String[] parsePackageNameAndVersion(String fileName) {
        if (fileName == null || !fileName.endsWith(".apk")) {
            return null;
        }

        // 去掉 .apk 后缀
        String baseName = fileName.substring(0, fileName.length() - 4);

        // 找到最后一个下划线的位置（分隔包名和版本号）
        int lastUnderscoreIndex = baseName.lastIndexOf('_');

        if (lastUnderscoreIndex == -1 || lastUnderscoreIndex == 0 || lastUnderscoreIndex == baseName.length() - 1) {
            return null;
        }

        String packageName = baseName.substring(0, lastUnderscoreIndex);
        String versionName = baseName.substring(lastUnderscoreIndex + 1);

        return new String[]{packageName, versionName};
    }

    /**
     * 比较两个版本号的大小
     * 版本号格式：x.x.x.x（纯数字，用点分隔）
     *
     * @param version1 版本号 1
     * @param version2 版本号 2
     * @return version1 > version2 返回 1；version1 < version2 返回 -1；相等返回 0
     */
    public int compareVersions(String version1, String version2) {
        if (version1 == null || version2 == null) {
            throw new IllegalArgumentException("版本号不能为 null");
        }

        // 按点号分割版本号
        String[] v1Parts = version1.split("\\.");
        String[] v2Parts = version2.split("\\.");

        // 获取最大长度
        int maxLength = Math.max(v1Parts.length, v2Parts.length);

        // 逐段比较
        for (int i = 0; i < maxLength; i++) {
            // 如果某一段不存在，视为 0
            int v1Num = i < v1Parts.length ? Integer.parseInt(v1Parts[i]) : 0;
            int v2Num = i < v2Parts.length ? Integer.parseInt(v2Parts[i]) : 0;

            if (v1Num > v2Num) {
                return 1;   // version1 更大
            } else if (v1Num < v2Num) {
                return -1;  // version2 更大
            }
        }

        return 0;  // 两个版本号相等
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
