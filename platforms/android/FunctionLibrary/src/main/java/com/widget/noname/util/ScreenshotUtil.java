package com.widget.noname.util;

import android.app.Activity;
import android.content.ContentResolver;
import android.content.ContentValues;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ApplicationInfo;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Rect;
import android.graphics.drawable.Drawable;
import android.net.Uri;
import android.os.Handler;
import android.provider.MediaStore;
import android.util.Log;
import android.util.TypedValue;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.PopupWindow;
import android.widget.TextView;

import androidx.core.content.ContextCompat;

import com.widget.noname.function.functionlibrary.R;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStream;

public class ScreenshotUtil {
    private static final String TAG = "ScreenshotUtil";
    public static boolean captureAndSaveScreenshot(Activity activity, String fileName) {
        try {
            View dView = activity.getWindow().getDecorView();
            // 清除DrawingCache
            dView.setDrawingCacheEnabled(false);
            dView.destroyDrawingCache();
            // 创建Bitmap
            Bitmap bitmap = Bitmap.createBitmap(
                    dView.getWidth(),
                    dView.getHeight(),
                    Bitmap.Config.ARGB_8888
            );

            // 使用Canvas绘制视图到Bitmap中
            Canvas canvas = new Canvas(bitmap);
            dView.draw(canvas);
            if (bitmap != null) {
                // 获取应用图标和名称
                ApplicationInfo appInfo = activity.getApplicationInfo();
                Drawable appIcon = activity.getPackageManager().getApplicationIcon(appInfo);
                String appName = activity.getPackageManager().getApplicationLabel(appInfo).toString();

                // 添加水印
                // 将图标转换为固定大小的Bitmap
                int iconSizeInPx = (int) TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 30, activity.getResources().getDisplayMetrics());
                Bitmap iconBitmap = Bitmap.createBitmap(iconSizeInPx, iconSizeInPx, Bitmap.Config.ARGB_8888);
                Canvas tempCanvas = new Canvas(iconBitmap);
                appIcon.setBounds(0, 0, iconSizeInPx, iconSizeInPx);
                appIcon.draw(tempCanvas);

                // 添加图标和名称水印
                Paint paint = new Paint(Paint.ANTI_ALIAS_FLAG);
                paint.setColor(Color.WHITE); // 文字颜色
                paint.setTextSize(50); // 文字大小
                Rect textBounds = new Rect();
                paint.getTextBounds(appName, 0, appName.length(), textBounds);

                // 计算图标和文本的位置，避免重叠
                int padding = 10; // 边距
                int iconPadding = 10; // 图标与文字之间的间距

                int textWidth = textBounds.width();
                int textHeight = textBounds.height();
                int iconHalfHeight = iconSizeInPx / 2;
                int textHalfHeight = textHeight / 2;

                // 计算垂直居中的位置
                int centerY = bitmap.getHeight() - padding - Math.max(iconHalfHeight, textHalfHeight);

                // 图标的位置
                int iconX = bitmap.getWidth() - textWidth - iconSizeInPx - padding - iconPadding;
                int iconY = centerY - iconHalfHeight;

                // 文本的位置
                int textX = bitmap.getWidth() - textWidth - padding;
                int textY = centerY - textHalfHeight;

                // 绘制应用图标
                canvas.drawBitmap(iconBitmap, iconX, iconY, paint);

                // 绘制应用名称
                canvas.drawText(appName, textX, textY + textHeight, paint);

                // 插入到MediaStore中
                Uri imageUri = insertImage(activity, fileName, bitmap);
                if (imageUri != null) {
                    // 显示带有截图预览的PopupWindow
                    showScreenshotToastWithPreview(activity, bitmap, imageUri);
                    return true;
                } else {
                    return false;
                }
            }
        } catch (Exception e) {
            Log.e(TAG, "Error capturing and saving screenshot.", e);
        }
        return false;
    }

    private static Uri insertImage(Context context, String fileName, Bitmap bitmap) throws IOException {
        ContentResolver contentResolver = context.getContentResolver();
        ByteArrayOutputStream bytes = new ByteArrayOutputStream();
        bitmap.compress(Bitmap.CompressFormat.PNG, 100, bytes);
        byte[] imageBytes = bytes.toByteArray();

        ContentValues values = new ContentValues();
        // 设置文件名
        String uniqueFileName = fileName + ".png";
        values.put(MediaStore.Images.Media.DISPLAY_NAME, uniqueFileName);
        values.put(MediaStore.Images.Media.MIME_TYPE, "image/png");
        // 设置到DCIM目录下
        values.put(MediaStore.Images.Media.RELATIVE_PATH, "DCIM/" + context.getPackageName());
        Uri item = contentResolver.insert(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, values);
        if (item != null) {
            OutputStream imageOutStream = contentResolver.openOutputStream(item);
            if (imageOutStream != null) {
                imageOutStream.write(imageBytes);
                imageOutStream.close();
            }
        }
        return item;
    }

    private static void showScreenshotToastWithPreview(Context context, Bitmap screenshot, Uri imageUri) {
        // 创建一个PopupWindow来显示截图
        LayoutInflater inflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        View layout = inflater.inflate(R.layout.toast_layout, null);

        ImageView imageIcon = layout.findViewById(R.id.app_icon);
        int mipmapResId = context.getResources().getIdentifier("ic_launcher_round", "mipmap", context.getPackageName());
        if (mipmapResId != 0) {
            imageIcon.setImageResource(mipmapResId);
        }

        TextView appName = layout.findViewById(R.id.app_name);
        int stringResId = context.getResources().getIdentifier("app_name", "string", context.getPackageName());
        if (stringResId != 0) {
            appName.setText(context.getString(stringResId));
        }

        ImageView imageView = layout.findViewById(R.id.popup_image);
        Button shareButton = layout.findViewById(R.id.btn_share);

        shareButton.setOnClickListener(v -> {
            Intent shareIntent = new Intent(Intent.ACTION_SEND);
            shareIntent.setType("*/*");
            shareIntent.putExtra(Intent.EXTRA_STREAM, imageUri);
            context.startActivity(Intent.createChooser(shareIntent, "分享截图"));
        });

        // 计算适合屏幕的预览大小
        int screenWidth = ((WindowManager) context.getSystemService(Context.WINDOW_SERVICE)).getDefaultDisplay().getWidth();
        int screenHeight = ((WindowManager) context.getSystemService(Context.WINDOW_SERVICE)).getDefaultDisplay().getHeight();

        int targetWidth = (int) (screenWidth * 0.6f); // 调整宽度以适应屏幕
        int targetHeight = (int) (targetWidth * (float) screenshot.getHeight() / (float) screenshot.getWidth()); // 保持比例

        // 缩放截图
        Bitmap resizedScreenshot = Bitmap.createScaledBitmap(screenshot, targetWidth, targetHeight, false);
        imageView.setImageBitmap(resizedScreenshot);

        // 设置ImageView的大小
        imageView.getLayoutParams().width = targetWidth;
        imageView.getLayoutParams().height = targetHeight;

        PopupWindow popup = new PopupWindow(layout, ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT, true);
        popup.setOutsideTouchable(true);
        popup.setBackgroundDrawable(ContextCompat.getDrawable(context, R.drawable.popup_background));
        popup.showAtLocation(layout, Gravity.CENTER, 0, 0);

        // 设置一个延时关闭PopupWindow
        new Handler().postDelayed(() -> {
            popup.dismiss();
        }, 3000); // 延迟2秒关闭PopupWindow
    }
}
