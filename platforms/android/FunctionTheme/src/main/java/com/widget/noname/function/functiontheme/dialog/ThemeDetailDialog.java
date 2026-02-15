package com.widget.noname.function.functiontheme.dialog;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.pm.ApplicationInfo;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Handler;
import android.text.TextUtils;
import android.util.Log;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.appcompat.widget.AppCompatButton;
import androidx.media3.common.MediaItem;
import androidx.media3.common.PlaybackException;
import androidx.media3.common.Player;
import androidx.media3.exoplayer.ExoPlayer;
import androidx.media3.ui.PlayerView;
import androidx.recyclerview.widget.RecyclerView;
import androidx.viewpager2.widget.ViewPager2;

import com.alibaba.fastjson.JSONObject;
import com.bumptech.glide.Glide;
import com.bumptech.glide.load.engine.DiskCacheStrategy;
import com.google.android.material.tabs.TabLayout;
import com.google.android.material.tabs.TabLayoutMediator;
import com.kongzue.dialogx.dialogs.FullScreenDialog;
import com.kongzue.dialogx.dialogs.MessageDialog;
import com.kongzue.dialogx.interfaces.OnBindView;
import com.widget.noname.Settings;
import com.widget.noname.function.functiontheme.R;
import com.widget.noname.function.functiontheme.adapter.PreviewImageAdapter;
import com.widget.noname.util.FileUtil;

import java.io.File;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class ThemeDetailDialog {
    private static final String TAG = "ThemeDetailDialog";
    private static Settings.ThemeSettings themeSettings;
    private static JSONObject themeInfo;
    // 存储用户选择的背景图
    private static String selectedBackground;
    private static ExoPlayer videoPlayer;

    public static void show(String themeName) {
        themeSettings = new Settings.ThemeSettings(themeName);
        themeInfo = readManifestFile(themeSettings.getThemeManifestFile());
        Log.e("ThemeDetailDialog", "themeName: " + themeName);
        Log.e("ThemeDetailDialog", "themeInfo: " + themeInfo);

        // 初始化选中的背景图为当前设置
        selectedBackground = getBackgroundFileNameFromPath(themeSettings.getCustomBackgroundPath());

        // 确保之前的播放器已释放
        releaseVideoPlayer();

        FullScreenDialog.show(new OnBindView<>(R.layout.fragment_theme_detail) {
                    @Override
                    public void onBind(FullScreenDialog dialog, View v) {
                        initViews(v, themeName, dialog);
                    }
                })
                .onDismiss(dialog -> {
                    releaseVideoPlayer();
                });
    }

    private static void initViews(View view, String themeName, FullScreenDialog dialog) {
        // 初始化视图
        ViewPager2 viewPagerPreview = view.findViewById(R.id.view_pager_preview);
        TabLayout tabLayoutIndicator = view.findViewById(R.id.tab_layout_indicator);
        TextView tvThemeName = view.findViewById(R.id.tv_theme_name);
        TextView tvAuthor = view.findViewById(R.id.tv_author);
        TextView tvDescription = view.findViewById(R.id.tv_description);
        TextView tvVersion = view.findViewById(R.id.tv_version);
        TextView tvSize = view.findViewById(R.id.tv_size);
        AppCompatButton btnApply = view.findViewById(R.id.btn_apply);
        LinearLayout containerBackgrounds = view.findViewById(R.id.container_backgrounds);

        TextView tvCurrentVideo = view.findViewById(R.id.tv_current_video);
        LinearLayout containerVideoPreview = view.findViewById(R.id.container_video_preview);
        PlayerView playerView = view.findViewById(R.id.player_view);
        // 应用图标容器
        LinearLayout containerAppIcons = view.findViewById(R.id.container_app_icons);

        // 设置主题名称
        tvThemeName.setText(themeName);

        // 加载所有预览图片
        loadAllPreviewImages(viewPagerPreview, tabLayoutIndicator, themeName, view.getContext());

        // 加载主题信息
        loadThemeInfo(view.getContext(), themeName, tvAuthor, tvDescription, tvVersion, tvSize);

        // 初始化背景图选择
        loadBackgroundImages(containerBackgrounds, themeName, view.getContext());

        // 设置视频预览
        setupVideoPreview(playerView, tvCurrentVideo, themeName, view.getContext(), dialog);

        // 加载应用图标预览
        loadAppIconPreview(containerAppIcons, themeName, view.getContext());

        // 设置按钮事件
        setupButtons(btnApply, themeName, dialog);
    }

    private static void loadAllPreviewImages(ViewPager2 viewPager, TabLayout tabLayout,
                                             String themeName, Context context) {
        List<File> previewFiles = getAllPreviewImageFiles(context, themeName);
        Log.e(TAG, "themeName: " + themeName  + ", previewFiles: " + previewFiles);
        if (previewFiles.isEmpty()) {
            // 如果没有预览图，显示默认图片
            ImageView defaultImageView = new ImageView(context);
            defaultImageView.setLayoutParams(new ViewGroup.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT,
                    ViewGroup.LayoutParams.MATCH_PARENT
            ));
            defaultImageView.setScaleType(ImageView.ScaleType.CENTER_CROP);
            File bgFile = new File(themeSettings.getCustomBackgroundPath());
            if (!bgFile.exists() || bgFile.isDirectory()) {
                bgFile = new File(themeSettings.getThemeBackgroundDir(), "background.png");
            }
            if (bgFile.exists()) {
                Glide.with(context)
                        .load(bgFile)
                        .diskCacheStrategy(DiskCacheStrategy.NONE)
                        .error(com.widget.noname.function.functionlibrary.R.drawable.launch_layout_bg)
                        .into(defaultImageView);
            } else {
                Glide.with(context)
                        .load(com.widget.noname.function.functionlibrary.R.drawable.launch_layout_bg)
                        .diskCacheStrategy(DiskCacheStrategy.NONE)
                        .into(defaultImageView);
            }

            // 创建一个简单的适配器
            viewPager.setAdapter(new RecyclerView.Adapter<RecyclerView.ViewHolder>() {
                @NonNull
                @Override
                public RecyclerView.ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
                    return new RecyclerView.ViewHolder(defaultImageView) {};
                }

                @Override
                public void onBindViewHolder(@NonNull RecyclerView.ViewHolder holder, int position) {}

                @Override
                public int getItemCount() {
                    return 1;
                }
            });

        }
        else {
            // 使用适配器显示所有预览图
            PreviewImageAdapter adapter = new PreviewImageAdapter(context, previewFiles);
            viewPager.setAdapter(adapter);

            // 设置指示器
            new TabLayoutMediator(tabLayout, viewPager, (tab, position) -> {
                TextView textView = new TextView(context);
                textView.setText(String.valueOf(position + 1));
                textView.setTextSize(24);
                textView.setTextColor(Color.BLACK);
                textView.setGravity(Gravity.CENTER);

                // 设置到 tab
                tab.setCustomView(textView);
                tab.setContentDescription(context.getString(com.widget.noname.function.functionlibrary.R.string.common_image) + (position + 1));
            }).attach();

            // 设置自动轮播
            setupAutoScroll(viewPager, adapter.getItemCount());
        }
    }

    private static List<File> getAllPreviewImageFiles(Context context, String themeName) {
        List<File> previewFiles = new ArrayList<>();

        File previewDir = themeSettings.getThemePreviewDir();

        if (previewDir.exists() && previewDir.isDirectory()) {
            File[] files = previewDir.listFiles((dir, name) ->
                    name.toLowerCase().endsWith(".jpg") ||
                            name.toLowerCase().endsWith(".jpeg") ||
                            name.toLowerCase().endsWith(".png") ||
                            name.toLowerCase().endsWith(".webp") ||
                            name.toLowerCase().endsWith(".gif"));

            if (files != null) {
                // 按文件名排序
                Arrays.sort(files, (f1, f2) -> f1.getName().compareToIgnoreCase(f2.getName()));
                previewFiles.addAll(Arrays.asList(files));
            }
        }

        return previewFiles;
    }

    private static void setupAutoScroll(ViewPager2 viewPager, int itemCount) {
        if (itemCount <= 1) return;

        final Handler handler = new Handler();
        final Runnable runnable = new Runnable() {
            @Override
            public void run() {
                int currentItem = viewPager.getCurrentItem();
                int nextItem = currentItem + 1;
                if (nextItem >= itemCount) {
                    nextItem = 0;
                }
                viewPager.setCurrentItem(nextItem, true);
                handler.postDelayed(this, 3000); // 3秒切换一次
            }
        };

        viewPager.registerOnPageChangeCallback(new ViewPager2.OnPageChangeCallback() {
            @Override
            public void onPageSelected(int position) {
                handler.removeCallbacks(runnable);
                handler.postDelayed(runnable, 3000);
            }
        });

        // 开始自动轮播
        handler.postDelayed(runnable, 3000);
    }

    private static void loadBackgroundImages(LinearLayout container, String themeName, Context context) {
        List<File> backgroundFiles = getAllBackgroundFiles(context, themeName);

        // 没有背景图，隐藏选择区域
        if (backgroundFiles.isEmpty()) {
            View cardView = (View) container.getParent().getParent();
            cardView.setVisibility(View.GONE);
            return;
        }

        container.removeAllViews();

        for (File backgroundFile : backgroundFiles) {
            View backgroundItem = createBackgroundItemView(context, backgroundFile);
            container.addView(backgroundItem);
        }
    }

    private static List<File> getAllBackgroundFiles(Context context, String themeName) {
        List<File> backgroundFiles = new ArrayList<>();

        File themeBackgroundDir = themeSettings.getThemeBackgroundDir();
        if (themeBackgroundDir.exists() && themeBackgroundDir.isDirectory()) {
            // 获取所有图片文件
            File[] files = themeBackgroundDir.listFiles((dir, name) ->
                    name.toLowerCase().endsWith(".jpg") ||
                            name.toLowerCase().endsWith(".jpeg") ||
                            name.toLowerCase().endsWith(".png") ||
                            name.toLowerCase().endsWith(".webp"));

            if (files != null) {
                // 优先显示默认图片
                List<File> backgroundNamed = new ArrayList<>();
                List<File> otherImages = new ArrayList<>();

                for (File file : files) {
                    String name = file.getName().toLowerCase();
                    if (themeInfo.containsKey("defaultBackgroundImageName") &&
                            name.equals(themeInfo.getString("defaultBackgroundImageName"))) {
                        backgroundNamed.add(file);
                    }
                    else if (name.startsWith("background.png")) {
                        backgroundNamed.add(file);
                    }
                    else {
                        otherImages.add(file);
                    }
                }

                // 按文件名排序
                backgroundNamed.sort((f1, f2) -> f1.getName().compareToIgnoreCase(f2.getName()));
                otherImages.sort((f1, f2) -> f1.getName().compareToIgnoreCase(f2.getName()));

                backgroundFiles.addAll(backgroundNamed);
                backgroundFiles.addAll(otherImages);
            }
        }

        return backgroundFiles;
    }

    private static View createBackgroundItemView(Context context, File backgroundFile) {
        // 创建背景图项布局
        LinearLayout itemLayout = new LinearLayout(context);
        itemLayout.setOrientation(LinearLayout.VERTICAL);
        itemLayout.setPadding(dpToPx(4, context), dpToPx(4, context), dpToPx(4, context), dpToPx(4, context));

        // 图片容器
        FrameLayout imageContainer = new FrameLayout(context);
        int imageSize = dpToPx(80, context);
        LinearLayout.LayoutParams containerParams = new LinearLayout.LayoutParams(imageSize, imageSize);
        containerParams.setMargins(dpToPx(4, context), 0, dpToPx(4, context), 0);
        imageContainer.setLayoutParams(containerParams);

        // 背景图片
        ImageView imageView = new ImageView(context);
        imageView.setLayoutParams(new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
        ));
        imageView.setScaleType(ImageView.ScaleType.CENTER_CROP);
        imageView.setBackgroundResource(R.drawable.bg_item_border);

        // 加载图片
        if (backgroundFile.exists() && backgroundFile.canRead()) {
            // 加载图片
            Glide.with(context)
                    .load(backgroundFile)
                    .diskCacheStrategy(DiskCacheStrategy.NONE)
                    .error(com.widget.noname.function.functionlibrary.R.drawable.launch_layout_bg)
                    .thumbnail(0.1f) // 缩略图
                    .override(imageSize, imageSize)
                    .centerCrop()
                    .into(imageView);
        } else {
            // 文件不存在，加载默认图片
            Glide.with(context)
                    .load(com.widget.noname.function.functionlibrary.R.drawable.launch_layout_bg)
                    .diskCacheStrategy(DiskCacheStrategy.NONE)
                    .override(imageSize, imageSize)
                    .centerCrop()
                    .into(imageView);
        }

        // 选中标记
        ImageView checkIcon = new ImageView(context);
        FrameLayout.LayoutParams checkParams = new FrameLayout.LayoutParams(
                dpToPx(20, context),
                dpToPx(20, context)
        );
        checkParams.gravity = Gravity.TOP | Gravity.RIGHT;
        checkParams.setMargins(0, dpToPx(4, context), dpToPx(4, context), 0);
        checkIcon.setLayoutParams(checkParams);
        checkIcon.setImageResource(R.drawable.ic_check_circle);
        checkIcon.setVisibility(View.GONE);

        // 文件名
        TextView fileNameView = new TextView(context);
        LinearLayout.LayoutParams textParams = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.WRAP_CONTENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        );
        textParams.gravity = Gravity.CENTER_HORIZONTAL;
        textParams.topMargin = dpToPx(4, context);
        fileNameView.setLayoutParams(textParams);
        fileNameView.setText(getShortFileName(backgroundFile.getName()));
        fileNameView.setTextSize(10);
        fileNameView.setTextColor(Color.BLACK);
        fileNameView.setMaxWidth(imageSize);
        fileNameView.setEllipsize(TextUtils.TruncateAt.END);
        fileNameView.setSingleLine(true);

        imageContainer.addView(imageView);
        imageContainer.addView(checkIcon);
        itemLayout.addView(imageContainer);
        itemLayout.addView(fileNameView);

        // 设置点击事件
        itemLayout.setOnClickListener(v -> {
            // 更新选中状态
            selectedBackground = backgroundFile.getName();

            // 更新所有项的选中状态
            updateBackgroundSelection((ViewGroup) itemLayout.getParent());
        });

        // 设置初始选中状态
        if (backgroundFile.getName().equals(selectedBackground)) {
            checkIcon.setVisibility(View.VISIBLE);
            imageView.setBackgroundResource(R.drawable.bg_item_border_selected);
        }

        return itemLayout;
    }

    private static void updateBackgroundSelection(ViewGroup container) {
        for (int i = 0; i < container.getChildCount(); i++) {
            View child = container.getChildAt(i);
            if (child instanceof LinearLayout) {
                LinearLayout itemLayout = (LinearLayout) child;
                FrameLayout imageContainer = (FrameLayout) itemLayout.getChildAt(0);
                ImageView imageView = (ImageView) imageContainer.getChildAt(0);
                ImageView checkIcon = (ImageView) imageContainer.getChildAt(1);

                // 获取文件名
                TextView fileNameView = (TextView) itemLayout.getChildAt(1);
                String fileName = getFullFileName(fileNameView.getText().toString());

                if (fileName.equals(selectedBackground)) {
                    checkIcon.setVisibility(View.VISIBLE);
                    imageView.setBackgroundResource(R.drawable.bg_item_border_selected);
                } else {
                    checkIcon.setVisibility(View.GONE);
                    imageView.setBackgroundResource(R.drawable.bg_item_border);
                }
            }
        }
    }

    private static String getShortFileName(String fileName) {
        if (fileName.length() > 10) {
            return fileName.substring(0, 7) + "...";
        }
        return fileName;
    }

    private static String getFullFileName(String shortName) {
        // 这里需要根据实际逻辑恢复完整文件名
        // 简化处理：存储完整文件名
        return shortName;
    }

    private static String getBackgroundFileNameFromPath(String path) {
        if (path == null || path.isEmpty()) {
            return "";
        }
        File file = new File(path);
        return file.getName();
    }

    private static int dpToPx(int dp, Context context) {
        return (int) (dp * context.getResources().getDisplayMetrics().density);
    }

    private static void setupVideoPreview(PlayerView playerView,
                                          TextView tvCurrentVideo,
                                          String themeName,
                                          Context context,
                                          FullScreenDialog dialog) {

        File videoFile = new File(themeSettings.getCustomVideoPath());

        if (!videoFile.exists()) {
            // 默认值
            videoFile = new File(themeSettings.getThemeVideoDir(), "splash_video.mp4");
        }

        // 显示当前视频文件名
        tvCurrentVideo.setText(context.getString(
                com.widget.noname.function.functionlibrary.R.string.theme_current_video,
                videoFile.getName()));

        try {
            // 初始化 ExoPlayer
            if (videoPlayer == null) {
                videoPlayer = new ExoPlayer.Builder(context).build();
            }

            // 设置播放器到 PlayerView
            playerView.setPlayer(videoPlayer);

            // 设置视频源
            MediaItem mediaItem;

            // 自定义主题：播放文件中的视频
            Uri videoUri;
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                videoUri = androidx.core.content.FileProvider.getUriForFile(
                        context,
                        context.getPackageName() + ".fileprovider",
                        videoFile
                );
            } else {
                videoUri = Uri.fromFile(videoFile);
            }
            mediaItem = MediaItem.fromUri(videoUri);

            // 设置媒体项
            videoPlayer.setMediaItem(mediaItem);
            videoPlayer.prepare();

            // 设置播放器监听器
            videoPlayer.addListener(new Player.Listener() {
                @Override
                public void onPlaybackStateChanged(int playbackState) {
                    if (playbackState == Player.STATE_ENDED) {
                        // 播放结束时重置到开始
                        videoPlayer.seekTo(0);
                        videoPlayer.setPlayWhenReady(false);
                    }
                }

                @Override
                public void onPlayerError(PlaybackException error) {
                    Log.e(TAG, "视频播放错误: " + error.getMessage());
                }
            });

            // 初始状态设置为暂停
            videoPlayer.setPlayWhenReady(false);

        } catch (Exception e) {
            Log.e(TAG, "初始化视频播放器失败", e);
        }
    }

    // 释放播放器资源
    private static void releaseVideoPlayer() {
        if (videoPlayer != null) {
            try {
                videoPlayer.release();
            } catch (Exception e) {
                Log.e(TAG, "释放播放器失败", e);
            } finally {
                videoPlayer = null;
            }
        }
    }

    // 加载应用图标预览
    private static void loadAppIconPreview(LinearLayout container, String themeName, Context context) {
        container.removeAllViews();

        // 从manifest.json读取icon字段
        String iconResourceName = null;
        if (themeInfo != null && themeInfo.containsKey("icon")) {
            iconResourceName = themeInfo.getString("icon");
        }

        String[] iconArray = context.getResources().getStringArray(com.widget.noname.function.functionlibrary.R.array.app_icon_values);
        List<String> iconList = Arrays.asList(iconArray);
        Log.e("iconArray", Arrays.toString(iconArray));
        Log.e("iconResourceName", String.valueOf(iconResourceName));

        if (iconResourceName == null || iconResourceName.isEmpty()) {
            iconResourceName = "ic_launcher";
        }
        else if (!iconList.contains(iconResourceName)) {
            iconResourceName = "ic_launcher";
        }

        View iconItem = createIconPreviewView(context, iconResourceName);
        container.addView(iconItem);
    }

    // 新增：创建图标预览视图
    private static View createIconPreviewView(Context context, String iconResourceName) {
        LinearLayout itemLayout = new LinearLayout(context);
        itemLayout.setOrientation(LinearLayout.VERTICAL);
        itemLayout.setPadding(dpToPx(8, context), dpToPx(8, context), dpToPx(8, context), dpToPx(8, context));

        // 图标容器
        FrameLayout iconContainer = new FrameLayout(context);
        int iconSize = dpToPx(64, context);
        LinearLayout.LayoutParams containerParams = new LinearLayout.LayoutParams(iconSize, iconSize);
        containerParams.gravity = Gravity.CENTER_HORIZONTAL;
        iconContainer.setLayoutParams(containerParams);

        // 应用图标
        ImageView iconView = new ImageView(context);
        iconView.setLayoutParams(new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
        ));
        iconView.setScaleType(ImageView.ScaleType.CENTER_CROP);
        iconView.setBackgroundResource(R.drawable.bg_app_icon_preview);

        // 获取图标资源ID并显示
        int iconResId = getIconResourceId(context, iconResourceName);
        if (iconResId != 0) {
            iconView.setImageResource(iconResId);
        } else {
            // 如果找不到资源，显示默认图标
            iconView.setImageResource(com.widget.noname.function.functionlibrary.R.mipmap.ic_launcher);
        }

        // 标签
        TextView labelView = new TextView(context);
        LinearLayout.LayoutParams textParams = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.WRAP_CONTENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        );
        textParams.gravity = Gravity.CENTER_HORIZONTAL;
        textParams.topMargin = dpToPx(8, context);
        labelView.setLayoutParams(textParams);
        labelView.setText(context.getString(com.widget.noname.function.functionlibrary.R.string.theme_app_icon));
        labelView.setTextSize(12);
        labelView.setTextColor(Color.BLACK);

        iconContainer.addView(iconView);
        itemLayout.addView(iconContainer);
        itemLayout.addView(labelView);

        return itemLayout;
    }

    private static void loadThemeInfo(Context context, String themeName,
                                      TextView tvAuthor, TextView tvDescription,
                                      TextView tvVersion, TextView tvSize) {
        // 作者信息
        String author = getThemeAuthor(context, themeName);
        tvAuthor.setText(context.getString(com.widget.noname.function.functionlibrary.R.string.theme_author, author));

        // 描述信息
        String description = getThemeDescription(context, themeName);
        tvDescription.setText(description);

        // 版本信息
        String version = getThemeVersion(context, themeName);
        tvVersion.setText(context.getString(com.widget.noname.function.functionlibrary.R.string.theme_version, version));

        // 大小信息
        String size = getThemeSize(context, themeName);
        tvSize.setText(context.getString(com.widget.noname.function.functionlibrary.R.string.theme_size, size));
    }

    private static String getThemeAuthor(Context context, String themeName) {
        if (themeInfo != null) {
            return themeInfo.getString("author");
        }
        return "Unknown";
    }

    private static String getThemeDescription(Context context, String themeName) {
        if (themeInfo != null) {
            return themeInfo.getString("description");
        }
        return context.getString(com.widget.noname.function.functionlibrary.R.string.custom_theme_default_description);
    }

    private static String getThemeVersion(Context context, String themeName) {
        if (themeInfo != null) {
            return themeInfo.getString("version");
        }
        return "1.0";
    }

    private static String getThemeSize(Context context, String themeName) {
        File themeDir = new File(context.getFilesDir(), "theme_package/" + themeName);
        if (themeDir.exists()) {
            long sizeBytes = getFolderSize(themeDir);
            return formatFileSize(sizeBytes);
        }
        return "0 MB";
    }

    private static long getFolderSize(File folder) {
        long size = 0;
        if (folder.exists() && folder.isDirectory()) {
            File[] files = folder.listFiles();
            if (files != null) {
                for (File file : files) {
                    if (file.isDirectory()) {
                        size += getFolderSize(file);
                    } else {
                        size += file.length();
                    }
                }
            }
        }
        return size;
    }

    @SuppressLint("DefaultLocale")
    private static String formatFileSize(long size) {
        if (size <= 0) return "0 B";

        final String[] units = new String[] { "B", "KB", "MB", "GB", "TB" };
        int digitGroups = (int) (Math.log10(size) / Math.log10(1024));
        return String.format("%.1f %s", size / Math.pow(1024, digitGroups), units[digitGroups]);
    }

    private static void setupButtons(AppCompatButton btnApply,
                                     String themeName, FullScreenDialog dialog) {

        // 应用主题按钮
        btnApply.setOnClickListener(v -> {

            // 保存选中的背景图
            if (selectedBackground != null && !selectedBackground.isEmpty()) {
                themeSettings.setCustomBackgroundPath(selectedBackground);
            }

            Settings.setCustomTheme(themeName);

            // 设置应用图标
            if (themeInfo != null && themeInfo.containsKey("icon")) {
                String iconResourceName = themeInfo.getString("icon");
                int iconResId = getIconResourceId(btnApply.getContext(), iconResourceName);
                if (iconResId != 0) {
                    int currentIconResId = getIconResourceId(btnApply.getContext(), Settings.getAppIcon());
                    if (currentIconResId == 0 || currentIconResId != iconResId) {

                        String message = btnApply.getContext().getString(com.widget.noname.function.functionlibrary.R.string.common_info_change_icon_restart);
                        if ((btnApply.getContext().getApplicationInfo().flags & ApplicationInfo.FLAG_DEBUGGABLE) != 0) {
                            message += "\n" + btnApply.getContext().getString(com.widget.noname.function.functionlibrary.R.string.common_warning_debug_mode_icon);
                        }
                        MessageDialog.build()
                                .setTitle(com.widget.noname.function.functionlibrary.R.string.common_tip)
                                .setMessage(message)
                                .setOkButton(android.R.string.ok, (baseDialog, view) -> {
                                    Settings.setAppIcon(iconResourceName);
                                    return false;
                                })
                                .show();
                    }
                }
            }

            // 显示应用成功提示
            com.kongzue.dialogx.dialogs.PopTip.show(
                            btnApply.getContext().getString(com.widget.noname.function.functionlibrary.R.string.theme_applied_successfully))
                    .iconSuccess()
                    .show();

            // 延迟关闭对话框
            btnApply.postDelayed(dialog::dismiss, 800);
        });
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

    private static int getIconResourceId(Context context, String iconValue) {
        if (iconValue == null || iconValue.isEmpty()) {
            return 0;
        }

        try {
            // 处理完整路径，提取文件名（去除扩展名）
            String resourceName = iconValue;

            // 如果是完整路径，提取最后一部分
            if (resourceName.contains("/")) {
                resourceName = resourceName.substring(resourceName.lastIndexOf("/") + 1);
            }

            // 去除文件扩展名
            if (resourceName.contains(".")) {
                resourceName = resourceName.substring(0, resourceName.lastIndexOf("."));
            }

            // 去除可能的前缀
            resourceName = resourceName.replace("@mipmap/", "").replace("@drawable/", "");

            // 查找资源ID
            int resId = context.getResources().getIdentifier(
                    resourceName, "mipmap", context.getPackageName());

            // 如果mipmap中找不到，尝试在drawable中查找
            if (resId == 0) {
                resId = context.getResources().getIdentifier(
                        resourceName, "drawable", context.getPackageName());
            }

            Log.d("IconPicker", "Parsed resource name: " + resourceName + ", Resource ID: " + resId);
            return resId;
        } catch (Exception e) {
            Log.e("IconPicker", "Error parsing icon resource: " + iconValue, e);
            return 0;
        }
    }
}