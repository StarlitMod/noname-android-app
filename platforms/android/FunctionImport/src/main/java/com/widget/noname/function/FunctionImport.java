package com.widget.noname.function;

import static com.kongzue.dialogx.dialogs.PopTip.tip;

import android.content.Context;
import android.os.Environment;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.FragmentActivity;
import androidx.lifecycle.ViewModelProvider;
import androidx.viewpager2.widget.ViewPager2;

import com.alibaba.fastjson.JSON;
import com.google.android.material.tabs.TabLayout;
import com.google.android.material.tabs.TabLayoutMediator;
import com.kongzue.dialogx.dialogs.CustomDialog;
import com.kongzue.dialogx.dialogs.GuideDialog;
import com.kongzue.dialogx.dialogs.MessageDialog;
import com.tencent.mmkv.MMKV;
import com.widget.noname.common.util.FileConstant;
import com.widget.noname.function.functionimport.adapter.ImportFragmentAdapter;
import com.widget.noname.function.functionlibrary.data.ImportEventViewModel;
import com.widget.noname.function.functionimport.event.DirectoryAddedEvent;
import com.widget.noname.function.functionimport.R;
import com.widget.noname.common.function.BaseFunction;
import com.widget.noname.eventbus.MsgToActivity;

import org.greenrobot.eventbus.EventBus;
import org.greenrobot.eventbus.Subscribe;
import org.greenrobot.eventbus.ThreadMode;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

public class FunctionImport extends BaseFunction {
    private static final String TAG = "FunctionImport";
    private String[] fragments;
    private ViewPager2 viewPager2 = null;
    private ImportEventViewModel viewModel;
    public FunctionImport(@NonNull Context context) {
        super(context);
    }

    @Override
    public View onCreateView(Context context, @Nullable ViewGroup container) {
        return LayoutInflater.from(context).inflate(R.layout.function_import, container, false);
    }

    @Override
    protected void onViewCreated(View view) {
        super.onViewCreated(view);

        // 注册 EventBus
        if (!EventBus.getDefault().isRegistered(this)) {
            EventBus.getDefault().register(this);
        }

        init();

        viewPager2 = view.findViewById(R.id.view_pager2);
        viewPager2.setOrientation(ViewPager2.ORIENTATION_HORIZONTAL);

        // 将 context 强转为 FragmentActivity
        if (!(getContext() instanceof FragmentActivity)) {
            throw new IllegalStateException("Context must be an instance of FragmentActivity");
        }
        FragmentActivity activity = (FragmentActivity) getContext();
        // 创建 FragmentStateAdapter
        List<String> keys = Arrays.asList(fragments);
        ImportFragmentAdapter adapter = new ImportFragmentAdapter(activity, keys);
        viewPager2.setAdapter(adapter);
        // 切换：
        // viewPager2.setCurrentItem(int, boolean); // boolean表示是否启用滑动动画

        TabLayout tabLayout = view.findViewById(R.id.tab_layout);
        new TabLayoutMediator(tabLayout, viewPager2, (tab, position) -> {
            tab.setText(fragments[position]);

            // 为标签设置长按事件
            tab.view.setOnLongClickListener(v -> {
                showDeleteConfirmDialog(position);
                return true;
            });
        }).attach();

        viewModel = new ViewModelProvider(activity).get(ImportEventViewModel.class);
        viewModel.getNavigationEvent().observe(activity, funNameAndTabName -> {
            if (funNameAndTabName != null) {
                String[] split = funNameAndTabName.split("-");
                if (split.length == 2) {
                    String funName = split[0];
                    if (!funName.equals("导入")) return;
                    String tabName = split[1];
                    // 查找 tabName 在 fragments 数组中的位置
                    int targetPosition = -1;
                    for (int i = 0; i < fragments.length; i++) {
                        if (fragments[i].equals(tabName)) {
                            targetPosition = i;
                            break;
                        }
                    }
                    if (targetPosition != -1) {
                        int finalTargetPosition = targetPosition;
                        // 延迟 100ms 执行
                        new Handler(Looper.getMainLooper()).postDelayed(() -> {
                            viewPager2.setCurrentItem(finalTargetPosition, true); // true 表示启用滑动动画
                        }, 100);
                    }
                }
                else {
                    Log.e(TAG, "Invalid funNameAndTabName: " + funNameAndTabName);
                }
            }
        });
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        if (EventBus.getDefault().isRegistered(this)) {
            EventBus.getDefault().unregister(this);
        }
    }

    public void init() {
        MMKV mmkv = MMKV.defaultMMKV();
        // download目录无法授权
        String qqKey = "外部QQ";
        String qqPathKey = FileConstant.IMPORT_PATH + qqKey;

        // 使用 Set 防止重复（可选）
        Set<String> tabNameSet = new LinkedHashSet<>(); // 保持插入顺序

        // 设置“外部QQ”的默认路径
        if (!mmkv.containsKey(qqPathKey)) {
            String defaultPath = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS) + "/QQ";
            mmkv.putString(qqPathKey, defaultPath);
        }

        // 确保“外部QQ”在列表中（作为默认项）
        tabNameSet.add(qqKey); // Set 会自动去重

        //  读取用户保存的导入路径名列表
        if (mmkv.containsKey(FileConstant.IMPORT_PATHS)) {
            String savedPaths = mmkv.getString(FileConstant.IMPORT_PATHS, "[]");
            List<String> savedNames = JSON.parseArray(savedPaths, String.class);
            tabNameSet.addAll(savedNames);
        }

        List<String> tabNames = new ArrayList<>();
        //  添加固定功能页
        tabNames.add("导入");
        tabNames.add("添加目录");
        tabNames.add("迁移");
        tabNames.addAll(tabNameSet);

        // 赋值给 fragments（用于 ViewPager 的标题或 Fragment 列表）
        fragments = tabNames.toArray(new String[0]);
    }

    @Subscribe(threadMode = ThreadMode.MAIN)
    public void onDirectoryAddedEvent(DirectoryAddedEvent event) {
        refreshViewPager(event.getDirectoryName());
    }

    @Subscribe(threadMode = ThreadMode.MAIN)
    public void onMessageEvent(MsgToActivity msg) {
        switch (msg.type) {

        }
    }

    private void refreshViewPager(String directoryName) {
        // 重新初始化数据
        init();

        // 重新创建适配器
        if (viewPager2 != null && getContext() instanceof FragmentActivity) {
            FragmentActivity activity = (FragmentActivity) getContext();
            List<String> keys = Arrays.asList(fragments);
            ImportFragmentAdapter adapter = new ImportFragmentAdapter(activity, keys);
            viewPager2.setAdapter(adapter);

            // 重新关联TabLayout
            View view = obtainView();
            if (view != null) {
                TabLayout tabLayout = view.findViewById(R.id.tab_layout);
                final TabLayout.TabView[] tabView = {null};
                new TabLayoutMediator(tabLayout, viewPager2, (tab, position) -> {
                    String tabName = fragments[position];
                    tab.setText(tabName);
                    // 为标签设置长按事件
                    tab.view.setOnLongClickListener(v -> {
                        showDeleteConfirmDialog(position);
                        return true;
                    });
                    // 为标签设置引导
                    if (directoryName != null && directoryName.equals(tabName)) {
                        tabView[0] = tab.view;
                    }
                }).attach();
                if (tabView[0] != null) {
                    try {
                        var tabClass = TabLayout.TabView.class;
                        var declaredField = tabClass.getDeclaredField("textView");
                        declaredField.setAccessible(true);
                        var textView = (TextView) declaredField.get(tabView[0]);
                        GuideDialog.show(
                                textView,
                                GuideDialog.STAGE_LIGHT_TYPE.RECTANGLE,
                                com.widget.noname.function.functionlibrary.R.drawable.guide_hand
                        ).setAlign(CustomDialog.ALIGN.BOTTOM);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            }
        }
    }

    private void removeTabAt(int position) {
        // 从MMKV中移除对应的数据
        MMKV mmkv = MMKV.defaultMMKV();

        if (position >= fragments.length) return;

        // 获取要删除的标签名
        String tabNameToRemove = fragments[position];

        // 从IMPORT_PATHS列表中移除该标签
        if (mmkv.containsKey(FileConstant.IMPORT_PATHS)) {
            List<String> savedNames = JSON.parseArray(
                    mmkv.getString(FileConstant.IMPORT_PATHS, "[]"),
                    String.class
            );

            List<String> tabNamesList = new ArrayList<>(savedNames);
            tabNamesList.remove(tabNameToRemove);

            // 保存更新后的列表
            mmkv.putString(FileConstant.IMPORT_PATHS, JSON.toJSONString(tabNamesList));
        }

        // 移除该标签对应的路径
        String pathKey = FileConstant.IMPORT_PATH + tabNameToRemove;
        mmkv.remove(pathKey);

        // 刷新ViewPager
        refreshViewPager(null);
    }

    private void showDeleteConfirmDialog(int position) {
        String tabName = fragments[position];

        MessageDialog builder = MessageDialog.build();

        // 只有用户自定义的标签可以删除（排除前4个固定功能页）
        if (position < 4) {
            builder
                    .setTitle(com.widget.noname.function.functionlibrary.R.string.common_tip)
                    .setMessage(com.widget.noname.function.functionlibrary.R.string.import_error_cannot_delete_protected)
                    .setOkButton(android.R.string.ok, null);
        }
        else {
            builder
                    .setTitle(com.widget.noname.function.functionlibrary.R.string.common_tip)
                    .setMessage(getContext().getString(com.widget.noname.function.functionlibrary.R.string.import_dialog_confirm_delete, tabName))
                    .setOkButton(com.widget.noname.function.functionlibrary.R.string.common_action_delete, (dialog, which) -> {
                        removeTabAt(position);
                        return false;
                    })
                    .setCancelButton(android.R.string.cancel, null);
        }

        builder.show();
    }

}
