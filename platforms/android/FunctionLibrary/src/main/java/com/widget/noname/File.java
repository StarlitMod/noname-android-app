package com.widget.noname;

import android.annotation.SuppressLint;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.widget.noname.util.ShizukuUtil;

import java.io.FileFilter;
import java.io.FilenameFilter;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URI;
import java.net.URL;
import java.nio.file.Path;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class File extends java.io.File {
    public File(@Nullable File parent, @NonNull String child) {
        super(parent, child);
    }

    public File(@NonNull String pathname) {
        super(pathname);
    }

    public File(@Nullable String parent, @NonNull String child) {
        super(parent, child);
    }

    public File(@NonNull URI uri) {
        super(uri);
    }

    // 缓存文件类型
    private Boolean isDirectoryCached = null;
    private Boolean canExecuteCached = null;
    private Boolean canReadCached = null;
    private Boolean canWriteCached = null;
    private Long lengthCached = null;
    private Long lastModifiedCached = null;

    /**
     * 清除所有缓存的文件属性
     */
    private void clearCache() {
        canExecuteCached = null;
        canReadCached = null;
        canWriteCached = null;
        lengthCached = null;
        lastModifiedCached = null;
        isDirectoryCached = null;
    }

    // 添加静态字段来跟踪需要在退出时删除的文件
    // Runtime.getRuntime().addShutdownHook不生效，需要Activity 的 onDestroy() 中删除
    public static final Set<String> filesToDeleteOnExit = new HashSet<>();

    @Override
    public boolean canExecute() {
        if (!ShizukuUtil.checkPermission()) return super.canExecute();
        if (canExecuteCached != null) {
            return canExecuteCached;
        }
        try {
            // 使用 stat 命令检查文件权限
            String command = "stat -c \"%A\" \"" + this.getAbsolutePath() + "\" 2>/dev/null | grep -E \"^[-d][rwx-]{3}[x-]\"";
            String result = ShizukuUtil.exec(command);
            // 如果能匹配到包含执行权限的模式，则文件可执行
            return result != null && !result.trim().isEmpty();
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public boolean canRead() {
        if (!ShizukuUtil.checkPermission()) return super.canRead();
        if (canReadCached != null) {
            return canReadCached;
        }
        try {
            // 使用 stat 命令检查文件权限
            String command = "stat -c \"%A\" \"" + this.getAbsolutePath() + "\" 2>/dev/null | grep -E \"^[-d][rwx-]{1}[r-]\"";
            String result = ShizukuUtil.exec(command);
            // 如果能匹配到包含读权限的模式，则文件可读
            return result != null && !result.trim().isEmpty();
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public boolean canWrite() {
        if (!ShizukuUtil.checkPermission()) return super.canWrite();
        if (canWriteCached != null) {
            return canWriteCached;
        }
        try {
            // 使用 stat 命令检查文件权限
            String command = "stat -c \"%A\" \"" + this.getAbsolutePath() + "\" 2>/dev/null | grep -E \"^[-d][rwx-]{2}w\"";
            String result = ShizukuUtil.exec(command);
            // 如果能匹配到包含写权限的模式，则文件可写
            return result != null && !result.trim().isEmpty();
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public int compareTo(@NonNull File pathname) {
        return super.compareTo(pathname);
    }

    @Override
    public boolean createNewFile() throws IOException {
        if (!ShizukuUtil.checkPermission()) return super.createNewFile();
        try {
            String command = "touch \"" + this.getAbsolutePath() + "\"";
            String result = ShizukuUtil.exec(command);
            return !result.contains("Permission denied");
        } catch (Exception e) {
            throw new IOException(e);
        }
    }

    @NonNull
    public static File createTempFile(@NonNull String prefix, @NonNull String suffix) throws IOException {
        return createTempFile(prefix, suffix, null);
    }

    @NonNull
    public static File createTempFile(@NonNull String prefix, @Nullable String suffix, @Nullable File directory) throws IOException {
        if (!ShizukuUtil.checkPermission()) return (File) java.io.File.createTempFile(prefix, suffix, directory);
        if (prefix.length() < 3) {
            throw new IllegalArgumentException("Prefix string must be at least 3 characters");
        }

        String dirPath = (directory != null) ? directory.getAbsolutePath() : System.getProperty("java.io.tmpdir");
        if (suffix == null) {
            suffix = ".tmp";
        }

        // 生成唯一文件名
        String fileName;
        do {
            fileName = prefix + System.nanoTime() + (long) (Math.random() * 1000000) + suffix;
        } while (new File(dirPath, fileName).exists());

        File tempFile = new File(dirPath, fileName);
        // 真正创建文件
        tempFile.createNewFile();
        return tempFile;
    }


    @Override
    public boolean delete() {
        if (!ShizukuUtil.checkPermission()) return super.delete();
        try {
            String command = "rm -f \"" + this.getAbsolutePath() + "\"";
            String result = ShizukuUtil.exec(command);
            return !result.contains("Permission denied");
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public void deleteOnExit() {
        if (!ShizukuUtil.checkPermission()) {
            super.deleteOnExit();
        }
        else {
            synchronized (filesToDeleteOnExit) {
                filesToDeleteOnExit.add(this.getAbsolutePath());
            }
        }
    }

    @Override
    public boolean equals(@Nullable Object obj) {
        return super.equals(obj);
    }

    @Override
    public boolean exists() {
        if (!ShizukuUtil.checkPermission()) return super.exists();
        if (this.isDirectoryCached != null) {
            return true;
        }
        try {
            // 使用 ls 命令检查路径是否存在
            String command = "ls -d \"" + this.getAbsolutePath() + "\"";
            String result = ShizukuUtil.exec(command);
            return !result.contains("Permission denied") && !result.contains("No such file or directory");
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @NonNull
    @Override
    public File getAbsoluteFile() {
        return new File(this.getAbsolutePath());
    }

    @NonNull
    @Override
    public String getAbsolutePath() {
        if (!ShizukuUtil.checkPermission()) return super.getAbsolutePath();
        try {
            String command = "realpath \"" + super.getPath() + "\"";
            String result = ShizukuUtil.exec(command);
            if (result != null && !result.isEmpty()) {
                return result.trim();
            }
            return super.getAbsolutePath();
        } catch (Exception e) {
            e.printStackTrace();
            return super.getAbsolutePath();
        }
    }

    @NonNull
    @Override
    public File getCanonicalFile() throws IOException {
        return new File(this.getCanonicalPath());
    }

    @NonNull
    @Override
    public String getCanonicalPath() throws IOException {
        if (!ShizukuUtil.checkPermission()) return super.getCanonicalPath();
        try {
            String command = "readlink -f \"" + this.getPath() + "\"";
            String result = ShizukuUtil.exec(command);
            if (result != null && !result.isEmpty()) {
                return result.trim();
            }
            return super.getCanonicalPath();
        } catch (Exception e) {
            throw new IOException(e);
        }
    }

    @Override
    public long getFreeSpace() {
        if (!ShizukuUtil.checkPermission()) return super.getFreeSpace();
        try {
            String command = "df \"" + this.getAbsolutePath() + "\" | awk 'NR==2 {print $4}'";
            String result = ShizukuUtil.exec(command);
            if (result != null && !result.isEmpty()) {
                return Long.parseLong(result.trim()) * 1024; // df输出的是KB，转换为字节
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return 0;
    }

    @NonNull
    @Override
    public String getName() {
        return super.getName();
    }

    @Nullable
    @Override
    public String getParent() {
        return super.getParent();
    }

    @Nullable
    @Override
    public File getParentFile() {
        String parent = this.getParent();
        return parent == null ? null : new File(parent);
    }

    @NonNull
    @Override
    public String getPath() {
        return super.getPath();
    }

    @Override
    public long getTotalSpace() {
        if (!ShizukuUtil.checkPermission()) return super.getTotalSpace();
        try {
            String command = "df \"" + this.getAbsolutePath() + "\" | awk 'NR==2 {print $2}'";
            String result = ShizukuUtil.exec(command);
            if (result != null && !result.isEmpty()) {
                return Long.parseLong(result.trim()) * 1024; // df输出的是KB，转换为字节
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return 0;
    }

    @Override
    public long getUsableSpace() {
        return getFreeSpace();
    }

    @Override
    public int hashCode() {
        return super.hashCode();
    }

    @Override
    public boolean isAbsolute() {
        return super.isAbsolute();
    }

    @Override
    public boolean isDirectory() {
        if (!ShizukuUtil.checkPermission()) return super.isDirectory();
        if (isDirectoryCached != null) {
            return isDirectoryCached;
        }
        if (!this.exists()) {
            return false;
        }
        try {
            return ShizukuUtil.isDirectory(this.getAbsolutePath());
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public boolean isFile() {
        if (!ShizukuUtil.checkPermission()) return super.isFile();
        if (isDirectoryCached != null) {
            return !isDirectoryCached;
        }
        if (!this.exists()) {
            return false;
        }
        try {
            return ShizukuUtil.isFile(this.getAbsolutePath());
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public boolean isHidden() {
        // Unix/Linux 系统中隐藏文件以 . 开头
        return getName().startsWith(".");
    }

    @Override
    public long lastModified() {
        if (!ShizukuUtil.checkPermission()) return super.lastModified();
        if (lastModifiedCached != null) {
            return lastModifiedCached;
        }
        try {
            String command = "stat -c %Y \"" + this.getAbsolutePath() + "\"";
            String result = ShizukuUtil.exec(command);
            if (result != null && !result.isEmpty()) {
                return Long.parseLong(result.trim()) * 1000; // stat输出的是秒，转换为毫秒
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return 0;
    }

    @Override
    public long length() {
        if (!ShizukuUtil.checkPermission()) return super.length();
        if (lengthCached != null) {
            return lengthCached;
        }
        try {
            String command = "stat -c %s \"" + this.getAbsolutePath() + "\"";
            String result = ShizukuUtil.exec(command);
            if (result != null && !result.isEmpty()) {
                return Long.parseLong(result.trim());
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return 0;
    }

    @Nullable
    @Override
    public String[] list() {
        if (!ShizukuUtil.checkPermission()) return super.list();
        try {
            String command = "ls -A -1 \"" + this.getAbsolutePath() + "\"";
            String result = ShizukuUtil.exec(command);
            if (result != null && !result.isEmpty()) {
                String[] files = result.trim().split("\n");
                if (files.length > 0 && !files[0].isEmpty()) {
                    return files;
                }
            }
            return new String[0];
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @Nullable
    @Override
    public String[] list(@Nullable FilenameFilter filter) {
        if (!ShizukuUtil.checkPermission()) return super.list(filter);
        String[] files = list();
        if (files == null || filter == null) {
            return files;
        }

        List<String> filtered = new ArrayList<>();
        for (String file : files) {
            if (filter.accept(this, file)) {
                filtered.add(file);
            }
        }
        return filtered.toArray(new String[0]);
    }

    // 修改 listFiles() 方法，一次性获取文件类型信息
    @Nullable
    @Override
    public File[] listFiles() {
        if (!ShizukuUtil.checkPermission()) {
            // 手动转换父类数组到子类数组
            java.io.File[] files = super.listFiles();
            if (files == null) return null;

            File[] result = new File[files.length];
            for (int i = 0; i < files.length; i++) {
                result[i] = new File(files[i].getAbsolutePath());
            }
            return result;
        }

        try {
            // 使用 ls -l 命令获取详细信息，包括文件类型
            String command = "ls -lA -1 \"" + this.getAbsolutePath() + "\"";
            String result = ShizukuUtil.exec(command);

            if (result == null || result.isEmpty()) {
                return new File[0];
            }

            String[] lines = result.trim().split("\n");
            File[] files = new File[lines.length - 1];

            // 跳过第一行 (total xxx)
            for (int i = 1; i < lines.length; i++) {
                String line = lines[i];
                if (line.isEmpty()) continue;

                // 解析文件名和类型
                String[] parts = line.split("\\s+");
                if (parts.length < 8) {
                    Log.e("file", "listFiles: Invalid line: " + line);
                    continue;
                }

                String filename = parts[7];
                File file = new File(this, filename);

                // 设置缓存的文件类型
                file.isDirectoryCached = line.startsWith("d");
                // 缓存文件大小 (第5列)
                if (parts[4].matches("\\d+")) {
                    file.lengthCached = Long.parseLong(parts[4]);
                }
                // 缓存修改时间 (第6-7列)
                // 例如: "2025-09-11 11:06" 或 "Sep 11 11:06" 或 "Sep 11 2024"
                String dateTimeStr = parts[5] + " " + parts[6];
                // 定义日期格式
                @SuppressLint("SimpleDateFormat")
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm");
                // 解析为Date对象
                Date date = sdf.parse(dateTimeStr);
                // 获取时间戳（毫秒）
                if (date != null) {
                    file.lastModifiedCached = date.getTime();
                }

                // 缓存权限信息用于快速判断读写执行权限
                if (parts[0].length() >= 4) {
                    String permissions = parts[0];
                    // 用户读权限 (位置2)
                    file.canReadCached = permissions.charAt(1) == 'r';
                    // 用户写权限 (位置3)
                    file.canWriteCached = permissions.charAt(2) == 'w';
                    // 用户执行权限 (位置4)
                    file.canExecuteCached = permissions.charAt(3) == 'x' || permissions.charAt(3) == 's';
                }

                files[i - 1] = file;
            }

            return files;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @Nullable
    @Override
    public File[] listFiles(@Nullable FileFilter filter) {
        if (!ShizukuUtil.checkPermission()) {
            // 手动转换父类数组到子类数组
            java.io.File[] files = super.listFiles(filter);
            if (files == null) return null;

            File[] result = new File[files.length];
            for (int i = 0; i < files.length; i++) {
                result[i] = new File(files[i].getAbsolutePath());
            }
            return result;
        }

        // 复用优化后的 listFiles() 方法
        File[] files = listFiles();
        if (files == null || filter == null) {
            return files;
        }

        List<File> filtered = new ArrayList<>();
        for (File file : files) {
            if (filter.accept(file)) {
                filtered.add(file);
            }
        }
        return filtered.toArray(new File[0]);
    }

    @Nullable
    public File[] listFiles(@Nullable FilenameFilter filter) {
        if (!ShizukuUtil.checkPermission()) {
            // 手动转换父类数组到子类数组
            java.io.File[] files = super.listFiles(filter);
            if (files == null) return null;

            File[] result = new File[files.length];
            for (int i = 0; i < files.length; i++) {
                result[i] = new File(files[i].getAbsolutePath());
            }
            return result;
        }

        // 复用优化后的 listFiles() 方法
        File[] files = listFiles();
        if (files == null || filter == null) {
            return files;
        }

        List<File> filtered = new ArrayList<>();
        for (File file : files) {
            if (filter.accept(this, file.getName())) {
                filtered.add(file);
            }
        }
        return filtered.toArray(new File[0]);
    }

    @NonNull
    public static File[] listRoots() {
        if (!ShizukuUtil.checkPermission()) {
            // 手动转换父类数组到子类数组
            java.io.File[] files = File.listRoots();

            File[] result = new File[files.length];
            for (int i = 0; i < files.length; i++) {
                result[i] = new File(files[i].getAbsolutePath());
            }
            return result;
        }
        try {
            String command = "ls /";
            String result = ShizukuUtil.exec(command);
            if (result != null && !result.isEmpty()) {
                String[] roots = result.trim().split("\n");
                File[] files = new File[roots.length];
                for (int i = 0; i < roots.length; i++) {
                    files[i] = new File("/" + (roots[i].startsWith("/") ? roots[i].substring(1) : roots[i]));

                }
                return files;
            }
        } catch (Exception e) {
            // 忽略异常
        }
        return new File[0];
    }

    @Override
    public boolean mkdir() {
        if (!ShizukuUtil.checkPermission()) return super.mkdir();
        try {
            String command = "mkdir \"" + this.getAbsolutePath() + "\"";
            String result = ShizukuUtil.exec(command);
            return !result.contains("Permission denied");
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public boolean mkdirs() {
        if (!ShizukuUtil.checkPermission()) return super.mkdirs();
        try {
            String command = "mkdir -p \"" + this.getAbsolutePath() + "\"";
            String result = ShizukuUtil.exec(command);
            return !result.contains("Permission denied");
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean renameTo(@NonNull File dest) {
        if (!ShizukuUtil.checkPermission()) return super.renameTo(dest);
        try {
            String command = "mv \"" + this.getAbsolutePath() + "\" \"" + dest.getAbsolutePath() + "\"";
            String result = ShizukuUtil.exec(command);
            return !result.contains("Permission denied");
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public boolean setExecutable(boolean executable) {
        return setExecutable(executable, true);
    }

    @Override
    public boolean setExecutable(boolean executable, boolean ownerOnly) {
        canExecuteCached = null;
        if (!ShizukuUtil.checkPermission()) return super.setExecutable(executable, ownerOnly);
        try {
            String permission = ownerOnly ? (executable ? "744" : "644") : (executable ? "755" : "644");
            String command = "chmod " + permission + " \"" + this.getAbsolutePath() + "\"";
            String result = ShizukuUtil.exec(command);
            if (!result.contains("Permission denied")) {
                canExecuteCached = executable;
                return true;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    @Override
    public boolean setLastModified(long time) {
        lastModifiedCached = null;
        if (!ShizukuUtil.checkPermission()) return super.setLastModified(time);
        try {
            String date = new java.text.SimpleDateFormat("yyyyMMddHHmm.ss").format(new java.util.Date(time));
            String command = "touch -t " + date + " \"" + this.getAbsolutePath() + "\"";
            String result = ShizukuUtil.exec(command);
            if (!result.contains("Permission denied")) {
                lastModifiedCached = time;
                return true;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    @Override
    public boolean setReadOnly() {
        canWriteCached = canExecuteCached = null;
        if (!ShizukuUtil.checkPermission()) return super.setReadOnly();
        try {
            String command = "chmod 444 \"" + this.getAbsolutePath() + "\"";
            String result = ShizukuUtil.exec(command);
            return !result.contains("Permission denied");
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public boolean setReadable(boolean readable) {
        return setReadable(readable, true);
    }

    @Override
    public boolean setReadable(boolean readable, boolean ownerOnly) {
        canReadCached = null;
        if (!ShizukuUtil.checkPermission()) return super.setReadable(readable, ownerOnly);
        try {
            String permission = ownerOnly ? (readable ? "600" : "000") : (readable ? "644" : "000");
            String command = "chmod " + permission + " \"" + this.getAbsolutePath() + "\"";
            String result = ShizukuUtil.exec(command);
            if (!result.contains("Permission denied")) {
                canReadCached = readable;
                return true;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    @Override
    public boolean setWritable(boolean writable) {
        return setWritable(writable, true);
    }

    @Override
    public boolean setWritable(boolean writable, boolean ownerOnly) {
        canWriteCached = null;
        if (!ShizukuUtil.checkPermission()) return super.setWritable(writable, ownerOnly);
        try {
            String permission = ownerOnly ? (writable ? "600" : "400") : (writable ? "666" : "444");
            String command = "chmod " + permission + " \"" + this.getAbsolutePath() + "\"";
            String result = ShizukuUtil.exec(command);
            if (!result.contains("Permission denied")) {
                canWriteCached = writable;
                return true;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    @NonNull
    @Override
    public Path toPath() {
        return super.toPath();
    }

    @NonNull
    @Override
    public String toString() {
        return super.toString();
    }

    @NonNull
    @Override
    public URI toURI() {
        return super.toURI();
    }

    /** @deprecated */
    @Deprecated
    @NonNull
    @Override
    public URL toURL() throws MalformedURLException {
        return super.toURL();
    }
}
