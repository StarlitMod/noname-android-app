package com.widget.noname.function.functiontheme.adapter;

import android.content.Context;
import android.view.ViewGroup;
import android.widget.ImageView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.bumptech.glide.load.engine.DiskCacheStrategy;

import java.io.File;
import java.util.List;

public class PreviewImageAdapter extends RecyclerView.Adapter<PreviewImageAdapter.ViewHolder> {

    private Context context;
    private List<File> previewFiles;

    public PreviewImageAdapter(Context context, List<File> previewFiles) {
        this.context = context;
        this.previewFiles = previewFiles;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        ImageView imageView = new ImageView(context);
        imageView.setLayoutParams(new ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
        ));
        imageView.setScaleType(ImageView.ScaleType.CENTER_CROP);
        return new ViewHolder(imageView);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        File previewFile = previewFiles.get(position);

        Glide.with(context)
                .load(previewFile)
                .diskCacheStrategy(DiskCacheStrategy.NONE)
                .error(com.widget.noname.function.functionlibrary.R.drawable.launch_layout_bg)
                .centerCrop()
                .into(holder.imageView);
    }

    @Override
    public int getItemCount() {
        return previewFiles.size();
    }

    static class ViewHolder extends RecyclerView.ViewHolder {
        ImageView imageView;

        ViewHolder(ImageView imageView) {
            super(imageView);
            this.imageView = imageView;
        }
    }
}
