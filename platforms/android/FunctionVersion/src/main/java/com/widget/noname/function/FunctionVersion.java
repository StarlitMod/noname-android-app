package com.widget.noname.function;

import static com.kongzue.dialogx.dialogs.PopTip.tip;

import android.app.Activity;
import android.content.Context;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.WebView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentActivity;
import androidx.lifecycle.ViewModelProvider;
import androidx.viewpager2.widget.ViewPager2;

import com.alibaba.fastjson.JSON;
import com.google.android.material.tabs.TabLayout;
import com.google.android.material.tabs.TabLayoutMediator;
import com.tencent.mmkv.MMKV;
import com.widget.noname.Settings;
import com.widget.noname.function.functionlibrary.bridge.BridgeHelper;
import com.widget.noname.function.functionlibrary.bridge.OnJsBridgeCallback;
import com.widget.noname.common.function.BaseFunction;
import com.widget.noname.common.manager.WebViewManager;
import com.widget.noname.common.util.FileConstant;
import com.widget.noname.function.functionlibrary.data.ExtensionInfo;
import com.widget.noname.function.functionlibrary.data.ImportEventViewModel;
import com.widget.noname.function.functionlibrary.data.MessageType;
import com.widget.noname.eventbus.GameExitEvent;
import com.widget.noname.eventbus.GameStartEvent;
import com.widget.noname.eventbus.MsgToActivity;
import com.widget.noname.eventbus.SettingsChangeEvent;
import com.widget.noname.eventbus.UpdateExtListEvent;
import com.widget.noname.function.functionversion.R;
import com.widget.noname.function.functionversion.subfragment.ExtManageFragment;
import com.widget.noname.util.PagerHelper;
import com.widget.noname.function.functionversion.adapter.VersionControlViewPagerAdapter;
import com.widget.noname.function.functionversion.subfragment.VersionControlFragment;

import org.greenrobot.eventbus.EventBus;
import org.greenrobot.eventbus.Subscribe;
import org.greenrobot.eventbus.ThreadMode;

import java.io.File;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class FunctionVersion extends BaseFunction implements OnJsBridgeCallback {
    private static final String TAG = "FunctionVersion";

    private ImportEventViewModel viewModel;

    private ExtManageFragment extManageFragment;

    private VersionControlFragment versionControlFragment;

    public FunctionVersion(@NonNull Context context) {
        super(context);
    }

    @Override
    public void onCreate() {
        super.onCreate();
        if (!EventBus.getDefault().isRegistered(this)) {
            EventBus.getDefault().register(this);
        }
    }

    @Override
    public View onCreateView(Context context, @Nullable ViewGroup container) {
        return LayoutInflater.from(context).inflate(R.layout.function_version, container, false);
    }

    @Override
    protected void onViewCreated(View view) {
        super.onViewCreated(view);

        viewPager2 = view.findViewById(R.id.view_pager2);
        viewPager2.setOrientation(ViewPager2.ORIENTATION_HORIZONTAL);
        adapter = new VersionControlViewPagerAdapter((FragmentActivity) getContext());
        adapter.addFragment(PagerHelper.SUB_FRAGMENT_ASSET);
        adapter.addFragment(PagerHelper.SUB_FRAGMENT_VERSION);
        adapter.addFragment(PagerHelper.SUB_FRAGMENT_EXT_MANAGE);
        viewPager2.setAdapter(adapter);

        TabLayout tabLayout = view.findViewById(R.id.tab_layout);
        new TabLayoutMediator(tabLayout, viewPager2, (tab, position) -> tab.setText(fragments[position])).attach();

        TextView textView = view.findViewById(R.id.text_import_file);
        textView.setVisibility(View.GONE);

        // 延迟到 ViewPager 滑动到对应页面时再设置回调
        viewPager2.registerOnPageChangeCallback(new ViewPager2.OnPageChangeCallback() {
            @Override
            public void onPageSelected(int position) {
                super.onPageSelected(position);
                update(position);
            }
        });

        // 将 context 强转为 FragmentActivity
        if (!(getContext() instanceof FragmentActivity activity)) {
            throw new IllegalStateException("Context must be an instance of FragmentActivity");
        }

        viewModel = new ViewModelProvider(activity).get(ImportEventViewModel.class);
        viewModel.getNavigationEvent().observe(activity, funNameAndTabName -> {
            if (funNameAndTabName != null) {
                String[] split = funNameAndTabName.split("-");
                if (split.length == 2) {
                    String funName = split[0];
                    if (!funName.equals("版本")) return;
                    String tabName = split[1];
                    // 查找 tabName 在 fragments 数组中的位置
                    int targetPosition = -1;
                    for (int i = 0; i < fragments.length; i++) {
                        if (fragments[i].equals(tabName)) {
                            targetPosition = i;
                            break;
                        }
                    }
                    if (targetPosition != -1) {
                        int finalTargetPosition = targetPosition;
                        // 延迟 100ms 执行
                        new Handler(Looper.getMainLooper()).postDelayed(() -> {
                            viewPager2.setCurrentItem(finalTargetPosition, true); // true 表示启用滑动动画
                            update(finalTargetPosition);
                        }, 100);
                    }
                }
                else {
                    Log.e(TAG, "Invalid funNameAndTabName: " + funNameAndTabName);
                }
            }
        });
    }

    private final String[] fragments = new String[] {
            "资源", "版本", "扩展"
    };

    private ViewPager2 viewPager2 = null;
    private VersionControlViewPagerAdapter adapter = null;

    private BridgeHelper bridgeHelper = null;
    private WebView webView = null;
    private boolean pendingExtensionRefresh = false;

    private boolean startGameWhenSetIp = false;

    private void update(int position) {
        // 当切换到扩展管理页面时，获取并设置回调
        if (position == adapter.getItemPosition(PagerHelper.SUB_FRAGMENT_EXT_MANAGE)) {
            // 延迟 100ms 执行
            new Handler(Looper.getMainLooper()).postDelayed(() -> {
                Fragment fragment = adapter.getFragment(PagerHelper.SUB_FRAGMENT_EXT_MANAGE);
                if (fragment instanceof ExtManageFragment) {
                    initWebView();
                    extManageFragment = (ExtManageFragment) fragment;
                    extManageFragment.setBridgeCallback(FunctionVersion.this);
                    extManageFragment.updateExtensionList();
                    if (null != bridgeHelper) {
                        bridgeHelper.getExtensions();
                    } else {
                        pendingExtensionRefresh = true;
                    }
                }
            }, 100);
        }
        // 当切换到版本管理页面时，刷新列表
        else if (position == adapter.getItemPosition(PagerHelper.SUB_FRAGMENT_VERSION)) {
            // 延迟 100ms 执行
            new Handler(Looper.getMainLooper()).postDelayed(() -> {
                Fragment fragment = adapter.getFragment(PagerHelper.SUB_FRAGMENT_VERSION);
                if (fragment instanceof VersionControlFragment) {
                    Log.e(TAG, "VersionControlFragment updateVersionList");
                    versionControlFragment = (VersionControlFragment) fragment;
                    versionControlFragment.updateVersionList();
                }
                else Log.e(TAG, "VersionControlFragment not");
            }, 100);
        }
    }

    // 判断游戏目录
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

    private void initWebView() {
        if (!checkGamePath(false)) return;
        if (webView != null) return;
        if (bridgeHelper != null) return;
        webView = new WebView(getContext());
        webView.setVisibility(View.INVISIBLE);

        ViewGroup root = ((Activity) getContext()).findViewById(com.widget.noname.function.functionlibrary.R.id.root_view);
        if (root != null) {
            root.addView(webView);
            bridgeHelper = new BridgeHelper(webView, this);
        }
    }

    @Subscribe(threadMode = ThreadMode.MAIN)
    public void onMessageEvent(MsgToActivity msg) {
        switch (msg.type) {
            case MessageType.SET_SERVER_IP: {
                if (!checkGamePath(true)) return;
                startGameWhenSetIp = false;
                bridgeHelper.setServerIp((String) msg.obj);
                break;
            }

            case MessageType.SET_SERVER_IP_AND_START: {
                if (!checkGamePath(true)) return;
                startGameWhenSetIp = true;
                bridgeHelper.setServerIp((String) msg.obj, true);
                break;
            }
        }
    }

    public void startGame() {
        if (!checkGamePath(true)) return;
        if (viewModel != null) {
            viewModel.navigateTo("开始", "emptyTabName");
        } else {
            tip(com.widget.noname.function.functionlibrary.R.string.common_error_launch_game_failed).iconError().show();
        }
    }

    @Override
    public void onExtensionGet(String[] extensions) {
        pendingExtensionRefresh = false;
        if (null != extensions) {
            if (null == bridgeHelper) {
                Log.e(TAG, "getExtensions skipped: bridgeHelper is null");
                pendingExtensionRefresh = true;
                return;
            }
            // 获取所有已安装扩展的状态
            for (String ext : extensions) {
                if (null != ext && !ext.isEmpty()) {
                    bridgeHelper.getExtensionState(ext);
                }
            }
            // 获取所有未安装扩展的状态
            if (extManageFragment != null) {
                List<String> extList = Arrays.asList(extensions);
                for (ExtensionInfo extensionInfo : extManageFragment.extensionList) {
                    if (!extList.contains(extensionInfo.getDirectoryName())){
                        bridgeHelper.getExtensionState(extensionInfo.getDirectoryName());
                    }
                }
            }
        }
    }

    @Override
    public void onExtensionStateGet(String ext, boolean state) {
        if (extManageFragment != null) {
            extManageFragment.updateExtensionState(ext, state);
        }
    }

    @Override
    public void onExtensionEnable(String ext) {
        if (bridgeHelper != null) {
            bridgeHelper.enableExtension(ext,  true);
        }
    }

    @Override
    public void onExtensionDisable(String ext) {
        if (bridgeHelper != null) {
            bridgeHelper.enableExtension(ext, false);
        }
    }

    @Override
    public void onExtensionRemove(String ext) {
        if (bridgeHelper != null) {
            bridgeHelper.removeExtension(ext);
        }
    }

    @Override
    public void onServeIpSet() {
        if (startGameWhenSetIp) {
            startGame();
        }
    }

    @Override
    public void onPageStarted() {
        if (bridgeHelper != null) {
            bridgeHelper.getExtensions();
        } else {
            pendingExtensionRefresh = true;
        }

        if (pendingExtensionRefresh) {
            new Handler(Looper.getMainLooper()).postDelayed(() -> {
                if (bridgeHelper != null) {
                    bridgeHelper.getExtensions();
                }
            }, 150);
        }
    }

    @Override
    public void onRecentIpUpdate(String ips) {
        if (null != ips) {
            String[] split = ips.split(",");

            List<String> ipList = new ArrayList<>();

            for (String ip : split) {
                int index = ip.lastIndexOf(":8080");
                if (index > 0) {
                    ip = ip.substring(0, index);
                }

                ipList.add(ip);
            }

            String json = JSON.toJSONString(ipList);
            MMKV.defaultMMKV().encode(FileConstant.IP_LIST_KEY, json);
        }
    }

    @Override
    public void onCloseDB() {

    }

    @Override
    public void onResume() {
        super.onResume();
//        if (!Settings.getDisableLoadAssets()) {
//            initWebView();
//        }
        initWebView();
    }

    @Override
    public void onPause() {
        super.onPause();
        destroyWebView();
    }

    @Override
    public void onDestroy() {
        destroyWebView();
        if (EventBus.getDefault().isRegistered(this)) {
            EventBus.getDefault().unregister(this);
        }
    }

    public void destroyWebView() {
        if (webView != null) {
            WebViewManager.destroy(webView);
            webView = null;
        }
        bridgeHelper = null;
    }

    // 处理游戏开始事件
    @Subscribe(threadMode = ThreadMode.MAIN)
    public void onGameStartEvent(GameStartEvent event) {
        // 处理游戏开始逻辑
        destroyWebView();
    }

    @Subscribe(threadMode = ThreadMode.MAIN)
    public void onGameExitEvent(GameExitEvent event) {
//        if (!Settings.getDisableLoadAssets()) {
//            initWebView();
//        }
        destroyWebView();
        initWebView();
        // 自动刷新
        if (viewPager2 != null) update(viewPager2.getCurrentItem());
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
                // http/s下切换域名才有效
                Log.e(TAG, "Settings.KEY_HOSTNAME");
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
        }
    }

    @Subscribe(threadMode = ThreadMode.MAIN)
    public void onUpdateExtListEvent(UpdateExtListEvent event) {
        if (bridgeHelper != null) {
            bridgeHelper.getExtensions();
        }
        else {
            Log.e(TAG, "getExtensions: bridgeHelper is null");
        }
    }
}
