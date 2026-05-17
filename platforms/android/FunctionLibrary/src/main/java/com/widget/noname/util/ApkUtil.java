package com.widget.noname.util;

import android.content.pm.PackageManager;

import com.widget.noname.MyApplication;

public class ApkUtil {
    public static boolean isAppInstalled(String packageName) {
        try {
            PackageManager pm = MyApplication.getContext().getPackageManager();
            pm.getPackageInfo(packageName, 0);
            return true;
        } catch (PackageManager.NameNotFoundException e) {
            return false;
        }
    }
}
