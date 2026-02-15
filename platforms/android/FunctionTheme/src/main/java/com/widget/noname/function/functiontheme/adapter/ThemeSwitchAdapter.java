package com.widget.noname.function.functiontheme.adapter;

import android.annotation.SuppressLint;
import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.bumptech.glide.load.engine.DiskCacheStrategy;
import com.widget.noname.Settings;
import com.widget.noname.function.functiontheme.R;

import java.io.File;
import java.util.ArrayList;

public class ThemeSwitchAdapter extends RecyclerView.Adapter<ThemeSwitchAdapter.ViewHolder> {

    private final Context context;
    private ArrayList<String> themes;
    private String currentTheme;
    private String selectedTheme;
    private OnDeleteClickListener itemDeleteClickListener;
    private OnItemClickListener itemClickListener;

    public interface OnDeleteClickListener {
        void onDeleteClick(String themeName, int position);
    }

    public interface OnItemClickListener {
        void onItemClickListener(String themeName, int position);
    }

    public ThemeSwitchAdapter(Context context, ArrayList<String> themes, String currentTheme) {
        this.context = context;
        this.themes = themes;
        this.currentTheme = currentTheme;
        this.selectedTheme = currentTheme;
    }

    public void setOnDeleteClickListener(OnDeleteClickListener listener) {
        this.itemDeleteClickListener = listener;
    }

    public void setOnItemClickListener(OnItemClickListener listener) {
        this.itemClickListener = listener;
    }

    public void setSelectedTheme(String themeName) {
        this.selectedTheme = themeName;
        notifyDataSetChanged();
    }

    public String getSelectedTheme() {
        return selectedTheme;
    }

    public void updateThemes(ArrayList<String> newThemes, String currentTheme) {
        this.themes = newThemes;
        this.currentTheme = currentTheme;
        this.selectedTheme = currentTheme;
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_theme_switch, parent, false);
        return new ViewHolder(view);
    }

    @SuppressLint("SetTextI18n")
    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        String themeName = themes.get(position);

        holder.tvThemeName.setText(themeName);

        // 显示当前使用主题标识
        if (themeName.equals(currentTheme)) {
            holder.tvThemeName.setText(themeName + "(" + context.getString(com.widget.noname.function.functionlibrary.R.string.theme_current) + ")");
        }

        // 使用 Glide 加载主题预览图片
        loadThemeBackground(holder, themeName);

        // 设置选中状态
        holder.itemView.setSelected(themeName.equals(selectedTheme));

        // 点击选择主题
        holder.itemView.setOnClickListener(v -> {
            selectedTheme = themeName;
            notifyDataSetChanged();
        });

        // 设置item点击事件
        holder.itemView.setOnClickListener(v -> {
            if (itemClickListener != null) {
                itemClickListener.onItemClickListener(themeName, position);
            }
        });

        holder.itemView.setOnLongClickListener(v -> {
            if (itemDeleteClickListener != null) {
                itemDeleteClickListener.onDeleteClick(themeName, position);
                return true;
            }
            return false;
        });
    }

    private void loadThemeBackground(ViewHolder holder, String themeName) {
        // 自定义主题：从主题目录加载预览图
        Settings.ThemeSettings themeSetting = new Settings.ThemeSettings(themeName);
        File backgroundImageFile = new File(themeSetting.getCustomBackgroundPath());
        // 没有对应文件
        if (!backgroundImageFile.exists() || backgroundImageFile.isDirectory()) {
            // 尝试默认值
            backgroundImageFile = new File(themeSetting.getThemeBackgroundDir(), "0.jpg");
            if (!backgroundImageFile.exists()) {
                holder.ivBackground.setImageResource(com.widget.noname.function.functionlibrary.R.drawable.launch_layout_bg);
                return;
            }
            else {
                themeSetting.setCustomBackgroundPath("0.jpg");
            }
        }
        // 兜底
        Glide.with(context)
                .load(backgroundImageFile)
                .diskCacheStrategy(DiskCacheStrategy.NONE)
                .error(com.widget.noname.function.functionlibrary.R.drawable.launch_layout_bg)
                .into(holder.ivBackground);
    }

    @Override
    public int getItemCount() {
        return themes.size();
    }

    static class ViewHolder extends RecyclerView.ViewHolder {
        ImageView ivBackground;
        TextView tvThemeName;

        ViewHolder(@NonNull View itemView) {
            super(itemView);
            ivBackground = itemView.findViewById(R.id.iv_background);
            tvThemeName = itemView.findViewById(R.id.tv_theme_name);
        }
    }
}