package com.widget.noname.theme;

import com.kongzue.dialogx.interfaces.BaseDialog;

public class DialogXThemeAdapter {
    public static void applyCustomStyle(BaseDialog baseDialog, String styleName) {
        // 根据样式名称获取对应的样式配置
        switch (styleName) {
            case "material_style":
                applyMaterialStyle(baseDialog);
                break;
            case "custom_style":
                applyCustomStyle(baseDialog);
                break;
            default:
                applyDefaultStyle(baseDialog);
        }
    }

    private static void applyMaterialStyle(BaseDialog dialog) {
        // 应用Material设计风格
    }

    private static void applyCustomStyle(BaseDialog dialog) {
        // 应用自定义样式
    }

    private static void applyDefaultStyle(BaseDialog dialog) {
        // 应用默认样式
    }
}