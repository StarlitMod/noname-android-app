package com.widget.noname;

import static com.kongzue.dialogx.dialogs.PopTip.tip;

import android.annotation.SuppressLint;
import android.app.Application;
import android.content.Context;
import android.graphics.Typeface;
import android.os.Build;
import android.util.DisplayMetrics;
import android.webkit.WebView;

import com.kongzue.dialogx.DialogX;
import com.kongzue.dialogx.dialogs.MessageDialog;
import com.kongzue.dialogx.dialogs.PopTip;
import com.kongzue.dialogx.interfaces.DialogXStyle;
import com.kongzue.dialogx.interfaces.OnDialogButtonClickListener;
import com.kongzue.dialogx.style.MaterialStyle;
import com.tencent.mmkv.MMKV;
import com.widget.noname.common.manager.FontManager;
import com.widget.noname.common.manager.ThreadManager;
import com.widget.noname.common.util.FileConstant;
import com.widget.noname.function.functionlibrary.R;
import com.widget.noname.okhttp.DownloadService;
import com.widget.noname.theme.ThemeManager;

import java.io.File;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class MyApplication extends Application {
    private static final String TAG = "MyApplication";
    private static Typeface typeface = null;
    private static ExecutorService threadPool = null;
    @SuppressLint("StaticFieldLeak")
    private static Context context = null;

    @Override
    protected void attachBaseContext(Context base) {
        super.attachBaseContext(base);
    }

    @Override
    public void onCreate() {
        super.onCreate();

        CrashHandler.register(this);

        if (MyApplication.class.getSuperclass() != Application.class) {
            throw new RuntimeException("this class is not MyApplication");
        }

        context = this;

        // SAK.init(this, config);

        // if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
        //            NotificationManager nm = getSystemService(NotificationManager.class);
        //            List<NotificationChannel> channels = nm.getNotificationChannels();
        //
        //            for (NotificationChannel channel : channels) {
        //                try {
        //                    nm.deleteNotificationChannel(channel.getId());
        //                } catch (SecurityException e) {
        //                    Log.e("DownloadService", "无法删除渠道: " + channel.getId(), e);
        //                }
        //            }
        //        }

        DownloadService.createNotificationChannel(this);

        ThemeManager.init(this);
        // WebViewManager.prepare(this);
        MMKV.initialize(this);
        initDialogX(this);

        // 加载字体
        typeface = Typeface.createFromAsset(getAssets(), "font/xingkai.ttf");
        FontManager.getInstance().setTypeFace("xinwei", typeface);

        threadPool = Executors.newFixedThreadPool(3);
        ThreadManager.getInstance().init(threadPool);

        createExitListener();

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
            String processName = getProcessName();
            // devtools进程
            if (processName != null && processName.endsWith(":devtools")) {
                try {
                    WebView.setDataDirectorySuffix("devtools");
                } catch (Exception e) {
                    tip(R.string.config_info_webview_data_isolation_enabled).iconError().show();
                    e.printStackTrace();
                }
            }
            // 其它进程
            else {
                String GameRootPath = MMKV.defaultMMKV().getString(FileConstant.GAME_PATH_KEY, null);
                if (GameRootPath != null) {
                    File gamePath =  new File(GameRootPath);
                    try {
                        WebView.setDataDirectorySuffix(gamePath.getName());
                    } catch (Exception e) {
                        tip(R.string.config_info_webview_data_isolation_enabled).iconError().show();
                        e.printStackTrace();
                    }
                }
            }
        }
    }

    public static Typeface getTypeface() {
        return typeface;
    }

    public static ExecutorService getThreadPool() {
        return threadPool;
    }

    public static Context getContext() {
        return context;
    }

    public static OnDialogButtonClickListener createExitListener() {
        return (dialog, which) -> {
            android.os.Process.killProcess(android.os.Process.myPid());
            System.exit(0);
            return false;
        };
    }

    public static void initDialogX(Context context) {
        // 获取屏幕显示 metrics
        DisplayMetrics displayMetrics = context.getResources().getDisplayMetrics();
        // 获取屏幕的较大边
        int largerScreenDimension = Math.max(displayMetrics.widthPixels, displayMetrics.heightPixels);
        // 按照较大边的一半来设置dialog最大宽度
        DialogX.dialogMaxWidth = largerScreenDimension / 2;
        // 设置主题样式
        try {
            DialogX.globalStyle = (DialogXStyle) Class.forName(Settings.getDialogTheme()).getMethod("style").invoke(null);
        } catch (Exception e) {
            DialogX.globalStyle = MaterialStyle.style();
        }
        // DialogX.globalStyle = GenshinImpactStyle.style();
        // 设置亮色/暗色（在启动下一个对话框时生效）
        DialogX.globalTheme = DialogX.THEME.AUTO;
        // 设置 InputDialog 自动弹出键盘
        DialogX.autoShowInputKeyboard = true;
        // 设置默认对话框默认是否可以点击外围遮罩区域或返回键关闭，此开关不影响提示框（TipDialog）以及等待框（TipDialog）
        DialogX.cancelable = true;
        // 设置默认提示框及等待框（WaitDialog、TipDialog）默认是否可以关闭
        DialogX.cancelableTipDialog = false;
        // 是否自动在主线程执行
        DialogX.autoRunOnUIThread = true;
        // 使用振动反馈（影响 WaitDialog、TipDialog）
        DialogX.useHaptic = true;
        // 开启沉浸式适配
        DialogX.enableImmersiveMode = true;
        // 忽略左右两侧的非安全区（以处理对于部分 activity 在存在刘海屏的设备上横屏显示时，对话框左侧出现边距的问题）
        DialogX.ignoreUnsafeInsetsHorizontal = false;
        // 销毁对话框时自动回收内存
        DialogX.autoGC = true;

        // 允许多个 PopTip 同时弹出多个实例
        DialogX.onlyOnePopTip = false;
        // 设置全局 PopTip入场动画
        PopTip.overrideEnterAnimRes = com.widget.noname.function.functionlibrary.R.anim.zoom_in;
        // 设置全局 PopTip出场动画
        PopTip.overrideExitAnimRes = com.widget.noname.function.functionlibrary.R.anim.zoom_out;

        // 设置全局 MessageDialog 入场动画
        MessageDialog.overrideEnterAnimRes = com.widget.noname.function.functionlibrary.R.anim.zoom_in;
        // 设置全局 MessageDialog 出场动画
        MessageDialog.overrideExitAnimRes = com.widget.noname.function.functionlibrary.R.anim.zoom_out;

        DialogX.init(context);
    }
}
