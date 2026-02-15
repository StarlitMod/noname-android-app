package com.widget.noname.function.functionlibrary.config;

import android.util.Log;

import androidx.annotation.NonNull;

import java.util.Arrays;

public class ImportConfig {
    // 压缩包类型名
    private String name;

    // 解压路径（相对于本体目录）
    private String path;

    // 判断条件
    private String[] condition;

    public ImportConfig() {
    }

    public ImportConfig(String name, String path, @NonNull String[] condition) {
        this.name = name;
        this.path = path;
        this.condition = condition;
    }

    public ImportConfig(ImportConfig config) {
        this.name = config.name;
        this.path = config.path;
        this.condition = config.condition;
    }

    public String getName() {
        return name;
    }

    public String getPath() {
        return path;
    }

    public String[] getCondition() {
        return condition;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public void setCondition(String[] condition) {
        this.condition = condition;
    }

    @NonNull
    @Override
    public String toString() {
        return "ImportConfig{" +
                "name='" + name + '\'' +
                ", path='" + path + '\'' +
                ", condition=" + Arrays.toString(condition) +
                '}';
    }
}
