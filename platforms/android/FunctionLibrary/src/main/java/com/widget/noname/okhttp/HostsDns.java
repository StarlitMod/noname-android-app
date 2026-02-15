package com.widget.noname.okhttp;

import androidx.annotation.NonNull;

import com.widget.noname.Settings;

import okhttp3.Dns;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class HostsDns implements Dns {
    public static Map<String, List<InetAddress>> hostMap = new HashMap<>();

    private final boolean force;

    public HostsDns() {
        force = false;
    }

    public HostsDns(boolean force) {
        this.force = force;

    }

    @NonNull
    @Override
    public List<InetAddress> lookup(@NonNull String hostname) throws UnknownHostException {
        if (force || Settings.getGithubAcceleration()) {
            List<InetAddress> addresses = hostMap.get(hostname);
            if (addresses != null && !addresses.isEmpty()) {
                return addresses;
            }
        }
        // 如果没有匹配，回退到系统默认 DNS
        return Dns.SYSTEM.lookup(hostname);
    }
}
