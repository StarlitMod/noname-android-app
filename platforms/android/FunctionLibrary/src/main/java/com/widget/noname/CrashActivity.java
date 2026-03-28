package com.widget.noname;

import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.text.SpannableStringBuilder;
import android.text.Spanned;
import android.text.TextUtils;
import android.text.style.ForegroundColorSpan;
import android.text.style.UnderlineSpan;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.ScrollView;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.ContextCompat;

import com.kongzue.dialogx.dialogs.PopTip;
import com.widget.noname.function.functionlibrary.R;

import java.io.File;
import java.io.FileOutputStream;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class CrashActivity extends AppCompatActivity {

    private static final String TAG = "CrashActivity";
    private static final String KEY_STACK_TRACE = "key_stack_trace";
    private static final String KEY_ERROR_MESSAGE = "key_error_message";
    private TextView tvErrorTitle;
    private TextView tvErrorTime;
    private TextView tvDeviceInfo;
    private TextView tvStackTrace;
    private TextView tvErrorCount;
    private Button btnCopy;
    private Button btnShare;
    private Button btnSave;
    private Button btnRestart;
    private Button btnExit;
    private ImageView btnExpandCollapse;
    private ScrollView scrollView;
    private View stackTraceContainer;

    private String stackTrace;
    private String errorMessage;
    private boolean isExpanded = true; // 默认展开

    // 正则和设置堆栈信息代码来自:
    // https://github.com/getActivity/AndroidProject/blob/master/app/src/main/java/com/hjq/demo/ui/activity/common/CrashActivity.java
    /** 系统包前缀列表 */
    private static final String[] SYSTEM_PACKAGE_PREFIX_LIST = new String[]
            {"android", "com.android", "androidx", "com.google.android", "java", "javax", "dalvik", "kotlin"};

    /** 报错代码行数正则表达式 */
    private static final Pattern CODE_REGEX = Pattern.compile("\\(\\w+\\.\\w+:\\d+\\)");

    /**
     * 启动 CrashActivity
     * @param context 上下文
     * @param stackTrace 堆栈信息
     * @param errorMessage 错误消息（可选）
     */
    public static void start(Context context, String stackTrace, String errorMessage) {
        Intent intent = new Intent(context, CrashActivity.class);
        intent.putExtra(KEY_STACK_TRACE, stackTrace);
        intent.putExtra(KEY_ERROR_MESSAGE, errorMessage);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        context.startActivity(intent);
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.activity_crash);

        // 获取传递的数据
        Intent intent = getIntent();
        stackTrace = intent.getStringExtra(KEY_STACK_TRACE);
        errorMessage = intent.getStringExtra(KEY_ERROR_MESSAGE);

        if (TextUtils.isEmpty(stackTrace)) {
            stackTrace = getString(R.string.crash_no_stack_trace);
        }

        initViews();
        setupViews();
        setupListeners();

        // 自动保存崩溃日志
        saveCrashToFile();
    }

    private void initViews() {
        tvErrorTitle = findViewById(R.id.tv_error_title);
        tvErrorTime = findViewById(R.id.tv_error_time);
        tvDeviceInfo = findViewById(R.id.tv_device_info);
        tvStackTrace = findViewById(R.id.tv_stack_trace);
        tvErrorCount = findViewById(R.id.tv_error_count);
        btnCopy = findViewById(R.id.btn_copy);
        btnShare = findViewById(R.id.btn_share);
        btnSave = findViewById(R.id.btn_save);
        btnRestart = findViewById(R.id.btn_restart);
        btnExit = findViewById(R.id.btn_exit);
        btnExpandCollapse = findViewById(R.id.btn_expand_collapse);
        scrollView = findViewById(R.id.scroll_view);
        stackTraceContainer = findViewById(R.id.stack_trace_container);
    }

    private void setupViews() {
        // 设置错误时间
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.getDefault());
        tvErrorTime.setText(getString(R.string.crash_occurred_time, sdf.format(new Date())));

        // 设置设备信息
        tvDeviceInfo.setText(getDeviceInfo());

        // 设置堆栈信息
        Matcher matcher = CODE_REGEX.matcher(stackTrace);
        SpannableStringBuilder spannable = new SpannableStringBuilder(stackTrace);
        if (spannable.length() > 0) {
            while (matcher.find()) {
                // 不包含左括号（
                int start = matcher.start() + "(".length();
                // 不包含右括号 ）
                int end = matcher.end() - ")".length();

                // 代码信息颜色
                int codeColor = Color.parseColor("#999999");
                int lineIndex = stackTrace.lastIndexOf("at ", start);
                if (lineIndex != -1) {
                    String lineData = spannable.subSequence(lineIndex, start).toString();
                    if (TextUtils.isEmpty(lineData)) {
                        continue;
                    }
                    // 是否高亮代码行数
                    boolean highlight = true;
                    for (String packagePrefix : SYSTEM_PACKAGE_PREFIX_LIST) {
                        if (lineData.startsWith("at " + packagePrefix)) {
                            highlight = false;
                            break;
                        }
                    }
                    if (highlight) {
                        codeColor = Color.parseColor("#287BDE");
                    }
                }

                // 设置前景
                spannable.setSpan(new ForegroundColorSpan(codeColor), start, end, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
                // 设置下划线
                spannable.setSpan(new UnderlineSpan(), start, end, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
            }
            tvStackTrace.setText(spannable);
        }
        else {
            tvStackTrace.setText(stackTrace);
        }

        // 设置错误次数
        int crashCount = getCrashCount();
        tvErrorCount.setText(getString(R.string.crash_today_count, crashCount));
        if (crashCount > 3) {
            tvErrorCount.setTextColor(ContextCompat.getColor(this, R.color.red_dot_hint_selector));
        }

        // 初始状态：展开
        updateExpandState();
    }

    private void setupListeners() {
        // 复制按钮
        btnCopy.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                copyToClipboard();
            }
        });

        // 分享按钮
        btnShare.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                shareCrashInfo();
            }
        });

        // 保存按钮
        btnSave.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                saveCrashToFile();
            }
        });

        // 重启应用
        btnRestart.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Settings.restartApp(CrashActivity.this);
            }
        });

        // 退出应用
        btnExit.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finishAffinity();
                System.exit(0);
            }
        });

        // 展开/折叠按钮
        btnExpandCollapse.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                isExpanded = !isExpanded;
                updateExpandState();
            }
        });

        // 长按堆栈信息也可以复制
        tvStackTrace.setOnLongClickListener(new View.OnLongClickListener() {
            @Override
            public boolean onLongClick(View v) {
                copyToClipboard();
                return true;
            }
        });
    }

    private void updateExpandState() {
        if (isExpanded) {
            // 展开
            stackTraceContainer.setVisibility(View.VISIBLE);
            btnExpandCollapse.setImageResource(R.drawable.ic_collapse);
            btnExpandCollapse.setContentDescription(getString(R.string.crash_collapse_description));

            // 滚动到底部
            scrollView.post(new Runnable() {
                @Override
                public void run() {
                    scrollView.fullScroll(ScrollView.FOCUS_UP);
                }
            });
        } else {
            // 折叠
            stackTraceContainer.setVisibility(View.GONE);
            btnExpandCollapse.setImageResource(R.drawable.ic_expand);
            btnExpandCollapse.setContentDescription(getString(R.string.crash_expand_description));
        }
    }

    private String getCurrentAppVersion() {
        try {
            String packageName = getPackageName();
            return getPackageManager().getPackageInfo(packageName, 0).versionName;
        } catch (PackageManager.NameNotFoundException e) {
            Log.e(TAG, "获取应用版本失败", e);
            return "0.0.0"; // 返回默认版本号
        }
    }

    private String getDeviceInfo() {
        StringBuilder sb = new StringBuilder();
        sb.append(getString(R.string.crash_device_brand, Build.BRAND)).append("\n");
        sb.append(getString(R.string.crash_device_model, Build.MODEL)).append("\n");
        sb.append(getString(R.string.crash_android_version, Build.VERSION.RELEASE)).append("\n");
        sb.append(getString(R.string.crash_sdk_version, Build.VERSION.SDK_INT)).append("\n");
        sb.append(getString(R.string.crash_app_version, getCurrentAppVersion())).append("\n");

        String debugMode = isDebugMode() ?
                getString(R.string.crash_debug_mode_yes) :
                getString(R.string.crash_debug_mode_no);
        sb.append(getString(R.string.crash_debug_mode, debugMode));

        return sb.toString();
    }

    private boolean isDebugMode() {
        return (getApplicationInfo().flags & android.content.pm.ApplicationInfo.FLAG_DEBUGGABLE) != 0;
    }

    private int getCrashCount() {
        // 从 SharedPreferences 读取今日崩溃次数
        String today = new SimpleDateFormat("yyyyMMdd", Locale.getDefault()).format(new Date());
        int count = getSharedPreferences("crash_prefs", MODE_PRIVATE)
                .getInt("crash_count_" + today, 0);

        // 增加计数
        count++;
        getSharedPreferences("crash_prefs", MODE_PRIVATE)
                .edit()
                .putInt("crash_count_" + today, count)
                .apply();

        return count;
    }

    private void copyToClipboard() {
        String fullInfo = getFullCrashInfo();

        ClipboardManager clipboard = (ClipboardManager) getSystemService(Context.CLIPBOARD_SERVICE);
        ClipData clip = ClipData.newPlainText("crash_info", fullInfo);
        clipboard.setPrimaryClip(clip);

        // 使用 DialogX 的 PopTip 提示
        PopTip.show(getString(R.string.crash_copy_success));
    }

    private void shareCrashInfo() {
        String fullInfo = getFullCrashInfo();

        Intent shareIntent = new Intent(Intent.ACTION_SEND);
        shareIntent.setType("text/plain");
        shareIntent.putExtra(Intent.EXTRA_SUBJECT, getString(R.string.crash_share_title));
        shareIntent.putExtra(Intent.EXTRA_TEXT, fullInfo);

        startActivity(Intent.createChooser(shareIntent, getString(R.string.crash_share_title)));
    }

    private void saveCrashToFile() {
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    String fullInfo = getFullCrashInfo();

                    // 创建崩溃日志目录
                    File crashDir = new File(getExternalFilesDir(null).getParentFile(), "crashes");
                    if (!crashDir.exists()) {
                        crashDir.mkdirs();
                    }

                    // 生成文件名
                    SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd_HHmmss", Locale.getDefault());
                    String fileName = "crash_" + sdf.format(new Date()) + ".log";
                    File crashFile = new File(crashDir, fileName);

                    // 写入文件
                    FileOutputStream fos = new FileOutputStream(crashFile);
                    fos.write(fullInfo.getBytes("UTF-8"));
                    fos.close();

                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            PopTip.show(getString(R.string.crash_save_success, crashFile.getAbsolutePath()));
                        }
                    });

                } catch (Exception e) {
                    e.printStackTrace();
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            PopTip.show(getString(R.string.crash_save_failed, e.getMessage()));
                        }
                    });
                }
            }
        }).start();
    }

    private String getFullCrashInfo() {
        StringBuilder sb = new StringBuilder();
        sb.append(getString(R.string.crash_report_title)).append("\n");

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.getDefault());
        sb.append(getString(R.string.crash_occurred_time, sdf.format(new Date()))).append("\n");

        sb.append(getString(R.string.crash_report_error_info)).append("\n").append(errorMessage).append("\n");
        sb.append(getString(R.string.crash_report_device_info)).append("\n").append(getDeviceInfo()).append("\n");
        sb.append(getString(R.string.crash_report_stack_trace)).append("\n").append(stackTrace).append("\n");
        sb.append(getString(R.string.crash_report_footer));

        return sb.toString();
    }
}