package com.widget.noname.function.functionsettings.preference;

import android.annotation.SuppressLint;
import android.app.Dialog;
import android.os.Bundle;
import android.view.View;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AlertDialog;
import androidx.fragment.app.Fragment;
import androidx.preference.DialogPreference;
import androidx.preference.ListPreference;
import androidx.preference.MultiSelectListPreference;
import androidx.preference.Preference;
import androidx.preference.EditTextPreference;
import androidx.preference.PreferenceFragmentCompat;

import com.kongzue.dialogx.dialogs.InputDialog;
import com.kongzue.dialogx.dialogs.MessageMenu;
import com.kongzue.dialogx.interfaces.BaseDialog;
import com.kongzue.dialogx.interfaces.OnInputDialogButtonClickListener;
import com.kongzue.dialogx.interfaces.OnMenuButtonClickListener;
import com.kongzue.dialogx.interfaces.OnMenuItemSelectListener;
import com.widget.noname.Settings;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.Set;

public class DialogXPreferenceFragmentCompat extends PreferenceFragmentCompat {
    @Override
    public void onCreatePreferences(@Nullable Bundle savedInstanceState, @Nullable String rootKey) {

    }

    @SuppressLint("RestrictedApi")
    @Override
    public void onDisplayPreferenceDialog(@NonNull Preference preference) {
        // 回调链检查
        boolean handled = false;
        if (getCallbackFragment() instanceof PreferenceFragmentCompat.OnPreferenceDisplayDialogCallback) {
            handled = ((PreferenceFragmentCompat.OnPreferenceDisplayDialogCallback) getCallbackFragment())
                    .onPreferenceDisplayDialog(this, preference);
        }
        for (Fragment callbackFragment = this; !handled && callbackFragment != null; callbackFragment = callbackFragment.getParentFragment()) {
            if (callbackFragment instanceof PreferenceFragmentCompat.OnPreferenceDisplayDialogCallback) {
                handled = ((PreferenceFragmentCompat.OnPreferenceDisplayDialogCallback) callbackFragment)
                        .onPreferenceDisplayDialog(this, preference);
            }
        }
        if (!handled && (getContext() instanceof PreferenceFragmentCompat.OnPreferenceDisplayDialogCallback)) {
            handled = ((PreferenceFragmentCompat.OnPreferenceDisplayDialogCallback) getContext())
                    .onPreferenceDisplayDialog(this, preference);
        }
        if (!handled && (getActivity() instanceof PreferenceFragmentCompat.OnPreferenceDisplayDialogCallback)) {
            handled = ((PreferenceFragmentCompat.OnPreferenceDisplayDialogCallback) getActivity())
                    .onPreferenceDisplayDialog(this, preference);
        }

        // 对话框检查
        if (handled) return;

        // 处理DialogPreference类型
        if (preference instanceof DialogPreference) {
            BaseDialog dialog = createDialog((DialogPreference) preference);
            if (dialog != null) {
                dialog.show();
            }
        }
    }

    private BaseDialog createDialog(DialogPreference preference) {
        if (preference instanceof EditTextPreference) {
            return createEditTextDialog((EditTextPreference) preference);
        } else if (preference instanceof ListPreference) {
            return createListDialog((ListPreference) preference);
        } else if (preference instanceof MultiSelectListPreference) {
            return createMultiSelectDialog((MultiSelectListPreference) preference);
        }
        return null;
    }

    private BaseDialog createEditTextDialog(EditTextPreference preference) {
        InputDialog inputDialog = InputDialog.build();
        inputDialog.setTitle(preference.getTitle());
        inputDialog.setMessage(preference.getDialogMessage());
        inputDialog.setInputText(preference.getText());
        inputDialog.setOkButton(android.R.string.ok, new OnInputDialogButtonClickListener<InputDialog>() {
            @Override
            public boolean onClick(InputDialog baseDialog, View v, String inputStr) {
                if (preference.callChangeListener(inputStr)) {
                    preference.setText(inputStr);
                }
                return false;
            }
        });
        inputDialog.setCancelButton(android.R.string.cancel);
        return inputDialog;
    }

    private BaseDialog createListDialog(ListPreference preference) {
        final int[] selectedIndex = {preference.findIndexOfValue(preference.getValue())};
        return MessageMenu.build()
                .setMenuList(preference.getEntries())
                .setTitle(preference.getTitle())
                .setAutoTintIconInLightOrDarkMode(true)
                .setShowSelectedBackgroundTips(Settings.getDialogTheme().equals("com.kongzue.dialogx.style.MIUIStyle"))
                .setOnMenuItemClickListener(new OnMenuItemSelectListener<>() {
                    @Override
                    public void onOneItemSelect(MessageMenu dialog, CharSequence text, int index, boolean select) {
                        selectedIndex[0] = index;
                    }
                }).setOkButton(android.R.string.ok, new OnMenuButtonClickListener<MessageMenu>() {
                    @Override
                    public boolean onClick(MessageMenu baseDialog, View v) {
                        // 更新当前值
                        var value = preference.getEntryValues()[selectedIndex[0]].toString();
                        if (preference.callChangeListener(value)) {
                            preference.setValue(value);
                        }
                        return false;
                    }
                })
                .setCancelButton(android.R.string.cancel)
                .setSelection(selectedIndex[0]);
    }

    private BaseDialog createMultiSelectDialog(MultiSelectListPreference preference) {
        ArrayList<Integer> selectMenuIndexArray = new ArrayList<>();

        // 根据当前选中的值设置初始选中项
        Set<String> currentValues = preference.getValues();
        CharSequence[] entryValues = preference.getEntryValues();

        for (int i = 0; i < entryValues.length; i++) {
            if (currentValues.contains(entryValues[i].toString())) {
                selectMenuIndexArray.add(i);
            }
        }

        return MessageMenu.build()
                .setMenuList(preference.getEntries())
                .setTitle(preference.getTitle())
                .setOnMenuItemClickListener(new OnMenuItemSelectListener<MessageMenu>() {
                    @Override
                    public void onMultiItemSelect(MessageMenu dialog, CharSequence[] text, int[] index) {
                        selectMenuIndexArray.clear();
                        for (int i : index) {
                            selectMenuIndexArray.add(i);
                        }
                    }
                })
                .setOkButton(android.R.string.ok, new OnMenuButtonClickListener<MessageMenu>() {
                    @Override
                    public boolean onClick(MessageMenu dialog, View v) {
                        Set<String> values = new HashSet<>();
                        for (int i = 0; i < preference.getEntryValues().length; i++) {
                            if (selectMenuIndexArray.contains(i)) {
                                values.add(preference.getEntryValues()[i].toString());
                            }
                        }
                        if (preference.callChangeListener(values)) {
                            preference.setValues(values);
                        }
                        return false;
                    }
                })
                .setCancelButton(android.R.string.cancel)
                .setSelection(selectMenuIndexArray);
    }
}
