package com.widget.noname.engine;

import android.content.Context;
import android.view.View;

import com.kongzue.dialogx.dialogs.InputDialog;
import com.kongzue.dialogx.dialogs.MessageDialog;
import com.kongzue.dialogx.interfaces.OnDialogButtonClickListener;
import com.kongzue.dialogx.interfaces.OnInputDialogButtonClickListener;

public class DialogsHelper {
    private final Context context;

    private MessageDialog lastHandledDialog;

    public DialogsHelper(Context context) {
        this.context = context;
    }

    public void showAlert(String message, final DialogsHelper.Result result) {
        lastHandledDialog = MessageDialog.show("Alert", message)
                .setCancelable(false)
                .setOkButton(android.R.string.ok, new OnDialogButtonClickListener<MessageDialog>() {
                    @Override
                    public boolean onClick(MessageDialog baseDialog, View v) {
                        result.gotResult(true, null);
                        return false;
                    }
                });
    }

    public void showConfirm(String message, final DialogsHelper.Result result) {
        lastHandledDialog = MessageDialog.show("Confirm", message)
                .setCancelable(false)
                .setOkButton(android.R.string.ok, new OnDialogButtonClickListener<MessageDialog>() {
                    @Override
                    public boolean onClick(MessageDialog baseDialog, View v) {
                        result.gotResult(true, null);
                        return false;
                    }
                })
                .setCancelButton(android.R.string.cancel, new OnDialogButtonClickListener<MessageDialog>() {
                    @Override
                    public boolean onClick(MessageDialog baseDialog, View v) {
                        result.gotResult(false, null);
                        return false;
                    }
                });
    }

    public void showPrompt(String message, String defaultValue, final DialogsHelper.Result result) {
        lastHandledDialog = InputDialog.build()
                .setCancelable(false)
                .setTitle("Prompt")
                .setMessage(message)
                .setInputText(defaultValue)
                .setOkButton(android.R.string.ok, new OnInputDialogButtonClickListener<InputDialog>() {
                    @Override
                    public boolean onClick(InputDialog baseDialog, View v, String inputStr) {
                        result.gotResult(true, inputStr);
                        return false;
                    }
                })
                .setCancelButton(android.R.string.cancel, new OnInputDialogButtonClickListener<InputDialog>() {
                    @Override
                    public boolean onClick(InputDialog baseDialog, View v, String inputStr) {
                        result.gotResult(false, null);
                        return false;
                    }
                }).show();
    }

    public void destroyLastDialog() {
        if (lastHandledDialog != null){
            lastHandledDialog.dismiss();
        }
    }

    public interface Result {
        public void gotResult(boolean success, String value);
    }
}
