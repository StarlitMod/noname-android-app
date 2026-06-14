package com.widget.noname.function.functionsettings.subfragment;

import static com.kongzue.dialogx.dialogs.PopTip.tip;

import android.annotation.SuppressLint;
import android.content.ComponentName;
import android.content.Intent;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.graphics.drawable.Drawable;
import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.preference.EditTextPreference;
import androidx.preference.ListPreference;
import androidx.preference.Preference;
import androidx.preference.SeekBarPreference;
import androidx.preference.SwitchPreference;

import com.kongzue.dialogx.DialogX;
import com.kongzue.dialogx.dialogs.MessageDialog;
import com.kongzue.dialogx.interfaces.DialogXStyle;
import com.kongzue.dialogx.style.MaterialStyle;
import com.norman.webviewup.lib.WebViewUpgrade;
import com.widget.noname.upgrade.WebViewSelectionActivity;
import com.widget.noname.Settings;
import com.widget.noname.common.util.TutorialConstant;
import com.widget.noname.function.functionsettings.R;
import com.widget.noname.function.functionsettings.preference.DialogXPreferenceFragmentCompat;
import com.widget.noname.upgrade.WebViewUpgradeUtils;

import java.util.HashMap;
import java.util.Map;

public class SettingsFragment extends DialogXPreferenceFragmentCompat implements Preference.OnPreferenceChangeListener, Preference.OnPreferenceClickListener {
    private static final String TAG = "SettingsFragment";

    @Override
    public void onCreatePreferences(Bundle savedInstanceState, String rootKey) {
        setPreferencesFromResource(R.xml.preferences, rootKey);
        syncSettingsWithUI();
    }

    // 同步设置
    private void syncSettingsWithUI() {
        // 更新设置
        SwitchPreference preUpdatePreference = findPreference(Settings.KEY_PRE_UPDATE);
        if (preUpdatePreference != null) {
            preUpdatePreference.setChecked(Settings.getPreUpdate());
            preUpdatePreference.setOnPreferenceChangeListener(this);
        }

        // webview设置
        ListPreference protocolPreference = findPreference(Settings.KEY_PROTOCOL);
        if (protocolPreference != null) {
            protocolPreference.setValue(Settings.getProtocol());
            protocolPreference.setOnPreferenceChangeListener(this);
        }

        EditTextPreference domainPreference = findPreference(Settings.KEY_HOSTNAME);
        if (domainPreference != null) {
            domainPreference.setText(Settings.getHostName());
            domainPreference.setOnPreferenceChangeListener(this);
        }

        SwitchPreference disableLoadAssetsPreference = findPreference(Settings.KEY_DISABLE_LOAD_ASSETS);
        if (disableLoadAssetsPreference != null) {
            disableLoadAssetsPreference.setChecked(Settings.getDisableLoadAssets());
            disableLoadAssetsPreference.setOnPreferenceChangeListener(this);
        }

        SwitchPreference debugModePreference = findPreference(Settings.KEY_DEBUG_MODE);
        if (debugModePreference != null) {
            debugModePreference.setChecked(Settings.getDebugMode());
            debugModePreference.setOnPreferenceChangeListener(this);
        }

        SwitchPreference CompatibilityModePreference = findPreference(Settings.KEY_COMPATIBILITY_MODE);
        if (CompatibilityModePreference != null) {
            CompatibilityModePreference.setChecked(Settings.getCompatibilityMode());
            CompatibilityModePreference.setOnPreferenceChangeListener(this);
        }

        SeekBarPreference fontSizePreference = findPreference(Settings.KEY_FONT_SIZE);
        if (fontSizePreference != null) {
            fontSizePreference.setValue(Settings.getFontSize());
            fontSizePreference.setOnPreferenceChangeListener(this);
        }

        Preference webViewUpgradePreference = findPreference(Settings.KEY_WEBVIEW_UPGRADE);
        if (webViewUpgradePreference != null) {
            webViewUpgradePreference.setOnPreferenceClickListener(this);
            setWebViewUpgradeIcon(webViewUpgradePreference);
        }

        // 网络设置
        SwitchPreference githubAccelerationPreference = findPreference(Settings.KEY_GITHUB_ACCELERATION);
        if (githubAccelerationPreference != null) {
            githubAccelerationPreference.setChecked(Settings.getGithubAcceleration());
            githubAccelerationPreference.setOnPreferenceChangeListener(this);
        }

        EditTextPreference githubDownloadAccelerationPreference = findPreference(Settings.KEY_GITHUB_DOWNLOAD_ACCELERATION);
        if (githubDownloadAccelerationPreference != null) {
            githubDownloadAccelerationPreference.setText(Settings.getGithubDownloadAcceleration());
            githubDownloadAccelerationPreference.setOnPreferenceChangeListener(this);
        }

        // 功能设置
        SwitchPreference autoStartPreference = findPreference(Settings.KEY_AUTO_START);
        if (autoStartPreference != null) {
            autoStartPreference.setChecked(Settings.getAutoStart());
            autoStartPreference.setOnPreferenceChangeListener(this);
        }

        SwitchPreference splashScreenPreference = findPreference(Settings.KEY_SPLASH_SCREEN);
        if (splashScreenPreference != null) {
            splashScreenPreference.setChecked(Settings.getSplashScreen());
            splashScreenPreference.setOnPreferenceChangeListener(this);
        }

        SwitchPreference autoFixPermissionsPreference = findPreference(Settings.KEY_AUTO_FIX_PERMISSIONS);
        if (autoFixPermissionsPreference != null) {
            autoFixPermissionsPreference.setChecked(Settings.getAutoFixPermissions());
            autoFixPermissionsPreference.setOnPreferenceChangeListener(this);
        }

        // 主题

        ListPreference dialogThemePreference = findPreference(Settings.KEY_DIALOG_THEME);
        if (dialogThemePreference != null) {
            dialogThemePreference.setValue(Settings.getDialogTheme());
            dialogThemePreference.setOnPreferenceChangeListener(this);
        }

        // 设置所有教程的点击监听
        for (Map.Entry<String, String> entry : tutorialMap.entrySet()) {
            Preference preference = findPreference(entry.getKey());
            if (preference != null) {
                preference.setOnPreferenceClickListener(pref -> {
                    String tutorialKey = entry.getValue();
                    MessageDialog.build()
                            .setTitle(com.widget.noname.function.functionlibrary.R.string.common_tip)
                            .setMessage(getString(com.widget.noname.function.functionlibrary.R.string.common_dialog_confirm_preference_change, preference.getTitle()))
                            .setOkButton(android.R.string.ok, (baseDialog, view) -> {
                                TutorialConstant.resetTutorial(tutorialKey, requireContext());
                                tip(getString(com.widget.noname.function.functionlibrary.R.string.common_toast_preference_changed, preference.getTitle())).iconSuccess().show();
                                return false;
                            })
                            .setCancelButton(android.R.string.cancel)
                            .show();
                    return true;
                });
            }
        }

        // 关闭所有新手引导
        Preference disableAllTutorialsPref = findPreference("disable_all_tutorials");
        if (disableAllTutorialsPref != null) {
            disableAllTutorialsPref.setOnPreferenceClickListener(pref -> {
                MessageDialog.build()
                        .setTitle(com.widget.noname.function.functionlibrary.R.string.common_tip)
                        .setMessage(getString(com.widget.noname.function.functionlibrary.R.string.common_dialog_confirm_preference_change, disableAllTutorialsPref.getTitle()))
                        .setOkButton(android.R.string.ok, (baseDialog, view) -> {
                            TutorialConstant.disableAllTutorials(requireContext());
                            tip(com.widget.noname.function.functionlibrary.R.string.tutorial_toast_all_disabled).iconSuccess().show();
                            return false;
                        })
                        .setCancelButton(android.R.string.cancel)
                        .show();
                return true;
            });
        }

        // 关于
        Preference privacyPolicyPreference = findPreference(Settings.KEY_PRIVACY_POLICY);
        if (privacyPolicyPreference != null) {
            privacyPolicyPreference.setOnPreferenceClickListener(this);
        }
    }

    @Override
    public boolean onPreferenceChange(@NonNull Preference preference, Object newValue) {
        switch (preference.getKey()) {
            case Settings.KEY_PROTOCOL: {
                Settings.setProtocol((String) newValue);
                // 因为先加载http/file的indexeddb后切换协议到另一个，会加载不了数据库，所以暂时只能重启
                // 原来是可乐加冰留下来的bug，pauseTimers()全局暂停所有WebView
                // Settings.askForRestart(getContext());
                return true;
            }
            case Settings.KEY_HOSTNAME: {
                if (Settings.isValidHostName((String) newValue)) {
                    // 域名的加载是在cordova初始化时才加载的，只能在MainActivity提前进行替换
                    Settings.setHostName((String) newValue);
                    return true;
                }
                else {
                    tip(getString(com.widget.noname.function.functionlibrary.R.string.network_error_domain_format)).iconError().show();
                    return false;
                }
            }
            case Settings.KEY_FONT_SIZE: {
                Settings.setFontSize((int) newValue);
                return true;
            }
            case Settings.KEY_AUTO_START: {
                Settings.setAutoStart((boolean) newValue);
                return true;
            }
            case Settings.KEY_SPLASH_SCREEN: {
                Settings.setSplashScreen((boolean) newValue);
                return true;
            }
            case Settings.KEY_DISABLE_LOAD_ASSETS: {
                Settings.setDisableLoadAssets((boolean) newValue);
                return true;
            }
            case Settings.KEY_DEBUG_MODE: {
                Settings.setDebugMode((boolean) newValue);
                return true;
            }
            case Settings.KEY_COMPATIBILITY_MODE: {
                Settings.setCompatibilityMode((boolean) newValue);
                return true;
            }
            case Settings.KEY_DIALOG_THEME: {
                Settings.setDialogTheme((String) newValue);
                try {
                    DialogX.globalStyle = (DialogXStyle) Class.forName(Settings.getDialogTheme()).getMethod("style").invoke(null);
                    tip(com.widget.noname.function.functionlibrary.R.string.common_toast_dialog_style_changed).iconSuccess().show();
                } catch (Exception e) {
                    DialogX.globalStyle = MaterialStyle.style();
                    tip(com.widget.noname.function.functionlibrary.R.string.common_error_dialog_style_failed).iconError().show();
                }
                return true;
            }
            case Settings.KEY_GITHUB_ACCELERATION: {
                Settings.setGithubAcceleration((boolean) newValue);
                return true;
            }
            case Settings.KEY_GITHUB_DOWNLOAD_ACCELERATION: {
                if (Settings.isValidDomainOrUrl((String) newValue)) {
                    Settings.setGithubDownloadAcceleration((String) newValue);
                    return true;
                }
                else {
                    tip(getString(com.widget.noname.function.functionlibrary.R.string.network_error_domain_format)).iconError().show();
                    return false;
                }
            }
            case Settings.KEY_PRE_UPDATE: {
                Settings.setPreUpdate((boolean) newValue);
                return true;
            }
            case Settings.KEY_AUTO_FIX_PERMISSIONS: {
                Settings.setAutoFixPermissions((boolean) newValue);
                return true;
            }
        }
        return false;
    }

    @Override
    public boolean onPreferenceClick(@NonNull Preference preference) {
        switch (preference.getKey()) {
            case Settings.KEY_PRIVACY_POLICY: {
                Settings.getPrivacyPolicyDialog().show();
                return true;
            }
            case Settings.KEY_WEBVIEW_UPGRADE: {
                if (WebViewUpgradeUtils.UseAssetWebView) {
                    String UpgradeWebViewPackageName = WebViewUpgrade.getUpgradeWebViewPackageName();
                    String UpgradeWebViewVersion = WebViewUpgrade.getUpgradeWebViewVersion();
                    MessageDialog.build()
                            .setTitle(com.widget.noname.function.functionlibrary.R.string.common_tip)
                            .setMessage(getString(com.widget.noname.function.functionlibrary.R.string.webview_update_disabled_message,
                                    UpgradeWebViewPackageName,
                                    UpgradeWebViewVersion))
                            .setOkButton(android.R.string.ok)
                            .show();
                    break;
                }
                Intent intent = new Intent();
                intent.setComponent(new ComponentName(getContext().getPackageName(), WebViewSelectionActivity.class.getCanonicalName()));
                getContext().startActivity(intent);
                break;
            }
//            case Settings.KEY_CUSTOM_THEMES: {
//                Settings.chooseTheme();
//                CustomDialogBuilder.Config config = new CustomDialogBuilder.Config(
//                        com.widght.noname.dialogx.genshinimpact.R.layout.dialog_genshinimpact_light_layout,
//                        com.widght.noname.dialogx.genshinimpact.R.id.dialog_title,
//                        com.widght.noname.dialogx.genshinimpact.R.id.dialog_message,
//                        com.widght.noname.dialogx.genshinimpact.R.id.dialog_main,
//                        com.widght.noname.dialogx.genshinimpact.R.id.dialog_ok_button,
//                        com.widght.noname.dialogx.genshinimpact.R.id.dialog_cancel_button
//                );
//                CustomDialogBuilder builder = new CustomDialogBuilder(getContext(), config)
//                        .setTitle("标题1111")
//                        .setMessage("信息2222")
//                        .setOkClickListener((dialog, v) -> {
//                            dialog.dismiss();
//                        })
//                        .setCancelClickListener((dialog, v) -> {
//                            dialog.dismiss();
//                        })
//                        .build(CustomDialogBuilder.DialogType.Web)
//                        .setOnDialogViewCreatedListener((view, type) -> {
//                            WebView webView = (WebView) view;
//                            webView.loadUrl("https://www.bilibili.com/");
//                        });
//                        .build(CustomDialogBuilder.DialogType.Video)
//                        .setOnDialogViewCreatedListener((view, type) -> {
//                            VideoView videoView = (VideoView) view;
//                            LinearLayout.LayoutParams layoutParams = new LinearLayout.LayoutParams(
//                                    LinearLayout.LayoutParams.MATCH_PARENT,
//                                    400
//                            );
//                            videoView.setLayoutParams(layoutParams);
//                            videoView.setVideoURI(Uri.parse("android.resource://" + getContext().getPackageName() + "/" + com.widget.noname.function.functionlibrary.R.raw.splash_video_xiaowu));
//                            videoView.start();
//                        });
//                        .build(CustomDialogBuilder.DialogType.List)
//                        .setOnDialogViewCreatedListener((view, type) -> {
//                            ListView listView = (ListView) view;
//                            LinearLayout.LayoutParams layoutParams = new LinearLayout.LayoutParams(
//                                    LinearLayout.LayoutParams.MATCH_PARENT,
//                                    400
//                            );
//                            listView.setLayoutParams(layoutParams);
//                            var data = List.of(
//                                    "Apple", "Banana", "Orange", "Watermelon",
//                                    "Pear", "Grape", "Pineapple", "Strawberry", "Cherry", "Mango",
//                                    "Apple", "Banana", "Orange", "Watermelon", "Pear", "Grape",
//                                    "Pineapple", "Strawberry", "Cherry", "Mango"
//                            );
//                            listView.setAdapter(new ArrayAdapter<>(
//                                    getContext(),
//                                    android.R.layout.simple_list_item_1,
//                                    data
//                            ));
//                        });
//                builder.show();
//                break;
//            }
        }
        return false;
    }

    @SuppressLint("UseCompatLoadingForDrawables")
    private void setWebViewUpgradeIcon(Preference webViewUpgradePreference) {
        String packageName = getContext().getSharedPreferences("nonameyuri", getContext().MODE_PRIVATE).getString("selectedWebviewPackage", WebViewSelectionActivity.WEBVIEW_PACKAGES[0]);
        Drawable drawable = getDrawableForPackage(packageName);
        if (drawable != null) {
            webViewUpgradePreference.setIcon(drawable);
        }
        else {
            int resId = getResources().getIdentifier(packageName.toLowerCase().replace(".", "_"), "drawable", getContext().getPackageName());
            Drawable defaultDrawable;
            if (resId != 0) {
                // 如果找到了对应包名的图片资源
                defaultDrawable = getResources().getDrawable(resId, null);
            } else {
                // 如果没有找到，则使用默认图标
                defaultDrawable = getResources().getDrawable(com.widget.noname.function.functionlibrary.R.drawable.com_google_android_webview, null);
            }
            webViewUpgradePreference.setIcon(defaultDrawable);
        }
    }

    private Drawable getDrawableForPackage(String packageName) {
        try {
            PackageManager packageManager = getContext().getPackageManager();
            ApplicationInfo appInfo = packageManager.getApplicationInfo(packageName, 0);
            return appInfo.loadIcon(packageManager);
        } catch (PackageManager.NameNotFoundException e) {
            return null;
        }
    }

    // 教程映射表
    private Map<String, String> tutorialMap = new HashMap<String, String>() {{
        put("reset_tutorial_in_launch_activity", TutorialConstant.TUTORIAL_IN_LAUNCH_ACTIVITY);
        put("reset_tutorial_in_function_game_shell", TutorialConstant.TUTORIAL_IN_FUNCTION_GAME_SHELL);
        put("reset_tutorial_in_function_server", TutorialConstant.TUTORIAL_IN_FUNCTION_SERVER);
        put("reset_tutorial_in_import_file_fragment", TutorialConstant.TUTORIAL_IN_FUNCTION_IMPORT_IMPORT_FILE_FRAGMENT);
        put("reset_tutorial_in_manual_directory_select_fragment", TutorialConstant.TUTORIAL_IN_FUNCTION_IMPORT_MANUAL_DIRECTORY_SELECT_FRAGMENT);
        put("reset_tutorial_in_migration_fragment", TutorialConstant.TUTORIAL_IN_FUNCTION_IMPORT_MIGRATION_FRAGMENT);
        put("reset_tutorial_in_asset_fragment", TutorialConstant.TUTORIAL_IN_FUNCTION_VERSION_ASSET_FRAGMENT);
        put("reset_tutorial_in_version_control_fragment", TutorialConstant.TUTORIAL_IN_FUNCTION_VERSION_VERSION_CONTROL_FRAGMENT);
        put("reset_tutorial_in_ext_manage_fragment", TutorialConstant.TUTORIAL_IN_FUNCTION_VERSION_VERSION_EXT_MANAGE_FRAGMENT);
        put("reset_tutorial_in_theme_switch_fragment", TutorialConstant.TUTORIAL_IN_FUNCTION_THEME_THEME_SWITCH_FRAGMENT);
    }};
}

