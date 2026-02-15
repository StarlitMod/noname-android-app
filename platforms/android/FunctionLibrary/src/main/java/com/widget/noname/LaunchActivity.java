package com.widget.noname;

import static com.kongzue.dialogx.dialogs.PopTip.tip;
import static com.kongzue.dialogx.interfaces.BaseDialog.BUTTON_SELECT_RESULT.BUTTON_OK;

import android.animation.Animator;
import android.animation.AnimatorListenerAdapter;
import android.animation.AnimatorSet;
import android.animation.ValueAnimator;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.ActivityManager;
import android.app.NotificationManager;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.IBinder;
import android.os.Process;
import android.os.RemoteException;
import android.text.TextUtils;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.WebView;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.annotation.RequiresApi;
import androidx.lifecycle.ViewModelProvider;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.bumptech.glide.Glide;
import com.bumptech.glide.load.engine.DiskCacheStrategy;
import com.kongzue.dialogx.DialogX;
import com.kongzue.dialogx.dialogs.CustomDialog;
import com.kongzue.dialogx.dialogs.GuideDialog;
import com.kongzue.dialogx.dialogs.MessageDialog;
import com.kongzue.dialogx.dialogs.TipDialog;
import com.kongzue.dialogx.dialogs.WaitDialog;
import com.kongzue.dialogx.interfaces.BaseDialog;
import com.kongzue.dialogx.util.DialogListBuilder;
import com.noname.core.activities.WebViewUpgradeAppCompatActivity;
import com.tencent.mmkv.MMKV;
import com.widget.noname.common.animation.AnimatorUtil;
import com.widget.noname.common.util.FileConstant;
import com.widget.noname.function.functionlibrary.config.ImportConfig;
import com.widget.noname.function.functionlibrary.data.ImportEventViewModel;
import com.widget.noname.function.functionlibrary.data.MessageType;
import com.widget.noname.decompress.DecompressCallback;
import com.widget.noname.decompress.DecompressHelper;
import com.widget.noname.eventbus.ActivityResultEvent;
import com.widget.noname.eventbus.MsgToActivity;
import com.widget.noname.eventbus.SettingsChangeEvent;
import com.widget.noname.eventbus.UriReceivedEvent;
import com.widget.noname.function.FunctionBean;
import com.widget.noname.function.FunctionManager;
import com.widget.noname.function.functionlibrary.R;
import com.widget.noname.nativelib.NativeLib;
import com.widget.noname.nonameui.NButton;
import com.widget.noname.okhttp.DownloadService;
import com.widget.noname.okhttp.HostsDns;
import com.widget.noname.util.DialogXUtil;
import com.widget.noname.util.FileUtil;
import com.widget.noname.util.GitHubUtil;
import com.widget.noname.util.NodeUtil;
import com.widget.noname.util.ShizukuUtil;
import com.widget.noname.util.VPNDetectionHelper;

import org.greenrobot.eventbus.EventBus;
import org.greenrobot.eventbus.Subscribe;
import org.greenrobot.eventbus.ThreadMode;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.TimeUnit;

import io.noties.prism4j.annotations.PrismBundle;
import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

@PrismBundle(
        includeAll = true,
        grammarLocatorClassName = ".GrammarLocatorDef"
)
@SuppressLint("CustomSplashScreen")
public class LaunchActivity extends WebViewUpgradeAppCompatActivity implements View.OnClickListener {
    public static boolean _startedNodeAlready = false;

    private static final String TAG = "LaunchActivity";

    private FunctionManager functionManager = null;
    private ViewGroup functionContainer = null;
    private ViewGroup lunchViewContainer = null;
    private ImageView backgroundImage = null;
    private ImportEventViewModel viewModel;
    private DecompressHelper decompressHelper;
    private ICustomService customService;
    private boolean isServiceBound = false;
    private ServiceConnection serviceConnection;
    private TextView versionText;
    private WaitDialog waitDialog;

    private final View.OnClickListener functionButtonListener = v -> {
        if (v instanceof NButton) {

            String buttonText = ((NButton) v).getButtonText();
            boolean checked = functionManager.checkToSwitch(buttonText);

            if (checked) {
                showFunctionContainer();
            }
        }
    };

    NativeLib nativeLib;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        nativeLib = new NativeLib();

        String GameRootPath = MMKV.defaultMMKV().getString(FileConstant.GAME_PATH_KEY, null);
        if (GameRootPath != null) {
            nativeLib.initializeWebViewFileSystemLoader(this, GameRootPath);
            if (Build.VERSION.SDK_INT < Build.VERSION_CODES.P) {
                boolean needTip = getSharedPreferences("nonameyuri", MODE_PRIVATE)
                        .getBoolean("AndroidVersionPTip", false);

                if (needTip) {
                    this.getSharedPreferences("nonameyuri", MODE_PRIVATE)
                            .edit()
                            .putBoolean("AndroidVersionPTip", true)
                            .apply();
                    tip(R.string.migration_warning_android9_multiple_versions).iconWarning().show();
                }
            }
        }
        super.onCreate(savedInstanceState);

        GitHubUtil.init(this);
        ShizukuUtil.initShizuku(this);

        setContentView(R.layout.activity_launch2);

        File themePackageDir = new File(getFilesDir(), "theme_package");
        // 要删除的四个主题文件夹名称
        String[] themeFolders = {"原版主题", "小无主题", "教主主题", "默认主题"};
        // 遍历并删除指定的主题文件夹
        for (String folderName : themeFolders) {
            File themeFolder = new File(themePackageDir, folderName);
            if (themeFolder.exists()) {
                FileUtil.deleteFolderRecursively(themeFolder);
                Log.d("ThemeUpdate", "已删除: " + folderName);
            }
        }
        // 解压主题
        FileUtil.copyAssetFolder(getAssets(), "themes", new File(getFilesDir(), "theme_package").getAbsolutePath());

        backgroundImage = findViewById(R.id.image_background);
        setBackgroundImage();

        // MMKV.defaultMMKV().clearAll();

        functionContainer = findViewById(R.id.function_container);
        lunchViewContainer = findViewById(R.id.main_view);

        findViewById(R.id.root_view).setOnClickListener(v -> {
            if ((null != functionManager) && functionManager.onBackPressed()) {
                hideFunctionContainer();
            }
        });

        versionText = findViewById(R.id.text_app_version);
        String pkName = getPackageName();
        try {
            versionText.setText(getString(R.string.common_info_app_version, getPackageManager().getPackageInfo(pkName, 0).versionName));
        } catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
            versionText.setText(
                    getString(
                            R.string.common_info_app_version,
                            getString(R.string.common_error_parsing_failed)
                    )
            );
        }

        waitDialog = WaitDialog.show(this, getString(R.string.notification_progress_checking_update));

        initFunctions();

        viewModel = new ViewModelProvider(this).get(ImportEventViewModel.class);
        viewModel.getNavigationEvent().observe(this, funNameAndTabName -> {
            if (funNameAndTabName != null) {
                String[] split = funNameAndTabName.split("-");
                if (split.length == 2) {
                    Log.e(TAG, "funNameAndTabName: " + split[0] + " " + split[1]);
                    boolean checked = functionManager.checkToSwitch(split[0]);
                    if (checked) {
                        showFunctionContainer();
                    }
                }
                else {
                    Log.e(TAG, "Invalid funNameAndTabName: " + funNameAndTabName);
                }
            }
        });

        DecompressCallback callback = new DecompressCallback() {
            @Override
            public void onStart() {
                runOnUiThread(() -> {
                    boolean checked = functionManager.checkToSwitch("导入");
                    if (checked) {
                        showFunctionContainer();
                    }
                });
                viewModel.postLogEvent(getString(R.string.import_action_start));
            }

            @Override
            public void onProgress(int percent) {
                viewModel.postLogEvent(getString(R.string.import_status_progress, percent));
            }

            @Override
            public void onLog(String log) {
                viewModel.postLogEvent(log);
            }

            @Override
            public void onSuccess(String extractPath, ImportConfig importConfig) {
                runOnUiThread(() -> {
                    viewModel.postLogEvent(getString(R.string.import_status_success));
                    if (importConfig != null) {
                        if (importConfig.getName().equals("无名杀·本体包") || importConfig.getName().equals("HTML项目包")) {
                            // 判断是否设置游戏目录
                            String gameRootPath = MMKV.defaultMMKV().getString(FileConstant.GAME_PATH_KEY, null);
                            if (gameRootPath == null) {
                                MMKV.defaultMMKV().putString(FileConstant.GAME_PATH_KEY, extractPath);
                                tip(com.widget.noname.function.functionlibrary.R.string.gamemain_toast_set_complete).iconSuccess().show();
                                Settings.askForRestart(LaunchActivity.this);
                                // askToGame();
                            }
                            // 新增目录
                            else if (!gameRootPath.equals(extractPath)) {
                                MessageDialog.build()
                                        .setTitle(R.string.common_tip)
                                        .setMessage(getString(R.string.gamemain_dialog_confirm_set_short, extractPath))
                                        .setCancelable(false)
                                        .setOkButton(android.R.string.ok, (baseDialog, view) -> {
                                            MMKV.defaultMMKV().putString(FileConstant.GAME_PATH_KEY, extractPath);
                                            tip(com.widget.noname.function.functionlibrary.R.string.gamemain_toast_set_complete).iconSuccess().show();
                                            Settings.askForRestart(LaunchActivity.this);
                                            return false;
                                        })
                                        .setCancelButton(android.R.string.cancel, (baseDialog, view) -> {
                                            viewModel.navigateTo("版本", "版本");
                                            return false;
                                        })
                                        .show();
                            }
                            // 导入到原先目录
                            else {
                                askToGame();
                            }
                        }
                        else if (importConfig.getName().equals("无名杀·扩展包") || importConfig.getName().equals("无名杀·扩展包(ts)")) {
                            tip(R.string.import_status_extension_complete).iconSuccess().show();
                            viewModel.navigateTo("版本", "扩展");
                        }
                        else if (importConfig.getName().equals("主题包")) {
                            viewModel.navigateTo("主题", "主题管理");
                        }
                        // 其他包
                        else {
                            askToGame();
                        }
                    }
                });
            }

            @Override
            public void onFailure(Exception e) {
                viewModel.postLogEvent(getString(R.string.import_status_failed_reason, e.getMessage()));
            }

            @Override
            public void onProgressUpdate(String currentFile, long completedBytes, long totalBytes) {

            }
        };
        decompressHelper = new DecompressHelper(this, callback);
    }

    @Override
    protected void ActivityOnCreate(Bundle extras) {
        Log.e(TAG, "LaunchActivityOnCreate");
        super.ActivityOnCreate(extras);
        deleteDownloadCache();
        loadHostsAndInitClient();
    }

    private DialogListBuilder createTutorial() {
        hideFunctionContainer();

        DialogListBuilder builder = DialogX.showDialogList();
        String tutorialTitle = "教程";
        SharedPreferences prefs = getSharedPreferences("nonameyuri", MODE_PRIVATE);
        SharedPreferences.Editor editor = prefs.edit();

        MessageDialog dialog1 = MessageDialog.build()
                .setTitle(tutorialTitle + "——主页面")
                .setMessage("# 欢迎使用「无名杀」App\n" +
                        "## 关于我们\n" +
                        "本App是一个专为HTML5项目打造的增强型浏览器。我们以完全免费、开源、无广告的方式，为您提供流畅的Web应用运行体验。App的核心功能源于小有名气的开源卡牌游戏框架——**「无名杀」**。\n" +
                        "\n" +
                        "## 项目声明与安全提示\n" +
                        "“无名杀”是由社区主导开发的开源项目，其所有官方资源均免费。请您警惕：\n" +
                        "\n" +
                        "- **收费或变相收费**的版本\n" +
                        "\n" +
                        "- **内含广告（包括色情、赌博等不良信息）** 的版本\n" +
                        "\n" +
                        "- **对源码进行加密混淆的**版本\n" +
                        "\n" +
                        "此类版本可能违反开源协议，并存在安全隐患。如需获取正版资源，请访问下方官方渠道。\n" +
                        "\n" +
                        "## 本App的独特之处\n" +
                        "除了完美运行“无名杀”，我们对其进行了深度解耦。这意味着您可以**轻松导入其他HTML5项目的压缩包**，将其转换为独立的本地应用。本App是一个**通用的、功能增强的WebView容器**。\n" +
                        "\n" +
                        "## 想了解更多？\n" +
                        "\n" +
                        "本App开源项目主页：[GitHub](https://github.com/nonameShijian/noname-android-app)\n" +
                        "\n" +
                        "「无名杀」开源项目主页：[GitHub](https://github.com/libnoname/noname)\n" +
                        "\n" +
                        "「无名杀」官方社区交流频道：[腾讯频道-无名杀](https://pd.qq.com/s/clveb80q8)")
                .setCancelable(false)
                .setOkButton(android.R.string.ok);
        DialogXUtil.setupMarkdownForMessage(dialog1);
        builder.add(dialog1);

        MessageDialog dialog2 = MessageDialog.build()
                .setTitle(tutorialTitle + "——主页面")
                .setMessage("本App是由[noname-plus](https://github.com/zhaiyanqi/noname-plus)和[noname-shijian-android](https://github.com/nonameShijian/noname-shijian-android)两个项目合并而来，因此有了两个项目的绝大部分功能，并在此基础上进行了新功能的开发和优化。\n" +
                        "\n" +
                        "以导入功能为例，本App对导入功能进行了绝大部分的优化，包括但不限于性能和UI等等。\n" +
                        "\n" +
                        "下面表格用于对比以前的App的导入压缩包格式的支持情况：\n" +
                        "\n" +
                        "| 压缩包格式 | 本App | 诗笺版 | 增强版 |\n" +
                        "| :---: | :---: | :---: | :---: |\n" +
                        "| zip | 支持 | 支持 | 支持 |\n" +
                        "| 7z | 支持 | 不支持 | 支持，但不能解析密码 |\n" +
                        "| rar | 支持 | 不支持 | 不支持 |\n" +
                        "| tar | 支持 | 不支持 | 不支持 |\n" +
                        "\n" +
                        "下面表格用于对比以前的App的导入压缩包类别的支持情况：\n" +
                        "\n" +
                        "| 功能 | 本App | 诗笺版 | 增强版 |\n" +
                        "| :---: | :---: | :---: | :---: |\n" +
                        "| 无名杀项目 | 支持 | 支持 | 支持 |\n" +
                        "| 无名杀扩展 | 支持，但需要info.json | 支持 | 不支持 |\n" +
                        "| 扩展自定义类别(如骨骼包) | 支持，但需扩展配置 | 不支持 | 不支持 |\n" +
                        "| 其它html项目 | 支持 | 不支持 | 不支持 |\n" +
                        "\n" +
                        "下面表格用于对比以前的App的导入功能的支持情况：\n" +
                        "\n" +
                        "| 功能 | 本App | 诗笺版 | 增强版 |\n" +
                        "| :---: | :---: | :---: | :---: |\n" +
                        "| APP外导入 | 支持 | 支持 | 支持 |\n" +
                        "| 独立UI显示 | 支持 | 支持 | 不支持 |\n" +
                        "| 从指定文件夹导入 | 支持 | 不支持 | 不支持 |")
                .setCancelable(false)
                .setOkButton(android.R.string.ok);

        DialogXUtil.setupMarkdownForMessage(dialog2);
        builder.add(dialog2);

        builder.add(MessageDialog.build()
                .setTitle(tutorialTitle + "——主页面")
                .setMessage("现在开始进行教程环节。")
                .setCancelable(false)
                .setOkButton(android.R.string.ok));

        LinearLayout linearLayout = findViewById(R.id.function_buttons);

        builder.add(
                GuideDialog.build()
                        .baseView(linearLayout)
                        .setStageLightType(GuideDialog.STAGE_LIGHT_TYPE.RECTANGLE)
                        .setAlign(CustomDialog.ALIGN.TOP_CENTER)
                        .onShow(dialog -> {
                            DialogXUtil.startFlashingAnimation((GuideDialog) dialog, 2); // 闪烁2轮
                        })
        );

        builder.add(
                MessageDialog.build()
                        .setTitle(tutorialTitle + "——主页面")
                        .setMessage("在主页面中有如下按钮，其中每一个按钮都对应本应用的一种主要功能。\n为了避免篇幅过长，具体内容将再点击对应按钮后进行进一步的教程讲解。")
                        .setCancelable(false)
                        .setOkButton(android.R.string.ok)
        );

        builder.add(
                GuideDialog.build()
                        .baseView(versionText)
                        .setStageLightType(GuideDialog.STAGE_LIGHT_TYPE.RECTANGLE)
                        .setAlign(CustomDialog.ALIGN.TOP_CENTER)
                        .onShow(dialog -> {
                            DialogXUtil.startFlashingAnimation((GuideDialog) dialog, 1);
                        })
        );

        builder.add(
                MessageDialog.build()
                        .setTitle(tutorialTitle + "——主页面")
                        .setMessage("在主页面的右下角显示本应用的版本号，其中内测版和正式版的版本号可能不同。")
                        .setCancelable(false)
                        .setOkButton(android.R.string.ok)
        );

        builder.add(
                MessageDialog.build()
                        .setTitle(tutorialTitle + "——主页面")
                        .setMessage("本页面的教程结束，欢迎使用无名杀。")
                        .setCancelable(false)
                        .setOkButton(android.R.string.ok)
                        .onDismiss(dialog -> {
                            editor.putBoolean("readTutorialInLaunchActivity", true).apply();
                            checkAppUpdate();
                        })
        );
        return builder;
    }

    private void afterLoadHosts() {
        SharedPreferences prefs = getSharedPreferences("nonameyuri", MODE_PRIVATE);
        SharedPreferences.Editor editor = prefs.edit();
        // 未阅读或同意过隐私协议
        if (!Settings.hasAgreedToPrivacyPolicy()) {
            waitDialog.doDismiss();
            MessageDialog dialog = Settings.getPrivacyPolicyDialog();
            dialog.onDismiss(dialog1 -> {
                BaseDialog.BUTTON_SELECT_RESULT result = dialog1.getButtonSelectResult();
                if (BUTTON_OK.equals(result)) {
                    editor.putInt("privacyPolicyVersion", Settings.getPrivacyPolicyVersion()).apply();
                }
                afterAgreedToPrivacyPolicy();
            });
            dialog.show();
        }
        // 隐私协议更新
        else if (Settings.getPrivacyPolicyVersion() > prefs.getInt("privacyPolicyVersion", 0)) {
            waitDialog.doDismiss();
            MessageDialog dialog = Settings.getPrivacyPolicyDialog(getString(R.string.permission_info_privacy_updated));
            dialog.onDismiss(dialog1 -> {
                BaseDialog.BUTTON_SELECT_RESULT result = dialog1.getButtonSelectResult();
                if (BUTTON_OK.equals(result)) {
                    editor.putInt("privacyPolicyVersion", Settings.getPrivacyPolicyVersion()).apply();
                }
                afterAgreedToPrivacyPolicy();
            });
            dialog.show();
        }
        else {
            afterAgreedToPrivacyPolicy();
        }
    }

    private void afterAgreedToPrivacyPolicy() {
        waitDialog.doDismiss();
        if (!getSharedPreferences("nonameyuri", MODE_PRIVATE).getBoolean("readTutorialInLaunchActivity", false)) {
            DialogListBuilder builder = createTutorial();
            builder.show();
        } else {
            checkAppUpdate();
        }
    }

    private void afterCheckAppUpdate() {
        Log.e(TAG, "afterTutorial");
        Intent serviceIntent = new Intent(this, CustomService.class);
        serviceIntent.setPackage(getPackageName());
        boolean isServiceRunning = stopService(serviceIntent);
        if (isServiceRunning) {
            Log.e(TAG, "Service is running, stop it");
        }
        else {
            Log.e(TAG, "Service is not running, start it");
        }

        cleanupBadProcesses();

        startNode(this);

        new Handler().postDelayed(() -> {
            serviceConnection = new ServiceConnection() {
                @Override
                public void onServiceConnected(ComponentName name, IBinder service) {
                    Log.e(TAG, "Service connected");
                    customService = ICustomService.Stub.asInterface(service);
                    isServiceBound = true;
                }

                @Override
                public void onServiceDisconnected(ComponentName name) {
                    Log.e(TAG, "Service Disconnected");
                    isServiceBound = false;
                    performCleanup();
                }

                @Override
                public void onBindingDied(ComponentName name) {
                    Log.e(TAG, "Service onBindingDied");
                    if (isServiceBound) {
                        performCleanup();
                    }
                }

                @Override
                public void onNullBinding(ComponentName name) {
                    Log.e(TAG, "Service onNullBinding");
                    if (isServiceBound) {
                        performCleanup();
                    }
                }
            };

            try {
                // 启动并绑定Service
                boolean bindResult = bindService(serviceIntent, serviceConnection,
                        Context.BIND_AUTO_CREATE | Context.BIND_IMPORTANT);
                Log.e(TAG, "bindService: " + bindResult);
            } catch (SecurityException e) {
                performCleanup();
            }
        }, 500);

        Intent intent = getIntent();
        Log.e(TAG, "intent: " + intent);
        if (null != intent) {
            Log.e(TAG, "intent.getAction: " + intent.getAction());
            Log.e(TAG, "intent.getData: " + intent.getData());
            Log.e(TAG, "intent.getDataString: " + intent.getDataString());
            Log.e(TAG, "intent.getType: " + intent.getType());
            Log.e(TAG, "intent.getScheme: " + intent.getScheme());
            if (Intent.ACTION_VIEW.equals(intent.getAction())) {
                importFileFromIntent(intent);
            }
            // 处理从通知点击传递过来的下载文件路径
            else if (intent.hasExtra("download_path")) {
                // 用户点击了通知，手动关闭对应的通知
                clearDownloadNotification(this);
                // 清除extra
                intent.removeExtra("download_path");
                importFileFromIntent(intent);
            }
            else if (intent.hasExtra("download_error")) {
                // 用户点击了通知，手动关闭对应的通知
                clearDownloadNotification(this);
                // 清除extra
                intent.removeExtra("download_error");
                tip(intent.getStringExtra("download_error")).iconError().show();
            }
            else if (Settings.getAutoStart()) {
                functionManager.checkToSwitch("开始");
            }
        }
        // 由启动视频页跳转到这，理论上有了intent.getAction是android.intent.action.MAIN
        else {
            if (Settings.getAutoStart()) {
                functionManager.checkToSwitch("开始");
            }
        }
    }

    /**
     * 检查应用更新
     */
    private void checkAppUpdate() {
        Log.e(TAG, "checkAppUpdate");
        waitDialog = WaitDialog.show(this, getString(R.string.notification_progress_checking_update));
        // 获取当前应用版本
        String currentVersion = getCurrentAppVersion();

        // 从 GitHub API 获取最新版本信息
        String updateCheckUrl = "https://api.github.com/repos/nonameShijian/noname-android-app/releases/latest";
        // String updateCheckUrl = "https://api.github.com/repos/nonameShijian/noname-shijian-android/releases/latest";

        // 使用现有的 OkHttp 客户端发起请求
        // 检测如果有vpn则不使用dns
        boolean isVpnConnected = VPNDetectionHelper.isVPNConnected(this);
        Log.e("checkAppUpdate", "isVpnConnected: " + isVpnConnected);
        OkHttpClient.Builder builder = new OkHttpClient.Builder();
        if (!isVpnConnected) {
            builder.dns(new HostsDns(true));
        }
        OkHttpClient client = builder
                .connectTimeout(60, TimeUnit.SECONDS)
                .readTimeout(60, TimeUnit.SECONDS)
                .build();
        Request request = new Request.Builder()
                .url(updateCheckUrl)
                .build();

        client.newCall(request).enqueue(new Callback() {
            @Override
            public void onFailure(@NonNull Call call, @NonNull IOException e) {
                Log.e(TAG, "检查更新失败", e);
                waitDialog.doDismiss();
                TipDialog.show(getString(R.string.notification_status_check_update_failed_reason, e.getMessage()), WaitDialog.TYPE.ERROR, 500);
                runOnUiThread(() -> afterCheckAppUpdate());
            }

            @Override
            public void onResponse(@NonNull Call call, @NonNull Response response) throws IOException {
                Log.e(TAG, "检查更新成功");
                waitDialog.doDismiss();
                if (response.isSuccessful()) {
                    String responseBody = response.body().string();
                    try {
                        // 解析响应 JSON
                        JSONObject jsonObject = JSON.parseObject(responseBody);
                        String latestVersion = jsonObject.getString("tag_name");
                        String releaseNotes = jsonObject.getString("body");
                        String downloadUrl = jsonObject.getString("html_url");
                        JSONArray assets = jsonObject.getJSONArray("assets");
                        boolean isPreRelease = jsonObject.getBooleanValue("prerelease");

                        // 移除版本号前的 "v" 前缀（如果有的话）
                        if (latestVersion.startsWith("v")) {
                            latestVersion = latestVersion.substring(1);
                        }

                        // 比较版本号
                        if (isNewerVersion(latestVersion, currentVersion) && !isPreRelease) {
                            // 有新版本，提示用户更新
                            String finalLatestVersion = latestVersion;
                            runOnUiThread(() -> showUpdateDialog(finalLatestVersion, releaseNotes, downloadUrl, assets));
                        }
                        else {
                            // 没有新版本，继续执行后续流程
                            runOnUiThread(() -> afterCheckAppUpdate());
                        }
                    } catch (Exception e) {
                        Log.e(TAG, "解析更新信息失败", e);
                        runOnUiThread(() -> afterCheckAppUpdate());
                    }
                }
                else {
                    if (!TextUtils.isEmpty(response.message())) {
                        tip(getString(R.string.notification_status_check_update_failed_reason, response.message())).iconError().show();
                    }
                    runOnUiThread(() -> afterCheckAppUpdate());
                }
            }
        });
    }

    /**
     * 获取当前应用版本
     */
    private String getCurrentAppVersion() {
        try {
            String packageName = getPackageName();
            return getPackageManager().getPackageInfo(packageName, 0).versionName;
        } catch (PackageManager.NameNotFoundException e) {
            Log.e(TAG, "获取应用版本失败", e);
            return "0.0.0"; // 返回默认版本号
        }
    }

    /**
     * 比较版本号
     * @param newVersion 新版本号
     * @param currentVersion 当前版本号
     * @return 如果新版本更新则返回 true
     */
    private boolean isNewerVersion(String newVersion, String currentVersion) {
        try {
            String[] newParts = newVersion.split("\\.");
            String[] currentParts = currentVersion.split("\\.");

            for (int i = 0; i < Math.max(newParts.length, currentParts.length); i++) {
                int newPart = i < newParts.length ? Integer.parseInt(newParts[i]) : 0;
                int currentPart = i < currentParts.length ? Integer.parseInt(currentParts[i]) : 0;

                if (newPart > currentPart) {
                    return true;
                } else if (newPart < currentPart) {
                    return false;
                }
            }
        } catch (Exception e) {
            Log.e(TAG, "版本号比较出错", e);
            // 如果版本号格式异常，默认为被篡改，进行更新
            return true;
        }
        // 版本号相同，无需更新
        return false;
    }

    /**
     * 显示更新对话框
     */
    private void showUpdateDialog(String newVersion, String releaseNotes, String downloadUrl, JSONArray assets) {
        // 请求安装权限（Android 8.0+）
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            boolean hasInstallPermission = getPackageManager().canRequestPackageInstalls();
            if (!hasInstallPermission) {
                requestInstallPermission(newVersion, releaseNotes, downloadUrl, assets);
                return;
            }
        }

        // 查找 APK 文件
        JSONObject asset = findApkAssetUrl(assets);
        String apkDownloadUrl = asset.getString("browser_download_url");
        // Long size = asset.getLong("size");

        if (apkDownloadUrl != null) {
            MessageDialog dialog = MessageDialog.build()
                    .setTitle(getString(R.string.notification_status_new_version_found))
                    .setMessage(getString(R.string.notification_content_update_info, newVersion, releaseNotes))
                    .setCancelable(false)
                    .setOkButton(R.string.notification_action_update_now, (dialog2, v) -> {
                        dialog2.dismiss();
                        // 直接下载 APK 文件
                        downloadApkFile(newVersion, releaseNotes, apkDownloadUrl);
                        return false;
                    });
            DialogXUtil.setupMarkdownForMessage(dialog);
            dialog.show();
        } else {
            // 如果没有找到 APK，仍然提供原始链接
            MessageDialog dialog = MessageDialog.build()
                    .setTitle(R.string.notification_status_new_version_found)
                    .setMessage(getString(R.string.notification_content_update_info, newVersion, releaseNotes) + "\n\n" + getString(R.string.notification_status_apk_not_found))
                    // .setCancelable(false)
                    .setOkButton(R.string.notification_action_open_page, (dialog2, v) -> {
                        // 打开浏览器下载更新
                        Intent browserIntent = new Intent(Intent.ACTION_VIEW, Uri.parse(downloadUrl));
                        startActivity(browserIntent);
                        return false;
                    });
            DialogXUtil.setupMarkdownForMessage(dialog);
            dialog.show();
        }
    }

    /**
     * 下载 APK 文件
     * @param downloadUrl APK 文件的下载链接
     */
    private void downloadApkFile(String newVersion, String releaseNotes, String downloadUrl) {
        MessageDialog dialog = MessageDialog.build()
                .setTitle(R.string.notification_progress_downloading)
                .setMessage(getString(R.string.notification_content_update_info, newVersion, releaseNotes))
                .setCancelable(false)
                .setOkButton(R.string.notification_status_downloading, (dialog2, v) -> true);
        DialogXUtil.setupMarkdownForMessage(dialog);
        dialog.show();
        File cacheDir = getCacheDir();
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
        // 使用dialog显示下载进度内容
        GitHubUtil.downloadFile(downloadUrl, new File(downloadDir, "update.apk"), new GitHubUtil.DownloadFileListener() {
            @Override
            public void onProgress(long received, long total) {
                if (total > 0) {
                    int progress = (int) (received * 100 / total);
                    Log.e(TAG, "下载中: " + progress + "%(" + GitHubUtil.formatFileSize(received) + "/" + GitHubUtil.formatFileSize(total) + ")");
                    dialog.setOkButton(progress + "%");
                }
            }

            @Override
            public void onSuccess(File file) {
                dialog.setOkButton(R.string.notification_status_downloaded_click_install, (dialog2, v) -> {
                    installApk(file);
                    return true;
                });
                installApk(file);
            }

            @Override
            public void onFailure(Exception e) {
                tip("下载失败: " + e.getMessage()).iconError().show();
                dialog.setTitle(R.string.notification_status_download_failed)
                        .setMessage(getString(R.string.notification_error_restart_to_retry_update, e.getMessage()))
                        .setOkButton(R.string.notification_action_restart, (dialog2, v) -> {
                    Settings.restartApp(LaunchActivity.this);
                    return false;
                });
            }
        });
    }

    /**
     * 从 assets 中查找 APK 文件的下载链接
     * @param assets GitHub releases 的 assets 数组
     * @return APK 文件的下载链接，如果没有找到则返回 null
     */
    private JSONObject findApkAssetUrl(JSONArray assets) {
        if (assets == null) {
            return null;
        }

        for (int i = 0; i < assets.size(); i++) {
            com.alibaba.fastjson.JSONObject asset = assets.getJSONObject(i);
            String name = asset.getString("name");
            String contentType = asset.getString("content_type");

            // 检查文件名是否以 .apk 结尾（不区分大小写）
            if (name != null && (name.toLowerCase().endsWith(".apk") ||
                    "application/vnd.android.package-archive".equals(contentType))) {
                return asset;
            }
        }

        return null;
    }

    // 请求安装未知应用权限
    @RequiresApi(api = Build.VERSION_CODES.O)
    private void requestInstallPermission() {
        MessageDialog.build()
                .setTitle(R.string.notification_status_new_version_found)
                .setMessage(R.string.permission_require_install_packages)
                .setOkButton(R.string.common_action_go_to_settings, (dialog, v) -> {
                    Intent intent = new Intent(android.provider.Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES);
                    intent.setData(Uri.parse("package:" + getPackageName()));
                    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
                    startActivity(intent);
                    finish();
                    return true;
                })
                .show(this);
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    private void requestInstallPermission(String newVersion, String releaseNotes, String downloadUrl, JSONArray assets) {
        MessageDialog.build()
                .setTitle(R.string.notification_status_new_version_found)
                .setMessage(R.string.permission_require_install_packages)
                .setOkButton(R.string.common_action_go_to_settings, (dialog, v) -> {
                    Intent intent = new Intent(android.provider.Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES);
                    intent.setData(Uri.parse("package:" + getPackageName()));
                    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
                    startActivity(intent);
                    // finish();
                    // 修改，点击后继续
                    // 应该要获取点击结果后再改，或者说跳转要新开界面
                    dialog.setOkButton(R.string.common_status_setup_complete, (dialog2, v2) -> {
                        showUpdateDialog(newVersion, releaseNotes, downloadUrl, assets);
                        return false;
                    });
                    dialog.refreshUI();
                    return true;
                })
                .show(this);
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    private void requestInstallPermission(File apkFile) {
        MessageDialog.build()
                .setTitle(R.string.notification_status_new_version_found)
                .setMessage(R.string.permission_require_install_packages)
                .setOkButton(R.string.common_action_go_to_settings, (dialog, v) -> {
                    Intent intent = new Intent(android.provider.Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES);
                    intent.setData(Uri.parse("package:" + getPackageName()));
                    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
                    startActivity(intent);
                    // finish();
                    // 修改，点击后继续
                    dialog.setOkButton(R.string.common_status_setup_complete, (dialog2, v2) -> {
                        installApk(apkFile);
                        return false;
                    });
                    dialog.refreshUI();
                    return true;
                })
                .show(this);
    }

    /**
     * 安装 APK 文件
     * @param apkFile APK 文件
     */
    private void installApk(File apkFile) {
        // 请求安装权限（Android 8.0+）
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            boolean hasInstallPermission = getPackageManager().canRequestPackageInstalls();
            if (!hasInstallPermission) {
                requestInstallPermission(apkFile);
                return;
            }
        }

        // 准备安装意图
        Intent installIntent = new Intent(Intent.ACTION_VIEW);

        // Android 7.0+ 使用 FileProvider
        Uri apkUri = androidx.core.content.FileProvider.getUriForFile(
                this,
                getPackageName() + ".fileprovider",
                apkFile);
        installIntent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
        installIntent.setDataAndType(apkUri, "application/vnd.android.package-archive");
        installIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);

        try {
            startActivity(installIntent);
        } catch (Exception e) {
            Log.e(TAG, "启动系统安装器失败", e);
            tip(getString(R.string.notification_error_system_installer_failed_reason, e.getMessage())).iconError().show();
            afterCheckAppUpdate();
        }
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        // 更新当前的intent
        setIntent(intent);
        if (null != intent) {
            if (Intent.ACTION_VIEW.equals(intent.getAction())) {
                importFileFromIntent(intent);
            }
            // 处理从通知点击传递过来的下载文件路径
            else if (intent.hasExtra("download_path")) {
                // 用户点击了通知，手动关闭对应的通知
                clearDownloadNotification(this);
                // 清除extra
                intent.removeExtra("download_path");
            }
            else if (intent.hasExtra("download_error")) {
                // 用户点击了通知，手动关闭对应的通知
                clearDownloadNotification(this);
                // 清除extra
                intent.removeExtra("download_error");
                // tip(intent.getStringExtra("download_error")).iconError().show();
            }
        }
    }

    private void importFileFromIntent(Intent intent) {
        runOnUiThread(() -> {
            Uri data = intent.getData();
            if (intent.hasExtra("download_path")) {
                data = Uri.fromFile(new File(intent.getStringExtra("download_path")));
            }
            viewModel.navigateTo("导入", "导入");
            decompressHelper.handleUri(data);
        });
    }

    private void importFileFromUri(Uri data) {
        runOnUiThread(() -> {
            viewModel.navigateTo("导入", "导入");
            decompressHelper.handleUri(data);
        });
    }


    private void initFunctions() {
        InputStream stream = getResources().openRawResource(R.raw.function_config);
        BufferedReader reader = new BufferedReader(new InputStreamReader(stream));
        StringBuilder jsonStr = new StringBuilder();
        String line;

        try {
            while ((line = reader.readLine()) != null) {
                jsonStr.append(line);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        LinearLayout linearLayout = findViewById(R.id.function_buttons);
        List<FunctionBean> functions = JSON.parseArray(jsonStr.toString(), FunctionBean.class);

        functions.forEach(f -> {
            NButton button = new NButton(this);
            button.setButtonText(f.getName());
            button.setCaptionColor(f.getColor());
            button.setOnClickListener(functionButtonListener);
            int size = getResources().getDimensionPixelSize(R.dimen.n_button_size);
            linearLayout.addView(button, new LinearLayout.LayoutParams(size, size));
        });

        functionManager = new FunctionManager(this, functionContainer, functions);
        functionManager.onCreate();
    }

    @Override
    protected void onResume() {
        super.onResume();

        if (null != functionManager) {
            functionManager.onResume();
        }
    }

    @Override
    public void onBackPressed() {
        if ((null != functionManager) && functionManager.onBackPressed()) {
            hideFunctionContainer();
            return;
        }

        super.onBackPressed();
    }

    private AnimatorSet funcContainerHideAnim = null;
    private AnimatorSet funcContainerShowAnim = null;

    private void hideFunctionContainer() {
        if (null != funcContainerShowAnim && funcContainerShowAnim.isStarted()) {
            funcContainerShowAnim.cancel();
        }

        if (null == funcContainerHideAnim) {
            funcContainerHideAnim = new AnimatorSet();

            ValueAnimator alphaAnimator = AnimatorUtil.ofAlpha(1f, 0.2f, 300);
            alphaAnimator.addUpdateListener(animation -> {
                if (null != functionContainer) {
                    functionContainer.setAlpha((float) animation.getAnimatedValue());
                }
            });

            ValueAnimator scaleAnimator = AnimatorUtil.ofScale(1f, 0.0f);
            scaleAnimator.addUpdateListener(animation -> {
                if (null != functionContainer) {
                    functionContainer.setScaleX((float) animation.getAnimatedValue());
                    functionContainer.setScaleY((float) animation.getAnimatedValue());
                }
            });

            ValueAnimator alphaAnimator1 = AnimatorUtil.ofAlpha(0.1f, 1f);
            alphaAnimator1.addUpdateListener(animation -> {
                if (null != lunchViewContainer) {
                    lunchViewContainer.setAlpha((float) animation.getAnimatedValue());
                }
            });

            ValueAnimator scaleAnimator1 = AnimatorUtil.ofScale(0.8f, 1f);
            scaleAnimator1.addUpdateListener(animation -> {
                if (null != lunchViewContainer) {
                    lunchViewContainer.setScaleX((float) animation.getAnimatedValue());
                    lunchViewContainer.setScaleY((float) animation.getAnimatedValue());
                }
            });

            funcContainerHideAnim.addListener(new AnimatorListenerAdapter() {
                @Override
                public void onAnimationStart(Animator animation) {
                    functionContainer.setVisibility(View.VISIBLE);
                    lunchViewContainer.setVisibility(View.VISIBLE);
                }

                @Override
                public void onAnimationEnd(Animator animation) {
                    functionContainer.setVisibility(View.GONE);
                }
            });

            funcContainerHideAnim.play(alphaAnimator)
                    .with(scaleAnimator)
                    .with(alphaAnimator1)
                    .with(scaleAnimator1);
            keepAnimator(funcContainerHideAnim);
        }

        funcContainerHideAnim.start();
    }

    private void showFunctionContainer() {
        if (null != funcContainerHideAnim && funcContainerHideAnim.isStarted()) {
            funcContainerHideAnim.cancel();
        }

        if (null == funcContainerShowAnim) {
            funcContainerShowAnim = new AnimatorSet();

            ValueAnimator alphaAnimator = AnimatorUtil.ofAlpha(0.2f, 1f);
            alphaAnimator.addUpdateListener(animation -> {
                if (null != functionContainer) {
                    functionContainer.setAlpha((float) animation.getAnimatedValue());
                }
            });

            ValueAnimator scaleAnimator = AnimatorUtil.ofScale(0.5f, 1f);
            scaleAnimator.addUpdateListener(animation -> {
                if (null != functionContainer) {
                    functionContainer.setScaleX((float) animation.getAnimatedValue());
                    functionContainer.setScaleY((float) animation.getAnimatedValue());
                }
            });

            ValueAnimator alphaAnimator1 = AnimatorUtil.ofAlpha(1f, 0.1f);
            alphaAnimator1.addUpdateListener(animation -> {
                if (null != lunchViewContainer) {
                    lunchViewContainer.setAlpha((float) animation.getAnimatedValue());
                }
            });

            ValueAnimator scaleAnimator1 = AnimatorUtil.ofScale(1f, 0.8f);
            scaleAnimator1.addUpdateListener(animation -> {
                if (null != lunchViewContainer) {
                    lunchViewContainer.setScaleX((float) animation.getAnimatedValue());
                    lunchViewContainer.setScaleY((float) animation.getAnimatedValue());
                }
            });

            funcContainerShowAnim.play(alphaAnimator)
                    .with(scaleAnimator)
                    .with(alphaAnimator1)
                    .with(scaleAnimator1);

            funcContainerShowAnim.addListener(new AnimatorListenerAdapter() {
                @Override
                public void onAnimationStart(Animator animation) {
                    functionContainer.setVisibility(View.VISIBLE);
                    lunchViewContainer.setVisibility(View.VISIBLE);
                    lunchViewContainer.setEnabled(false);
                }

                @Override
                public void onAnimationEnd(Animator animation) {
                    functionContainer.setVisibility(View.VISIBLE);
                }
            });
            keepAnimator(funcContainerShowAnim);
        }

        funcContainerShowAnim.start();
    }

    private final CopyOnWriteArrayList<Animator> animatorsHolder = new CopyOnWriteArrayList<>();

    private void keepAnimator(Animator animator) {
        animatorsHolder.add(animator);
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        hideSystemUI();
    }

    @Subscribe(threadMode = ThreadMode.MAIN)
    public void onMessageEvent(MsgToActivity msg) {
        switch (msg.type) {
            case MessageType.RESTART_APPLICATION: {
                Settings.askForRestart(this);
                break;
            }
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

    private void hideSystemUI() {
        final int uiOptions = View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                | View.SYSTEM_UI_FLAG_FULLSCREEN
                | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY;

        getWindow().getDecorView().setSystemUiVisibility(uiOptions);
        getWindow().setStatusBarColor(Color.TRANSPARENT);
    }

    @Override
    protected void onDestroy() {
        synchronized (com.widget.noname.File.filesToDeleteOnExit) {
            for (String filePath : com.widget.noname.File.filesToDeleteOnExit) {
                Log.e("File", "delete file: " + filePath);
                try {
                    new File(filePath).delete();
                } catch (Exception e) {
                    // 忽略删除失败的情况
                    e.printStackTrace();
                    Log.e("File", "Failed to delete file: " + filePath);
                }
            }
            com.widget.noname.File.filesToDeleteOnExit.clear();
        }
        // deleteDownloadCache();
        ShizukuUtil.destroyShizuku();
        animatorsHolder.forEach(Animator::cancel);
        animatorsHolder.clear();
        super.onDestroy();
        // 解绑
        if (serviceConnection != null && isServiceBound) {
            unbindService(serviceConnection);
            if (customService != null) {
                try {
                    customService.killProcess();
                } catch (RemoteException e) {
                    e.printStackTrace();
                }
            }
            isServiceBound = false;
        }
    }

    @Override
    public void onClick(View v) {

    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        Log.e(TAG, "requestCode: " + requestCode);
        Log.e(TAG, "resultCode: " + resultCode);
        Log.e(TAG, "data: " + data);
        // 所有结果都通过 EventBus 发出去
        EventBus.getDefault().post(
                new ActivityResultEvent(requestCode, resultCode, data)
        );
    }

    @Subscribe(threadMode = ThreadMode.MAIN)
    public void onUriReceivedEvent(UriReceivedEvent event) {
        Log.e(TAG, "接收到uri");
        importFileFromUri(event.uri);
    }

    @Subscribe(threadMode = ThreadMode.MAIN)
    public void onSettingsChangeEvent(SettingsChangeEvent event) {
        switch (event.getKey()) {
            case Settings.KEY_APP_ICON: {
                if (isServiceBound && customService != null) {
                    try {
                        customService.onSettingsChanged(event.getKey(), Settings.getAppIcon());
                    } catch (RemoteException e) {
                        Log.e(TAG, "Failed to send settings change to service", e);
                    }
                }
                break;
            }
            case Settings.KEY_CUSTOM_THEME:
            case Settings.KEY_CUSTOM_BACKGROUND_PATH: {
                setBackgroundImage();
                break;
            }
        }
    }

    private void setBackgroundImage() {
        String themeName = Settings.getCustomTheme();
        Settings.ThemeSettings themeSetting = new Settings.ThemeSettings(themeName);
        File themeDir = themeSetting.getThemeDir();
        // 主题文件不存在
        if (!themeDir.exists()) {
            Settings.setCustomTheme(getString(com.widget.noname.function.functionlibrary.R.string.theme_name_default));
        }
        String backgroundImagePath = themeSetting.getCustomBackgroundPath();
        File backgroundImageFile = new File(backgroundImagePath);

        if (!backgroundImageFile.exists() || backgroundImageFile.isDirectory()) {
            // 默认值
            backgroundImageFile = new File(themeSetting.getThemeBackgroundDir(), "background.png");
            if (!backgroundImageFile.exists()) {
                backgroundImage.setImageResource(R.drawable.launch_layout_bg);
                return;
            }
            else {
                themeSetting.setCustomBackgroundPath("0.jpg");
            }
        }

        // 兜底
        Glide.with(this)
                .load(backgroundImageFile)
                .diskCacheStrategy(DiskCacheStrategy.NONE)
                .fallback(R.drawable.launch_layout_bg)
                .into(backgroundImage);
    }


    private boolean checkGamePath() {
        String path = MMKV.defaultMMKV().getString(FileConstant.GAME_PATH_KEY, null);

        if (path == null) {
            tip(com.widget.noname.function.functionlibrary.R.string.gamemain_error_not_set).iconError().show();
            return false;
        }

        File file = new File(path);

        if (!file.exists() || !file.isDirectory()) {
            tip(com.widget.noname.function.functionlibrary.R.string.gamemain_error_not_set_or_invalid).iconError().show();
            return false;
        }
        return true;
    }

    private void askToGame() {
        if (checkGamePath()) {
            MessageDialog.build()
                    .setTitle(R.string.common_tip)
                    .setMessage(R.string.common_dialog_prompt_enter_game)
                    .setCancelable(false)
                    .setOkButton(android.R.string.ok, (baseDialog, view) -> {
                        functionManager.checkToSwitch("开始");
                        return false;
                    })
                    .setCancelButton(android.R.string.cancel, (baseDialog, view) -> {
                        viewModel.navigateTo("版本", "版本");
                        return false;
                    })
                    .show();
        }
    }

    private void performCleanup() {
        if (serviceConnection != null && isServiceBound) {
            try {
                if (customService != null) {
                    customService.killProcess();
                }
                Intent serviceIntent = new Intent(this, CustomService.class);
                stopService(serviceIntent);
                unbindService(serviceConnection);
            } catch (Exception e) {
                Log.e(TAG, "解绑Service异常", e);
            }
        }
        Process.killProcess(Process.myPid());
        System.exit(1);
    }

    private void cleanupBadProcesses() {
        ActivityManager am = (ActivityManager) getSystemService(Context.ACTIVITY_SERVICE);
        // 杀死同包名的所有其他进程
        List<ActivityManager.RunningAppProcessInfo> processes = am.getRunningAppProcesses();
        if (processes != null) {
            Log.d(TAG, "processes: " + processes.size());
            for (ActivityManager.RunningAppProcessInfo process : processes) {
                Log.d(TAG, "processName: " + process.processName);
                if (process.processName.startsWith(getPackageName())) {
                    // 判断是否为当前进程（通过PID匹配）
                    if (process.pid == Process.myPid() || process.processName.equals(getPackageName())) {
                        continue; // 跳过当前进程
                    }
                    Log.d(TAG, "杀死进程: " + process.processName);
                    try {
                        Process.killProcess(process.pid);
                    } catch (Exception e) {
                        Log.e(TAG, "杀死进程失败: " + process.processName, e);
                    }
                }
            }
        }
        else {
            Log.e(TAG, "无法获取运行中的进程列表");
        }
    }

    public void startNode(final Activity activity) {
        Log.e(TAG, "startNode");
        Log.e(TAG, "_startedNodeAlready: " + _startedNodeAlready);
        if (!_startedNodeAlready) {
            _startedNodeAlready = true;

            String dirName = "node";
            String nodeDir = activity.getApplicationContext().getFilesDir().getAbsolutePath() + "/" + dirName;
            if (NodeUtil.wasAPKUpdated(activity.getApplicationContext())) {
                File nodeDirReference = new File(nodeDir);
                if (nodeDirReference.exists()) {
                    FileUtil.deleteFolderRecursively(new File(nodeDir));
                }
                FileUtil.copyAssetFolder(activity.getApplicationContext().getAssets(), dirName, nodeDir);
                NodeUtil.saveLastUpdateTime(activity.getApplicationContext());
            }

            // nodejs-mobile
//            (new Thread(new Runnable() {
//                public void run() {
//                    int result = nativeLib.startNodeWithArguments(new String[]{"node", nodeDir + "/main.js", "--inspect"});
//                    Log.e(TAG, "startNodeWithArguments result: " + result);
//                    _startedNodeAlready = false;
//                }
//            })).start();

            // termux
            // todo 添加termux通信
            // 文件复制过去执行的话，webview的读取的目录也应该改过去（vite项目）
            // termux app应该确认下载nodejs，然后再运行
            // 当然，也可以运行别的，比如git，用于给目录回滚等功能
            // 其他的再说吧
            
        }
    }

    private void loadHostsAndInitClient() {
        // 检查缓存是否有效
        MMKV mmkv = MMKV.defaultMMKV();
        long lastUpdate = mmkv.decodeLong("hosts_last_update", 0);
        String cachedHosts = mmkv.decodeString("hosts_cache", "");
        // 如果缓存在一天内，则直接使用缓存
        if (System.currentTimeMillis() - lastUpdate < 7 * 24 * 60 * 60 * 1000 && !cachedHosts.isEmpty()) {
            try {
                processHostsJson(cachedHosts);
                afterLoadHosts();
                return;
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        OkHttpClient bootstrapClient = new OkHttpClient();
        Request request = new Request.Builder()
                .url("https://raw.hellogithub.com/hosts.json")
                .build();

        bootstrapClient.newCall(request).enqueue(new Callback() {
            @Override
            public void onFailure(@NonNull Call call, @NonNull IOException e) {
                // 失败处理：使用本地缓存或默认 DNS
                e.printStackTrace();
                runOnUiThread(() -> {
                    afterLoadHosts();
                });
                tip(R.string.network_error_load_hosts_failed);
            }

            @Override
            public void onResponse(@NonNull Call call, @NonNull Response response) throws IOException {
                if (response.isSuccessful()) {
                    String HOSTS_JSON = response.body().string();
                    Log.d("Hosts", HOSTS_JSON);

                    // 保存到缓存
                    MMKV mmkv = MMKV.defaultMMKV();
                    mmkv.encode("hosts_cache", HOSTS_JSON);
                    mmkv.encode("hosts_last_update", System.currentTimeMillis());

                    processHostsJson(HOSTS_JSON);
                }
                else {
                    tip(R.string.network_error_load_hosts_failed);
                }
                runOnUiThread(() -> {
                    afterLoadHosts();
                });
            }
        });
    }

    private void processHostsJson(String HOSTS_JSON) throws UnknownHostException {
        JSONArray array = JSONArray.parseArray(HOSTS_JSON);
        for (int i = 0; i < array.size(); i++) {
            JSONArray pair = array.getJSONArray(i);
            String ip = pair.getString(0);
            String host = pair.getString(1);

            InetAddress address = InetAddress.getByName(ip);
            HostsDns.hostMap.computeIfAbsent(host, k -> new ArrayList<>()).add(address);
        }
    }

    private void deleteDownloadCache() {
        File downloadDir = new File(getCacheDir(), "download");
        FileUtil.deleteFolderRecursively(downloadDir);
    }

    public static void clearDownloadNotification(Context context) {
        NotificationManager nm = (NotificationManager) context.getSystemService(NOTIFICATION_SERVICE);

        // 清除所有可能的下载通知ID
        nm.cancel(DownloadService.PROGRESS_NOTIFICATION_ID); // 原始ID
        nm.cancel(DownloadService.SUCCESS_NOTIFICATION_ID); // 成功通知ID
        nm.cancel(DownloadService.FAILURE_NOTIFICATION_ID); // 失败通知ID
        nm.cancel(DownloadService.CANCEL_NOTIFICATION_ID); // 取消下载通知ID
    }
}