import { existsSync, readFileSync, writeFileSync } from "fs";
import minidev from "minidev";
import path from 'path';
import PackUtil from "../utils/PackUtil";
import { BasePlatform } from "./BasePlatform";
import { ChannelInfo } from "./PlatformConfig";
export class TaoBaoMicro extends BasePlatform {
    public QRCodeURL: string = "";
    public async afterBuildFinish() {
        // let configPath = path.join(this.projectDir, "settings", "taobao-mini-game.json");
        // if (existsSync(configPath)) {
        //     let channelInfo: ChannelInfo = this.configData.platforms[this.curPackChannel];
        //     let remoteDir = PackUtil.compareVersion(this.configData.engineVer, "2.4.0") >= 0 ? "remote" : "res";
        //     let remotepath = path.join(this.outputPath, channelInfo.platform, remoteDir);
        //     if (existsSync(remotepath) && channelInfo.remoteDir != "") {
        //         console.log('upload cdn res start');
        //         let cdnrespath = channelInfo.remoteDir;
        //         PackUtil.mkdirSync(channelInfo.remoteDir);
        //         try {
        //             PackUtil.pullCDNRes(cdnrespath);
        //         } catch (error) {
        //             console.error(error)
        //         }
        //         PackUtil.moveFiles(remotepath, cdnrespath);
        //         PackUtil.uploadCDNRes(cdnrespath);
        //         console.log('upload cdn res finish');
        //     }
        //     console.log('start pack taobao');
        //     try {
        //         let privatePath = channelInfo.privatePath!;
        //         await minidev.app.deleteVersion({
        //             appId: channelInfo.appid!,
        //             version: this.version,
        //             identityKeyPath: privatePath!
        //         })
        //         const uploadResult = await minidev.upload({
        //             appId: channelInfo.appid!,
        //             identityKeyPath: privatePath!,
        //             version: this.version,
        //             project: path.join(this.outputPath, this.channelInfo.platform),
        //             isGame: true,
        //             experience: true,
        //         }, {
        //             onLog: (data) => {
        //                 console.log(data);
        //             },
        //         }).catch((error) => {
        //             console.error(error);
        //         })
        //         if (!uploadResult) {
        //             throw Error("upload failed");
        //         }
        //         this.QRCodeURL = uploadResult.experienceQrCodeUrl!;
        //         console.log(uploadResult);
        //         this.saveBackUpConfig();
        //     } catch (error) {
        //         throw error;
        //     }
        // } else {
        //     throw Error("please pack first in editor---afterBuildFinish");
        // }
        this.saveBackUpConfig();
        await super.afterBuildFinish();
    }

    public async beforeStartBuild() {
        // let configPath = path.join(this.projectDir, "settings", "taobao-mini-game.json");
        // console.log('comfigPath ', configPath);

        // if (existsSync(configPath)) {
        //     let config = JSON.parse(readFileSync(configPath, { encoding: 'utf-8' }));
        //     if (typeof this.channelInfo.REMOTE_SERVER_ROOT != 'undefined') {
        //         config.remoteUrl = this.channelInfo.REMOTE_SERVER_ROOT;
        //     }
        //     writeFileSync(configPath, JSON.stringify(config, null, "\t"), { encoding: 'utf-8' });
        // } else {
        //     throw Error("please pack first in editor---beforeStartBuild");
        // }

        await super.beforeStartBuild();
    }
}