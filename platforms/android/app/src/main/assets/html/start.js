'use strict';

(function () {
    var lib = {
        configprefix: 'noname_0.9_',
        db: null,
        openPromise: null // 缓存打开数据库的 Promise，避免重复打开
    };

    // 工具函数：将 IDBRequest 转为 Promise
    function idbRequestToPromise(request) {
        return new Promise((resolve, reject) => {
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // 打开数据库（返回 Promise）
    function openDatabase() {
        if (lib.openPromise) {
            return lib.openPromise; // 避免重复打开
        }

        const request = window.indexedDB.open(lib.configprefix + 'data');

        request.onblocked = () => {
            console.log("IndexedDB: onBlocked! Database is blocked.");
        };

        request.onupgradeneeded = function (e) {
            const db = e.target.result;
            if (!db.objectStoreNames.contains('video')) {
                db.createObjectStore('video', { keyPath: 'time' });
            }
            if (!db.objectStoreNames.contains('image')) {
                db.createObjectStore('image');
            }
            if (!db.objectStoreNames.contains('audio')) {
                db.createObjectStore('audio');
            }
            if (!db.objectStoreNames.contains('config')) {
                db.createObjectStore('config');
            }
            if (!db.objectStoreNames.contains('data')) {
                db.createObjectStore('data');
            }
        };

        lib.openPromise = idbRequestToPromise(request)
            .then(db => {
                lib.db = db;
                console.log("openDB success.", db);
                return db;
            })
            .catch(err => {
                console.log("openDB error:", err);
                lib.openPromise = null; // 打开失败，重置
                throw err;
            });

        console.log("Opening database...");
        return lib.openPromise;
    }

    var app = {
        async initialize() {
            try {
                await this.jsReady();
                await this.openDB();
            } catch (err) {
                console.error("Initialization failed:", err);
            }
        },

        async jsReady() {
            console.log("start: ", window.localStorage);

            if (!window.jsBridge || typeof window.jsBridge.getAssetPath !== 'function') {
                console.error("jsBridge is not available!");
                throw new Error("jsBridge not ready");
            }

            console.log("jsBridge: ", window.jsBridge.getAssetPath());
            localStorage.setItem('noname_inited', window.jsBridge.getAssetPath());
        },

        async openDB() {
            if (lib.db) {
                console.log("DB already open, closing first...");
                lib.db.close();
                lib.db = null;
                lib.openPromise = null; // 重置 Promise
            }

            try {
                await openDatabase();
                this.onJsInited();
            } catch (err) {
                console.error("Failed to open database:", err);
            }
        },

        async getDB(key) {
            if (!lib.db) {
                console.trace("getDB fail: lib.db is null, key:", key);
                return null;
            }

            const tx = lib.db.transaction(['config'], 'readonly');
            const store = tx.objectStore('config');
            const request = store.get(key);
            try {
                const result = await idbRequestToPromise(request);
                return result;
            } catch (err) {
                console.error("getDB error for key", key, err);
                return null;
            }
        },

        async putDB(key, value, onSuccess) {
            if (!lib.db) {
                console.log("putDB fail: lib.db is null, key:", key, "value:", value);
                return;
            }

            const tx = lib.db.transaction(['config'], 'readwrite');
            const store = tx.objectStore('config');
            const request = store.put(value, key);

            try {
                await idbRequestToPromise(request);
                console.trace("putDB success, key:", key, "value:", value);
                if (onSuccess) onSuccess();
            } catch (err) {
                console.error("putDB error for key", key, err);
            }
        },

        async deleteDB(key) {
            if (!lib.db) {
                console.log("deleteDB fail: lib.db is null, key:", key);
                return;
            }

            const tx = lib.db.transaction(['config'], 'readwrite');
            const store = tx.objectStore('config');
            const request = store.delete(key);

            try {
                await idbRequestToPromise(request);
                console.log("deleteDB success, key:", key);
            } catch (err) {
                console.error("deleteDB error for key", key, err);
            }
        },

        closeDB() {
            if (lib.db) {
                lib.db.close();
                lib.db = null;
                lib.openPromise = null;
            }
            console.log("closeDB");
            if (window.jsBridge && typeof window.jsBridge.onCloseDB === 'function') {
                window.jsBridge.onCloseDB();
            }
        },

        async onJsInited() {
            console.log('onJsInited');
            if (window.jsBridge && typeof window.jsBridge.onPageStarted === 'function') {
                window.jsBridge.onPageStarted();
            }

            const value = await this.getDB("recentIP");
            if (window.jsBridge && typeof window.jsBridge.onRecentIpsUpdate === 'function') {
                window.jsBridge.onRecentIpsUpdate(value ? value.toString() : null);
            }
        },

        async getExtensions() {
            const extensions = (await this.getDB("extensions")) || [];
            if (window.jsBridge && typeof window.jsBridge.onGetExtensions === 'function') {
                window.jsBridge.onGetExtensions(extensions.toString());
            }
        },

        async getExtensionState(extname) {
            const key = "extension_" + extname + "_enable";
            const value = await this.getDB(key);
            if (window.jsBridge && typeof window.jsBridge.onExtensionStateGet === 'function') {
                window.jsBridge.onExtensionStateGet(extname, value);
            }
        },

        async enableExtension(extname, enable) {
            const extensions = (await this.getDB("extensions")) || [];
            const pos = extensions.indexOf(extname);

            if (pos === -1) {
                extensions.push(extname);
                await this.putDB("extensions", extensions, () => {});
            }

            await this.putDB("extension_" + extname + "_enable", enable, () => {});
        },

        async removeExtension(extname) {
            let extensions = (await this.getDB("extensions")) || [];
            const pos = extensions.indexOf(extname);

            if (pos >= 0) {
                extensions.splice(pos, 1);
                await this.putDB("extensions", extensions, async () => {
                    // 删除所有以 extension_extname_ 开头的键
                    const tx = lib.db.transaction(['config'], 'readwrite');
                    const store = tx.objectStore('config');
                    const request = store.openCursor();

                    return new Promise((resolve, reject) => {
                        request.onsuccess = (event) => {
                            const cursor = event.target.result;
                            if (cursor) {
                                const key = cursor.key;
                                if (typeof key === 'string' && key.startsWith('extension_' + extname)) {
                                    const deleteReq = cursor.delete();
                                    deleteReq.onsuccess = () => cursor.continue();
                                    deleteReq.onerror = () => cursor.continue();
                                } else {
                                    cursor.continue();
                                }
                            } else {
                                resolve();
                            }
                        };
                        request.onerror = () => reject(request.error);
                    });
                });

                // 最后通知更新
                await this.getExtensions();
            }
        },

        async setServerIp(ip, directStart) {
            console.log("setServerIp, ip:", ip, "directStart:", directStart);

            if (directStart) {
                await this.putDB('mode', 'connect');
                await this.putDB('show_splash', 'off');
                await this.putDB("reconnect_info", null);
                await this.putDB("new_tutorial", true);
                this.setServerIp(ip, false);
            } else {
                await this.putDB("last_ip", ip);
                if (window.jsBridge && typeof window.jsBridge.onServeIpSet === 'function') {
                    window.jsBridge.onServeIpSet();
                }
            }
        }
    };

    // 启动应用
    app.initialize().catch(err => {
        console.error("App initialization failed:", err);
    });

    window.app = app;
})();