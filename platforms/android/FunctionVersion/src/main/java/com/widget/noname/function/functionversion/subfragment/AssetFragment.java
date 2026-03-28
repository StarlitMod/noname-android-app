package com.widget.noname.function.functionversion.subfragment;

import static android.content.Context.MODE_PRIVATE;
import static com.kongzue.dialogx.dialogs.PopTip.tip;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.SharedPreferences;
import android.content.res.AssetManager;
import android.net.Uri;
import android.os.Bundle;
import android.text.TextUtils;
import android.text.method.ScrollingMovementMethod;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.JavascriptInterface;
import android.webkit.MimeTypeMap;
import android.webkit.ServiceWorkerClient;
import android.webkit.ServiceWorkerController;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.RadioGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.webkit.WebViewAssetLoader;

import com.alibaba.fastjson.JSON;
import com.google.android.material.textfield.TextInputEditText;
import com.kongzue.dialogx.DialogX;
import com.kongzue.dialogx.dialogs.CustomDialog;
import com.kongzue.dialogx.dialogs.GuideDialog;
import com.kongzue.dialogx.dialogs.MessageDialog;
import com.kongzue.dialogx.interfaces.OnBindingView;
import com.kongzue.dialogx.util.DialogListBuilder;
import com.tencent.mmkv.MMKV;
import com.widget.noname.MyApplication;
import com.widget.noname.Settings;
import com.widget.noname.TutorialFragment;
import com.widget.noname.common.manager.WebViewManager;
import com.widget.noname.common.util.FileConstant;
import com.widget.noname.eventbus.UriReceivedEvent;
import com.widget.noname.function.functionlibrary.data.UpdateInfo;

import com.widget.noname.eventbus.MsgVersionControl;
import com.widget.noname.eventbus.SettingsChangeEvent;
import com.widget.noname.function.functionversion.databinding.AssetFragmentData;
import com.widget.noname.function.functionversion.R;
import com.widget.noname.function.functionversion.databinding.SubFragmentAssetLayoutBinding;
import com.widget.noname.function.functionversion.databinding.UpdateSourceConfigDialogBinding;
import com.widget.noname.util.DialogXUtil;
import com.widget.noname.util.FileUtil;
import com.widget.noname.util.GitHubUtil;
import com.widget.noname.util.JsPathUtil;

import org.greenrobot.eventbus.EventBus;
import org.greenrobot.eventbus.Subscribe;
import org.greenrobot.eventbus.ThreadMode;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.text.DateFormat;
import java.text.DateFormatSymbols;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import io.reactivex.rxjava3.android.schedulers.AndroidSchedulers;
import io.reactivex.rxjava3.core.Observable;
import io.reactivex.rxjava3.schedulers.Schedulers;

public class AssetFragment extends TutorialFragment implements RadioGroup.OnCheckedChangeListener {
    private static final String TAG = "AssetFragment";
    // 默认下载地址，后面可以自己配置
    public static String DEFAULT_UPDATE_URL_GITHUB = null;
    private static Map<String, String> downloadMap = null;
    private static final Settings.DownloadSettings downloadSettings = new Settings.DownloadSettings(); ;
    private static Map<String, String> getDownloadMap() {
        Map<String, String> defaultMap = new HashMap<>();
        String gamePath = MMKV.defaultMMKV().getString(FileConstant.GAME_PATH_KEY, null);
        if (gamePath == null || TextUtils.isEmpty(gamePath)) {
            defaultMap.put(
                    GitHubUtil.buildGitHubRawUrl(
                            Settings.DEFAULT_GIT_USERNAME,
                            Settings.DEFAULT_GIT_REPO,
                            Settings.DEFAULT_GIT_BRANCH
                    ),
                    Settings.DEFAULT_GIT_DOWNLOAD_FILE_NAME
            );
            return defaultMap;
        }
        defaultMap.put(
                GitHubUtil.buildGitHubRawUrl(
                        downloadSettings.getGitUserName(),
                        downloadSettings.getGitRepo(),
                        downloadSettings.getGitBranch()
                ),
                downloadSettings.getGitDownloadFileName()
        );
        return defaultMap;
    }

    private void update() {
        data.setUpdateStatus(-1);
        data.setCanUpdate(true);
        data.setUpdateBtnStr("检查更新");
        data.setUpdateVersion("null");
        data.setUpdateChangeLog("null");
        data.setDownloadProgress("");
        data.setConfigName("");
        downloadMap = getDownloadMap();
        DEFAULT_UPDATE_URL_GITHUB = GitHubUtil.buildGitHubRawUrl(
                downloadSettings.getGitUserName(),
                downloadSettings.getGitRepo(),
                downloadSettings.getGitBranch()
        );
        data.setConfigName(downloadSettings.getGitConfigName());
        data.setUpdateUri(DEFAULT_UPDATE_URL_GITHUB);
    }

    private static final String JS_TAG = "version_fragment";
    private static final String VERSION_FRAGMENT = "/html/version_fragment.html";
    private AssetFragmentData data = null;
    private WebView webView = null;

    protected int getFragmentPosition() {
        return 0;
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
                            .setTitle(tutorialTitle + "——版本按钮——资源界面")
                            .setMessage("检测到您是内测版，是否跳过本教程？")
                            .setCancelable(false)
                            .setOkButton(android.R.string.ok, (dialog, v) -> {
                                builder.clear();
                                editor.putBoolean("readTutorialInAssetFragment", true).apply();
                                return false;
                            })
                            .setCancelButton(android.R.string.cancel)
            );
        }

        builder.add(
                MessageDialog.build()
                        .setTitle(tutorialTitle + "——版本按钮——资源界面")
                        .setMessage("资源界面中，您可以查看当前游戏主体的资源路径，版本，大小信息。也可以进行版本更新。")
                        .setCancelable(false)
                        .setOkButton(android.R.string.ok)
        );

        builder.add(
                GuideDialog.build()
                        .baseView(getView().findViewById(R.id.button_click_ask_update))
                        .setStageLightType(GuideDialog.STAGE_LIGHT_TYPE.RECTANGLE)
                        .setAlign(CustomDialog.ALIGN.TOP_CENTER)
                        .onShow(dialog -> {
                            DialogXUtil.startFlashingAnimation((GuideDialog) dialog, 2); // 闪烁2轮
                        })
        );

        builder.add(
                MessageDialog.build()
                        .setTitle(tutorialTitle + "——版本按钮——资源界面")
                        .setMessage("版本更新功能会自动从网络请求更新内容，手动点击后会进行更新提示和下载导入等操作。\n更新将会从api.github.com获取版本信息，这个网站有未登录每小时60次的限制。")
                        .setCancelable(false)
                        .setOkButton(android.R.string.ok)
        );

        builder.add(
                MessageDialog.build()
                        .setTitle(tutorialTitle + "——版本按钮——资源界面")
                        .setMessage("从github下载文件较慢，可自行去设置页面手动设置github下载加速地址，此方面信息需要自行寻找下载加速地址转换连接取前缀并在设置页面中进行配置，因为如果提供固定的更新源很有可能会以薅羊毛为由被封禁。\n下载完成后，会提示导入压缩包，此操作与导入本地压缩包的步骤一致。")
                        .setCancelable(false)
                        .setOkButton(android.R.string.ok)
        );

        builder.add(
                GuideDialog.build()
                        .baseView(getView().findViewById(R.id.button_config_update_source))
                        .setStageLightType(GuideDialog.STAGE_LIGHT_TYPE.RECTANGLE)
                        .setAlign(CustomDialog.ALIGN.TOP_CENTER)
                        .onShow(dialog -> {
                            DialogXUtil.startFlashingAnimation((GuideDialog) dialog, 2); // 闪烁2轮
                        })
        );

        builder.add(
                MessageDialog.build()
                        .setTitle(tutorialTitle + "——版本按钮——资源界面")
                        .setMessage("点击此处可以配置更新源。")
                        .setCancelable(false)
                        .setOkButton(android.R.string.ok)
        );

        builder.add(
                MessageDialog.build()
                        .setTitle(tutorialTitle + "——版本按钮——资源界面")
                        .setMessage("本页面的教程结束，欢迎使用无名杀。")
                        .setCancelable(false)
                        .setOkButton(android.R.string.ok)
                        .onDismiss(dialog -> {
                            editor.putBoolean("readTutorialInAssetFragment", true).apply();
                        })
        );

        return builder;
    }

    protected boolean isTutorialCompleted() {
        Context context = this.getContext();
        SharedPreferences prefs = context.getSharedPreferences("nonameyuri", MODE_PRIVATE);
        return prefs.getBoolean("readTutorialInAssetFragment", false);
    }

    @Override
    public void onAttach(@NonNull Context context) {
        super.onAttach(context);
        data = new AssetFragmentData(context);
        update();
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        SubFragmentAssetLayoutBinding binding = SubFragmentAssetLayoutBinding.inflate(inflater);
        binding.setData(data);
        return binding.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        TextView updateChangeLog = view.findViewById(R.id.tv_update_change_log);
        if (updateChangeLog != null) {
            updateChangeLog.setMovementMethod(ScrollingMovementMethod.getInstance());
        }
        initData();
        data.setUpdateStatus(AssetFragmentData.STATUS_CHECK_UPDATE);
        initView(view);
    }

    private void initView(View view) {
        RadioGroup radioGroup = view.findViewById(R.id.radio_group_update);
        radioGroup.setOnCheckedChangeListener(this);

        view.findViewById(R.id.button_click_ask_update).setOnClickListener(v -> askForUpdate());
        // 添加配置按钮点击事件
        view.findViewById(R.id.button_config_update_source).setOnClickListener(v -> showUpdateSourceConfigDialog());
    }

    @Override
    public void onResume() {
        super.onResume();
        if (!Settings.getDisableLoadAssets()) {
            initWebView();
        }
    }

    @SuppressLint("CheckResult")
    private void initData() {
        Log.e("initData", "initDatainitData");
        String path = MMKV.defaultMMKV().getString(FileConstant.GAME_PATH_KEY, null);
        data.setAssetPath(path);

        // String url = MMKV.defaultMMKV().getString(FileConstant.UPDATE_URL_KEY, UPDATE_URL_GITLAB);
        // data.setUpdateUri(url);

        if (null != path) {
            Observable.create(emitter -> emitter.onNext(FileUtil.getFileSize(new File(path))))
                    .subscribeOn(Schedulers.from(MyApplication.getThreadPool()))
                    .observeOn(AndroidSchedulers.mainThread())
                    .subscribe(size -> data.setAssetSize(size.toString()));
        }
    }

    @SuppressLint("CheckResult")
    private void updateVersionInfo(String url) {
        if (TextUtils.isEmpty(url)) {
            return;
        }
        String[] usernameRepoBranch = GitHubUtil.parseGitHubRawUrl(url);
        checkGitHubLatestVersion(usernameRepoBranch[0], usernameRepoBranch[1]);
    }

    private void checkGitHubLatestVersion(String username, String repo) {
        GitHubUtil.getLatestVersionFromGitHub(username, repo, null,
                new GitHubUtil.CallbackWrapper<>() {
                    @Override
                    public void onSuccess(GitHubUtil.GitHubRelease release) {
                        requireActivity().runOnUiThread(() -> {
                            data.setRelease(release);
                            data.setUpdateVersion(release.tag_name);
                            String message = release.body != null ? release.body : getString(com.widget.noname.function.functionlibrary.R.string.common_content_no_release_notes);
                            if (data.getVersion() != null) {
                                data.setUpdateStatus(data.getVersion().compareTo(data.getUpdateVersion()) < 0 ? AssetFragmentData.STATUS_CLICK_UPDATE : AssetFragmentData.STATUS_NEWEST);
                            } else {
                                data.setUpdateStatus(AssetFragmentData.STATUS_CLICK_UPDATE);
                            }
                            data.setUpdateChangeLog(message);
                        });
                    }

                    @Override
                    public void onFailure(Exception e) {
                        requireActivity().runOnUiThread(() -> {
                            Log.e(TAG, "获取GitHub最新版本失败", e);
                            data.setUpdateVersion(e.getMessage());
                            data.setUpdateChangeLog(e.getMessage());
                        });
                    }
                });
    }

    /**
     * 处理从GitHub获取的远程版本信息
     */
    private void handleRemoteVersionInfo(GitHubUtil.GitHubRelease remoteRelease) {
        String localVersion = readLocalVersion();

        if (localVersion == null) {
            // 本地没有版本信息，需要更新
            downloadAndExtractFromGitHub(remoteRelease);
        } else {
            // 比较版本号
            int compareResult = GitHubUtil.compareVersion(remoteRelease.tag_name, localVersion);
            if (compareResult > 0) {
                // 远程版本更新，需要更新
                downloadAndExtractFromGitHub(remoteRelease);
            } else {
                // 已经是最新版本
                tip(com.widget.noname.function.functionlibrary.R.string.common_status_already_latest_version).iconSuccess().show();
                data.setUpdateStatus(AssetFragmentData.STATUS_NEWEST);
            }
        }
    }

    /**
     * 读取本地版本号
     * @return 本地版本号，如果没有则返回null
     */
    private String readLocalVersion() {
        String gamePath = MMKV.defaultMMKV().getString(FileConstant.GAME_PATH_KEY, null);

        if (gamePath == null) {
            return null;
        }

        File updateJsFile = new File(gamePath, "game/update.js");
        if (!updateJsFile.exists()) {
            return null;
        }

        try {
            String content = FileUtil.readFileToString(updateJsFile);
            int startIndex = content.indexOf("{");
            int endIndex = content.lastIndexOf("}");

            if (startIndex > -1 && endIndex > -1 && endIndex > startIndex) {
                String jsonStr = content.substring(startIndex, endIndex + 1);
                UpdateInfo updateInfo = JSON.parseObject(jsonStr, UpdateInfo.class);
                return updateInfo.getVersion();
            }
        } catch (Exception e) {
            Log.e(TAG, "读取本地版本信息失败", e);
        }

        return null;
    }

    /**
     * 从GitHub下载并解压zip包
     * @param release GitHub发布信息
     */
    private void downloadAndExtractFromGitHub(GitHubUtil.GitHubRelease release) {
        data.setUpdateStatus(AssetFragmentData.STATUS_UPDATING);
        data.setDownloadProgress(getString(com.widget.noname.function.functionlibrary.R.string.notification_channel_progress_downloading));

        // 确保有有效的游戏路径
        File downloadFile;
        File cacheDir = getContext().getCacheDir();
        // 保证存在
        if (!cacheDir.exists()) {
            cacheDir.mkdirs();
        }
        if (cacheDir.isFile()) {
            FileUtil.deleteFolderRecursively(cacheDir);
            cacheDir.mkdirs();
        }
        File downloadDir = new File(cacheDir, "download");
        if (!downloadDir.exists()) {
            downloadDir.mkdirs();
        }
        if (downloadDir.isFile()) {
            FileUtil.deleteFolderRecursively(downloadDir);
            downloadDir.mkdirs();
        }
        try {
            downloadFile = File.createTempFile(release.tag_name + "_", ".zip", downloadDir);
        } catch (IOException e) {
            try {
                // 使用时间戳 + 随机数确保合法性 & 唯一性
                downloadFile = File.createTempFile("dl_" + System.currentTimeMillis(), ".zip", downloadDir);
            } catch (IOException e2) {
                e2.printStackTrace();
                tip(
                        getString(com.widget.noname.function.functionlibrary.R.string.notification_status_download_failed)
                ).iconError().show();
                data.setUpdateChangeLog(
                        getString(
                                com.widget.noname.function.functionlibrary.R.string.notification_status_download_failed_reason,
                                getString(com.widget.noname.function.functionlibrary.R.string.common_error_cannot_create_file)
                        ) + "(" + e2.getMessage() + ")"
                );
                return;
            }
        }

        downloadFile.deleteOnExit();
        Log.e(TAG, "下载文件保存路径: " + downloadFile.getAbsolutePath());
        String url = downloadMap.get(data.getUpdateUri());
        String downloadUrl = null;
        if (url == null) {
            downloadUrl = release.zipball_url;
        } else {
            if (release.assets != null) {
                for (GitHubUtil.GitHubRelease.Asset asset : release.assets) {
                    if (url.equals(asset.name)) {
                        downloadUrl = asset.browser_download_url;
                        break;
                    }
                }
            }

            // 如果没找到特定资产，则使用默认的 zipball_url
            if (downloadUrl == null) {
                downloadUrl = release.zipball_url;
                Log.w(TAG, "未找到 " + url + "，使用默认 zipball_url");
            }
        }
        Log.e(TAG, "下载文件路径: " + downloadUrl);

        // 开始下载
        GitHubUtil.downloadFile(downloadUrl, downloadFile, new GitHubUtil.DownloadFileListener() {
            @Override
            public void onProgress(long received, long total) {
                if (total > 0) {
                    int progress = (int) (received * 100 / total);
                    Log.e(TAG, "下载中: " + progress + "%(" + GitHubUtil.formatFileSize(received) + "/" + GitHubUtil.formatFileSize(total) + ")");
                    requireActivity().runOnUiThread(() -> {
                        data.setDownloadProgress(
                                getString(
                                        com.widget.noname.function.functionlibrary.R.string.notification_progress_downloading_file,
                                        progress + "%(" + GitHubUtil.formatFileSize(received) + "/" + GitHubUtil.formatFileSize(total) + ")"
                                )
                        );
                    });
                }
            }

            @Override
            public void onSuccess(File file) {
                // 下载完成，开始解压
                requireActivity().runOnUiThread(() -> {
                    Log.e(TAG, "下载完成");
                    data.setDownloadProgress("");
                    data.setDownloadProgress("");
                    data.setUpdateStatus(AssetFragmentData.STATUS_NEWEST);
                    tip(com.widget.noname.function.functionlibrary.R.string.notification_status_download_complete).iconSuccess().show();
                    // 跳转导入
                    EventBus.getDefault().post(
                            new UriReceivedEvent(Uri.fromFile(file))
                    );
                });
            }

            @Override
            public void onFailure(Exception e) {
                requireActivity().runOnUiThread(() -> {
                    tip(getString(com.widget.noname.function.functionlibrary.R.string.notification_status_download_failed_reason, e.getMessage())).iconError().show();
                    Log.e(TAG, "下载失败: " + e.getMessage());
                    e.printStackTrace();
                    data.setUpdateChangeLog(e.getMessage());
                    data.setUpdateStatus(AssetFragmentData.STATUS_DOWNLOAD_FAIL);
                    data.setDownloadProgress("");
                });
            }
        });
    }

    private void askForUpdate() {
        if (!Settings.hasAgreedToPrivacyPolicy()) {
            tip(com.widget.noname.function.functionlibrary.R.string.permission_require_privacy_agreement).iconError().show();
            return;
        }
        if (data.getUpdateStatus() == AssetFragmentData.STATUS_CHECK_UPDATE || data.getUpdateStatus() == -1) {
            data.setUpdateUri(DEFAULT_UPDATE_URL_GITHUB);
            data.setUpdateStatus(AssetFragmentData.STATUS_CHECKING);
            updateVersionInfo(data.getUpdateUri());
        } else {
            String title = getString(com.widget.noname.function.functionlibrary.R.string.notification_update_dialog_new_version_available, data.getUpdateVersion());
            String info = data.getUpdateChangeLog();

            MessageDialog dialog = MessageDialog.build()
                    .setTitle(title)
                    .setMessage(info)
                    .setOkButton(android.R.string.ok, (baseDialog, view) -> {
                        goUpdate();
                        return false;
                    })
                    .setCancelButton(android.R.string.cancel);
            DialogXUtil.setupMarkdownForMessage(dialog);
            dialog.show();
        }
    }

    /**
     * 显示更新源配置对话框
     */
    private void showUpdateSourceConfigDialog() {
        MessageDialog.build()
                .setTitle(com.widget.noname.function.functionlibrary.R.string.common_title_update_source)
                .setCustomView(new OnBindingView<MessageDialog, UpdateSourceConfigDialogBinding>() {
                    @Override
                    public void onBind(MessageDialog dialog, View view,  UpdateSourceConfigDialogBinding binding) {
                        binding.editTextConfigname.setText(downloadSettings.getGitConfigName());
                        binding.editTextUsername.setText(downloadSettings.getGitUserName());
                        binding.editTextRepo.setText(downloadSettings.getGitRepo());
                        binding.editTextBranch.setText(downloadSettings.getGitBranch());
                        binding.editTextFilename.setText(downloadSettings.getGitDownloadFileName());
                    }
                })
                .setOkButton(android.R.string.ok, (baseDialog, view) -> {
                    TextInputEditText editTextConfigName = baseDialog.getDialogView().findViewById(R.id.edit_text_configname);
                    TextInputEditText editTextUsername = baseDialog.getDialogView().findViewById(R.id.edit_text_username);
                    TextInputEditText editTextRepo = baseDialog.getDialogView().findViewById(R.id.edit_text_repo);
                    TextInputEditText editTextBranch = baseDialog.getDialogView().findViewById(R.id.edit_text_branch);
                    TextInputEditText editTextFilename = baseDialog.getDialogView().findViewById(R.id.edit_text_filename);

                    TextInputEditText[] fields = {
                            editTextConfigName,
                            editTextUsername,
                            editTextRepo,
                            editTextBranch,
                            editTextFilename
                    };
                    // 对应字段名称（如果 hint 为空可以用这个）
                    String[] fieldNames = {
                            getString(com.widget.noname.function.functionlibrary.R.string.common_source_field_name),
                            getString(com.widget.noname.function.functionlibrary.R.string.common_source_field_username),
                            getString(com.widget.noname.function.functionlibrary.R.string.common_source_field_repository),
                            getString(com.widget.noname.function.functionlibrary.R.string.common_source_field_branch),
                            getString(com.widget.noname.function.functionlibrary.R.string.common_source_field_filename)
                    };

                    boolean hasError = false;

                    for (int i = 0; i < fields.length; i++) {
                        TextInputEditText field = fields[i];
                        if (field == null) {
                            hasError = true;
                            Log.e(TAG, "字段 " + fieldNames[i] + " 为空");
                            continue;
                        }

                        String text = field.getText().toString().trim();
                        if (text.isEmpty()) {
                            // 使用 hint，如果没有 hint 则使用字段名
                            CharSequence hint = field.getHint();
                            String errorMsg = getString(
                                    com.widget.noname.function.functionlibrary.R.string.common_prompt_input,
                                    hint != null && !hint.toString().isEmpty() ? hint : fieldNames[i]
                            );
                            field.setError(errorMsg);
                            // 第一个错误字段获取焦点
                            if (!hasError) {
                                field.requestFocus();
                            }
                            hasError = true;
                        } else {
                            field.setError(null);
                        }
                    }

                    if (!hasError) {
                        if (editTextConfigName != null) downloadSettings.setGitConfigName(editTextConfigName.getText().toString().trim());
                        if (editTextUsername != null) downloadSettings.setGitUserName(editTextUsername.getText().toString().trim());
                        if (editTextRepo != null) downloadSettings.setGitRepo(editTextRepo.getText().toString().trim());
                        if (editTextBranch != null) downloadSettings.setGitBranch(editTextBranch.getText().toString().trim());
                        if (editTextFilename != null) downloadSettings.setGitDownloadFileName(editTextFilename.getText().toString().trim());
                    }
                    else {
                        tip(com.widget.noname.function.functionlibrary.R.string.common_source_error_fields_required).iconError().show();
                    }

                    return hasError; // true 表示有错误
                })
                .setCancelButton(android.R.string.cancel)
                .show();
    }

    private void goUpdate() {
        data.setUpdateStatus(AssetFragmentData.STATUS_UPDATING);
        GitHubUtil.GitHubRelease release = data.getRelease();
        handleRemoteVersionInfo(release);
    }

    @SuppressLint("SetJavaScriptEnabled")
    private void initWebView() {
        if (!checkGamePath(true)) return;
        if (null != webView) return;
        Log.e(TAG, "initWebView");
        webView = new WebView(getContext());
        webView.setInitialScale(0);
        webView.setVerticalScrollBarEnabled(false);
        final WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setJavaScriptCanOpenWindowsAutomatically(true);
        settings.setLayoutAlgorithm(WebSettings.LayoutAlgorithm.NORMAL);

        settings.setAllowFileAccess(true);

        //We don't save any form data in the application
        settings.setSaveFormData(false);
        settings.setSavePassword(false);

        // Jellybean rightfully tried to lock this down. Too bad they didn't give us a whitelist
        // while we do this
        settings.setAllowUniversalAccessFromFileURLs(true);
        settings.setMediaPlaybackRequiresUserGesture(false);

        // Enable database
        // We keep this disabled because we use or shim to get around DOM_EXCEPTION_ERROR_16
        String databasePath = webView.getContext().getApplicationContext().getDir("database", Context.MODE_PRIVATE).getPath();
        settings.setDatabaseEnabled(true);
        settings.setDatabasePath(databasePath);
        settings.setGeolocationDatabasePath(databasePath);
        settings.setDomStorageEnabled(true);

        settings.setGeolocationEnabled(true);
        // settings.setAppCachePath(databasePath);
        // settings.setAppCacheEnabled(true);

        webView.addJavascriptInterface(this, JS_TAG);

        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);

        final Context context = webView.getContext();
        AssetManager assetManager = context.getAssets();
        WebViewAssetLoader.Builder assetLoaderBuilder = new WebViewAssetLoader.Builder()
                .setDomain(Settings.getHostName())
                .setHttpAllowed(true);

        assetLoaderBuilder.addPathHandler("/android_asset/", path -> {
            // WebResourceResponse response = assetsPathHandler.handle(path);
            // response.setMimeType(mimeType);
            try {
                InputStream is = assetManager.open(path, AssetManager.ACCESS_STREAMING);
                String mimeType = "text/html";
                String extension = MimeTypeMap.getFileExtensionFromUrl(path);
                if (extension != null) {
                    if (path.endsWith(".js") || path.endsWith(".mjs")) {
                        // Make sure JS files get the proper mimetype to support ES modules
                        mimeType = "application/javascript";
                    } else if (path.endsWith(".wasm")) {
                        mimeType = "application/wasm";
                    } else {
                        mimeType = MimeTypeMap.getSingleton().getMimeTypeFromExtension(extension);
                    }
                }
                WebResourceResponse response = new WebResourceResponse(mimeType, null, is);
                Log.e(TAG, "path: " + path + ", is: " + response.getData());
                return response;
            } catch (IOException e) {
                Log.e(TAG, "assetManager打开" + path + "失败");
                e.printStackTrace();
                return null;
            }
        });

        WebViewAssetLoader.ResourcesPathHandler resourcesPathHandler = new WebViewAssetLoader.ResourcesPathHandler(context);
        assetLoaderBuilder.addPathHandler("/android_res/", path -> {
            String mimeType = "text/html";
            String extension = MimeTypeMap.getFileExtensionFromUrl(path);
            if (extension != null) {
                if (path.endsWith(".js") || path.endsWith(".mjs")) {
                    // Make sure JS files get the proper mimetype to support ES modules
                    mimeType = "application/javascript";
                } else if (path.endsWith(".wasm")) {
                    mimeType = "application/wasm";
                } else {
                    mimeType = MimeTypeMap.getSingleton().getMimeTypeFromExtension(extension);
                }
            }
            WebResourceResponse response = resourcesPathHandler.handle(path);
            response.setMimeType(mimeType);
            return response;
        });

        assetLoaderBuilder.addPathHandler("/", path -> {
            try {
                if (path.isEmpty()) {
                    path = "index.html";
                }
                // InputStream is = parentEngine.webView.getContext().getAssets().open("www/" + path, AssetManager.ACCESS_STREAMING);
                // 使其在Asset文件夹中找不到文件时自动读取一次外部存储文件
                InputStream is;
                String[] split = ("www/" + path).split("/");
                String[] newSplit = Arrays.copyOfRange(split, 0, split.length - 1);
                List<String> list = Arrays.asList(assetManager.list(String.join("/", newSplit)));
                Long lastModified = null;
                if (!path.startsWith("game/") && list.contains(split[split.length - 1])) {
                    is = assetManager.open("www/" + path, AssetManager.ACCESS_STREAMING);
                } else {
                    String GameRootPath = MMKV.defaultMMKV().getString(FileConstant.GAME_PATH_KEY, null);
                    if (GameRootPath == null) {
                        GameRootPath = context.getExternalFilesDir(null).getParentFile().getAbsolutePath() + File.separator;
                    }
                    File file = new File(
                            GameRootPath,
                            path
                    );
                    lastModified = file.lastModified();
                    is = new FileInputStream(file);
                }
                String mimeType = "text/html";
                String extension = MimeTypeMap.getFileExtensionFromUrl(path);
                if (extension != null) {
                    if (path.endsWith(".js") || path.endsWith(".mjs")) {
                        // Make sure JS files get the proper mimetype to support ES modules
                        mimeType = "application/javascript";
                    } else if (path.endsWith(".wasm")) {
                        mimeType = "application/wasm";
                    } else {
                        mimeType = MimeTypeMap.getSingleton().getMimeTypeFromExtension(extension);
                    }
                }
                WebResourceResponse response = new WebResourceResponse(mimeType, null, is);
                if (lastModified != null) {
                    Locale aLocale = Locale.US;
                    @SuppressLint("SimpleDateFormat")
                    DateFormat fmt = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss", new DateFormatSymbols(aLocale));
                    Map<String, String> headers = new HashMap<>();
                    headers.put("last-modified", fmt.format(new Date(lastModified)));
                    if (response.getResponseHeaders() != null) {
                        headers.putAll(response.getResponseHeaders());
                    }
                    response.setResponseHeaders(headers);
                }
                return response;
            } catch (Exception e) {
                e.printStackTrace();
            }
            return null;
        });
        WebViewAssetLoader assetLoader = assetLoaderBuilder.build();

        ServiceWorkerController controller = ServiceWorkerController.getInstance();
        controller.setServiceWorkerClient(new ServiceWorkerClient(){
            @Override
            public WebResourceResponse shouldInterceptRequest(WebResourceRequest request) {
                return assetLoader.shouldInterceptRequest(request.getUrl());
            }
        });

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                String url = request.getUrl().toString();
                String method = request.getMethod();
                Map<String, String> headers = request.getRequestHeaders();
                Log.e(TAG, method + "  " + url + "  " + headers);
                return assetLoader.shouldInterceptRequest(request.getUrl());
            }
        });

        String protocol = Settings.getProtocol();
        if ("file".equals(protocol)) {
            webView.getSettings().setAllowFileAccess(true);
            webView.getSettings().setAllowFileAccessFromFileURLs(true);
            webView.loadUrl(protocol + ":///android_asset" + VERSION_FRAGMENT);
        }
        else {
            webView.getSettings().setAllowFileAccess(false);
            webView.getSettings().setAllowFileAccessFromFileURLs(false);
            webView.loadUrl(protocol + "://" + Settings.getHostName()  + "/android_asset" + VERSION_FRAGMENT);
        }
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        if (webView != null) {
            WebViewManager.destroy(webView);
            webView = null;
        }
    }

    public void destroyWebView() {
        if (webView != null) {
            WebViewManager.destroy(webView);
            webView = null;
        }
    }

    // from js call java.
    @JavascriptInterface
    public String getUrl() {
        return JsPathUtil.getGameRootPath(getContext());
    }

    @SuppressLint("CheckResult")
    @JavascriptInterface
    public void onResourceLoad(String json) {
        Observable.create(emitter -> {
            UpdateInfo updateInfo = JSON.parseObject(json, UpdateInfo.class);

            if (null != updateInfo) {
                emitter.onNext(updateInfo.getVersion());
            }
        }).subscribeOn(Schedulers.from(MyApplication.getThreadPool()))
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe(version -> {
                    Log.e("zyq", "update version: " + version);
                    data.setVersion(version.toString());
                    updateVersionInfo(data.getUpdateUri());
                });
    }

    @Override
    public void onCheckedChanged(RadioGroup group, int checkedId) {
        String checkUrl = null;

        if (checkedId == R.id.ratio_button_github) {
            checkUrl = DEFAULT_UPDATE_URL_GITHUB;
        }
//        else if (checkedId == R.id.ratio_button_gitee) {
//            checkUrl = UPDATE_URL_GITLAB;
//        }

        // String url = MMKV.defaultMMKV().getString(FileConstant.UPDATE_URL_KEY, "");

        // if (!Objects.equals(checkUrl, url)) {
            MMKV.defaultMMKV().putString(FileConstant.UPDATE_URL_KEY, checkUrl);
            data.setUpdateUri(checkUrl);
            data.setUpdateVersion(getString(com.widget.noname.function.functionlibrary.R.string.common_progress_refreshing));
            data.setUpdateChangeLog(getString(com.widget.noname.function.functionlibrary.R.string.common_progress_refreshing));
            data.setUpdateStatus(AssetFragmentData.STATUS_CHECKING);
            updateVersionInfo(checkUrl);
        // }
    }

    @Subscribe(threadMode = ThreadMode.MAIN)
    public void onExtraZipFile(MsgVersionControl msg) {
        if (msg.getMsgType() == MsgVersionControl.MSG_TYPE_UPDATE_LIST) {
            webView.stopLoading();
            webView.clearCache(false);
            webView.clearHistory();
            // webView.pauseTimers();
            webView.destroy();

            initWebView();
            initData();
        }
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

    private boolean checkGamePath(boolean showToast) {
        String path = MMKV.defaultMMKV().getString(FileConstant.GAME_PATH_KEY, null);

        if (path == null) {
            if (showToast) tip(com.widget.noname.function.functionlibrary.R.string.gamemain_error_not_set).iconError().show();
            return false;
        }

        File file = new File(path);

        if (!file.exists() || !file.isDirectory()) {
            if (showToast) tip(com.widget.noname.function.functionlibrary.R.string.gamemain_error_not_set_or_invalid).iconError().show();
            return false;
        }
        return true;
    }

    @Subscribe(threadMode = ThreadMode.MAIN)
    public void onSettingsChangeEvent(SettingsChangeEvent event) {
        switch (event.getKey()) {
            case Settings.KEY_PROTOCOL: {
                destroyWebView();
                if (!Settings.getDisableLoadAssets()) {
                    initWebView();
                }
                break;
            }
            case Settings.KEY_HOSTNAME: {
                Log.e(TAG, "Settings.KEY_HOSTNAME");
                // http/s下切换域名才有效
                if (Settings.getProtocol().startsWith("http")) {
                    destroyWebView();
                    if (!Settings.getDisableLoadAssets()) {
                        initWebView();
                    }
                }
                break;
            }
            case Settings.KEY_DISABLE_LOAD_ASSETS: {
                if (Settings.getDisableLoadAssets()) {
                    destroyWebView();
                }
                break;
            }
            // 下载/更新
            case Settings.KEY_GIT_CONFIG_NAME:
            case Settings.KEY_GIT_USERNAME:
            case Settings.KEY_GIT_REPO:
            case Settings.KEY_GIT_BRANCH:
            case Settings.KEY_GIT_DOWNLOAD_FILE_NAME: {
                update();
                break;
            }
        }
    }
}

