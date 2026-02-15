package com.widget.noname.decompress;

import android.content.Context;

import java.io.InputStream;

public class DecompressConfig {
    private final Context context;
    private String archivePath;
    private InputStream inputStream;
    private String extractPath;
    private String password;
    private String filenameEncoding; // 如 UTF-8, GBK
    private boolean useUtf8ByDefault = true;

    // 按stream解压
    public DecompressConfig(Context context, InputStream inputStream, String extractPath) {
        this.context = context;
        this.inputStream = inputStream;
        this.archivePath = null;
        this.extractPath = extractPath;
    }

    // 按路径解压
    public DecompressConfig(Context context, String archivePath, String extractPath) {
        this.context = context;
        this.inputStream = null;
        this.archivePath = archivePath;
        this.extractPath = extractPath;
    }

    public static DecompressConfig of(Context context, InputStream inputStream, String extractPath) {
        return new DecompressConfig(context, inputStream, extractPath);
    }

    public static DecompressConfig of(Context context, String archivePath, String extractPath) {
        return new DecompressConfig(context, archivePath, extractPath);
    }

    public DecompressConfig setPassword(String password) {
        this.password = password;
        return this;
    }

    public DecompressConfig setFilenameEncoding(String encoding) {
        this.filenameEncoding = encoding;
        return this;
    }

    public DecompressConfig setUseUtf8ByDefault(boolean useUtf8ByDefault) {
        this.useUtf8ByDefault = useUtf8ByDefault;
        return this;
    }

    // getter
    public InputStream getInputStream() { return inputStream; }
    public String getArchivePath() { return archivePath; }
    public String getExtractPath() { return extractPath; }
    public String getPassword() { return password; }
    public String getFilenameEncoding() {
        if (filenameEncoding != null) {
            return filenameEncoding;
        } else if (useUtf8ByDefault) {
            return "utf8";
        }
        return null;
    }
    public boolean isUseUtf8ByDefault() { return useUtf8ByDefault; }

    public Context getContext() {
        return context;
    }

    public void setArchivePath(String archivePath) {
        this.archivePath = archivePath;
    }

    public void setInputStream(InputStream inputStream) {
        this.inputStream = inputStream;
    }

    public void setExtractPath(String extractPath) {
        this.extractPath = extractPath;
    }
}