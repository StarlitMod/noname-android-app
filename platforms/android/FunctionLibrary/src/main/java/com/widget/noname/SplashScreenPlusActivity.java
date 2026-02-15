package com.widget.noname;

import android.os.Bundle;

import com.widget.noname.function.functionlibrary.R;

public class SplashScreenPlusActivity extends SplashScreenActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        default_video_raw = R.raw.splash_video_plus;
        super.onCreate(savedInstanceState);
    }
}
