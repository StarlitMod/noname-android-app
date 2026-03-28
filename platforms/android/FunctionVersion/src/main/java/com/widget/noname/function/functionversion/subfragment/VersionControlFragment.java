package com.widget.noname.function.functionversion.subfragment;

import static android.content.Context.MODE_PRIVATE;
import static com.kongzue.dialogx.dialogs.PopTip.tip;

import android.Manifest;
import android.annotation.SuppressLint;
import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.os.Environment;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.animation.AnimationUtils;
import android.widget.Button;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.kongzue.dialogx.DialogX;
import com.kongzue.dialogx.dialogs.MessageDialog;
import com.kongzue.dialogx.dialogs.WaitDialog;
import com.kongzue.dialogx.util.DialogListBuilder;
import com.permissionx.guolindev.PermissionX;
import com.tencent.mmkv.MMKV;
import com.widget.noname.MyApplication;
import com.widget.noname.Settings;
import com.widget.noname.TutorialFragment;
import com.widget.noname.function.functionversion.R;
import com.widget.noname.function.functionversion.adapter.VersionListRecyclerAdapter;
import com.widget.noname.common.util.FileConstant;
import com.widget.noname.function.functionlibrary.data.VersionData;
import com.widget.noname.eventbus.MsgVersionControl;
import com.widget.noname.function.functionlibrary.listener.VersionControlItemListener;
import com.widget.noname.util.FileUtil;
import com.widget.noname.util.JavaPathUtil;

import org.greenrobot.eventbus.EventBus;
import org.greenrobot.eventbus.Subscribe;
import org.greenrobot.eventbus.ThreadMode;

import java.io.File;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

import io.reactivex.rxjava3.android.schedulers.AndroidSchedulers;
import io.reactivex.rxjava3.core.Observable;
import io.reactivex.rxjava3.schedulers.Schedulers;

public class VersionControlFragment extends TutorialFragment implements View.OnClickListener, VersionControlItemListener {
    private static final String TAG = "VersionControlFragment";

    private final DateFormat dateTimeFormat = SimpleDateFormat.getDateTimeInstance();

    private RecyclerView versionListView = null;
    private VersionListRecyclerAdapter adapter = null;
    private TextView loadingText = null;

    protected int getFragmentPosition() {
        return 1;
    }

    protected DialogListBuilder createTutorial() {
        Context context = this.getContext();
        DialogListBuilder builder = DialogX.showDialogList();
        String tutorialTitle = "教程";
        SharedPreferences prefs = context.getSharedPreferences("nonameyuri", MODE_PRIVATE);
        SharedPreferences.Editor editor = prefs.edit();

        boolean isBetaVersion = isBetaVersion();
        if (isBetaVersion) {
            builder.add(
                    MessageDialog.build()
                            .setTitle(tutorialTitle + "——版本按钮——版本界面")
                            .setMessage("检测到您是内测版，是否跳过本教程？")
                            .setCancelable(false)
                            .setOkButton(android.R.string.ok, (dialog, v) -> {
                                builder.clear();
                                editor.putBoolean("readTutorialInVersionControlFragment", true).apply();
                                return false;
                            })
                            .setCancelButton(android.R.string.cancel)
            );
        }

        builder.add(
                MessageDialog.build()
                        .setTitle(tutorialTitle + "——版本按钮——版本界面")
                        .setMessage("资源界面中，您可以查看当前所有游戏主体的资源路径信息，并且可以进行设为主体和删除操作。")
                        .setCancelable(false)
                        .setOkButton(android.R.string.ok)
        );

        builder.add(
                MessageDialog.build()
                        .setTitle(tutorialTitle + "——版本按钮——版本界面")
                        .setMessage("由于WebView的数据与游戏主体目录有名称上的绑定，所以暂时不支持已有的游戏主体进行重命名操作。")
                        .setCancelable(false)
                        .setOkButton(android.R.string.ok)
        );

        builder.add(
                MessageDialog.build()
                        .setTitle(tutorialTitle + "——版本按钮——版本界面")
                        .setMessage("在低版本安卓中，支持读取Documents/noname下的文件夹作为游戏主体。\n您还可以通过外部文件管理器复制或移动文件夹到本应用的files文件夹下作为一个独立的游戏主体。\n如果要删除一个游戏主体，请确认是否有需要备份保留的内容，删除操作不能撤销。")
                        .setCancelable(false)
                        .setOkButton(android.R.string.ok)
        );

        builder.add(
                MessageDialog.build()
                        .setTitle(tutorialTitle + "——版本按钮——版本界面")
                        .setMessage("本页面的教程结束，欢迎使用无名杀。")
                        .setCancelable(false)
                        .setOkButton(android.R.string.ok)
                        .onDismiss(dialog -> {
                            editor.putBoolean("readTutorialInVersionControlFragment", true).apply();
                        })
        );

        return builder;
    }

    protected boolean isTutorialCompleted() {
        Context context = this.getContext();
        SharedPreferences prefs = context.getSharedPreferences("nonameyuri", MODE_PRIVATE);
        return prefs.getBoolean("readTutorialInVersionControlFragment", false);
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_version_control, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        Button startButton = view.findViewById(R.id.import_game_button);
        startButton.setTypeface(MyApplication.getTypeface());
        startButton.setOnClickListener(this);

        loadingText = view.findViewById(R.id.loading_text);
        loadingText.setTypeface(MyApplication.getTypeface());

        versionListView = view.findViewById(R.id.version_list_recycler);
        adapter = new VersionListRecyclerAdapter(getContext());
        adapter.setItemClickListener(this);
        LinearLayoutManager mLinearLayoutManager = new LinearLayoutManager(getContext(), LinearLayoutManager.VERTICAL, false);
        versionListView.setLayoutManager(mLinearLayoutManager);
        versionListView.setLayoutAnimation(AnimationUtils.loadLayoutAnimation(getContext(), R.anim.versioin_list_anim));
        versionListView.setAdapter(adapter);
        String json = MMKV.defaultMMKV().decodeString(FileConstant.VERSION_LIST_KEY);
        JSONArray array = JSON.parseArray(json);

        if (array != null) {
            List<VersionData> lists = array.toJavaList(VersionData.class);
            adapter.replaceList(lists);
            loadingText.setVisibility(View.GONE);
        } else {
            onClick(startButton);
        }
    }

    private void findAllGameFileInRootView(boolean includeSd) {
        MyApplication.getThreadPool().execute(() -> {
            File root = JavaPathUtil.getAppRoot(getContext());
            List<File> list = new ArrayList<>(FileUtil.findGameInPath(root));
            // 包括documents/noname目录，高版本安卓不支持使用File读取
            if (includeSd) {
                File sd = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOCUMENTS);

                if (sd != null) {
                    File noname = new File(sd.getAbsoluteFile() + "/noname");

                    if (!noname.exists()) {
                        noname.mkdirs();
                    }
                    list.addAll(FileUtil.findGameInPath(noname));
                }
            }

            List<VersionData> verList = new ArrayList<>();

            for (int i = 0; i < list.size(); i++) {
                File file = list.get(i);
                VersionData data = new VersionData();
                data.setDate(dateTimeFormat.format(file.lastModified()));
                data.setName(file.getName());
                data.setPath(file.getPath());
                verList.add(data);
            }

            versionListView.post(() -> {
                adapter.replaceList(verList);
                loadingText.setVisibility(View.GONE);
            });
        });
    }

    @Subscribe(threadMode = ThreadMode.MAIN)
    public void onExtraZipFile(MsgVersionControl msg) {
        if (msg.getMsgType() == MsgVersionControl.MSG_TYPE_UPDATE_LIST) {
            updateVersionList();
        } else if (msg.getMsgType() == MsgVersionControl.MSG_TYPE_CHANGE_ASSET_FINISH) {
            Settings.askForRestart(getContext());
        }
    }

    @Override
    public void onStop() {
        super.onStop();
        EventBus.getDefault().unregister(this);
    }

    public void updateVersionList() {
        PermissionX.init(this)
                .permissions(Manifest.permission.READ_EXTERNAL_STORAGE, Manifest.permission.WRITE_EXTERNAL_STORAGE)
                .request((allGranted, grantedList, deniedList) -> findAllGameFileInRootView(allGranted));
    }

    @Override
    public void onStart() {
        super.onStart();

        EventBus.getDefault().register(this);
    }

    @Override
    public void onClick(View v) {
        if (v.getId() == R.id.import_game_button) {
            loadingText.setVisibility(View.VISIBLE);
            adapter.clearAll();
            updateVersionList();
        }
    }

    @SuppressLint("NotifyDataSetChanged")
    @Override
    public void onSetPathItemClick(VersionData data) {
        MMKV.defaultMMKV().putString(FileConstant.GAME_PATH_KEY, data.getPath());
        adapter.setCurrentPath(data.getPath());
        data.setSelected(true);
        adapter.notifyDataSetChanged();

        // MSG_TYPE_CHANGE_ASSET_FINISH触发重启询问
        MsgVersionControl msg = new MsgVersionControl();
        msg.setMsgType(MsgVersionControl.MSG_TYPE_CHANGE_ASSET_FINISH);
        EventBus.getDefault().post(msg);
    }

    @SuppressLint("CheckResult")
    @Override
    public void onItemDelete(VersionData data) {
        WaitDialog.show("Please Wait!");
        Context context = this.getContext();
        Observable.create(emitter -> {
            try {
                File file = new File(data.getPath());
                File WebViewDataDir = new File(context.getDataDir(), "app_webview_" + data.getName());
                File WebViewCacheDir = new File(context.getCacheDir(), "app_webview_" + data.getName());
                delete(file);
                delete(WebViewDataDir);
                delete(WebViewCacheDir);
                emitter.onNext(true);
            } catch (Exception e) {
                emitter.onError(e);
            }
        }).subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe(obj -> {
                    tip(com.widget.noname.function.functionlibrary.R.string.common_status_delete_success).iconSuccess().show();
                    String path = new File(data.getPath()).getAbsolutePath();

                    if (path.equals(MMKV.defaultMMKV().getString(FileConstant.GAME_PATH_KEY, null))) {
                        MMKV.defaultMMKV().putString(FileConstant.GAME_PATH_KEY, null);
                    }

                    updateVersionList();
                    WaitDialog.dismiss();
                }, throwable -> {
                    tip(com.widget.noname.function.functionlibrary.R.string.common_error_delete_failed).iconError().show();
                    WaitDialog.dismiss();
                    throwable.printStackTrace();
                });
    }

    public void delete(File file) {
        if (!file.exists()) return;

        if (!file.isFile() && file.list() != null) {
            File[] files = file.listFiles();

            if (files != null) {
                for (File a : files) {
                    delete(a);
                }
            }
        }

        file.delete();
        Log.e(TAG, "删除了" + file.getName());
    }
}
