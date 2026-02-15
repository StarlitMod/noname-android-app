package com.widget.noname.theme;

import android.content.Context;

import java.io.File;
import java.util.Map;

/**
 * todo: tabLayout的background也应当可以设置
 * todo: 混搭功能
 * --------------------------------------
 * theme_package/
 * ├── preview/
 * │   └── xx.jpg 截图
 * ├── assets/
 * │   ├── video/
 * │   │  └── splash_video.mp4
 * │   └── images/
 * │      └──background/
 * │         └── background.png
 * ├── res/
 * │   ├── drawable/
 * │   │   └── xxx.xml
 * │   ├── values/
 * │   │   └── xxx.xml
 * │   └── xml/
 * │       └── xxx.xml
 * └── manifest.json (name,version,author,description)
 */
public class ThemeManager {
    private static final String PREF_THEME_CONFIG = "theme_config";
    private static final String KEY_SPLASH_VIDEO = "splash_video";
    private static final String KEY_BACKGROUND_IMAGE = "background_image";
    private static final String KEY_DIALOG_STYLE = "dialog_style";

    public static void init(Context context) {
        // 创建文件夹
        File themeDir = new File(context.getFilesDir(), "theme_package");
        if (!themeDir.exists()) {
            themeDir.mkdirs();
        }
    }

    public static class ThemeConfig {
        public String splashVideoPath;
        public String backgroundImage;
        public String dialogStyle;
        public Map<String, Object> customAttributes;
    }

    public static void applyTheme(Context context, ThemeConfig config) {
        // 应用启动视频
        if (config.splashVideoPath != null) {
            setSplashVideo(config.splashVideoPath);
        }

        // 应用背景图片
        if (config.backgroundImage != null) {
            setBackgroundImage(config.backgroundImage);
        }

        // 应用Dialog样式
        applyDialogStyle(context, config.dialogStyle);
    }

    private static void setSplashVideo(String path) {

    }

    private static void setBackgroundImage(String path) {

    }

    private static void applyDialogStyle(Context context, String styleName) {

    }
}
