package com.widget.noname.function.functionimport.event;

public class DirectoryAddedEvent {
    private String directoryName;

    public DirectoryAddedEvent(String directoryName) {
        this.directoryName = directoryName;
    }

    public String getDirectoryName() {
        return directoryName;
    }
}
