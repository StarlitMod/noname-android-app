package com.widget.noname.function.functionlibrary.data;

import android.os.Handler;
import android.os.Looper;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import java.util.ArrayList;
import java.util.List;

public class ImportEventViewModel extends ViewModel {
    private final MutableLiveData<String> navigationEvent = new MutableLiveData<>();

    public Handler mainHandler = new Handler(Looper.getMainLooper());

    private final MutableLiveData<List<LogEntry>> logList = new MutableLiveData<>();
    private final List<LogEntry> logs = new ArrayList<>();

    private long logEntryCounter = 0;

    public LiveData<List<LogEntry>> getLogList() {
        return logList;
    }

    public LiveData<String> getNavigationEvent() { return navigationEvent; }

    public void navigateTo(String functionName, String tabName) {
        navigationEvent.postValue(functionName + "-" + tabName);
    }

    public void postLogEvent(String msg) {
        mainHandler.post(() -> {
            LogEntry entry = new LogEntry(msg);
            entry.setId(logEntryCounter++);
            logs.add(entry);
            logList.setValue(new ArrayList<>(logs));
        });
    }
}
