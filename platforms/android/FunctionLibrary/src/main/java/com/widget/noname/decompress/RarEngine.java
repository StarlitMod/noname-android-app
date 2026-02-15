package com.widget.noname.decompress;

import android.util.Log;

import com.widget.noname.function.functionlibrary.R;

import net.sf.sevenzipjbinding.ArchiveFormat;

import java.io.File;
import java.io.RandomAccessFile;

public class RarEngine extends SevenZipJBindingEngine {
    private static final String TAG = "RarEngine";

    public RarEngine() {
        super();
        this.archiveFormat = ArchiveFormat.RAR;
    }

    @Override
    protected void createTempFile(DecompressConfig config, DecompressCallback callback) {
        super.createTempFile(config, callback);
        if (file != null) {
            // 检测RAR文件版本
            ArchiveFormat detectedFormat = detectRarVersion(file);
            if (detectedFormat != null) {
                this.archiveFormat = detectedFormat;
                callback.onLog(config.getContext().getString(R.string.extract_info_rar_version, detectedFormat == ArchiveFormat.RAR5 ? "RAR5" : "RAR4"));
            }
        }
    }

    private ArchiveFormat detectRarVersion(File rarFile) {
        try (RandomAccessFile raf = new RandomAccessFile(rarFile, "r")) {
            byte[] header = new byte[8];
            raf.readFully(header);

            // 检查RAR5签名
            if (header[0] == 0x52 && header[1] == 0x61 && header[2] == 0x72 && header[3] == 0x21 && header[4] == 0x1A && header[5] == 0x07 && header[6] == 0x01 && header[7] == 0x00) {
                return ArchiveFormat.RAR5;
            }

            // 检查RAR4签名
            if (header[0] == 0x52 && header[1] == 0x61 && header[2] == 0x72 && header[3] == 0x21 && header[4] == 0x1A && header[5] == 0x07 && header[6] == 0x00) {
                return ArchiveFormat.RAR;
            }
        } catch (Exception e) {
            Log.e(TAG, "RAR版本检测失败: " + e.getMessage());
        }
        return null;
    }
}
