export interface PackProject {
    name: string,
    path: string,// Cocos项目根目录
    channel: string,// 指定打包对应渠道名称
    version?: string,// 设置打包的版本号
    debug?: boolean,// 是否为测试包true:不是测试包,false:测试包
    skip?: boolean,// 是否跳过cocos构建工程，直接使用导出工程
    nonotify?: boolean,// 是否跳过钉钉通知
    tdesc?: string,// 小游戏后台上传描述，字节微信等
    BMSName?: string,// 实名控制的BMSName
    BMSVersion?: string,// 实名控制的BMSVersion
    compress?: boolean,// 是否压缩资源
    obfuscated?: boolean,// 是否混淆
    remoteConfig?: string,// 远程配置路径
    local?: boolean,// 是否本地
    config?: boolean,// 是否压缩配置
    svnConfigPath?: string,// 配置表
    bundle?: boolean,// 是否打包App Bundle 安卓需要
    hotUpdate?: boolean,// 是否需要热更包配置
    hotUpLoad?: boolean// 是否需要上传热更包配置
    upload?: boolean// 是否需要上传
}

export const PackArr: PackProject[] = [
    // {
    //     name: "TemplateProject",
    //     path: "D:/cocos_project/TemplateProject",
    //     channel: "taobao-mini-game",
    // },
    // {
    //     name: "开心抓猫猫",
    //     path: "D:/cocos_project/HappyPullCat",
    //     channel: "taobao-mini-game",
    // },
    // {
    //     name: "养个招财猫",
    //     path: "D:/cocos_project/Cat",
    //     channel: "taobao-mini-game",
    // },
    {
        name: "萌宠连连看",
        path: "D:/cocos_project/Pet_Line",
        channel: "taobao-mini-game",
        upload: false,
        skip: false
    },
];