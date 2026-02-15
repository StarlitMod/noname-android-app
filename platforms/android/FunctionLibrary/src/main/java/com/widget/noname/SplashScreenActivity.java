package com.widget.noname;

import static com.kongzue.dialogx.dialogs.PopTip.tip;

import android.Manifest;
import android.app.ActivityOptions;
import android.content.Intent;
import android.media.MediaPlayer;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.WindowManager;
import android.widget.RelativeLayout;
import android.widget.VideoView;

import androidx.appcompat.app.AppCompatActivity;

import com.alibaba.fastjson.JSONObject;
import com.permissionx.guolindev.PermissionX;
import com.widget.noname.function.functionlibrary.R;
import com.widget.noname.util.FileUtil;

import java.io.File;
import java.io.IOException;

public class SplashScreenActivity extends AppCompatActivity {
    protected VideoView videoView;

    protected int default_video_raw = R.raw.splash_video;

    private static JSONObject themeInfo;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        if (Settings.getSplashScreen()) {
            // 启用全屏模式
            enableFullScreen();
            setContentView(R.layout.activity_splash);
            videoView = findViewById(R.id.splash_video_view);
            // 播放视频
            startVideo();
        }
        else {
            startLaunchActivity();
        }
    }

    protected void addEventListener() {
        // 设置视频播放完成监听器
        videoView.setOnCompletionListener(new MediaPlayer.OnCompletionListener() {
            @Override
            public void onCompletion(MediaPlayer mp) {
                startLaunchActivity();
            }
        });

        // 设置视频准备好的监听器
        videoView.setOnPreparedListener(new MediaPlayer.OnPreparedListener() {
            @Override
            public void onPrepared(MediaPlayer mp) {
                // 不循环播放
                mp.setLooping(false);
            }
        });
    }

    protected void setLayoutParams() {
        // 视频不全屏的解决办法
        RelativeLayout.LayoutParams layoutParams = new RelativeLayout.LayoutParams(
                RelativeLayout.LayoutParams.MATCH_PARENT,
                RelativeLayout.LayoutParams.MATCH_PARENT
        );
        layoutParams.addRule(RelativeLayout.ALIGN_PARENT_TOP);
        layoutParams.addRule(RelativeLayout.ALIGN_PARENT_RIGHT);
        layoutParams.addRule(RelativeLayout.ALIGN_PARENT_BOTTOM);
        layoutParams.addRule(RelativeLayout.ALIGN_PARENT_LEFT);

        videoView.setLayoutParams(layoutParams);
    }

    // 设置视频路径（放在 res/raw 目录下）

    protected Uri getUri(int raw) {
        return Uri.parse("android.resource://" + getPackageName() + "/" + raw);
    }

    // 播放自定义视频
    protected Uri getUri(String videoPath) {
        return Uri.parse("file://" + videoPath);
    }

    protected void setVideoURIAndStart() {
        String themeName = Settings.getCustomTheme();
        Settings.ThemeSettings themeSetting = new Settings.ThemeSettings(themeName);
        themeInfo = readManifestFile(themeSetting.getThemeManifestFile());
        if (themeInfo != null) {
            if (themeInfo.containsKey("defaultVideoName")) {
                themeSetting.setCustomVideoPath(themeInfo.getString("defaultVideoName"));
            }
        }
        String videoPath = themeSetting.getCustomVideoPath();
        File videoFile = new File(videoPath);
        if (!videoFile.exists()) {
            // 默认值
            File defaultVideoFile = new File(themeSetting.getThemeVideoDir(), "splash_video.mp4");
            if (!defaultVideoFile.exists()) {
                useDefaultVideo();
                return;
            }
        }
        // 应用私有目录
        if (isInAppPrivateDir(videoPath)) {
            videoView.setVideoURI(getUri(videoPath));
            videoView.start();
        }
        // 请求权限
        else {
            requestStoragePermission(videoPath);
        }
    }

    // 使用默认视频
    private void useDefaultVideo() {
        videoView.setVideoURI(getUri(default_video_raw));
        videoView.start();
    }

    protected void startVideo() {
        addEventListener();
        setLayoutParams();
        setVideoURIAndStart();
    }

    protected void enableFullScreen() {
        // 设置全屏标志
        getWindow().setFlags(
                WindowManager.LayoutParams.FLAG_FULLSCREEN,
                WindowManager.LayoutParams.FLAG_FULLSCREEN
        );

        // 隐藏系统UI以实现真正的全屏效果
        getWindow().getDecorView().setSystemUiVisibility(
                View.SYSTEM_UI_FLAG_LAYOUT_STABLE |
                        View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION |
                        View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN |
                        View.SYSTEM_UI_FLAG_HIDE_NAVIGATION |
                        View.SYSTEM_UI_FLAG_FULLSCREEN |
                        View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
        );
    }

    protected void startLaunchActivity() {
        Intent intent = new Intent(SplashScreenActivity.this, LaunchActivity.class);
        Intent originalIntent = getIntent();
        // 传递所有原始Intent的数据
        if (originalIntent.getData() != null) {
            intent.setData(originalIntent.getData());
        }
        if (originalIntent.getType() != null) {
            intent.setType(originalIntent.getType());
        }
        if (originalIntent.getAction() != null) {
            intent.setAction(originalIntent.getAction());
        }
        if (originalIntent.getExtras() != null) {
            intent.putExtras(originalIntent.getExtras());
        }
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        // 使用 ActivityOptions 设置过渡动画
        ActivityOptions options = ActivityOptions.makeCustomAnimation(this, R.anim.zoom_in, R.anim.zoom_out);
        startActivity(intent, options.toBundle());
        finish();
    }

    /**
     * 检查路径是否在应用私有目录内
     */
    private boolean isInAppPrivateDir(String path) {
        if (path == null || path.isEmpty()) {
            return false;
        }

        // 检查是否在应用私有文件目录
        File privateFilesDir = getFilesDir();
        File privateCacheDir = getCacheDir();
        File externalFilesDir = getExternalFilesDir(null);
        File externalCacheDir = getExternalCacheDir();

        File videoFile = new File(path);

        try {
            return isFileInDirectory(videoFile, privateFilesDir) ||
                    isFileInDirectory(videoFile, privateCacheDir) ||
                    isFileInDirectory(videoFile, externalFilesDir) ||
                    isFileInDirectory(videoFile, externalCacheDir);
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * 检查文件是否在指定目录或其子目录中
     */
    private boolean isFileInDirectory(File file, File directory) {
        if (file == null || directory == null) return false;

        try {
            String filePath = file.getCanonicalPath();
            String dirPath = directory.getCanonicalPath();
            return filePath.startsWith(dirPath);
        } catch (IOException e) {
            return false;
        }
    }

    private void requestStoragePermission(String videoPath) {
        String[] permissions;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            // Android 13 (API 33) 及以上使用新的媒体权限
            permissions = new String[]{Manifest.permission.READ_MEDIA_VIDEO};
        } else {
            // Android 12 及以下使用传统存储权限
            permissions = new String[]{Manifest.permission.READ_EXTERNAL_STORAGE};
        }
        PermissionX.init(this)
                .permissions(permissions)
                .explainReasonBeforeRequest() // 可选：在请求前解释权限用途
                .onExplainRequestReason((scope, deniedList) -> {
                    String message = getString(R.string.permission_require_video_access);
                    String confirmText = getString(R.string.permission_action_agree);
                    String cancelText = getString(R.string.permission_action_disagree);
                    scope.showRequestReasonDialog(deniedList, message, confirmText, cancelText);
                })
                .onForwardToSettings((scope, deniedList) -> {
                    // 当用户选择了"不再询问"后拒绝权限
                    String message = getString(R.string.permission_error_video_permission_denied);
                    String confirmText = getString(R.string.common_action_go_to_settings);
                    String cancelText = getString(android.R.string.cancel);
                    scope.showForwardToSettingsDialog(deniedList, message, confirmText, cancelText);
                })
                .request((allGranted, grantedList, deniedList) -> {
                    if (allGranted) {
                        // 所有权限均被授予，可以执行播放视频操作
                        videoView.setVideoURI(getUri(videoPath));

                    } else {
                        // 有权限被拒绝
                        tip(R.string.permission_require_storage_for_custom_video).iconError().show();
                        videoView.setVideoURI(getUri(default_video_raw));
                    }
                    videoView.start();
                });
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (videoView != null) {
            videoView.stopPlayback();
        }
    }

    private static JSONObject readManifestFile(File manifestFile) {
        if (!manifestFile.exists()) {
            return null;
        }
        try {
            String json = FileUtil.readFileToString(manifestFile);
            return JSONObject.parseObject(json);

        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}

