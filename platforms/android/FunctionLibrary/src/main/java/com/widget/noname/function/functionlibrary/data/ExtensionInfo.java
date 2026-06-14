package com.widget.noname.function.functionlibrary.data;

public class ExtensionInfo {
    private String directoryName;
    private String name;
    private String intro;
    private String author;
    private String diskURL;
    private String forumURL;
    private String version;
    private boolean enabled;

    public ExtensionInfo() {
    }

    public ExtensionInfo(String directoryName, String name, String intro, String author, String diskURL, String forumURL, String version, boolean enabled) {
        this.directoryName = directoryName;
        this.name = name;
        this.intro = intro;
        this.author = author;
        this.diskURL = diskURL;
        this.forumURL = forumURL;
        this.version = version;
        this.enabled = enabled;
    }

    public String getDirectoryName() {
        return directoryName == null ? "" : directoryName;
    }

    public void setDirectoryName(String directoryName) {
        this.directoryName = directoryName;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getIntro() {
        return intro == null ? "" : intro;
    }

    public void setIntro(String intro) {
        this.intro = intro;
    }

    public String getAuthor() {
        return author == null ? "" : author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getDiskURL() {
        return diskURL == null ? "" : diskURL;
    }

    public void setDiskURL(String diskURL) {
        this.diskURL = diskURL;
    }

    public String getForumURL() {
        return forumURL == null ? "" : forumURL;
    }

    public void setForumURL(String forumURL) {
        this.forumURL = forumURL;
    }

    public String getVersion() {
        return version == null ? "" : version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }
}
