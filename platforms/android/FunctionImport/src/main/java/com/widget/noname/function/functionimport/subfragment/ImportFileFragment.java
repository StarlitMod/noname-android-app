package com.widget.noname.function.functionimport.subfragment;

import static android.content.Context.MODE_PRIVATE;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.os.Message;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.lifecycle.ViewModelProvider;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.kongzue.dialogx.DialogX;
import com.kongzue.dialogx.dialogs.MessageDialog;
import com.kongzue.dialogx.util.DialogListBuilder;
import com.widget.noname.TutorialFragment;
import com.widget.noname.function.functionlibrary.adapter.MessageRecyclerAdapter;
import com.widget.noname.function.functionlibrary.data.ImportEventViewModel;
import com.widget.noname.function.functionlibrary.data.LogEntry;
import com.widget.noname.function.functionimport.R;
import com.widget.noname.util.DialogXUtil;

import java.util.HashSet;
import java.util.Set;

public class ImportFileFragment extends TutorialFragment {
    private static final String TAG = "ImportFileFragment";

    private RecyclerView messageRecyclerView = null;

    private MessageRecyclerAdapter adapter = null;

    private Handler handler = null;

    private static final int MSG_UPDATE_SCREEN_MESSAGE = 3;

    private ImportEventViewModel viewModel;

    // 用 timestamp 当 ID
    private final Set<Long> shownLogIds = new HashSet<>();

    protected int getFragmentPosition() {
        return 0;
    }

    protected DialogListBuilder createTutorial() {
        Context context = this.getContext();
        DialogListBuilder builder = DialogX.showDialogList();
        String tutorialTitle = "教程";
        SharedPreferences prefs = context.getSharedPreferences("nonameyuri", MODE_PRIVATE);
        SharedPreferences.Editor editor = prefs.edit();

        builder.add(
                MessageDialog.build()
                        .setTitle(tutorialTitle + "——导入按钮——导入界面")
                        .setMessage("导入界面将显示您正在导入的压缩包或文件的进度信息。")
                        .setCancelable(false)
                        .setOkButton(android.R.string.ok)
        );

        builder.add(
                MessageDialog.build()
                        .setTitle(tutorialTitle + "——导入按钮——导入界面")
                        .setMessage("在触发游戏外便捷导入，或使用本App提供的导入文件功能时，会自动跳转本界面。\n“便捷导入”的意思是，您可以通过游戏外的任意文件浏览器，选择一个zip，7z，rar，tar压缩包（支持输入密码），以本应用打开。\n本应用会自动识别压缩包类型并导入。")
                        .setCancelable(false)
                        .setOkButton(android.R.string.ok)
        );

        builder.add(
                MessageDialog.build()
                        .setTitle(tutorialTitle + "——导入按钮——导入界面")
                        .setMessage("本应用默认可以导入如下类型的压缩包：\n\t1.HTML项目包\n\t2.无名杀·本体包 (需要有game/game.js)\n\t3.无名杀·扩展包 (需要有info.json)\n本应用还可以跟据游戏主体下的扩展目录配置(info.json)，来导入扩展设定的额外类型压缩包。")
                        .setCancelable(false)
                        .setOkButton(android.R.string.ok)
        );

        builder.add(
                MessageDialog.build()
                        .setTitle(tutorialTitle + "——导入按钮——导入界面")
                        .setMessage("本应用还可以指定目录，快速导入其中的文件，详情可以查看导入按钮——添加目录界面 和 导入按钮——外部QQ界面。")
                        .setCancelable(false)
                        .setOkButton(android.R.string.ok)
        );

        MessageDialog dialog5 = MessageDialog.build()
                .setTitle(tutorialTitle + "——导入按钮——导入界面")
                .setMessage("在本启动器的诸多资源导入方式中，由苍宇汇总如下: \n" +
                        "\n" +
                        "| 资源导入方式 | 需要用到的工具 | 优缺点 |\n" +
                        "| :---: | :---: | :---: |\n" +
                        "| **传统万能导入法** | [mt管理器](https://mt2.cn/) | **缺点**：需要额外下载mt管理器，并且每次进行导入的步骤相对较多。<br>**优点**：相对来说不容易出现差错，同时任何机型均可使用。mt管理器这个工具你在很多地方也会用得到。 |\n" +
                        "| **添加导入目录到启动器**<br>▪ download目录<br>(使用saf进行目录选择) | 仅需本启动器 | **缺点**：如果你使用手机QQ作为导入目录，那么下载的文件会占用2份内存（download内有一份，data内有一份）。<br>**优点**：无需其他第三方工具，方便快捷，步骤简短，一劳永逸。 |\n" +
                        "| **添加导入目录到启动器**<br>▪ android/data目录 | [shizuku](https://shizuku.rikka.app/zh-hans/)工具辅助授权 | **缺点**：高版本安卓无法直接访问，需要用到shizuku工具辅助，有学习成本（低版本安卓可以直接访问，无需shizuku）。如果不是root激活的shizuku，那么都不是永久的激活，每次更新都需要重新激活shizuku（非华为手机一般每次重启手机就会掉，华为手机只要断开链接就会掉）。<br>**优点**：可以节约内存空间，不会占用2倍内存。 |\n" +
                        "| **在线更新**<br>▪ 默认github仓库 | 建议使用加速器 | **缺点**：github仓库的更新下载在不开启加速器翻墙的情况下，链接不稳定，容易中断。<br>**优点**：仅限启动器界面点击操作即可完成更新。 | 2.1.4 |\n" +
                        "| **直接用无名杀打开压缩包** | 仅需本启动器 | **缺点**：如果压缩包格式不规范，会导致无法识别，同时有可能出现导入失败的情况。<br>**优点**：简单。 |")
                .setCancelable(false)
                .setOkButton(android.R.string.ok);
        DialogXUtil.setupMarkdownForMessage(dialog5);
        builder.add(dialog5);

        builder.add(
                MessageDialog.build()
                        .setTitle(tutorialTitle + "——导入按钮——导入界面")
                        .setMessage("本页面的教程结束，欢迎使用无名杀。")
                        .setCancelable(false)
                        .setOkButton(android.R.string.ok)
                        .onDismiss(dialog -> {
                            editor.putBoolean("readTutorialInImportFileFragment", true).apply();
                        })
        );

        return builder;
    }

    protected boolean isTutorialCompleted() {
        Context context = this.getContext();
        SharedPreferences prefs = context.getSharedPreferences("nonameyuri", MODE_PRIVATE);
        return prefs.getBoolean("readTutorialInImportFileFragment", false);
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.sub_fragment_import_file_layout, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        handler = new ImportFileHandler(Looper.getMainLooper());

        messageRecyclerView = view.findViewById(R.id.message_recycler);
        adapter = new MessageRecyclerAdapter();
        initMessageAdapter();
        // adapter.setListener(this);

        LinearLayoutManager mLinearLayoutManager = new LinearLayoutManager(getContext(), LinearLayoutManager.VERTICAL, false);
        messageRecyclerView.setLayoutManager(mLinearLayoutManager);
        messageRecyclerView.setAdapter(adapter);

        viewModel = new ViewModelProvider(requireActivity()).get(ImportEventViewModel.class);
        // 观察日志消息
        viewModel.getLogList().observe(getViewLifecycleOwner(), entries -> {
            for (LogEntry entry : entries) {
                if (!shownLogIds.contains(entry.getId())) {
                    addMessageToScreen(entry.getMessage());
                    shownLogIds.add(entry.getId());
                }
            }
        });
    }

    private void initMessageAdapter() {
        adapter.addMessage(getContext().getString(com.widget.noname.function.functionlibrary.R.string.import_progress_importing_file));
    }

    public void addMessageToScreen(String msg) {
        Message message = handler.obtainMessage();
        message.what = MSG_UPDATE_SCREEN_MESSAGE;
        message.obj = msg;
        message.sendToTarget();
    }

    private class ImportFileHandler extends Handler {
        public ImportFileHandler(Looper looper) {
            super(looper);
        }

        @Override
        public void handleMessage(@NonNull Message msg) {
            super.handleMessage(msg);

            if (msg.what == MSG_UPDATE_SCREEN_MESSAGE) {
                adapter.addMessage(String.valueOf(msg.obj));
                messageRecyclerView.smoothScrollToPosition(adapter.getItemCount() - 1);
            }
        }
    }
}
