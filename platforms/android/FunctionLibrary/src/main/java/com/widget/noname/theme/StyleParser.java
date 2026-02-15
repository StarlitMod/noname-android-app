package com.widget.noname.theme;

import android.content.res.Resources;
import android.content.res.TypedArray;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

public class StyleParser {
    public static void applyStyleToView(View view, String styleName, Resources resources) {
        // 从外部资源中获取样式
        int styleId = resources.getIdentifier(styleName, "style", "com.example.theme");
        if (styleId != 0) {
            TypedArray a = resources.obtainTypedArray(styleId);
            // 应用样式属性到视图
            applyAttributes(view, a);
            a.recycle();
        }
    }

    private static void applyAttributes(View view, TypedArray attributes) {
        // 根据视图类型应用对应属性
        if (view instanceof TextView) {
            applyTextViewAttributes((TextView) view, attributes);
        } else if (view instanceof Button) {
            applyButtonAttributes((Button) view, attributes);
        }
        // 其他视图类型...
    }

    private static void applyTextViewAttributes(TextView textView, TypedArray attributes) {

    }

    private static void applyButtonAttributes(Button button, TypedArray attributes) {

    }
}
