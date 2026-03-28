package com.widget.noname.function.functionlibrary.adapter;

import static android.text.Spanned.SPAN_EXCLUSIVE_EXCLUSIVE;

import android.graphics.Color;
import android.text.Spannable;
import android.text.SpannableString;
import android.text.method.LinkMovementMethod;
import android.text.style.ForegroundColorSpan;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.widget.noname.function.functionlibrary.data.MessageData;
import com.widget.noname.function.functionlibrary.R;
import com.widget.noname.function.functionlibrary.listener.MessageAdapterListener;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class MessageRecyclerAdapter extends RecyclerView.Adapter<RecyclerView.ViewHolder> {

    private final List<MessageData> list = new ArrayList<>();
    private final DateFormat dateFormat = SimpleDateFormat.getDateTimeInstance();
    private MessageAdapterListener listener = null;

    @NonNull
    @Override
    public RecyclerView.ViewHolder onCreateViewHolder(@NonNull ViewGroup viewGroup, int viewType) {
        View view = LayoutInflater.from(viewGroup.getContext())
                .inflate(R.layout.message_text_view_layout, viewGroup, false);
        return new MessageHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull RecyclerView.ViewHolder viewHolder, int position) {
        MessageHolder holder = (MessageHolder) viewHolder;
        MessageData data = list.get(position);
        String msg = data.getMessage();

        if (data.getType() == MessageData.TYPE_NORMAL) {
            holder.getTextView().setText(data.getMessage());
            holder.getTextView().setOnClickListener(null);
        } else {
            // 颜色
            int color = switch (data.getType()) {
                case MessageData.TYPE_IP -> Color.parseColor("#24ED2D");
                case MessageData.TYPE_PORT -> Color.parseColor("#E53E3E");
                default -> 0;
            };

            SpannableString spannable;
            final String clickContent; // 用于点击事件的内容

            // 检查是否包含 ${} 标记
            if (msg.contains("${")) {
                // 提取${}内的内容
                Pattern pattern = Pattern.compile("\\$\\{([^}]+)\\}");
                Matcher matcher = pattern.matcher(msg);

                if (matcher.find()) {
                    String content = matcher.group(1);
                    clickContent = content; // 点击时使用IP内容

                    // 生成纯文本（移除${}标记）
                    String pureText = msg.replaceAll("\\$\\{([^}]+)\\}", content);
                    spannable = new SpannableString(pureText);

                    // 计算部分在纯文本中的位置
                    String beforeMatch = msg.substring(0, matcher.start());
                    String beforeMatchWithoutMarkers = beforeMatch.replaceAll("\\$\\{([^}]+)\\}", "$1");
                    int start = beforeMatchWithoutMarkers.length();
                    int end = start + content.length();

                    // 部分设置颜色
                    spannable.setSpan(new ForegroundColorSpan(color),
                            start, end, Spannable.SPAN_EXCLUSIVE_EXCLUSIVE);
                } else {
                    // 理论上不会执行到这里
                    spannable = new SpannableString(msg);
                    clickContent = msg;
                }
            } else {
                // 没有标记，整个消息都变色
                spannable = new SpannableString(msg);
                spannable.setSpan(new ForegroundColorSpan(color), 0, msg.length(),
                        Spannable.SPAN_EXCLUSIVE_EXCLUSIVE);
                clickContent = msg; // 点击时使用整个消息
            }

            holder.getTextView().setText(spannable);

            // 设置点击事件
            holder.getTextView().setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    if (null != listener) {
                        if (data.getType() == MessageData.TYPE_IP) {
                            listener.onIpaddrMsgClick(v, clickContent);
                        }
                        else if (data.getType() == MessageData.TYPE_PORT) {
                            try {
                                listener.onPortMsgClick(v, Integer.parseInt(clickContent));
                            } catch (NumberFormatException e) {
                                listener.onPortMsgClick(v, 8080);
                            }
                        }
                    }
                }
            });

            holder.getTextView().setMovementMethod(LinkMovementMethod.getInstance());
        }

        holder.getDataTextView().setText(data.getDate());
    }

    @Override
    public int getItemCount() {
        return list.size();
    }

    public void addMessage(String msg) {
        MessageData data = new MessageData(msg);
        addMessage(data);
    }

    public void addMessage(MessageData data) {
        data.setDate(dateFormat.format(new Date()));
        list.add(data);
        notifyItemChanged(list.indexOf(data));
    }

    public static class MessageHolder extends RecyclerView.ViewHolder {

        private TextView textView = null;
        private TextView dataTextView = null;


        public MessageHolder(@NonNull View itemView) {
            super(itemView);

            textView = itemView.findViewById(R.id.message_text_view);
            dataTextView = itemView.findViewById(R.id.message_date_text_view);
        }

        public TextView getTextView() {
            return textView;
        }

        public TextView getDataTextView() {
            return dataTextView;
        }
    }

    public void setListener(MessageAdapterListener listener) {
        this.listener = listener;
    }
}
