# Android 开发环境配置说明

## 📌 已完成的配置

### 1. VS Code 工作区配置 (`.vscode/settings.json`)

已配置以下功能：

- **Java 环境**: 使用 JDK 17
- **Gradle 集成**: 自动导入 Gradle 项目
- **源码路径**: 包含所有 Android 模块的源码路径
- **依赖库**: 自动引用所有 libs 目录下的 jar 文件
- **实时 Lint 检查**: 通过 Java 扩展提供编辑时的代码分析
- **自动构建**: 启用保存时自动编译和检查
- **代码格式化**: 保存时自动整理 import 和格式化代码

### 2. Git 忽略配置 (`.gitignore`)

已添加以下忽略规则：

```
.vscode/settings.json          # VS Code 工作区设置
**/build/                      # Gradle 构建产物
**/.gradle/                    # Gradle 缓存
**/gen/                        # 生成的代码
**/lint-report.html            # Lint HTML 报告
**/lint-report.xml             # Lint XML 报告
**/*.class                     # Java 编译产物
**/*.log                       # 日志文件
```

## 🔧 必需的 VS Code 扩展

安装以下扩展以获得完整的 Android 开发支持：

1. **Extension Pack for Java** (必装)
   - 提供者：Microsoft
   - 功能：Java 语言支持、调试、Maven/Gradle 集成

2. **Android Java Pack** (推荐)
   - 提供者：Google
   - 功能：Android 开发工具包

3. **Debugger for Java** (可选，通常包含在 Extension Pack 中)
   - 功能：Java 调试支持

## 🚀 如何使用

### 1. 打开项目

在 VS Code 中打开项目根目录：
```bash
cd e:\cordovaApps\noname-android-app
code .
```

### 2. 等待项目初始化

首次打开时，VS Code 会：
- 导入 Gradle 项目
- 下载依赖
- 建立代码索引
- 配置 Android SDK

这可能需要几分钟时间。

### 3. 编辑时代码检查

配置完成后，当你编辑 Java 文件时，会自动进行以下检查：

- ✅ **语法错误**: 红色波浪线标记
- ✅ **类型错误**: 编译时类型检查
- ✅ **未使用的导入**: 黄色波浪线提示
- ✅ **空指针风险**: 空值分析警告
- ✅ **代码建议**: 快速修复和优化建议

### 4. 查看问题面板

按 `Ctrl+Shift+M` 打开问题面板，查看所有错误和警告。

### 5. 快速修复

将光标放在有问题的代码上，按 `Ctrl+.` 可以快速修复：
- 导入缺失的类
- 添加 try-catch
- 实现抽象方法
- 重命名变量

## ⚠️ 注意事项

1. **首次打开项目较慢**是正常的，因为需要导入 Gradle 项目和下载依赖

2. **如果看到红色错误但代码正确**，尝试：
   - 按 `F1` → 输入 "Java: Clean Java Language Server Workspace"
   - 或重启 VS Code

3. **确保 JDK 17 已安装**并配置在正确位置

4. **Android SDK 不是必须的**用于编辑时的代码检查，但构建和运行时需要

## 📝 快捷键

| 快捷键 | 功能 |
|--------|------|
| `Ctrl+Shift+M` | 打开问题面板 |
| `Ctrl+.` | 快速修复 |
| `F12` | 跳转到定义 |
| `Shift+F12` | 查看引用 |
| `Ctrl+B` | 跳转到实现 |
| `Ctrl+P` | 快速打开文件 |
| `Ctrl+Shift+O` | 跳转到符号 |

## 🔗 相关资源

- [VS Code Java 文档](https://code.visualstudio.com/docs/languages/java)
- [Android Lint 检查列表](https://developer.android.com/studio/write/lint-checks)
