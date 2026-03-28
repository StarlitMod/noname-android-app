package com.widget.noname;

import android.annotation.SuppressLint;
import android.app.Application;

import androidx.annotation.NonNull;

import com.kongzue.dialogx.dialogs.MessageDialog;

import java.io.PrintWriter;
import java.io.StringWriter;

/**
 *    author : Android 轮子哥
 *    github : https://github.com/getActivity/AndroidProject
 *    time   : 2020/02/03
 *    desc   : Crash 处理类
 */
public final class CrashHandler implements Thread.UncaughtExceptionHandler {
    /**
     * 注册 Crash 监听
     */
    public static void register(Application application) {
        Thread.setDefaultUncaughtExceptionHandler(new CrashHandler(application));
    }

    private final Application mApplication;
    private final Thread.UncaughtExceptionHandler mNextHandler;

    private CrashHandler(Application application) {
        mApplication = application;
        mNextHandler = Thread.getDefaultUncaughtExceptionHandler();
        if (mNextHandler != null && getClass().getName().equals(mNextHandler.getClass().getName())) {
            // 请不要重复注册 Crash 监听
            throw new IllegalStateException("CrashHandler has already been registered");
        }
    }

    private String getStackTraceString(Throwable throwable) {
        StringWriter sw = new StringWriter();
        PrintWriter pw = new PrintWriter(sw);
        throwable.printStackTrace(pw);
        return sw.toString();
    }

    @SuppressLint("ApplySharedPref")
    @Override
    public void uncaughtException(@NonNull Thread thread, @NonNull Throwable throwable) {
        // 不去触发系统的崩溃处理（com.android.internal.os.RuntimeInit$KillApplicationHandler）
        if (mNextHandler != null && !mNextHandler.getClass().getName().startsWith("com.android.internal.os")) {
            mNextHandler.uncaughtException(thread, throwable);
        }

        // 获取堆栈信息
        String stackTrace = getStackTraceString(throwable);
        String errorMessage = throwable.getMessage();

        // 启动 CrashActivity
        CrashActivity.start(mApplication, stackTrace, errorMessage);

        // 结束当前进程
        android.os.Process.killProcess(android.os.Process.myPid());
        System.exit(1);
    }
}
