package com.widget.noname.function.functionlibrary.data;

public class LogEntry {
    private final String message;
    private final long timestamp;

    private long id;

    public LogEntry(String message) {
        this.message = message;
        this.timestamp = System.currentTimeMillis();
    }

    public LogEntry(long id, String message) {
        this.id = id;
        this.message = message;
        this.timestamp = System.currentTimeMillis();
    }

    public String getMessage() {
        return message;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }
}
