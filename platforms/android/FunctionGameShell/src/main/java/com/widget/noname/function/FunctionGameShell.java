package com.widget.noname.function;

import static android.content.Context.MODE_PRIVATE;

import android.app.Activity;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;

import androidx.annotation.NonNull;

import static com.kongzue.dialogx.dialogs.PopTip.tip;

import com.kongzue.dialogx.DialogX;
import com.kongzue.dialogx.dialogs.MessageDialog;
import com.kongzue.dialogx.util.DialogListBuilder;
import com.tencent.mmkv.MMKV;
import com.widget.noname.Settings;
import com.widget.noname.common.function.BaseFunction;
import com.widget.noname.common.util.FileConstant;
import com.widget.noname.eventbus.GameStartEvent;

import org.greenrobot.eventbus.EventBus;

import java.io.File;

public class FunctionGameShell extends BaseFunction {
    public FunctionGameShell(@NonNull Context context) {
        super(context);
    }

    @Override
    public boolean hasView() {
        return false;
    }

    private DialogListBuilder createTutorial() {
        Context context = this.getContext();
        DialogListBuilder builder = DialogX.showDialogList();
        String tutorialTitle = "教程";
        SharedPreferences prefs = context.getSharedPreferences("nonameyuri", MODE_PRIVATE);
        SharedPreferences.Editor editor = prefs.edit();
        builder.add(
                MessageDialog.build()
                        .setTitle(tutorialTitle + "——开始按钮")
                        .setMessage("点击开始按钮后，会检测游戏文件，如果配置正确即可启动游戏。")
                        .setCancelable(false)
                        .setOkButton(android.R.string.ok)
        );
        builder.add(
                MessageDialog.build()
                        .setTitle(tutorialTitle + "——开始按钮")
                        .setMessage("设置页面中有“自动进入游戏”设置，开启后，如果配置正确则会立即进入游戏而不是处于主页面。")
                        .setCancelable(false)
                        .setOkButton(android.R.string.ok)
        );
        builder.add(
                MessageDialog.build()
                        .setTitle(tutorialTitle + "——开始按钮")
                        .setMessage("需要注意的是，启动游戏指的是启动你设置为游戏主体的那个HTML项目。\n所以你必须先导入一个完整的HTML项目，再设置为游戏主体，才可以正常启动游戏。\n，如果因您主动导入的任何HTML项目文件造成的任何损失和法律后果，开发者不承担任何责任。")
                        .setCancelable(false)
                        .setOkButton(android.R.string.ok)
        );
        builder.add(
                MessageDialog.build()
                        .setTitle(tutorialTitle + "——开始按钮")
                        .setMessage("您可以通过使用本App打开压缩包的方式导入一个html项目，并且可以在版本按钮的版本子页面设置游戏主体。")
                        .setCancelable(false)
                        .setOkButton(android.R.string.ok)
        );
        builder.add(
                MessageDialog.build()
                        .setTitle(tutorialTitle + "——开始按钮")
                        .setMessage("本页面的教程结束，欢迎使用无名杀。")
                        .setCancelable(false)
                        .setOkButton(android.R.string.ok)
                        .onDismiss(dialog -> {
                            editor.putBoolean("readTutorialInFunctionGameShell", true).apply();
                            checkAndStartGame();
                        })
        );
        return builder;
    }

    private boolean check() {
        if (!Settings.hasAgreedToPrivacyPolicy()) {
            tip(com.widget.noname.function.functionlibrary.R.string.permission_require_privacy_agreement).iconError().show();
            return false;
        }

        String path = MMKV.defaultMMKV().getString(FileConstant.GAME_PATH_KEY, null);

        if (path == null) {
            tip(com.widget.noname.function.functionlibrary.R.string.gamemain_error_not_set).iconError().show();
            return false;
        }

        File gamePath = new File(path);

        if (!gamePath.exists() || !gamePath.isDirectory()) {
            MMKV.defaultMMKV().remove(FileConstant.GAME_PATH_KEY);
            tip(com.widget.noname.function.functionlibrary.R.string.gamemain_error_not_set_or_invalid).iconError().show();
            return false;
        }

        // 判断是否是空文件夹
        if (gamePath.listFiles() == null || gamePath.listFiles().length == 0) {
            MMKV.defaultMMKV().remove(FileConstant.GAME_PATH_KEY);
            tip(com.widget.noname.function.functionlibrary.R.string.gamemain_error_directory_empty).iconError().show();
            return false;
        }

        // 判断里面没有任何html文件，以及game/game.js
        File gameJsFile = new File(gamePath, "game/game.js");
        if (!hasHtmlFiles(gamePath)) {
            if (!gameJsFile.exists()) {
                MMKV.defaultMMKV().remove(FileConstant.GAME_PATH_KEY);
                tip(com.widget.noname.function.functionlibrary.R.string.gamemain_error_missing_required_files).iconError().show();
                return false;
            }
        }

        // 有game/game.js的情况，如果没有importmap.js则创建
        File importmapFile = new File(gamePath, "game/importmap.js");
        if (gameJsFile.exists() && (!importmapFile.exists() || importmapFile.isDirectory())) {
            importmapFile.delete();
            importmapFile.getParentFile().mkdirs();
            try {
                importmapFile.createNewFile();
            } catch (Exception e) {
                e.printStackTrace();
                tip(com.widget.noname.function.functionlibrary.R.string.gamemain_error_create_importmap_failed).iconWarning().show();
            }
        }

        return true;
    }

    private void checkAndStartGame() {
        if (!check()) {
            return;
        }

        // 发送游戏开始事件
        EventBus.getDefault().post(new GameStartEvent("游戏开始"));

        try {
            Intent intent = new Intent();
            intent.setComponent(new ComponentName(getContext().getPackageName(), "com.widget.noname.MainActivity"));
            getContext().startActivity(intent);
            ((Activity) getContext()).overridePendingTransition(com.widget.noname.function.functionlibrary.R.anim.zoom_in, com.widget.noname.function.functionlibrary.R.anim.zoom_out);
        } catch (Exception e) {
            tip(e.getMessage()).iconError().show();
        }
    }

    @Override
    public void onClick() {
        if (!this.getContext().getSharedPreferences("nonameyuri", MODE_PRIVATE).getBoolean("readTutorialInFunctionGameShell", false)) {
            DialogListBuilder builder = createTutorial();
            builder.show();
        } else {
            checkAndStartGame();
        }
    }

    /**
     * 检查目录中是否包含HTML文件
     * @param directory 游戏根目录
     * @return 是否包含HTML文件
     */
    private boolean hasHtmlFiles(File directory) {
        File[] files = directory.listFiles();
        if (files != null) {
            for (File file : files) {
                if (file.isFile() && file.getName().toLowerCase().endsWith(".html")) {
                    return true;
                }
            }
        }
        return false;
    }
}
