package com.widget.noname.function.functionsettings.preference;

import android.content.Context;
import android.content.res.TypedArray;
import android.util.AttributeSet;
import android.util.Log;
import android.view.View;
import android.widget.ImageView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.preference.Preference;
import androidx.preference.PreferenceViewHolder;

import com.bumptech.glide.Glide;
import com.bumptech.glide.load.engine.DiskCacheStrategy;
import com.kongzue.dialogx.dialogs.PopMenu;
import com.kongzue.dialogx.interfaces.MenuIconAdapter;
import com.widget.noname.function.functionsettings.R;

import java.util.ArrayList;
import java.util.List;

public class IconPickerPreference extends Preference {
    private CharSequence[] mEntries;
    private CharSequence[] mEntryValues;

    public IconPickerPreference(@NonNull Context context, @Nullable AttributeSet attrs, int defStyleAttr, int defStyleRes) {
        super(context, attrs, defStyleAttr, defStyleRes);
        init(context, attrs);
    }

    public IconPickerPreference(@NonNull Context context, @Nullable AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        init(context, attrs);
    }

    public IconPickerPreference(@NonNull Context context, @Nullable AttributeSet attrs) {
        super(context, attrs);
        init(context, attrs);
    }

    public IconPickerPreference(@NonNull Context context) {
        super(context);
        init(context, null);
    }

    private void init(Context context, AttributeSet attrs) {
        if (attrs != null) {
            TypedArray a = context.obtainStyledAttributes(attrs, R.styleable.IconPickerPreference);
            mEntries = a.getTextArray(R.styleable.IconPickerPreference_android_entries);
            mEntryValues = a.getTextArray(R.styleable.IconPickerPreference_android_entryValues);
            a.recycle();
        }

        setWidgetLayoutResource(R.layout.preference_icon_preview);
    }


    @Override
    protected void onClick() {
        if (mEntries != null && mEntryValues != null) {
            showIconSelectionDialog();
        } else {
            super.onClick();
        }
    }

    private void showIconSelectionDialog() {
        // 准备图标和文本数据
        List<String> titles = new ArrayList<>();
        List<Integer> icons = new ArrayList<>();

        for (int i = 0; i < mEntries.length; i++) {
            titles.add(mEntries[i].toString());
            if (i < mEntryValues.length) {
                String iconValue = mEntryValues[i].toString();
                // dialogx的iconResId好像不能读取webp
                int iconResId = getIconResourceId(iconValue);
                icons.add(iconResId);
            } else {
                icons.add(0); // 添加默认图标
            }
        }

        // 使用 DialogX 显示选择列表
        PopMenu.show(titles.toArray(new String[0]))
                .setOverlayBaseView(false)
                .setOnIconChangeCallBack(new MenuIconAdapter<>(false) {    //参数代表是否根据亮色/暗色模式对图标染色
                    @Override
                    public boolean applyIcon(PopMenu dialog, int index, String menuText, ImageView iconImageView) {
                        // 使用 Glide 加载本地 WebP 资源到菜单图标中
                        Integer iconResId = icons.get(index);
                        if (iconResId != null && iconResId != 0) {
                            Glide.with(getContext())
                                    .load(iconResId)
                                    .diskCacheStrategy(DiskCacheStrategy.NONE)
                                    .into(iconImageView);
                        } else {
                            iconImageView.setImageDrawable(null);
                        }
                        // 返回值 true 表示该菜单项的图标需要显示，返回 false 该菜单项的图标将隐藏
                        return true;
                    }
                })
                .setOnMenuItemClickListener((dialog, text, index) -> {
                    String newValue = mEntryValues[index].toString();
                    if (callChangeListener(newValue)) {
                        // 只有在监听器允许变更时才保存新值
                        persistString(newValue);
                        notifyChanged();
                    }
                    return false;
                })
                .show();
    }

    @Override
    public void onBindViewHolder(@NonNull PreferenceViewHolder holder) {
        super.onBindViewHolder(holder);
        // 自定义视图绑定逻辑
        ImageView previewView = (ImageView) holder.findViewById(R.id.icon_preview);
        if (previewView != null) {
            // 获取当前保存的值并设置预览图标
            String currentValue = getPersistedString("");
            if (!currentValue.isEmpty()) {
                int iconResId = getIconResourceId(currentValue);
                if (iconResId != 0) {
                    previewView.setImageResource(iconResId);
                    previewView.setVisibility(View.VISIBLE);
                } else {
                    previewView.setVisibility(View.GONE);
                }
            } else {
                previewView.setVisibility(View.GONE);
            }
        }
    }

    private int getIconResourceId(String iconValue) {
        if (iconValue == null || iconValue.isEmpty()) {
            return 0;
        }

        try {
            // 处理完整路径，提取文件名（去除扩展名）
            String resourceName = iconValue;

            // 如果是完整路径，提取最后一部分
            if (resourceName.contains("/")) {
                resourceName = resourceName.substring(resourceName.lastIndexOf("/") + 1);
            }

            // 去除文件扩展名
            if (resourceName.contains(".")) {
                resourceName = resourceName.substring(0, resourceName.lastIndexOf("."));
            }

            // 去除可能的前缀
            resourceName = resourceName.replace("@mipmap/", "").replace("@drawable/", "");

            // 查找资源ID
            int resId = getContext().getResources().getIdentifier(
                    resourceName, "mipmap", getContext().getPackageName());

            // 如果mipmap中找不到，尝试在drawable中查找
            if (resId == 0) {
                resId = getContext().getResources().getIdentifier(
                        resourceName, "drawable", getContext().getPackageName());
            }

            Log.d("IconPicker", "Parsed resource name: " + resourceName + ", Resource ID: " + resId);
            return resId;
        } catch (Exception e) {
            Log.e("IconPicker", "Error parsing icon resource: " + iconValue, e);
            return 0;
        }
    }

    public void setEntries(CharSequence[] entries) {
        mEntries = entries;
        notifyChanged();
    }

    public void setEntryValues(CharSequence[] entryValues) {
        mEntryValues = entryValues;
        notifyChanged();
    }

    public CharSequence[] getEntries() {
        return mEntries;
    }

    public CharSequence[] getEntryValues() {
        return mEntryValues;
    }
}
