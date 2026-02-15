package org.apache.cordova.webviewfilesystemloader;

import android.annotation.SuppressLint;
import android.content.res.AssetManager;
import android.os.Environment;
import android.util.Log;
import android.webkit.MimeTypeMap;
import android.webkit.WebResourceResponse;

import androidx.webkit.WebViewAssetLoader;

import com.widget.noname.Settings;

import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaPluginPathHandler;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.text.DateFormat;
import java.text.DateFormatSymbols;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

public class WebViewFileSystemLoader extends CordovaPlugin {

    private static String prefix = "";
    private static boolean loadAssets = true;
    private static boolean inDocuments = false;

    public CordovaPluginPathHandler getPathHandler() {
        AssetManager assetManager =  cordova.getContext().getAssets();

        WebViewAssetLoader.PathHandler pathHandler = path -> {
            try {
                if (path.isEmpty()) {
                    path = "index.html";
                }
                // Log.e("WebviewFilesystemLoader", path);
                // 使其在Asset文件夹中找不到文件时自动读取一次外部存储文件
                // 兼容模式
                boolean CompatibilityMode = Settings.getCompatibilityMode();
                InputStream is = null;

                String[] split = ("www/" + path).split("/");
                String[] newSplit = Arrays.copyOfRange(split, 0, split.length - 1);
                List<String> list = Arrays.asList(assetManager.list(String.join("/", newSplit)));

                String[] split2 = ("compatibility/" + path).split("/");
                String[] newSplit2 = Arrays.copyOfRange(split2, 0, split2.length - 1);
                List<String> list2 = Arrays.asList(assetManager.list(String.join("/", newSplit2)));

                Long lastModified = null;
                if (isLoadAssets()) {
                    if (list.contains(split[split.length - 1])) {
                        is = assetManager.open("www/" + path, AssetManager.ACCESS_STREAMING);
                    }
                    else if (CompatibilityMode && list2.contains(split2[split2.length - 1])) {
                        is = assetManager.open("compatibility/" + path, AssetManager.ACCESS_STREAMING);
                    }
                }
                if (is == null) {
                    File file;
                    if (inDocuments) {
                        // sd为null会报错返回
                        File sd = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOCUMENTS);
                        File noname = new File(sd.getAbsoluteFile() + "/noname");
                        file = new File(noname, prefix + path);
                    }
                    else {
                        file = new File(
                                webView.getContext().getExternalFilesDir(null).getParentFile(),
                                prefix + path
                        );
                    }
                    // Log.e("WebviewFilesystemLoader", file.getAbsolutePath());
                    if (!file.exists()) {
                        return notFoundResponse();
                    }
                    lastModified = file.lastModified();
                    is = new FileInputStream(file);
                }
                String mimeType = "text/html";
                String extension = MimeTypeMap.getFileExtensionFromUrl(path);
                if (extension != null) {
                    if (path.endsWith(".js") || path.endsWith(".mjs")) {
                        // Make sure JS files get the proper mimetype to support ES modules
                        mimeType = "application/javascript";
                    } else if (path.endsWith(".wasm")) {
                        mimeType = "application/wasm";
                    } else {
                        mimeType = MimeTypeMap.getSingleton().getMimeTypeFromExtension(extension);
                    }
                }

                WebResourceResponse response = new WebResourceResponse(mimeType, null, is);
                if (lastModified != null) {
                    Locale aLocale = Locale.US;
                    @SuppressLint("SimpleDateFormat")
                    DateFormat fmt = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss", new DateFormatSymbols(aLocale));
                    Map<String, String> headers = new HashMap<>();
                    headers.put("last-modified", fmt.format(new Date(lastModified)));
                    if (response.getResponseHeaders() != null) {
                        headers.putAll(response.getResponseHeaders());
                    }
                    response.setResponseHeaders(headers);
                }
                return response;
            } catch (Exception e) {
                return null;
            }
        };

        return new CordovaPluginPathHandler(pathHandler);
    }

    private WebResourceResponse notFoundResponse() {
        return new WebResourceResponse(null, null, null);
    }

    public static String getPrefix() {
        return prefix;
    }

    public static void setPrefix(String prefix) {
        WebViewFileSystemLoader.prefix = prefix;
    }



    public static boolean isLoadAssets() {
        return loadAssets;
    }

    public static void setLoadAssets(boolean loadAssets) {
        WebViewFileSystemLoader.loadAssets = loadAssets;
    }



    public static boolean isInDocuments() {
        return inDocuments;
    }

    public static void setInDocuments(boolean inDocuments) {
        WebViewFileSystemLoader.inDocuments = inDocuments;
    }
}