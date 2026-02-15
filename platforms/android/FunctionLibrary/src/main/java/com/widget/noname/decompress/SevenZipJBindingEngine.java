package com.widget.noname.decompress;

import android.annotation.SuppressLint;
import android.util.Log;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.widget.noname.MyApplication;
import com.widget.noname.function.functionlibrary.R;
import com.widget.noname.function.functionlibrary.config.ImportConfig;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.RandomAccessFile;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import net.sf.sevenzipjbinding.ArchiveFormat;
import net.sf.sevenzipjbinding.ExtractAskMode;
import net.sf.sevenzipjbinding.ExtractOperationResult;
import net.sf.sevenzipjbinding.IArchiveExtractCallback;
import net.sf.sevenzipjbinding.ICryptoGetTextPassword;
import net.sf.sevenzipjbinding.IInArchive;
import net.sf.sevenzipjbinding.ISequentialOutStream;
import net.sf.sevenzipjbinding.PropID;
import net.sf.sevenzipjbinding.SevenZip;
import net.sf.sevenzipjbinding.SevenZipException;
import net.sf.sevenzipjbinding.impl.RandomAccessFileInStream;
import net.sf.sevenzipjbinding.impl.RandomAccessFileOutStream;
import net.sf.sevenzipjbinding.simple.ISimpleInArchive;
import net.sf.sevenzipjbinding.simple.ISimpleInArchiveItem;

public class SevenZipJBindingEngine extends BaseEngine {
    private static final String TAG = "SevenZipJBindingEngine";
    protected ArchiveFormat archiveFormat = ArchiveFormat.SEVEN_ZIP;
    protected RandomAccessFile randomAccessFile;
    protected RandomAccessFileInStream inStream;
    protected IInArchive inArchive;
    protected String nestedPrefix = null;

    @SuppressLint("DefaultLocale")
    @Override
    public String getInfo() {
        SevenZip.Version version = SevenZip.getSevenZipVersion();
        return String.format("""
            7-zip version: %d.%d.%d(%s), %s
            7ZipJBinding version: %s
            copyright: %s
            Native library initialized: %s
            源项目地址: https://github.com/omicronapps/7-Zip-JBinding-4Android
            """,
                version.major,
                version.minor,
                version.build,
                version.version,
                version.date,
                SevenZip.getSevenZipJBindingVersion(),
                version.copyright,
                SevenZip.isInitializedSuccessfully()
        );
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
        createTempFile(config, callback);
        if (file == null) {
            return Collections.emptyList();
        }
        Map<ImportConfig, Integer> matchCounts = new HashMap<>();
        randomAccessFile = new RandomAccessFile(file, "r");
        inStream = new RandomAccessFileInStream(randomAccessFile);
        inArchive = SevenZip.openInArchive(archiveFormat, inStream, config.getPassword());
        ISimpleInArchive simpleInArchive = inArchive.getSimpleInterface();
        ISimpleInArchiveItem[] archiveItems = simpleInArchive.getArchiveItems();
        for (ISimpleInArchiveItem item : archiveItems) {
            String fileName = item.getPath();
            boolean isDirectory = item.isFolder();
            Long fileSize = item.getSize();
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
                                // 解压单个文件获取内容
                                File jsonFile = null;
                                RandomAccessFileOutStream rafo = null;
                                try {
                                    jsonFile = File.createTempFile("temp", ".json");
                                    jsonFile.deleteOnExit();
                                    rafo = new RandomAccessFileOutStream(new RandomAccessFile(jsonFile , "rw"));
                                    ExtractOperationResult result;
                                    if (config.getPassword() != null) {
                                        result = item.extractSlow(rafo , config.getPassword());
                                    } else {
                                        result = item.extractSlow(rafo);
                                    }
                                    rafo.close();
                                    if (result == ExtractOperationResult.OK) {
                                        // 正确读取文件内容
                                        StringBuilder content = new StringBuilder();
                                        BufferedReader reader = new BufferedReader(new FileReader(jsonFile));
                                        String line;
                                        while ((line = reader.readLine()) != null) {
                                            content.append(line);
                                        }
                                        reader.close();

                                        String jsonString = content.toString();
                                        JSONObject jsonObject = JSON.parseObject(jsonString);
                                        // 现在可以使用 jsonObject 访问 JSON 数据
                                        Log.e(TAG, "json: " + jsonObject.toJSONString());
                                        // 替换路径中的占位符
                                        String originalPath = importConfig.getPath();
                                        String newPath = replacePlaceholders(originalPath, jsonObject);
                                        importConfig.setPath(newPath);
                                    }
                                    else {
                                        Log.e(TAG, "解压文件失败: " + result);
                                    }
                                } catch (Exception e) {
                                    Log.e(TAG, "解析 JSON 失败: " + e.getMessage());
                                } finally {
                                    if (jsonFile != null) {
                                        jsonFile.delete();
                                    }
                                }
                            }
                        }
                        // 避免同一个文件匹配多个condition
                        break;
                    }
                }
            }
        }
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
            else {
                Log.e(TAG, "条件未匹配: " + cfg.getName());
                Log.e(TAG, Arrays.toString(cfg.getCondition()));
                Log.e(TAG, "" + matches);
                Log.e(TAG, "" + totalConditions);
            }
        }
        return allMatches;
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
        if (file == null) {
            callback.onLog(config.getContext().getString(R.string.extract_error_temp_missing_stop));
            callback.onFailure(new Exception(config.getContext().getString(R.string.common_error_temp_not_exist)));
            return;
        }
        MyApplication.getThreadPool().execute(() -> {
            File extractDir = new File(config.getExtractPath());
            String extractPath = new File(config.getExtractPath()).getAbsolutePath();
            callback.onStart();
            callback.onLog(config.getContext().getString(R.string.extract_hint_destination_path, extractPath));

            // 获取嵌套解压路径
            if (nestedPathMap.containsKey(importConfig)) {
                // map: */a.js -> 嵌套目录/a.js
                // condition, fileName
                Map<String, String> nestedConfigPathMap = nestedPathMap.get(importConfig);
                // 获取嵌套前缀
                for (String mappedPath : nestedConfigPathMap.values()) {
                    String[] pathSegments = mappedPath.split("/");
                    if (pathSegments.length > 1) {
                        nestedPrefix = pathSegments[0];
                        break;
                    }
                }
            }

            try {
                ISimpleInArchive simpleInArchive = inArchive.getSimpleInterface();
                ISimpleInArchiveItem[] archiveItems = simpleInArchive.getArchiveItems();

                // 在循环外部声明索引列表
                List<Integer> indicesToExtract = new ArrayList<>();

                for (ISimpleInArchiveItem item : archiveItems) {
                    // 跳过文件夹
                    if (item.isFolder()) {
                        continue;
                    }
                    String itemPath = item.getPath();
                    // 判断是否以nestedPrefix开头
                    if (nestedPrefix != null && itemPath.startsWith(nestedPrefix)) {
                        if (itemPath.startsWith(nestedPrefix + "/") || itemPath.equals(nestedPrefix) || itemPath.startsWith(nestedPrefix + "\\")) {
                            indicesToExtract.add(item.getItemIndex());
                        }
                    }
                    else {
                        indicesToExtract.add(item.getItemIndex());
                    }
                }

                // 将List转换为数组供后续使用
                int[] indicesArray = indicesToExtract.stream().mapToInt(i -> i).toArray();
                inArchive.extract(indicesArray, false, new ArchiveExtractCallback(extractDir, config.getPassword(), callback));

                inArchive.close();
                inStream.close();

                callback.onLog(config.getContext().getString(R.string.extract_progress_deleting_temp));
                if (file.delete()) {
                    callback.onLog(config.getContext().getString(R.string.extract_status_temp_deleted));
                }
                else {
                    callback.onLog(config.getContext().getString(R.string.extract_warning_temp_delete_failed));
                }

                callback.onSuccess(extractPath, importConfig);

            } catch (Exception e) {
                e.printStackTrace();
                callback.onFailure(e);
            }
        });
    }

    private class ArchiveExtractCallback implements IArchiveExtractCallback, ICryptoGetTextPassword {
        File extractDir;
        String password;
        DecompressCallback callback;
        long total = 0;
        long complete = 0;
        int lastPercent = -1;
        public ArchiveExtractCallback(File extractDir, String password, DecompressCallback callback) {
            this.extractDir = extractDir;
            this.password = password;
            this.callback = callback;
        }
        @Override
        public String cryptoGetTextPassword() throws SevenZipException {
            return password;
        };
        @Override
        public ISequentialOutStream getStream(int index, ExtractAskMode extractAskMode) throws SevenZipException {
            Log.i(TAG, "Extract archive, get stream: " + index + " to: " + extractAskMode);
            String filePath = inArchive.getStringProperty(index, PropID.PATH);
            // 如果存在nestedPrefix，去除前缀
            if (nestedPrefix != null && !nestedPrefix.isEmpty()) {
                String prefixWithSlash = nestedPrefix + "/";
                if (filePath.startsWith(prefixWithSlash)) {
                    filePath = filePath.substring(prefixWithSlash.length());
                } else if (filePath.equals(nestedPrefix)) {
                    filePath = "";
                }
            }
            File targetFile = new File(extractDir, filePath);
            // 创建父目录
            targetFile.getParentFile().mkdirs();
            try {
                return new RandomAccessFileOutStream(new RandomAccessFile(targetFile, "rw"));
            } catch (Exception e) {
                throw new SevenZipException(e);
            }
        }

        @Override
        public void prepareOperation(ExtractAskMode extractAskMode) throws SevenZipException {
            Log.i(TAG, "Extract archive, prepare to: " + extractAskMode);
        }

        @Override
        public void setOperationResult(ExtractOperationResult extractOperationResult) throws SevenZipException {
            Log.i(TAG, "Extract archive, completed with: " + extractOperationResult);
            if (extractOperationResult != ExtractOperationResult.OK) {
                throw new SevenZipException(extractOperationResult.toString());
            }
        }

        @Override
        public void setTotal(long total) throws SevenZipException {
            this.total = total;
        }

        @Override
        public void setCompleted(long complete) throws SevenZipException {
            this.complete = complete;
            if (total > 0 && complete > 0) {
                Log.e(TAG, "正在解压: " + complete + "/" + total);
                int percent = (int) ((double) complete / total * 100);
                if (percent != lastPercent) {
                    lastPercent = percent;
                    callback.onProgress(percent);
                }
            }
        }
    }
}
