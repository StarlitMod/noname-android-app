package com.widget.noname;

import android.app.Activity;
import android.app.Application;
import android.app.Service;
import android.content.BroadcastReceiver;
import android.content.ContentProvider;
import android.content.Intent;
import android.content.pm.ApplicationInfo;
import android.os.Build;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.annotation.RequiresApi;
import androidx.core.app.AppComponentFactory;

@RequiresApi(api = Build.VERSION_CODES.P)
public class CustomAppComponentFactory extends AppComponentFactory {
    private static final String TAG = "CustomAppComponentFactory";

    public CustomAppComponentFactory() {
        super();
        if (CustomAppComponentFactory.class.getSuperclass() != AppComponentFactory.class) {
            Log.e(TAG, "this class is not my CustomAppComponentFactory");
        }
    }

    @NonNull
    @Override
    public Application instantiateApplicationCompat(@NonNull ClassLoader cl, @NonNull String className) throws InstantiationException, IllegalAccessException, ClassNotFoundException {
        Log.e(TAG, "Application: " + className);
        return super.instantiateApplicationCompat(cl, className);
    }

    @NonNull
    @Override
    public Activity instantiateActivityCompat(@NonNull ClassLoader cl, @NonNull String className, @Nullable Intent intent) throws InstantiationException, IllegalAccessException, ClassNotFoundException {
        Log.e(TAG, "Activity: " + className);
        return super.instantiateActivityCompat(cl, className, intent);
    }

    @NonNull
    @Override
    public Service instantiateServiceCompat(@NonNull ClassLoader cl, @NonNull String className, @Nullable Intent intent) throws InstantiationException, IllegalAccessException, ClassNotFoundException {
        Log.e(TAG, "Service: " + className);
        if (intent != null) {
            Log.e(TAG, "intent.getAction(): " + intent.getAction());
            Log.e(TAG, "intent.getComponent(): " + intent.getComponent());
            Log.e(TAG, "intent.getData(): " + intent.getData());
            Log.e(TAG, "intent.getType(): " + intent.getType());
        }
        return super.instantiateServiceCompat(cl, className, intent);
    }

    @NonNull
    @Override
    public ClassLoader instantiateClassLoader(@NonNull ClassLoader cl, @NonNull ApplicationInfo aInfo) {
        Log.e(TAG, "ClassLoader: " + cl);
        Log.e(TAG, "ApplicationInfo: " + aInfo);
        return super.instantiateClassLoader(cl, aInfo);
    }

    @NonNull
    @Override
    public BroadcastReceiver instantiateReceiverCompat(@NonNull ClassLoader cl, @NonNull String className, @Nullable Intent intent) throws InstantiationException, IllegalAccessException, ClassNotFoundException {
        Log.e(TAG, "BroadcastReceiver: " + className);
        if (intent != null) {
            Log.e(TAG, "intent.getAction(): " + intent.getAction());
            Log.e(TAG, "intent.getComponent(): " + intent.getComponent());
            Log.e(TAG, "intent.getData(): " + intent.getData());
            Log.e(TAG, "intent.getType(): " + intent.getType());
        }
        return super.instantiateReceiverCompat(cl, className, intent);
    }

    @NonNull
    @Override
    public ContentProvider instantiateProviderCompat(@NonNull ClassLoader cl, @NonNull String className) throws InstantiationException, IllegalAccessException, ClassNotFoundException {
        Log.e(TAG, "ContentProvider: " + className);
        return super.instantiateProviderCompat(cl, className);
    }
}
