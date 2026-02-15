package com.widget.noname.theme;

import android.annotation.SuppressLint;
import android.content.Context;
import android.media.MediaPlayer;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.VideoView;

import androidx.annotation.Nullable;

import com.kongzue.dialogx.dialogs.CustomDialog;
import com.kongzue.dialogx.interfaces.DialogLifecycleCallback;
import com.kongzue.dialogx.interfaces.OnBindView;

public class CustomDialogBuilder {
    private CustomDialog dialog;
    private final Context context;
    private final int layoutResId;
    private final Config config;
    private TextView dialog_title;
    private String title;
    private TextView dialog_message;
    private String message;
    private ViewGroup dialog_main;
    private View btnOk, btnCancel;
    private OnDialogButtonClickListener okClickListener = (dialog, v) -> dialog.dismiss();
    private OnDialogButtonClickListener cancelClickListener = (dialog, v) -> dialog.dismiss();
    // dialog_main里显示的view
    private View view;
    private OnDialogViewCreatedListener viewCreatedListener;
    public enum DialogType {
        Text,
        Web,
        List,
        MultiSelect,
        Video,
    }

    public CustomDialogBuilder(Context context, Config config) {
        this.context = context;
        this.config = config;
        this.layoutResId = config.layoutResId;
    }

    public CustomDialogBuilder build(DialogType type) {
        dialog = CustomDialog.build(new OnBindView<> (layoutResId) {
            @Override
            public void onBind(final CustomDialog dialog, View v) {
                dialog_title = v.findViewById(config.dialogTitleId);
                if (title != null) dialog_title.setText(title);
                dialog_message = v.findViewById(config.dialogMessageId);
                if (message != null) dialog_message.setText(message);
                dialog_main = v.findViewById(config.dialogMainId);
                btnOk = v.findViewById(config.dialogButtonOkId);
                btnCancel = v.findViewById(config.dialogButtonCancelId);

                // 设置外部传入的点击监听器
                if (btnOk != null) {
                    if (okClickListener != null) {
                        btnOk.setOnClickListener(v1 -> okClickListener.onClick(dialog, v1));
                    }
                    else {
                        btnOk.setVisibility(View.GONE);
                    }
                }
                if (btnCancel != null) {
                    if (cancelClickListener != null) {
                        btnCancel.setOnClickListener(v2 -> cancelClickListener.onClick(dialog, v2));
                    }
                    else {
                        btnCancel.setVisibility(View.GONE);
                    }
                }

                switch (type) {
                    case Text:
                        view = createEditText();
                        break;
                    case Web:
                        view = createWebView();
                        break;
                    case List:
                        view = createListView();
                        break;
                    case MultiSelect:
                        view = createMultiSelectListView();
                        break;
                    case Video:
                        view = createVideoView();
                        break;
                }

                LinearLayout.LayoutParams layoutParams = new LinearLayout.LayoutParams(
                        LinearLayout.LayoutParams.MATCH_PARENT,
                        LinearLayout.LayoutParams.MATCH_PARENT
                );
                view.setLayoutParams(layoutParams);
                dialog_main.addView(view);
                if (viewCreatedListener != null) {
                    viewCreatedListener.onViewCreated(view, type);
                }
            }
        }).setDialogLifecycleCallback(new DialogLifecycleCallback<>() {
            @Override
            public void onShow(CustomDialog dialog) {

            }

            @Override
            public void onDismiss(CustomDialog dialog) {
                // 销毁view
                if (view != null) {
                    view.setVisibility(View.GONE);
                    switch (type) {
                        case Web:
                            ((WebView) view).destroy();
                            break;
                        case Video:
                            ((VideoView) view).stopPlayback();
                            break;
                    }
                }
                if (view != null && dialog_main != null) {
                    dialog_main.removeView(view);
                }
                view = null;
            }
        });
        return this;
    }

    public CustomDialogBuilder build(DialogType type, @Nullable OnDialogButtonClickListener okListener, @Nullable OnDialogButtonClickListener cancelListener) {
        setOkClickListener(okListener);
        setCancelClickListener(cancelListener);
        return build(type);
    }

    // 传入null隐藏对应按钮
    public CustomDialogBuilder setOkClickListener(OnDialogButtonClickListener listener) {
        this.okClickListener = listener;
        return this;
    }

    public CustomDialogBuilder setCancelClickListener(OnDialogButtonClickListener listener) {
        this.cancelClickListener = listener;
        return this;
    }

    private EditText createEditText() {
        EditText editText = new EditText(context);
        editText.setHint("请输入内容");
        return editText;
    }

    @SuppressLint("SetJavaScriptEnabled")
    private WebView createWebView() {
        WebView webView = new WebView(context);
        webView.getSettings().setJavaScriptEnabled(true);
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                // 在WebView中打开链接，而不是使用默认的浏览器应用
                view.loadUrl(url);
                return true;
            }
        });
        return webView;
    }

    private ListView createListView() {
        ListView listView = new ListView(context);
        return listView;
    }

    private ListView createMultiSelectListView() {
        ListView listView = new ListView(context);
        return listView;
    }

    private VideoView createVideoView() {
        VideoView videoView = new VideoView(context);
        videoView.setOnPreparedListener(new MediaPlayer.OnPreparedListener() {
            @Override
            public void onPrepared(MediaPlayer mp) {
                // 不循环播放
                mp.setLooping(false);
            }
        });
        return videoView;
    }

    public CustomDialogBuilder setOnDialogViewCreatedListener(OnDialogViewCreatedListener listener) {
        this.viewCreatedListener = listener;
        return this;
    }

    public CustomDialogBuilder setTitle(String title) {
        if (dialog_title != null) {
            dialog_title.setText(title);
        }
        else {
            this.title = title;
        }
        return this;
    }

    public CustomDialogBuilder setMessage(String message) {
        if (dialog_message != null) {
            dialog_message.setText(message);
        }
        else {
            this.message = message;
        }
        return this;
    }

    public CustomDialog show() {
        dialog.show();
        return dialog;
    }

    /**
     * 配置项
     */
    public static class Config {
        private int layoutResId;
        private int dialogTitleId;
        private int dialogMessageId;
        private int dialogMainId;
        private int dialogButtonOkId;
        private int dialogButtonCancelId;

        public Config() {
        }

        public Config(int layoutResId, int dialogTitleId, int dialogMessageId, int dialogMainId, int dialogButtonOkId, int dialogButtonCancelId) {
            this.layoutResId = layoutResId;
            this.dialogTitleId = dialogTitleId;
            this.dialogMessageId = dialogMessageId;
            this.dialogMainId = dialogMainId;
            this.dialogButtonOkId = dialogButtonOkId;
            this.dialogButtonCancelId = dialogButtonCancelId;
        }

        public int getLayoutResId() {
            return layoutResId;
        }

        public void setLayoutResId(int layoutResId) {
            this.layoutResId = layoutResId;
        }

        public int getDialogTitleId() {
            return dialogTitleId;
        }

        public void setDialogTitleId(int dialogTitleId) {
            this.dialogTitleId = dialogTitleId;
        }

        public int getDialogMessageId() {
            return dialogMessageId;
        }

        public void setDialogMessageId(int dialogMessageId) {
            this.dialogMessageId = dialogMessageId;
        }

        public int getDialogMainId() {
            return dialogMainId;
        }

        public void setDialogMainId(int dialogMainId) {
            this.dialogMainId = dialogMainId;
        }

        public int getDialogButtonOkId() {
            return dialogButtonOkId;
        }

        public void setDialogButtonOkId(int dialogButtonOkId) {
            this.dialogButtonOkId = dialogButtonOkId;
        }

        public int getDialogButtonCancelId() {
            return dialogButtonCancelId;
        }

        public void setDialogButtonCancelId(int dialogButtonCancelId) {
            this.dialogButtonCancelId = dialogButtonCancelId;
        }
    }

    /**
     * 创建回调
     */
    public interface OnDialogViewCreatedListener {
        void onViewCreated(View view, DialogType type);
    }

    /**
     * 按钮回调
     */
    public interface OnDialogButtonClickListener {
        void onClick(CustomDialog dialog, View view);
    }
}
