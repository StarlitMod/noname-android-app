package com.widget.noname.eventbus;

public class SettingsChangeEvent {
    private final String key;

    public SettingsChangeEvent(String key) {
        this.key = key;
    }

    public String getKey() {
        return key;
    }
}
