package com.widget.noname.util;

import android.Manifest;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;
import android.util.Log;

import androidx.core.app.NotificationManagerCompat;
import androidx.core.content.ContextCompat;

import com.kongzue.dialogx.dialogs.MessageDialog;
import com.widget.noname.function.functionlibrary.R;
import com.widget.noname.okhttp.DownloadService;

public class NotificationUtil {
    private static final String TAG = "NotificationUtil";

    /**
     * 检查是否可以发送通知
     * 综合考虑：运行时权限 + 通知渠道状态
     */
    public static boolean canSendNotifications(Context context, String channelId) {
        // 检查应用整体通知是否启用
        if (!NotificationManagerCompat.from(context).areNotificationsEnabled()) {
            return false;
        }

        // Android 13+ 还需要检查运行时权限
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (ContextCompat.checkSelfPermission(context, Manifest.permission.POST_NOTIFICATIONS)
                    != PackageManager.PERMISSION_GRANTED) {
                return false;
            }
        }

        // 检查下载渠道是否启用
        return isNotificationChannelEnabled(context, channelId);
    }

    /**
     * 检查指定通知渠道是否启用
     */
    public static boolean isNotificationChannelEnabled(Context context, String channelId) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationManager notificationManager =
                    (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);

            NotificationChannel channel = notificationManager.getNotificationChannel(channelId);

            if (channel == null) {
                // 渠道不存在，可能是还未创建
                Log.e(TAG, "通知渠道 " + channelId + " 不存在");
                return false;
            }

            return channel.getImportance() != NotificationManager.IMPORTANCE_NONE;
        } else {
            // Android 8.0以下，没有渠道概念，直接返回通知是否启用
            return NotificationManagerCompat.from(context).areNotificationsEnabled();
        }
    }

    /**
     * 获取渠道的详细状态描述
     */
    public static String getChannelStatus(Context context, String channelId) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationManager notificationManager =
                    (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);

            NotificationChannel channel = notificationManager.getNotificationChannel(channelId);

            if (channel == null) {
                return "渠道不存在";
            }

            int importance = channel.getImportance();
            boolean appEnabled = NotificationManagerCompat.from(context).areNotificationsEnabled();

            if (!appEnabled) {
                return "应用通知已关闭";
            } else if (importance == NotificationManager.IMPORTANCE_NONE) {
                return "下载通知已关闭";
            } else {
                return "通知已开启";
            }
        } else {
            return NotificationManagerCompat.from(context).areNotificationsEnabled()
                    ? "通知已开启" : "通知已关闭";
        }
    }

    // 弹窗通知跳转通知渠道设置页面
    public static void openNotificationChannelSettings(Context context, String channelId) {
        MessageDialog.build().setTitle(context.getString(R.string.common_tip))
                .setMessage(context.getString(R.string.permission_notification_forward_to_settings))
                .setCancelable(false)
                .setOkButton(R.string.permission_action_to_settings, (dialog, v) -> {
                    Intent intent = new Intent();
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                        intent.setAction(Settings.ACTION_CHANNEL_NOTIFICATION_SETTINGS);
                        intent.putExtra(Settings.EXTRA_APP_PACKAGE, context.getPackageName());
                        intent.putExtra(Settings.EXTRA_CHANNEL_ID, channelId);
                    } else {
                        // 低版本打开应用详情页
                        intent.setAction(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
                        intent.setData(Uri.parse("package:" + context.getPackageName()));
                    }
                    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    context.startActivity(intent);
                    return false;
                })
                .setCancelButton(android.R.string.cancel, null)
                .show();
    }
}
