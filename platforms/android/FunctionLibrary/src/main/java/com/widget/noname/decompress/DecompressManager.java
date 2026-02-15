package com.widget.noname.decompress;

import com.widget.noname.MyApplication;
import com.widget.noname.function.functionlibrary.config.ImportConfig;

import java.io.File;
import java.util.ArrayList;

public class DecompressManager {

    // 引擎类型枚举
    public enum EngineType {
        ZIP4J,
        ZIP,
        SEVENZIP,
        TAR,
        RAR,
        COPY
    }

    // 导入压缩包类型
    public static final ArrayList<ImportConfig> DEFAULT_IMPORT_TYPE = new ArrayList<>();

    // ${name}将会在engine的getImportConfig里替换
    // 占位符可以是json中的任一属性名
    static {
        DEFAULT_IMPORT_TYPE.add(new ImportConfig("无名杀·本体包", "./", new String[] {
                "*/game/game.js",
        }));
        DEFAULT_IMPORT_TYPE.add(new ImportConfig("无名杀·扩展包", "./extension/${name}", new String[] {
                "*/extension.js",
                "*/info.json",
        }));
        DEFAULT_IMPORT_TYPE.add(new ImportConfig("无名杀·扩展包(ts)", "./extension/${name}", new String[] {
                "*/extension.ts",
                "*/info.json",
        }));
        DEFAULT_IMPORT_TYPE.add(new ImportConfig("HTML项目包", "./", new String[] {
                "*/index.html",
        }));
        DEFAULT_IMPORT_TYPE.add(new ImportConfig("主题包", new File(MyApplication.getContext().getFilesDir(), "theme_package/${name}").getAbsolutePath(), new String[] {
                "*/manifest.json",
                "*/assets/images/background/0.jpg",
        }));
    }

    private DecompressEngine engine;

    public DecompressManager(EngineType type) {
        switch (type) {
            case ZIP4J:
                engine = new Zip4jEngine();
                break;
            case ZIP:
                engine = new ZipEngine();
                break;
            case SEVENZIP:
                engine = new SevenZipJBindingEngine();
                break;
            case TAR:
                engine = new TarEngine();
                break;
            case RAR:
                engine = new RarEngine();
                break;
            case COPY:
                engine = new CopyEngine();
                break;
            default:
                // todo: 传context用getString
                throw new IllegalArgumentException("Unsupported engine: " + type);
        }
    }

    public String getExtractPath(String basePath, ImportConfig importConfig) {
        return engine.getExtractPath(basePath, importConfig);
    }

    public void startDecompression(DecompressConfig config, ImportConfig importConfig, DecompressCallback callback) {
        engine.decompress(config, importConfig, callback);
    }

    public DecompressEngine getEngine() {
        return engine;
    }

    public void setEngine(DecompressEngine engine) {
        this.engine = engine;
    }
}
