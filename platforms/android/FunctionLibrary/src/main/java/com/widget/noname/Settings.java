package com.widget.noname;

import static com.kongzue.dialogx.dialogs.PopTip.tip;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Build;
import android.util.Log;
import android.view.View;

import com.kongzue.dialogx.dialogs.MessageDialog;
import com.kongzue.dialogx.dialogs.MessageMenu;
import com.kongzue.dialogx.interfaces.OnMenuButtonClickListener;
import com.kongzue.dialogx.interfaces.OnMenuItemSelectListener;
import com.tencent.mmkv.MMKV;
import com.widget.noname.eventbus.SettingsChangeEvent;
import com.widget.noname.function.functionlibrary.R;
import com.widget.noname.util.DialogXUtil;

import org.greenrobot.eventbus.EventBus;

import java.lang.reflect.Method;
import java.io.File;
import java.util.ArrayList;

public class Settings {
    @SuppressLint("StaticFieldLeak")
    private static final Context context;

    static {
        context = MyApplication.getContext();
    }

    private static final String TAG = "Settings";
    private static final String SETTINGS_MMKV_ID = "app_settings";
    private static final MMKV mmkv = MMKV.mmkvWithID(SETTINGS_MMKV_ID);

    // 更新相关
    public static final String KEY_PRE_UPDATE = "pre_update";

    // webview相关
    public static final String KEY_PROTOCOL = "protocol";
    public static final String KEY_HOSTNAME = "hostname";
    public static final String KEY_DISABLE_LOAD_ASSETS = "disable_load_assets";
    public static final String KEY_DEBUG_MODE = "debug_mode";
    public static final String KEY_COMPATIBILITY_MODE = "compatibility_mode";
    public static final String KEY_FONT_SIZE = "font_size";
    public static final String KEY_WEBVIEW_UPGRADE = "webview_upgrade";

    // 网络相关
    public static final String KEY_GITHUB_ACCELERATION = "github_acceleration";
    public static final String KEY_GITHUB_DOWNLOAD_ACCELERATION = "github_download_acceleration";

    // 功能相关
    public static final String KEY_AUTO_START = "auto_start";
    public static final String KEY_SPLASH_SCREEN = "splash_screen";

    // 主题相关
    public static final String KEY_APP_ICON = "app_icon";
    public static final String KEY_DIALOG_THEME = "dialog_theme";

    // 自定义主题
    public static final String KEY_CUSTOM_THEMES = "custom_themes";
    public static final String KEY_CUSTOM_THEME = "custom_theme";
    public static final String KEY_CUSTOM_VIDEO_PATH = "custom_video_path";
    public static final String KEY_CUSTOM_BACKGROUND_PATH = "custom_background_path";

    // 下载/更新
    public static final String KEY_GIT_CONFIG_NAME = "git_config_name";
    public static final String KEY_GIT_USERNAME = "git_username";
    public static final String KEY_GIT_REPO = "git_repo";
    public static final String KEY_GIT_BRANCH = "git_branch";
    public static final String KEY_GIT_DOWNLOAD_FILE_NAME = "git_download_file_name";

    public static final String DEFAULT_GIT_CONFIG_NAME = "Github";
    public static final String DEFAULT_GIT_USERNAME = "libnoname";
    public static final String DEFAULT_GIT_REPO = "noname";
    public static final String DEFAULT_GIT_BRANCH = "build-output";
    public static final String DEFAULT_GIT_DOWNLOAD_FILE_NAME = "noname.full.zip";

    // 关于
    public static final String KEY_PRIVACY_POLICY = "privacy_policy";

    // 联机
    public static final String KEY_ONLINE_PORT = "online_port";

    // 扩展管理相关
    public static final String KEY_EXTENSION_SORT_TYPE = "extension_sort_type";
    // 导入权限相关
    public static final String KEY_AUTO_FIX_PERMISSIONS = "auto_fix_permissions";

    public static int getOnlinePort() {
        return mmkv.getInt(KEY_ONLINE_PORT, 8080);
    }

    public static void setOnlinePort(int port) {
        mmkv.putInt(KEY_ONLINE_PORT, port);
        EventBus.getDefault().post(new SettingsChangeEvent(KEY_ONLINE_PORT));
    }

    public static boolean getPreUpdate() {
        return mmkv.getBoolean(KEY_PRE_UPDATE, false);
    }

    public static void setPreUpdate(boolean preUpdate) {
        mmkv.putBoolean(KEY_PRE_UPDATE, preUpdate);
        EventBus.getDefault().post(new SettingsChangeEvent(KEY_PRE_UPDATE));
    }

    // 配置file或https协议
    public static String getProtocol() {
        return mmkv.getString(KEY_PROTOCOL, "https");
    }

    public static void setProtocol(String protocol) {
        mmkv.putString(KEY_PROTOCOL, protocol);
        EventBus.getDefault().post(new SettingsChangeEvent(KEY_PROTOCOL));
    }

    // 配置域名，比如localhost
    public static String getHostName() {
        return mmkv.getString(KEY_HOSTNAME, "localhost");
    }

    public static void setHostName(String hostname) {
        mmkv.putString(KEY_HOSTNAME, hostname);
        EventBus.getDefault().post(new SettingsChangeEvent(KEY_HOSTNAME));
    }

    // 配置是否自动启动游戏
    public static boolean getAutoStart() {
        return mmkv.getBoolean(KEY_AUTO_START, false);
    }

    public static void setAutoStart(boolean autoStart) {
        mmkv.putBoolean(KEY_AUTO_START, autoStart);
        EventBus.getDefault().post(new SettingsChangeEvent(KEY_AUTO_START));
    }

    public static int getFontSize() {
        return mmkv.getInt(KEY_FONT_SIZE, 100);
    }

    public static void setFontSize(int fontSize) {
        mmkv.putInt(KEY_FONT_SIZE, fontSize);
        EventBus.getDefault().post(new SettingsChangeEvent(KEY_FONT_SIZE));
    }

    public static boolean getSplashScreen() {
        return mmkv.getBoolean(KEY_SPLASH_SCREEN, true);
    }

    public static void setSplashScreen(boolean splashScreen) {
        mmkv.putBoolean(KEY_SPLASH_SCREEN, splashScreen);
        EventBus.getDefault().post(new SettingsChangeEvent(KEY_SPLASH_SCREEN));
    }

    public static boolean getDisableLoadAssets() {
        return mmkv.getBoolean(KEY_DISABLE_LOAD_ASSETS, false);
    }

    public static void setDisableLoadAssets(boolean disableLoadAssets) {
        mmkv.putBoolean(KEY_DISABLE_LOAD_ASSETS, disableLoadAssets);
        try {
            Class<?> clazz = Class.forName("org.apache.cordova.webviewfilesystemloader.WebViewFileSystemLoader");
            Method method = clazz.getMethod("setLoadAssets", boolean.class);
            method.invoke(null, !disableLoadAssets);
            Log.e(TAG, "Successfully called setLoadAssets(" + !disableLoadAssets + ") via reflection");
        } catch (Exception e) {
            e.printStackTrace();
        }
        EventBus.getDefault().post(new SettingsChangeEvent(KEY_DISABLE_LOAD_ASSETS));
    }

    public static boolean getDebugMode() {
        return mmkv.getBoolean(KEY_DEBUG_MODE, false);
    }

    public static void setDebugMode(boolean debugMode) {
        mmkv.putBoolean(KEY_DEBUG_MODE, debugMode);
        EventBus.getDefault().post(new SettingsChangeEvent(KEY_DEBUG_MODE));
    }
    public static boolean getCompatibilityMode() {
        return mmkv.getBoolean(KEY_COMPATIBILITY_MODE, false);
    }

    public static void setCompatibilityMode(boolean compatibilityMode) {
        mmkv.putBoolean(KEY_COMPATIBILITY_MODE, compatibilityMode);
        EventBus.getDefault().post(new SettingsChangeEvent(KEY_COMPATIBILITY_MODE));
    }

    public static String getAppIcon() {
        return mmkv.getString(KEY_APP_ICON, "ic_launcher");
    }

    public static void setAppIcon(String appIcon) {
        mmkv.putString(KEY_APP_ICON, appIcon);
        EventBus.getDefault().post(new SettingsChangeEvent(KEY_APP_ICON));
    }


    public static String getDialogTheme() {
        return mmkv.getString(KEY_DIALOG_THEME, "com.kongzue.dialogx.style.MaterialStyle");
    }

    public static void setDialogTheme(String dialogTheme) {
        mmkv.putString(KEY_DIALOG_THEME, dialogTheme);
        EventBus.getDefault().post(new SettingsChangeEvent(KEY_DIALOG_THEME));
    }

    public static boolean getGithubAcceleration() {
        return mmkv.getBoolean(KEY_GITHUB_ACCELERATION, true);
    }

    public static void setGithubAcceleration(boolean githubAcceleration) {
        mmkv.putBoolean(KEY_GITHUB_ACCELERATION, githubAcceleration);
        EventBus.getDefault().post(new SettingsChangeEvent(KEY_GITHUB_ACCELERATION));
    }

    public static String getGithubDownloadAcceleration() {
        return mmkv.getString(KEY_GITHUB_DOWNLOAD_ACCELERATION, "https://ghfast.top/");
    }

    public static void setGithubDownloadAcceleration(String githubDownloadAcceleration) {
        mmkv.putString(KEY_GITHUB_DOWNLOAD_ACCELERATION, githubDownloadAcceleration);
        EventBus.getDefault().post(new SettingsChangeEvent(KEY_GITHUB_DOWNLOAD_ACCELERATION));
    }

    // 扩展排序相关
    public enum ExtensionSortType {
        BY_NAME(0),      // 按名称排序
        BY_AUTHOR(1),    // 按作者排序
        BY_VERSION(2);   // 按版本排序

        private final int value;

        ExtensionSortType(int value) {
            this.value = value;
        }

        public int getValue() {
            return value;
        }

        public static ExtensionSortType fromValue(int value) {
            for (ExtensionSortType type : values()) {
                if (type.value == value) {
                    return type;
                }
            }
            return BY_NAME; // 默认返回按名称排序
        }
    }

    public static ExtensionSortType getExtensionSortType() {
        int sortType = mmkv.getInt(KEY_EXTENSION_SORT_TYPE, ExtensionSortType.BY_NAME.getValue());
        return ExtensionSortType.fromValue(sortType);
    }

    public static void setExtensionSortType(ExtensionSortType sortType) {
        mmkv.putInt(KEY_EXTENSION_SORT_TYPE, sortType.getValue());
        EventBus.getDefault().post(new SettingsChangeEvent(KEY_EXTENSION_SORT_TYPE));
    }

    // 权限相关
    public static boolean getAutoFixPermissions() {
        return mmkv.getBoolean(KEY_AUTO_FIX_PERMISSIONS, true);
    }

    public static void setAutoFixPermissions(boolean autoFix) {
        mmkv.putBoolean(KEY_AUTO_FIX_PERMISSIONS, autoFix);
        EventBus.getDefault().post(new SettingsChangeEvent(KEY_AUTO_FIX_PERMISSIONS));
    }

    // 自定义主题相关
    public static ArrayList<String> getAllCustomThemes() {
        ArrayList<String> themes = new ArrayList<>();
        // themes.add(context.getString(R.string.theme_name_default));

        File themePackageDir = new File(context.getFilesDir(), "theme_package");
        if (themePackageDir.exists() && themePackageDir.isDirectory()) {
            File[] subDirs = themePackageDir.listFiles(File::isDirectory);
            if (subDirs != null) {
                for (File dir : subDirs) {
                    if (!themes.contains(dir.getName())) { // 避免重复添加
                        themes.add(dir.getName());
                    }
                }
            }
        }
        return themes;
    }

    public static String getCustomTheme() {
        return mmkv.getString(KEY_CUSTOM_THEME, context.getString(R.string.theme_name_default));
    }

    public static void setCustomTheme(String themeName) {
        mmkv.putString(KEY_CUSTOM_THEME, themeName);
        EventBus.getDefault().post(new SettingsChangeEvent(KEY_CUSTOM_THEME));
    }

    public static class ThemeSettings {
        private final String themeName;
        private final MMKV theme_mmkv;
        private final File theme_dir;
        private final File theme_assets_dir;
        private final File theme_preview_dir;
        private final File theme_video_dir;
        private final File theme_images_dir;
        private final File theme_background_dir;

        public ThemeSettings(String themeName) {
            this.themeName = themeName;
            theme_mmkv = MMKV.mmkvWithID(SETTINGS_MMKV_ID + "_theme_" + themeName);
            theme_dir = new File(new File(context.getFilesDir(), "theme_package"), themeName);
            theme_assets_dir = new File(theme_dir, "assets");
            theme_preview_dir = new File(theme_dir, "preview");
            theme_video_dir = new File(theme_assets_dir, "video");
            theme_images_dir = new File(theme_assets_dir, "images");
            theme_background_dir = new File(theme_images_dir, "background");
        }

        public String getThemeName(String themeName) {
            return themeName;
        }

        public File getThemeDir() {
            return theme_dir;
        }

        public File getThemeAssetsDir() {
            return theme_assets_dir;
        }

        public File getThemePreviewDir() {
            return theme_preview_dir;
        }

        public File getThemeManifestFile() {
            return new File(theme_dir, "manifest.json");
        }

        public File getThemeVideoDir() {
            return theme_video_dir;
        }

        public File getThemeImagesDir() {
            return theme_images_dir;
        }

        public File getThemeBackgroundDir() {
            return theme_background_dir;
        }

        public String getCustomVideoPath() {
            // /data/data/com.widget.noname/files/theme_package/themeName/assets/video/
            String videoName = theme_mmkv.getString(KEY_CUSTOM_VIDEO_PATH, "splash_video.mp4");
            return new File(theme_video_dir, videoName).getAbsolutePath();
        }

        public void setCustomVideoPath(String customVideoPath) {
            theme_mmkv.putString(KEY_CUSTOM_VIDEO_PATH, customVideoPath);
            EventBus.getDefault().post(new SettingsChangeEvent(KEY_CUSTOM_VIDEO_PATH));
        }

        public String getCustomBackgroundPath() {
            // /data/data/com.widget.noname/files/theme_package/themeName/assets/images/background/
            String backgroundName = theme_mmkv.getString(KEY_CUSTOM_BACKGROUND_PATH, "0.jpg");
            return new File(theme_background_dir, backgroundName).getAbsolutePath();
        }

        public void setCustomBackgroundPath(String customBackgroundPath) {
            theme_mmkv.putString(KEY_CUSTOM_BACKGROUND_PATH, customBackgroundPath);
            EventBus.getDefault().post(new SettingsChangeEvent(KEY_CUSTOM_BACKGROUND_PATH));
        }
    }

    // 下载相关
    public static class DownloadSettings {
        private final MMKV download_mmkv;
        public DownloadSettings() {
            download_mmkv = MMKV.mmkvWithID(SETTINGS_MMKV_ID + "_download");
        }
        public String getGitConfigName() {
            return download_mmkv.getString(KEY_GIT_CONFIG_NAME, DEFAULT_GIT_CONFIG_NAME);
        }

        public void setGitConfigName(String configName) {
            download_mmkv.putString(KEY_GIT_CONFIG_NAME, configName);
            EventBus.getDefault().post(new SettingsChangeEvent(KEY_GIT_CONFIG_NAME));
        }

        public String getGitUserName() {
            return download_mmkv.getString(KEY_GIT_USERNAME, DEFAULT_GIT_USERNAME);
        }

        public void setGitUserName(String gitUserName) {
            download_mmkv.putString(KEY_GIT_USERNAME, gitUserName);
            EventBus.getDefault().post(new SettingsChangeEvent(KEY_GIT_USERNAME));
        }
        public String getGitRepo() {
            return download_mmkv.getString(KEY_GIT_REPO, DEFAULT_GIT_REPO);
        }

        public void setGitRepo(String repo) {
            download_mmkv.putString(KEY_GIT_REPO, repo);
            EventBus.getDefault().post(new SettingsChangeEvent(KEY_GIT_REPO));
        }

        public String getGitBranch() {
            return download_mmkv.getString(KEY_GIT_BRANCH, DEFAULT_GIT_BRANCH);
        }

        public void setGitBranch(String repoBranch) {
            download_mmkv.putString(KEY_GIT_BRANCH, repoBranch);
            EventBus.getDefault().post(new SettingsChangeEvent(KEY_GIT_BRANCH));
        }

        /**
         * 下载Releases中某一tag的文件名
         */
        public String getGitDownloadFileName() {
            return download_mmkv.getString(KEY_GIT_DOWNLOAD_FILE_NAME, DEFAULT_GIT_DOWNLOAD_FILE_NAME);
        }

        public void setGitDownloadFileName(String downloadFileName) {
            download_mmkv.putString(KEY_GIT_DOWNLOAD_FILE_NAME, downloadFileName);
            EventBus.getDefault().post(new SettingsChangeEvent(KEY_GIT_DOWNLOAD_FILE_NAME));
        }
    }

    // utils
    public static boolean isValidHostName(String hostName) {
        // 检查域名是否为空
        if (hostName == null || hostName.trim().isEmpty()) {
            return false;
        }

        // 检查是否包含空格等非法字符
        return !hostName.contains(" ") && !hostName.contains("\\") && !hostName.contains("/");
    }

    public static boolean isValidDomain(String domain) {
        if (domain == null || domain.isEmpty()) {
            return false;
        }

        // 域名长度限制
        if (domain.length() > 253) {
            return false;
        }

        // 域名不能以点或连字符开头或结尾
        if (domain.startsWith(".") || domain.endsWith(".") ||
                domain.startsWith("-") || domain.endsWith("-")) {
            return false;
        }

        // 分割域名各部分进行验证
        String[] parts = domain.split("\\.");

        // 至少需要两部分（如 example.com）
        if (parts.length < 2) {
            return false;
        }

        for (String part : parts) {
            // 每部分不能为空且长度不超过63
            if (part.isEmpty() || part.length() > 63) {
                return false;
            }

            // 不能以连字符开头或结尾
            if (part.startsWith("-") || part.endsWith("-")) {
                return false;
            }

            // 只能包含字母、数字和连字符
            if (!part.matches("^[a-zA-Z0-9-]+$")) {
                return false;
            }
        }

        return true;
    }

    public static boolean isValidDomainOrUrl(String input) {
        if (input == null || input.isEmpty()) {
            return false;
        }

        // 如果是完整 URL，提取域名部分
        if (input.startsWith("http://") || input.startsWith("https://")) {
            try {
                java.net.URL parsedUrl = new java.net.URL(input);
                String host = parsedUrl.getHost();
                return isValidDomain(host);
            } catch (Exception e) {
                return false;
            }
        }

        // 否则按普通域名验证
        return isValidDomain(input);
    }

    public static void askForRestart(Context context) {
        MessageDialog.build()
                .setTitle(com.widget.noname.function.functionlibrary.R.string.common_tip)
                .setMessage(R.string.config_info_restart_required)
                .setCancelable(false)
                .setOkButton(android.R.string.ok, (baseDialog, view) -> {
                    restartApp(context);
                    return false;
                })
                .show();
    }

    public static void restartApp(Context context) {
        // Android 12+ (API 31+) 限制了 Process.killProcess() 和 System.exit(0)，
        // 改用 finishAffinity() 清空 Activity 栈 + 启动器重开，确保全新启动。
        if (context instanceof Activity) {
            Activity activity = (Activity) context;
            activity.finishAffinity();
            PackageManager packageManager = activity.getPackageManager();
            Intent launchIntent = packageManager.getLaunchIntentForPackage(activity.getPackageName());
            if (launchIntent != null) {
                launchIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
                activity.startActivity(launchIntent);
            }
        } else {
            // 非 Activity 上下文（Service 等），用旧方案兜底
            PackageManager packageManager = context.getPackageManager();
            Intent launchIntent = packageManager.getLaunchIntentForPackage(context.getPackageName());
            if (launchIntent != null) {
                launchIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
                context.startActivity(launchIntent);
            }
            android.os.Process.killProcess(android.os.Process.myPid());
        }
    }

    public static void restartActivity(Activity activity) {
        // 使用 Android 提供的 recreate() 方法
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.HONEYCOMB) {
            activity.recreate();
        } else {
            // 对于旧版本 Android
            Intent intent = activity.getIntent();
            activity.finish();
            activity.startActivity(intent);
        }
    }

    public static MessageDialog getPrivacyPolicyDialog() {
        return getPrivacyPolicyDialog(context.getString(R.string.permission_dialog_title_privacy_agreement));
    }

    public static MessageDialog getPrivacyPolicyDialog(String title) {
        return DialogXUtil.showReadRequiredDialog(
                        R.string.permission_action_agree,
                        (baseDialog, view) -> {
                            mmkv.putBoolean(KEY_PRIVACY_POLICY, true);
                            return false;
                        },
                        R.string.permission_action_disagree_enter_browse_mode,
                        (baseDialog, view) -> {
                            mmkv.putBoolean(KEY_PRIVACY_POLICY, false);
                            return false;
                        }
                )
                .setTitle(title)
                .setMessage(getPrivacyPolicyContent())
                .setCancelable(false);
    }

    public static boolean hasAgreedToPrivacyPolicy() {
        return mmkv.getBoolean(KEY_PRIVACY_POLICY, false);
    }

    public static int getPrivacyPolicyVersion() {
        return 1;
    }

    private static String getPrivacyPolicyContent() {
        // todo: 最后更新这个
        return context.getString(R.string.permission_content_privacy_agreement_full);
    }

    public static void chooseTheme() {
        ArrayList<String> entries = Settings.getAllCustomThemes();

        final int[] selectedIndex = {entries.indexOf(Settings.getCustomTheme())};
        MessageMenu.show(entries.toArray(new String[0]))
                .setTitle(R.string.theme_title_select)
                .setAutoTintIconInLightOrDarkMode(true)
                .setShowSelectedBackgroundTips(Settings.getDialogTheme().equals("com.kongzue.dialogx.style.MIUIStyle"))
                .setOnMenuItemClickListener(new OnMenuItemSelectListener<>() {
                    @Override
                    public void onOneItemSelect(MessageMenu dialog, CharSequence text, int index, boolean select) {
                        selectedIndex[0] = index;
                    }
                }).setOkButton(android.R.string.ok, new OnMenuButtonClickListener<MessageMenu>() {
                    @Override
                    public boolean onClick(MessageMenu baseDialog, View v) {
                        // 更新当前值
                        var value = entries.get(selectedIndex[0]).toString();
                        Settings.setCustomTheme(value);
                        tip(R.string.theme_settings_toast_changed).iconSuccess().show();
                        return false;
                    }
                })
                .setCancelButton(android.R.string.cancel)
                .setSelection(selectedIndex[0]);
    }
}
