package com.widget.noname;

import android.os.Bundle;
import android.os.Handler;
import android.util.Log;
import android.view.View;
import android.view.ViewParent;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.viewpager2.widget.ViewPager2;

import com.kongzue.dialogx.util.DialogListBuilder;

public abstract class TutorialFragment extends Fragment {
    public static final String TAG = "TutorialFragment";
    ViewPager2 viewPager;
    private ViewPager2.OnPageChangeCallback pageChangeCallback;
    private boolean tutorialShown = false;
    private final Handler handler = new Handler();

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        tutorialShown = isTutorialCompleted();
    }

    @Override
    public void onResume() {
        super.onResume();

        // 在 onResume 中执行，确保 Fragment 已恢复
        handler.postDelayed(() -> {
            if (!isResumed() || tutorialShown) {
                return;
            }

            viewPager = findViewPager();
            Log.e(TAG, "viewPager: " + viewPager);

            if (viewPager != null) {
                setupPageChangeListener();

                // 初始检查
                if (viewPager.getCurrentItem() == getFragmentPosition()) {
                    showTutorialIfNeeded();
                }
            }
        }, 100);
    }

    private void setupPageChangeListener() {
        if (pageChangeCallback != null) {
            return;
        }

        pageChangeCallback = new ViewPager2.OnPageChangeCallback() {
            @Override
            public void onPageSelected(int position) {
                Log.e(TAG, "position: " + position);
                Log.e(TAG, "getFragmentPosition: " + getFragmentPosition());

                if (position == getFragmentPosition() && !tutorialShown) {
                    handler.postDelayed(() -> {
                        showTutorialIfNeeded();
                    }, 300);
                }
            }
        };
        viewPager.registerOnPageChangeCallback(pageChangeCallback);
    }

    private void showTutorialIfNeeded() {
        if (!isResumed() || tutorialShown) {
            return;
        }

        DialogListBuilder builder = createTutorial();
        builder.show();
        tutorialShown = true;
    }

    @Override
    public void onPause() {
        super.onPause();
        // 清除所有延迟任务
        handler.removeCallbacksAndMessages(null);
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        if (pageChangeCallback != null && viewPager != null) {
            viewPager.unregisterOnPageChangeCallback(pageChangeCallback);
            pageChangeCallback = null;
        }
        tutorialShown = false;
        handler.removeCallbacksAndMessages(null);
    }

    private ViewPager2 findViewPager() {
        ViewParent parent = getView() != null ? getView().getParent() : null;
        while (parent != null) {
            if (parent instanceof ViewPager2) {
                return (ViewPager2) parent;
            }
            parent = parent.getParent();
        }
        return null;
    }

    protected abstract int getFragmentPosition();

    protected abstract boolean isTutorialCompleted();

    protected abstract DialogListBuilder createTutorial();
}
