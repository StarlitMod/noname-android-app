package com.widget.noname.common.manager;

import android.graphics.Typeface;
import android.util.Log;

import java.util.HashMap;

public enum FontManager {
    INSTANCE;

    private static final String FONT_XINWEI = "xinwei";

    private HashMap<String, Typeface> typefaceHashMap = new HashMap<>();

    public static FontManager getInstance() {
        return INSTANCE;
    }

    public void setTypeFace(String key, Typeface typeface) {
        typefaceHashMap.put(key, typeface);
        Log.e("FontManager", String.valueOf(typefaceHashMap));
    }

    public Typeface getTypeface() {
        return getTypeface(FONT_XINWEI);
    }

    public Typeface getTypeface(String key) {
        return typefaceHashMap.get(key);
    }
}
