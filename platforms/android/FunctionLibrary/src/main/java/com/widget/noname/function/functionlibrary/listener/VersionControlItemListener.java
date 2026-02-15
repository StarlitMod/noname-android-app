package com.widget.noname.function.functionlibrary.listener;

import com.widget.noname.function.functionlibrary.data.VersionData;

public interface VersionControlItemListener {

    void onSetPathItemClick(VersionData data);

    void onItemDelete(VersionData data);
}
