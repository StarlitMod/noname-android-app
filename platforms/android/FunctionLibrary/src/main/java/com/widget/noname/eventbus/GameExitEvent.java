package com.widget.noname.eventbus;

public class GameExitEvent {
    private final String message;

    public GameExitEvent(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }
}
