package com.widget.noname.function.functionversion.adapter;

import static com.widget.noname.util.PagerHelper.SUB_FRAGMENT_ASSET;
import static com.widget.noname.util.PagerHelper.SUB_FRAGMENT_EXT_MANAGE;
import static com.widget.noname.util.PagerHelper.SUB_FRAGMENT_VERSION;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentActivity;
import androidx.viewpager2.adapter.FragmentStateAdapter;

import com.widget.noname.function.functionlibrary.fragment.EmptyFragment;
import com.widget.noname.function.functionversion.subfragment.AssetFragment;
import com.widget.noname.function.functionversion.subfragment.ExtManageFragment;
import com.widget.noname.function.functionversion.subfragment.VersionControlFragment;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class VersionControlViewPagerAdapter extends FragmentStateAdapter {

    private final List<String> fragmentList = new ArrayList<>();

    private final HashMap<String, Fragment> hashMap = new HashMap<>();

    public VersionControlViewPagerAdapter(@NonNull FragmentActivity fragmentActivity) {
        super(fragmentActivity);
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

        switch (frag) {
            case SUB_FRAGMENT_VERSION: {
                fragment = new VersionControlFragment();
                break;
            }
            case SUB_FRAGMENT_ASSET: {
                fragment = new AssetFragment();
                break;
            }
            case SUB_FRAGMENT_EXT_MANAGE: {
                fragment = new ExtManageFragment();
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
