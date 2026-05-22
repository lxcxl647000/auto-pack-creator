#!/usr/bin/env node
import { program } from "commander";
import PackManager from "./pack/PackManager";

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = '1';
program
    .option("-p, --path <value>", "Cocos项目根目录[Path]")
    .option("-c, --channel <value>", "指定打包对应渠道名称[ChannelName]")
    .option("-v, --version <value>", "设置打包的版本号格式x.x.x")
    .option("-d, --debug", "是否为测试包true:不是测试包,false:测试包", false)
    .option("-b, --bundle", "是否打包App Bundle 安卓需要 [value]=true|false", false)
    .option("-s, --skip", "是否跳过cocos构建工程，直接使用导出工程 [value]=true|false", false)
    .option("-no, --nonotify", "是否跳过钉钉通知", false)
    .option("-t, --tdesc [value]", "小游戏后台上传描述，字节微信等", "")
    .option("-bn, --BMSName [value]", "实名控制的BMSName", "")
    .option("-bv, --BMSVersion [value]", "实名控制的BMSVersion", "")
    .option("-cp, --compress", "是否压缩资源", false)
    .option("-oc, --obfuscated", "是否混淆", false)
    .option("-rc, --remoteConfig [value]", "远程配置路径", "")
    .option("-l, --local", "是否本地", false)
    .option("-mc, --config", "是否压缩配置", false)
    .option("-svn, --svnConfigPath [value]", "配置表", "")
    .option("-hu, --hotUpdate", "是否需要热更包配置", false)
    .option("-hup, --hotUpLoad", "是否需要上传热更包配置", false)

program.parse(process.argv);
const options = program.opts();
console.log(options)

// 从第一个工程开始打包
PackManager.ins.packIndex = 0;

/*e:
set batcommond=-d
if %ISSKIP%==true set batcommond=%batcommond% -s
if %ISNONOTIFY%==true set batcommond=%batcommond% -no
if %ISCOMPRESS%==true set batcommond=%batcommond% -cp
if %ISOBFUS%==true set batcommond=%batcommond% -oc
if %LOCAL%==true set batcommond=%batcommond% -l
creatorpacker -p %WORKSPACE% -c web_desktop -v 1.0.0 -t test -bn %BMS_NAME% -bv %BMS_VERSION% -rc %remoteConfig% %batcommond%
/*
# 初始化参数数组
batcommond="-d"

# 根据环境变量构建参数
if [ "$ISSKIP" = "true" ]; then
    batcommond="$batcommond -s"
fi

if [ "$ISNONOTIFY" = "true" ]; then
    batcommond="$batcommond -no"
fi

if [ "$ISCOMPRESS" = "true" ]; then
    batcommond="$batcommond -cp"
fi

if [ "$ISOBFUS" = "true" ]; then
    batcommond="$batcommond -oc"
fi

if [ "$LOCAL" = "true" ]; then
    batcommond="$batcommond -l"
fi

# 执行命令
creatorpacker -p "$WORKSPACE" -c "$PLATFORMS" -v 1.0.0 -t "$UPLOAD_DESC" -bn "$BMS_NAME" -bv "$BMS_VERSION" -rc "$remoteConfig" $batcommond

*/