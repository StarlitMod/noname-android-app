可以在此文件夹放置webview应用来让app自动识别和使用。

文件名称要求是 包名_版本.apk, 比如com.google.android.webview_119.0.6045.53.apk

如果系统webview版本小于webview.apk的版本或系统webview是华为webview，那么将使用webview.apk作为内核

比对方式就是单纯的version name比对，所以google webview一般会大于华为webview