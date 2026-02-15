package com.widget.noname.function.functionversion.databinding;

import android.content.Context;

import androidx.databinding.BaseObservable;
import androidx.databinding.Bindable;

import com.widget.noname.function.functionversion.BR;
import com.widget.noname.util.GitHubUtil;

public class AssetFragmentData extends BaseObservable {
    public static final int STATUS_CHECK_UPDATE = 1; // 刷新最新版
    public static final int STATUS_CHECKING = 2; // 刷新中
    public static final int STATUS_CLICK_UPDATE = 3; // 点击更新
    public static final int STATUS_UPDATING = 4; // 更新中
    public static final int STATUS_NEWEST = 5; // 已是最新
    public static final int STATUS_DOWNLOAD_FAIL = 6; // 已是最新

    private String configName = null;
    private String assetPath = null;
    private String version = null;
    private String assetSize = null;
    private String updateVersion = null;
    private String updateChangeLog = null;
    private String updateUri = null;
    private String downloadProgress = null;
    private String updateBtnStr = null;
    private int updateStatus = -1;
    private boolean canUpdate = false;
    private GitHubUtil.GitHubRelease release = null;

    private final Context context;

    public AssetFragmentData(Context context) {
        this.context = context;
    }

    @Bindable
    public String getUpdateBtnStr() {
        return updateBtnStr;
    }

    public void setUpdateBtnStr(String updateBtnStr) {
        this.updateBtnStr = updateBtnStr;
        notifyPropertyChanged(BR.updateBtnStr);
    }

    @Bindable
    public int getUpdateStatus() {
        return updateStatus;
    }

    public void setUpdateStatus(int updateStatus) {
        this.updateStatus = updateStatus;

        setCanUpdate((updateStatus == AssetFragmentData.STATUS_CHECK_UPDATE)
                || (updateStatus == AssetFragmentData.STATUS_CLICK_UPDATE));

        switch (updateStatus) {
            case STATUS_CHECK_UPDATE: {
                setUpdateBtnStr(context.getString(com.widget.noname.function.functionlibrary.R.string.common_action_check_update));
                break;
            }
            case STATUS_CLICK_UPDATE: {
                setUpdateBtnStr(context.getString(com.widget.noname.function.functionlibrary.R.string.common_action_click_to_update));
                break;
            }
            case STATUS_NEWEST: {
                setUpdateBtnStr(context.getString(com.widget.noname.function.functionlibrary.R.string.common_status_already_latest_version));
                break;
            }
            case STATUS_UPDATING: {
                setUpdateBtnStr(context.getString(com.widget.noname.function.functionlibrary.R.string.common_progress_updating));
                break;
            }
            case STATUS_CHECKING: {
                setUpdateBtnStr(context.getString(com.widget.noname.function.functionlibrary.R.string.common_progress_refreshing));
                break;
            }
            case STATUS_DOWNLOAD_FAIL: {
                setUpdateBtnStr(context.getString(com.widget.noname.function.functionlibrary.R.string.notification_status_download_failed));
                break;
            }
        }

        notifyPropertyChanged(BR.updateStatus);
    }

    @Bindable
    public String getDownloadProgress() {
        return downloadProgress;
    }

    public void setDownloadProgress(String downloadProgress) {
        this.downloadProgress = downloadProgress;
        notifyPropertyChanged(BR.downloadProgress);
    }

    @Bindable
    public boolean isCanUpdate() {
        return canUpdate;
    }

    public void setCanUpdate(boolean canUpdate) {
        this.canUpdate = canUpdate;
        notifyPropertyChanged(BR.canUpdate);
    }

    @Bindable
    public String getUpdateUri() {
        return updateUri;
    }

    public void setUpdateUri(String updateUri) {
        this.updateUri = updateUri;
        notifyPropertyChanged(BR.updateUri);
    }

    @Bindable
    public String getUpdateVersion() {
        return updateVersion;
    }

    @Bindable
    public String getUpdateChangeLog() {
        return updateChangeLog;
    }

    @Bindable
    public String getAssetPath() {
        return assetPath;
    }

    @Bindable
    public String getConfigName() {
        return configName;
    }

    public void setUpdateVersion(String updateVersion) {
        this.updateVersion = updateVersion;
        notifyPropertyChanged(BR.updateVersion);
    }

    public void setUpdateChangeLog(String updateChangeLog) {
        this.updateChangeLog = updateChangeLog;
        notifyPropertyChanged(BR.updateChangeLog);
    }

    public void setAssetPath(String assetPath) {
        this.assetPath = assetPath;
        notifyPropertyChanged(BR.assetPath);
    }

    public void setConfigName(String configName) {
        this.configName = configName;
        notifyPropertyChanged(BR.configName);
    }

    @Bindable
    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
        notifyPropertyChanged(BR.version);
    }

    @Bindable
    public String getAssetSize() {
        return assetSize;
    }

    public void setAssetSize(String assetSize) {
        this.assetSize = assetSize;
        notifyPropertyChanged(BR.assetSize);
    }

    @Bindable
    public GitHubUtil.GitHubRelease getRelease() {
        return release;
    }

    public void setRelease(GitHubUtil.GitHubRelease release) {
        this.release = release;
        notifyPropertyChanged(BR.release);
    }
}
