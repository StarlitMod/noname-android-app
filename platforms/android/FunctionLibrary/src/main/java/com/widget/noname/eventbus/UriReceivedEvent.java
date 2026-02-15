package com.widget.noname.eventbus;

import android.net.Uri;

public class UriReceivedEvent {
    public Uri uri;

    public UriReceivedEvent(Uri uri) {
        this.uri = uri;
    }
}
