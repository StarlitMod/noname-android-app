package org.apache.cordova.devtools;

import android.annotation.SuppressLint;
import android.content.Context;
import android.util.AttributeSet;
import android.view.MotionEvent;
import androidx.appcompat.widget.AppCompatImageView;

/**
 * @author: liuzhenfeng
 * @function: 通过消费触摸事件，监听手指滑动距离的变化，设置浮窗的大小
 * @date: 2019-08-05  09:55
 */
public class ScaleImage extends AppCompatImageView {

    private float touchDownX = 0f;
    private float touchDownY = 0f;

    private OnScaledListener onScaledListener;

    public interface OnScaledListener {
        void onScaled(float x, float y, MotionEvent event);
    }

    public ScaleImage(Context context) {
        super(context);
    }

    public ScaleImage(Context context, AttributeSet attrs) {
        super(context, attrs);
    }

    public ScaleImage(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
    }

    public OnScaledListener getOnScaledListener() {
        return onScaledListener;
    }

    public void setOnScaledListener(OnScaledListener onScaledListener) {
        this.onScaledListener = onScaledListener;
    }

    @SuppressLint("ClickableViewAccessibility")
    @Override
    public boolean onTouchEvent(MotionEvent event) {
        if (event == null) {
            return super.onTouchEvent(event);
        }

        // 屏蔽掉浮窗的事件拦截，仅由自身消费
        if (getParent() != null) {
            getParent().requestDisallowInterceptTouchEvent(true);
        }

        switch (event.getAction()) {
            case MotionEvent.ACTION_DOWN:
                touchDownX = event.getX();
                touchDownY = event.getY();
                break;

            case MotionEvent.ACTION_MOVE:
                if (onScaledListener != null) {
                    float deltaX = event.getX() - touchDownX;
                    float deltaY = event.getY() - touchDownY;
                    onScaledListener.onScaled(deltaX, deltaY, event);
                }
                break;
        }

        return true;
    }
}
