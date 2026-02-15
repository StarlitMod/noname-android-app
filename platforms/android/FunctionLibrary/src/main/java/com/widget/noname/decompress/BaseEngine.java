package com.widget.noname.decompress;

import android.util.Log;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.tencent.mmkv.MMKV;
import com.widget.noname.common.util.FileConstant;
import com.widget.noname.function.functionlibrary.R;
import com.widget.noname.function.functionlibrary.config.ImportConfig;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class BaseEngine implements DecompressEngine {
    private static final String TAG = "BaseEngine";

    @Override
    public String getInfo() {
        return "BaseEngine version: 1.0";
    }

    @Override
    public List<ImportConfig> getImportConfig(DecompressConfig config, DecompressCallback callback) throws Exception {
        return Collections.emptyList();
    }

    @Override
    public String getExtractPath(String basePath, ImportConfig importConfig) {
        return "";
    }

    @Override
    public void decompress(DecompressConfig config, ImportConfig importConfig, DecompressCallback callback) {

    }

    protected File file;

    // 储存匹配路径信息
    protected final Map<ImportConfig, Map<String, String>> nestedPathMap = new HashMap<>();

    protected void createTempFile(DecompressConfig config, DecompressCallback callback) {
        try {
            file = File.createTempFile("temp", ".zip");
            // file = new File(config.getContext().getExternalCacheDir(), "temp.zip");
            // if (file.exists()) file.delete();
            file.deleteOnExit();
            InputStream in = config.getInputStream();
            try (OutputStream out = new FileOutputStream(file)) {
                callback.onLog(config.getContext().getString(R.string.common_progress_creating_temp));
                byte[] buffer = new byte[8192];
                int len;
                while ((len = in.read(buffer)) != -1) {
                    out.write(buffer, 0, len);
                }
            }
        } catch (IOException e) {
            callback.onLog(config.getContext().getString(R.string.extract_error_temp_creation_failed));
            callback.onFailure(e);
            Log.e(TAG, e.getMessage());
        }
    }

    protected void getExtensionConfigs(ArrayList<ImportConfig> configs) {
        String gamePath = MMKV.defaultMMKV().getString(FileConstant.GAME_PATH_KEY, null);
        // 如果有本体目录，加载扩展的导入配置
        if (gamePath != null) {
            // 加载扩展的配置
            File extensionDir = new File(gamePath, "extension");
            if (extensionDir.exists() && extensionDir.isDirectory()) {
                // 遍历extensionDir
                for (File extNameDir : extensionDir.listFiles()) {
                    // 单个扩展文件夹
                    if (extNameDir.exists() && extNameDir.isDirectory()) {
                        // 加载扩展的info.json
                        File infoFile = new File(extNameDir, "info.json");
                        if (infoFile.exists()) {
                            // file -> string
                            String jsonString = null;
                            try {
                                jsonString = readFileToString(infoFile);
                            } catch (IOException e) {
                                Log.e(TAG, "读取info.json文件失败: " + e.getMessage());
                                continue;
                            }
                            try {
                                JSONObject jsonObject = JSON.parseObject(jsonString);
                                if (jsonObject.containsKey("importConfig")) {
                                    // 解析importConfig数组
                                    JSONArray jsonArray = jsonObject.getJSONArray("importConfig");
                                    List<ImportConfig> importConfigs = jsonArray.toJavaList(ImportConfig.class);
                                    // 修改每个ImportConfig的path字段
                                    for (ImportConfig configItem : importConfigs) {
                                        configItem.setName("无名杀·" + extNameDir.getName() + "·" + configItem.getName());
                                        boolean isDuplicate = false;
                                        for (ImportConfig existingConfig : configs) {
                                            if (existingConfig.getName().equals(configItem.getName())) {
                                                isDuplicate = true;
                                                break;
                                            }
                                        }
                                        if (!isDuplicate) {
                                            // 修改path并添加
                                            String originalPath = configItem.getPath();
                                            if (originalPath != null) {
                                                String newPath = "extension/" + extNameDir.getName() + "/" + originalPath;
                                                configItem.setPath(newPath);
                                            }
                                            configs.add(configItem);
                                            Log.e(TAG, "成功从extension/" + extNameDir.getName() + "/info.json中读取: " + configItem);
                                        }
                                    }
                                }
                            } catch (Exception e) {
                                Log.e(TAG, "解析info.json失败: " + e.getMessage());
                            }
                        }
                    }
                }
            }
        }
    }

    private String readFileToString(File file) throws IOException {
        StringBuilder content = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
            String line;
            while ((line = reader.readLine()) != null) {
                content.append(line);
            }
        }
        return content.toString();
    }

    protected boolean isMatchedCondition(String condition, String fileName, ImportConfig importConfig) {
        boolean matched = false;
        // 嵌套(一层)匹配
        if (condition.startsWith("*/")) {
            // 处理通配符模式，如 */extension.js 或 */abb/xxxx.js
            String suffix = condition.substring(2); // 去掉 "*/" 前缀
            // 检查是否匹配根目录文件
            if (suffix.equals(fileName)) {
                matched = true;
            }
            // 检查是否匹配嵌套结构（去掉第一层目录后匹配）
            else {
                String[] pathSegments = fileName.split("/");
                if (pathSegments.length > 1) {
                    // 重建去掉第一层后的路径
                    StringBuilder nestedPath = new StringBuilder();
                    for (int i = 1; i < pathSegments.length; i++) {
                        if (i > 1) nestedPath.append("/");
                        nestedPath.append(pathSegments[i]);
                    }
                    // 检查是否匹配
                    if (nestedPath.toString().equals(suffix)) {
                        matched = true;
                        // 嵌套记录至map
                        if (!nestedPathMap.containsKey(importConfig)) {
                            nestedPathMap.put(importConfig, new HashMap<>());
                        }
                        Map<String, String> nestedConfigPathMap = nestedPathMap.get(importConfig);

                        // 确保所有文件来自同一嵌套目录
                        String currentPrefix = pathSegments[0];
                        if (nestedConfigPathMap.isEmpty()) {
                            // 第一个匹配项，直接添加
                            nestedConfigPathMap.put(condition, fileName);
                        } else {
                            // 检查是否与已存在的前缀一致
                            String existingPrefix = getExistingPrefix(nestedConfigPathMap);
                            if (existingPrefix == null || existingPrefix.equals(currentPrefix)) {
                                // 前缀一致或第一个条目，添加到映射中
                                nestedConfigPathMap.put(condition, fileName);
                            } else {
                                // 前缀不一致，不添加并标记为不匹配
                                matched = false;
                            }
                        }
                    }
                }
            }
        }
        else {
            // 原有逻辑
            if (condition.equals(fileName)) {
                matched = true;
            }
        }
        return matched;
    }

    // 辅助方法：获取已存在的前缀
    private String getExistingPrefix(Map<String, String> nestedConfigPathMap) {
        if (nestedConfigPathMap.isEmpty()) {
            return null;
        }
        // 获取第一个条目的前缀作为参考
        String firstFileName = nestedConfigPathMap.values().iterator().next();
        String[] segments = firstFileName.split("/");
        if (segments.length > 1) {
            return segments[0];
        }
        return null;
    }

    protected String replacePlaceholders(String path, JSONObject jsonObject) {
        // 匹配 ${...} 格式的占位符
        java.util.regex.Pattern pattern = java.util.regex.Pattern.compile("\\$\\{([^}]+)\\}");
        java.util.regex.Matcher matcher = pattern.matcher(path);
        StringBuffer result = new StringBuffer();

        while (matcher.find()) {
            String placeholder = matcher.group(1); // 获取花括号内的内容
            String replacement = jsonObject.getString(placeholder);

            if (replacement != null) {
                // 转义特殊字符
                matcher.appendReplacement(result, java.util.regex.Matcher.quoteReplacement(replacement));
            } else {
                // 如果JSON中没有对应的字段，保持原样或使用默认值
                matcher.appendReplacement(result, matcher.group(0));
            }
        }
        matcher.appendTail(result);
        return result.toString();
    }
}
