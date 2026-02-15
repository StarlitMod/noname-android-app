package com.widget.noname.util;

import android.animation.Animator;
import android.animation.AnimatorListenerAdapter;
import android.animation.ValueAnimator;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import android.view.View;
import android.widget.TextView;

import androidx.annotation.NonNull;

import com.kongzue.dialogx.dialogs.GuideDialog;
import com.kongzue.dialogx.dialogs.MessageDialog;
import com.widget.noname.GrammarLocatorDef;
import com.widget.noname.MyApplication;

import io.noties.markwon.Markwon;
import io.noties.markwon.ext.tables.TablePlugin;
import io.noties.markwon.html.HtmlPlugin;
import io.noties.markwon.image.glide.GlideImagesPlugin;
import io.noties.markwon.syntax.Prism4jThemeDefault;
import io.noties.markwon.syntax.SyntaxHighlightPlugin;
import io.noties.prism4j.Prism4j;

public class DialogXUtil {
    private static final String TAG = "DialogXUtil";

    private static final Markwon markwon = Markwon.builder(MyApplication.getContext())
            // HTML
            .usePlugin(HtmlPlugin.create())
            // 图片
            .usePlugin(GlideImagesPlugin.create(MyApplication.getContext()))
            // 代码高亮
            .usePlugin(SyntaxHighlightPlugin.create(new Prism4j(new GrammarLocatorDef()), Prism4jThemeDefault.create()))
            // 表格
            .usePlugin(TablePlugin.create(MyApplication.getContext()))
            .build();;

    // GuideDialog闪烁动画方法，闪烁flashCount + 1次后消失。期间不可点击
    public static void startFlashingAnimation(@NonNull GuideDialog guideDialog, int flashCount) {
        View dialogView = guideDialog.getDialogView();
        if (dialogView == null) return;
        Handler handler = new Handler(Looper.getMainLooper());

        // 控制闪烁速度的参数
        final int SHOW_DURATION = 200;    // 显示持续时间（毫秒）
        final int HIDE_DURATION = 200;    // 隐藏持续时间（毫秒）
        final int INTERVAL = 500;         // 显示和隐藏之间的间隔（毫秒）

        // 计算总时间：每个闪烁周期 = 显示 + 间隔 + 隐藏 + 间隔
        long totalDuration = flashCount * (SHOW_DURATION + INTERVAL + HIDE_DURATION + INTERVAL);

        ValueAnimator animator = ValueAnimator.ofFloat(0f, 1f);
        animator.setDuration(totalDuration);

        // 用于跟踪状态
        final long[] phaseDuration = {SHOW_DURATION, INTERVAL, HIDE_DURATION, INTERVAL};

        animator.addUpdateListener(animation -> {
            float progress = animation.getAnimatedFraction();
            long elapsed = (long) (progress * totalDuration);

            // 计算当前处于哪个阶段
            long accumulated = 0;
            int currentFlash = 0;
            int currentPhase = 0;

            for (int i = 0; i < flashCount; i++) {
                for (int j = 0; j < 4; j++) {
                    if (elapsed < accumulated + phaseDuration[j]) {
                        currentFlash = i;
                        currentPhase = j;
                        break;
                    }
                    accumulated += phaseDuration[j];
                }
                if (currentPhase != 0) break;
            }

            // 根据阶段设置透明度
            switch (currentPhase) {
                case 0: // SHOW - 淡入
                    float showProgress = (float)(elapsed - accumulated) / SHOW_DURATION;
                    dialogView.setAlpha(showProgress);
                    break;
                case 1: // PAUSE_SHOW - 保持显示
                    dialogView.setAlpha(1f);
                    break;
                case 2: // HIDE - 淡出
                    float hideProgress = 1f - (float)(elapsed - accumulated) / HIDE_DURATION;
                    dialogView.setAlpha(hideProgress);
                    break;
                case 3: // PAUSE_HIDE - 保持隐藏
                    dialogView.setAlpha(0f);
                    break;
            }
        });

        animator.addListener(new AnimatorListenerAdapter() {
            @Override
            public void onAnimationEnd(Animator animation) {
                // 闪烁结束后淡出关闭
                dialogView.animate()
                        .alpha(0f)
                        .setDuration(300)
                        .withEndAction(guideDialog::dismiss)
                        .start();
            }

            @Override
            public void onAnimationCancel(Animator animation) {
                handler.removeCallbacksAndMessages(null);
            }
        });

        // 延迟开始
        handler.postDelayed(animator::start, 800);

        guideDialog
                // 点击了原按钮
                .setOnStageLightPathClickListener((dialog, v) -> true)
                // 点击了外围遮罩
                .setOnBackgroundMaskClickListener((dialog, v) -> true)
                // 清理
                .onDismiss(dialog -> {
                    animator.cancel();
                    handler.removeCallbacksAndMessages(null);
                });
    }

    // GuideDialog闪烁动画方法，闪烁flashCount + 1次后消失。期间可点击按钮触发点击事件
    public static void startFlashingAnimation(@NonNull GuideDialog guideDialog, int flashCount, @NonNull View clickView) {
        View dialogView = guideDialog.getDialogView();
        if (dialogView == null) return;
        Handler handler = new Handler(Looper.getMainLooper());

        // 控制闪烁速度的参数
        final int SHOW_DURATION = 200;    // 显示持续时间（毫秒）
        final int HIDE_DURATION = 200;    // 隐藏持续时间（毫秒）
        final int INTERVAL = 500;         // 显示和隐藏之间的间隔（毫秒）

        // 计算总时间：每个闪烁周期 = 显示 + 间隔 + 隐藏 + 间隔
        long totalDuration = flashCount * (SHOW_DURATION + INTERVAL + HIDE_DURATION + INTERVAL);

        ValueAnimator animator = ValueAnimator.ofFloat(0f, 1f);
        animator.setDuration(totalDuration);

        // 用于跟踪状态
        final long[] phaseDuration = {SHOW_DURATION, INTERVAL, HIDE_DURATION, INTERVAL};

        animator.addUpdateListener(animation -> {
            float progress = animation.getAnimatedFraction();
            long elapsed = (long) (progress * totalDuration);

            // 计算当前处于哪个阶段
            long accumulated = 0;
            int currentFlash = 0;
            int currentPhase = 0;

            for (int i = 0; i < flashCount; i++) {
                for (int j = 0; j < 4; j++) {
                    if (elapsed < accumulated + phaseDuration[j]) {
                        currentFlash = i;
                        currentPhase = j;
                        break;
                    }
                    accumulated += phaseDuration[j];
                }
                if (currentPhase != 0) break;
            }

            // 根据阶段设置透明度
            switch (currentPhase) {
                case 0: // SHOW - 淡入
                    float showProgress = (float)(elapsed - accumulated) / SHOW_DURATION;
                    dialogView.setAlpha(showProgress);
                    break;
                case 1: // PAUSE_SHOW - 保持显示
                    dialogView.setAlpha(1f);
                    break;
                case 2: // HIDE - 淡出
                    float hideProgress = 1f - (float)(elapsed - accumulated) / HIDE_DURATION;
                    dialogView.setAlpha(hideProgress);
                    break;
                case 3: // PAUSE_HIDE - 保持隐藏
                    dialogView.setAlpha(0f);
                    break;
            }
        });

        animator.addListener(new AnimatorListenerAdapter() {
            @Override
            public void onAnimationEnd(Animator animation) {
                // 闪烁结束后淡出关闭
                dialogView.animate()
                        .alpha(0f)
                        .setDuration(300)
                        .withEndAction(guideDialog::dismiss)
                        .start();
            }

            @Override
            public void onAnimationCancel(Animator animation) {
                handler.removeCallbacksAndMessages(null);
            }
        });

        // 延迟开始
        handler.postDelayed(animator::start, 800);

        guideDialog
                // 点击了原按钮
                .setOnStageLightPathClickListener((dialog, v) -> {
                    clickView.callOnClick();
                    dialog.dismiss();
                    return true;
                })
                // 点击了外围遮罩
                .setOnBackgroundMaskClickListener((dialog, v) -> true)
                // 清理
                .onDismiss(dialog -> {
                    animator.cancel();
                    handler.removeCallbacksAndMessages(null);
                });
    }

    // MessageDialog设置显示Markdown
    public static void setupMarkdownForMessage(@NonNull MessageDialog dialog) {
        if (dialog.getDialogView() == null) {
            dialog.onShow(dialogX -> {
                TextView msgTextView = dialogX.getDialogView().findViewById(com.kongzue.dialogx.R.id.txt_dialog_tip);
                if (msgTextView != null) markwon.setMarkdown(msgTextView, msgTextView.getText().toString());
                else Log.e(TAG, "setupMarkdownForMessage: msgTextView is null");
            });

        }
        else {
            TextView msgTextView = dialog.getDialogView().findViewById(com.kongzue.dialogx.R.id.txt_dialog_tip);
            if (msgTextView != null) markwon.setMarkdown(msgTextView, msgTextView.getText().toString());
            else Log.e(TAG, "setupMarkdownForMessage: msgTextView is null");
        }
    }
}
