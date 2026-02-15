package com.widget.noname.decompress;

import android.content.Context;

import com.widget.noname.function.functionlibrary.R;
import com.widget.noname.function.functionlibrary.config.ImportConfig;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.util.List;

public class CopyEngine extends BaseEngine {
    @Override
    public String getInfo() {
        return "CopyEngine version: 1.0";
    }

    @Override
    public List<ImportConfig> getImportConfig(DecompressConfig config, DecompressCallback callback) throws Exception {
        return null;
    }

    @Override
    public String getExtractPath(String basePath, ImportConfig importConfig) {
        if (importConfig.getName().equals("无名杀·本体包")) {
            return basePath;
        }
        else {
            File file = new File(basePath, importConfig.getPath());
            try {
                return file.getCanonicalPath();
            } catch (Exception e) {
                return file.getAbsolutePath();
            }
        }
    }

    @Override
    public void decompress(DecompressConfig config, ImportConfig importConfig, DecompressCallback callback) {
        try {
            Context context = config.getContext();
            File baseDir = context.getExternalFilesDir(null);
            String fileName = getFileName(config.getExtractPath());
            File destFile = new File(baseDir, fileName);
            if (!destFile.getParentFile().exists() && !destFile.getParentFile().mkdirs()) {
                callback.onFailure(new Exception(config.getContext().getString(R.string.common_error_create_folder_failed)));
                return;
            }
            InputStream in = config.getInputStream();
            if (in == null) {
                callback.onFailure(new Exception(config.getContext().getString(R.string.common_error_open_input_stream_failed)));
                return;
            }
            callback.onStart();
            callback.onLog(config.getContext().getString(R.string.extract_hint_copy_destination) + ": " + destFile.getCanonicalPath());

            try (FileOutputStream out = new FileOutputStream(destFile)) {
                byte[] buffer = new byte[8192];
                int len;
                while ((len = in.read(buffer)) != -1) {
                    out.write(buffer, 0, len);
                }
            }

            callback.onSuccess(config.getExtractPath(), importConfig);
        } catch (Exception e) {
            callback.onFailure(e);
        }
    }

    // 跟据路径获取文件名
    public static String getFileName(String path) {
        return path.substring(path.lastIndexOf("/") + 1);
    }
}
