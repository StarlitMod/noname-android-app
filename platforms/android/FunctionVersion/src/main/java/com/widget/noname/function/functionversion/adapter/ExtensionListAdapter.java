package com.widget.noname.function.functionversion.adapter;

import android.annotation.SuppressLint;
import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.appcompat.widget.SwitchCompat;
import androidx.recyclerview.widget.RecyclerView;

import com.widget.noname.function.functionlibrary.data.ExtensionInfo;
import com.widget.noname.function.functionversion.R;

import java.util.List;

public class ExtensionListAdapter extends RecyclerView.Adapter<ExtensionListAdapter.ExtensionViewHolder> {
    private List<ExtensionInfo> extensionList;
    private OnExtensionActionListener actionListener;
    private OnItemClickListener itemClickListener;
    private final Context context;

    public interface OnItemClickListener {
        void onItemClick(ExtensionInfo extension);
    }

    public ExtensionListAdapter(Context context) {
        this.context = context;
    }

    public interface OnExtensionActionListener {
        void onToggleEnable(ExtensionInfo extension, boolean enable);
        void onRemove(ExtensionInfo extension);
    }

    public class ExtensionViewHolder extends RecyclerView.ViewHolder {
        TextView nameText, authorText, versionText;
        SwitchCompat enableSwitch;
        ExtensionInfo extension;
        public ExtensionViewHolder(View itemView, ExtensionListAdapter adapter) {
            super(itemView);
            nameText = itemView.findViewById(R.id.extension_name);
            authorText = itemView.findViewById(R.id.extension_author);
            versionText = itemView.findViewById(R.id.extension_version);
            enableSwitch = itemView.findViewById(R.id.extension_switch);

            enableSwitch.setOnCheckedChangeListener((buttonView, isChecked) -> {
                if (extension == null) return;
                if (actionListener != null) {
                    actionListener.onToggleEnable(extension, isChecked);
                }
            });

            itemView.setOnClickListener(v -> {
                if (extension != null && itemClickListener != null) {
                    itemClickListener.onItemClick(extension);
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
        ExtensionInfo extension = extensionList.get(position);
        holder.extension = extension;
        holder.nameText.setText(extension.getName());
        holder.authorText.setText(extension.getAuthor());
        holder.versionText.setText(extension.getVersion());
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

    public void setOnItemClickListener(OnItemClickListener listener) {
        this.itemClickListener = listener;
    }

    public ExtensionInfo getExtensionAt(int position) {
        if (position < 0) return null;
        return extensionList.get(position);
    }
}

