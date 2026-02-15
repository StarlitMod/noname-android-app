package com.widget.noname.decompress;

import net.sf.sevenzipjbinding.ArchiveFormat;

public class TarEngine extends SevenZipJBindingEngine {
    public TarEngine() {
        super();
        this.archiveFormat = ArchiveFormat.TAR;
    }
}
