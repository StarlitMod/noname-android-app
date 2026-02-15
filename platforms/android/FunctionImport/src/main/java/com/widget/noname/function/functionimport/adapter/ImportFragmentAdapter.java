package com.widget.noname.function.functionimport.adapter;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentActivity;
import androidx.viewpager2.adapter.FragmentStateAdapter;

import com.widget.noname.function.functionimport.subfragment.ImportFileFragment;
import com.widget.noname.function.functionimport.subfragment.ImportFragment;
import com.widget.noname.function.functionimport.subfragment.ManualDirectorySelectFragment;
import com.widget.noname.function.functionimport.subfragment.MigrationFragment;

import java.util.List;

public class ImportFragmentAdapter extends FragmentStateAdapter {
    private static final String TAG = "ImportFragmentAdapter";

    private final List<String> fragmentKeys;


    public ImportFragmentAdapter(@NonNull FragmentActivity fragment, List<String> keys) {
        super(fragment);
        this.fragmentKeys = keys;
    }

    @NonNull
    @Override
    public Fragment createFragment(int position) {
        if (position == 0) {
            // 导入log
            return new ImportFileFragment();
        }
        else if (position == 1) {
            // 添加目录
            return new ManualDirectorySelectFragment();
        }
        else if (position == 2) {
            // 迁移
            return new MigrationFragment();
        }
        else {
            return new ImportFragment(fragmentKeys.get(position));
        }
    }

    @Override
    public int getItemCount() {
        return fragmentKeys.size();
    }
}
