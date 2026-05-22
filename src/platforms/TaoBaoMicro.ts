import { BasePlatform } from "./BasePlatform";
import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import path from "path";
import PackManager from "../pack/PackManager";
export class TaoBaoMicro extends BasePlatform {
    public QRCodeURL: string = "";
    public async afterBuildFinish() {
        if (this.upload) {
            console.log(`------------- ${this.configData.gameName} start upload ---------  `);
            let uploadSuccess = () => {
                PackManager.ins.addSuccessUpload(this.configData.gameName);
            };
            let uploadFail = () => {
                PackManager.ins.addFailUpload(this.configData.gameName);
            };
            try {
                let version = '';
                let outPath = path.join(this.outputPath, this.curPackChannel);

                // 获取小游戏信息，拿到版本号
                this._spawn(["app", "--appId", this.channelInfo.appid],
                    (data: string) => {
                        let str: string = data.trim();
                        let arr = str.split('最新线上版本:');
                        version = arr[1].trim();
                    },
                    () => {
                        let versionArr = version.split('.');
                        version = versionArr[0] + '.' + versionArr[1] + '.' + (+versionArr[2] + 1);
                        // 上传小游戏
                        console.log(`${this.configData.gameName} start upload version:${version}`);
                        this._spawn(["upload", "--input", outPath, "--appId", this.channelInfo.appid, "--type", "minigame", "--version", version], null,
                            (data: any) => {
                                uploadSuccess();
                            },
                            () => {
                                uploadFail();
                            }
                        );
                    }, null
                );
            } catch (error) {
                console.log(`${this.configData.gameName} upload failed :${error}`);
                uploadFail();
            }
        }
        else {
            console.log(`${this.configData.gameName} not need to upload`);
        }
        this.saveBackUpConfig();
        await super.afterBuildFinish();
    }

    private _spawn(args: string[], outFunc: Function, success: Function, fail: Function) {
        if (!args || args.length === 0) {
            return;
        }
        let sp: ChildProcessWithoutNullStreams = spawn("tbopen", args, { shell: true });
        sp.stdout.setEncoding('utf8');
        let commondStr = sp.spawnargs[4].replace(/"/g, '');
        sp.stdout.on('data', (data) => {
            console.log(`${this.configData.gameName} ${commondStr} stdout ${data.toString()}`);
            outFunc && outFunc(data);
        });
        sp.stderr.on('data', (data) => {
            console.log(`${this.configData.gameName} ${commondStr} stderr ${data.toString()}`);
        })
        sp.on('exit', (code, data) => {
            if (code === 0) {
                console.log(`${this.configData.gameName} ${commondStr} success :${data}`);
                success && success(data);
            }
            else {
                console.log(`${this.configData.gameName} ${commondStr} failed :${data}`);
                fail && fail(data);
            }
        });
    }

    public async beforeStartBuild() {
        await super.beforeStartBuild();
    }
}