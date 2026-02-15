package com.widget.noname.function.functiontheme.adapter;

import static com.widget.noname.util.PagerHelper.SUB_FRAGMENT_THEME_SWITCH;

import android.util.Log;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentActivity;
import androidx.viewpager2.adapter.FragmentStateAdapter;

import com.widget.noname.function.functionlibrary.fragment.EmptyFragment;
import com.widget.noname.function.functiontheme.subfragment.ThemeSwitchFragment;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class ThemeFragmentAdapter extends FragmentStateAdapter {
    private static final String TAG = "ThemeFragmentAdapter";
    private final List<String> fragmentList = new ArrayList<>();
    private final HashMap<String, Fragment> hashMap = new HashMap<>();

    public ThemeFragmentAdapter(@NonNull FragmentActivity fragment) {
        super(fragment);
    }

    public void addFragment(String fragment) {
        fragmentList.add(fragment);
        notifyItemChanged(fragmentList.indexOf(fragment));
    }

    @NonNull
    @Override
    public Fragment createFragment(int position) {
        Fragment fragment = null;
        String frag = fragmentList.get(position);
        Log.d(TAG, "frag: " + frag);
        switch (frag) {
            case SUB_FRAGMENT_THEME_SWITCH: {
                fragment = new ThemeSwitchFragment();
                break;
            }
            default:
                fragment = new EmptyFragment();
                break;
        }

        hashMap.put(frag, fragment);
        return fragment;
    }

    @Override
    public int getItemCount() {
        return fragmentList.size();
    }

    public int getItemPosition(String fragment) {
        return fragmentList.indexOf(fragment);
    }

    public Fragment getFragment(String fragment) {
        return hashMap.get(fragment);
    }
}
