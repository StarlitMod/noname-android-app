package com.widget.noname.function.functionserver.fragment;

import static com.kongzue.dialogx.dialogs.PopTip.tip;

import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.os.Bundle;
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
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.kongzue.dialogx.dialogs.PopMenu;
import com.tencent.mmkv.MMKV;
import com.widget.noname.MyApplication;
import com.widget.noname.function.functionlibrary.adapter.MessageRecyclerAdapter;
import com.widget.noname.function.functionlibrary.data.MessageData;
import com.widget.noname.function.functionlibrary.data.MessageType;
import com.widget.noname.eventbus.MsgServerStatus;
import com.widget.noname.eventbus.MsgToActivity;
import com.widget.noname.function.functionserver.R;
import com.widget.noname.function.functionlibrary.listener.MessageAdapterListener;
import com.widget.noname.util.NetUtil;
import com.widget.noname.common.util.FileConstant;
import com.widget.noname.function.functionserver.NonameWebSocketServer;

import org.greenrobot.eventbus.EventBus;
import org.greenrobot.eventbus.Subscribe;
import org.greenrobot.eventbus.ThreadMode;

import java.net.UnknownHostException;
import java.util.Arrays;

// 注：这个文件应该没用到了
public class LocalServerFragment extends Fragment implements View.OnClickListener, MessageAdapterListener {

    private static final int MSG_UPDATE_SERVER_IPADDR = 1;
    private static final int MSG_UPDATE_SERVER_START = 2;
    private static final int MSG_UPDATE_SCREEN_MESSAGE = 3;

    private static final int SERVER_PORT = 8080;

    private static final Object serverLock = new Object();

    private NonameWebSocketServer server = null;
    private Handler handler = null;

    private Button startButton = null;
    private RecyclerView messageRecyclerView = null;
    private MessageRecyclerAdapter adapter = null;
    private int serverStatus = NonameWebSocketServer.SERVER_TYPE_STOP;

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        handler = new ServerHandler(Looper.getMainLooper());
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_local_server, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

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
    }

    private void initMessageAdapter() {
        adapter.addMessage(getContext().getString(com.widget.noname.function.functionlibrary.R.string.server_ui_hint_start_button));
        adapter.addMessage(getContext().getString(com.widget.noname.function.functionlibrary.R.string.server_ui_label_available_servers));
        adapter.addMessage(new MessageData("159.75.51.253", MessageData.TYPE_IP));
        adapter.addMessage(new MessageData("47.99.105.222", MessageData.TYPE_IP));

        MyApplication.getThreadPool().execute(() -> {
            ClipboardManager cm = (ClipboardManager) MyApplication.getContext().getSystemService(Context.CLIPBOARD_SERVICE);
            ClipData primaryClip = cm.getPrimaryClip();
            FragmentActivity activity = getActivity();
            int itemCount = 0;

            if (null != primaryClip) {
                itemCount = primaryClip.getItemCount();
            }

            if ((itemCount > 0) && (null != activity)) {
                ClipData.Item itemAt = primaryClip.getItemAt(itemCount - 1);
                String ip = itemAt.getText().toString();

                if (NetUtil.ipCheck(ip)) {
                    addMessageToScreen(getContext().getString(com.widget.noname.function.functionlibrary.R.string.server_ui_label_ip_from_clipboard));
                    addIpaddrToScreen(ip);
                }
            }

            String json = MMKV.defaultMMKV().decodeString(FileConstant.IP_LIST_KEY);
            JSONArray array = JSON.parseArray(json);

            if (null != array && array.size() > 0) {
                addMessageToScreen(getContext().getString(com.widget.noname.function.functionlibrary.R.string.server_ui_label_recent_connections));
                for (int i = 0; i < array.size(); i++) {
                    addIpaddrToScreen(array.get(i).toString());
                }
            }
        });
    }

    private void startLocalServer() {
        if (Thread.currentThread() == Looper.getMainLooper().getThread()) {
            if (isServerStarted()) {
                addMessageToScreen(getContext().getString(com.widget.noname.function.functionlibrary.R.string.server_status_already_running));
                return;
            }

            setServerStatus(NonameWebSocketServer.SERVER_TYPE_START);
            addMessageToScreen(getContext().getString(com.widget.noname.function.functionlibrary.R.string.server_status_creating, SERVER_PORT));

            MyApplication.getThreadPool().execute(() -> {
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

                        server = new NonameWebSocketServer(LocalServerFragment.SERVER_PORT,
                                status -> EventBus.getDefault().post(new MsgServerStatus(status)));
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
        MyApplication.getThreadPool().execute(() -> {
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
        MyApplication.getThreadPool().execute(() -> {
            ClipboardManager cm = (ClipboardManager) MyApplication.getContext().getSystemService(Context.CLIPBOARD_SERVICE);
            ClipData mClipData = ClipData.newPlainText("Label", string);
            cm.setPrimaryClip(mClipData);

            ClipData primaryClip = cm.getPrimaryClip();
            int itemCount = primaryClip.getItemCount();
            FragmentActivity activity = getActivity();

            if ((itemCount > 0) && (null != activity)) {
                ClipData.Item itemAt = primaryClip.getItemAt(itemCount - 1);
                CharSequence text1 = itemAt.getText();
                tip(getContext().getString(com.widget.noname.function.functionlibrary.R.string.common_toast_copied, text1)).iconSuccess().show();
            }
        });
    }

    @Subscribe(threadMode = ThreadMode.MAIN)
    public void onServerStatusChange(MsgServerStatus msg) {
        switch (msg.getStatus()) {
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

        setServerStatus(msg.getStatus());
    }

    public void setServerStatus(int serverStatus) {
        this.serverStatus = serverStatus;
    }

    @Override
    public void onStart() {
        super.onStart();

        EventBus.getDefault().register(this);
    }

    @Override
    public void onStop() {
        super.onStop();
        EventBus.getDefault().unregister(this);
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
