package com.widget.noname.function;

import android.content.Context;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.FragmentActivity;
import androidx.lifecycle.ViewModelProvider;
import androidx.viewpager2.widget.ViewPager2;

import com.google.android.material.tabs.TabLayout;
import com.google.android.material.tabs.TabLayoutMediator;
import com.widget.noname.common.function.BaseFunction;
import com.widget.noname.eventbus.SettingsChangeEvent;
import com.widget.noname.eventbus.ThemeRefreshEvent;
import com.widget.noname.function.functionlibrary.data.ImportEventViewModel;
import com.widget.noname.function.functiontheme.R;
import com.widget.noname.function.functiontheme.adapter.ThemeFragmentAdapter;
import com.widget.noname.util.PagerHelper;

import org.greenrobot.eventbus.EventBus;
import org.greenrobot.eventbus.Subscribe;
import org.greenrobot.eventbus.ThreadMode;

public class FunctionTheme extends BaseFunction {
    private static final String TAG = "FunctionTheme";
    private final String[] fragments = new String[] {
            "主题管理"
    };;
    private ViewPager2 viewPager2 = null;
    private ImportEventViewModel viewModel;

    public FunctionTheme(@NonNull Context context) {
        super(context);
    }

    @Override
    public View onCreateView(Context context, @Nullable ViewGroup container) {
        return LayoutInflater.from(context).inflate(R.layout.function_theme, container, false);
    }

    @Override
    protected void onViewCreated(View view) {
        Log.d(TAG, "onViewCreated: ");
        super.onViewCreated(view);
        // 注册 EventBus
        if (!EventBus.getDefault().isRegistered(this)) {
            EventBus.getDefault().register(this);
        }

        viewPager2 = view.findViewById(R.id.view_pager2);
        viewPager2.setOrientation(ViewPager2.ORIENTATION_HORIZONTAL);

        // 将 context 强转为 FragmentActivity
        if (!(getContext() instanceof FragmentActivity)) {
            throw new IllegalStateException("Context must be an instance of FragmentActivity");
        }
        FragmentActivity activity = (FragmentActivity) getContext();
        // 创建 FragmentStateAdapter
        ThemeFragmentAdapter adapter = new ThemeFragmentAdapter(activity);
        adapter.addFragment(PagerHelper.SUB_FRAGMENT_THEME_SWITCH);
        viewPager2.setAdapter(adapter);
        // 切换：
        // viewPager2.setCurrentItem(int, boolean); // boolean表示是否启用滑动动画

        TabLayout tabLayout = view.findViewById(R.id.tab_layout);
        new TabLayoutMediator(tabLayout, viewPager2, (tab, position) -> tab.setText(fragments[position])).attach();

        viewModel = new ViewModelProvider(activity).get(ImportEventViewModel.class);
        viewModel.getNavigationEvent().observe(activity, funNameAndTabName -> {
            if (funNameAndTabName != null) {
                String[] split = funNameAndTabName.split("-");
                if (split.length == 2) {
                    String funName = split[0];
                    if (!funName.equals("主题")) return;
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
                            // 发送专门的刷新事件
                            EventBus.getDefault().post(new ThemeRefreshEvent());
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

    @Subscribe(threadMode = ThreadMode.MAIN)
    public void onSettingsChangeEvent(SettingsChangeEvent event) {
        switch (event.getKey()) {

        }
    }
}
