package com.widget.noname.function.functionversion.adapter;

import android.annotation.SuppressLint;
import android.content.Context;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.alibaba.fastjson.JSON;
import com.kongzue.dialogx.dialogs.MessageDialog;
import com.kongzue.dialogx.dialogs.PopMenu;
import com.tencent.mmkv.MMKV;

import com.widget.noname.function.functionlibrary.data.VersionData;
import com.widget.noname.function.functionversion.R;
import com.widget.noname.function.functionlibrary.listener.VersionControlItemListener;
import com.widget.noname.common.util.FileConstant;

import java.util.ArrayList;
import java.util.List;

public class VersionListRecyclerAdapter extends RecyclerView.Adapter<RecyclerView.ViewHolder> {

    private VersionControlItemListener listener = null;
    private final List<VersionData> list = new ArrayList<>();
    private String currentPath = "null";
    private Context context = null;

    public VersionListRecyclerAdapter(Context context) {
        this.context = context;
    }

    @NonNull
    @Override
    public RecyclerView.ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.version_list_layout, parent, false);
        return new VersionHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull RecyclerView.ViewHolder viewHolder, int position) {
        VersionHolder holder = (VersionHolder) viewHolder;

        VersionData data = list.get(position);

        holder.nameTextView.setText(data.getName());
        holder.sizeTextView.setText(data.getSize());
        holder.pathTextView.setText(data.getPath());
        holder.dateTextView.setText(data.getDate());
        holder.itemView.setSelected((null != currentPath) && currentPath.equals(data.getPath()));

        holder.itemView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                onItemClick(v, data);
            }
        });
    }

    @SuppressLint("NotifyDataSetChanged")
    public void onItemClick(View view, VersionData data) {
        PopMenu popMenu = PopMenu.show(view, new String[] {
                context.getString(com.widget.noname.function.functionlibrary.R.string.gamemain_action_set_as_gamemain),
                context.getString(com.widget.noname.function.functionlibrary.R.string.common_action_open),
                context.getString(com.widget.noname.function.functionlibrary.R.string.common_action_delete)
        });

        if ((null == currentPath) || !currentPath.equals(data.getPath())) {
            popMenu
                    .setOnMenuItemClickListener((dialog, text, position) -> {
                        if (position == 0) {
                            setGamePath(data);
                        } else if (position == 1) {
                            openPath(data);
                        } else if (position == 2) {
                            delGamePath(data);
                        }
                        return false;
                    })
                    .setIconResIds(
                            com.widget.noname.function.functionlibrary.R.drawable.icon_setting,
                            com.widget.noname.function.functionlibrary.R.drawable.icon_open,
                            com.widget.noname.function.functionlibrary.R.drawable.icon_delete
                    );
        }
        else {
            popMenu.
                    setMenuList(new String[] {
                            context.getString(com.widget.noname.function.functionlibrary.R.string.common_action_open),
                            context.getString(com.widget.noname.function.functionlibrary.R.string.common_action_delete)
                    })
                    .setOnMenuItemClickListener((dialog, text, position) -> {
                        if (position == 0) {
                            openPath(data);
                        }
                        else if (position == 1) {
                            delGamePath(data);
                        }
                        return false;
                    })
                    .setIconResIds(
                            com.widget.noname.function.functionlibrary.R.drawable.icon_open,
                            com.widget.noname.function.functionlibrary.R.drawable.icon_delete
                    );
        }

        popMenu.setOverlayBaseView(false)
                .setAlignGravity(Gravity.RIGHT | Gravity.BOTTOM)
                .setWidth(view.getWidth() / 3)
                .setOffScreen(false)
                .setAutoTintIconInLightOrDarkMode(true)
                .show();

    }

    private void setGamePath(VersionData data) {
        MessageDialog.build()
                .setTitle(com.widget.noname.function.functionlibrary.R.string.common_tip)
                .setMessage(context.getString(com.widget.noname.function.functionlibrary.R.string.gamemain_dialog_confirm_set_short, data.getName()))
                .setOkButton(android.R.string.ok, (baseDialog, view) -> {
                    unSelectAll();

                    if (null != listener) {
                        listener.onSetPathItemClick(data);
                    }
                    return false;
                })
                .setCancelButton(android.R.string.cancel)
                .show();
    }

    private void openPath(VersionData data) {
        if (null != listener) {
            listener.onItemOpen(data);
        }
    }

    private void delGamePath(VersionData data) {
        MessageDialog.build()
                .setTitle(com.widget.noname.function.functionlibrary.R.string.common_tip)
                .setMessage(context.getString(com.widget.noname.function.functionlibrary.R.string.gamemain_dialog_confirm_delete_data, data.getName()))
                .setOkButton(android.R.string.ok, (baseDialog, view) -> {
                    if (null != listener) {
                        listener.onItemDelete(data);
                    }
                    return false;
                })
                .setCancelButton(android.R.string.cancel)
                .show();
    }

    private void unSelectAll() {
        for (VersionData data : list) {
            data.setSelected(false);
        }
    }

    @SuppressLint("NotifyDataSetChanged")
    public void replaceList(List<VersionData> l) {
        list.clear();
        list.addAll(l);
        currentPath = MMKV.defaultMMKV().getString(FileConstant.GAME_PATH_KEY, "null");
        String json = JSON.toJSONString(list);
        MMKV.defaultMMKV().encode(FileConstant.VERSION_LIST_KEY, json);

        notifyDataSetChanged();
    }

    @Override
    public int getItemCount() {
        return list.size();
    }

    public void setItemClickListener(VersionControlItemListener listener) {
        this.listener = listener;
    }

    @SuppressLint("NotifyDataSetChanged")
    public void clearAll() {
        list.clear();
        notifyDataSetChanged();
    }

    public void setCurrentPath(String path) {
        currentPath = path;
    }

    public static class VersionHolder extends RecyclerView.ViewHolder {

        private TextView nameTextView = null;
        private TextView sizeTextView = null;
        private TextView pathTextView = null;
        private TextView dateTextView = null;


        public VersionHolder(@NonNull View itemView) {
            super(itemView);

            nameTextView = itemView.findViewById(R.id.version_list_name);
            sizeTextView = itemView.findViewById(R.id.version_list_size);
            pathTextView = itemView.findViewById(R.id.version_list_path);
            dateTextView = itemView.findViewById(R.id.version_list_date);
        }
    }
}
