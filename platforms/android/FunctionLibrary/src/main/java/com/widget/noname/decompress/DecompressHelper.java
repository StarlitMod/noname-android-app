package com.widget.noname.decompress;

import static android.Manifest.permission.WRITE_EXTERNAL_STORAGE;

import static com.kongzue.dialogx.dialogs.PopTip.tip;

import android.app.Activity;
import android.app.ProgressDialog;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.provider.DocumentsContract;
import android.text.TextUtils;
import android.util.Log;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.RequiresApi;
import androidx.fragment.app.FragmentActivity;

import com.kongzue.dialogx.dialogs.InputDialog;
import com.kongzue.dialogx.dialogs.MessageDialog;
import com.kongzue.dialogx.dialogs.MessageMenu;
import com.kongzue.dialogx.interfaces.OnMenuButtonClickListener;
import com.kongzue.dialogx.interfaces.OnMenuItemSelectListener;
import com.tencent.mmkv.MMKV;
import com.widget.noname.MyApplication;
import com.widget.noname.Settings;
import com.widget.noname.common.util.FileConstant;
import com.widget.noname.function.functionlibrary.R;
import com.widget.noname.function.functionlibrary.config.ImportConfig;
import com.widget.noname.eventbus.ActivityResultEvent;
import com.widget.noname.util.FileUtil;
import com.widget.noname.util.StorageHelper;

import org.greenrobot.eventbus.Subscribe;
import org.greenrobot.eventbus.ThreadMode;

import java.io.File;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

public class DecompressHelper {
    private static final String TAG = "DecompressHelper";
    private final FragmentActivity fragmentActivity;
    private final DecompressCallback callback;
    private final ActivityResultLauncher<String> requestPermissionLauncher;

    /** 要解压的文件uri */
    private Uri sourceUri;

    private static final int REQUEST_CODE_PICK_DIR = 1002;

    public DecompressHelper(FragmentActivity fragment, DecompressCallback callback) {
        this.fragmentActivity = fragment;
        this.callback = callback;

        this.requestPermissionLauncher = fragment.registerForActivityResult(
                new ActivityResultContracts.RequestPermission(),
                isGranted -> {
                    if (isGranted) {
                        handleAfterPermission();
                    } else {
                        callback.onFailure(new Exception(fragment.getString(R.string.permission_error_storage_permission_denied)));
                    }
                }
        );
    }

    /**
     * 接收 Uri
     */
    public void handleUri(Uri uri) {
        if (!Settings.hasAgreedToPrivacyPolicy()) {
            tip(R.string.permission_require_privacy_agreement_for_import).iconError().show(fragmentActivity);
            return;
        }
        this.sourceUri = uri;
        if (uri == null) {
            callback.onFailure(new Exception(fragmentActivity.getString(R.string.common_error_uri_empty)));
            return;
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            // Android 10+：无需权限
            handleAfterPermission();
        } else {
            // Android 9 及以下：需要 WRITE_EXTERNAL_STORAGE
            if (fragmentActivity.checkSelfPermission(WRITE_EXTERNAL_STORAGE) == PackageManager.PERMISSION_GRANTED) {
                handleAfterPermission();
            } else {
                requestPermissionLauncher.launch(WRITE_EXTERNAL_STORAGE);
            }
        }
    }

    private void handleAfterPermission() {
        try {
            // 获取文件名和扩展名
            String fileName = getFileName(sourceUri);
            String ext = getFileExtension(fileName).toLowerCase();
            String gamePath = MMKV.defaultMMKV().getString(FileConstant.GAME_PATH_KEY, null);

            callback.onLog(fragmentActivity.getString(R.string.extract_file_status_recognized, fileName));
            Log.e(TAG, fragmentActivity.getString(R.string.extract_file_status_recognized, fileName));

            // 非压缩包
            if (!"zip".equals(ext) && !"7z".equals(ext) && !"tar".equals(ext) && !"rar".equals(ext)) {
                if (TextUtils.isEmpty(gamePath)) {
                    callback.onFailure(new Exception(fragmentActivity.getString(R.string.extract_error_unsupported_type_no_target)));
                    Log.e(TAG, fragmentActivity.getString(R.string.extract_error_unsupported_type_no_target));
                    return;
                }
            }

            // 输入密码和后续操作
            if ("zip".equals(ext) || "7z".equals(ext) || "rar".equals(ext)) {
                showPasswordInputDialog();
            }
            else {
                handlePasswordInput(null);
            }

        } catch (Exception e) {
            callback.onFailure(e);
            Log.e(TAG, e.getMessage());
        }
    }

    // 输入密码
    private void showPasswordInputDialog() {
        Log.e(TAG, "fragmentActivity: " + fragmentActivity);
        Log.e(TAG, "showPasswordInputDialog");
        InputDialog.build()
                .setTitle(com.widget.noname.function.functionlibrary.R.string.common_tip)
                .setAutoShowInputKeyboard(false)
                .setMessage(R.string.extract_prompt_password_optional)
                .setCancelable(false)
                .setOkButton(android.R.string.ok, (baseDialog, v, password) -> {
                    handlePasswordInput(password);
                    return false;
                })
                .show(fragmentActivity);
    }

    // 输入密码后
    private void handlePasswordInput(String password) {
        try {
            // 获取文件名和扩展名
            String fileName = getFileName(sourceUri);
            String ext = getFileExtension(fileName).toLowerCase();

            InputStream inputStream = fragmentActivity.getContentResolver().openInputStream(sourceUri);
            if (inputStream == null) {
                callback.onFailure(new Exception(fragmentActivity.getString(R.string.common_error_open_input_stream_failed)));
                return;
            }
            DecompressConfig config = new DecompressConfig(fragmentActivity, inputStream, "./");
            if (password != null) config.setPassword(password);
            config.getInputStream().mark(1);

            DecompressManager manager;
            switch (ext) {
                case "zip" -> manager = new DecompressManager(DecompressManager.EngineType.ZIP4J);
                // case "zip" -> manager = new DecompressManager(DecompressManager.EngineType.ZIP);
                case "7z" -> manager = new DecompressManager(DecompressManager.EngineType.SEVENZIP);
                case "tar" -> {
                    callback.onLog(fragmentActivity.getString(R.string.extract_error_tar_no_password));
                    manager = new DecompressManager(DecompressManager.EngineType.TAR);
                }
                case "rar" -> manager = new DecompressManager(DecompressManager.EngineType.RAR);
                default -> {
                    callback.onLog(fragmentActivity.getString(R.string.extract_info_copy_for_unsupported));
                    manager = new DecompressManager(DecompressManager.EngineType.COPY);
                }
            }

            callback.onLog(manager.getEngine().getInfo());

            ProgressDialog progressDialog = new ProgressDialog(fragmentActivity, androidx.appcompat.R.style.Theme_AppCompat_Light_Dialog_Alert);
            progressDialog.setTitle(R.string.common_status_processing);
            progressDialog.setMessage(fragmentActivity.getString(R.string.extract_progress_parsing_type));
            progressDialog.setCancelable(false);
            progressDialog.create();
            progressDialog.show();

            // 带密码的zip耗时长，需要另一个线程执行。
            MyApplication.getThreadPool().execute(() -> {
                callback.onLog(fragmentActivity.getString(R.string.gamemain_progress_load_extension_config));
                List<ImportConfig> importConfigs;
                try {
                    importConfigs = manager.getEngine().getImportConfig(config, callback);
                } catch (Exception e) {
                    e.printStackTrace();
                    callback.onFailure(e);
                    fragmentActivity.runOnUiThread(() -> {
                        // 关闭对话框
                        if (progressDialog.isShowing()) {
                            progressDialog.dismiss();
                        }
                    });
                    return;
                }
                // 切换回主线程
                fragmentActivity.runOnUiThread(() -> {
                    // 关闭对话框
                    if (progressDialog.isShowing()) {
                        progressDialog.dismiss();
                    }
                    // 解析失败，手动确认解压路径
                    if (importConfigs == null) {
                        showFolderNameInputDialog(manager, null, config);
                    }
                    // 单个已确认的
                    else if (importConfigs.size() == 1) {
                        callback.onLog(fragmentActivity.getString(R.string.extract_info_archive_type, importConfigs.get(0).getName()));
                        getExtractPath(manager, importConfigs.get(0), config);
                    }
                    // 多个已确认的
                    else {
                        String[] names = new String[importConfigs.size()];
                        if (names.length == 0) {
                            callback.onFailure(new Exception(fragmentActivity.getString(R.string.extract_error_type_undetermined)));
                            return;
                        }
                        for (int i = 0; i < importConfigs.size(); i++) {
                            names[i] = importConfigs.get(i).getName();
                        }
                        // 如果是本体包和html包，则自动选择本体包
                        if (names.length == 2) {
                            boolean hasMainPackage = false;
                            boolean hasHtmlPackage = false;
                            int mainPackageIndex = -1;

                            for (int i = 0; i < importConfigs.size(); i++) {
                                String configName = importConfigs.get(i).getName();
                                if ("无名杀·本体包".equals(configName)) {
                                    hasMainPackage = true;
                                    mainPackageIndex = i;
                                } else if ("HTML项目包".equals(configName)) {
                                    hasHtmlPackage = true;
                                }
                            }

                            // 如果同时包含本体包和HTML包，自动选择本体包
                            if (hasMainPackage && hasHtmlPackage) {
                                getExtractPath(manager, importConfigs.get(mainPackageIndex), config);
                                return;
                            }
                        }

                        final int[] selectMenuIndex = {0};
                        MessageMenu.show(names)
                                .setCancelable(false)
                                .setShowSelectedBackgroundTips(true)
                                .setMessage(R.string.extract_warning_confirm_type)
                                .setTitle(R.string.extract_action_select_type)
                                .setOnMenuItemClickListener(new OnMenuItemSelectListener<>() {
                                    @Override
                                    public void onOneItemSelect(MessageMenu dialog, CharSequence text, int index, boolean select) {
                                        selectMenuIndex[0] = index;
                                    }
                                }).setCancelButton(android.R.string.ok, (OnMenuButtonClickListener<MessageMenu>) (baseDialog, v) -> {
                                    callback.onLog(fragmentActivity.getString(R.string.extract_info_archive_type, importConfigs.get(selectMenuIndex[0]).getName()));
                                    getExtractPath(manager, importConfigs.get(selectMenuIndex[0]), config);
                                    return false;
                                }).setSelection(selectMenuIndex[0]);
                    }
                });

            });
        } catch (Exception e) {
            e.printStackTrace();
            callback.onFailure(e);
        }
    }

    private void showFolderNameInputDialog(DecompressManager manager, ImportConfig importConfig, DecompressConfig config) {
        InputDialog.build()
                .setTitle(R.string.import_prompt_input_path)
                .setMessage(R.string.import_info_path_calculation)
                .setAutoShowInputKeyboard(false)
                .setCancelable(false)
                .setOkButton(android.R.string.ok, (baseDialog, v, folderName) -> {
                    if (TextUtils.isEmpty(folderName)) {
                        tip(R.string.common_error_path_empty).iconError().show(fragmentActivity);
                        return true;
                    }
                    File externalFilesDirs = fragmentActivity.getExternalFilesDir(null);
                    File file = new File(externalFilesDirs, folderName);
                    File targetDir = file.getParentFile();

                    try {
                        String canonicalParent = externalFilesDirs.getCanonicalPath();
                        String canonicalChild = file.getCanonicalPath();
                        // file 不是 externalFilesDir 的子目录
                        if (!canonicalChild.startsWith(canonicalParent + File.separator)) {
                            tip(R.string.import_rule_folder_must_in_files).iconError().show(fragmentActivity);
                            return true;
                        }
                    } catch (Exception ignored) {
                        return true;
                    }

                    if (targetDir.exists() && file.exists()) {
                        // 用户选择“重新输入”：重新弹出输入框
                        MessageDialog.build()
                                .setTitle(R.string.common_warning_file_exists)
                                .setMessage(R.string.common_confirm_overwrite_file)
                                .setCancelable(false)
                                .setOkButton(R.string.common_action_overwrite, (baseDialog2, view) -> {
                                    // 用户选择“覆盖”：直接开始解压
                                    config.setExtractPath(file.getAbsolutePath());
                                    startDecompression(manager, importConfig, config);
                                    return false;
                                })
                                .setCancelButton(R.string.common_action_reinput, (baseDialog2, view) -> {
                                    showFolderNameInputDialog(manager, importConfig, config);
                                    return false;
                                })
                                .show(fragmentActivity);
                        return false;
                    }
                    if (!targetDir.exists() && !targetDir.mkdirs()) {
                        tip(R.string.common_error_create_folder_failed).iconError().show(fragmentActivity);
                        return true;
                    }
                    config.setExtractPath(file.getAbsolutePath());
                    startDecompression(manager, importConfig, config);
                    return false;
                })
                .show(fragmentActivity);
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    private void showSAFDirectorySelector() {
        Uri initialUri = Uri.fromFile(fragmentActivity.getExternalFilesDir(null));
        Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT_TREE);
        intent.putExtra(DocumentsContract.EXTRA_INITIAL_URI, initialUri);
        intent.addFlags(Intent.FLAG_GRANT_WRITE_URI_PERMISSION | Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_GRANT_PERSISTABLE_URI_PERMISSION);
        fragmentActivity.startActivityForResult(intent, REQUEST_CODE_PICK_DIR);
    }

    private void getExtractPath(DecompressManager manager, ImportConfig importConfig, DecompressConfig config) {
        // 选择解压到哪个本体
        // 判断本体数量为0，只能导入本体包
        // 如果本体数量大于0，都可以导入，可以选哪个本体，如果是本体包可以新建文件夹
        String gamePath = MMKV.defaultMMKV().getString(FileConstant.GAME_PATH_KEY, null);
        File dir = fragmentActivity.getExternalFilesDir(null);
        File[] files = dir.listFiles();
        if (files == null || files.length == 0) {
            if (
                    !importConfig.getName().equals("无名杀·本体包") &&
                    importConfig.getName().equals("HTML项目包") &&
                    importConfig.getName().equals("主题包")
            ) {
                callback.onLog(fragmentActivity.getString(R.string.extract_error_no_gamemain_limit));
                return;
            }
        }
        // 循环files
        ArrayList<String> titles = new ArrayList<>();
        ArrayList<String> paths = new ArrayList<>();
        for (File item : files) {
            if (!item.exists() || item.isFile()) continue;
            if (!FileUtil.checkIfGamePath(item)) continue;
            String absolutePath = item.getAbsolutePath();
            if (absolutePath.equals(gamePath)) {
                titles.add(fragmentActivity.getString(R.string.import_action_overwrite_version, item.getName()));
            }
            else {
                titles.add(fragmentActivity.getString(R.string.import_action_overwrite_item, item.getName()));
            }
            paths.add(absolutePath);
        }

        // 添加"新增目录"选项
        if (importConfig.getName().equals("无名杀·本体包") || importConfig.getName().equals("HTML项目包")) {
            titles.add(fragmentActivity.getString(R.string.import_action_create_directory));
            paths.add("NEW_DIRECTORY");
        }

        // 直接解压
        if (
                // 只有1个本体目录且不导入本体包时
                (files.length == 1 && gamePath != null && !importConfig.getName().equals("无名杀·本体包"))
                    ||
                // 主题包
                (importConfig.getName().equals("主题包"))
        ) {
            String extractPath = manager.getExtractPath(gamePath, importConfig);
            config.setExtractPath(extractPath);
            startDecompression(manager, importConfig, config);
            return;
        }

        final int[] selectMenuIndex = { paths.contains(gamePath) ? paths.indexOf(gamePath) : 0 };
        MessageMenu.show(titles.toArray(new String[0]))
                .setCancelable(false)
                .setShowSelectedBackgroundTips(true)
                .setMessage(R.string.common_hint_scroll_more)
                .setTitle(fragmentActivity.getString(R.string.import_prompt_select_config_path, importConfig.getName()))
                .setOnMenuItemClickListener(new OnMenuItemSelectListener<>() {
                    @Override
                    public void onOneItemSelect(MessageMenu dialog, CharSequence text, int index, boolean select) {
                        selectMenuIndex[0] = index;
                    }
                }).setCancelButton(android.R.string.ok, (OnMenuButtonClickListener<MessageMenu>) (baseDialog, v) -> {
                    // 选择了某一本体
                    if (!paths.get(selectMenuIndex[0]).equals("NEW_DIRECTORY")) {
                        String basePath = paths.get(selectMenuIndex[0]);
                        String extractPath = manager.getExtractPath(basePath, importConfig);
                        config.setExtractPath(extractPath);
                        startDecompression(manager, importConfig, config);
                    }
                    // 选择了新建本体目录
                    else {
                        createNewPathDialog(manager, importConfig, config);
                    }
                    return false;
                }).setSelection(paths.contains(gamePath) ? paths.indexOf(gamePath) : 0);
    }

    private void createNewPathDialog(DecompressManager manager, ImportConfig importConfig, DecompressConfig config) {
        InputDialog.build()
                .setTitle(R.string.import_action_create_directory)
                .setMessage(R.string.import_prompt_input_directory_name)
                .setAutoShowInputKeyboard(false)
                .setCancelable(false)
                .setOkButton(android.R.string.ok, (baseDialog, v, folderName) -> {
                    if (TextUtils.isEmpty(folderName) || folderName.trim().isEmpty()) {
                        tip(R.string.common_error_folder_name_empty).iconError().show(fragmentActivity);
                        return true;
                    }
                    File externalFilesDirs = fragmentActivity.getExternalFilesDir(null);
                    File targetDir = new File(externalFilesDirs, folderName);

                    try {
                        // 检查文件夹名称是否包含非法字符或路径跳转
                        if (folderName.contains("../") || folderName.contains("..\\") ||
                                folderName.startsWith("/") || folderName.startsWith("\\") ||
                                folderName.contains(File.separator + ".." + File.separator)) {
                            tip(R.string.common_error_folder_name_invalid).iconError().show(fragmentActivity);
                            return true;
                        }

                        // 确保是files的直接子目录（不包含路径分隔符）
                        if (folderName.contains("/") || folderName.contains("\\")) {
                            tip(R.string.common_error_folder_name_invalid).iconError().show(fragmentActivity);
                            return true;
                        }

                        // 无效名称
                        if (".".equals(folderName) || "..".equals(folderName)) {
                            tip(R.string.common_error_folder_name_invalid).iconError().show(fragmentActivity);
                            return true;
                        }
                    } catch (Exception e) {
                        tip(e.getMessage()).iconError().show(fragmentActivity);
                        return true;
                    }

                    if (targetDir.exists()) {
                        tip(R.string.common_warning_folder_exists).iconError().show(fragmentActivity);
                        return true;
                    }
                    if (!targetDir.mkdirs()) {
                        tip(R.string.common_error_create_folder_failed).iconError().show(fragmentActivity);
                        return true;
                    }
                    String basePath = targetDir.getAbsolutePath();
                    String extractPath = manager.getExtractPath(basePath, importConfig);
                    config.setExtractPath(extractPath);
                    startDecompression(manager, importConfig, config);
                    return false;
                })
                .show(fragmentActivity);
    }

    private void startDecompression(DecompressManager manager, ImportConfig importConfig, DecompressConfig config) {
        try {
            manager.startDecompression(config, importConfig, callback);
        } catch (Exception e) {
            e.printStackTrace();
            callback.onFailure(e);
        }
    }

    public static String getFileName(Uri uri) {
        String name = uri.getLastPathSegment();
        if (name != null && name.contains("/")) {
            name = name.substring(name.lastIndexOf("/") + 1);
        }
        return name;
    }

    public static String getFileExtension(String filename) {
        int lastDot = filename.lastIndexOf('.');
        return lastDot > 0 ? filename.substring(lastDot + 1) : "";
    }

    /**
     * 处理 ActivityResultEvent
     */
    @Subscribe(threadMode = ThreadMode.MAIN)
    public void onActivityResultEvent(ActivityResultEvent event) {
        if (event.requestCode == REQUEST_CODE_PICK_DIR) {
            handleDirectorySelection(event.resultCode, event.data);
        }
    }

    /**
     * 处理目录选择结果
     * todo: 解压到saf选择的DocumentFile怎么实现呢
     */
    private void handleDirectorySelection(int resultCode, Intent data) {
        if (resultCode == Activity.RESULT_OK && data != null) {
            Uri treeUri = data.getData();
            if (treeUri == null) return;

            if (!StorageHelper.hasPersistablePermission(fragmentActivity, treeUri)) {
                StorageHelper.takePersistableUriPermission(fragmentActivity, treeUri);
            }

            tip(com.widget.noname.function.functionlibrary.R.string.import_toast_directory_success).iconSuccess().show(fragmentActivity);
            // startDecompression(treeUri.toString());
        } else {
            tip(com.widget.noname.function.functionlibrary.R.string.common_error_no_directory_selected).iconError().show(fragmentActivity);
        }
    }
}
