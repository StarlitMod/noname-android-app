package com.noname.core.application;

import android.app.Application;
import android.util.Log;

public class NonameCoreApplication extends Application {
    private static final String TAG = "NonameCoreApplication";

    static {
        Log.e(TAG, "NonameCoreApplication.static");
    }

    @Override
    public void onCreate() {
        super.onCreate();
        if (NonameCoreApplication.class.getSuperclass() != Application.class) {
            throw new RuntimeException("this class is not my NonameCoreApplication");
        }
    }
}
