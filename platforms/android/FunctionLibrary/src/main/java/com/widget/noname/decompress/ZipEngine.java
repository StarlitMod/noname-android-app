package com.widget.noname.decompress;

import net.sf.sevenzipjbinding.ArchiveFormat;

public class ZipEngine extends SevenZipJBindingEngine {
    public ZipEngine() {
        super();
        this.archiveFormat = ArchiveFormat.ZIP;
    }
}
