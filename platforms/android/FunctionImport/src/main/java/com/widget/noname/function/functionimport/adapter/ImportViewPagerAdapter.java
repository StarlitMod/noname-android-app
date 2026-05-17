package com.widget.noname.function.functionimport.adapter;

import static com.kongzue.dialogx.dialogs.PopTip.tip;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.pm.ResolveInfo;
import android.net.Uri;
import android.os.Build;
import android.util.Log;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.MimeTypeMap;

import androidx.annotation.NonNull;
import androidx.core.content.FileProvider;
import androidx.documentfile.provider.DocumentFile;
import androidx.recyclerview.widget.RecyclerView;

import com.kongzue.dialogx.dialogs.MessageDialog;
import com.kongzue.dialogx.dialogs.PopMenu;
import com.kongzue.dialogx.sharedialog.ShareDialog;
import com.kongzue.dialogx.sharedialog.bean.ShareData;
import com.widget.noname.function.functionimport.databinding.FileItemViewModel;
import com.widget.noname.function.functionimport.databinding.ItemFileBinding;
import com.widget.noname.function.functionimport.listener.ImportItemListener;
import com.widget.noname.util.ApkUtil;
import com.widget.noname.util.FileUtil;
import com.widget.noname.util.ShizukuUtil;

import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class ImportViewPagerAdapter extends RecyclerView.Adapter<ImportViewPagerAdapter.FileViewHolder> {
    private static final String TAG = "ImportViewPagerAdapter";
    private List<FileItemViewModel> fileItems;

    private Context context;

    private ImportItemListener listener = null;

    public ImportViewPagerAdapter(Context context) {
        this.context = context;
        fileItems = new ArrayList<>();
    }

    @SuppressLint("NotifyDataSetChanged")
    public void setFiles(List<FileItemViewModel> files) {
        this.fileItems = files;
        notifyDataSetChanged();
    }

    @SuppressLint("NotifyDataSetChanged")
    public void clearAll() {
        fileItems.clear();
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public FileViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        ItemFileBinding binding = ItemFileBinding.inflate(
                LayoutInflater.from(parent.getContext()), parent, false);
        return new FileViewHolder(binding);
    }

    @Override
    public void onBindViewHolder(@NonNull FileViewHolder holder, int position) {
        FileItemViewModel data = fileItems.get(position);
        holder.bind(data);

        // 设置点击事件
        holder.itemView.setOnClickListener(v -> {
            onItemClick(v, data);
        });
    }

    public void setItemClickListener(ImportItemListener listener) {
        this.listener = listener;
    }

    @SuppressLint("CheckResult")
    public void onItemClick(View view, FileItemViewModel data) {
        if (data.isDirectory()) {
            browseFolder(data);
        }
        else {
            PopMenu.show(view, new String[] {
                            context.getString(com.widget.noname.function.functionlibrary.R.string.common_action_import),
                            context.getString(com.widget.noname.function.functionlibrary.R.string.common_action_open),
                            context.getString(com.widget.noname.function.functionlibrary.R.string.common_action_share)
                    })
                    .setOverlayBaseView(false)
                    .setAlignGravity(Gravity.RIGHT | Gravity.BOTTOM)
                    .setWidth(view.getWidth() / 4)
                    .setOffScreen(false)
                    .setAutoTintIconInLightOrDarkMode(true)
                    .setIconResIds(
                            com.widget.noname.function.functionlibrary.R.drawable.icon_import,
                            com.widget.noname.function.functionlibrary.R.drawable.icon_open,
                            com.widget.noname.function.functionlibrary.R.drawable.icon_share
                    )
                    .setOnMenuItemClickListener((dialog, text, index) -> {
                        if (index == 0) {
                            importZip(data);
                        }
                        else if (index == 1) {
                            openFile(data);
                        }
                        else if (index == 2) {
                            shareFile(data);
                        }
                        return false;
                    });
        }
    }

    // 浏览文件夹
    private void browseFolder(FileItemViewModel data) {
        if (listener != null) {
            listener.browseFolder(data);
        }
    }

    private void importZip(FileItemViewModel data) {
        MessageDialog.build()
                .setTitle(com.widget.noname.function.functionlibrary.R.string.common_tip)
                .setMessage(context.getString(com.widget.noname.function.functionlibrary.R.string.import_dialog_confirm_file, data.getFileName()))
                .setOkButton(android.R.string.ok, (baseDialog, view) -> {
                    if (null != listener) {
                        listener.importFile(data);
                    }
                    return false;
                })
                .setCancelButton(android.R.string.cancel)
                .show();
    }

    private void openFile(FileItemViewModel data) {
        if (ApkUtil.isAppInstalled("bin.mt.plus")) {
            try {
                Intent intent = new Intent(Intent.ACTION_VIEW);
                intent.setPackage("bin.mt.plus");
                // 使用 FileProvider 转换 URI
                Uri uri = null;
                Object model = data.getModel();
                if (model instanceof DocumentFile) {
                    uri = ((DocumentFile) model).getUri();
                }
                else if (model instanceof File) {
                    uri = FileProvider.getUriForFile(context, context.getPackageName() + ".fileprovider", (File) model);
                }
                intent.setData(uri);
                intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
                context.startActivity(intent);
                ((Activity) context).overridePendingTransition(
                        android.R.anim.fade_in,    // 新 Activity 进入动画
                        android.R.anim.fade_out    // 当前 Activity 退出动画
                );
            } catch (Exception e) {
                tip(context.getString(com.widget.noname.function.functionlibrary.R.string.common_error_cannot_open_file, e.getMessage()));
                e.printStackTrace();
            }
        }
        else {
            tip(com.widget.noname.function.functionlibrary.R.string.common_error_not_install_mt);
        }
    }

    private void shareFile(FileItemViewModel data) {
        // todo: 应该提示不获取所有包名权限导致这个功能有点残缺

        // 创建分享意图
        Intent shareIntent = new Intent(Intent.ACTION_SEND);

        // 获取文件MIME类型
        String extension = MimeTypeMap.getFileExtensionFromUrl(data.getFilePath());
        String mimeType = extension != null ? MimeTypeMap.getSingleton().getMimeTypeFromExtension(extension) : "*/*";
        shareIntent.setType(mimeType != null ? mimeType : "*/*");

        // 设置文件URI
        if (data.getModel() instanceof File) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                // 安卓10或以上需要判断Shizuku权限
                if (ShizukuUtil.checkPermission()) {
                    try {
                        // 随机一个名字
                        String randomName = UUID.randomUUID().toString();
                        if (extension != null && !extension.isEmpty()) {
                            randomName += "." + extension;
                        }
                        // 随机文件的父目录
                        File downloadDir = new File(context.getCacheDir(), "download");
                        if (!downloadDir.exists()) {
                            downloadDir.mkdirs();
                        }
                        if (downloadDir.isFile()) {
                            FileUtil.deleteFolderRecursively(downloadDir);
                            downloadDir.mkdirs();
                        }
                        String randomDir = downloadDir.getAbsolutePath();
                        if (!randomDir.endsWith("/")) {
                            randomDir += "/";
                        }
                        String cmdResult = ShizukuUtil.exec("cp " + ((File) data.getModel()).getAbsolutePath() + " " + randomDir + randomName);
                        Log.e(TAG, "cmdResult: " + cmdResult);
                        // 构造新文件路径
                        File newFile = new File(randomDir, randomName);
                        Log.e(TAG, "newFile path: " + newFile.getAbsolutePath());
                        if (newFile.exists()) {
                            newFile.deleteOnExit();
                            shareIntent.putExtra(Intent.EXTRA_STREAM,
                                    FileProvider.getUriForFile(context,
                                            context.getPackageName() + ".fileprovider",
                                            newFile));
                        }
                        else {
                            throw new Exception(context.getString(com.widget.noname.function.functionlibrary.R.string.common_error_cache_not_exist) + ": " + newFile.getAbsolutePath());
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                        tip(e.getMessage()).iconError().show();
                    }
                }
                else {
                    tip(
                            context.getString(com.widget.noname.function.functionlibrary.R.string.permission_error_no_shizuku_to_share)
                    )
                            .iconError()
                            .show();
                }
            }
            else {
                // 安卓10以下正常分享
                shareIntent.putExtra(Intent.EXTRA_STREAM,
                        FileProvider.getUriForFile(context,
                                context.getPackageName() + ".fileprovider",
                                (File) data.getModel()));
            }
        }
        else if (data.getModel() instanceof DocumentFile) {
            shareIntent.putExtra(Intent.EXTRA_STREAM, ((DocumentFile) data.getModel()).getUri());
        }

        shareIntent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);

        // 查询可以处理该intent的应用
        PackageManager packageManager = context.getPackageManager();
        List<ResolveInfo> resolvers = packageManager.queryIntentActivities(shareIntent, PackageManager.MATCH_DEFAULT_ONLY);

        if (!resolvers.isEmpty()) {
            // 创建应用选择列表

            List<ShareData> shareDataList = new ArrayList<>();

            for (int i = 0; i < resolvers.size(); i++) {
                ResolveInfo info = resolvers.get(i);
                ShareData shareData = new ShareData(
                        String.valueOf(info.loadLabel(packageManager)),
                        info.loadIcon(packageManager)
                );
                shareDataList.add(shareData);
            }

            ShareDialog.build()
                    .setTitle(com.widget.noname.function.functionlibrary.R.string.common_dialog_title_choose_app)
                    .setShareDataList(shareDataList)
                    .show((context, shareData, shareButton, index) -> {
                        // 根据选择的索引获取对应的ResolveInfo
                        ResolveInfo selectedApp = resolvers.get(index);
                        // 设置目标应用包名
                        shareIntent.setPackage(selectedApp.activityInfo.packageName);
                        // 启动选定的应用
                        context.startActivity(shareIntent);
                        return false;
                    });
        }
    }

    @Override
    public int getItemCount() {
        return fileItems.size();
    }

    static class FileViewHolder extends RecyclerView.ViewHolder {
        private final ItemFileBinding binding;

        public FileViewHolder(ItemFileBinding binding) {
            super(binding.getRoot());
            this.binding = binding;
        }

        public void bind(FileItemViewModel viewModel) {
            binding.setViewModel(viewModel);
            binding.executePendingBindings(); // 确保立即更新 UI
        }
    }
}
