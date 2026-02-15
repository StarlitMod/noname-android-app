package com.widget.noname.util;

import android.content.Context;

import java.io.File;

public class JavaPathUtil {
    private static final String PATH_EMPTY = "";

    // 获取外部存储files目录
    public static File getAppRoot(Context context) {
        if (null != context) {
            File filesDir = context.getExternalFilesDir(null);

            if (null != filesDir) {
                filesDir.mkdirs();
            }

            return filesDir;
        }

        return null;
    }

    public static String getAppRootPath(Context context) {
        if (null != context) {
            File rootFile = getAppRoot(context);

            if (null != rootFile) {
                return rootFile.getAbsolutePath();
            }
        }

        return PATH_EMPTY;
    }

    public static File getAppRootFiles(Context context) {
        if (null != context) {
            return context.getExternalFilesDir(null);
        }

        return null;
    }

    public static String getAppRootFilesPath(Context context) {
        if (null != context) {
            File rootFiles = getAppRootFiles(context);

            if (null != rootFiles) {
                return rootFiles.getPath();
            }
        }

        return PATH_EMPTY;
    }

    public static File getAppRootCache(Context context) {
        if (null != context) {
            return context.getExternalCacheDir();
        }

        return null;
    }

    public static String getAppRootCachePath(Context context) {
        if (null != context) {
            File rootCacheFile = getAppRootCache(context);

            if (null != rootCacheFile) {
                return rootCacheFile.getPath();
            }
        }

        return PATH_EMPTY;
    }

}
