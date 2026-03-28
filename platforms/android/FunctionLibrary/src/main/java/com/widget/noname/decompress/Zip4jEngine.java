package com.widget.noname.decompress;

import android.text.TextUtils;
import android.util.Log;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.tencent.mmkv.MMKV;
import com.widget.noname.MyApplication;
import com.widget.noname.common.util.FileConstant;
import com.widget.noname.function.functionlibrary.R;
import com.widget.noname.function.functionlibrary.config.ImportConfig;

import net.lingala.zip4j.ZipFile;
import net.lingala.zip4j.model.ExtraDataRecord;
import net.lingala.zip4j.model.FileHeader;
import net.lingala.zip4j.progress.ProgressMonitor;

import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.ByteBuffer;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Zip4jEngine extends BaseEngine {
    private static final String TAG = "Zip4jEngine";

    private ZipFile zipFile;

    // 修复乱码文件名
    private final Map<String, String> fixFileHeaders = new HashMap<>();

    private void createZipFile(DecompressConfig config, DecompressCallback callback) throws Exception {
        if (zipFile == null) {
            if (!TextUtils.isEmpty(config.getArchivePath())) {
                zipFile = new ZipFile(config.getArchivePath());
            }
            else {
                // 把 InputStream 写入临时文件
                createTempFile(config, callback);
                if (file == null) return;
                zipFile = new ZipFile(file);
            }

            if (!zipFile.isValidZipFile()) {
                throw new Exception(config.getContext().getString(R.string.extract_error_archive_invalid));
            }

            if (config.getFilenameEncoding() != null) {
                zipFile.setCharset(Charset.forName(config.getFilenameEncoding()));
            }

            if (zipFile.isEncrypted()) {
                if (config.getPassword() != null && !config.getPassword().isEmpty()) {
                    zipFile.setPassword(config.getPassword().toCharArray());
                }
                else {
                    throw new Exception(config.getContext().getString(R.string.extract_info_password_required));
                }
            }

            List<FileHeader> list = zipFile.getFileHeaders();
            callback.onLog(config.getContext().getString(R.string.extract_progress_fixing_encoding));
//            for (FileHeader fileHeader : list) {
//                if (fileHeader.getExtraDataRecords() != null) {
//                    for (ExtraDataRecord extraDataRecord : fileHeader.getExtraDataRecords()) {
//                        long identifier = extraDataRecord.getHeader();
//                        if (identifier == 0x7075) {
//                            byte[] bytes = extraDataRecord.getData();
//                            ByteBuffer buffer = ByteBuffer.wrap(bytes);
//                            byte version = buffer.get();
//                            if (version == 1) {
//                                String garbledName = fileHeader.getFileName();
//                                String fixedName = new String(bytes, 5, bytes.length - 5, StandardCharsets.UTF_8);
//                                Log.e(TAG, "乱码文件名: " + garbledName + " -> " + fixedName);
//                                fixFileHeaders.put(garbledName, fixedName);
//                                break;
//                            }
//                        }
//                    }
//                }
//            }
            for (FileHeader fileHeader : list) {
                if (fileHeader.getExtraDataRecords() != null) {
                    for (ExtraDataRecord extraDataRecord : fileHeader.getExtraDataRecords()) {
                        long identifier = extraDataRecord.getHeader();
                        if (identifier == 0x7075) {
                            byte[] bytes = extraDataRecord.getData();
                            ByteBuffer buffer = ByteBuffer.wrap(bytes);
                            byte version = buffer.get();
                            if (version == 1) {
                                String garbledName = fileHeader.getFileName();
                                String utf8Name = new String(bytes, 5, bytes.length - 5, StandardCharsets.UTF_8);

                                // 获取原乱码文件名的目录（如果有）
                                String originalDir = "";
                                int lastSeparator = garbledName.lastIndexOf('/');
                                if (lastSeparator > 0) {
                                    originalDir = garbledName.substring(0, lastSeparator + 1);
                                }

                                // 获取UTF-8文件名（去掉路径）
                                String utf8FileName;
                                if (utf8Name.contains("/")) {
                                    utf8FileName = utf8Name.substring(utf8Name.lastIndexOf('/') + 1);
                                } else {
                                    utf8FileName = utf8Name;
                                }

                                // 组合：原目录 + UTF-8文件名
                                String fixedName = originalDir + utf8FileName;

                                Log.d(TAG, String.format("编码修复: %s -> %s (原始UTF-8: %s)",
                                        garbledName, fixedName, utf8Name));

                                fixFileHeaders.put(garbledName, fixedName);
                                break;
                            }
                        }
                    }
                }
            }
            if (!fixFileHeaders.isEmpty()) {
                callback.onLog(config.getContext().getString(R.string.extract_status_encoding_fixed));
            } else {
                callback.onLog(config.getContext().getString(R.string.extract_status_no_encoding_issue));
            }

        }
    }

    @Override
    public String getInfo() {
        return """
                zip4j version: 2.11.6
                经过个人修改以适配中文文件名
                源项目地址: https://github.com/srikanth-lingala/zip4j
                个人修改后的项目地址: https://github.com/nonameShijian/zip4j/
                """;
    }

    @Override
    public List<ImportConfig> getImportConfig(DecompressConfig config, DecompressCallback callback) throws Exception {
        List<ImportConfig> defaultConfigs = DecompressManager.DEFAULT_IMPORT_TYPE;
        ArrayList<ImportConfig> configs = new ArrayList<>();
        for (ImportConfig defaultConfig : defaultConfigs) {
            // 拷贝, 以此可以修改cfg.path内容
            configs.add(new ImportConfig(defaultConfig));
        }
        getExtensionConfigs(configs);
        Log.e(TAG, "已加载的导入配置: " + configs);

        createZipFile(config, callback);
        Map<ImportConfig, Integer> matchCounts = new HashMap<>();
//            // 不要close这个
//            InputStream in = config.getInputStream();
//            ZipInputStream zipInputStream = new ZipInputStream(in);
//            if (config.getPassword() != null) {
//                zipInputStream.setPassword(config.getPassword().toCharArray());
//            }
//            // 遍历ZIP条目
//            LocalFileHeader localFileHeader;
//            while ((localFileHeader = zipInputStream.getNextEntry()) != null) {
//                String fileName = localFileHeader.getFileName();
//                // 检查每个ImportConfig
//                for (ImportConfig importConfig : configs) {
//                    String[] conditions = importConfig.getCondition();
//                    for (String condition : conditions) {
//                        boolean matched = isMatchedCondition(condition, fileName, importConfig);
//                        if (matched) {
//                            // 增加匹配计数
//                            matchCounts.put(importConfig, matchCounts.getOrDefault(importConfig, 0) + 1);
//
//                            // 兼容：获取info.json中的字段，替换config.path的${xx}内容
//                            // 匹配包含 ${...} 格式的字符串
//                            if (importConfig.getPath().matches(".*\\$\\{[^}]+\\}.*")) {
//                                // 获取info.json的内容
//                                if (condition.endsWith("info.json") && (condition.equals("info.json") || condition.endsWith("/info.json"))) {
//                                    byte[] jsonData = readFile(zipInputStream);
//                                    String jsonString = new String(jsonData, StandardCharsets.UTF_8);
//                                    try {
//                                        JSONObject jsonObject = JSON.parseObject(jsonString);
//                                        // 现在可以使用 jsonObject 访问 JSON 数据
//                                        Log.e(TAG, "json: " + jsonObject.toJSONString());
//                                        // 替换路径中的占位符
//                                        String originalPath = importConfig.getPath();
//                                        String newPath = replacePlaceholders(originalPath, jsonObject);
//                                        importConfig.setPath(newPath);
//                                    } catch (Exception e) {
//                                        Log.e(TAG, "解析 JSON 失败: " + e.getMessage());
//                                    }
//                                }
//
//                            }
//                            // 避免同一个文件匹配多个condition
//                            break;
//                        }
//                    }
//                }
//            }
        List<FileHeader> fileHeaders = zipFile.getFileHeaders();
        for (FileHeader fileHeader : fileHeaders) {
            String fileName = fileHeader.getFileName();
            // 检查每个ImportConfig
            for (ImportConfig importConfig : configs) {
                String[] conditions = importConfig.getCondition();
                for (String condition : conditions) {
                    boolean matched = isMatchedCondition(condition, fileName, importConfig);
                    if (matched) {
                        // 增加匹配计数
                        matchCounts.put(importConfig, matchCounts.getOrDefault(importConfig, 0) + 1);

                        // 兼容：获取json中的字段，替换config.path的${xx}内容
                        // 匹配包含 ${...} 格式的字符串
                        if (importConfig.getPath().matches(".*\\$\\{[^}]+\\}.*")) {
                            // 获取json的内容
                            if (
                                    (importConfig.getName().equals("主题包") && condition.endsWith("manifest.json") &&
                                    (condition.equals("manifest.json") || condition.endsWith("/manifest.json")))
                                        ||
                                    (condition.endsWith("info.json") && (condition.equals("info.json") || condition.endsWith("/info.json")))
                            ) {
                                // 通过 FileHeader 获取文件输入流
                                String jsonString = getFileContentAsString(zipFile, fileHeader);
                                try {
                                    JSONObject jsonObject = JSON.parseObject(jsonString);
                                    // 现在可以使用 jsonObject 访问 JSON 数据
                                    Log.e(TAG, "json: " + jsonObject.toJSONString());
                                    // 替换路径中的占位符
                                    String originalPath = importConfig.getPath();
                                    String newPath = replacePlaceholders(originalPath, jsonObject);
                                    importConfig.setPath(newPath);
                                } catch (Exception e) {
                                    Log.e(TAG, "解析 JSON 失败: " + e.getMessage());
                                }
                            }
                        }
                        // 避免同一个文件匹配多个condition
                        break;
                    }
                }
            }
        }
        Log.e(TAG, "nestedPathMap: " + nestedPathMap);
        // 收集所有完全匹配的配置
        List<ImportConfig> allMatches = new ArrayList<>();
        for (Map.Entry<ImportConfig, Integer> entry : matchCounts.entrySet()) {
            ImportConfig cfg = entry.getKey();
            int matches = entry.getValue();
            int totalConditions = cfg.getCondition().length;
            // 如果所有条件都匹配
            if (matches == totalConditions) {
                allMatches.add(cfg);
            }
        }
        return allMatches;
    }

    public byte[] getFileContent(ZipFile zipFile, FileHeader fileHeader) throws IOException {
        try (InputStream inputStream = zipFile.getInputStream(fileHeader)) {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            byte[] buffer = new byte[8192];
            int bytesRead;
            while ((bytesRead = inputStream.read(buffer)) != -1) {
                baos.write(buffer, 0, bytesRead);
            }
            return baos.toByteArray();
        }
    }

    public String getFileContentAsString(ZipFile zipFile, FileHeader fileHeader) throws IOException {
        byte[] content = getFileContent(zipFile, fileHeader);
        return new String(content, StandardCharsets.UTF_8);
    }

    @Override
    public String getExtractPath(String basePath, ImportConfig importConfig) {
        if (importConfig.getName().equals("无名杀·本体包")) {
            return basePath;
        }

        String path = importConfig.getPath();
        File privateDir = MyApplication.getContext().getFilesDir().getParentFile();

        // 路径判断
        if (privateDir != null && path != null) {
            String privatePath = privateDir.getAbsolutePath();
            // 判断是否是私有目录路径
            if (path.startsWith(privatePath)) {
                File file = new File(path);
                try {
                    return file.getCanonicalPath();
                } catch (Exception e) {
                    e.printStackTrace();
                    return file.getAbsolutePath();
                }
            }
        }

        // 默认使用相对路径拼接
        File file = new File(basePath, path);
        try {
            return file.getCanonicalPath();
        } catch (Exception e) {
            return file.getAbsolutePath();
        }
    }

    @Override
    public void decompress(DecompressConfig config, ImportConfig importConfig, DecompressCallback callback) {
        MyApplication.getThreadPool().execute(() -> {
            String extractPath = new File(config.getExtractPath()).getAbsolutePath();
            try {
                createZipFile(config, callback);

                callback.onStart();
                callback.onLog(config.getContext().getString(R.string.extract_hint_destination_path, extractPath));

                // 设置进度监听
                final ProgressMonitor progressMonitor = zipFile.getProgressMonitor();

                Log.e(TAG, "嵌套路径: " + (nestedPathMap.containsKey(importConfig) ? "有" : "无"));
                Log.e(TAG, "fixFileHeaders: " + fixFileHeaders);

                // 获取嵌套解压路径
                if (nestedPathMap.containsKey(importConfig)) {
                    // map: */a.js -> 嵌套目录/a.js
                    // condition, fileName
                    Map<String, String> nestedConfigPathMap = nestedPathMap.get(importConfig);
                    // 获取嵌套前缀
                    String nestedPrefix = null;
                    for (String mappedPath : nestedConfigPathMap.values()) {
                        String[] pathSegments = mappedPath.split("/");
                        if (pathSegments.length > 1) {
                            nestedPrefix = pathSegments[0];
                            break;
                        }
                    }

                    if (nestedPrefix != null) {
                        // 使用嵌套前缀构建目标路径
                        String rootPath = nestedPrefix + "/";
                        // 执行嵌套解压逻辑
                        // 移除除了rootPath外的文件
                        List<String> filesToRemove = new ArrayList<>();
                        Map<String, String> fileNamesMap = new HashMap<>();
                        List<FileHeader> fileHeaders = zipFile.getFileHeaders();
                        for (FileHeader f: fileHeaders) {
                            String name = f.getFileName();
                            if (!name.startsWith(rootPath)) {
                                filesToRemove.add(name);
                            } else if(!f.isDirectory()) {
                                fileNamesMap.put(name, name.substring(rootPath.length()));
                            }
                        }
                        // zip文件中删除多个文件和文件夹
                        zipFile.removeFiles(filesToRemove);
                        // 把rootPath中的文件移动到zip根目录
                        zipFile.renameFiles(fileNamesMap);
                        // 删除rootPath
                        zipFile.removeFile(rootPath);
                        // 循环删除
                        if (rootPath.split("/").length > 1) {
                            String[] split = rootPath.split("/");
                            for (int i = split.length - 1; i > -1; i--) {
                                StringBuilder p = new StringBuilder();
                                for (int j = 0; j <= i; j++) {
                                    p.append(split[j]).append('/');
                                }
                                zipFile.removeFile(p.toString());
                            }
                        }
                    }

                    zipFile.setRunInThread(true);
                    zipFile.extractAll(extractPath, fixFileHeaders);
                }
                else {
                    zipFile.setRunInThread(true);
                    zipFile.extractAll(extractPath, fixFileHeaders);
                }

                while (!progressMonitor.getState().equals(ProgressMonitor.State.READY)) {
                    if (progressMonitor.getFileName() != null) {
                        callback.onLog(config.getContext().getString(R.string.extract_progress_unpacking_file, progressMonitor.getFileName()));
                    }
                    callback.onProgress(progressMonitor.getPercentDone());
                    Thread.sleep(200);
                }

                if (progressMonitor.getResult().equals(ProgressMonitor.Result.ERROR)) {
                    progressMonitor.getException().printStackTrace();
                    throw progressMonitor.getException();

                }
                else if (progressMonitor.getResult().equals(ProgressMonitor.Result.CANCELLED)) {
                    throw new Exception(config.getContext().getString(R.string.extract_error_process_cancelled));
                }
                else if (progressMonitor.getResult().equals(ProgressMonitor.Result.SUCCESS)) {
                    zipFile.setRunInThread(false);
                    callback.onLog(config.getContext().getString(R.string.extract_progress_deleting_temp));
                    zipFile = null;
                    if (file.delete()) {
                        callback.onLog(config.getContext().getString(R.string.extract_status_temp_deleted));
                    }
                    else {
                        callback.onLog(config.getContext().getString(R.string.extract_warning_temp_delete_failed));
                    }
                    callback.onSuccess(extractPath, importConfig);
                }

            } catch (Exception e) {
                callback.onFailure(e);
            }
        });
    }
}
