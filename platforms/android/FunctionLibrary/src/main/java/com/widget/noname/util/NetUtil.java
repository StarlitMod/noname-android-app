package com.widget.noname.util;

import android.text.TextUtils;
import android.util.Log;

import java.net.Inet4Address;
import java.net.Inet6Address;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.net.SocketException;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.List;

public class NetUtil {
    private static final String FIX_QUOT = "\"";
    private static final String EMPTY = "";
    private static final String IP_REGEX = "^(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|[1-9])\\."
            + "(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)\\."
            + "(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)\\."
            + "(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)$";

    public static String toJsonStr(String str) {
        if ((null != str) && !EMPTY.equals(str)) {
            return FIX_QUOT + str + FIX_QUOT;
        }

        return null;
    }

    public static String getId() {
        return String.valueOf(1000000000L + (long) (9000000000L * Math.random()));
    }

    public static String checkNikeName(String nickname) {
        if (TextUtils.isEmpty(nickname)) {
            nickname = "无名玩家";
        }

        if (nickname.length() > 12) {
            nickname = nickname.substring(0, 12);
        }

        return nickname;
    }

    /**
     * 获取设备的所有有效IP地址（排除链路本地地址和回环地址）
     * @return IP地址数组，IPv6地址会被格式化为[xxxx:xxxx]的形式
     */
    public static String[] getIpAddresses() {
        List<String> ipList = new ArrayList<>();

        try {
            Enumeration<NetworkInterface> networkInterfaces = NetworkInterface.getNetworkInterfaces();

            while (networkInterfaces.hasMoreElements()) {
                NetworkInterface networkInterface = networkInterfaces.nextElement();

                // 跳过未激活的接口
                if (!networkInterface.isUp()) {
                    continue;
                }

                Enumeration<InetAddress> inetAddresses = networkInterface.getInetAddresses();

                while (inetAddresses.hasMoreElements()) {
                    InetAddress inetAddress = inetAddresses.nextElement();
                    String hostAddress = inetAddress.getHostAddress();
                    String name = networkInterface.getName();
                    String displayName = networkInterface.getDisplayName();

                    Log.d("NetworkInterface", "Name: " + name + ", DisplayName: " + displayName +  ",  Address: " + hostAddress);

                    // 跳过回环地址 (127.0.0.1 和 ::1)
                    if (inetAddress.isLoopbackAddress()) {
                        Log.e("NetworkInterface", "Skipping loopback address: " + hostAddress);
                        continue;
                    }

                    // 跳过链路本地地址
                    if (isLinkLocalAddress(inetAddress, hostAddress)) {
                        Log.e("NetworkInterface", "Skipping link-local address: " + hostAddress);
                        continue;
                    }

                    // 尝试跳过 VoLTE 专用接口
                    if (displayName != null && (
                            displayName.contains("Voice") ||
                                    displayName.contains("VoLTE") ||
                                    displayName.contains("IMS"))
                    ) {
                        Log.e("NetworkInterface", "Skipping VoLTE interface: " + name);
                        continue;
                    }

                    // 格式化并添加地址
                    Log.e("NetworkInterface", "add: " + hostAddress);
                    ipList.add(formatIpAddress(hostAddress, inetAddress instanceof Inet6Address));
                }
            }
        } catch (SocketException e) {
            e.printStackTrace();
            return new String[0];
        }

        return ipList.toArray(new String[0]);
    }

    /**
     * 判断是否为链路本地地址
     */
    private static boolean isLinkLocalAddress(InetAddress inetAddress, String hostAddress) {
        // IPv6 链路本地地址 (fe80::/10)
        if (inetAddress instanceof Inet6Address) {
            return hostAddress.startsWith("fe80");
        }

        // IPv4 链路本地地址 (169.254.0.0/16)
        if (inetAddress instanceof Inet4Address) {
            return hostAddress.startsWith("169.254.");
        }

        return false;
    }

    /**
     * 格式化IP地址，IPv6地址添加方括号
     */
    private static String formatIpAddress(String hostAddress, boolean isIPv6) {
        if (isIPv6) {
            // 确保 IPv6 地址被正确格式化
            // 如果地址已经包含方括号，则不再添加
            if (!hostAddress.startsWith("[")) {
                return "[" + hostAddress + "]";
            }
        }
        return hostAddress;
    }

    public static boolean ipCheck(String text) {
        if ((text != null) && !text.isEmpty()) {
            return text.matches(IP_REGEX);
        }

        return false;
    }
}
