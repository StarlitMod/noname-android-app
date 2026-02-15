package com.widget.noname;

interface IUserService {

    /**
     * Shizuku服务端定义的销毁方法
     */
    void destroy() = 16777114;

    /**
     * 自定义的退出方法
     */
    void exit() = 1;

    /**
     * 执行命令
     */
    String execLine(String command) = 2;

    /**
     * 执行数组中分离的命令
     */
    String execArr(in String[] command) = 3;
    
    /**
     * 绑定本地Socket桥接
     * @param socketName 抽象Socket名称（如 webview_devtools_remote_42347）
     * @param clientSocket 客户端Socket文件描述符
     */
    void bindLocalSocketBridge(String socketName, in ParcelFileDescriptor clientSocket) = 4;
    
    /**
     * 获取所有可用的WebView调试Socket列表
     */
    List<String> getRemoteDevtoolsList() = 5;
    
    /**
     * 通过PID获取包名
     * @param pid 进程ID
     */
    String getPackageNameByPid(int pid) = 6;
    
    /**
     * 建立ADB端口转发
     * @param socketName 目标Socket
     * @param localPort 本地端口（0表示自动分配）
     * @return 实际分配的端口号
     */
    int forwardPort(String socketName, int localPort) = 7;
    
    /**
     * 关闭所有连接
     */
    void closeAllConnections() = 8;
}