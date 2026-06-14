package com.widget.noname.util;

import android.content.Context;
import android.content.res.AssetManager;
import android.net.Uri;
import android.os.SystemClock;
import android.util.Log;
import com.widget.noname.function.functionlibrary.listener.ExtractListener;

import net.lingala.zip4j.ZipFile;
import net.lingala.zip4j.progress.ProgressMonitor;

import java.io.BufferedReader;
import java.io.Closeable;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.nio.channels.FileChannel;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.List;

public class FileUtil {
    private static final String TAG = "FileUtil";
    private static final int MOD_K = 1024;
    private static final DecimalFormat DECIMAL_FORMAT = new DecimalFormat("0.##");
    private static final String GAME_FOLDER = "game";
    private static final String GAME_FILE = "game.js";

    public static String getFileSize(File file) {
        long length = FileUtil.folderSize(file);
        float size = FileUtil.fileSizeToMb(length);

        String suffix = " MB";
        if (size >= MOD_K) {
            size = size / MOD_K;
            suffix = " GB";
        }

        return DECIMAL_FORMAT.format(size) + suffix;
    }

    public static float fileSizeToMb(long size) {

        float result = size * 1f / MOD_K;
        result = result / MOD_K;

        return result;
    }

    public static long folderSize(File directory) {
        long length = 0;

        if ((null != directory) && directory.isDirectory()) {
            File[] files = directory.listFiles();

            if (null != files) {
                for (File file : files) {
                    if (file.isFile())
                        length += file.length();
                    else
                        length += folderSize(file);
                }
            }
        } else if ((null != directory) && directory.isFile()) {
            length = directory.length();
        }

        return length;
    }

    public static void extractAssetToGame(Context context, String assetName, File root, String folder,
                                          ExtractListener listener) {

        if (null != context) {
            String destPath = root.getPath() + File.separator + folder;
            String tempPath = root.getPath() + File.separator;
            String tempName = "temp.zip";
            ZipFile zipFile = null;
            File file = null;

            try {
                file = new File(tempPath + tempName);
                File destFile = new File(destPath);

                if (!destFile.exists() || !destFile.isDirectory()) {
                    boolean mkdirs = destFile.mkdirs();
                    Log.v(TAG, "extractAll, destFile: " + destFile + ", mkdirs: " + mkdirs);

                    if (!mkdirs) {
                        if (null != listener) {
                            listener.onExtractError();

                            return;
                        }
                    }
                }

                copyAssetToFile(context, assetName, tempPath, tempName, listener);

                zipFile = new ZipFile(file);
                zipFile.setRunInThread(true);
                ProgressMonitor progressMonitor = zipFile.getProgressMonitor();
                zipFile.extractAll(destPath);

                while (!progressMonitor.getState().equals(ProgressMonitor.State.READY)) {
                    if (null != listener) {
                        listener.onExtractProgress(50 + (progressMonitor.getPercentDone() / 2));
                    }

                    Thread.sleep(100);
                }

                if (progressMonitor.getResult().equals(ProgressMonitor.Result.SUCCESS)) {
                    if (null != listener) {
                        listener.onExtractDone();
                    }
                } else if (progressMonitor.getResult().equals(ProgressMonitor.Result.ERROR)) {
                    if (null != listener) {
                        listener.onExtractError();
                    }
                } else if (progressMonitor.getResult().equals(ProgressMonitor.Result.CANCELLED)) {
                    if (null != listener) {
                        listener.onExtractCancel();
                    }
                }

                boolean delete = file.delete();

                String finalDestPath = root.getPath() + File.separator + folder;

                File tempFolder = new File(destPath);
                tempFolder.renameTo(new File(finalDestPath));

                Log.v(TAG, "extractUriToGame, file: " + file + ", delete: " + delete);
            } catch (Exception e) {
                if (null != listener) {
                    listener.onExtractError();
                }

                if (null != file) {
                    boolean delete = file.delete();
                    Log.v(TAG, "extractUriToGame, failed, file: " + file + ", delete: " + delete);
                }

                e.printStackTrace();
            } finally {
                safeClose(zipFile);

                if (null != listener) {
                    listener.onExtractSaved(destPath);
                }
            }
        }
    }

    public static void copyUriToFile(Context context, Uri uri, String destPath, String destName,
                                     ExtractListener listener) throws IOException {

        String outFileName = destPath + destName;
        File dir = new File(destPath);
        File dbf = new File(outFileName);

        if (!dir.exists()) {
            boolean ret = dir.mkdirs();
            Log.v(TAG, "copyUriToFile, mkdir: " + ret + ", dir: " + dir);
        }

        if (dbf.exists()) {
            boolean ret = dbf.delete();
            Log.v(TAG, "copyUriToFile, delete: " + ret + ", file: " + dbf);
        }

        OutputStream os = new FileOutputStream(outFileName);
        InputStream is = context.getContentResolver().openInputStream(uri);
        int available = is.available();

        byte[] buffer = new byte[1024];
        int length;
        float copyLength = 0;
        long lastTime = SystemClock.uptimeMillis();
        long curTIme = 0;

        while ((length = is.read(buffer)) > 0) {
            os.write(buffer, 0, length);
            copyLength += length;
            curTIme = SystemClock.uptimeMillis();

            if (curTIme - lastTime > 200) {
                lastTime = curTIme;

                if (null != listener) {
                    listener.onExtractProgress((int) ((copyLength / available) * 50));
                }
            }
        }

        os.flush();
        safeClose(os, is);
    }

    public static void copyAssetToFile(Context context, String assetName, String destPath, String destName,
                                       ExtractListener listener) throws IOException {

        String outFileName = destPath + destName;
        File dir = new File(destPath);
        File dbf = new File(outFileName);

        if (!dir.exists()) {
            boolean ret = dir.mkdirs();
            Log.v(TAG, "copyUriToFile, mkdir: " + ret + ", dir: " + dir);
        }

        if (dbf.exists()) {
            boolean ret = dbf.delete();
            Log.v(TAG, "copyUriToFile, delete: " + ret + ", file: " + dbf);
        }

        OutputStream os = new FileOutputStream(outFileName);
        InputStream is = context.getAssets().open(assetName);
        int available = is.available();

        byte[] buffer = new byte[1024];
        int length;
        float copyLength = 0;
        long lastTime = SystemClock.uptimeMillis();
        long curTIme = 0;

        while ((length = is.read(buffer)) > 0) {
            os.write(buffer, 0, length);
            copyLength += length;
            curTIme = SystemClock.uptimeMillis();

            if (curTIme - lastTime > 200) {
                lastTime = curTIme;

                if (null != listener) {
                    listener.onExtractProgress((int) ((copyLength / available) * 50));
                }
            }
        }

        os.flush();
        safeClose(os, is);
    }

    private static void safeClose(Closeable... closeables) {
        if (null != closeables) {
            for (Closeable cl : closeables) {
                try {
                    if (null != cl) {
                        cl.close();
                    }
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    public static void copyFileUsingFileChannels(String source, String dest) {
        try (FileChannel inputChannel = new FileInputStream(source).getChannel();
             FileChannel outputChannel = new FileOutputStream(dest).getChannel()) {
            outputChannel.transferFrom(inputChannel, 0, inputChannel.size());
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static void copy(String fromFile, String toFile) {
        File[] currentFiles;
        File root = new File(fromFile);

        if (!root.exists()) {
            return;
        }

        currentFiles = root.listFiles();

        File targetDir = new File(toFile);
        if (!targetDir.exists()) {
            targetDir.mkdirs();
        }

        if (null != currentFiles) {
            for (File currentFile : currentFiles) {
                if (currentFile.isDirectory()) {
                    copy(currentFile.getPath() + "/", toFile + currentFile.getName() + "/");
                } else {
                    copyFileUsingFileChannels(currentFile.getPath(), toFile + currentFile.getName());
                }
            }
        }
    }

    public static boolean isAssetFileExist(Context context, String url) {
        try {
            AssetManager assets = context.getAssets();
            String[] list = assets.list("");
            for (String file : list) {
                if (file.equals(url)) {
                    return true;
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return false;
    }

    // 兼容其他html项目(需要有index.html文件)
    public static boolean checkIfGamePath(File file) {
        if (null != file && file.exists() && file.isDirectory()) {
            // 判断game目录和game.js文件
            File[] gameFolders = file.listFiles(dir -> dir.isDirectory() && GAME_FOLDER.equals(dir.getName()));

            if (null != gameFolders && gameFolders.length == 1) {
                File gameFolder = gameFolders[0];
                File[] gameJs = gameFolder.listFiles(f -> f.isFile() && GAME_FILE.equals(f.getName()));

                return (null != gameJs) && (gameJs.length > 0);
            }

            // 判断是否有index.html文件
            File[] htmlFiles = file.listFiles(f -> f.isFile() && "index.html".equals(f.getName()));
            return (null != htmlFiles) && (htmlFiles.length > 0);
        }

        return false;
    }

    public static List<File> findGameInPath(File root) {
        ArrayList<File> list = new ArrayList<>();

        if (FileUtil.checkIfGamePath(root)) {
            list.add(root);
        }

        if (null != root) {
            File[] files = root.listFiles();

            if (null != files) {
                for (File file : files) {
                    if (FileUtil.checkIfGamePath(file)) {
                        list.add(file);
                    } else {
                        list.addAll(findGameInPath(file));
                    }
                }
            }
        }

        return list;
    }

    public static boolean deleteFolderRecursively(File file) {
        try {
            boolean res = true;
            File[] var2 = file.listFiles();
            int var3 = var2.length;

            for(int var4 = 0; var4 < var3; ++var4) {
                File childFile = var2[var4];
                if (childFile.isDirectory()) {
                    res &= deleteFolderRecursively(childFile);
                } else {
                    res &= childFile.delete();
                }
            }

            res &= file.delete();
            return res;
        } catch (Exception var6) {
            Exception e = var6;
            e.printStackTrace();
            return false;
        }
    }

    public static boolean copyAssetFolder(AssetManager assetManager, String fromAssetPath, String toPath) {
        try {
            String[] files = assetManager.list(fromAssetPath);
            boolean res = true;
            if (files.length == 0) {
                res &= copyAsset(assetManager, fromAssetPath, toPath);
            } else {
                (new File(toPath)).mkdirs();
                String[] var5 = files;
                int var6 = files.length;

                for(int var7 = 0; var7 < var6; ++var7) {
                    String file = var5[var7];
                    res &= copyAssetFolder(assetManager, fromAssetPath + "/" + file, toPath + "/" + file);
                }
            }

            return res;
        } catch (Exception var9) {
            Exception e = var9;
            e.printStackTrace();
            return false;
        }
    }

    public static boolean copyAsset(AssetManager assetManager, String fromAssetPath, String toPath) {
        InputStream in = null;
        OutputStream out = null;

        try {
            in = assetManager.open(fromAssetPath);
            (new File(toPath)).createNewFile();
            out = new FileOutputStream(toPath);
            copyFile(in, out);
            in.close();
            in = null;
            ((OutputStream)out).flush();
            ((OutputStream)out).close();
            out = null;
            return true;
        } catch (Exception var6) {
            Exception e = var6;
            e.printStackTrace();
            return false;
        }
    }

    public static void normalizeExternalStoragePermissions(File target) {
        if (target == null || !target.exists()) {
            Log.w(TAG, "normalizeExternalStoragePermissions skipped, target missing: " + (target == null ? "null" : target.getAbsolutePath()));
            return;
        }

        Log.d(TAG, "normalizeExternalStoragePermissions start: " + target.getAbsolutePath());
        normalizeWithJava(target);
        Log.d(TAG, "normalizeExternalStoragePermissions java fallback applied: " + target.getAbsolutePath());
        if (ShizukuUtil.checkPermission()) {
            normalizeWithShell(target);
        } else {
            Log.d(TAG, "normalizeExternalStoragePermissions shizuku unavailable, java-only: " + target.getAbsolutePath());
        }
        Log.d(TAG, "normalizeExternalStoragePermissions end: " + target.getAbsolutePath());
    }

    private static boolean normalizeWithShell(File target) {
        try {
            String path = target.getAbsolutePath().replace("\"", "\\\"");
            StringBuilder command = new StringBuilder();
            command.append("chgrp -hR ext_data_rw \"").append(path).append("\" >/dev/null 2>&1 || true");
            if (target.isDirectory()) {
                command.append("; find \"").append(path).append("\" -type d -exec chmod 775 {} + >/dev/null 2>&1 || true");
                command.append("; find \"").append(path).append("\" -type f -exec chmod 664 {} + >/dev/null 2>&1 || true");
            } else {
                command.append("; chmod 664 \"").append(path).append("\" >/dev/null 2>&1 || true");
            }
            Log.d(TAG, "normalizeWithShell exec: " + command);
            ShizukuUtil.exec(command.toString());
            Log.d(TAG, "normalizeWithShell applied: " + target.getAbsolutePath());
            return true;
        } catch (Exception e) {
            Log.w(TAG, "normalizeWithShell failed: " + target.getAbsolutePath(), e);
            return false;
        }
    }

    private static void normalizeWithJava(File target) {
        if (!target.exists()) {
            return;
        }

        target.setReadable(true, false);
        target.setWritable(true, false);
        if (target.isDirectory()) {
            target.setExecutable(true, false);
            Log.d(TAG, "normalizeWithJava dir => rwx for all: " + target.getAbsolutePath());
            File[] children = target.listFiles();
            if (children != null) {
                for (File child : children) {
                    normalizeWithJava(child);
                }
            }
        } else {
            Log.d(TAG, "normalizeWithJava file => rw for all: " + target.getAbsolutePath());
        }
    }

    public static void copyFile(InputStream in, OutputStream out) throws IOException {
        byte[] buffer = new byte[1024];

        int read;
        while((read = in.read(buffer)) != -1) {
            out.write(buffer, 0, read);
        }

    }

    /**
     * 将文件内容读取为字符串
     *
     * @param file 要读取的文件
     * @return 文件内容字符串
     * @throws IOException 读取文件时发生错误
     */
    public static String readFileToString(File file) throws IOException {
        if (file == null || !file.exists()) {
            throw new IOException("File does not exist: " + (file != null ? file.getAbsolutePath() : "null"));
        }

        StringBuilder content = new StringBuilder();
        FileInputStream fis = null;
        InputStreamReader isr = null;
        BufferedReader br = null;

        try {
            fis = new FileInputStream(file);
            isr = new InputStreamReader(fis, "UTF-8");
            br = new BufferedReader(isr);

            String line;
            while ((line = br.readLine()) != null) {
                content.append(line).append("\n");
            }

            // 删除最后多余的换行符
            if (content.length() > 0) {
                content.deleteCharAt(content.length() - 1);
            }

            return content.toString();
        } finally {
            if (br != null) {
                try {
                    br.close();
                } catch (IOException e) {
                    // 忽略关闭异常
                }
            }
            if (isr != null) {
                try {
                    isr.close();
                } catch (IOException e) {
                    // 忽略关闭异常
                }
            }
            if (fis != null) {
                try {
                    fis.close();
                } catch (IOException e) {
                    // 忽略关闭异常
                }
            }
        }
    }

}
