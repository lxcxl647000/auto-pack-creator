import fs, { existsSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';
import yaml from 'yamljs';
import { BasePlatform } from '../platforms/BasePlatform';
import { IPackConfig, supportPlatform } from '../platforms/PlatformConfig';
import PackUtil from '../utils/PackUtil';
import exp from 'constants';
import { PackArr, PackProjects } from '../packProjects/PackProjects';

class _Pack {
    public configData: IPackConfig = null!;
    public curPackChannel: string = "";
    public projectDir: string = "";
    public isDebug: boolean = false;

    public curPlatform: BasePlatform = null!;
    public constructor() {

    }
    /**
     * 初始化必要参数
     * @param projectDir 项目目录
     * @param packChannel 打包渠道
     * @returns 
     */
    public init(projectDir: string, packChannel: string, isdebug: boolean = false, version?: string, desc?: string, androidBundle: boolean = false, bmsname: string = "", bmsversion: string = "") {
        this.isDebug = isdebug;
        let configyml = PackUtil.isIOS ? "pack.configios.yml" : "pack.config.yml";
        let configPath = path.join(projectDir, "settings", configyml);
        console.log(`projectDir=${projectDir}`, `pack channel=${packChannel}`);
        if (!fs.existsSync(configPath)) {
            console.error(`config file does't exits：${configPath}`);
            return;
        }
        this.projectDir = projectDir;
        this.configData = yaml.parse(fs.readFileSync(configPath).toString());
        const channelInfo = this.configData.platforms[packChannel];
        if (!channelInfo) {
            console.error(`current channel ${packChannel} does't extis, please check ${configyml}`);
            return;
        }
        const scripts = supportPlatform[packChannel] || (channelInfo.channel ? supportPlatform[channelInfo.channel] : null);
        if (!scripts) {
            console.error(`current channel ${packChannel} pack script does't extis, please confirm`);
            return;
        }
        this.checkCustomEngine();
        this.curPlatform = new scripts();
        (<any>this.curPlatform).bmsName = bmsname;
        this.curPlatform.init({ channel: packChannel, configData: this.configData, isDebug: this.isDebug, projectDir, forceVersion: version, desc });
        if (this.curPlatform.channelInfo.isNative) {
            console.log("isBundle = ", androidBundle, "bmsname = ", bmsname, "bmsversion = ", bmsversion);
            (<any>this.curPlatform).isBundle = androidBundle;

            (<any>this.curPlatform).bmsVersion = bmsversion;
        }

        this.startBuild(packChannel);
    }

    public startBuild(packChannel: string) {
        this.curPlatform.startBuild();
    }

    /**
     * 检测是否有自定义引擎路径，有则修改local/settings.json下的配置
     */
    public checkCustomEngine() {
        if (this.configData.customJsEnginePath || this.configData.customCppEnginePath) {
            let configPath = path.join(this.projectDir, "local");
            let settingjsonpath = path.join(configPath, "settings.json");
            if (!existsSync(settingjsonpath)) {
                PackUtil.mkdirSync(configPath);//没有对应输出目录则创建目录
                let obj = {
                    "use-global-engine-setting": false,
                    "use-default-js-engine": !this.configData.customJsEnginePath,
                    "js-engine-path": this.configData.customJsEnginePath ? this.configData.customJsEnginePath : "",
                    "use-default-cpp-engine": !this.configData.customCppEnginePath,
                    "cpp-engine-path": this.configData.customCppEnginePath ? this.configData.customCppEnginePath : "",
                }
                writeFileSync(settingjsonpath, JSON.stringify(obj, null, "\t"), { encoding: 'utf-8' });
            } else {
                let configinfo = JSON.parse(readFileSync(settingjsonpath, { encoding: 'utf-8' }));
                configinfo["use-global-engine-setting"] = false;
                configinfo["use-default-js-engine"] = !this.configData.customJsEnginePath;
                configinfo["use-default-cpp-engine"] = !this.configData.customCppEnginePath;
                if (this.configData.customJsEnginePath)
                    configinfo["js-engine-path"] = this.configData.customJsEnginePath;
                if (this.configData.customCppEnginePath) {
                    configinfo["cpp-engine-path"] = this.configData.customCppEnginePath;
                }
                writeFileSync(settingjsonpath, JSON.stringify(configinfo, null, "\t"), { encoding: 'utf-8' });
            }
        }
    }
}

export default class PackManager {
    private static _mgr: PackManager = null!;
    public static get ins(): PackManager {
        if (!this._mgr) {
            this._mgr = new PackManager();
        }
        return this._mgr;
    }

    private _packIndex = 0;
    public get packIndex() {
        return this._packIndex;
    }
    public set packIndex(index: number) {
        if (index === 0) {// 从0开始的时候把数据清空
            this._successPackProjects = [];
            this._failPackProjects = [];
        }
        this._packIndex = index;
        this._doPack();
    }

    private _successPackProjects: string[] = [];
    private _failPackProjects: string[] = [];

    public addSuccessProject(name: string) {
        this._successPackProjects.push(name);
    }

    public addFailProject(name: string) {
        this._failPackProjects.push(name);
    }

    private _doPack() {
        if (this._packIndex < PackArr.length) {
            let project = PackArr[this._packIndex];
            let projectDir = project.path;
            let channel = project.channel;
            let version = project.version || "1.0.0";
            let isdebug = project.debug;
            let desc = typeof project.tdesc == "string" ? project.tdesc : "";
            let androidBundle = project.bundle;
            let bmsname = typeof project.BMSName == "string" ? project.BMSName : "";
            let bmsversion = typeof project.BMSVersion == "string" ? project.BMSVersion : version as string;
            if (projectDir && channel) {
                new _Pack().init(projectDir, channel, isdebug, version!, desc, androidBundle, bmsname, bmsversion);
            }
        }
        else {
            console.log(`--------------total build projects ${PackArr.length}  success : ${this._successPackProjects.length}  fail : ${this._failPackProjects.length}--------------------`);
            console.log("--------------build finish all projects--------------------");
            console.log("success pack projects: ");
            for (let i = 0; i < this._successPackProjects.length; i++) {
                console.log(this._successPackProjects[i]);
            }
            console.log("fail pack projects: ");
            for (let i = 0; i < this._failPackProjects.length; i++) {
                console.log(this._failPackProjects[i]);
            }
            console.log("--------------build finish all projects--------------------");
        }
    }
}