package com.widget.noname;

import android.app.ActivityManager;
import android.app.Service;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Handler;
import android.os.IBinder;
import android.os.Process;
import android.util.Log;

import androidx.annotation.Nullable;

import com.widget.noname.function.functionlibrary.R;
import com.widget.noname.nativelib.NativeLib;

public class CustomService extends Service {
    private static final String TAG = "CustomService";

    public static final String EXTRA_SETTINGS_KEY = "settings_key";
    public static final String EXTRA_SETTINGS_VALUE = "settings_value";

    @Override
    public void onCreate() {
        super.onCreate();

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            Log.d(TAG, "myProcessName: " + Process.myProcessName());
        }
        else {
            ActivityManager am = (ActivityManager) getSystemService(Context.ACTIVITY_SERVICE);
            for (ActivityManager.RunningAppProcessInfo process : am.getRunningAppProcesses()) {
                if (process.pid == Process.myPid()) {
                    Log.d(TAG, "myProcessName: " + process.processName);
                    break;
                }
            }
        }

        new Handler().postDelayed(() -> {
            NativeLib nativeLib = new NativeLib();
            String result = nativeLib.stringFromJNI(this);
            if (result != null) Log.d(TAG, result);
            stopSelf();
        }, 500);

    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        Log.d(TAG, "onStartCommand");
        if (intent != null) {
            handleIntentAction(intent);
        }
        return START_NOT_STICKY;
    }

    private void handleIntentAction(Intent intent) {
        String key = intent.getStringExtra(EXTRA_SETTINGS_KEY);
        String value = intent.getStringExtra(EXTRA_SETTINGS_VALUE);
        
        if (key != null && value != null) {
            Log.d(TAG, "处理设置变更：" + key + " = " + value);
            if (Settings.KEY_APP_ICON.equals(key)) {
                handleAppIconChange(value);
            }
        }
    }

    private void handleAppIconChange(String iconValue) {
        // 从资源文件获取数组
        String[] iconValues = getResources().getStringArray(R.array.app_icon_values);
        String[] iconActivities = getResources().getStringArray(R.array.app_icon_activity);

        // 查找对应索引
        int targetIndex = -1;
        for (int i = 0; i < iconValues.length; i++) {
            if (iconValues[i].equals(iconValue)) {
                targetIndex = i;
                break;
            }
        }

        PackageManager pm = getPackageManager();

        // 如果找到对应索引，则获取对应的 Activity
        if (targetIndex != -1) {
            String targetActivity = iconActivities[targetIndex];
            // 启用这个
            ComponentName componentName = new ComponentName(CustomService.this, targetActivity);
            if (PackageManager.COMPONENT_ENABLED_STATE_ENABLED != pm.getComponentEnabledSetting(componentName)) {
                pm.setComponentEnabledSetting(
                        componentName,
                        PackageManager.COMPONENT_ENABLED_STATE_ENABLED, PackageManager.DONT_KILL_APP
                );
            }
            // 禁用其他的
            for (String activityName : iconActivities) {
                if (activityName.equals(targetActivity)) continue;
                ComponentName disableComponentName = new ComponentName(CustomService.this, activityName);
                if (PackageManager.COMPONENT_ENABLED_STATE_DISABLED != pm.getComponentEnabledSetting(disableComponentName)) {
                    pm.setComponentEnabledSetting(
                            disableComponentName,
                            PackageManager.COMPONENT_ENABLED_STATE_DISABLED, PackageManager.DONT_KILL_APP
                    );
                }
            }
            // 旧进程的 activity 会自动关闭
        } else {
            Log.w(TAG, "No matching activity found for icon value: " + iconValue);
        }
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        // 不再支持绑定
        return null;
    }
}
