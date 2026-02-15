package com.widget.noname.util;

import android.content.Context;
import android.content.Intent;
import android.content.UriPermission;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.provider.DocumentsContract;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.documentfile.provider.DocumentFile;

import com.tencent.mmkv.MMKV;
import com.widget.noname.common.util.FileConstant;

import java.io.File;

/**
 * 纯工具类：只提供 SAF 相关方法，不管理路径存储
 */
public class StorageHelper {
    private static final String TAG = "StorageHelper";

    // todo: 优化这个
    public static String getExpectedDocumentId(String str) {
        String externalStorage = Environment.getExternalStorageDirectory().getAbsolutePath() + "/";
        return "primary:" + str.replace(externalStorage, "");
    }
    /**
     * 从 TreeUri 中提取 documentId（如 primary:Download/QQ）
     */
    @Nullable
    public static String getDocumentIdFromTreeUri(Uri treeUri) {
        if (treeUri == null || !DocumentsContract.isTreeUri(treeUri)) return null;

        try {
            // ✅ 使用系统 API，最安全
            return DocumentsContract.getTreeDocumentId(treeUri);
        } catch (Exception e) {
            String path = treeUri.getLastPathSegment();
            if (path == null) return null;

            // 直接检查是否以 "tree/" 开头
            if (path.startsWith("tree/")) {
                String encodedDocumentId = path.substring(5); // 去掉 "tree/"
                return Uri.decode(encodedDocumentId); // 解码 → primary:Download/QQ
            }

            // 某些设备可能格式不同（极少见）
            int lastSlash = path.lastIndexOf('/');
            if (lastSlash != -1) {
                String encodedDocumentId = path.substring(lastSlash + 1);
                return Uri.decode(encodedDocumentId);
            }

            return null;
        }
    }

    /**
     * 根据 key 获取推荐的初始 URI（支持 file:// 和 content://）
     */
    public static Uri getInitialUri(Context context, String key) {
        String mmkvKey = FileConstant.IMPORT_PATH + key;
        String savedUriString = MMKV.defaultMMKV().getString(mmkvKey, null);

        // 1. 如果之前通过 SAF 选择过，且保存的是 content:// URI
        if (savedUriString != null && savedUriString.startsWith("content://")) {
            Uri uri = Uri.parse(savedUriString);

            // 检查是否是 TreeUri 且已有持久化权限
            if (DocumentsContract.isTreeUri(uri) && hasPersistablePermission(context, uri)) {
                return uri;
            }
        }

        // 2. 如果是 file:// 路径
        if (savedUriString != null && savedUriString.startsWith("/")) {
            return buildLegacyUri("primary%3A" + savedUriString.replace("/storage/emulated/0", "").replaceAll("/", "%2F"));
        }

        // 3. 如果没有，返回 Download 目录（最接近目标）
        return buildLegacyUri("primary%3ADownload");
    }

    /**
     * 检查是否已有持久化读写权限
     */
    public static boolean hasPersistablePermission(Context context, Uri uri) {
        for (UriPermission perm : context.getContentResolver().getPersistedUriPermissions()) {
            if (perm.getUri().equals(uri) && perm.isReadPermission() && perm.isWritePermission()) {
                return true;
            }
        }
        return false;
    }

    /**
     * 手动构造 ExternalStorage Tree Uri（兼容旧版本）
     */
    public static Uri buildLegacyUri(String documentId) {
        return Uri.parse("content://com.android.externalstorage.documents/tree/" + documentId);
    }

    /**
     * 启动 SAF 选择目录
     */
    public static void openDocumentTree(@NonNull Context context, int requestCode) {
        Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT_TREE);
        Uri initialUri = DocumentsContract.buildTreeDocumentUri(
                "com.android.externalstorage.documents", "primary:Download"
        );
        intent.putExtra(DocumentsContract.EXTRA_INITIAL_URI, initialUri);
        ((android.app.Activity) context).startActivityForResult(intent, requestCode);
    }

    /**
     * 根据 MMKV 中存储的路径字符串，返回对应的 File 或 DocumentFile 对象
     * @param context 上下文
     * @param pathStr MMKV 中存储的路径（可能是 file:/// 或 content:// 或 纯路径字符串）
     * @return File 或 DocumentFile，或 null
     */
    @Nullable
    public static Object parsePath(@NonNull Context context, @Nullable String pathStr) {
        if (pathStr == null || pathStr.isEmpty()) return null;

        // 高版本 + SAF 路径（content://）
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R && pathStr.startsWith("content://")) {
            Uri uri = Uri.parse(pathStr);
            // 不进行持久化权限
            DocumentFile docFile = DocumentFile.fromTreeUri(context, uri);
            if (docFile != null && docFile.exists() && docFile.isDirectory()) {
                return docFile;
            }
            return null;
        }

        // 低版本或传统路径
        if (pathStr.startsWith("file://")) {
            pathStr = Uri.parse(pathStr).getPath();
        }

        File file = new File(pathStr);
        return file.exists() && file.isDirectory() ? file : null;
    }

    /**
     * 列出目录中的文件（支持 File 和 DocumentFile）
     */
    @NonNull
    public static Object[] listFiles(@NonNull Context context, @Nullable Object dirObj) {
        if (dirObj == null) return new Object[0];

        if (dirObj instanceof DocumentFile) {
            DocumentFile dir = (DocumentFile) dirObj;
            return dir.listFiles();
        } else if (dirObj instanceof File) {
            File dir = (File) dirObj;
            File[] files = dir.listFiles();
            return files != null ? files : new File[0];
        }
        return new Object[0];
    }

    /**
     * 获取持久化权限（用于 SAF）
     */
    public static void takePersistableUriPermission(@NonNull Context context, @NonNull Uri uri) {
        try {
            final int flags = Intent.FLAG_GRANT_READ_URI_PERMISSION |
                    Intent.FLAG_GRANT_WRITE_URI_PERMISSION;
            context.getContentResolver().takePersistableUriPermission(uri, flags);
        } catch (SecurityException e) {
            Log.w(TAG, "SecurityException: " + uri.toString());
            e.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * 确保URI是Tree URI格式（如果是Document URI则转换为Tree URI）
     * @param uri 可能是Tree URI或Document URI
     * @return Tree URI格式的URI
     */
    @Nullable
    public static Uri ensureTreeUri(Uri uri) {
        if (uri == null) return null;

        // 如果已经是Tree URI，直接返回
        if (DocumentsContract.isTreeUri(uri)) {
            return uri;
        }

        try {
            // 尝试获取documentId并转换为Tree URI
            String documentId = DocumentsContract.getDocumentId(uri);
            return DocumentsContract.buildTreeDocumentUri(uri.getAuthority(), documentId);
        } catch (Exception e) {
            Log.w(TAG, "Cannot convert to tree URI: " + uri.toString(), e);
            return null;
        }
    }

    /**
     * 判断两个 Uri 是否指向同一个文档（目录或文件）
     */
    public static boolean isSameDocument(Uri uri1, Uri uri2) {
        if (uri1 == null || uri2 == null) return false;
        try {
            return getStandardDocumentId(uri1).equals(getStandardDocumentId(uri2));
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    /**
     * 判断一个 Document URI 是否属于某个 Tree URI
     */
    public static boolean isDocumentInTree(Uri documentUri, Uri treeUri) {
        try {
            String docId = getStandardDocumentId(documentUri);
            String treeDocId = getStandardDocumentId(treeUri);
            return docId.equals(treeDocId);
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    /**
     * 将任意 SAF URI 转换为标准的 documentId（用于比较）
     */
    public static String getStandardDocumentId(Uri uri) {
        try {
            return DocumentsContract.getDocumentId(uri);
        } catch (Exception e) {
            // 如果是 tree uri，尝试获取 treeDocumentId
            if (DocumentsContract.isTreeUri(uri)) {
                return DocumentsContract.getTreeDocumentId(uri);
            }
            return null;
        }
    }
}
