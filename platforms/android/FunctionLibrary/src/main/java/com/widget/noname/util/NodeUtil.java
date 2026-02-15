package com.widget.noname.util;

import android.content.Context;
import android.content.SharedPreferences;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;

public class NodeUtil {
    public static boolean wasAPKUpdated(Context applicationContext) {
        SharedPreferences prefs = applicationContext.getSharedPreferences("NODEJS_MOBILE_PREFS", 0);
        long previousLastUpdateTime = prefs.getLong("NODEJS_MOBILE_APK_LastUpdateTime", 0L);
        long lastUpdateTime = 1L;

        try {
            PackageInfo packageInfo = applicationContext.getPackageManager().getPackageInfo(applicationContext.getPackageName(), 0);
            lastUpdateTime = packageInfo.lastUpdateTime;
        } catch (PackageManager.NameNotFoundException var7) {
            PackageManager.NameNotFoundException e = var7;
            e.printStackTrace();
        }

        return lastUpdateTime != previousLastUpdateTime;
    }

    public static void saveLastUpdateTime(Context applicationContext) {
        long lastUpdateTime = 1L;

        try {
            PackageInfo packageInfo = applicationContext.getPackageManager().getPackageInfo(applicationContext.getPackageName(), 0);
            lastUpdateTime = packageInfo.lastUpdateTime;
        } catch (PackageManager.NameNotFoundException var5) {
            PackageManager.NameNotFoundException e = var5;
            e.printStackTrace();
        }

        SharedPreferences prefs = applicationContext.getSharedPreferences("NODEJS_MOBILE_PREFS", 0);
        SharedPreferences.Editor editor = prefs.edit();
        editor.putLong("NODEJS_MOBILE_APK_LastUpdateTime", lastUpdateTime);
        editor.apply();
    }
}
