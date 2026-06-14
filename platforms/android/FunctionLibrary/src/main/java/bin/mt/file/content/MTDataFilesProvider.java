package bin.mt.file.content;

import static android.provider.DocumentsContract.Document.MIME_TYPE_DIR;
import static android.system.OsConstants.S_IFLNK;
import static android.system.OsConstants.S_IFMT;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.pm.ApplicationInfo;
import android.content.pm.ProviderInfo;
import android.database.Cursor;
import android.database.MatrixCursor;
import android.net.Uri;
import android.os.Bundle;
import android.os.CancellationSignal;
import android.os.ParcelFileDescriptor;
import android.provider.DocumentsContract;
import android.provider.DocumentsProvider;
import android.system.ErrnoException;
import android.system.Os;
import android.system.StructStat;
import android.webkit.MimeTypeMap;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.List;
import java.util.Objects;

public class MTDataFilesProvider extends DocumentsProvider {

    private static final String TAG = "MTDataFilesProvider";

    @Override
    public final boolean onCreate() {
        return true;
    }

    private static final String[] DEFAULT_ROOT_PROJECTION = {
            DocumentsContract.Root.COLUMN_ROOT_ID,
            DocumentsContract.Root.COLUMN_MIME_TYPES,
            DocumentsContract.Root.COLUMN_FLAGS,
            DocumentsContract.Root.COLUMN_ICON,
            DocumentsContract.Root.COLUMN_TITLE,
            DocumentsContract.Root.COLUMN_SUMMARY,
            DocumentsContract.Root.COLUMN_DOCUMENT_ID
    };

    // 若未指定具体字段，默认返回文档信息的列
    private static final String[] DEFAULT_DOCUMENT_PROJECTION = {
            DocumentsContract.Document.COLUMN_DOCUMENT_ID,
            DocumentsContract.Document.COLUMN_MIME_TYPE,
            DocumentsContract.Document.COLUMN_DISPLAY_NAME,
            DocumentsContract.Document.COLUMN_LAST_MODIFIED,
            DocumentsContract.Document.COLUMN_FLAGS,
            DocumentsContract.Document.COLUMN_SIZE,
            "mt_extras"
    };

    /**
     * 应用的包名
     */
    private String packageName;
    /**
     * 应用专有目录根目录，例如 /data/data/包名
     */
    private File dataDir;
    /**
     * 类似 {@link #dataDir}
     * 如果privateRootDir路径以/data/user开头，那么就会实例化这个变量，开头换成/data/user_de/
     */
    private File user_deDataDir;
    /**
     * 外部存储目录下的应用专有目录，例如：/storage/emulated/0/Android/data/包名
     */
    private File androidDataDir;
    private File androidObbDir;

    /**
     * 删除文件或文件夹内全部内容。符号链接的话当做文件直接删除
     */
    private static boolean deleteFileOrDirectory(File file) {
        if (file.isDirectory()) {
            boolean isSymlink = false; //符号链接的话当做文件直接删除
            try {
                isSymlink = (Os.lstat(file.getPath()).st_mode & S_IFMT/*8进制0170000*/) == S_IFLNK/*8进制0120000*/; //文件类型是否为符号链接
            } catch (ErrnoException e) {
                e.printStackTrace();
            }

            File[] subFiles = file.listFiles();
            if (!isSymlink && subFiles != null)
                for (File sub : subFiles)
                    if (!deleteFileOrDirectory(sub))
                        return false;
        }
        return file.delete();
    }

    private static String getMimeType(File file) {
        if (file.isDirectory())
            return MIME_TYPE_DIR;

        String name = file.getName();
        int lastDot = name.lastIndexOf('.');
        if (lastDot >= 0) {
            String extension = name.substring(lastDot + 1).toLowerCase();
            String mime = MimeTypeMap.getSingleton().getMimeTypeFromExtension(extension);
            if (mime != null) return mime;
        }
        return "application/octet-stream";
    }

    @SuppressLint("SdCardPath")
    @Override
    public final void attachInfo(Context context, ProviderInfo info) {
        super.attachInfo(context, info);
        this.packageName = context.getPackageName();
        this.dataDir = Objects.requireNonNull(context.getFilesDir().getParentFile());
        String path = dataDir.getPath();
        if (path.startsWith("/data/user/")) {
            this.user_deDataDir = new File("/data/user_de/" + path.substring("/data/user/".length()));
        }
        File externalFilesDir = context.getExternalFilesDir(null);
        if (externalFilesDir != null) {
            this.androidDataDir = externalFilesDir.getParentFile();
        }
        this.androidObbDir = context.getObbDir();
    }

    /**
     * 通过documentId获取对应的File，可能为null
     *
     * @param documentId documentId, 一般是父函数传过来
     * @param z          ？
     * @return 对应文件。可能为null。为null时说明这个是根目录，其documentId为应用包名，其子目录应该是那几个应用专属目录
     */
    private final File getFileForDocId(String documentId, boolean z) throws FileNotFoundException {
        String realPath;
        if (!documentId.startsWith(this.packageName))
            throw new FileNotFoundException(documentId.concat(" not found"));

        //根目录下那几个虚拟文件夹，表示应用专属目录的
        String virtualName = documentId.substring(this.packageName.length());
        if (virtualName.startsWith("/")) {
            virtualName = virtualName.substring(1);
        }
        //如果是根目录自身，直接返回null
        if (virtualName.isEmpty()) {
            return null;
        }
        String[] split = virtualName.split("/", 2);
        virtualName = split[0];
        realPath = split.length > 1 ? split[1] : "";

        File targetFile;
        if (virtualName.equalsIgnoreCase("data")) {
            targetFile = new File(this.dataDir, realPath);
        } else if (virtualName.equalsIgnoreCase("android_data") && this.androidDataDir != null) {
            targetFile = new File(this.androidDataDir, realPath);
        } else if (virtualName.equalsIgnoreCase("android_obb") && this.androidObbDir != null) {
            targetFile = new File(this.androidObbDir, realPath);
        } else if (virtualName.equalsIgnoreCase("user_de_data") && this.user_deDataDir != null) {
            targetFile = new File(this.user_deDataDir, realPath);
        } else
            throw new FileNotFoundException(documentId.concat(" not found"));

        if (z) {
            try {
                Os.lstat(targetFile.getPath());
            } catch (Exception unused) {
                throw new FileNotFoundException(documentId.concat(" not found"));
            }
        }
        return targetFile;
    }

    @Override
    public final Bundle call(String method, String arg, Bundle extras) {
        Bundle call = super.call(method, arg, extras);
        if (call != null)
            return call;

        if (!method.startsWith("mt:"))
            return null;

        Bundle customBundle = new Bundle();
        customBundle.putBoolean("result", false);
        try {
            List<String> pathSegments = ((Uri) extras.getParcelable("uri")).getPathSegments();
            String documentId = pathSegments.size() >= 4 ? pathSegments.get(3) : pathSegments.get(1);
            switch (method) {
                case "mt:setPermissions": { //-1645162251
                    File file = getFileForDocId(documentId, true);
                    if (file != null) {
                        Os.chmod(file.getPath(), extras.getInt("permissions"));
                        customBundle.putBoolean("result", true);
                    }
                    return customBundle;

                }
                case "mt:createSymlink": {
                    File file = getFileForDocId(documentId, false);
                    if (file != null) {
                        Os.symlink(extras.getString("path"), file.getPath());
                        customBundle.putBoolean("result", true);
                    }
                    return customBundle;
                }
                case "mt:setLastModified": {
                    File file = getFileForDocId(documentId, true);
                    if (file != null)
                        customBundle.putBoolean("result", file.setLastModified(extras.getLong("time")));
                    return customBundle;
                }
                default:
                    throw new RuntimeException("Unsupported method: ".concat(method));
            }
        } catch (Exception e) {
            customBundle.putBoolean("result", false);
            customBundle.putString("message", e.toString());
            return customBundle;
        }
    }

    @Override
    public final String createDocument(String parentDocumentId, String mimeType, String displayName) throws FileNotFoundException {
        //父文件id+路径分隔符（可选）+显示名+防冲突序号（可选）
        File parentFile = getFileForDocId(parentDocumentId, true);
        if (parentFile != null) {
            File newFile = new File(parentFile, displayName);
            int noConflictId = 2;
            while (newFile.exists()) {
                newFile = new File(parentFile, displayName + " (" + noConflictId + ")");
                noConflictId++;
            }
            try {
                boolean succeeded = MIME_TYPE_DIR.equals(mimeType)
                        ? newFile.mkdir()
                        : newFile.createNewFile();

                if (succeeded) {
                    return parentDocumentId +
                            (parentDocumentId.endsWith("/") ? "" : "/") +
                            newFile.getName();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        throw new FileNotFoundException("Failed to create document in " + parentDocumentId + " with name " + displayName);
    }

    /**
     * 将文件的表示添加到光标
     *
     * @param result the cursor to modify
     * @param docId  the document ID representing the desired file (不能为null)
     * @param file   the File object representing the desired file (may be null if given docID)
     */
    private void includeFile(MatrixCursor result, String docId, File file) throws FileNotFoundException {
        //v1, 0x1
        if (file == null) {
            file = getFileForDocId(docId, true);
        }
        //是否为普通文件（不是那几个data的链接）
        boolean isNormalFile = false;
        //没有对应docId的文件，就将其id设为包名？在b_getFileForDocId函数里默认全部docId都是以包名开头的，所以这个是根目录？
        if (file == null) {
            Context ctx = getContext();
            String title = ctx == null ? "ctx=null?!" : ctx.getApplicationInfo().loadLabel(getContext().getPackageManager()).toString();

            MatrixCursor.RowBuilder row = result.newRow();
            row.add(DocumentsContract.Document.COLUMN_DOCUMENT_ID, this.packageName);
            row.add(DocumentsContract.Document.COLUMN_DISPLAY_NAME, title); //为啥mt注入的虚拟根目录会正常显示应用名，但代码里用的包名
            row.add(DocumentsContract.Document.COLUMN_SIZE, 0);
            row.add(DocumentsContract.Document.COLUMN_MIME_TYPE, MIME_TYPE_DIR);
            row.add(DocumentsContract.Document.COLUMN_LAST_MODIFIED, 0);
            row.add(DocumentsContract.Document.COLUMN_FLAGS, 0);
            return;
        }

        int flags = 0;
        if (file.isDirectory()) {
            if (file.canWrite())
                flags |= DocumentsContract.Document.FLAG_DIR_SUPPORTS_CREATE;
        } else if (file.canWrite()) {
            flags |= DocumentsContract.Document.FLAG_SUPPORTS_WRITE;
        }

        if (file.getParentFile().canWrite())
            flags |= DocumentsContract.Document.FLAG_SUPPORTS_DELETE;

        String displayName;

        //如果是几个特殊的文件夹
        String path = file.getPath();
        if (path.equals(this.dataDir.getPath())) {
            displayName = "data";
        } else if (androidDataDir != null && path.equals(androidDataDir.getPath())) {
            displayName = "android_data";
        } else if (androidObbDir != null && path.equals(androidObbDir.getPath())) {
            displayName = "android_obb";
        } else if (user_deDataDir != null && path.equals(user_deDataDir.getPath())) {
            displayName = "user_de_data";
        } else {
            displayName = file.getName();
            isNormalFile = true;
        }
        MatrixCursor.RowBuilder row = result.newRow();
        row.add(DocumentsContract.Document.COLUMN_DOCUMENT_ID, docId);
        row.add(DocumentsContract.Document.COLUMN_DISPLAY_NAME, displayName);
        row.add(DocumentsContract.Document.COLUMN_SIZE, file.length());
        row.add(DocumentsContract.Document.COLUMN_MIME_TYPE, getMimeType(file));
        row.add(DocumentsContract.Document.COLUMN_LAST_MODIFIED, file.lastModified());
        row.add(DocumentsContract.Document.COLUMN_FLAGS, flags);
        row.add("mt_path", file.getAbsolutePath());
        if (isNormalFile) {
            try {
                StructStat lstat = Os.lstat(path);
                StringBuilder sb = new StringBuilder()
                        .append(lstat.st_mode)
                        .append("|").append(lstat.st_uid)
                        .append("|").append(lstat.st_gid);
                if ((lstat.st_mode & S_IFMT) == S_IFLNK) {
                    sb.append("|").append(Os.readlink(path));
                }
                row.add("mt_extras", sb.toString());
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    @Override
    public final void deleteDocument(String documentId) throws FileNotFoundException {
        File file = getFileForDocId(documentId, true);
        if (file == null || !deleteFileOrDirectory(file))
            throw new FileNotFoundException("Failed to delete document ".concat(documentId));
    }

    @Override
    public final String getDocumentType(String documentId) throws FileNotFoundException {
        File file = getFileForDocId(documentId, true);
        return file == null ? MIME_TYPE_DIR : getMimeType(file);
    }

    @Override
    public final boolean isChildDocument(String parentDocumentId, String documentId) {
        return documentId.startsWith(parentDocumentId);
    }

    @Override
    public final String moveDocument(String sourceDocumentId, String sourceParentDocumentId, String targetParentDocumentId) throws FileNotFoundException {
        File sourceFile = getFileForDocId(sourceDocumentId, true);
        File targetParentFile = getFileForDocId(targetParentDocumentId, true);
        if (sourceFile != null && targetParentFile != null) {
            File targetFile = new File(targetParentFile, sourceFile.getName());
            if (!targetFile.exists() && sourceFile.renameTo(targetFile)) {
                return targetParentDocumentId
                        + (targetParentDocumentId.endsWith("/") ? "" : "/")
                        + targetFile.getName();
            }
        }
        throw new FileNotFoundException("Failed to move document " + sourceDocumentId + " to " + targetParentDocumentId);
    }

    @Override
    public final ParcelFileDescriptor openDocument(String documentId, String mode, CancellationSignal cancellationSignal) throws FileNotFoundException {
        File file = getFileForDocId(documentId, false);
        if (file != null)
            return ParcelFileDescriptor.open(file, ParcelFileDescriptor.parseMode(mode));
        else
            throw new FileNotFoundException(documentId + " not found");
    }

    @Override
    public final Cursor queryChildDocuments(String parentDocumentId, String[] projection, String sortOrder) throws FileNotFoundException {
        if (parentDocumentId.endsWith("/")) {
            parentDocumentId = parentDocumentId.substring(0, parentDocumentId.length() - 1);
        }
        MatrixCursor cursor = new MatrixCursor(projection != null ? projection : DEFAULT_DOCUMENT_PROJECTION);
        File parent = getFileForDocId(parentDocumentId, true);
        // 如果是虚拟根目录，则显示那几个应用专属目录
        if (parent == null) {
            includeFile(cursor, parentDocumentId.concat("/data"), this.dataDir);

            if (androidDataDir != null && androidDataDir.exists())
                includeFile(cursor, parentDocumentId.concat("/android_data"), this.androidDataDir);

            if (androidObbDir != null && androidObbDir.exists())
                includeFile(cursor, parentDocumentId.concat("/android_obb"), this.androidObbDir);

            if (user_deDataDir != null && user_deDataDir.exists())
                includeFile(cursor, parentDocumentId.concat("/user_de_data"), this.user_deDataDir);
        }
        // 否则正常处理
        else {
            File[] children = parent.listFiles();
            if (children != null)
                for (File child : children)
                    includeFile(cursor, parentDocumentId + "/" + child.getName(), child);
        }
        return cursor;
    }

    @Override
    public final Cursor queryDocument(String documentId, String[] projection) throws FileNotFoundException {
        MatrixCursor result = new MatrixCursor(projection != null ? projection : DEFAULT_DOCUMENT_PROJECTION);
        includeFile(result, documentId, null);
        return result;
    }

    @Override
    public final Cursor queryRoots(String[] projection) {
        ApplicationInfo appInfo = Objects.requireNonNull(getContext()).getApplicationInfo();
        // 虚拟根目录的标题 从ApplicationInfo获取label
        String title = appInfo.loadLabel(getContext().getPackageManager()).toString();

        MatrixCursor result = new MatrixCursor(projection != null ? projection : DEFAULT_ROOT_PROJECTION);
        MatrixCursor.RowBuilder row = result.newRow();
        row.add(DocumentsContract.Root.COLUMN_ROOT_ID, this.packageName);
        row.add(DocumentsContract.Root.COLUMN_DOCUMENT_ID, this.packageName);
        row.add(DocumentsContract.Root.COLUMN_SUMMARY, this.packageName);
        row.add(DocumentsContract.Root.COLUMN_FLAGS, DocumentsContract.Root.FLAG_SUPPORTS_CREATE | DocumentsContract.Root.FLAG_SUPPORTS_IS_CHILD);
        row.add(DocumentsContract.Root.COLUMN_TITLE, title);
        row.add(DocumentsContract.Root.COLUMN_MIME_TYPES, "*/*");
        row.add(DocumentsContract.Root.COLUMN_ICON, appInfo.icon);
        return result;
    }

    /**
     * 比 {@link #deleteDocument(String)} 多了一个 父docId。如果此文件存在多个父文件，则比较有用。
     */
    @Override
    public final void removeDocument(String documentId, String parentDocumentId) throws FileNotFoundException {
        deleteDocument(documentId);
    }

    @Override
    public final String renameDocument(String documentId, String displayName) throws FileNotFoundException {
        File b = getFileForDocId(documentId, true);
        if (b == null || !b.renameTo(new File(b.getParentFile(), displayName))) {
            throw new FileNotFoundException("Failed to rename document " + documentId + " to " + displayName);
        }
        int parentIdx = documentId.lastIndexOf('/', documentId.length() - 2);//因为最后一个字符可能是分隔符，所以从倒数第二个开始找，确保分隔出旧文件名
        return documentId.substring(0, parentIdx) + "/" + displayName;
    }
}