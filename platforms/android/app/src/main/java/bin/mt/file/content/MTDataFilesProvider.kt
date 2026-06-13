package bin.mt.file.content

import android.content.Context
import android.content.pm.ProviderInfo
import android.database.Cursor
import android.database.MatrixCursor
import android.net.Uri
import android.os.Bundle
import android.os.CancellationSignal
import android.os.ParcelFileDescriptor
import android.provider.DocumentsProvider
import android.provider.DocumentsContract.Document
import android.provider.DocumentsContract.Root
import android.system.ErrnoException
import android.system.Os
import android.system.OsConstants
import android.webkit.MimeTypeMap
import com.widget.noname.BuildConfig
import java.io.File
import java.io.FileNotFoundException
import java.io.IOException

/**
 * MT文件提供者 - 提供对应用数据目录的文档访问
 * 支持访问内部存储、外部存储、OBB目录等
 */
class MTDataFilesProvider : DocumentsProvider() {

    companion object {
        // Root文档的列名
        private val DEFAULT_ROOT_PROJECTION = arrayOf(
            Root.COLUMN_ROOT_ID,
            Root.COLUMN_MIME_TYPES,
            Root.COLUMN_FLAGS,
            Root.COLUMN_ICON,
            Root.COLUMN_TITLE,
            Root.COLUMN_SUMMARY,
            Root.COLUMN_DOCUMENT_ID
        )

        // 文档的列名
        private val DEFAULT_DOCUMENT_PROJECTION = arrayOf(
            Document.COLUMN_DOCUMENT_ID,
            Document.COLUMN_MIME_TYPE,
            Document.COLUMN_DISPLAY_NAME,
            Document.COLUMN_LAST_MODIFIED,
            Document.COLUMN_FLAGS,
            Document.COLUMN_SIZE,
            "mt_extras"  // 自定义列，存储权限等额外信息
        )

        private const val MIME_TYPE_DIRECTORY = "vnd.android.document/directory"
        private const val MIME_TYPE_DEFAULT = "application/octet-stream"

        // 自定义方法名
        private const val METHOD_SET_LAST_MODIFIED = "mt:setLastModified"
        private const val METHOD_SET_PERMISSIONS = "mt:setPermissions"
        private const val METHOD_CREATE_SYMLINK = "mt:createSymlink"

        // 符号链接掩码
        private const val S_IFLNK = 40960  // 0xA000 符号链接标识

        /**
         * 递归删除文件或目录
         * @param file 要删除的文件或目录
         * @return 是否删除成功
         */
        private fun deleteRecursively(file: File): Boolean {
            if (file.isDirectory) {
                // 检查是否为符号链接
                var isSymlink = false
                try {
                    val stat = Os.lstat(file.path)
                    isSymlink = (stat.st_mode and OsConstants.S_IFMT) == S_IFLNK
                } catch (e: ErrnoException) {
                    e.printStackTrace()
                }

                // 如果不是符号链接，递归删除子文件
                if (!isSymlink) {
                    file.listFiles()?.forEach { child ->
                        if (!deleteRecursively(child)) {
                            return false
                        }
                    }
                }
            }
            return file.delete()
        }

        /**
         * 根据文件扩展名获取MIME类型
         * @param file 文件
         * @return MIME类型字符串
         */
        private fun getMimeType(file: File): String {
            if (file.isDirectory) {
                return MIME_TYPE_DIRECTORY
            }

            val name = file.name
            val lastDot = name.lastIndexOf('.')
            if (lastDot < 0) {
                return MIME_TYPE_DEFAULT
            }

            val extension = name.substring(lastDot + 1).lowercase()
            return MimeTypeMap.getSingleton().getMimeTypeFromExtension(extension)
                ?: MIME_TYPE_DEFAULT
        }
    }

    // 包名
    private lateinit var packageName: String

    // 各种数据目录
    private lateinit var internalDataDir: File  // /data/data/packageName
    private var deviceProtectedDataDir: File? = null  // /data/user_de/0/packageName
    private var externalDataDir: File? = null  // /storage/emulated/0/Android/data/packageName
    private var obbDir: File? = null  // /storage/emulated/0/Android/obb/packageName

    override fun onCreate(): Boolean = true

    override fun attachInfo(context: Context, info: ProviderInfo) {
        super.attachInfo(context, info)
        
        packageName = context.packageName
        
        // 获取内部数据目录 (/data/data/packageName)
        internalDataDir = context.filesDir.parentFile!!
        
        // 获取设备保护的数据目录 (/data/user_de/0/packageName)
        val internalPath = internalDataDir.path
        if (internalPath.startsWith("/data/user/")) {
            deviceProtectedDataDir = File("/data/user_de/${internalPath.substring(11)}")
        }
        
        // 获取外部数据目录
        val externalFiles = context.getExternalFilesDir(null)
        if (externalFiles != null) {
            externalDataDir = externalFiles.parentFile
        }
        
        // 获取OBB目录
        obbDir = context.obbDir
    }

    /**
     * 根据文档ID获取对应的文件
     * @param documentId 文档ID
     * @param checkExists 是否检查文件是否存在
     * @return 对应的文件对象，如果是根目录则返回null
     * @throws FileNotFoundException 如果文档ID格式不正确或文件不存在
     */
    private fun getFileForDocId(documentId: String, checkExists: Boolean = true): File? {
        if (!documentId.startsWith(packageName)) {
            throw FileNotFoundException("$documentId not found")
        }

        var path = documentId.substring(packageName.length)
        if (path.startsWith("/")) {
            path = path.substring(1)
        }

        if (path.isEmpty()) {
            return null  // 根目录
        }

        // 解析路径：格式为 "rootType/subpath"
        val slashIndex = path.indexOf('/')
        val rootType: String
        val subPath: String

        if (slashIndex == -1) {
            rootType = path
            subPath = ""
        } else {
            rootType = path.substring(0, slashIndex)
            subPath = path.substring(slashIndex + 1)
        }

        // 根据根类型选择基础目录
        val baseDir = when (rootType.lowercase()) {
            "data" -> internalDataDir
            "android_data" -> externalDataDir
            "android_obb" -> obbDir
            "user_de_data" -> deviceProtectedDataDir
            else -> null
        }

        if (baseDir == null) {
            throw FileNotFoundException("$documentId not found")
        }

        val file = File(baseDir, subPath)

        // 检查文件是否存在
        if (checkExists) {
            try {
                Os.lstat(file.path)
            } catch (e: Exception) {
                throw FileNotFoundException("$documentId not found")
            }
        }

        return file
    }

    /**
     * 添加文档行到游标
     * @param cursor 矩阵游标
     * @param documentId 文档ID
     * @param file 文件对象，如果为null则从documentId获取
     */
    private fun includeFile(cursor: MatrixCursor, documentId: String, file: File?) {
        val actualFile = file ?: getFileForDocId(documentId)

        // 处理根目录
        if (actualFile == null) {
            cursor.newRow().apply {
                add(Document.COLUMN_DOCUMENT_ID, packageName)
                add(Document.COLUMN_DISPLAY_NAME, packageName)
                add(Document.COLUMN_SIZE, 0L)
                add(Document.COLUMN_MIME_TYPE, MIME_TYPE_DIRECTORY)
                add(Document.COLUMN_LAST_MODIFIED, 0)
                add(Document.COLUMN_FLAGS, 0)
            }
            return
        }

        // 计算文档标志
        var flags = 0
        if (actualFile.isDirectory) {
            if (actualFile.canWrite()) {
                flags = Document.FLAG_DIR_SUPPORTS_CREATE
            }
        } else {
            if (actualFile.canWrite()) {
                flags = Document.FLAG_SUPPORTS_WRITE
            }
        }

        // 如果父目录可写，添加删除、移动和重命名权限
        if (actualFile.parentFile?.canWrite() == true) {
            flags = flags or Document.FLAG_SUPPORTS_DELETE or 
                    Document.FLAG_SUPPORTS_MOVE or Document.FLAG_SUPPORTS_RENAME
        }

        // 确定显示名称
        val displayName = when (actualFile.path) {
            internalDataDir.path -> "data"
            externalDataDir?.path -> "android_data"
            obbDir?.path -> "android_obb"
            deviceProtectedDataDir?.path -> "user_de_data"
            else -> actualFile.name
        }

        // 是否需要添加额外信息（权限等）
        val needsExtras = displayName == actualFile.name

        cursor.newRow().apply {
            add(Document.COLUMN_DOCUMENT_ID, documentId)
            add(Document.COLUMN_DISPLAY_NAME, displayName)
            add(Document.COLUMN_SIZE, actualFile.length())
            add(Document.COLUMN_MIME_TYPE, getMimeType(actualFile))
            add(Document.COLUMN_LAST_MODIFIED, actualFile.lastModified())
            add(Document.COLUMN_FLAGS, flags)
            add("mt_path", actualFile.absolutePath)

            // 添加文件权限和符号链接信息
            if (needsExtras) {
                try {
                    val stat = Os.lstat(actualFile.path)
                    val extras = buildString {
                        append(stat.st_mode)
                        append("|")
                        append(stat.st_uid)
                        append("|")
                        append(stat.st_gid)

                        // 如果是符号链接，添加链接目标
                        if ((stat.st_mode and OsConstants.S_IFMT) == S_IFLNK) {
                            append("|")
                            append(Os.readlink(actualFile.path))
                        }
                    }
                    add("mt_extras", extras)
                } catch (e: Exception) {
                    e.printStackTrace()
                }
            }
        }
    }

    override fun queryRoots(projection: Array<String>?): Cursor {
        val appInfo = context!!.applicationInfo
        val appName = appInfo.loadLabel(context!!.packageManager).toString()
        
        val result = MatrixCursor(projection ?: DEFAULT_ROOT_PROJECTION)
        result.newRow().apply {
            add(Root.COLUMN_ROOT_ID, packageName)
            add(Root.COLUMN_DOCUMENT_ID, packageName)
            add(Root.COLUMN_SUMMARY, packageName)
            add(Root.COLUMN_FLAGS, Root.FLAG_SUPPORTS_CREATE or Root.FLAG_SUPPORTS_IS_CHILD)
            add(Root.COLUMN_TITLE, appName)
            add(Root.COLUMN_MIME_TYPES, "*/*")
            add(Root.COLUMN_ICON, appInfo.icon)
        }
        return result
    }

    override fun queryDocument(documentId: String, projection: Array<String>?): Cursor {
        val result = MatrixCursor(projection ?: DEFAULT_DOCUMENT_PROJECTION)
        includeFile(result, documentId, null)
        return result
    }

    override fun queryChildDocuments(
        parentDocumentId: String,
        projection: Array<String>?,
        sortOrder: String?
    ): Cursor {
        var parentId = parentDocumentId
        if (parentId.endsWith("/")) {
            parentId = parentId.substring(0, parentId.length - 1)
        }

        val result = MatrixCursor(projection ?: DEFAULT_DOCUMENT_PROJECTION)
        val parentFile = getFileForDocId(parentId)

        if (parentFile == null) {
            // 根目录，列出所有可用的根类型
            if (BuildConfig.DEBUG)
                includeFile(result, "$parentId/data", internalDataDir)

            externalDataDir?.let {
                if (it.exists()) {
                    includeFile(result, "$parentId/android_data", it)
                }
            }
            if (BuildConfig.DEBUG) {
                obbDir?.let {
                    if (it.exists()) {
                        includeFile(result, "$parentId/android_obb", it)
                    }
                }
                deviceProtectedDataDir?.let {
                    if (it.exists()) {
                        includeFile(result, "$parentId/user_de_data", it)
                    }
                }
            }

        } else {
            // 普通目录，列出子文件
            parentFile.listFiles()?.forEach { child ->
                includeFile(result, "$parentId/${child.name}", child)
            }
        }

        return result
    }

    override fun getDocumentType(documentId: String): String {
        val file = getFileForDocId(documentId)
        return if (file == null) MIME_TYPE_DIRECTORY else getMimeType(file)
    }

    override fun openDocument(
        documentId: String,
        mode: String,
        signal: CancellationSignal?
    ): ParcelFileDescriptor {
        val file = getFileForDocId(documentId, checkExists = false)
            ?: throw FileNotFoundException("$documentId not found")
        
        return ParcelFileDescriptor.open(file, ParcelFileDescriptor.parseMode(mode))
    }

    override fun createDocument(
        parentDocumentId: String,
        mimeType: String,
        displayName: String
    ): String {
        val parent = getFileForDocId(parentDocumentId)
            ?: throw FileNotFoundException("Parent $parentDocumentId not found")

        var file = File(parent, displayName)
        var counter = 2

        // 如果文件已存在，添加数字后缀
        while (file.exists()) {
            file = File(parent, "$displayName ($counter)")
            counter++
        }

        // 创建文件或目录
        val success = try {
            if (mimeType == MIME_TYPE_DIRECTORY) {
                file.mkdir()
            } else {
                file.createNewFile()
            }
        } catch (e: IOException) {
            e.printStackTrace()
            false
        }

        if (!success) {
            throw FileNotFoundException(
                "Failed to create document in $parentDocumentId with name $displayName"
            )
        }

        // 返回新文档的ID
        return if (parentDocumentId.endsWith("/")) {
            "$parentDocumentId${file.name}"
        } else {
            "$parentDocumentId/${file.name}"
        }
    }

    override fun deleteDocument(documentId: String) {
        val file = getFileForDocId(documentId)
            ?: throw FileNotFoundException("$documentId not found")

        if (!deleteRecursively(file)) {
            throw FileNotFoundException("Failed to delete document $documentId")
        }
    }

    override fun removeDocument(documentId: String, parentDocumentId: String) {
        deleteDocument(documentId)
    }

    override fun renameDocument(documentId: String, displayName: String): String {
        val file = getFileForDocId(documentId)
            ?: throw FileNotFoundException("$documentId not found")

        val newFile = File(file.parentFile, displayName)
        if (!file.renameTo(newFile)) {
            throw FileNotFoundException("Failed to rename document $documentId to $displayName")
        }

        // 返回新的文档ID
        val lastSlashIndex = documentId.lastIndexOf('/', documentId.length - 2)
        return "${documentId.substring(0, lastSlashIndex)}/$displayName"
    }

    override fun moveDocument(
        sourceDocumentId: String,
        sourceParentDocumentId: String,
        targetParentDocumentId: String
    ): String {
        val sourceFile = getFileForDocId(sourceDocumentId)
            ?: throw FileNotFoundException("$sourceDocumentId not found")

        val targetParent = getFileForDocId(targetParentDocumentId)
            ?: throw FileNotFoundException("$targetParentDocumentId not found")

        val targetFile = File(targetParent, sourceFile.name)
        if (targetFile.exists() || !sourceFile.renameTo(targetFile)) {
            throw FileNotFoundException(
                "Failed to move document $sourceDocumentId to $targetParentDocumentId"
            )
        }

        // 返回新的文档ID
        return if (targetParentDocumentId.endsWith("/")) {
            "$targetParentDocumentId${targetFile.name}"
        } else {
            "$targetParentDocumentId/${targetFile.name}"
        }
    }

    override fun isChildDocument(parentDocumentId: String, documentId: String): Boolean {
        return documentId.startsWith(parentDocumentId)
    }

    override fun call(method: String, arg: String?, extras: Bundle?): Bundle? {
        // 先调用父类方法
        super.call(method, arg, extras)?.let { return it }

        // 处理自定义方法
        if (!method.startsWith("mt:")) {
            return null
        }

        extras ?: return null
        val result = Bundle()

        try {
            // 从URI中提取文档ID
            val uri = extras.getParcelable<Uri>("uri") ?: return null
            val pathSegments = uri.pathSegments
            val documentId = if (pathSegments.size >= 4) {
                pathSegments[3]
            } else {
                pathSegments[1]
            }

            when (method) {
                METHOD_SET_LAST_MODIFIED -> {
                    val file = getFileForDocId(documentId)
                    if (file != null) {
                        val time = extras.getLong("time")
                        result.putBoolean("result", file.setLastModified(time))
                    } else {
                        result.putBoolean("result", false)
                    }
                }

                METHOD_SET_PERMISSIONS -> {
                    val file = getFileForDocId(documentId)
                    if (file != null) {
                        try {
                            val permissions = extras.getInt("permissions")
                            Os.chmod(file.path, permissions)
                            result.putBoolean("result", true)
                        } catch (e: ErrnoException) {
                            result.putBoolean("result", false)
                            result.putString("message", e.message)
                        }
                    } else {
                        result.putBoolean("result", false)
                    }
                }

                METHOD_CREATE_SYMLINK -> {
                    val file = getFileForDocId(documentId, checkExists = false)
                    if (file != null) {
                        try {
                            val targetPath = extras.getString("path")
                            Os.symlink(targetPath, file.path)
                            result.putBoolean("result", true)
                        } catch (e: ErrnoException) {
                            result.putBoolean("result", false)
                            result.putString("message", e.message)
                        }
                    } else {
                        result.putBoolean("result", false)
                    }
                }

                else -> {
                    result.putBoolean("result", false)
                    result.putString("message", "Unsupported method: $method")
                }
            }
        } catch (e: Exception) {
            result.putBoolean("result", false)
            result.putString("message", e.toString())
        }

        return result
    }
}
