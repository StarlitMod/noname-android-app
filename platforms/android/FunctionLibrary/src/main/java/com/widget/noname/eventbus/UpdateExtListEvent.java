package com.widget.noname.eventbus;

public class UpdateExtListEvent {
    private String message;

    public UpdateExtListEvent(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }
}
