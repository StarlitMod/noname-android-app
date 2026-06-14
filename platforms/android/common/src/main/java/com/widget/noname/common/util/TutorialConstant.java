package com.widget.noname.common.util;

import android.content.Context;
import android.content.SharedPreferences;
import androidx.annotation.NonNull;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

// 教程常量
public class TutorialConstant {
    // 主页面
    public static final String TUTORIAL_IN_LAUNCH_ACTIVITY = "readTutorialInLaunchActivity";
    // 开始游戏
    public static final String TUTORIAL_IN_FUNCTION_GAME_SHELL = "readTutorialInFunctionGameShell";
    // 导入
    public static final String TUTORIAL_IN_FUNCTION_IMPORT_IMPORT_FILE_FRAGMENT = "readTutorialInImportFileFragment";
    public static final String TUTORIAL_IN_FUNCTION_IMPORT_MANUAL_DIRECTORY_SELECT_FRAGMENT = "readTutorialInManualDirectorySelectFragment";
    public static final String TUTORIAL_IN_FUNCTION_IMPORT_MIGRATION_FRAGMENT = "readTutorialInMigrationFragment";
    // 版本
    public static final String TUTORIAL_IN_FUNCTION_VERSION_ASSET_FRAGMENT = "readTutorialInAssetFragment";
    public static final String TUTORIAL_IN_FUNCTION_VERSION_VERSION_CONTROL_FRAGMENT = "readTutorialInVersionControlFragment";
    public static final String TUTORIAL_IN_FUNCTION_VERSION_VERSION_EXT_MANAGE_FRAGMENT = "readTutorialInExtManageFragment";
    // 联机
    public static final String TUTORIAL_IN_FUNCTION_SERVER = "readTutorialInFunctionServer";
    // 主题
    public static final String TUTORIAL_IN_FUNCTION_THEME_THEME_SWITCH_FRAGMENT = "readTutorialInThemeSwitchFragment";

    // 所有有效的键集合
    private static final Set<String> VALID_KEYS = new HashSet<>(Arrays.asList(
            TUTORIAL_IN_LAUNCH_ACTIVITY,
            TUTORIAL_IN_FUNCTION_GAME_SHELL,
            TUTORIAL_IN_FUNCTION_IMPORT_IMPORT_FILE_FRAGMENT,
            TUTORIAL_IN_FUNCTION_IMPORT_MANUAL_DIRECTORY_SELECT_FRAGMENT,
            TUTORIAL_IN_FUNCTION_IMPORT_MIGRATION_FRAGMENT,
            TUTORIAL_IN_FUNCTION_VERSION_ASSET_FRAGMENT,
            TUTORIAL_IN_FUNCTION_VERSION_VERSION_CONTROL_FRAGMENT,
            TUTORIAL_IN_FUNCTION_VERSION_VERSION_EXT_MANAGE_FRAGMENT,
            TUTORIAL_IN_FUNCTION_SERVER,
            TUTORIAL_IN_FUNCTION_THEME_THEME_SWITCH_FRAGMENT
    ));

    /**
     * 重置教程状态
     * @param key 必须是 TutorialConstant 中定义的常量之一
     * @param context Context 对象
     * @throws IllegalArgumentException 如果传入的键无效
     */
    public static void resetTutorial(@NonNull String key, @NonNull Context context) {
        if (!VALID_KEYS.contains(key)) {
            throw new IllegalArgumentException("Invalid tutorial key: " + key +
                    ". Must be one of the TutorialConstant fields.");
        }
        SharedPreferences prefs = context.getSharedPreferences("nonameyuri", Context.MODE_PRIVATE);
        prefs.edit().putBoolean(key, false).apply();
    }

    /**
     * 关闭所有教程（将所有教程状态设为已完成）
     * @param context Context 对象
     */
    public static void disableAllTutorials(@NonNull Context context) {
        SharedPreferences prefs = context.getSharedPreferences("nonameyuri", Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = prefs.edit();
        for (String key : VALID_KEYS) {
            editor.putBoolean(key, true);
        }
        editor.apply();
    }
}