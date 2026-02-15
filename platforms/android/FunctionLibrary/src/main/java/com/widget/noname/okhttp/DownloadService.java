package com.widget.noname.okhttp;

import android.app.*;
import android.content.*;
import android.content.pm.ServiceInfo;
import android.os.*;
import android.util.Log;

import androidx.core.app.NotificationCompat;

import com.widget.noname.function.functionlibrary.R;
import com.widget.noname.util.GitHubUtil;
import com.widget.noname.util.VPNDetectionHelper;

import okhttp3.*;

import java.io.*;
import java.net.SocketException;
import java.util.Random;
import java.util.concurrent.TimeUnit;

public class DownloadService extends Service {
    public static final int PROGRESS_NOTIFICATION_ID = 1;
    public static final int SUCCESS_NOTIFICATION_ID = 2;
    public static final int FAILURE_NOTIFICATION_ID = 3;
    public static final int CANCEL_NOTIFICATION_ID = 4;
    private static final String CHANNEL_ID = "DownloadChannel";
    private OkHttpClient client;
    private volatile boolean isDownloading = false;

    public static void createNotificationChannel(Context context) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                    CHANNEL_ID,
                    context.getString(R.string.notification_channel_downloads_name),
                    NotificationManager.IMPORTANCE_LOW
            );
            channel.setDescription(context.getString(R.string.notification_channel_updates_description));
            NotificationManager nm = context.getSystemService(NotificationManager.class);
            nm.createNotificationChannel(channel);
        }
    }

    public static void start(Context context, String url, String filename) {
        Log.e("DownloadService", "start");

        Intent intent = new Intent(context, DownloadService.class);
        intent.putExtra("url", url);
        intent.putExtra("filepath", filename);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            context.startForegroundService(intent);
        } else {
            context.startService(intent);
        }
    }

    @Override
    public void onCreate() {
        Log.e("DownloadService", "onCreate");
        super.onCreate();
        createNotificationChannel();

        boolean isVpnConnected = VPNDetectionHelper.isVPNConnected(this);
        OkHttpClient.Builder builder = new OkHttpClient.Builder();
        if (isVpnConnected) {
            builder.dns(new HostsDns(true));
        }
        client = builder
                .connectTimeout(60, TimeUnit.SECONDS)
                .readTimeout(60, TimeUnit.SECONDS)
                .build();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        Log.e("DownloadService", "onStartCommand");
        if (intent == null) return START_NOT_STICKY;

        // 处理取消下载的Action
        if ("ACTION_CANCEL_DOWNLOAD".equals(intent.getAction())) {
            Log.e("DownloadService", "用户取消下载");
            cancelDownload();
            return START_NOT_STICKY;
        }

        String url = intent.getStringExtra("url");
        String filepath = intent.getStringExtra("filepath");

        if (isDownloading) {
            stopSelf(); // 避免重复下载
            return START_NOT_STICKY;
        }

        isDownloading = true;

        // 创建前台通知
        Notification notification = new NotificationCompat.Builder(this, CHANNEL_ID)
                .setContentTitle(getString(R.string.notification_channel_progress_downloading))
                .setContentText(getString(R.string.common_status_preparing))
                .setSmallIcon(android.R.drawable.stat_sys_download)
                .setProgress(0, 0, true) // 不确定进度时用 indeterminate
                .build();

        // Android 9+ 要求：如果声明了 foregroundServiceType，必须指定 type
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            startForeground(PROGRESS_NOTIFICATION_ID, notification, ServiceInfo.FOREGROUND_SERVICE_TYPE_DATA_SYNC);
        } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            startForeground(PROGRESS_NOTIFICATION_ID, notification); // API 26–28 不需要 type
        }

        // 启动下载（在后台线程）
        new Thread(() -> downloadFile(url, filepath)).start();

        return START_NOT_STICKY;
    }

    private void downloadFile(String url, String filepath) {
        Log.e("DownloadService", "downloadFile");
        File outputFile = new File(filepath);

        // 随机77到143其中一个整数
        int randomNumber = new Random().nextInt(67) + 77;

        Request request = new Request.Builder()
                .url(url)
                .header("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/" + randomNumber + ".0.0.0 Safari/537.36")
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new IOException("Unexpected code " + response);
            }

            ResponseBody body = response.body();

            long fileLength = body.contentLength();
            InputStream inputStream = body.byteStream();
            FileOutputStream outputStream = new FileOutputStream(outputFile);

            byte[] buffer = new byte[4096];
            long total = 0;
            int count;

            while ((count = inputStream.read(buffer)) != -1) {
                if (!isDownloading) break; // 支持取消
                total += count;
                outputStream.write(buffer, 0, count);

                // 更新通知进度
                updateNotificationProgress((int) (total * 100 / fileLength), total, fileLength);
            }

            outputStream.flush();
            outputStream.close();
            inputStream.close();

            if (isDownloading) {
                onDownloadSuccess(outputFile);
            } else {
                if (outputFile.exists()) {
                    boolean deleted = outputFile.delete();
                    Log.e("DownloadService", "文件删除" + (deleted ? "成功" : "失败"));
                }
            }

        } catch (Exception e) {
            Log.e("DownloadService", "Download failed", e);
            onDownloadFailure(e);
        } finally {
            isDownloading = false;
            // stopForeground(true);
            stopSelf();
        }
    }

    private void updateNotificationProgress(int progress, long downloaded, long total) {
        Log.e("DownloadService", "updateNotificationProgress");
        DownloadStatusManager.getInstance().postProgress(downloaded + "," + total);

        // 创建取消下载的Intent
        Intent cancelIntent = new Intent(this, DownloadService.class);
        cancelIntent.setAction("ACTION_CANCEL_DOWNLOAD");
        PendingIntent cancelPendingIntent = PendingIntent.getService(
                this,
                0,
                cancelIntent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );

        Notification notification = new NotificationCompat.Builder(this, CHANNEL_ID)
                .setContentTitle("正在下载更新")
                .setContentText(
                        getString(
                                R.string.notification_channel_status_download_progress,
                                progress,
                                GitHubUtil.formatFileSize(downloaded),
                                GitHubUtil.formatFileSize(total)
                        )
                )
                .setSmallIcon(android.R.drawable.stat_sys_download)
                .setProgress(100, progress, false)
                .addAction(android.R.drawable.ic_delete, getString(android.R.string.cancel), cancelPendingIntent) // 添加取消按钮
                .setOngoing(true) // 设为持续通知，不会被手动清除
                .setOnlyAlertOnce(true) // 只在首次显示时提醒
                .build();

        NotificationManager nm = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
        nm.notify(PROGRESS_NOTIFICATION_ID, notification);
    }

    private void onDownloadSuccess(File file) {
        Log.e("DownloadService", "onDownloadSuccess");
        // 发送广播或启动安装
        Intent intent = new Intent("download_complete");
        intent.putExtra("path", file.getAbsolutePath());
        DownloadStatusManager.getInstance().postSuccess(file.getAbsolutePath());

        isDownloading = false;
        // 停止前台服务并移除进度通知
        stopForeground(true);

        // 取消下载进度通知
        NotificationManager nm = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
        nm.cancel(PROGRESS_NOTIFICATION_ID);

        // 创建点击通知后要打开的Intent
        // 使用FLAG_ACTIVITY_NEW_TASK | FLAG_ACTIVITY_CLEAR_TOP组合
        // 这会让系统找到现有的activity实例并带到前台
        Intent appIntent = new Intent(this, com.widget.noname.LaunchActivity.class);
        appIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        appIntent.putExtra("download_path", file.getAbsolutePath());
        appIntent.putExtra("from_notification", true);

        // 创建PendingIntent
        PendingIntent pendingIntent = PendingIntent.getActivity(
                this,
                0,
                appIntent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );

        // 显示完成通知
        Notification notification = new NotificationCompat.Builder(this, CHANNEL_ID)
                .setContentTitle(getString(R.string.notification_status_download_complete))
                .setContentText(getString(R.string.notification_action_click_to_install))
                .setSmallIcon(android.R.drawable.stat_sys_download_done)
                .setAutoCancel(false)
                .setOngoing(false)    // 设置为false，不是持续通知
                .setContentIntent(pendingIntent) // 设置点击事件
                .setPriority(NotificationCompat.PRIORITY_DEFAULT)
                .build();

        nm.notify(SUCCESS_NOTIFICATION_ID, notification);
        stopSelf();
    }

    private void onDownloadFailure(Exception e) {
        Log.e("DownloadService", "onDownloadFailure");
        String errorMsg = getString(R.string.notification_status_download_failed_reason, e.getMessage());
        if (e instanceof SocketException &&
                e.getMessage() != null &&
                e.getMessage().contains("Software caused connection abort")) {
            errorMsg = getString(R.string.notification_status_download_interrupted);
        }
        DownloadStatusManager.getInstance().postFailure(errorMsg);

        isDownloading = false;
        // 停止前台服务并移除进度通知
        stopForeground(true);
        // 取消下载进度通知
        NotificationManager nm = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
        nm.cancel(PROGRESS_NOTIFICATION_ID);

        // 创建点击通知后要打开的Intent
        Intent appIntent = new Intent(this, com.widget.noname.LaunchActivity.class);
        appIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        appIntent.putExtra("download_error", errorMsg);
        appIntent.putExtra("from_notification", true);

        PendingIntent pendingIntent = PendingIntent.getActivity(
                this,
                0,
                appIntent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );

        Notification notification = new NotificationCompat.Builder(this, CHANNEL_ID)
                .setContentTitle(getString(R.string.notification_status_download_failed))
                .setContentText(errorMsg)
                .setSmallIcon(android.R.drawable.stat_notify_error)
                .setAutoCancel(false) // 设为false，不自动取消
                .setOngoing(false)
                .setContentIntent(pendingIntent)
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .setWhen(System.currentTimeMillis())
                .setShowWhen(true)
                .build();

        nm.notify(FAILURE_NOTIFICATION_ID, notification);
        isDownloading = false;
        stopSelf();
    }

    private void createNotificationChannel() {
        Log.e("DownloadService", "createNotificationChannel");
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                    CHANNEL_ID,
                    getString(R.string.notification_channel_downloads_name),
                    NotificationManager.IMPORTANCE_LOW
            );
            channel.setDescription(getString(R.string.notification_channel_updates_description));
            NotificationManager nm = getSystemService(NotificationManager.class);
            nm.createNotificationChannel(channel);
        }
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    // 支持取消下载
    private void cancelDownload() {
        Log.e("DownloadService", "取消下载");
        // 通知状态管理器
        DownloadStatusManager.getInstance().postFailure(getString(R.string.notification_status_download_canceled));
        isDownloading = false;

        // 停止前台服务并移除进度通知
        stopForeground(true);

        // 显示取消下载的通知（短暂显示后自动消失）
        NotificationManager nm = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
        nm.cancel(PROGRESS_NOTIFICATION_ID);

        // 创建点击通知后要打开的Intent
        Intent appIntent = new Intent(this, com.widget.noname.LaunchActivity.class);
        appIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        appIntent.putExtra("download_error", getString(R.string.notification_status_download_canceled));
        appIntent.putExtra("from_notification", true);

        PendingIntent pendingIntent = PendingIntent.getActivity(
                this,
                0,
                appIntent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );

        Notification cancelNotification = new NotificationCompat.Builder(this, CHANNEL_ID)
                .setContentTitle(getString(R.string.notification_status_download_canceled))
                .setContentText(getString(R.string.notification_reason_download_user_canceled))
                .setSmallIcon(android.R.drawable.ic_delete)
                .setAutoCancel(true) // 自动取消
                .setContentIntent(pendingIntent)
                .setPriority(NotificationCompat.PRIORITY_DEFAULT)
                .setOnlyAlertOnce(true)
                .build();

        nm.notify(CANCEL_NOTIFICATION_ID, cancelNotification);
        // 停止服务
        stopSelf();
    }
}
