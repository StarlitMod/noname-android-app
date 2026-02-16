package com.widget.noname.util;

import static com.kongzue.dialogx.dialogs.PopTip.tip;

import android.Manifest;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Build;
import android.text.TextUtils;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.NotificationManagerCompat;
import androidx.core.content.ContextCompat;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONException;
import com.alibaba.fastjson.JSONObject;
import com.kongzue.dialogx.dialogs.MessageDialog;
import com.permissionx.guolindev.PermissionX;
import com.permissionx.guolindev.callback.ExplainReasonCallback;
import com.permissionx.guolindev.callback.ForwardToSettingsCallback;
import com.permissionx.guolindev.callback.RequestCallback;
import com.permissionx.guolindev.request.ExplainScope;
import com.permissionx.guolindev.request.ForwardScope;
import com.tencent.mmkv.MMKV;
import com.widget.noname.Settings;
import com.widget.noname.function.functionlibrary.R;
import com.widget.noname.okhttp.DownloadService;
import com.widget.noname.okhttp.DownloadStatusManager;
import com.widget.noname.okhttp.HostsDns;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.concurrent.TimeUnit;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.Headers;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

public class GitHubUtil {

    public static void init(Context context) {
        GitHubUtil.context = context;
    }

    public static Context context;
    private static final String TAG = "GitHubUtil";
    private static final String MMKV_ID = "noname_github_prefs";
    private static final String KEY_AUTH_TOKEN = "noname_authorization";
    private static final MMKV mmkv = MMKV.mmkvWithID(MMKV_ID, MMKV.SINGLE_PROCESS_MODE);
    private static final OkHttpClient client = new OkHttpClient.Builder()
            .connectTimeout(60, TimeUnit.SECONDS)
            .readTimeout(60, TimeUnit.SECONDS)
            .dns(new HostsDns())
            .build();
    private static final OkHttpClient vpnClient = new OkHttpClient.Builder()
            .connectTimeout(60, TimeUnit.SECONDS)
            .readTimeout(60, TimeUnit.SECONDS)
            .build();

    // ==================== Token 管理 (使用 MMKV) ====================

    public static String getAuthToken() {
        return mmkv.decodeString(KEY_AUTH_TOKEN, null);
    }

    public static void setAuthToken(String token) {
        if (token == null || token.isEmpty()) {
            mmkv.remove(KEY_AUTH_TOKEN);
        } else {
            mmkv.encode(KEY_AUTH_TOKEN, token);
        }
    }

    public static void clearAuthToken() {
        mmkv.remove(KEY_AUTH_TOKEN);
    }

    // ==================== 构建请求头 ====================

    private static Headers buildHeaders(@Nullable String accessToken) {
        okhttp3.Headers.Builder builder = new okhttp3.Headers.Builder()
                .add("Accept", "application/vnd.github.v3+json");

        String token = accessToken != null ? accessToken : getAuthToken();
        if (token != null && !token.isEmpty()) {
            builder.add("Authorization", "token " + token);
        }
        return builder.build();
    }

    // ==================== 处理 Rate Limit ====================

    private static void handleRateLimit(Response response) {
        Headers headers = response.headers();
        String limit = headers.get("X-RateLimit-Limit");
        String remaining = headers.get("X-RateLimit-Remaining");
        String reset = headers.get("X-RateLimit-Reset");

        Log.d(TAG, "RateLimit - Limit: " + limit + ", Remaining: " + remaining + ", Reset: " + reset);
        if (reset != null) {
            try {
                long timestampSeconds = Long.parseLong(reset);
                Date date = new Date(timestampSeconds * 1000); // 转为毫秒
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.getDefault());
                String readableDate = sdf.format(date);
                Log.d("RateLimit", "Reset at: " + readableDate);
            } catch (NumberFormatException e) {
                Log.e("RateLimit", "Invalid X-RateLimit-Reset value: " + reset, e);
            }
        }

        if (remaining != null && "0".equals(remaining)) {
            try {
                long resetTime = Long.parseLong(reset) * 1000;
                String timeStr = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.getDefault()).format(new Date(resetTime));
                tip("达到每小时" + limit + "次限制，将在 " + timeStr + " 重置");
            } catch (NumberFormatException ignored) {}
        }

        if (response.code() == 401) {
            clearAuthToken();
            tip("GitHub Token 无效，请重新设置");
        }
    }

    // ==================== 格式化文件大小 ====================

    public static String formatFileSize(long size) {
        if (size < 1024) {
            return size + " B";
        } else if (size < 1024 * 1024) {
            return String.format(Locale.getDefault(), "%.2f KB", size / 1024.0);
        } else if (size < 1024 * 1024 * 1024) {
            return String.format(Locale.getDefault(), "%.2f MB", size / (1024.0 * 1024));
        } else {
            return String.format(Locale.getDefault(), "%.2f GB", size / (1024.0 * 1024 * 1024));
        }
    }

    // ==================== 版本号比较 ====================

    public static int compareVersion(String ver1, String ver2) {
        if (ver1.startsWith("v")) ver1 = ver1.substring(1);
        if (ver2.startsWith("v")) ver2 = ver2.substring(1);

        String[] parts1 = ver1.split("[.-]");
        String[] parts2 = ver2.split("[.-]");

        int len = Math.max(parts1.length, parts2.length);
        for (int i = 0; i < len; i++) {
            int v1 = i < parts1.length ? parsePart(parts1[i]) : 0;
            int v2 = i < parts2.length ? parsePart(parts2[i]) : 0;
            if (v1 > v2) return 1;
            if (v1 < v2) return -1;
        }
        return 0;
    }

    private static int parsePart(String part) {
        try {
            return Integer.parseInt(part);
        } catch (NumberFormatException e) {
            return 0;
        }
    }

    // ==================== 获取 Tags ====================

    public static void getRepoTags(String username, String repo, @Nullable String accessToken,
                            CallbackWrapper<List<Tag>> callback) {
        String url = "https://api.github.com/repos/" + username + "/" + repo + "/tags";
        Request request = new Request.Builder()
                .url(url)
                .headers(buildHeaders(accessToken))
                .build();

        boolean isVpnConnected = VPNDetectionHelper.isVPNConnected(context);
        OkHttpClient client = isVpnConnected ? vpnClient : GitHubUtil.client;

        client.newCall(request).enqueue(new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                callback.onFailure(e);
            }

            @Override
            public void onResponse(Call call, Response response) throws IOException {
                handleRateLimit(response);
                if (!response.isSuccessful()) {
                    callback.onFailure(new IOException("HTTP " + response.code()));
                    return;
                }

                try {
                    JSONArray array = JSONObject.parseArray(response.body().string());
                    List<Tag> tags = new ArrayList<>();
                    for (int i = 0; i < array.size(); i++) {
                        JSONObject obj = array.getJSONObject(i);
                        Tag tag = new Tag();
                        tag.name = obj.getString("name");
                        tag.zipball_url = obj.getString("zipball_url");
                        tag.tarball_url = obj.getString("tarball_url");
                        JSONObject commit = obj.getJSONObject("commit");
                        tag.commitSha = commit.getString("sha");
                        tags.add(tag);
                    }
                    callback.onSuccess(tags);
                } catch (Exception e) {
                    callback.onFailure(e);
                }
            }
        });
    }

    /**
     * 获取 GitHub 仓库的最新 Release 版本号（即 latest release 的 tag_name）
     *
     * @param username     仓库所有者
     * @param repo         仓库名
     * @param accessToken  可选的 GitHub Token（用于提高 API 限制），若为 null 则使用 MMKV 中存储的 token
     * @param callback     回调：成功时返回版本字符串（如 "v1.2.3"），失败时返回异常
     */
    public static void getLatestVersionFromGitHub(String username, String repo, @Nullable String accessToken,
                                           CallbackWrapper<GitHubRelease> callback) {
        String url = "https://api.github.com/repos/" + username + "/" + repo + "/releases/latest";
        Request request = new Request.Builder()
                .url(url)
                .headers(buildHeaders(accessToken))
                .build();

        boolean isVpnConnected = VPNDetectionHelper.isVPNConnected(context);
        OkHttpClient client = isVpnConnected ? vpnClient : GitHubUtil.client;

        client.newCall(request).enqueue(new Callback() {
            @Override
            public void onFailure(@NonNull Call call, @NonNull IOException e) {
                callback.onFailure(e);
            }

            @Override
            public void onResponse(@NonNull Call call, @NonNull Response response) throws IOException {
                handleRateLimit(response);

                if (response.code() == 404) {
                    // 没有发布任何 release
                    callback.onFailure(new IOException("No releases found for this repository."));
                    return;
                }

                if (!response.isSuccessful()) {
                    callback.onFailure(new IOException("HTTP " + response.code() + ": " + response.message()));
                    return;
                }

                try {
                    GitHubRelease release = JSONObject.parseObject(response.body().string(), GitHubRelease.class);
                    callback.onSuccess(release);
                } catch (Exception e) {
                    callback.onFailure(new IOException("Failed to parse release version", e));
                }
            }
        });
    }

    // ==================== 获取 Release 描述 ====================

    public static void getRepoTagDescription(String tagName, String username, String repo,
                                      @Nullable String accessToken,
                                      CallbackWrapper<Release> callback) {
        String url = "https://api.github.com/repos/" + username + "/" + repo + "/releases/tags/" + tagName;
        Request request = new Request.Builder()
                .url(url)
                .headers(buildHeaders(accessToken))
                .build();

        boolean isVpnConnected = VPNDetectionHelper.isVPNConnected(context);
        OkHttpClient client = isVpnConnected ? vpnClient : GitHubUtil.client;

        client.newCall(request).enqueue(new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                callback.onFailure(e);
            }

            @Override
            public void onResponse(Call call, Response response) throws IOException {
                handleRateLimit(response);
                if (!response.isSuccessful()) {
                    callback.onFailure(new IOException("HTTP " + response.code()));
                    return;
                }

                JSONObject json = JSONObject.parseObject(response.body().string());
                Release release = new Release();
                release.name = json.getString("name");
                release.body = json.getString("body");
                release.html_url = json.getString("html_url");
                release.published_at = new Date(json.getLong("published_at") * 1000);

                JSONObject author = json.getJSONObject("author");
                release.authorLogin = author.getString("login");
                release.authorAvatarUrl = author.getString("avatar_url");
                release.authorHtmlUrl = author.getString("html_url");

                JSONArray assetsArray = json.getJSONArray("assets");
                List<Asset> assets = new ArrayList<>();
                for (int i = 0; i < assetsArray.size(); i++) {
                    JSONObject assetObj = assetsArray.getJSONObject(i);
                    Asset asset = new Asset();
                    asset.name = assetObj.getString("name");
                    asset.browser_download_url = assetObj.getString("browser_download_url");
                    asset.content_type = assetObj.getString("content_type");
                    asset.size = assetObj.getLong("size");
                    assets.add(asset);
                }
                release.assets = assets;
                release.zipball_url = json.getString("zipball_url");

                callback.onSuccess(release);
            }
        });
    }

    // ==================== 获取目录文件列表 ====================

    public static void getRepoFilesList(String path, String branch, String username, String repo,
                                 @Nullable String accessToken,
                                 CallbackWrapper<List<RepoFile>> callback) {
        String baseUrl = "https://api.github.com/repos/" + username + "/" + repo + "/contents/" + path;
        String url = baseUrl;
        if (branch != null && !branch.isEmpty()) {
            url = baseUrl + "?ref=" + branch;
        }

        Request request = new Request.Builder()
                .url(url)
                .headers(buildHeaders(accessToken))
                .build();

        boolean isVpnConnected = VPNDetectionHelper.isVPNConnected(context);
        OkHttpClient client = isVpnConnected ? vpnClient : GitHubUtil.client;

        client.newCall(request).enqueue(new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                callback.onFailure(e);
            }

            @Override
            public void onResponse(Call call, Response response) throws IOException {
                handleRateLimit(response);
                if (!response.isSuccessful()) {
                    callback.onFailure(new IOException("HTTP " + response.code()));
                    return;
                }
                try {
                    JSONArray array =  JSONArray.parseArray(response.body().string());
                    List<RepoFile> files = new ArrayList<>();
                    for (int i = 0; i < array.size(); i++) {
                        JSONObject obj = array.getJSONObject(i);
                        RepoFile file = new RepoFile();
                        file.name = obj.getString("name");
                        file.path = obj.getString("path");
                        file.type = obj.getString("type"); // "file" or "dir"
                        file.download_url = obj.getString("download_url");
                        file.size = obj.getLong("size");
                        file.sha = obj.getString("sha");
                        files.add(file);
                    }
                    callback.onSuccess(files);
                } catch (JSONException e) {
                    e.printStackTrace();
                    callback.onFailure(e);
                }
            }
        });
    }

    // ==================== 下载文件（带进度） ====================
    public static void downloadFile(String url, File outputFile, DownloadFileListener listener) {
        String acceleration = Settings.getGithubDownloadAcceleration();
        url = acceleration + url;
        final String finalUrl = url;

        // 设置观察者
        DownloadStatusManager.getInstance().downloadEvent.observe((AppCompatActivity) context, event -> {
            if (event.type == DownloadStatusManager.DownloadEvent.Type.SUCCESS) {
                listener.onSuccess(new File(event.data));
            } else if (event.type == DownloadStatusManager.DownloadEvent.Type.FAILURE) {
                listener.onFailure(new Exception(event.data));
            } else if (event.type == DownloadStatusManager.DownloadEvent.Type.PROGRESS) {
                try {
                    String[] parts = event.data.split(",");
                    if (parts.length != 2) {
                        throw new IllegalArgumentException("Expected exactly two numbers separated by comma");
                    }
                    long first = Long.parseLong(parts[0].trim());
                    long second = Long.parseLong(parts[1].trim());
                    listener.onProgress(first, second);
                } catch (NumberFormatException e) {
                    Log.e("ParseError", "Invalid number format in: " + event.data, e);
                } catch (IllegalArgumentException e) {
                    Log.e("ParseError", "Invalid data format: " + event.data, e);
                }
            }
        });

        // 判断 Android 版本，只有 Android 13 (API 33) 及以上才需要动态请求通知权限
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            // 检查是否已经有权限
            if (NotificationUtil.canSendNotifications(context, DownloadService.CHANNEL_ID)) {
                DownloadService.start(context, finalUrl, outputFile.getAbsolutePath());
            } else {
                // 需要请求权限
                PermissionX.init((AppCompatActivity) context)
                        .permissions(Manifest.permission.POST_NOTIFICATIONS)
                        .onExplainRequestReason(new ExplainReasonCallback() {
                            @Override
                            public void onExplainReason(@NonNull ExplainScope scope, @NonNull List<String> deniedList) {
                                String message = context.getString(R.string.permission_notification_required);
                                scope.showRequestReasonDialog(deniedList, message, context.getString(R.string.permission_action_agree), context.getString(R.string.permission_action_disagree));
                            }
                        })
                        .onForwardToSettings(new ForwardToSettingsCallback() {
                            @Override
                            public void onForwardToSettings(@NonNull ForwardScope scope, @NonNull List<String> deniedList) {
                                String message = context.getString(R.string.permission_notification_forward_to_settings);
                                scope.showForwardToSettingsDialog(deniedList, message, context.getString(R.string.permission_action_to_settings), context.getString(android.R.string.cancel));
                            }
                        })
                        .request(new RequestCallback() {
                            @Override
                            public void onResult(boolean allGranted, @NonNull List<String> grantedList, @NonNull List<String> deniedList) {
                                // 无论是否授予权限，都开始下载（只是可能无法显示通知）
                                DownloadService.start(context, finalUrl, outputFile.getAbsolutePath());
                                // 跳转渠道授权
                                if (!NotificationUtil.isNotificationChannelEnabled(context, DownloadService.CHANNEL_ID)){
                                    NotificationUtil.openNotificationChannelSettings(context, DownloadService.CHANNEL_ID);
                                }
                            }
                        });
            }
        } else {
            // Android 13 以下版本不需要动态请求通知权限
            DownloadService.start(context, finalUrl, outputFile.getAbsolutePath());
            // 但还是提示跳转
            if (!NotificationUtil.canSendNotifications(context, DownloadService.CHANNEL_ID)) {
                NotificationUtil.openNotificationChannelSettings(context, DownloadService.CHANNEL_ID);
            }
        }
    }

    public static String[] parseGitHubRawUrl(String url) {
        // 移除末尾斜杠（如果有的话）
        if (url.endsWith("/")) {
            url = url.substring(0, url.length() - 1);
        }

        // 检查是否是 raw.githubusercontent.com
        if (!url.startsWith("https://raw.githubusercontent.com/")) {
            throw new IllegalArgumentException("Not a valid GitHub raw URL");
        }

        // 提取路径部分：去掉 "https://raw.githubusercontent.com/"
        String path = url.substring("https://raw.githubusercontent.com/".length());

        // 按 '/' 分割
        String[] parts = path.split("/");

        if (parts.length < 3) {
            throw new IllegalArgumentException("URL too short to contain username, repo, and branch");
        }

        String username = parts[0];
        String repo = parts[1];
        String branch = parts[2];

        return new String[]{username, repo, branch};
    }

    public static String buildGitHubUrl(String username, String repo) {
        if (TextUtils.isEmpty(username) || TextUtils.isEmpty(repo)) {
            throw new IllegalArgumentException("Repository and branch cannot be empty");
        }

        return "https://github.com/" + username + "/" + repo;
    }

    public static String buildGitHubUrl(String username, String repo, String branch) {
        if (TextUtils.isEmpty(username) || TextUtils.isEmpty(repo) || TextUtils.isEmpty(branch)) {
            throw new IllegalArgumentException("Repository and branch cannot be empty");
        }

        return "https://github.com/" + username + "/" + repo + "/tree/" + branch;
    }

    public static String buildGitHubRawUrl(String username, String repo) {
        if (TextUtils.isEmpty(username) || TextUtils.isEmpty(repo)) {
            throw new IllegalArgumentException("Repository and branch cannot be empty");
        }

        return "https://raw.githubusercontent.com/" + username + "/" + repo;
    }

    public static String buildGitHubRawUrl(String username, String repo, String branch) {
        if (TextUtils.isEmpty(username) || TextUtils.isEmpty(repo) || TextUtils.isEmpty(branch)) {
            throw new IllegalArgumentException("Repository and branch cannot be empty");
        }

        return "https://raw.githubusercontent.com/" + username + "/" + repo + "/" + branch;
    }

    // 新的回调接口
    public interface DownloadFileListener {
        void onProgress(long received, long total);
        void onSuccess(File file);
        void onFailure(Exception e);
    }


    // ==================== 数据类 ====================

    public static class Tag {
        public String name;
        public String zipball_url;
        public String tarball_url;
        public String commitSha;
    }

    public static class Release {
        public String name;
        public String body;
        public String html_url;
        public Date published_at;
        public String authorLogin;
        public String authorAvatarUrl;
        public String authorHtmlUrl;
        public List<Asset> assets;
        public String zipball_url;
    }

    public static class Asset {
        public String name;
        public String browser_download_url;
        public String content_type;
        public long size;
    }

    public static class RepoFile {
        public String name;
        public String path;
        /**
         * "file" or "dir"
         */
        public String type;
        public String download_url;
        public long size;
        public String sha;
    }

    // ==================== 回调接口 ====================

    public interface CallbackWrapper<T> {
        void onSuccess(T result);
        void onFailure(Exception e);
    }

    public static class GitHubRelease {
        public String url;
        public String assets_url;
        public String upload_url;
        public String html_url;
        public long id;
        public String tag_name;
        public String name;
        public boolean draft;
        public boolean prerelease;
        public String created_at;
        public String published_at;
        public String body;

        public Author author;
        public List<Asset> assets;
        public String tarball_url;
        public String zipball_url;

        public static class Author {
            public String login;
            public long id;
            public String avatar_url;
            public String html_url;
        }

        public static class Asset {
            public long id;
            public String name;
            public String content_type;
            public long size;
            public int download_count;
            public String browser_download_url;
        }
    }
}