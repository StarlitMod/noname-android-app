package com.widget.noname.function.functionversion.subfragment;

import static android.content.Context.MODE_PRIVATE;
import static com.kongzue.dialogx.dialogs.PopTip.tip;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.alibaba.fastjson.JSONException;
import com.alibaba.fastjson.JSONObject;
import com.kongzue.dialogx.DialogX;
import com.kongzue.dialogx.dialogs.MessageDialog;
import com.kongzue.dialogx.util.DialogListBuilder;
import com.tencent.mmkv.MMKV;
import com.widget.noname.MyApplication;
import com.widget.noname.Settings;
import com.widget.noname.TutorialFragment;
import com.widget.noname.function.functionlibrary.bridge.OnJsBridgeCallback;
import com.widget.noname.common.util.FileConstant;
import com.widget.noname.function.functionlibrary.data.ExtensionInfo;
import com.widget.noname.eventbus.UpdateExtListEvent;
import com.widget.noname.function.functionversion.R;
import com.widget.noname.function.functionversion.adapter.ExtensionListAdapter;

import org.greenrobot.eventbus.EventBus;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class ExtManageFragment extends TutorialFragment {
    private static final String TAG = "ExtManageFragment";
    private ExtensionListAdapter adapter;
    public List<ExtensionInfo> extensionList = new ArrayList<>();
    private OnJsBridgeCallback bridgeCallback;
    private TextView noExtensionsText = null;

    // 忽略的扩展列表
    private static final List<String> IGNORED_EXTENSIONS = Arrays.asList(new String[] {
            "boss", "cardpile", "coin"
    });

    protected int getFragmentPosition() {
        return 2;
    }

    protected DialogListBuilder createTutorial() {
        Context context = this.getContext();
        DialogListBuilder builder = DialogX.showDialogList();
        String tutorialTitle = "教程";
        SharedPreferences prefs = context.getSharedPreferences("nonameyuri", MODE_PRIVATE);
        SharedPreferences.Editor editor = prefs.edit();

        builder.add(
                MessageDialog.build()
                        .setTitle(tutorialTitle + "——版本按钮——扩展界面")
                        .setMessage("扩展界面中，您可以查看当前设定的,衍生于libnoname/noname仓库的游戏主体的文件夹目录下的所有扩展信息，并且可以进行开启、关闭和删除操作。")
                        .setCancelable(false)
                        .setOkButton(android.R.string.ok)
        );

        builder.add(
                MessageDialog.build()
                        .setTitle(tutorialTitle + "——版本按钮——扩展界面")
                        .setMessage("便捷导入扩展包后，会跳转到本页面，但不会自动打开新导入的扩展，需要手动打开。\n您应当认识到，不兼容的扩展可能会使游戏崩溃，或者有恶意扩展会删除或上传您的数据等。\n导入任何HTML项目或者扩展时，出现任何问题，本应用的开发者概不负责。")
                        .setCancelable(false)
                        .setOkButton(android.R.string.ok)
        );

        builder.add(
                MessageDialog.build()
                        .setTitle(tutorialTitle + "——版本按钮——扩展界面")
                        .setMessage("本页面的教程结束，欢迎使用无名杀。")
                        .setCancelable(false)
                        .setOkButton(android.R.string.ok)
                        .onDismiss(dialog -> {
                            editor.putBoolean("readTutorialInExtManageFragment", true).apply();
                        })
        );

        return builder;
    }

    protected boolean isTutorialCompleted() {
        Context context = this.getContext();
        SharedPreferences prefs = context.getSharedPreferences("nonameyuri", MODE_PRIVATE);
        return prefs.getBoolean("readTutorialInExtManageFragment", false);
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_extension_manage, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        noExtensionsText = view.findViewById(R.id.no_extensions);
        noExtensionsText.setTypeface(MyApplication.getTypeface());
        noExtensionsText.setVisibility(View.GONE);

        RecyclerView recyclerView = view.findViewById(R.id.extension_recycler_view);
        recyclerView.setLayoutManager(new LinearLayoutManager(getContext()));

        adapter = new ExtensionListAdapter(getContext());
        adapter.setActionListener(new ExtensionListAdapter.OnExtensionActionListener() {
            @Override
            public void onToggleEnable(ExtensionInfo extension, boolean enable) {
                Log.e(TAG, "toggle enable: " + extension.getName() + " " + enable);
                extension.setEnabled(enable);
                if (bridgeCallback != null) {
                    if (enable) {
                        bridgeCallback.onExtensionEnable(extension.getName());
                    } else {
                        bridgeCallback.onExtensionDisable(extension.getName());
                    }
                }
            }

            @Override
            public void onRemove(ExtensionInfo extension) {
                if (bridgeCallback != null) {
                    MessageDialog.build()
                            .setTitle(com.widget.noname.function.functionlibrary.R.string.common_confirm_delete)
                            .setMessage(getString(com.widget.noname.function.functionlibrary.R.string.common_extension_dialog_confirm_delete, extension.getName()))
                            .setOkButton(android.R.string.ok, (baseDialog, view) -> {
                                // 删除扩展文件夹
                                String gameRootPath = MMKV.defaultMMKV().getString(FileConstant.GAME_PATH_KEY, null);
                                if (gameRootPath != null) {
                                    File extensionDir = new File(new File(gameRootPath, "extension"), extension.getName());
                                    deleteDirectory(extensionDir);
                                }
                                if (bridgeCallback != null) {
                                    bridgeCallback.onExtensionRemove(extension.getName());
                                }
                                extensionList.remove(extension);
                                adapter.setExtensionList(extensionList);
                                return false;
                            })
                            .setCancelButton(android.R.string.cancel)
                            .show();
                }
            }

        });

        recyclerView.setAdapter(adapter);
    }

    public void setBridgeCallback(OnJsBridgeCallback callback) {
        this.bridgeCallback = callback;
    }

    public void updateExtensionList() {
        String gameRootPath = MMKV.defaultMMKV().getString(FileConstant.GAME_PATH_KEY, null);
        if (gameRootPath == null) {
            return;
        }
        // extensionList.clear();
        File extensionsDir = new File(gameRootPath, "extension");
        if (extensionsDir.exists() && extensionsDir.isDirectory()) {
            extensionList.clear();
            String[] extensions = extensionsDir.list();
            if (extensions == null) {
                return;
            }
            for (String ext : extensions) {
                if (IGNORED_EXTENSIONS.contains(ext)) {
                    continue;
                }
                File extDir = new File(extensionsDir, ext);
                if (extDir.exists() && extDir.isDirectory()) {
                    File infoFile = new File(extDir, "info.json");
                    File extensionFile = new File(extDir, "extension.js");
                    File extensionTsFile = new File(extDir, "extension.ts");
                    if (infoFile.exists()) {
                        try {
                            String infoJson = readFileToString(infoFile);
                            addExtensionInfo(ext, infoJson);
                        } catch (IOException e) {
                            Log.e(TAG, "读取info.json文件失败: " + e.getMessage());
                        }
                    }
                    // 没有info.json
                    else if (extensionFile.exists() || extensionTsFile.exists()) {
                        ExtensionInfo info = new ExtensionInfo();
                        info.setName(ext);
                        info.setIntro(getString(com.widget.noname.function.functionlibrary.R.string.common_extension_error_no_info_json));
                        info.setAuthor("null");
                        info.setDiskURL("null");
                        info.setForumURL("null");
                        info.setVersion("null");
                        extensionList.add(info);
                    }
                }
            }
            adapter.setExtensionList(extensionList);
        }
        else {
            extensionList.clear();
        }
        if (extensionList.isEmpty()) {
            noExtensionsText.setVisibility(View.VISIBLE);
        }
        else {
            noExtensionsText.setVisibility(View.GONE);
        }
        EventBus.getDefault().post(new UpdateExtListEvent("获取扩展列表"));
    }

    public void addExtensionInfo(String extName, String infoJson) {
        Log.d(TAG, "addExtensionInfo: " + extName);
        ExtensionInfo info = new ExtensionInfo();
        try {
            JSONObject jsonObject = JSONObject.parseObject(infoJson);
            if (jsonObject.getString("name") != null) {
                info.setName(jsonObject.getString("name"));
            }
            else {
                info.setName(extName);
            }
            info.setIntro(jsonObject.getString("intro"));
            info.setAuthor(jsonObject.getString("author"));
            info.setDiskURL(jsonObject.getString("diskURL"));
            info.setForumURL(jsonObject.getString("forumURL"));
            info.setVersion(jsonObject.getString("version"));

        } catch (JSONException e) {
            e.printStackTrace();

            info.setName(extName);
            info.setIntro(getString(com.widget.noname.function.functionlibrary.R.string.common_extension_error_no_info_json));
            info.setAuthor("null");
            info.setDiskURL("null");
            info.setForumURL("null");
            info.setVersion("null");
        }

        extensionList.add(info);
    }

    public void changeExtensionInfo(ExtensionInfo info, String extName, String infoJson) {
        Log.d(TAG, "changeExtensionInfo: " + extName);
        try {
            JSONObject jsonObject = JSONObject.parseObject(infoJson);
            if (jsonObject.getString("name") != null) {
                info.setName(jsonObject.getString("name"));
            }
            else {
                info.setName(extName);
            }
            info.setIntro(jsonObject.getString("intro"));
            info.setAuthor(jsonObject.getString("author"));
            info.setDiskURL(jsonObject.getString("diskURL"));
            info.setForumURL(jsonObject.getString("forumURL"));
            info.setVersion(jsonObject.getString("version"));

        } catch (JSONException e) {
            e.printStackTrace();

            info.setName(extName);
            info.setIntro(getString(com.widget.noname.function.functionlibrary.R.string.common_extension_error_no_info_json));
            info.setAuthor("null");
            info.setDiskURL("null");
            info.setForumURL("null");
            info.setVersion("null");
        }
    }

    public void updateExtensionState(String extName, boolean enabled) {
        getActivity().runOnUiThread(() -> {
            for (ExtensionInfo info : extensionList) {
                if (info.getName().equals(extName)) {
                    info.setEnabled(enabled);
                    adapter.setExtensionList(extensionList);
                    break;
                }
            }
        });
    }

    private String readFileToString(File file) throws IOException {
        StringBuilder content = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
            String line;
            while ((line = reader.readLine()) != null) {
                content.append(line);
            }
        }
        return content.toString();
    }

    private boolean deleteDirectory(File dir) {
        if (dir.isDirectory()) {
            String[] children = dir.list();
            if (children != null) {
                for (String child : children) {
                    boolean success = deleteDirectory(new File(dir, child));
                    if (!success) {
                        return false;
                    }
                }
            }
        }
        return dir.delete();
    }

    @Override
    public void onResume() {
        super.onResume();
        String gameRootPath = MMKV.defaultMMKV().getString(FileConstant.GAME_PATH_KEY, null);
        if (gameRootPath == null) {
            tip(com.widget.noname.function.functionlibrary.R.string.gamemain_error_not_set).iconError().show();
        }
        else {
            updateExtensionList();
        }
    }
}

