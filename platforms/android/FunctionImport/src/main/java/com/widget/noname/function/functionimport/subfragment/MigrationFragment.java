package com.widget.noname.function.functionimport.subfragment;

import static android.content.Context.MODE_PRIVATE;
import static com.kongzue.dialogx.dialogs.PopTip.tip;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;

import androidx.documentfile.provider.DocumentFile;

import com.kongzue.dialogx.DialogX;
import com.kongzue.dialogx.dialogs.CustomDialog;
import com.kongzue.dialogx.dialogs.GuideDialog;
import com.kongzue.dialogx.dialogs.MessageDialog;
import com.kongzue.dialogx.dialogs.MessageMenu;
import com.kongzue.dialogx.dialogs.WaitDialog;
import com.kongzue.dialogx.interfaces.OnMenuButtonClickListener;
import com.kongzue.dialogx.util.DialogListBuilder;
import com.tencent.mmkv.MMKV;
import com.widget.noname.Settings;
import com.widget.noname.TutorialFragment;
import com.widget.noname.common.util.FileConstant;
import com.widget.noname.function.functionimport.R;
import com.widget.noname.util.DialogXUtil;
import com.widget.noname.util.FileUtil;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.atomic.AtomicReference;

/**
 * 迁移数据
 *
 * 旧版app提供了data和android_data目录，前者是旧版app私有目录，后者是旧版app对应的外部存储目录
 */
public class MigrationFragment extends TutorialFragment {
    private static final String TAG = "MigrationFragment";
    private static final int REQUEST_CODE_SELECT_OLD_APP_DIRECTORY = 1004;

    private EditText tabNameEditText;
    private Button selectOldAppDirectoryButton;
    private Button startMigrationButton;
    private Uri selectedOldAppDirectoryUri;
    private String selectedTabName;

    protected int getFragmentPosition() {
        return 2;
    }

    protected DialogListBuilder createTutorial() {
        Context context = this.getContext();
        DialogListBuilder builder = DialogX.showDialogList();
        String tutorialTitle = "教程";
        SharedPreferences prefs = context.getSharedPreferences("nonameyuri", MODE_PRIVATE);
        SharedPreferences.Editor editor = prefs.edit();

        boolean isBetaVersion = isBetaVersion();
        if (isBetaVersion) {
            builder.add(
                    MessageDialog.build()
                            .setTitle(tutorialTitle + "——导入按钮——迁移界面")
                            .setMessage("检测到您是内测版，是否跳过本教程？")
                            .setCancelable(false)
                            .setOkButton(android.R.string.ok, (dialog, v) -> {
                                builder.clear();
                                editor.putBoolean("readTutorialInMigrationFragment", true).apply();
                                return false;
                            })
                            .setCancelButton(android.R.string.cancel)
            );
        }

        builder.add(
                MessageDialog.build()
                        .setTitle(tutorialTitle + "——导入按钮——迁移界面")
                        .setMessage("迁移界面中，您可以从注入文件提供器的诗笺版无名杀或其衍生懒人包中将游戏文件和数据迁移至本应用中。(增强版本体没有注入，其衍生懒人包或许注入了)")
                        .setCancelable(false)
                        .setOkButton(android.R.string.ok)
        );

        builder.add(
                GuideDialog.build()
                        .baseView(tabNameEditText)
                        .setStageLightType(GuideDialog.STAGE_LIGHT_TYPE.RECTANGLE)
                        .setAlign(CustomDialog.ALIGN.TOP_CENTER)
                        .onShow(dialog -> {
                            DialogXUtil.startFlashingAnimation((GuideDialog) dialog, 2); // 闪烁2轮
                        })
        );

        builder.add(
                MessageDialog.build()
                        .setTitle(tutorialTitle + "——导入按钮——迁移界面")
                        .setMessage("在这里输入新的本体的名称，您可以输入任意不重复的名称。迁移功能将创建一个和其它游戏本体数据隔离的新目录。")
                        .setCancelable(false)
                        .setOkButton(android.R.string.ok)
        );

        builder.add(
                GuideDialog.build()
                        .baseView(selectOldAppDirectoryButton)
                        .setStageLightType(GuideDialog.STAGE_LIGHT_TYPE.RECTANGLE)
                        .setAlign(CustomDialog.ALIGN.TOP_CENTER)
                        .onShow(dialog -> {
                            DialogXUtil.startFlashingAnimation((GuideDialog) dialog, 2); // 闪烁2轮
                        })
        );

        builder.add(
                MessageDialog.build()
                        .setTitle(tutorialTitle + "——导入按钮——迁移界面")
                        .setMessage("点击此按钮，将使用SAF框架，进入后，点击左上角的三横，找到其它无名杀目录，点击进入后直接选择“使用此文件夹”即可完成选择。\n存储访问框架 (SAF) 是在 Android 4.4（API 级别 19） 中引入的一种文件访问机制，旨在让用户方便地在不同的存储介质（如内部存储、外部 SD 卡、云存储）之间选择文件或目录。通过 SAF，用户可以使用统一的接口访问各种类型的存储位置，而无需直接依赖底层文件路径。")
                        .setCancelable(false)
                        .setOkButton(android.R.string.ok)
        );

        builder.add(
                GuideDialog.build()
                        .baseView(startMigrationButton)
                        .setStageLightType(GuideDialog.STAGE_LIGHT_TYPE.RECTANGLE)
                        .setAlign(CustomDialog.ALIGN.TOP_CENTER)
                        .onShow(dialog -> {
                            DialogXUtil.startFlashingAnimation((GuideDialog) dialog, 2); // 闪烁2轮
                        })
        );

        builder.add(
                MessageDialog.build()
                        .setTitle(tutorialTitle + "——导入按钮——迁移界面")
                        .setMessage("填写完本体名称以及选择完文件夹后，点击开始迁移。等待迁移前后的提示，按操作完成即可。")
                        .setCancelable(false)
                        .setOkButton(android.R.string.ok)
        );

        builder.add(
                MessageDialog.build()
                        .setTitle(tutorialTitle + "——导入按钮——迁移界面")
                        .setMessage("本页面的教程结束，欢迎使用无名杀。")
                        .setCancelable(false)
                        .setOkButton(android.R.string.ok)
                        .onDismiss(dialog -> {
                            editor.putBoolean("readTutorialInMigrationFragment", true).apply();
                        })
        );

        return builder;
    }

    protected boolean isTutorialCompleted() {
        Context context = this.getContext();
        SharedPreferences prefs = context.getSharedPreferences("nonameyuri", MODE_PRIVATE);
        return prefs.getBoolean("readTutorialInMigrationFragment", false);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.sub_fragment_migration, container, false);

        initViews(view);
        setupListeners();

        return view;
    }

    private void initViews(View view) {
        tabNameEditText = view.findViewById(R.id.tab_name_edit_text);
        selectOldAppDirectoryButton = view.findViewById(R.id.select_old_app_directory_button);
        startMigrationButton = view.findViewById(R.id.start_migration_button);
    }

    private void setupListeners() {
        selectOldAppDirectoryButton.setOnClickListener(v -> selectOldAppDirectory());
        startMigrationButton.setOnClickListener(v -> startMigration());
    }

    private void selectOldAppDirectory() {
        Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT_TREE);
        startActivityForResult(intent, REQUEST_CODE_SELECT_OLD_APP_DIRECTORY);
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == REQUEST_CODE_SELECT_OLD_APP_DIRECTORY && resultCode == Activity.RESULT_OK) {
            if (data != null && data.getData() != null) {
                Uri uri = data.getData();
                if ("com.widget.noname.documents".equals(uri.getAuthority())) {
                    // 来自自己的提供程序
                    tip(com.widget.noname.function.functionlibrary.R.string.common_error_cannot_select_own_app).iconError().show();
                    return;
                }
                selectedOldAppDirectoryUri = data.getData();
                selectOldAppDirectoryButton.setText(com.widget.noname.function.functionlibrary.R.string.migration_status_legacy_selected);
            }
        }
    }

    private void startMigration() {
        if (!Settings.hasAgreedToPrivacyPolicy()) {
            tip(com.widget.noname.function.functionlibrary.R.string.permission_require_privacy_agreement).iconError().show();
            return;
        }
        selectedTabName = tabNameEditText.getText().toString().trim();
        if (selectedTabName.isEmpty()) {
            tip(com.widget.noname.function.functionlibrary.R.string.gamemain_hint_input_new_name).iconError().show();
            return;
        }
        else {
            File dir = new File(getContext().getExternalFilesDir(null), selectedTabName);
            if (dir.exists() && dir.isDirectory()) {
                tip(getString(com.widget.noname.function.functionlibrary.R.string.gamemain_error_already_exists, selectedTabName)).iconError().show();
                return;
            }
        }

        if (selectedOldAppDirectoryUri == null) {
            tip(com.widget.noname.function.functionlibrary.R.string.migration_prompt_select_legacy_directory).iconError().show();
            return;
        }

        MessageDialog.build()
                .setTitle(com.widget.noname.function.functionlibrary.R.string.common_tip)
                .setMessage(com.widget.noname.function.functionlibrary.R.string.migration_warning_webview_version)
                .setCancelable(false)
                .setOkButton(com.widget.noname.function.functionlibrary.R.string.migration_button_continue, (baseDialog, view) -> {
                    performMigration();
                    return false;
                })
                .setCancelButton(android.R.string.cancel)
                .show();
    }

    private void performMigration() {
        WaitDialog.show(com.widget.noname.function.functionlibrary.R.string.migration_progress_data);

        new Thread(() -> {
            try {
                // 执行数据迁移
                boolean success = migrateData();

                requireActivity().runOnUiThread(() -> {
                    if (success) {
                        tip(com.widget.noname.function.functionlibrary.R.string.migration_toast_success).iconSuccess().show();
                        setGamePath();
                        // getParentFragmentManager().popBackStack();
                    } else {
                        tip(com.widget.noname.function.functionlibrary.R.string.migration_error_failed).iconError().show();
                    }
                });
            } catch (Exception e) {
                Log.e(TAG, "数据迁移失败", e);
                requireActivity().runOnUiThread(() -> {
                    tip(getString(com.widget.noname.function.functionlibrary.R.string.migration_error_failed) + ": " + e.getMessage()).iconError().show();
                });
            }
            finally {
                selectedOldAppDirectoryUri = null;
                requireActivity().runOnUiThread(() -> {
                    selectOldAppDirectoryButton.setText(com.widget.noname.function.functionlibrary.R.string.migration_guide_select_provided_directory);
                    WaitDialog.dismiss();
                });
            }
        }).start();
    }

    private boolean migrateData() {
        try {
            // 获取目标目录
            String appPrivateDir = requireContext().getFilesDir().getParent(); // 应用私有目录
            String externalFilesDir = requireContext().getExternalFilesDir(null).getAbsolutePath(); // 外部存储目录

            // 创建目标子目录
            String privateWebViewTarget = appPrivateDir + "/app_webview_" + selectedTabName;
            String externalFilesTarget = externalFilesDir + "/" + selectedTabName;

            File privateWebViewTargetDir = new File(privateWebViewTarget);
            File externalFilesTargetDir = new File(externalFilesTarget);

            // 1. 首先查找并处理变体结构
            List<MigrationVariant> variants = findMigrationVariants();

            if (!variants.isEmpty()) {
                // 如果有多个变体，让用户选择
                if (variants.size() > 1) {
                    final ArrayList<Boolean> migrationCompleted = new ArrayList<>();
                    final AtomicReference<List<MigrationVariant>> variantsRef = new AtomicReference<>(variants);

                    requireActivity().runOnUiThread(() -> {
                        showVariantSelectionDialog(variantsRef.get(), new VariantSelectionCallback() {
                            @Override
                            public void onVariantSelected(MigrationVariant variant) {
                                // 在新线程中执行迁移
                                new Thread(() -> {
                                    if (!privateWebViewTargetDir.exists()) {
                                        privateWebViewTargetDir.mkdirs();
                                    }

                                    if (!externalFilesTargetDir.exists()) {
                                        externalFilesTargetDir.mkdirs();
                                    }
                                    try {
                                        performMigrationWithVariant(variant, privateWebViewTargetDir, externalFilesTargetDir);
                                        migrationCompleted.add(true);
                                    } catch (Exception e) {
                                        Log.e(TAG, "变体迁移失败", e);
                                        requireActivity().runOnUiThread(() -> {
                                            tip(getString(com.widget.noname.function.functionlibrary.R.string.migration_error_failed) + ": " + e.getMessage()).iconError().show();
                                        });
                                    }
                                }).start();
                            }

                            @Override
                            public void onCancelled() {
                                migrationCompleted.add(false);
                            }
                        });
                    });

                    // 等待用户选择
                    while (migrationCompleted.isEmpty()) {
                        Thread.sleep(100);
                    }
                    return migrationCompleted.get(0); // 用户选择了变体或取消了
                } else {
                    if (!privateWebViewTargetDir.exists()) {
                        privateWebViewTargetDir.mkdirs();
                    }

                    if (!externalFilesTargetDir.exists()) {
                        externalFilesTargetDir.mkdirs();
                    }
                    // 只有一个变体，直接迁移
                    MigrationVariant variant = variants.get(0);
                    return performMigrationWithVariant(variant, privateWebViewTargetDir, externalFilesTargetDir);
                }
            }

            // 2. 如果没有找到变体结构，尝试标准结构
            Log.d(TAG, "未找到变体结构，尝试标准结构");
            return migrateStandardStructure(privateWebViewTargetDir, externalFilesTargetDir);
        } catch (Exception e) {
            e.printStackTrace();
            tip(getString(com.widget.noname.function.functionlibrary.R.string.migration_error_failed) + ": " + e.getMessage()).iconError().show();
            return false;
        }
    }

    // 查找所有可迁移的变体
    private List<MigrationVariant> findMigrationVariants() {
        List<MigrationVariant> variants = new ArrayList<>();

        try {
            DocumentFile rootDocFile = DocumentFile.fromTreeUri(requireContext(), selectedOldAppDirectoryUri);
            if (rootDocFile == null || !rootDocFile.exists()) {
                Log.w(TAG, "根目录不存在");
                return variants;
            }

            // 查找 data 目录
            DocumentFile dataDir = rootDocFile.findFile("data");
            if (dataDir == null || !dataDir.exists()) {
                Log.w(TAG, "未找到 data 目录");
                return variants;
            }

            // 查找所有以 app_webview_ 开头的目录
            DocumentFile[] files = dataDir.listFiles();
            if (files != null) {
                for (DocumentFile file : files) {
                    if (file.isDirectory() && file.getName() != null && file.getName().startsWith("app_webview_")) {
                        String variantName = file.getName().substring("app_webview_".length());
                        Log.d(TAG, "发现变体 WebView 目录: " + file.getName() + ", variantName: " + variantName);

                        // 检查对应的 android_data/files/xxx 是否存在
                        Uri androidDataUri = findAndroidDataVariantUri(variantName);
                        if (androidDataUri != null) {
                            variants.add(new MigrationVariant(variantName, file.getUri(), androidDataUri));
                            Log.d(TAG, "找到匹配的变体: " + variantName);
                        } else {
                            Log.d(TAG, "未找到 " + variantName + " 对应的 android_data/files/xxx 目录");
                        }
                    }
                }
            }
        } catch (Exception e) {
            Log.e(TAG, "查找迁移变体失败", e);
        }

        Log.d(TAG, "总共找到 " + variants.size() + " 个变体");
        return variants;
    }

    // 查找对应的 android_data/files/xxx 目录的 URI
    private Uri findAndroidDataVariantUri(String variantName) {
        try {
            DocumentFile rootDocFile = DocumentFile.fromTreeUri(requireContext(), selectedOldAppDirectoryUri);
            if (rootDocFile == null) return null;

            DocumentFile androidDataDir = rootDocFile.findFile("android_data");
            if (androidDataDir == null || !androidDataDir.exists()) {
                Log.w(TAG, "未找到 android_data 目录");
                return null;
            }

            DocumentFile filesDir = androidDataDir.findFile("files");
            if (filesDir == null || !filesDir.exists()) {
                Log.w(TAG, "未找到 android_data/files 目录");
                return null;
            }

            // 查找对应名称的目录
            DocumentFile variantDir = filesDir.findFile(variantName);
            if (variantDir != null && variantDir.exists() && variantDir.isDirectory()) {
                Log.d(TAG, "找到 android_data/files/" + variantName + " 目录");
                return variantDir.getUri();
            }
        } catch (Exception e) {
            Log.e(TAG, "查找 Android 数据变体失败: " + variantName, e);
        }

        return null;
    }

    // 使用选中的变体进行迁移
    private boolean performMigrationWithVariant(MigrationVariant variant, File privateWebViewTargetDir, File externalFilesTargetDir) {
        long startTime = System.currentTimeMillis();

        try {
            Log.d(TAG, "开始迁移变体: " + variant.name);

            // 复制前记录时间
            long webviewStart = System.currentTimeMillis();
            copyDirectoryRecursive(variant.webviewUri, privateWebViewTargetDir);
            long webviewTime = System.currentTimeMillis() - webviewStart;

            long androidDataStart = System.currentTimeMillis();
            copyDirectoryRecursive(variant.androidDataUri, externalFilesTargetDir);
            long androidDataTime = System.currentTimeMillis() - androidDataStart;

            long totalTime = System.currentTimeMillis() - startTime;
            Log.d(TAG, String.format("变体迁移完成: %s, WebView耗时: %d ms, Android数据耗时: %d ms, 总耗时: %d ms",
                    variant.name, webviewTime, androidDataTime, totalTime));

            return true;
        } catch (Exception e) {
            Log.e(TAG, "变体迁移失败: " + variant.name, e);
            throw new RuntimeException(getString(com.widget.noname.function.functionlibrary.R.string.migration_error_failed) + ": " + e.getMessage(), e);
        }
    }

    // 迁移标准结构
    private boolean migrateStandardStructure(File privateWebViewTargetDir, File externalFilesTargetDir) {
        try {
            Log.d(TAG, "开始迁移标准结构");

            // 复制标准结构的 WebView 数据
            copyWebViewData(privateWebViewTargetDir.getAbsolutePath());

            // 复制标准结构的 Android 数据
            copyAndroidData(externalFilesTargetDir.getAbsolutePath());

            Log.d(TAG, "标准结构迁移完成");
            return true;
        } catch (Exception e) {
            Log.e(TAG, "标准结构迁移失败", e);
            requireActivity().runOnUiThread(() -> {
                tip(getString(com.widget.noname.function.functionlibrary.R.string.migration_error_failed) + ": " + e.getMessage()).iconError().show();
            });
            return false;
        }
    }

    // 显示变体选择对话框
    private void showVariantSelectionDialog(List<MigrationVariant> variants, VariantSelectionCallback callback) {
        String[] variantNames = new String[variants.size()];
        for (int i = 0; i < variants.size(); i++) {
            variantNames[i] = variants.get(i).name;
        }

        MessageMenu menu = MessageMenu.build()
                .setTitle(com.widget.noname.function.functionlibrary.R.string.migration_prompt_select_version)
                .setMenuList(variantNames)
                .setCancelable(false)
                .setOnMenuItemClickListener((dialog, text, index) -> {
                    MigrationVariant selected = variants.get(index);
                    Log.d(TAG, "用户选择了变体: " + selected.name);
                    dialog.dismiss();
                    callback.onVariantSelected(selected);
                    return false;
                })
                .setCancelButton(android.R.string.cancel, (OnMenuButtonClickListener<MessageMenu>) (baseDialog, v) -> {
                    Log.d(TAG, "用户取消了变体选择");
                    callback.onCancelled();
                    return false;
                });

        menu.show();
    }

    private void copyWebViewData(String targetDir) throws IOException {
        // 使用 DocumentFile 查找 data/app_webview 子目录
        DocumentFile rootDocFile = DocumentFile.fromTreeUri(requireContext(), selectedOldAppDirectoryUri);
        if (rootDocFile == null || !rootDocFile.exists()) {
            throw new IOException(getString(com.widget.noname.function.functionlibrary.R.string.common_error_root_not_exist) + ": " + selectedOldAppDirectoryUri.toString());
        }

        // 查找 data 子目录
        DocumentFile dataDir = rootDocFile.findFile("data");
        if (dataDir == null || !dataDir.exists()) {
            throw new IOException(getString(com.widget.noname.function.functionlibrary.R.string.common_error_data_not_found));
        }

        // 查找 app_webview 子目录（标准结构）
        DocumentFile webViewDir = dataDir.findFile("app_webview");
        if (webViewDir == null || !webViewDir.exists()) {
            throw new IOException(getString(com.widget.noname.function.functionlibrary.R.string.common_error_webview_not_found));
        }

        Log.d(TAG, "从" + webViewDir.getUri() + "开始复制 WebView 数据到" + targetDir);
        // 使用 SAF API 递归复制目录
        copyDirectoryRecursive(webViewDir.getUri(), new File(targetDir));
        Log.d(TAG, "复制 WebView 数据完成");
    }

    private void copyAndroidData(String targetDir) throws IOException {
        // 使用 DocumentFile 查找 android_data 子目录
        DocumentFile rootDocFile = DocumentFile.fromTreeUri(requireContext(), selectedOldAppDirectoryUri);
        if (rootDocFile == null || !rootDocFile.exists()) {
            throw new IOException(getString(com.widget.noname.function.functionlibrary.R.string.common_error_root_not_exist) + ": " + selectedOldAppDirectoryUri.toString());
        }

        // 查找 android_data 子目录
        DocumentFile androidDataDir = rootDocFile.findFile("android_data");
        if (androidDataDir == null || !androidDataDir.exists()) {
            throw new IOException(getString(com.widget.noname.function.functionlibrary.R.string.common_error_android_data_not_found));
        }

        Log.d(TAG, "从" + androidDataDir.getUri() + "开始复制 Android 数据到" + targetDir);
        // 使用 SAF API 递归复制目录
        copyDirectoryRecursive(androidDataDir.getUri(), new File(targetDir));
        Log.d(TAG, "复制 Android 数据完成");
    }

    private void copyDirectoryRecursive(Uri sourceUri, File targetDir) throws IOException {
        // 使用 DocumentFile 处理 SAF URI
        DocumentFile sourceDocFile = DocumentFile.fromTreeUri(requireContext(), sourceUri);

        if (sourceDocFile == null || !sourceDocFile.exists()) {
            throw new IOException(getString(com.widget.noname.function.functionlibrary.R.string.common_error_root_not_exist) + ": " + sourceUri);
        }

        // 递归复制目录内容
        copyDocumentFileRecursive(sourceDocFile, targetDir);
    }

    private void copyDocumentFileRecursive(DocumentFile sourceDocFile, File targetDir) throws IOException {
        if (!targetDir.exists()) {
            targetDir.mkdirs();
        }

        // 批量获取所有子项，减少查询次数
        DocumentFile[] children = sourceDocFile.listFiles();
        if (children == null || children.length == 0) {
            return;
        }

        // 先处理目录，再处理文件（可选优化）
        List<DocumentFile> dirs = new ArrayList<>();
        List<DocumentFile> files = new ArrayList<>();

        for (DocumentFile child : children) {
            if (child.isDirectory()) {
                dirs.add(child);
            } else if (child.isFile()) {
                files.add(child);
            }
        }

        File appExternalRoot = requireContext().getExternalFilesDir(null);

        // 批量复制文件
        for (DocumentFile file : files) {
            File targetFile = new File(targetDir, file.getName());
            String relativePath = getRelativePath(targetFile, appExternalRoot);
            Log.e(TAG, "从" + file.getUri() + "开始复制文件到" + relativePath);
            copyDocumentFileToFile(file, targetFile);
        }

        // 递归处理目录
        for (DocumentFile dir : dirs) {
            File targetChild = new File(targetDir, dir.getName());
            String relativePath = getRelativePath(targetChild, appExternalRoot);
            Log.e(TAG, "从" + dir.getUri() + "开始复制目录到" + relativePath);
            requireActivity().runOnUiThread(() ->
                    WaitDialog.show(getString(com.widget.noname.function.functionlibrary.R.string.migration_progress_folder_detail,
                            dir.getName(), relativePath)));
            copyDocumentFileRecursive(dir, targetChild);
        }
    }

    // 计算相对路径的辅助方法
    private String getRelativePath(File targetFile, File baseDir) {
        try {
            String targetPath = targetFile.getAbsolutePath();
            String basePath = baseDir.getAbsolutePath();

            if (targetPath.startsWith(basePath)) {
                // 移除基础路径部分
                String relative = targetPath.substring(basePath.length());
                // 移除开头的路径分隔符（如果有）
                if (relative.startsWith(File.separator)) {
                    relative = relative.substring(1);
                }
                // 如果相对路径为空，说明就是基础目录本身
                return relative.isEmpty() ? "." : relative;
            }
            return targetFile.getName(); // 如果不匹配，回退到文件名
        } catch (Exception e) {
            return targetFile.getName();
        }
    }

    private void copyDocumentFileToFile(DocumentFile sourceFile, File targetFile) throws IOException {
        if (sourceFile == null || !sourceFile.exists()) {
            throw new IOException(getString(com.widget.noname.function.functionlibrary.R.string.common_error_source_not_exist));
        }

        // 使用更大的缓冲区（256KB）
        byte[] buffer = new byte[256 * 1024];
        long startTime = System.currentTimeMillis();

        try (InputStream inputStream = requireContext().getContentResolver().openInputStream(sourceFile.getUri());
             OutputStream outputStream = new FileOutputStream(targetFile)) {

            if (inputStream == null) {
                throw new IOException(getString(com.widget.noname.function.functionlibrary.R.string.common_error_open_input_stream_failed));
            }

            int bytesRead;
            long totalBytes = 0;
            while ((bytesRead = inputStream.read(buffer)) != -1) {
                outputStream.write(buffer, 0, bytesRead);
                totalBytes += bytesRead;
            }

            outputStream.flush();

            // 记录大文件的复制性能
            if (totalBytes > 10 * 1024 * 1024) { // 大于10MB的文件
                long duration = System.currentTimeMillis() - startTime;
                Log.d(TAG, String.format("复制大文件: %s, 大小: %.2f MB, 耗时: %d ms",
                        sourceFile.getName(), totalBytes / (1024.0 * 1024.0), duration));
            }
        } catch (IOException e) {
            Log.e(TAG, "复制文件失败: " + sourceFile.getName(), e);
            throw e;
        }
    }

    private void setGamePath() {
        String path = getContext().getExternalFilesDir(selectedTabName).getAbsolutePath();
        File fileDir = new File(path, "files");
        if (!fileDir.exists()) {
            fileDir.mkdirs();
        }
        File[] files = fileDir.listFiles();

        File configFile = new File(path, "noname.config.txt");
        Log.e("setGamePath files: ", Arrays.toString(files));

        MessageDialog dialog2 = MessageDialog.build()
                .setTitle(com.widget.noname.function.functionlibrary.R.string.common_tip)
                .setMessage(com.widget.noname.function.functionlibrary.R.string.migration_warning_legacy_platform)
                .setCancelable(false)
                .setOkButton(android.R.string.ok, (baseDialog, view) -> false)
                .setCancelButton(android.R.string.cancel);

        MessageDialog dialog3 = MessageDialog.build()
                .setTitle(com.widget.noname.function.functionlibrary.R.string.common_tip)
                .setMessage(getString(com.widget.noname.function.functionlibrary.R.string.gamemain_dialog_confirm_set, selectedTabName, path))
                .setOkButton(android.R.string.ok, (baseDialog, view) -> {
                    MMKV.defaultMMKV().putString(FileConstant.GAME_PATH_KEY, path);
                    tip(com.widget.noname.function.functionlibrary.R.string.gamemain_toast_set_complete).iconSuccess().show();
                    Settings.askForRestart(getContext());
                    return false;
                })
                .setCancelButton(android.R.string.cancel, null);

        if (files != null && files.length > 0) {
            if (configFile.isDirectory()) {
                FileUtil.deleteFolderRecursively(configFile);
            }
            else {
                configFile.delete();
            }
            DialogX.showDialogList(
                    MessageMenu.build()
                            .setMenuList(Arrays.stream(files).map(File::getName).toArray(String[]::new))
                            .setTitle(com.widget.noname.function.functionlibrary.R.string.config_prompt_select_file)
                            .setOnMenuItemClickListener((dialog, text, position) -> {
                                // 把text对应的文件复制到configFile
                                try {
                                    File selectedFile = files[position];
                                    File targetFile = configFile;

                                    // 如果目标文件存在，先删除
                                    if (targetFile.exists()) {
                                        targetFile.delete();
                                    }

                                    // 复制文件
                                    InputStream inputStream = null;
                                    OutputStream outputStream = null;
                                    try {
                                        inputStream = new FileInputStream(selectedFile);
                                        outputStream = new FileOutputStream(targetFile);

                                        byte[] buffer = new byte[8192];
                                        int bytesRead;
                                        while ((bytesRead = inputStream.read(buffer)) != -1) {
                                            outputStream.write(buffer, 0, bytesRead);
                                        }

                                        outputStream.flush();
                                        tip(com.widget.noname.function.functionlibrary.R.string.config_toast_set_success).iconSuccess().show();
                                    } finally {
                                        if (inputStream != null) {
                                            try {
                                                inputStream.close();
                                            } catch (IOException e) {
                                                Log.w(TAG, "关闭输入流时出错", e);
                                            }
                                        }
                                        if (outputStream != null) {
                                            try {
                                                outputStream.close();
                                            } catch (IOException e) {
                                                Log.w(TAG, "关闭输出流时出错", e);
                                            }
                                        }
                                    }
                                } catch (Exception e) {
                                    Log.e(TAG, "复制配置文件失败", e);
                                    tip(getString(com.widget.noname.function.functionlibrary.R.string.config_notification_set_failed) + ": " + e.getMessage()).iconError().show();
                                }
                                return false;
                            }),
                    dialog2,
                    dialog3
            ).show();
        }
        else {
            DialogX.showDialogList(
                    dialog2,
                    dialog3
            ).show();
        }
    }

    // 数据类，存储变体信息
    static class MigrationVariant {
        String name;
        Uri webviewUri;
        Uri androidDataUri;

        MigrationVariant(String name, Uri webviewUri, Uri androidDataUri) {
            this.name = name;
            this.webviewUri = webviewUri;
            this.androidDataUri = androidDataUri;
        }
    }

    // 回调接口，用于处理用户选择
    interface VariantSelectionCallback {
        void onVariantSelected(MigrationVariant variant);
        void onCancelled();
    }
}
