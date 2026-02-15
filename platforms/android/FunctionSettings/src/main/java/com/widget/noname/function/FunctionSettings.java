package com.widget.noname.function;

import static com.kongzue.dialogx.dialogs.PopTip.tip;

import android.content.Context;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.FragmentActivity;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentTransaction;

import com.widget.noname.common.function.BaseFunction;
import com.widget.noname.function.functionsettings.R;
import com.widget.noname.function.functionsettings.subfragment.SettingsFragment;

public class FunctionSettings extends BaseFunction {
    private static final String TAG = "FunctionSettings";

    public FunctionSettings(@NonNull Context context) {
        super(context);
    }

    @Override
    public View onCreateView(Context context, @Nullable ViewGroup container) {
        return LayoutInflater.from(context).inflate(R.layout.function_settings, container, false);
    }

    @Override
    protected void onViewCreated(View view) {
        super.onViewCreated(view);
        initSettingsFragment();
    }

    private void initSettingsFragment() {
        SettingsFragment settingsFragment = new SettingsFragment();
        FragmentManager fragmentManager = null;
        if (getContext() instanceof FragmentActivity) {
            fragmentManager = ((FragmentActivity) getContext()).getSupportFragmentManager();
        }
        if (fragmentManager != null) {
            FragmentTransaction transaction = fragmentManager.beginTransaction();
            transaction.replace(R.id.settings_container, settingsFragment);
            transaction.commit();
        }
        else {
            Log.e(TAG, "getExtensions: fragmentManager is null");
            tip("fragmentManager is null").iconError().show();
        }
    }
}
