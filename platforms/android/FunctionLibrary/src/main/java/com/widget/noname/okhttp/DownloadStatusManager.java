package com.widget.noname.okhttp;

import androidx.lifecycle.MutableLiveData;

public class DownloadStatusManager {
    private static final DownloadStatusManager INSTANCE = new DownloadStatusManager();
    public final MutableLiveData<DownloadEvent> downloadEvent = new MutableLiveData<>();

    private DownloadStatusManager() {}

    public static DownloadStatusManager getInstance() {
        return INSTANCE;
    }

    public void postSuccess(String path) {
        downloadEvent.postValue(new DownloadEvent(DownloadEvent.Type.SUCCESS, path));
    }

    public void postFailure(String message) {
        downloadEvent.postValue(new DownloadEvent(DownloadEvent.Type.FAILURE, message));
    }

    public void postProgress(String progress) {
        downloadEvent.postValue(new DownloadEvent(DownloadEvent.Type.PROGRESS, progress));
    }

    public static class DownloadEvent {
        public enum Type { SUCCESS, FAILURE, PROGRESS }
        public final Type type;
        public final String data;

        public DownloadEvent(Type type, String data) {
            this.type = type;
            this.data = data;
        }
    }
}
