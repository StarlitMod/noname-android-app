package com.widget.noname.function;

import static android.content.Context.MODE_PRIVATE;
import static com.kongzue.dialogx.dialogs.PopTip.tip;

import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.content.SharedPreferences;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.os.Message;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.FragmentActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.kongzue.dialogx.DialogX;
import com.kongzue.dialogx.dialogs.CustomDialog;
import com.kongzue.dialogx.dialogs.GuideDialog;
import com.kongzue.dialogx.dialogs.MessageDialog;
import com.kongzue.dialogx.dialogs.PopMenu;
import com.kongzue.dialogx.util.DialogListBuilder;
import com.tencent.mmkv.MMKV;
import com.widget.noname.MyApplication;
import com.widget.noname.Settings;
import com.widget.noname.function.functionlibrary.data.MessageData;
import com.widget.noname.function.functionlibrary.data.MessageType;
import com.widget.noname.eventbus.MsgToActivity;
import com.widget.noname.common.function.BaseFunction;
import com.widget.noname.common.manager.ThreadManager;
import com.widget.noname.common.util.FileConstant;
import com.widget.noname.common.util.NetUtil;
import com.widget.noname.function.functionlibrary.adapter.MessageRecyclerAdapter;
import com.widget.noname.function.functionserver.NonameWebSocketServer;
import com.widget.noname.function.functionserver.R;
import com.widget.noname.function.functionserver.view.RedDotTextView;
import com.widget.noname.function.functionlibrary.listener.MessageAdapterListener;
import com.widget.noname.util.DialogXUtil;

import org.greenrobot.eventbus.EventBus;

import java.net.UnknownHostException;
import java.util.Arrays;

public class FunctionServer extends BaseFunction implements View.OnClickListener, MessageAdapterListener {
    private static final int MSG_UPDATE_SERVER_IPADDR = 1;
    private static final int MSG_UPDATE_SERVER_START = 2;
    private static final int MSG_UPDATE_SCREEN_MESSAGE = 3;

    private static final int SERVER_PORT = 8080;

    private static final Object serverLock = new Object();

    private static NonameWebSocketServer server = null;
    private Handler handler = null;

    private Button startButton = null;
    private RedDotTextView serverStatusView = null;
    private RecyclerView messageRecyclerView = null;
    private MessageRecyclerAdapter adapter = null;
    private int serverStatus = NonameWebSocketServer.SERVER_TYPE_STOP;

    protected DialogListBuilder createTutorial() {
        Context context = this.getContext();
        DialogListBuilder builder = DialogX.showDialogList();
        String tutorialTitle = "教程";
        SharedPreferences prefs = context.getSharedPreferences("nonameyuri", MODE_PRIVATE);
        SharedPreferences.Editor editor = prefs.edit();
        builder.add(
                GuideDialog.build()
                        .baseView(startButton)
                        .setStageLightType(GuideDialog.STAGE_LIGHT_TYPE.RECTANGLE)
                        .setAlign(CustomDialog.ALIGN.TOP_CENTER)
                        .onShow(dialog -> {
                            DialogXUtil.startFlashingAnimation((GuideDialog) dialog, 2, startButton); // 闪烁2轮
                        })
        );

        builder.add(
                MessageDialog.build()
                        .setTitle(tutorialTitle + "——联机按钮")
                        .setMessage("联机界面中，您可以点击启动按钮创建一个默认8080端口的专属于libnoname/noname或其衍生项目的局域网联机服务器。")
                        .setCancelable(false)
                        .setOkButton(android.R.string.ok)
                        .onShow(dialog -> {
                            if (!isServerStarted()) {
                                startLocalServer();
                            }
                        })
        );

        builder.add(
                GuideDialog.build()
                        .baseView(startButton)
                        .setStageLightType(GuideDialog.STAGE_LIGHT_TYPE.RECTANGLE)
                        .setAlign(CustomDialog.ALIGN.TOP_CENTER)
                        .onShow(dialog -> {
                            DialogXUtil.startFlashingAnimation((GuideDialog) dialog, 2, startButton); // 闪烁2轮
                        })
        );

        builder.add(
                MessageDialog.build()
                        .setTitle(tutorialTitle + "——联机按钮")
                        .setMessage("联机服务器启动后，启动按钮会转变为停止按钮，点击后终止联机服务器的运行。")
                        .setCancelable(false)
                        .setOkButton(android.R.string.ok)
                        .onShow(dialog -> {
                            if (isServerStarted()) {
                                stopLocalServer();
                            }
                        })
        );

        builder.add(
                MessageDialog.build()
                        .setTitle(tutorialTitle + "——联机按钮")
                        .setMessage("本界面中显示的ip均可以点击后复制或者设为游戏内的联机地址并直接打开游戏。\n但本界面不会显示服务器正在运行的交互信息，比如谁进入了房间，谁出了什么牌等信息。")
                        .setCancelable(false)
                        .setOkButton(android.R.string.ok)
        );

        builder.add(
                MessageDialog.build()
                        .setTitle(tutorialTitle + "——联机按钮")
                        .setMessage("本页面的教程结束，欢迎使用无名杀。")
                        .setCancelable(false)
                        .setOkButton(android.R.string.ok)
                        .onDismiss(dialog -> {
                            editor.putBoolean("readTutorialInFunctionServer", true).apply();
                        })
        );

        return builder;
    }

    protected void postDelayed(View view, Runnable action) {
        view.postDelayed(action, 100);
    }

    protected boolean isTutorialCompleted() {
        Context context = this.getContext();
        SharedPreferences prefs = context.getSharedPreferences("nonameyuri", MODE_PRIVATE);
        return prefs.getBoolean("readTutorialInFunctionServer", false);
    }

    public FunctionServer(@NonNull Context context) {
        super(context);

        handler = new ServerHandler(Looper.getMainLooper());
    }

    @Override
    public void onCreate() {
        super.onCreate();
    }

    @Override
    public void onInit() {
        super.onInit();
    }

    @Override
    public void onDeInit() {
        super.onDeInit();
    }

    @Override
    public View onCreateView(Context context, @Nullable ViewGroup container) {
        return LayoutInflater.from(context).inflate(R.layout.function_server, container, false);
    }

    @Override
    public void onViewCreated(View view) {
        super.onViewCreated(view);

        startButton = view.findViewById(R.id.start_server_button);
        startButton.setTypeface(MyApplication.getTypeface());
        startButton.setOnClickListener(this);
        messageRecyclerView = view.findViewById(R.id.message_recycler);
        adapter = new MessageRecyclerAdapter();
        initMessageAdapter();
        adapter.setListener(this);

        LinearLayoutManager mLinearLayoutManager = new LinearLayoutManager(getContext(), LinearLayoutManager.VERTICAL, false);
        messageRecyclerView.setLayoutManager(mLinearLayoutManager);
        messageRecyclerView.setAdapter(adapter);

        serverStatusView = view.findViewById(R.id.server_status_red_dot);

        if (!isTutorialCompleted()) {
            Runnable action = () -> {
                DialogListBuilder builder = createTutorial();
                builder.show();
            };
            postDelayed(view, action);
        }
    }

    private void initMessageAdapter() {
        adapter.addMessage(getContext().getString(com.widget.noname.function.functionlibrary.R.string.server_ui_hint_start_button));
        adapter.addMessage(getContext().getString(com.widget.noname.function.functionlibrary.R.string.server_ui_label_available_servers));
        adapter.addMessage(new MessageData("159.75.51.253", MessageData.TYPE_IP));
        adapter.addMessage(new MessageData("43.138.118.130", MessageData.TYPE_IP));

        Runnable runnable = () -> {
            ClipboardManager cm = (ClipboardManager) getContext().getSystemService(Context.CLIPBOARD_SERVICE);
            ClipData primaryClip = cm.getPrimaryClip();
            FragmentActivity activity = (FragmentActivity) getContext();
            int itemCount = 0;

            if (null != primaryClip) {
                itemCount = primaryClip.getItemCount();
            }

            if ((itemCount > 0) && (null != activity)) {
                ClipData.Item itemAt = primaryClip.getItemAt(itemCount - 1);
                if (itemAt != null && itemAt.getText() != null) {
                    String ip = itemAt.getText().toString();
                    if (NetUtil.ipCheck(ip)) {
                        addMessageToScreen(getContext().getString(com.widget.noname.function.functionlibrary.R.string.server_ui_label_ip_from_clipboard));
                        addIpaddrToScreen(ip);
                    }
                }
            }

            String json = MMKV.defaultMMKV().decodeString(FileConstant.IP_LIST_KEY);
            JSONArray array = JSON.parseArray(json);

            if (null != array && !array.isEmpty()) {
                addMessageToScreen(getContext().getString(com.widget.noname.function.functionlibrary.R.string.server_ui_label_recent_connections));
                for (int i = 0; i < array.size(); i++) {
                    addIpaddrToScreen(array.get(i).toString());
                }
            }
        };

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            ThreadManager.getInstance().execute(runnable);
        }
        else {
            ThreadManager.getInstance().postToMain(runnable);
        }
    }

    private void startLocalServer() {
        if (Thread.currentThread() == Looper.getMainLooper().getThread()) {
            if (isServerStarted()) {
                addMessageToScreen(getContext().getString(com.widget.noname.function.functionlibrary.R.string.server_status_already_running));
                return;
            }

            setServerStatus(NonameWebSocketServer.SERVER_TYPE_START);
            addMessageToScreen(getContext().getString(com.widget.noname.function.functionlibrary.R.string.server_status_creating, SERVER_PORT));

            ThreadManager.getInstance().execute(() -> {
                try {
                    synchronized (serverLock) {
                        if (server != null) {
                            try {
                                server.stop();
                            } catch (InterruptedException e) {
                                e.printStackTrace();
                            } finally {
                                server = null;
                            }
                        }

                        server = new NonameWebSocketServer(SERVER_PORT, this::setServerStatus);
                        server.setReuseAddr(true);
                        server.start();
                    }

                    addMessageToScreen(getContext().getString(com.widget.noname.function.functionlibrary.R.string.server_status_start_success));
                    addMessageToScreen(getContext().getString(com.widget.noname.function.functionlibrary.R.string.server_ui_hint_ip_actions));

                    String[] ipaddr = NetUtil.getIpaddr();

                    for (String ip : ipaddr) {
                        addIpaddrToScreen(ip + ":" + SERVER_PORT);
                    }
                } catch (UnknownHostException e) {
                    addMessageToScreen(getContext().getString(com.widget.noname.function.functionlibrary.R.string.server_status_start_failed, e.getLocalizedMessage()));
                    try {
                        addMessageToScreen(getContext().getString(com.widget.noname.function.functionlibrary.R.string.server_status_stopping));
                        server.stop();
                    } catch (InterruptedException interruptedException) {
                        addMessageToScreen(getContext().getString(com.widget.noname.function.functionlibrary.R.string.server_status_cleanup_failed, interruptedException.getLocalizedMessage()));
                    }

                    e.printStackTrace();
                }
            });
        } else {
            handler.obtainMessage(MSG_UPDATE_SERVER_START).sendToTarget();
        }
    }

    private boolean isServerStarted() {
        return (serverStatus == NonameWebSocketServer.SERVER_TYPE_START)
                || (serverStatus == NonameWebSocketServer.SERVER_TYPE_RUNNING);
    }

    private void stopLocalServer() {
        ThreadManager.getInstance().execute(() -> {
            synchronized (serverLock) {
                if (null != server) {
                    try {
                        server.stop();
                        addMessageToScreen(getContext().getString(com.widget.noname.function.functionlibrary.R.string.server_status_stopped));
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                        addMessageToScreen(getContext().getString(com.widget.noname.function.functionlibrary.R.string.common_error_operation_failed_with_stacktrace, Arrays.toString(e.getStackTrace())));
                    } finally {
                        server = null;
                    }
                }
            }
        });
    }

    @Override
    public void onDestroy() {
        super.onDestroy();

        stopLocalServer();
    }

    private void addMessageToScreen(String msg) {
        Message message = handler.obtainMessage();
        message.what = MSG_UPDATE_SCREEN_MESSAGE;
        message.obj = msg;
        message.sendToTarget();
    }

    private void addIpaddrToScreen(String ip) {
        Message message = handler.obtainMessage();
        message.what = MSG_UPDATE_SERVER_IPADDR;
        message.obj = ip;
        message.sendToTarget();
    }

    @Override
    public void onClick(View v) {
        int id = v.getId();

        if (id == R.id.start_server_button) {
            if (!Settings.hasAgreedToPrivacyPolicy()) {
                tip(com.widget.noname.function.functionlibrary.R.string.permission_require_privacy_agreement).iconError().show();
                return;
            }
            if (isServerStarted()) {
                stopLocalServer();
            } else {
                startLocalServer();
            }

        }
    }

    @Override
    public void onIpaddrMsgClick(View view, String ip) {
        PopMenu.show(view, new String[] {
                        getContext().getString(com.widget.noname.function.functionlibrary.R.string.common_action_copy),
                        getContext().getString(com.widget.noname.function.functionlibrary.R.string.server_action_set_ip),
                        getContext().getString(com.widget.noname.function.functionlibrary.R.string.server_action_set_ip_and_start_game)
                })
                .setOverlayBaseView(false)
                .setAlignGravity(Gravity.RIGHT | Gravity.BOTTOM)
                .setWidth((int)(view.getWidth() * 2.5))
                .setOffScreen(false)
                .setIconResIds(
                        com.widget.noname.function.functionlibrary.R.drawable.icon_copy,
                        com.widget.noname.function.functionlibrary.R.drawable.icon_setting,
                        com.widget.noname.function.functionlibrary.R.drawable.icon_setting
                )
                .setOnMenuItemClickListener((dialog, text, position) -> {
                    if (position == 0) {
                        setToClipboard(ip);
                    } else if (1 == position) {
                        handler.postDelayed(() -> {
                            MsgToActivity msg = new MsgToActivity();
                            msg.type = MessageType.SET_SERVER_IP;
                            msg.obj = ip;
                            EventBus.getDefault().post(msg);
                        }, 300);

                    } else if (2 == position) {
                        MsgToActivity msg = new MsgToActivity();
                        msg.type = MessageType.SET_SERVER_IP_AND_START;
                        msg.obj = ip;
                        EventBus.getDefault().post(msg);
                    }
                    return false;
                });
    }

    private void setToClipboard(String string) {
        Runnable runnable = () -> {
            ClipboardManager cm = (ClipboardManager) getContext().getSystemService(Context.CLIPBOARD_SERVICE);
            ClipData mClipData = ClipData.newPlainText("Label", string);
            cm.setPrimaryClip(mClipData);

            ClipData primaryClip = cm.getPrimaryClip();
            int itemCount = primaryClip.getItemCount();
            FragmentActivity activity = (FragmentActivity) getContext();

            if ((itemCount > 0) && (null != activity)) {
                ClipData.Item itemAt = primaryClip.getItemAt(itemCount - 1);
                CharSequence text1 = itemAt.getText();
                tip(getContext().getString(com.widget.noname.function.functionlibrary.R.string.common_toast_copied, text1)).iconSuccess().show();
            }
        };

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            ThreadManager.getInstance().execute(runnable);
        }
        else {
            ThreadManager.getInstance().postToMain(runnable);
        }
    }

    public void setServerStatus(int serverStatus) {
        if (Thread.currentThread() != Looper.getMainLooper().getThread()) {
            handler.post(() -> setServerStatus(serverStatus));
            return;
        }

        if (!isAlive) {
            return;
        }

        this.serverStatus = serverStatus;
        serverStatusView.setStatus(serverStatus);

        switch (serverStatus) {
            case NonameWebSocketServer.SERVER_TYPE_START: {
                serverStatusView.setText(com.widget.noname.function.functionlibrary.R.string.server_status_start);
                break;
            }
            case NonameWebSocketServer.SERVER_TYPE_RUNNING: {
                serverStatusView.setText(com.widget.noname.function.functionlibrary.R.string.server_status_running);
                break;
            }
            case NonameWebSocketServer.SERVER_TYPE_CLOSE: {
                serverStatusView.setText(com.widget.noname.function.functionlibrary.R.string.server_status_close);
                break;
            }
            case NonameWebSocketServer.SERVER_TYPE_ERROR: {
                serverStatusView.setText(com.widget.noname.function.functionlibrary.R.string.server_status_error);
                break;
            }
            case NonameWebSocketServer.SERVER_TYPE_STOP: {
                serverStatusView.setText(com.widget.noname.function.functionlibrary.R.string.server_status_stop);
                break;
            }
        }

        switch (serverStatus) {
            case NonameWebSocketServer.SERVER_TYPE_START:
            case NonameWebSocketServer.SERVER_TYPE_RUNNING: {
                startButton.setText(com.widget.noname.function.functionlibrary.R.string.btn_text_server_end);
                break;
            }
            case NonameWebSocketServer.SERVER_TYPE_CLOSE:
            case NonameWebSocketServer.SERVER_TYPE_ERROR:
            case NonameWebSocketServer.SERVER_TYPE_STOP: {
                startButton.setText(com.widget.noname.function.functionlibrary.R.string.btn_text_server_start);
                break;
            }
        }
    }

    private class ServerHandler extends Handler {

        public ServerHandler(Looper looper) {
            super(looper);
        }

        @Override
        public void handleMessage(@NonNull Message msg) {
            super.handleMessage(msg);

            switch (msg.what) {
                case MSG_UPDATE_SERVER_IPADDR: {
                    String ip = String.valueOf(msg.obj);
                    MessageData data = new MessageData(ip, MessageData.TYPE_IP);
                    adapter.addMessage(data);
                    messageRecyclerView.smoothScrollToPosition(adapter.getItemCount() - 1);
                    break;
                }

                case MSG_UPDATE_SCREEN_MESSAGE: {
                    adapter.addMessage(String.valueOf(msg.obj));
                    messageRecyclerView.smoothScrollToPosition(adapter.getItemCount() - 1);
                    break;
                }

                case MSG_UPDATE_SERVER_START: {
                    startLocalServer();
                    break;
                }
            }
        }
    }
}
