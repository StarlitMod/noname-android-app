package com.widget.noname;

import java.util.List;

interface IShellCallback {
    void onLine(String line);
    void onFinished(int exitCode);
}