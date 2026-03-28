package com.widget.noname.function.functionimport.subfragment;

import static android.content.Context.MODE_PRIVATE;
import static com.kongzue.dialogx.dialogs.PopTip.tip;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;

import com.alibaba.fastjson.JSON;
import com.kongzue.dialogx.DialogX;
import com.kongzue.dialogx.dialogs.CustomDialog;
import com.kongzue.dialogx.dialogs.GuideDialog;
import com.kongzue.dialogx.dialogs.MessageDialog;
import com.kongzue.dialogx.util.DialogListBuilder;
import com.widget.noname.File;
import com.kongzue.filedialog.FileDialog;
import com.kongzue.filedialog.interfaces.FileSelectCallBack;
import com.tencent.mmkv.MMKV;
import com.widget.noname.Settings;
import com.widget.noname.TutorialFragment;
import com.widget.noname.common.util.FileConstant;
import com.widget.noname.util.DialogXUtil;
import com.widget.noname.util.StorageHelper;
import com.widget.noname.function.functionimport.event.DirectoryAddedEvent;
import com.widget.noname.function.functionimport.R;

import org.greenrobot.eventbus.EventBus;

import java.util.ArrayList;
import java.util.List;

public class ManualDirectorySelectFragment extends TutorialFragment {
    private static final String TAG = "ManualDirectorySelectFragment";
    private static final int REQUEST_CODE_OPEN_DOCUMENT_TREE = 1003;
    private EditText tabNameEditText;
    private Button selectDirectoryButton;
    private Button selectSAFDirectoryButton;
    private Button saveButton;
    private String selectedDirectoryPath;
    private Uri selectedDirectoryUri;
    private LinearLayout selectDirectoryLayout;

    protected int getFragmentPosition() {
        return 1;
    };

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
                            .setTitle(tutorialTitle + "——导入按钮——添加目录界面")
                            .setMessage("检测到您是内测版，是否跳过本教程？")
                            .setCancelable(false)
                            .setOkButton(android.R.string.ok, (dialog, v) -> {
                                builder.clear();
                                editor.putBoolean("readTutorialInManualDirectorySelectFragment", true).apply();
                                return false;
                            })
                            .setCancelButton(android.R.string.cancel)
            );
        }

        builder.add(
                MessageDialog.build()
                        .setTitle(tutorialTitle + "——导入按钮——添加目录界面")
                        .setMessage("添加目录界面中，您可以添加一个您系统中的一个可读目录，此目录下的文件将可以快速导入至游戏中您指定的某一游戏主体中。")
                        .setCancelable(false)
                        .setOkButton(android.R.string.ok)
        );

        builder.add(
                GuideDialog.build()
                        .baseView(tabNameEditText)
                        .setStageLightType(GuideDialog.STAGE_LIGHT_TYPE.RECTANGLE)
                        .setAlign(CustomDialog.ALIGN.TOP_CENTER)
                        .onShow(dialog -> {
                            DialogXUtil.startFlashingAnimation((GuideDialog) dialog, 2); // 闪烁2轮
                        })
        );

        builder.add(
                MessageDialog.build()
                        .setTitle(tutorialTitle + "——导入按钮——添加目录界面")
                        .setMessage("在这里输入便捷导入目录的名称，您可以输入任意不重复的名称。")
                        .setCancelable(false)
                        .setOkButton(android.R.string.ok)
        );

        builder.add(
                GuideDialog.build()
                        .baseView(selectDirectoryLayout)
                        .setStageLightType(GuideDialog.STAGE_LIGHT_TYPE.RECTANGLE)
                        .setAlign(CustomDialog.ALIGN.TOP_CENTER)
                        .onShow(dialog -> {
                            DialogXUtil.startFlashingAnimation((GuideDialog) dialog, 2); // 闪烁2轮
                        })
        );

        builder.add(
                MessageDialog.build()
                        .setTitle(tutorialTitle + "——导入按钮——添加目录界面")
                        .setMessage("这两个按钮是选择文件夹的不同方式。\n左边使用SAF框架选择文件夹，右边在低版本安卓使用存储权限来选择文件夹，高版本需要使用Shizuku授权来选择文件夹。\n存储访问框架 (SAF) 是在 Android 4.4（API 级别 19） 中引入的一种文件访问机制，旨在让用户方便地在不同的存储介质（如内部存储、外部 SD 卡、云存储）之间选择文件或目录。通过 SAF，用户可以使用统一的接口访问各种类型的存储位置，而无需直接依赖底层文件路径。\nShizuku 可以帮助普通应用借助一个由 app_process 启动的 Java 进程直接以 adb 或 root 特权使用系统 API。")
                        .setCancelable(false)
                        .setOkButton(android.R.string.ok)
        );

        builder.add(
                GuideDialog.build()
                        .baseView(saveButton)
                        .setStageLightType(GuideDialog.STAGE_LIGHT_TYPE.RECTANGLE)
                        .setAlign(CustomDialog.ALIGN.TOP_CENTER)
                        .onShow(dialog -> {
                            DialogXUtil.startFlashingAnimation((GuideDialog) dialog, 2); // 闪烁2轮
                        })
        );

        builder.add(
                MessageDialog.build()
                        .setTitle(tutorialTitle + "——导入按钮——添加目录界面")
                        .setMessage("填写完标签名称以及选择完文件夹后，点击保存，将在此页面新增一个标签页来显示您选择的文件夹，且可以通过长按删除。")
                        .setCancelable(false)
                        .setOkButton(android.R.string.ok)
        );

        builder.add(
                MessageDialog.build()
                        .setTitle(tutorialTitle + "——导入按钮——添加目录界面")
                        .setMessage("本页面的教程结束，欢迎使用无名杀。")
                        .setCancelable(false)
                        .setOkButton(android.R.string.ok)
                        .onDismiss(dialog -> {
                            editor.putBoolean("readTutorialInManualDirectorySelectFragment", true).apply();
                        })
        );

        return builder;
    }

    protected boolean isTutorialCompleted() {
        Context context = this.getContext();
        SharedPreferences prefs = context.getSharedPreferences("nonameyuri", MODE_PRIVATE);
        return prefs.getBoolean("readTutorialInManualDirectorySelectFragment", false);
    };

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.sub_fragment_manual_directory_select, container, false);

        initViews(view);
        setupListeners();

        return view;
    }

    private void initViews(View view) {
        tabNameEditText = view.findViewById(R.id.tab_name_edit_text);
        selectSAFDirectoryButton = view.findViewById(R.id.select_saf_directory_button);
        selectDirectoryButton = view.findViewById(R.id.select_directory_button);
        saveButton = view.findViewById(R.id.save_button);
        selectDirectoryLayout = view.findViewById(R.id.select_directory_layout);
    }

    private void setupListeners() {
        selectSAFDirectoryButton.setOnClickListener(v -> selectSAFDirectory());

        // 选择目录按钮
        selectDirectoryButton.setOnClickListener(v -> selectDirectory());

        // 保存按钮
        saveButton.setOnClickListener(v -> saveDirectory());
    }

    private void selectSAFDirectory() {
        Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT_TREE);
        startActivityForResult(intent, REQUEST_CODE_OPEN_DOCUMENT_TREE);
    }

    private void selectDirectory() {
        FileDialog.build()
                .setMaxSelectionNumber(1)
                .setTitle(getString(com.widget.noname.function.functionlibrary.R.string.import_action_select_directory))
                .setShowFileDate(true)
                .selectFolder(new FileSelectCallBack() {
                    public void onSelect(File file, String filePath) {
                        tip(getString(com.widget.noname.function.functionlibrary.R.string.import_status_directory_selected) + ": " + filePath).iconSuccess().show();
                        selectedDirectoryUri = Uri.fromFile(file);
                        selectedDirectoryPath = filePath;
                        selectDirectoryButton.setText(com.widget.noname.function.functionlibrary.R.string.import_status_directory_selected);
                        Log.e(TAG, "getScheme: " + selectedDirectoryUri.getScheme());
                    }
                });
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == REQUEST_CODE_OPEN_DOCUMENT_TREE && resultCode == Activity.RESULT_OK) {
            if (data != null && data.getData() != null) {
                selectedDirectoryUri = data.getData();
                selectedDirectoryPath = selectedDirectoryUri.toString();
                selectDirectoryButton.setText(com.widget.noname.function.functionlibrary.R.string.import_status_directory_selected);
            }
        }
    }

    private void saveDirectory() {
        if (!Settings.hasAgreedToPrivacyPolicy()) {
            tip(com.widget.noname.function.functionlibrary.R.string.permission_require_privacy_agreement).iconError().show();
            return;
        }
        String tabName = tabNameEditText.getText().toString().trim();
        if (tabName.isEmpty()) {
            tip(com.widget.noname.function.functionlibrary.R.string.config_hint_input_tag_name).iconError().show();
            return;
        }

        if (selectedDirectoryPath == null) {
            tip(com.widget.noname.function.functionlibrary.R.string.common_prompt_select_directory).iconError().show();
            return;
        }

        saveSelectedDirectory(tabName, selectedDirectoryUri);
        tip(com.widget.noname.function.functionlibrary.R.string.config_toast_save_success).iconSuccess().show();
        // 返回到导入页面
        getParentFragmentManager().popBackStack();
    }

    private void saveSelectedDirectory(String tabName, Uri treeUri) {
        MMKV mmkv = MMKV.defaultMMKV();

        // 1. 保存 tab名称 -> URI 的映射
        String importUriKey = FileConstant.IMPORT_URI + tabName;
        mmkv.putString(importUriKey, treeUri.toString());

        // 2. 更新 IMPORT_PATHS 列表
        if (!updateImportPathsList(tabName)) {
            return;
        }

        // 3. 获取持久化权限
        StorageHelper.takePersistableUriPermission(requireContext(), treeUri);

        if (getActivity() != null && !getActivity().isFinishing()) {
            getParentFragmentManager().popBackStack();
        }

        // 延迟返回，让用户看到提示
        new Handler(Looper.getMainLooper()).postDelayed(() -> {
            if (getActivity() != null && !getActivity().isFinishing()) {
                // 5. 提示可以删除
                tip(getString(com.widget.noname.function.functionlibrary.R.string.import_toast_directory_added, tabName)).iconSuccess().show();
                tip(com.widget.noname.function.functionlibrary.R.string.import_hint_long_press_delete).show();
            }

            // 5. 使用 EventBus 通知刷新
            EventBus.getDefault().post(new DirectoryAddedEvent(tabName));
        }, 500);
    }

    private boolean updateImportPathsList(String newTabName) {
        MMKV mmkv = MMKV.defaultMMKV();

        // 读取现有的导入路径名列表
        List<String> existingNames;
        if (mmkv.containsKey(FileConstant.IMPORT_PATHS)) {
            existingNames = JSON.parseArray(
                    mmkv.getString(FileConstant.IMPORT_PATHS, "[]"),
                    String.class
            );
        }
        else {
            existingNames = new ArrayList<>();
        }

        // 检查新名称是否已存在
        for (String name : existingNames) {
            if (name.equals(newTabName)) {
                tip(com.widget.noname.function.functionlibrary.R.string.config_error_tag_exists).iconError().show();
                return false;
            }
        }

        // 如果不存在，则添加到列表中
        List<String> namesList = new ArrayList<>(existingNames);
        namesList.add(newTabName);
        String[] updatedNames = namesList.toArray(new String[0]);
        mmkv.putString(FileConstant.IMPORT_PATHS, JSON.toJSONString(updatedNames));

        // 如果是shizuku选择的file协议目录
        if ("file".equals(selectedDirectoryUri.getScheme())) {
            String importPath = FileConstant.IMPORT_PATH + newTabName;
            MMKV.defaultMMKV().putString(importPath, selectedDirectoryPath);
        }
        return true;
    }

}


