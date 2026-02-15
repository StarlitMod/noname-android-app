package com.widget.noname.eventbus;

public class GameStartEvent {
    private final String message;

    public GameStartEvent(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }
}
