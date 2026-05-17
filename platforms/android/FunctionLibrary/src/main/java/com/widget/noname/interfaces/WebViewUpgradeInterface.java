package com.widget.noname.interfaces;

import android.content.Context;

public interface WebViewUpgradeInterface {
    void upgrade(Context context, Runnable callback);

    void changeWebviewProvider();
}
