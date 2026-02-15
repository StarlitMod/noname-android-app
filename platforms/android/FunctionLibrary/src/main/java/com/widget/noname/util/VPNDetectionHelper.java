package com.widget.noname.util;

import android.content.Context;
import android.net.ConnectivityManager;
import android.net.Network;
import android.net.NetworkCapabilities;
import android.os.Build;
import android.util.Log;

import java.net.NetworkInterface;
import java.util.Collections;
import java.util.Enumeration;

public class VPNDetectionHelper {

    private static final String TAG = "VPNDetection";

    /**
     * 综合检测VPN状态
     */
    public static boolean isVPNConnected(Context context) {
        boolean systemVpn = isSystemVPNConnected(context);
        boolean networkInterfaceVpn = isVPNInterfaceActive();

        Log.d(TAG, "System VPN: " + systemVpn +
                ", Network Interface VPN: " + networkInterfaceVpn);

        return systemVpn || networkInterfaceVpn;
    }

    /**
     * 使用ConnectivityManager检测系统VPN
     */
    private static boolean isSystemVPNConnected(Context context) {
        try {
            ConnectivityManager connectivityManager =
                    (ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE);

            if (connectivityManager == null) {
                return false;
            }

            // Android 10+ (API 29+)
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                Network activeNetwork = connectivityManager.getActiveNetwork();
                if (activeNetwork != null) {
                    NetworkCapabilities caps = connectivityManager.getNetworkCapabilities(activeNetwork);
                    return caps != null && caps.hasTransport(NetworkCapabilities.TRANSPORT_VPN);
                }
            }
            // Android 6.0-9.0 (API 23-28)
            else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                Network[] networks = connectivityManager.getAllNetworks();
                for (Network network : networks) {
                    NetworkCapabilities caps = connectivityManager.getNetworkCapabilities(network);
                    if (caps != null && caps.hasTransport(NetworkCapabilities.TRANSPORT_VPN)) {
                        return true;
                    }
                }
            }
            // Android 5.x (API 21-22)
            else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                // 使用反射方法
                try {
                    android.net.NetworkInfo activeNetworkInfo = connectivityManager.getActiveNetworkInfo();
                    if (activeNetworkInfo != null) {
                        return activeNetworkInfo.getType() == ConnectivityManager.TYPE_VPN;
                    }
                } catch (Exception e) {
                    Log.e(TAG, "Error checking VPN on API 21-22", e);
                }
            }
        } catch (Exception e) {
            Log.e(TAG, "Error checking system VPN", e);
        }
        return false;
    }

    /**
     * 通过检查网络接口检测VPN
     */
    private static boolean isVPNInterfaceActive() {
        try {
            Enumeration<NetworkInterface> interfaces = NetworkInterface.getNetworkInterfaces();
            if (interfaces != null) {
                for (NetworkInterface networkInterface : Collections.list(interfaces)) {
                    String name = networkInterface.getName().toLowerCase();

                    // 常见VPN接口名称模式
                    if (name.startsWith("tun") ||
                            name.startsWith("ppp") ||
                            name.startsWith("tap") ||
                            name.startsWith("utun") ||
                            name.startsWith("wg") ||     // WireGuard
                            name.startsWith("ipsec")) {  // IPSec
                        return true;
                    }

                    // 检查接口显示名称
                    String displayName = networkInterface.getDisplayName().toLowerCase();
                    if (displayName.contains("vpn") ||
                            displayName.contains("tunnel") ||
                            displayName.contains("wireguard") ||
                            displayName.contains("openvpn")) {
                        return true;
                    }
                }
            }
        } catch (Exception e) {
            Log.e(TAG, "Error checking network interfaces", e);
        }
        return false;
    }

    /**
     * 获取VPN详细信息
     */
    public static String getVPNInfo(Context context) {
        StringBuilder info = new StringBuilder();

        try {
            // 1. 系统VPN状态
            ConnectivityManager cm =
                    (ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE);

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && cm != null) {
                Network[] networks = cm.getAllNetworks();
                for (Network network : networks) {
                    NetworkCapabilities caps = cm.getNetworkCapabilities(network);
                    if (caps != null && caps.hasTransport(NetworkCapabilities.TRANSPORT_VPN)) {
                        info.append("VPN Network Found\n");
                        info.append("Capabilities: ").append(caps.toString()).append("\n");
                    }
                }
            }

            // 2. 网络接口信息
            Enumeration<NetworkInterface> interfaces = NetworkInterface.getNetworkInterfaces();
            while (interfaces.hasMoreElements()) {
                NetworkInterface networkInterface = interfaces.nextElement();
                info.append("Interface: ").append(networkInterface.getName())
                        .append(" - ").append(networkInterface.getDisplayName())
                        .append("\n");
            }
        } catch (Exception e) {
            info.append("Error: ").append(e.getMessage());
        }

        return info.toString();
    }
}
