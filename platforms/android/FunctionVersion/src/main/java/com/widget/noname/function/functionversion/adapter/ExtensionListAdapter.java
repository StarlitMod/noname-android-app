package com.widget.noname.function.functionversion.adapter;

import static com.kongzue.dialogx.dialogs.PopTip.tip;

import android.annotation.SuppressLint;
import android.content.ActivityNotFoundException;
import android.content.Context;
import android.content.Intent;
import android.graphics.Paint;
import android.graphics.drawable.Drawable;
import android.net.Uri;
import android.text.Html;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.appcompat.widget.SwitchCompat;
import androidx.recyclerview.widget.RecyclerView;

import com.tencent.mmkv.MMKV;
import com.widget.noname.common.util.FileConstant;
import com.widget.noname.function.functionlibrary.data.ExtensionInfo;
import com.widget.noname.function.functionversion.R;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.List;

public class ExtensionListAdapter extends RecyclerView.Adapter<ExtensionListAdapter.ExtensionViewHolder> {
    private List<ExtensionInfo> extensionList;
    private OnExtensionActionListener actionListener;
    private final Context context;

    public ExtensionListAdapter(Context context) {
        this.context = context;
    }

    public interface OnExtensionActionListener {
        void onToggleEnable(ExtensionInfo extension, boolean enable);
        void onRemove(ExtensionInfo extension);
    }

    public class ExtensionViewHolder extends RecyclerView.ViewHolder {
        TextView nameText, introText, authorText, versionText, diskURLText, forumURLText;
        SwitchCompat enableSwitch;
        Button removeButton;
        ExtensionInfo extension;
        public ExtensionViewHolder(View itemView, ExtensionListAdapter adapter) {
            super(itemView);
            nameText = itemView.findViewById(R.id.extension_name);
            introText = itemView.findViewById(R.id.extension_intro);
            authorText = itemView.findViewById(R.id.extension_author);
            versionText = itemView.findViewById(R.id.extension_version);
            diskURLText = itemView.findViewById(R.id.extension_disk_url);
            forumURLText = itemView.findViewById(R.id.extension_forum_url);
            enableSwitch = itemView.findViewById(R.id.extension_switch);
            removeButton = itemView.findViewById(R.id.remove_button);

            diskURLText.getPaint().setFlags(Paint.UNDERLINE_TEXT_FLAG);
            forumURLText.getPaint().setFlags(Paint.UNDERLINE_TEXT_FLAG);

            diskURLText.setOnClickListener(v -> {
                if (extension == null) return;
                String url = extension.getDiskURL();
                if (isValidUrl(url)) {
                    // 打开系统浏览器
                    Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    try {
                        v.getContext().startActivity(intent);
                    } catch (ActivityNotFoundException e) {
                        // 处理没有找到合适应用的情况
                        tip(context.getString(com.widget.noname.function.functionlibrary.R.string.common_error_cannot_open_link_with_url, url)).iconError().show();
                    }
                }
                else {
                    tip(context.getString(com.widget.noname.function.functionlibrary.R.string.network_error_invalid_url_with_url, url)).iconError().show();
                }
            });

            forumURLText.setOnClickListener(v -> {
                if (extension == null) return;
                String url = extension.getForumURL();
                if (isValidUrl(url)) {
                    // 打开系统浏览器
                    Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    try {
                        v.getContext().startActivity(intent);
                    } catch (ActivityNotFoundException e) {
                        // 处理没有找到合适应用的情况
                        tip(context.getString(com.widget.noname.function.functionlibrary.R.string.common_error_cannot_open_link_with_url, url)).iconError().show();
                    }
                }
                else {
                    tip(context.getString(com.widget.noname.function.functionlibrary.R.string.network_error_invalid_url_with_url, url)).iconError().show();
                }
            });

            enableSwitch.setOnCheckedChangeListener((buttonView, isChecked) -> {
                if (extension == null) return;
                if (actionListener != null) {
                    actionListener.onToggleEnable(extension, isChecked);
                }
            });

            removeButton.setOnClickListener(v -> {
                if (extension == null) return;
                if (actionListener != null) {
                    actionListener.onRemove(extension);
                }
            });
        }
    }

    @NonNull
    @Override
    public ExtensionViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.extension_list_layout, parent, false);
        return new ExtensionViewHolder(view, this);
    }

    @SuppressLint("SetTextI18n")
    @Override
    public void onBindViewHolder(ExtensionViewHolder holder, int position) {
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

        ExtensionInfo extension = extensionList.get(position);
        holder.extension = extension;
        holder.nameText.setText(Html.fromHtml("<h2>" + extension.getName() + "</h2>", imageGetter, null));
        holder.introText.setText(Html.fromHtml(extension.getIntro(), imageGetter, null));
        holder.authorText.setText(Html.fromHtml(extension.getAuthor(), imageGetter, null));
        holder.versionText.setText(extension.getVersion());
        holder.diskURLText.setText(extension.getDiskURL());
        holder.forumURLText.setText(extension.getForumURL());
        holder.enableSwitch.setChecked(extension.isEnabled());
    }

    @Override
    public int getItemCount() {
        return extensionList != null ? extensionList.size() : 0;
    }

    @SuppressLint("NotifyDataSetChanged")
    public void setExtensionList(List<ExtensionInfo> extensions) {
        this.extensionList = extensions;
        notifyDataSetChanged();
    }

    public void setActionListener(OnExtensionActionListener listener) {
        this.actionListener = listener;
    }

    // 验证URL是否合法的方法
    private boolean isValidUrl(String url) {
        if (url == null || url.isEmpty()) {
            return false;
        }

        try {
            Uri uri = Uri.parse(url);
            return uri.getScheme() != null &&
                    (uri.getScheme().equals("http") || uri.getScheme().equals("https"));
        } catch (Exception e) {
            return false;
        }
    }

    public ExtensionInfo getExtensionAt(int position) {
        if (position < 0) return null;
        return extensionList.get(position);
    }
}

