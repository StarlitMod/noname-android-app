> [无名杀](https://github.com/libnoname/noname)是优秀的`HTML单机三国杀`，游戏实现方式本质上来说是一个 网页+"浏览器"，通过能够在不同平台的浏览器运行无名杀网页，从而组成了各个平台的版本，版本的区别仅仅体现在浏览器的差异。 无名杀有强大的DIY功能，可以与网友讨论交流，设计自己喜欢的武将，目前支持联机功能。有着自己原创的模式，以及三国杀的众多玩法。

本仓库在其基础上开发的`android 应用程序`。

## 关于

程序开源代码：[https://github.com/nonameShijian/noname-android-app](https://github.com/nonameShijian/noname-android-app)，有任何程序上的问题可以到github上提 [issues](https://github.com/nonameShijian/noname-android-app/issues) 给我反馈。

## 功能说明

#### 共存

- 无名杀能够和原版共存，卸载、清除数据等操作不会影响到原有的游戏内容。
- 安装后的应用名称为`无名杀`

#### 版本管理

无名杀作为网页游戏，一直使用的是游戏内更新的方式，但是经常遇到GitHub访问不通畅、更新失败导致游戏无法运行的情况，重新下载费时费力，本应用提供了以下几种游戏资源和版本的管理方式。

- **从QQ群文件、文件管理器等直接导入资源、更新包到程序，便捷更新。**
- **通过本应用更新游戏主体资源，使用Github加速避免网络不通畅的情况。(但下载需要手动配置加速地址)**
- **不允许内置完整资源（即不允许被制作为懒人包）**
- **多版本切换，数据互不干扰**

[package.json](package.json)

#### 联机服务器

无名杀在`WebView`的基础上，结合`Android原生`开放的能力，实现了版本管理、资源下载、手机建立联机服务器等多种功能能力，用于解决原程序的`android版本`容易崩溃、无法创建联机服务器等问题。

## 主题结构

```
主题名称/
├── preview/                    # 主题预览图
│   └── xx.jpg                  # 主题截图（文件名可自定义）
│
├── assets/                     # 主题资源文件
│   ├── video/
│   │   └── splash_video.mp4    # 启动视频（可选，但文件名固定）
│   └── images/
│       └── background/         # 背景图片目录
│           ├── 0.jpg           # 默认背景图（文件名固定，不可修改）
│           └── custom_*.jpg    # 自定义背景图（文件名可自定义）
│
└── manifest.json           # 主题配置文件（包含名称、版本、作者、描述、应用图标等）
```

注: 应用图标(icon)的可用值为:

1. ic_launcher
2. ic_noname_plus_launcher
3. ic_launcher_xiaowu
4. ic_launcher_jiaozhu

## 更新日志

#### 版本1.2.0.1

2026年6月14日

构建及功能修复：

1. 移除 native 签名校验逻辑，重新签名后不再弹出“请勿修改本 App”提示
2. 保留并内置 Android WebView 119 内核：`com.google.android.webview_119.0.6045.194.apk`
3. 补齐 WebViewUpgrade、zip4j、DialogX 本地 AAR 等依赖配置，并生成临时 release 签名配置，支持直接 Gradle 编译 arm64 release APK
4. 修复 `WebViewFileSystemLoader` 的 prefix 路径问题：以 Java 反射替换原生 JNI 实现并改为相对路径，解决首次进入游戏连接 localhost 失败的问题
5. 修复 `Settings.restartApp()` 在 Android 12+ 上重启不可靠的问题，改用 `finishAffinity()` 确保导入资源后重启生效
6. 新增首次启动新手引导询问弹窗，并在设置页加入「关闭所有新手引导」按钮，可一键关闭全部引导
7. 优化「播放启动动画」开关说明，明确关闭后可跳过启动视频
8. 导入或迁移后统一修复目录权限为可读写状态，便于文件管理器直接操作插件和游戏目录；设置页新增开关，可选择关闭自动修复、改为在版本页手动点击「设置目录为可读写」
9. 修复版本页扩展管理的状态回填问题（显示名与目录名不一致导致重启后开关错误），并修复首次直进扩展页时状态不刷新的时序问题
10. 将编译产出的 APK 文件名改为 `NoName_版本号(版本code)-架构.apk`，避免中文文件名影响 release 发布
11. 将 `MTDataFilesProvider` 移至 `FunctionLibrary` 模块的 `bin.mt.file.content` 包下，并新增 `MTDataFilesWakeUpActivity`，统一在 `FunctionLibrary` 中注册

#### 版本1.2.0

2026年5月17日

因近期遭遇网络暴力及现实骚扰，为保护个人安全，本人将更换所有联系方式（旧号即日起停用，不再回复）。

同时，所有内容暂停更新，恢复时间无法确定。

感谢理解，后会有期。

1. 部分界面支持使用mt管理器打开文件
2. 更新WebViewUpgrade库，支持安卓15或以上版本内置WebView内核，且启动不再需要自启动权限
3. 内置119版本WebView内核，此内核仅在版本比系统WebView新或为华为WebView时启用
4. 增加默认的下载加速链接

注: 内置内核可能影响开启"自动进入游戏"设置的启动速度

#### 版本1.1.0

2026年3月28日

1. 修复处于网页内无法导入压缩包的问题
2. 修复平板等大屏幕设备不能确认协议的bug
3. 补全教主主题的背景素材
4. 主界面增加横向滚动以解决分屏模式下按钮显示不全的问题
5. 新增webview崩溃提示
6. 设置页新增接收内测版更新功能，清确保可以连接GitHub或配置了下载加速链接
7. 静默检查更新以优化体验
8. 修复注入的noname_inited有中文路径时被编码的问题
9. 联机地址尝试忽略VoLTE专用接口
10. 更新方式添加跳转浏览器下载
11. 隐藏闪屏页的App Logo
12. 移除NonameCore模块
13. 联机支持修改端口
14. 内测版可跳过新手教程
15. 切换WebView实现页面支持国际化
16. 扩展界面优化，支持排序
17. 修复导入乱码zip文件时解压目录错误的问题
18. 修改加速链接部分的教程文字
19. 删除过期服务器
20. 支持v3签名
21. 安装app启用过渡动画
22. 新增java崩溃记录界面
23. 重构启动更换图标服务的实现方式

#### 版本1.0.0

2026年2月17日

> 注: 源代码将在正式发布后再进行上传。且本版本的更新日志是相对于增强版APP的

1. 禁止内置zip资源以制作懒人包（仍然可以导入懒人包zip资源）
2. 增强签名验证功能
3. 初始进入游戏时显示隐私协议以及免责声明
4. 添加强制更新APP功能
5. 部分界面添加教程引导功能
6. 与[无名杀](https://github.com/libnoname/noname)进行解耦，支持导入其它的本地HTML项目运行
7. 增强导入功能，支持zip，7z，rar，tar压缩包的导入，支持带密码的扩展导入，支持识别HTML项目、扩展包、游戏主体包(离线/完整包)以及当前使用的游戏主体中扩展配置文件(info.json)中的自定义包
8. 新增添加便捷导入目录功能，可以在本APP中快速导入指定目录下的文件，并可以导入该目录下的单个非压缩包文件到本体目录，或进行分享
9. 增加迁移功能，原诗笺版和由理版用户可以将文件和数据便捷迁移到本APP中。由于增强版系列玩家较少，暂不打算为此更新增强版，请游玩增强版懒人包的用户请求懒人包制作者使用mt管理器注入文件提供器后可使用迁移功能
10. 版本页增加扩展管理功能，可以查看或删除当前使用的游戏主体中已导入的扩展
11. 增加主题页，可以导入自定义主题
12. 增加设置页，具体功能请用户自行查看
13. 内置Chrome Devtools，在Shizuku的root授权下可以调试网页内容(代码参考了[FoldDevtools](https://github.com/achyuki/FoldDevtools))
14. 本项目已经与[noname-shijian-android](https://github.com/nonameShijian/noname-shijian-android)合并，并且重新创建项目，所以本项目拥有了原诗笺版和原增强版的绝大多数功能

## 💖 赞助感谢

如果这个应用对你有帮助，可以考虑支持一下开发者，谢谢！

赞助链接: [https://afdian.com/a/sjahkl](https://afdian.com/a/sjahkl)

感谢以下小伙伴通过爱发电支持项目发展！

<details>
<summary>📅 2026年赞助记录（点击展开）</summary>

### 一月

2026年1月赞助截图: [docs/sponsors/2026-01.jpg](docs/sponsors/2026-01.jpg)

### 二月

2026年2月赞助截图: [docs/sponsors/2026-02.jpg](docs/sponsors/2026-02.jpg)

### 三月

2026年3月赞助截图: [docs/sponsors/2026-03.jpg](docs/sponsors/2026-03.jpg)

### 四月

2026年4月赞助截图: [docs/sponsors/2026-04.jpg](docs/sponsors/2026-04.jpg)

</details>

---

> 💡 每月赞助截图已放在 [`/docs/sponsors/`](/docs/sponsors) 目录下
