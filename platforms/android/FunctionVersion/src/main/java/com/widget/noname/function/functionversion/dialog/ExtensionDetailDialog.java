package com.widget.noname.function.functionversion.dialog;

import static com.kongzue.dialogx.dialogs.PopTip.tip;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.Intent;
import android.graphics.Paint;
import android.graphics.drawable.Drawable;
import android.net.Uri;
import android.text.Html;
import android.text.TextUtils;
import android.util.Log;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.appcompat.widget.AppCompatButton;
import androidx.appcompat.widget.SwitchCompat;

import com.alibaba.fastjson.JSONObject;
import com.kongzue.dialogx.dialogs.FullScreenDialog;
import com.kongzue.dialogx.dialogs.MessageDialog;
import com.kongzue.dialogx.interfaces.OnBindView;
import com.tencent.mmkv.MMKV;
import com.widget.noname.common.util.FileConstant;
import com.widget.noname.function.functionlibrary.bridge.OnJsBridgeCallback;
import com.widget.noname.function.functionlibrary.data.ExtensionInfo;
import com.widget.noname.function.functionversion.R;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;

public class ExtensionDetailDialog {
    private static final String TAG = "ExtensionDetailDialog";
    private static ExtensionInfo extensionInfo;
    private static OnJsBridgeCallback bridgeCallback;

    public static void show(ExtensionInfo info, OnJsBridgeCallback callback) {
        extensionInfo = info;
        bridgeCallback = callback;

        FullScreenDialog.show(new OnBindView<>(R.layout.fragment_extension_detail) {
            @Override
            public void onBind(FullScreenDialog dialog, View v) {
                initViews(v, info, dialog);
            }
        });
    }

    private static void initViews(View view, ExtensionInfo info, FullScreenDialog dialog) {
        String gameRootPath = MMKV.defaultMMKV().getString(FileConstant.GAME_PATH_KEY, null);
        Html.ImageGetter imageGetter = new Html.ImageGetter() {
            @Override
            public Drawable getDrawable(String source) {
                if (gameRootPath != null && !source.startsWith(gameRootPath)) {
                    if (source.contains("${assetURL}")) {
                        source = source.replace("${assetURL}/", gameRootPath);
                        source = "file://" + source.replace("${assetURL}", gameRootPath + "/");
                    }
                    else {
                        source = "file://" + new File(gameRootPath, source).getAbsolutePath();
                    }
                }
                Log.e("imageGetter", source);
                Drawable drawable = null;
                try {
                    InputStream is = (InputStream) new URL(source).getContent();
                    drawable = Drawable.createFromStream(is, "src");
                    drawable.setBounds(0, 0, drawable.getIntrinsicWidth(), drawable.getIntrinsicHeight());
                } catch (IOException e) {
                    e.printStackTrace();
                }
                return drawable;
            }
        };

        TextView tvName = view.findViewById(R.id.tv_extension_name);
        TextView tvAuthor = view.findViewById(R.id.tv_author);
        TextView tvVersion = view.findViewById(R.id.tv_version);
        TextView tvIntro = view.findViewById(R.id.tv_intro);
        TextView tvDiskURL = view.findViewById(R.id.tv_disk_url);
        TextView tvForumURL = view.findViewById(R.id.tv_forum_url);
        AppCompatButton btnRemove = view.findViewById(R.id.btn_remove);

        // 设置基本信息
        // 名称
        if (!TextUtils.isEmpty(info.getName())) {
            tvName.setText(info.getName());
        }
        else {
            tvName.setText(com.widget.noname.function.functionlibrary.R.string.common_none);
        }
        // 作者
        if (!TextUtils.isEmpty(info.getAuthor())) {
            tvAuthor.setText(Html.fromHtml(info.getAuthor(), imageGetter, null));
        }
        else {
            tvAuthor.setText(com.widget.noname.function.functionlibrary.R.string.common_none);
        }
        // 版本
        if (!TextUtils.isEmpty(info.getVersion())) {
            tvVersion.setText(info.getVersion());
        }
        else {
            tvVersion.setText(com.widget.noname.function.functionlibrary.R.string.common_none);
        }
        // 介绍
        if (!TextUtils.isEmpty(info.getIntro())) {
            tvIntro.setText(Html.fromHtml(info.getIntro(), imageGetter, null));
        }
        else {
            tvIntro.setText(com.widget.noname.function.functionlibrary.R.string.common_none);
        }

        // 设置下载链接
        if (!TextUtils.isEmpty(info.getDiskURL())) {
            tvDiskURL.setText(info.getDiskURL());
        }
        else {
            tvDiskURL.setText(com.widget.noname.function.functionlibrary.R.string.common_none);
        }
        tvDiskURL.getPaint().setFlags(Paint.UNDERLINE_TEXT_FLAG);
        tvDiskURL.setOnClickListener(v -> openUrl(v.getContext(), info.getDiskURL()));

        // 设置论坛链接
        if (!TextUtils.isEmpty(info.getForumURL())) {
            tvForumURL.setText(info.getForumURL());
        }
        else {
            tvForumURL.setText(com.widget.noname.function.functionlibrary.R.string.common_none);
        }
        tvForumURL.getPaint().setFlags(Paint.UNDERLINE_TEXT_FLAG);
        tvForumURL.setOnClickListener(v -> openUrl(v.getContext(), info.getForumURL()));

        // 删除按钮
        btnRemove.setOnClickListener(v -> {
            MessageDialog.build()
                    .setTitle(com.widget.noname.function.functionlibrary.R.string.common_confirm_delete)
                    .setMessage(v.getContext().getString(
                            com.widget.noname.function.functionlibrary.R.string.common_extension_dialog_confirm_delete,
                            info.getName()))
                    .setOkButton(android.R.string.ok, (baseDialog, view2) -> {
                        if (gameRootPath != null) {
                            File extensionDir = new File(new File(gameRootPath, "extension"), info.getName());
                            deleteDirectory(extensionDir);
                        }
                        if (bridgeCallback != null) {
                            bridgeCallback.onExtensionRemove(info.getName());
                        }
                        return false;
                    })
                    .setCancelButton(android.R.string.cancel)
                    .show();
            dialog.dismiss();
        });
    }

    private static void openUrl(Context context, String url) {
        if (TextUtils.isEmpty(url) || "null".equals(url)) {
            tip(
                    context.getString(com.widget.noname.function.functionlibrary.R.string.network_error_invalid_url))
                    .iconError().show();
            return;
        }

        try {
            Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            context.startActivity(intent);
        } catch (Exception e) {
            Log.e(TAG, "打开链接失败: " + url, e);
            tip(
                    context.getString(com.widget.noname.function.functionlibrary.R.string.common_error_cannot_open_link_with_url, url))
                    .iconError().show();
        }
    }

    private static boolean deleteDirectory(File dir) {
        if (dir.isDirectory()) {
            String[] children = dir.list();
            if (children != null) {
                for (String child : children) {
                    boolean success = deleteDirectory(new File(dir, child));
                    if (!success) {
                        return false;
                    }
                }
            }
        }
        return dir.delete();
    }
}
