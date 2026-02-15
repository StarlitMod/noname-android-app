package com.widget.noname.function.functionimport.databinding;

import android.content.Context;
import android.net.Uri;
import android.util.Log;

import androidx.annotation.Nullable;
import androidx.databinding.BaseObservable;
import androidx.databinding.Bindable;
import androidx.documentfile.provider.DocumentFile;

import com.widget.noname.function.functionimport.BR;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.InputStream;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

public class FileItemViewModel extends BaseObservable {
    private static final String TAG = "FileItemViewModel";

    private boolean isDirectory;
    private String fileName;
    private String fileSize;
    private String fileDate;
    private String filePath;
    private Object model;

    public FileItemViewModel() {
        notifyChange();
    }

    public boolean isDirectory() {
        return isDirectory;
    }

    public FileItemViewModel(File file) {
        this.model = file;
        this.isDirectory = file.isDirectory();
        this.fileName = file.getName();
        if (this.isDirectory) {
            this.fileSize = "";
        } else {
            this.fileSize = formatFileSize(file.length());
        }
        this.fileDate = new SimpleDateFormat("yyyy-MM-dd HH:mm", Locale.getDefault())
                .format(new Date(file.lastModified()));
        // this.filePath = file.getAbsolutePath();
        this.filePath = Uri.fromFile(file).toString();
        notifyChange();
    }

    public void setDirectory(boolean directory) {
        isDirectory = directory;
        if (this.isDirectory) {
            this.fileSize = "";
        } else {
            if (this.model instanceof DocumentFile) {
                this.fileSize = formatFileSize(((DocumentFile) this.model).length());
            } else {
                this.fileSize = formatFileSize(((File) this.model).length());
            }
        }
        notifyChange();
    }

    public void setModel(Object model) {
        this.model = model;
        notifyChange();
    }

    /**
     * 从 DocumentFile 构造（SAF）
     */
    public FileItemViewModel(Context context, androidx.documentfile.provider.DocumentFile documentFile) {
        this.model = documentFile;
        this.isDirectory = documentFile.isDirectory();
        this.fileName = documentFile.getName();
        if (this.isDirectory) {
            this.fileSize = "";
        } else {
            this.fileSize = formatFileSize(documentFile.length());
        }
        this.fileDate = new SimpleDateFormat("yyyy-MM-dd HH:mm", Locale.getDefault())
                .format(new Date(documentFile.lastModified()));
        // 保存 Uri 字符串，便于后续使用
        this.filePath = documentFile.getUri().toString();
        notifyChange();
    }

    public FileItemViewModel(FileItemViewModel viewModel) {
        this.model = viewModel.model;
        this.isDirectory = viewModel.isDirectory;
        this.fileName = viewModel.fileName;
        this.fileSize = viewModel.fileSize;
        this.fileDate = viewModel.fileDate;
        this.filePath = viewModel.filePath;
        notifyChange();
    }

    @Bindable
    public String getFileName() {
        return fileName;
    }

    public Object getModel() {
        return model;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
        notifyPropertyChanged(BR.fileName);
    }

    @Bindable
    public String getFileSize() {
        return fileSize;
    }

    public void setFileSize(String fileSize) {
        this.fileSize = fileSize;
        notifyPropertyChanged(BR.fileSize);
    }

    @Bindable
    public String getFileDate() {
        return fileDate;
    }

    public void setFileDate(String fileDate) {
        this.fileDate = fileDate;
        notifyPropertyChanged(BR.fileDate);
    }

    @Bindable
    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
        notifyPropertyChanged(BR.filePath);
    }

    // 格式化文件大小
    private String formatFileSize(long size) {
        if (size <= 0) return "0 B";
        final String[] units = {"B", "KB", "MB", "GB"};
        int digitGroups = (int) (Math.log10(size) / Math.log10(1024));
        return new DecimalFormat("#,##0.##")
                .format(size / Math.pow(1024, digitGroups)) + " " + units[digitGroups];
    }

    /**
     * 获取文件输入流（兼容 File 和 DocumentFile）
     */
    @Nullable
    public InputStream openInputStream(Context context) {
        if (filePath == null) return null;

        try {
            if (filePath.startsWith("file://")) {
                // 注: 如果是shizuku授权的路径，那可能需要另外转换一下
                // 参考importFragment.importFile
                File file = new File(Uri.parse(filePath).getPath());
                return new FileInputStream(file);
            } else if (filePath.startsWith("content://")) {
                Uri uri = Uri.parse(filePath);
                return context.getContentResolver().openInputStream(uri);
            }
        } catch (FileNotFoundException e) {
            Log.e(TAG, "无法打开文件: " + filePath, e);
        }
        return null;
    }

    /**
     * 判断是否为 SAF 路径
     */
    public boolean isSAFPath() {
        return filePath != null && filePath.startsWith("content://");
    }

    /**
     * 将当前文件项转换为 Uri
     * 支持 file:// 和 content:// 两种格式
     *
     * @return 解析后的 Uri，如果 filePath 无效则返回 null
     */
    @Nullable
    public Uri toUri() {
        if (filePath == null || filePath.trim().isEmpty()) {
            return null;
        }

        try {
            return Uri.parse(filePath);
        } catch (Exception e) {
            Log.e(TAG, "无法解析 URI: " + filePath, e);
            return null;
        }
    }
}
