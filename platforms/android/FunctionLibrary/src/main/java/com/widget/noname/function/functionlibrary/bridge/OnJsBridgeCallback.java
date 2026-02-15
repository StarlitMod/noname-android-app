package com.widget.noname.function.functionlibrary.bridge;

public interface OnJsBridgeCallback {

    void onExtensionGet(String[] extensions);

    void onExtensionStateGet(String ext, boolean state);

    void onExtensionEnable(String ext);

    void onExtensionDisable(String ext);

    void onExtensionRemove(String ext);

    void onServeIpSet();

    void onPageStarted();

    void onRecentIpUpdate(String ips);

    void onCloseDB();
}
