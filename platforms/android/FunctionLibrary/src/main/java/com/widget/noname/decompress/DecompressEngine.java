package com.widget.noname.decompress;

import com.widget.noname.function.functionlibrary.config.ImportConfig;

import java.util.List;

public interface DecompressEngine {
    // 获取解压库信息
    String getInfo();
    // 获取导入配置
    List<ImportConfig> getImportConfig(DecompressConfig config, DecompressCallback callback) throws Exception;

    // 获取解压路径
    String getExtractPath(String basePath, ImportConfig importConfig);

    // 导入
    void decompress(DecompressConfig config, ImportConfig importConfig, DecompressCallback callback);
}
