package com.widget.noname.function.functiontheme.subfragment;

import static android.content.Context.MODE_PRIVATE;
import static com.kongzue.dialogx.dialogs.PopTip.tip;

import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.database.Cursor;
import android.graphics.Rect;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.DocumentsContract;
import android.provider.OpenableColumns;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.widget.AppCompatButton;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.Lifecycle;
import androidx.lifecycle.LifecycleEventObserver;
import androidx.lifecycle.LifecycleOwner;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.kongzue.dialogx.DialogX;
import com.kongzue.dialogx.dialogs.MessageDialog;
import com.kongzue.dialogx.dialogs.PopTip;
import com.kongzue.dialogx.util.DialogListBuilder;
import com.widget.noname.LaunchActivity;
import com.widget.noname.Settings;
import com.widget.noname.TutorialFragment;
import com.widget.noname.eventbus.SettingsChangeEvent;
import com.widget.noname.eventbus.ThemeRefreshEvent;
import com.widget.noname.function.functiontheme.R;
import com.widget.noname.function.functiontheme.adapter.ThemeSwitchAdapter;
import com.widget.noname.function.functiontheme.dialog.ThemeDetailDialog;
import com.widget.noname.util.DialogXUtil;
import com.widget.noname.util.FileUtil;

import org.greenrobot.eventbus.EventBus;
import org.greenrobot.eventbus.Subscribe;
import org.greenrobot.eventbus.ThreadMode;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

public class ThemeSwitchFragment extends TutorialFragment {
    private static final int REQUEST_CODE_PICK_ZIP = 1005;

    private RecyclerView recyclerView;
    private ThemeSwitchAdapter adapter;
    private ArrayList<String> themes = new ArrayList<>();
    private String currentTheme;
    private static final ArrayList<String> defaultThemesName = new ArrayList<>(List.of("原版主题", "小无主题", "教主主题", "默认主题"));

    public ThemeSwitchFragment() {

    }

    @Override
    public void onStart() {
        super.onStart();
        EventBus.getDefault().register(this);
    }

    @Override
    public void onStop() {
        super.onStop();
        EventBus.getDefault().unregister(this);
    }

    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_theme_switch, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        initViews(view);
        loadThemes();
        setupAdapter();
    }

    @Subscribe(threadMode = ThreadMode.MAIN)
    public void onThemeRefreshEvent(ThemeRefreshEvent event) {
        Log.d(TAG, "收到主题刷新事件");
        updateThemes();
    }

    private void initViews(View view) {
        recyclerView = view.findViewById(R.id.recycler_view);

        // 网格布局
        // 横屏时显示2列
        int spanCount = 2;
        recyclerView.setLayoutManager(new GridLayoutManager(requireContext(), spanCount));
        // 添加间距
        int spacing = 25; // dp
        recyclerView.addItemDecoration(new GridSpacingItemDecoration(spanCount, spacing, true));

        AppCompatButton importThemeButton = view.findViewById(R.id.btn_import);
        importThemeButton.setOnClickListener(v -> {
            selectZipFile();
        });
    }

    private void selectZipFile() {
        Intent intent = new Intent(Intent.ACTION_GET_CONTENT);
        intent.setType("application/zip");
        intent.addCategory(Intent.CATEGORY_OPENABLE);

        // 兼容Android 7.0及以上版本
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            intent.putExtra(Intent.EXTRA_ALLOW_MULTIPLE, false);
        }

        try {
            startActivityForResult(
                    Intent.createChooser(intent, "选择ZIP主题包"),
                    REQUEST_CODE_PICK_ZIP
            );
        } catch (ActivityNotFoundException e) {
            tip("未找到文件管理器").iconError().show();
        }
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if (requestCode == REQUEST_CODE_PICK_ZIP && resultCode == Activity.RESULT_OK) {
            if (data != null && data.getData() != null) {
                Uri zipUri = data.getData();
                // 创建Intent传递给LaunchActivity
                Intent launchIntent = new Intent(getActivity(), LaunchActivity.class);
                launchIntent.setAction(Intent.ACTION_VIEW);
                launchIntent.setData(zipUri);
                launchIntent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
                startActivity(launchIntent);
            }
        }
    }

    private void loadThemes() {
        List<String> allThemes = Settings.getAllCustomThemes();
        currentTheme = Settings.getCustomTheme();

        // 使用自定义排序
        allThemes.sort((theme1, theme2) -> {
            // 当前主题排第一
            if (theme1.equals(currentTheme) && !theme2.equals(currentTheme)) {
                return -1;
            }
            if (!theme1.equals(currentTheme) && theme2.equals(currentTheme)) {
                return 1;
            }

            // 默认主题排第二（如果当前主题不是默认主题）
            String defaultTheme = getString(com.widget.noname.function.functionlibrary.R.string.theme_name_default);
            if (theme1.equals(defaultTheme) && !theme2.equals(defaultTheme) && !theme2.equals(currentTheme)) {
                return -1;
            }
            if (!theme1.equals(defaultTheme) && theme2.equals(defaultTheme) && !theme1.equals(currentTheme)) {
                return 1;
            }

            // 其他按字母排序
            return theme1.compareToIgnoreCase(theme2);
        });

        themes = new ArrayList<>(allThemes);
    }

    private void setupAdapter() {
        adapter = new ThemeSwitchAdapter(getContext(), themes, currentTheme);

        adapter.setOnDeleteClickListener((themeName, position) -> {
            if (defaultThemesName.contains(themeName)) {
                PopTip.show(getString(com.widget.noname.function.functionlibrary.R.string.theme_cannot_delete_default)).iconWarning().show();
                return;
            }
            showDeleteConfirmationDialog(themeName, position);
        });

        // 添加item点击事件
        adapter.setOnItemClickListener((themeName, position) -> {
            // 打开主题详情Fragment
            openThemeDetail(themeName);
        });

        recyclerView.setAdapter(adapter);
    }

    private void openThemeDetail(String themeName) {
        ThemeDetailDialog.show(themeName);
    }

    private void showDeleteConfirmationDialog(String themeName, int position) {
        MessageDialog.build()
                .setTitle(getString(com.widget.noname.function.functionlibrary.R.string.theme_delete_title))
                .setMessage(getString(com.widget.noname.function.functionlibrary.R.string.theme_delete_message, themeName))
                .setOkButton(com.widget.noname.function.functionlibrary.R.string.common_action_delete, (dialog, view) -> {
                    deleteTheme(themeName, position);
                    return false;
                })
                .setCancelButton(android.R.string.cancel)
                .show();
    }

    private void deleteTheme(String themeName, int position) {
        try {
            // 删除主题目录
            File themeDir = new File(requireContext().getFilesDir(),
                    "theme_package/" + themeName);

            if (themeDir.exists()) {
                FileUtil.deleteFolderRecursively(themeDir);
                // 从列表中移除
                themes.remove(position);
                adapter.notifyItemRemoved(position);
                PopTip.show(getString(com.widget.noname.function.functionlibrary.R.string.theme_deleted_successfully)).iconSuccess().show();
            } else {
                PopTip.show(getString(com.widget.noname.function.functionlibrary.R.string.theme_delete_failed)).iconError().show();
            }
            // 如果删除的是当前主题，切换回默认主题
            if (themeName.equals(currentTheme)) {
                Settings.setCustomTheme(getString(com.widget.noname.function.functionlibrary.R.string.theme_name_default));
                currentTheme = getString(com.widget.noname.function.functionlibrary.R.string.theme_name_default);
                adapter.setSelectedTheme(currentTheme);
            }
        } catch (Exception e) {
            e.printStackTrace();
            PopTip.show(getString(com.widget.noname.function.functionlibrary.R.string.theme_delete_error)).iconError().show();
        }
    }

    @Override
    protected int getFragmentPosition() {
        return 0;
    }

    @Override
    protected boolean isTutorialCompleted() {
        Context context = this.getContext();
        SharedPreferences prefs = context.getSharedPreferences("nonameyuri", MODE_PRIVATE);
        return prefs.getBoolean("readTutorialInThemeSwitchFragment", false);
    }

    @Override
    protected DialogListBuilder createTutorial() {
        DialogListBuilder builder = DialogX.showDialogList();
        String tutorialTitle = "教程";
        SharedPreferences prefs = getContext().getSharedPreferences("nonameyuri", MODE_PRIVATE);
        SharedPreferences.Editor editor = prefs.edit();

        boolean isBetaVersion = isBetaVersion();
        if (isBetaVersion) {
            builder.add(
                    MessageDialog.build()
                            .setTitle(tutorialTitle + "——主题按钮——主题管理")
                            .setMessage("检测到您是内测版，是否跳过本教程？")
                            .setCancelable(false)
                            .setOkButton(android.R.string.ok, (dialog, v) -> {
                                builder.clear();
                                editor.putBoolean("readTutorialInThemeSwitchFragment", true).apply();
                                return false;
                            })
                            .setCancelButton(android.R.string.cancel)
            );
        }

        MessageDialog dialog1 = MessageDialog.build()
                .setTitle(tutorialTitle + "——主题按钮——主题管理")
                .setMessage("主题管理界面将显示您所有的主题信息。\n您可以点击使用某个主题或**长按删除某个主题**，也可以通过底部按钮或应用外部导入第三方主题。")
                .setCancelable(false)
                .setOkButton(android.R.string.ok);
        DialogXUtil.setupMarkdownForMessage(dialog1);
        builder.add(dialog1);

        MessageDialog dialog2 = MessageDialog.build()
                .setTitle(tutorialTitle + "——主题按钮——主题管理")
                .setMessage("由于主题写法每个版本不固定，您可以通过[项目主页](https://github.com/nonameShijian/noname-android-app)来查看最新版本的主题写法")
                .setCancelable(false)
                .setOkButton(android.R.string.ok);
        DialogXUtil.setupMarkdownForMessage(dialog2);
        builder.add(dialog2);

        builder.add(
                MessageDialog.build()
                        .setTitle(tutorialTitle + "——主题按钮——主题管理")
                        .setMessage("本页面的教程结束，欢迎使用无名杀。")
                        .setCancelable(false)
                        .setOkButton(android.R.string.ok)
                        .onDismiss(dialog -> {
                            editor.putBoolean("readTutorialInThemeSwitchFragment", true).apply();
                        })
        );

        return builder;
    }

    private void updateThemes() {
        // 刷新主题列表
        loadThemes();
        if (adapter != null) {
            adapter.updateThemes(themes, currentTheme);
        }
    }

    @Subscribe(threadMode = ThreadMode.MAIN)
    public void onSettingsChangeEvent(SettingsChangeEvent event) {
        switch (event.getKey()) {
            case Settings.KEY_CUSTOM_THEME:
            case Settings.KEY_CUSTOM_BACKGROUND_PATH: {
                updateThemes();
                break;
            }
        }
    }

    public static class GridSpacingItemDecoration extends RecyclerView.ItemDecoration {
        private final int spanCount;
        private final int spacing;
        private final boolean includeEdge;

        public GridSpacingItemDecoration(int spanCount, int spacing, boolean includeEdge) {
            this.spanCount = spanCount;
            this.spacing = spacing;
            this.includeEdge = includeEdge;
        }

        @Override
        public void getItemOffsets(@NonNull Rect outRect, @NonNull View view, RecyclerView parent, @NonNull RecyclerView.State state) {
            int position = parent.getChildAdapterPosition(view);
            int column = position % spanCount;

            if (includeEdge) {
                outRect.left = spacing - column * spacing / spanCount;
                outRect.right = (column + 1) * spacing / spanCount;
                if (position < spanCount) {
                    outRect.top = spacing;
                }
                outRect.bottom = spacing;
            } else {
                outRect.left = column * spacing / spanCount;
                outRect.right = spacing - (column + 1) * spacing / spanCount;
                if (position >= spanCount) {
                    outRect.top = spacing;
                }
            }
        }
    }
}