'use strict';
(function () {
    var helper = {
        tag: "js_version_fragment",
        url: "",
        loaded: false,

        // 初始化入口
        async initialize() {
            try {
                await this.initJavaArgs();
                await this.start();
            } catch (err) {
                console.error(this.tag, "Initialization failed:", err);
                // 加载失败，尝试刷新页面
                window.location.reload();
            }
        },

        // 初始化 Java 参数，获取正确 URL
        initJavaArgs() {
            return new Promise((resolve, reject) => {
                try {
                    if (location.protocol.startsWith('file')) {
                        this.url = window.version_fragment.getUrl();
                    } else {
                        // https://localhost/android_asset/xxx -> https://localhost/xxx
                        this.url = location.origin + "/";
                    }
                    console.log(this.tag, "initJavaArgs, getUrl: " + window.version_fragment.getUrl() + ", loadUrl: " + this.url);
                    resolve();
                } catch (err) {
                    console.error(this.tag, "initJavaArgs failed:", err);
                    reject(err);
                }
            });
        },

        // 动态加载脚本（返回 Promise）
        loadScript(src) {
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                const url = this.url + 'game/' + src + '.js';

                script.src = url;
                script.onload = () => {
                    console.log(this.tag, `Script loaded: ${src}.js`);
                    resolve();
                };
                script.onerror = () => {
                    console.error(this.tag, `Failed to load script: ${src}.js`);
                    reject(new Error(`Script load failed: ${src}.js`));
                };

                document.head.appendChild(script);
            });
        },

        // 启动加载流程
        async start() {
            try {
                // 顺序加载 update.js -> config.js
                await this.loadScript('update');
                await this.loadScript('config');

                // 标记加载完成
                this.loaded = true;
                console.log("init, window.version: " + window.noname_update.version);

                // 通知 Java 层
                if (window.version_fragment && typeof window.version_fragment.onResourceLoad === 'function') {
                    window.version_fragment.onResourceLoad(JSON.stringify(window.noname_update));
                } else {
                    console.warn(this.tag, "version_fragment or onResourceLoad is not available");
                }
            } catch (err) {
                console.error(this.tag, "Script loading failed:", err);
                throw err; // 触发 initialize 中的 catch
            }
        },

        // 获取游戏版本
        getGameVersion() {
            if (this.loaded) {
                return window.noname_update?.version || "unknown";
            } else {
                return "资源未加载";
            }
        }
    };

    // 启动初始化
    helper.initialize();
})();