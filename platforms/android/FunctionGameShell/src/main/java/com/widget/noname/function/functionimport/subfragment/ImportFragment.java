package com.widget.noname.function.functionimport.subfragment;

import static com.kongzue.dialogx.dialogs.PopTip.tip;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.UriPermission;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.os.Handler;
import android.os.Looper;
import android.provider.DocumentsContract;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.annotation.RequiresApi;
import androidx.documentfile.provider.DocumentFile;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;
import androidx.recyclerview.widget.LinearLayoutManager;

import com.kongzue.dialogx.dialogs.MessageDialog;
import com.permissionx.guolindev.PermissionX;
import com.widget.noname.File;
import com.tencent.mmkv.MMKV;
import com.widget.noname.MyApplication;
import com.widget.noname.Settings;
import com.widget.noname.common.util.FileConstant;
import com.widget.noname.eventbus.ActivityResultEvent;
import com.widget.noname.eventbus.UriReceivedEvent;
import com.widget.noname.util.FileUtil;
import com.widget.noname.util.ShizukuUtil;
import com.widget.noname.util.StorageHelper;
import com.widget.noname.function.functionimport.adapter.ImportViewPagerAdapter;
import com.widget.noname.function.functionlibrary.data.ImportEventViewModel;
import com.widget.noname.function.functionimport.databinding.FileItemViewModel;
import com.widget.noname.function.functionimport.R;
import com.widget.noname.function.functionimport.databinding.SubFragmentImportLayoutBinding;
import com.widget.noname.function.functionimport.listener.ImportItemListener;

import org.greenrobot.eventbus.EventBus;
import org.greenrobot.eventbus.Subscribe;
import org.greenrobot.eventbus.ThreadMode;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class ImportFragment extends Fragment implements View.OnClickListener, ImportItemListener {
    private static final String TAG = "ImportFragment";

    private static final int REQUEST_CODE_PICK_DIR = 1001;

    private String key;

    private SubFragmentImportLayoutBinding binding;

    private ImportViewPagerAdapter adapter;

    private TextView loadingText;

    private ImportEventViewModel viewModel;

    private String getRootPath() {
        return MMKV.defaultMMKV().getString(FileConstant.IMPORT_URI + key, null);
    }

    public ImportFragment() {
        super();
        key = null;
    }

    public ImportFragment(String key) {
        super();
        this.key = key;
    }

    public static ImportFragment newInstance(String key) {
        ImportFragment fragment = new ImportFragment();
        Bundle args = new Bundle();
        args.putString("key", key);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            key = getArguments().getString("key");
        }
        // 注册 EventBus
        EventBus.getDefault().register(this);
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        binding = null;
        // 反注册
        EventBus.getDefault().unregister(this);
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        binding = SubFragmentImportLayoutBinding.inflate(inflater, container, false);
        // binding.setData(data);

        adapter = new ImportViewPagerAdapter(getContext());
        adapter.setItemClickListener(this);

        viewModel = new ViewModelProvider(requireActivity()).get(ImportEventViewModel.class);

        binding.recyclerView.setLayoutManager(new LinearLayoutManager(requireContext()));
        binding.recyclerView.setAdapter(adapter);

        MMKV.defaultMMKV().remove("shizuku_permission_requested_" + key);

        return binding.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        Button startButton = view.findViewById(R.id.import_game_button);
        startButton.setTypeface(MyApplication.getTypeface());
        startButton.setOnClickListener(this);

        loadingText = view.findViewById(R.id.loading_text);
        loadingText.setTypeface(MyApplication.getTypeface());
    }

    @Override
    public void onResume() {
        super.onResume();
        if (adapter.getItemCount() > 0) {
            loadingText.setVisibility(View.GONE);
        } else {
            Button startButton = binding.getRoot().findViewById(R.id.import_game_button);
            onClick(startButton);
        }
    }

    @Override
    public void onClick(View v) {
        if (v.getId() == R.id.import_game_button) {
            loadingText.setVisibility(View.VISIBLE);
            adapter.clearAll();
            // 延迟 100ms 执行
            new Handler(Looper.getMainLooper()).postDelayed(this::autoLoadOrPickDirectory, 50);
        }
    }

    /**
     * 自动加载文件，或提示选择目录
     */
    private void autoLoadOrPickDirectory() {
        if (!Settings.hasAgreedToPrivacyPolicy()) {
            tip(com.widget.noname.function.functionlibrary.R.string.permission_require_privacy_agreement).iconError().show();
            return;
        }
        String importUri = FileConstant.IMPORT_URI + key;
        String uriString = MMKV.defaultMMKV().getString(importUri, null);
        Log.e(TAG, "IMPORT_URI: " + uriString);

        // 判断文件夹是否存在，尝试创建文件夹
        String importPath = FileConstant.IMPORT_PATH + key;
        String pathString = MMKV.defaultMMKV().getString(importPath, null);
        Log.e(TAG, "pathString: " + pathString);
        if (pathString != null && pathString.startsWith(Environment.getExternalStorageDirectory().getAbsolutePath())) {
            File dir = new File(pathString);
            if (!dir.exists()) {
                if (!dir.mkdirs()) {
                    Log.e(TAG, "创建文件夹失败: " + uriString);
                }
                else {
                    Log.e(TAG, "创建文件夹成功: " + uriString);
                }
            }
            else {
                Log.e(TAG, "文件/文件夹已存在: " + uriString);
            }
        }

        if (uriString != null && !uriString.trim().isEmpty()) {
            Uri treeUri = Uri.parse(uriString);
            // 检查是否已有持久化读写权限
            // todo: 后续可以在设置中做个取消所有saf授权的操作
            // if (false) {
            if (hasPersistablePermission(treeUri)) {
                // 权限已获取，直接加载
                loadFiles(treeUri);
            }
            else if (treeUri.toString().startsWith("file://")) {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                    if (ShizukuUtil.checkPermission()) {
                        loadFiles(treeUri);
                    }
                    // shizuku权限申请同意或拒绝后，都会重新执行这个方法
                    // 不通过onclick走到这就没必要继续申请了
                    else if (!MMKV.defaultMMKV().getBoolean("shizuku_permission_requested_" + key, false)) {
                        MMKV.defaultMMKV().putBoolean("shizuku_permission_requested_" + key, true);
                        ShizukuUtil.registerServiceConnection(callback);
                        ShizukuUtil.requestShizukuPermission();
                    }
                    else {
                        MMKV.defaultMMKV().remove("shizuku_permission_requested_" + key);
                    }
                }
                else {
                    PermissionX.init(this)
                            .permissions(Manifest.permission.READ_EXTERNAL_STORAGE, Manifest.permission.WRITE_EXTERNAL_STORAGE)
                            .request((allGranted, grantedList, deniedList) -> {
                                if (allGranted) {
                                    loadFiles(treeUri);
                                }
                                else {
                                    tip(com.widget.noname.function.functionlibrary.R.string.permission_request_storage).iconError().show();
                                }
                            });
                }
            }
            else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                // 权限丢失或未授予，重新选择
                tip(com.widget.noname.function.functionlibrary.R.string.permission_error_storage_expired).iconError().show();
                startSelectDirectory();
            }
        } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            // 首次使用，未设置路径
            tip(com.widget.noname.function.functionlibrary.R.string.import_prompt_select_directory).iconError().show();
            startSelectDirectory();
        }
    }

    ShizukuUtil.ShizukuServiceCallback callback = new ShizukuUtil.ShizukuServiceCallback() {
        @Override
        public void OnRequestPermissionResult(boolean granted) {
            MMKV.defaultMMKV().putBoolean("shizuku_permission_requested_" + key, !granted);
        }

        @Override
        public void onServiceConnected() {
            ShizukuUtil.unregisterServiceConnection(this);
            String importUri = FileConstant.IMPORT_URI + key;
            String uriString = MMKV.defaultMMKV().getString(importUri, null);
            Uri treeUri = Uri.parse(uriString);
            loadFiles(treeUri);
        }
        @Override
        public void onServiceDisconnected() {
            ShizukuUtil.unregisterServiceConnection(this);
        }
    };

    /**
     * 检查是否已获取该 Uri 的持久化读写权限
     */
    private boolean hasPersistablePermission(Uri uri) {
        Context context = requireContext();

        // 查询当前已授予的权限
        List<UriPermission> persistedUriPermissions =
                context.getContentResolver().getPersistedUriPermissions();

        for (UriPermission perm : persistedUriPermissions) {
            if (perm.getUri().equals(uri) &&
                    perm.isReadPermission() &&
                    perm.isWritePermission()) {
                return true;
            }
        }
        return false;
    }

    /**
     * 启动目录选择
     */
    @RequiresApi(api = Build.VERSION_CODES.O)
    public void startSelectDirectory() {
        String pathKey = FileConstant.IMPORT_PATH + key;
        String path = MMKV.defaultMMKV().getString(pathKey, key);

        MessageDialog messageDialog = MessageDialog.build()
                .setTitle(com.widget.noname.function.functionlibrary.R.string.permission_required_directory_access)
                .setMessage(getContext().getString(com.widget.noname.function.functionlibrary.R.string.migration_dialog_confirm_saf_permission, path))
                .setOkButton(android.R.string.ok, (baseDialog, view) -> {
                    Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT_TREE);

                    // 获取推荐的初始位置（支持 file 和 content）
                    Uri initialUri = StorageHelper.getInitialUri(requireContext(), key);

                    Log.e(TAG, "initialUri: " + initialUri.getEncodedPath());

                    intent.putExtra(DocumentsContract.EXTRA_INITIAL_URI, initialUri);
                    intent.putExtra("android.provider.extra.INITIAL_URI", initialUri); // 兼容性

                    getActivity().startActivityForResult(intent, REQUEST_CODE_PICK_DIR);
                    return false;
                })
                .setCancelButton(android.R.string.cancel);

        messageDialog.show();
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
     */
    private void handleDirectorySelection(int resultCode, Intent data) {
        if (resultCode == Activity.RESULT_OK && data != null) {
            Uri treeUri = data.getData();
            if (treeUri == null) return;
            if (key == null) return;

            // 判断是否和预期目录一致
            String expectedDocId = StorageHelper.getExpectedDocumentId(MMKV.defaultMMKV().getString(FileConstant.IMPORT_PATH + key, ""));
            String actualDocId = StorageHelper.getDocumentIdFromTreeUri(treeUri);
            Log.e(TAG, "expectedDocId: " + expectedDocId);
            Log.e(TAG, "actualDocId: " + actualDocId);

            if (actualDocId != null) {
                // 比较（忽略大小写，路径分隔符）
                String normExpected = expectedDocId.toLowerCase().replace("/", File.separator);
                String normActual = actualDocId.toLowerCase().replace("/", File.separator);

                if (normActual.equals(normExpected)) {
                    tip(com.widget.noname.function.functionlibrary.R.string.import_toast_directory_success).iconSuccess().show();
                    // 获取持久化权限
                    if (!StorageHelper.hasPersistablePermission(requireContext(), treeUri)) {
                        StorageHelper.takePersistableUriPermission(requireContext(), treeUri);
                    }
                } else {
                    String msg = getContext().getString(
                            com.widget.noname.function.functionlibrary.R.string.import_dialog_confirm_directory_mismatch,
                            extractLastPath(actualDocId),
                            extractLastPath(expectedDocId)
                    );
                    tip(msg).iconError().show();
                    Log.w(TAG, msg);
                    return;
                }
            } else {
                tip(com.widget.noname.function.functionlibrary.R.string.import_toast_directory_success).iconSuccess().show();
                // 获取持久化权限
                if (!StorageHelper.hasPersistablePermission(requireContext(), treeUri)) {
                    StorageHelper.takePersistableUriPermission(requireContext(), treeUri);
                }
            }

            // 保存 URI
            String pathKey = FileConstant.IMPORT_URI + key;
            MMKV.defaultMMKV().putString(pathKey, treeUri.toString());

            // 4. 加载文件
            loadFiles(treeUri);
        } else {
            tip(com.widget.noname.function.functionlibrary.R.string.common_error_no_directory_selected).iconError().show();
        }
    }

    /**
     * 提取路径最后一部分用于提示（如 Download/QQ → QQ）
     */
    private String extractLastPath(String docId) {
        int lastColon = docId.lastIndexOf(':');
        int lastSlash = docId.lastIndexOf('/');
        int start = Math.max(lastColon, lastSlash);
        return start != -1 ? docId.substring(start + 1) : docId;
    }

    private void loadFiles(Uri uri) {
        if ("content".equals(uri.getScheme())) {
            DocumentFile documentFile = DocumentFile.fromTreeUri(requireContext(), uri);
            if (documentFile != null) loadFiles(documentFile);
        }
        else if ("file".equals(uri.getScheme())) {
            loadFiles(new File(uri.getPath()));
        }
    }

    private void loadFiles(@NonNull File file) {
        String importPath = FileConstant.IMPORT_PATH + key;
        String pathString = MMKV.defaultMMKV().getString(importPath, null);
        File rootFile = new File(pathString);
        List<FileItemViewModel> viewModels = new ArrayList<>();
        boolean addParent = false;
        try {
            if (!rootFile.getCanonicalPath().equals(file.getCanonicalPath())) {
                addParent = true;
            }
        } catch (Exception e) {
            if (!rootFile.getAbsolutePath().equals(file.getAbsolutePath())) {
                addParent = true;
            }
        }
        if (addParent) {
            FileItemViewModel model = new FileItemViewModel(file.getParentFile());
            model.setFileName("../");
            model.setDirectory(true);
            viewModels.add(model);
        }
        File[] files = file.listFiles();
        if (files != null) {
            for (File f : files) {
                FileItemViewModel model = new FileItemViewModel(f);
                viewModels.add(model);
            }
        }
        adapter.setFiles(viewModels);
        // 如果 adapter 是新创建的，才需要 setAdapter
        if (binding.recyclerView.getAdapter() == null) {
            binding.recyclerView.setAdapter(adapter);
        }
        loadingText.setVisibility(View.GONE);
    }

    private void loadFiles(@NonNull DocumentFile documentFile) {
        Log.e(TAG, "documentFile: " + documentFile.getName());
        Log.e(TAG, "documentFile: " + documentFile.isDirectory());
        Log.e(TAG, "documentFile: " + documentFile.getUri());

        if (documentFile.getName() == null &&
                !documentFile.isDirectory() &&
                !documentFile.getUri().toString().startsWith("content://com.android.externalstorage.documents/")) {
            MessageDialog.build()
                    .setTitle(com.widget.noname.function.functionlibrary.R.string.common_tip)
                    .setMessage(com.widget.noname.function.functionlibrary.R.string.migration_error_app_not_running)
                    .setOkButton(android.R.string.ok)
                    .show();
            return;
        }

        DocumentFile[] files = documentFile.listFiles();
        Uri treeUri = documentFile.getUri();
        List<FileItemViewModel> viewModels = new ArrayList<>();

        // 添加../功能
        // 判断是根目录还是子目录
        Uri rootUri = Uri.parse(getRootPath());
        if (!StorageHelper.isSameDocument(treeUri, rootUri)) {
            DocumentFile parentFile;
            // 使用手动构建的父 URI
            Uri parentUri = getParentUri(treeUri);
            if (parentUri != null) {
                parentFile = DocumentFile.fromTreeUri(requireContext(), parentUri);
                if (parentFile != null) {
                    FileItemViewModel model = new FileItemViewModel(requireContext(), parentFile);
                    model.setFileName("../");
                    model.setDirectory(true);
                    viewModels.add(model);
                }
            } else if (documentFile.getParentFile() != null) {
                parentFile = documentFile.getParentFile();
                FileItemViewModel model = new FileItemViewModel(requireContext(), parentFile);
                model.setFileName("../");
                model.setDirectory(true);
                viewModels.add(model);
                Log.e(TAG, "uri: " + treeUri);
                Log.e(TAG, "getRootPath: " + getRootPath());
                Log.e(TAG, "model.getFilePath: " + model.getFilePath());
            } else {
                Log.e(TAG, "没有parentFile");
                Log.e(TAG, documentFile.getName());
                Log.e(TAG, String.valueOf(documentFile.isDirectory()));
                Log.e(TAG, documentFile.getUri().toString());
            }
        }

        for (Object fileObj : files) {
            FileItemViewModel model;
            if (fileObj instanceof DocumentFile) {
                DocumentFile df = (DocumentFile) fileObj;
                model = new FileItemViewModel(requireContext(), df);
            } else {
                model = new FileItemViewModel((File) fileObj);
            }
            viewModels.add(model);
        }

        adapter.setFiles(viewModels);
        // 如果 adapter 是新创建的，才需要 setAdapter
        if (binding.recyclerView.getAdapter() == null) {
            binding.recyclerView.setAdapter(adapter);
        }

        loadingText.setVisibility(View.GONE);
    }

    private Uri getParentUri(Uri currentUri) {
        try {
            String rootPath = getRootPath();
            if (rootPath == null) {
                return null;
            }

            // 如果 currentUri 就是根路径，直接返回
            if (currentUri.toString().equals(rootPath)) {
                return null;
            }

            if ("content".equals(currentUri.getScheme())) {
                String currentUriStr = currentUri.toString();
                String rootUriStr = rootPath;

                // 查找最后一个 "%2F" (URL编码的/)
                int lastSlash = currentUriStr.lastIndexOf("%2F");
                if (lastSlash == -1) {
                    // 如果没有找到%2F，尝试查找普通/
                    lastSlash = currentUriStr.lastIndexOf('/');
                }

                if (lastSlash > 0) {
                    // 构造父目录 URI
                    String parentUriStr = currentUriStr.substring(0, lastSlash);
                    Log.e(TAG, "currentUriStr: " + currentUriStr);
                    Log.e(TAG, "parentUriStr: " + parentUriStr);
                    return Uri.parse(parentUriStr);
                } else {
                    // 返回根路径
                    return Uri.parse(rootUriStr);
                }
            }
            else if ("file".equals(currentUri.getScheme())) {
                File currentFile = new File(currentUri.getPath());
                File parentFile = currentFile.getParentFile();
                if (parentFile != null) {
                    return Uri.fromFile(parentFile);
                } else {
                    return Uri.parse(rootPath);
                }
            }
        } catch (Exception e) {
            Log.e(TAG, "Error getting parent URI: " + e.getMessage());
        }
        return null;
    }
    @SuppressLint("CheckResult")
    @Override
    public void importFile(FileItemViewModel data) {
        String text = getString(com.widget.noname.function.functionlibrary.R.string.import_action_start_file, data.getFileName());
        // 导入文件逻辑
        tip(text).show();
        viewModel.navigateTo("导入", "导入");
        viewModel.postLogEvent(text);

        Uri uri = data.toUri();
        if ("file".equals(uri.getScheme())) {
            // 安卓11或以上，几乎只能用shizuku了
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                // 有shizuku权限，把他复制到一个随机目录里
                // 然后用可以读的到的目录传
                if (ShizukuUtil.checkPermission()) {
                    try {
                        // 随机一个名字
                        String randomName = UUID.randomUUID().toString();
                        int lastDot = data.getFileName().lastIndexOf('.');
                        String extension = lastDot > 0 ? data.getFileName().substring(lastDot + 1) : "";
                        if (!extension.isEmpty()) {
                            randomName += "." + extension;
                        }
                        // 随机文件的父目录
                        java.io.File downloadDir = new java.io.File(getContext().getCacheDir(), "download");
                        if (!downloadDir.exists()) {
                            downloadDir.mkdirs();
                        }
                        if (downloadDir.isFile()) {
                            FileUtil.deleteFolderRecursively(downloadDir);
                            downloadDir.mkdirs();
                        }
                        String randomDir = downloadDir.getAbsolutePath();
                        if (!randomDir.endsWith("/")) {
                            randomDir += "/";
                        }
                        String cmdResult = ShizukuUtil.exec("cp " + uri.getPath() + " " + randomDir + randomName);
                        Log.e(TAG, "cmdResult: " + cmdResult);
                        // 构造新文件路径
                        File newFile = new File(randomDir, randomName);
                        Log.e(TAG, "newFile path: " + newFile.getAbsolutePath());
                        if (newFile.exists()) {
                            newFile.deleteOnExit();
                            EventBus.getDefault().post(
                                    new UriReceivedEvent(Uri.fromFile(newFile))
                            );
                        }
                        else {
                            throw new Exception(getString(com.widget.noname.function.functionlibrary.R.string.common_error_cache_not_exist) + ": " + newFile.getAbsolutePath());
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                        Log.e(TAG, "cmdResult: " + e.getMessage());
                        tip(e.getMessage()).iconError().show();
                    }
                    return;
                }
                else {
                    tip(com.widget.noname.function.functionlibrary.R.string.permission_error_no_shizuku_to_import).iconError().show();
                }
            }
        }
        EventBus.getDefault().post(
                new UriReceivedEvent(uri)
        );

    }

    @Override
    public void browseFolder(FileItemViewModel folderData) {
        loadingText.setVisibility(View.VISIBLE);
        adapter.clearAll();
        // 延迟 100ms 执行
        new Handler(Looper.getMainLooper()).postDelayed(() -> {
            Object model = folderData.getModel();
            if (model instanceof File) {
                loadFiles((File) model);
            }
            else if (model instanceof DocumentFile) {
                loadFiles((DocumentFile) model);
            }
        }, 50);

    }
}
