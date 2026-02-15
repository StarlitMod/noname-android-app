package com.widget.noname.decompress;

import com.widget.noname.function.functionlibrary.config.ImportConfig;

public interface DecompressCallback {
    void onStart();
    void onProgress(int percent); // 0~100
    void onLog(String log);
    void onSuccess(String extractPath, ImportConfig importConfig);
    void onFailure(Exception e);
    void onProgressUpdate(String currentFile, long completedBytes, long totalBytes);
}
