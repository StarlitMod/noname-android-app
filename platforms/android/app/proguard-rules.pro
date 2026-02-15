# 保留我们使用的四大组件，自定义的Application等等这些类不被混淆
# 因为这些子类都有可能被外部调用
-keep class * extends android.app.Activity
-keep class * extends android.app.Application
-keep class * extends android.app.Service
-keep class * extends android.content.BroadcastReceiver
-keep class * extends android.content.ContentProvider
-keep class * extends android.app.backup.BackupAgentHelper
-keep class * extends android.preference.Preference
-keep class * extends android.view.View
-keep class * extends androidx.core.app.AppComponentFactory
-keep class * extends android.provider.DocumentsProvider

# 保留 DataBinding 类
-keep class androidx.databinding.** { *; }
# 保留 DataBinding 方法
-keepclassmembers class * {
    @androidx.databinding.BindingAdapter public *;
    @androidx.databinding.InverseBindingAdapter public *;
    @androidx.databinding.BindingMethod public *;
    @androidx.databinding.InverseBindingMethod public *;
}
# DataBinding 生成的代码在实际使用时被调用
-keepclassmembers,allowobfuscation class * {
    @androidx.databinding.BindingAdapter <methods>;
    @androidx.databinding.BindingConversion <methods>;
    @androidx.databinding.BindingMethod <methods>;
    @androidx.databinding.InverseBindingAdapter <methods>;
    @androidx.databinding.InverseBindingListener <methods>;
    @androidx.databinding.InverseBindingMethods <methods>;
}

# 保留support下的所有类及其内部类
-keep class android.support.** {*;}
-keep public class * extends android.support.v4.**
-keep public class * extends android.support.v7.**
-keep public class * extends android.support.annotation.**

# androidx
# 保留 AndroidX 类及其内部类
-keep class androidx.** {*;}
-keep public class * extends androidx.**
-keep interface androidx.** {*;}
-dontwarn androidx.**

# 保留R下面的资源
-keep class **.R$* {*;}

# 保留本地native方法不被混淆
-keepclasseswithmembernames class * {
    native <methods>;
}

# 保留在Activity中的方法参数是view的方法，
# 这样以来我们在layout中写的onClick就不会被影响
-keepclassmembers class * extends android.app.Activity {
    public void *(android.view.View);
}

# 保留枚举类不被混淆
-keepclassmembers enum * {
    public static **[] values();
    public static ** valueOf(java.lang.String);
}

-keepclassmembers class * extends java.lang.Enum {
    public static **[] values();
    public static ** valueOf(java.lang.String);
}

# 保留我们自定义控件（继承自View）不被混淆
-keep public class * extends android.view.View{
    *** get*();
    void set*(***);
    public <init>(android.content.Context);
    public <init>(android.content.Context, android.util.AttributeSet);
    public <init>(android.content.Context, android.util.AttributeSet, int);
}

# 保留Parcelable序列化类不被混淆
-keep class * implements android.os.Parcelable {
    public static final android.os.Parcelable$Creator *;
}

# 保留Serializable序列化的类不被混淆
-keepclassmembers class * implements java.io.Serializable {
    static final long serialVersionUID;
    private static final java.io.ObjectStreamField[] serialPersistentFields;
    !static !transient <fields>;
    !private <fields>;
    !private <methods>;
    private void writeObject(java.io.ObjectOutputStream);
    private void readObject(java.io.ObjectInputStream);
    java.lang.Object writeReplace();
    java.lang.Object readResolve();
}

# 对于带有回调函数的onXXEvent、**On*Listener的，不能被混淆
-keepclassmembers class * {
    void *(**On*Event);
    void *(**On*Listener);
}

# WebView
-keepclassmembers class * extends android.webkit.WebViewClient {
    public void *(android.webkit.WebView, java.lang.String, android.graphics.Bitmap);
    public boolean *(android.webkit.WebView, java.lang.String);
}
-keepclassmembers class * extends android.webkit.WebViewClient {
    public void *(android.webkit.WebView, java.lang.String);
}

# 对于带有回调函数的onXXEvent、**On*Listener的，不能被混淆
-keepclassmembers class * {
    void *(**On*Event);
    void *(**On*Listener);
}

# EventBus
-keepattributes *Annotation*
-keepclassmembers class ** {
    public void onEvent*(**);
}

# OkHttp3
-keep class com.squareup.okhttp3.** { *; }
-keep interface com.squareup.okhttp3.** { *; }
-dontwarn com.squareup.okhttp3.**
-dontwarn okio.**
-keep class okio.** { *; }
-keep interface okio.** { *; }
-keep class okhttp3.internal.publicsuffix.** { *; }
-keepnames class okhttp3.internal.publicsuffix.** { *; }
-keeppackagenames okhttp3.internal.publicsuffix.**

# RxJava3
-keep class io.reactivex.rxjava3.** { *; }
-dontwarn io.reactivex.rxjava3.**

# FastJSON
-keepattributes Signature
-keep class com.alibaba.fastjson.** { *; }
-dontwarn com.alibaba.fastjson.**

# EventBus
-keep class org.greenrobot.eventbus.** { *; }
-dontwarn org.greenrobot.eventbus.**
-keepclassmembers class ** {
    @org.greenrobot.eventbus.Subscribe <methods>;
}
-keep enum org.greenrobot.eventbus.ThreadMode { *; }
-keepclassmembers class * extends org.greenrobot.eventbus.util.ThrowableFailureEvent {
    <init>(java.lang.Throwable);
}

# XPopup
# -keep class com.lxj.xpopup.widget.**{*;}
# -dontwarn com.lxj.xpopup.widget.**

# PermissionX
-keep class com.guolindev.permissionx.** { *; }
-dontwarn com.guolindev.permissionx.**

# WebView
-keep class androidx.webkit.** { *; }
-dontwarn androidx.webkit.**

# Preference
-keep class androidx.preference.** { *; }
-dontwarn androidx.preference.**

# common
-keep class com.widght.noname.common.** { *; }

# native
-keep class com.widget.noname.nativelib.** { *; }

# Kotlin
-keepattributes Annotation
-keep class kotlin.** { *; }
-keep class org.jetbrains.** { *; }

# Glide
-keep public class * implements com.bumptech.glide.module.GlideModule
-keep public class * extends com.bumptech.glide.module.AppGlideModule
-keep public enum com.bumptech.glide.load.resource.bitmap.ImageHeaderParser$** {
  **[] $VALUES;
  public *;
}
-dontwarn com.bumptech.glide.load.resource.bitmap.VideoDecoder

# Material
-keep class com.google.android.material.** { *; }

# rxjava
-keep class io.reactivex.rxjava3.** { *; }
-keep interface io.reactivex.rxjava3.core.** { *; }

# 忽略 RxJava 3 相关的警告
-dontwarn io.reactivex.rxjava3.**

# Cordova和插件
-keep class org.apache.cordova.** { *; }
-keep class com.android.plugins.Permissions { *; }
-keep class de.appplant.cordova.plugin.** { *; }
-keep class nl.xservices.plugins.** { *; }

# Java-WebSocket
-keep class org.java_websocket.** { *; }
-keep interface org.java_websocket.** { *; }
-dontwarn org.java_websocket.**
-keep class * extends org.java_websocket.client.WebSocketClient {
    public <init>(...);
    public void onOpen(...);
    public void onMessage(...);
    public void onClose(...);
    public void onError(...);
}
-keep class * extends org.java_websocket.server.WebSocketServer {
    public <init>(...);
    public void onOpen(...);
    public void onMessage(...);
    public void onClose(...);
    public void onError(...);
}

# nonameCore
-keep class com.noname.core.** { *; }
-keep class com.norman.webviewup.lib.** { *; }
-keep class cn.hle.skipselfstartmanager.util.MobileInfoUtils { *; }

# 类名不变
-keep class com.widget.noname.MyApplication
-keep class com.widget.noname.LaunchActivity
-keep class * extends com.widget.noname.common.function.BaseFunction {
    public <init>(...);
}
-keep class com.widget.noname.common.** { *; }
-keep class com.widget.noname.nonameui.** { *; }

# dialogx
-keep class com.kongzue.dialogx.** { *; }
-dontwarn com.kongzue.dialogx.**
-keep class android.view.** { *; }
-dontwarn androidx.renderscript.**
-keep public class androidx.renderscript.** { *; }