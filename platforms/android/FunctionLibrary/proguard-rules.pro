# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# If your project uses WebView with JS, uncomment the following
# and specify the fully qualified class name to the JavaScript interface
# class:
#-keepclassmembers class fqcn.of.javascript.interface.for.webview {
#   public *;
#}

# Uncomment this to preserve the line number information for
# debugging stack traces.
#-keepattributes SourceFile,LineNumberTable

# If you keep the line number information, uncomment this to
# hide the original source file name.
#-renamesourcefileattribute SourceFile

# 类名不变
-keep class com.widget.noname.function.functionlibrary.** { *; }
-keep interface com.widget.noname.function.functionlibrary.** { *; }
-keep enum com.widget.noname.function.functionlibrary.** { *; }
-keep class com.widget.noname.function.FunctionManager { *; }
-keep class com.widget.noname.LaunchActivity
-keep class com.widget.noname.MyApplication
-keep class com.widget.noname.WaveLoadingView

-keep class com.widget.noname.function.FunctionBean { *; }