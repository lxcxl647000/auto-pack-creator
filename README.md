## CocosCreator自动打包工具
##### 开发环境及语言：nodejs+TypeScript
##### 使用步骤：
- 命令行安装必备依赖模块npm install
- 首次使用需要编译打包工具 tsc --build
- 拷贝当前目录下的pack.config.yml配置文件到需要打包的工程的settings文件夹目录下
- 修改CocosCreator工程settings文件夹下pack.config.yml里的相关配置
- 执行打包命令 node ./build/app.js -p 项目路径 -c 打包的渠道平台

##### 目前支持打包渠道
1. 微信小游戏 可自动上传到后台
2. 字节跳动 可自动上传到后台
3. oppo/vivo/小米小游戏 打包出rpk文件
4. 快手小游戏  打包出zip压缩包，不支持上传后台，快手没提供对应ci工具
5. 百度小游戏 可自动上传到后台
6. h5 自动提交到服务器
7. 原生安卓等渠道 打包出apk

#### 命令详解
##### Options:
-p,--path           打包的项目路径(必填)

-c,--channel        打包对应的渠道(必填)

-d,--debug          是否是debug版本(可选，默认false,目前是对特定项目有用，可忽略)

-v                  打包的版本号(可选,格式x.x.x，如果传入则以传入版本号为准，否则以pack.config.yml与本地缓存的pack.config.json配置检测比较取版本号最大值为准) 

-h,--help           帮助说明(可选)

-t    小游戏后台上传描述，字节微信等

-b    是否是构建bundle（仅用于安卓）//2021-08-11更新

-bn  自家聚合实名认证BMS名称（仅用于安卓）**//2021-10-26更新**

-bv 自家聚合实名认证BMS版本（仅用于安卓）**//2021-10-26更新**



## 打包配置文件pack.config.yml|pack.configios.yml相关重要参数说明

​	注：`pack.config.yml`配置为windows系统下配置，`pack.configios.yml`为mac系统下配置，主要区别是路径

1. **enginePath**-CocosCreator应用路径
2. **engineVar**-当前CocosCreator的版本号 ，用于工具能够根据版本号做特定兼容
3. **customJsEnginePath**-自定义engine路径，如果有定制js引擎代码的需要添加对应路径
4. **customCppEnginePath**-自定义cocos2d-x路径，如果有定制c++层引擎代码的需要添加对应路径
5. **gitBashPath**-git-bash路径，目前主要用于快手小游戏执行打包shell脚本
6. **keyStoreInfo**-android签名信息
   1. keystorePath-密钥文件路径
   2. keystorePassword-文件密码
   3. keystoreAlias-别名
   4. keystoreAliasPassword-别名密码
7. **basePlatforms**-基本渠道参数
   1. version-版本号
   2. isNative-是否是原生渠道
   3. md5Cache-打包是否需要md5 cache
   4. buildPath-构建目录
   5. remoteDir-远程资源本地目录
8. **platforms**-渠道配置信息
   1. bytedance
      - account-登陆字节的账号，注：不要用手机登陆，因为需要验证码
      - password-登陆字节的密码
   2. oppo-其他快游戏类似 vivo xiaomi
      - privatePath，certificatePath-需要的打包相关证书文件
      - icon-rpk的logo文件路径
   3. kwai
      - toolsDir-快手提供的打包工具目录路径
   4. baidu
      - privateKey-百度打包需要传入的accessToken
   5. wechatgame
      - privatePath-微信上传需要的私钥文件路径，需要配置可上传白名单或者关闭白名单限制才能上传，详细可以看看[官方文档](https://developers.weixin.qq.com/miniprogram/dev/devtools/ci.html)
   6. android相关
      - packageName-apk包名
      - template-构建工程的模板 [defalut | link]
      - apiLevel-使用的android sdk版本
   7. ios相关
      - targetName 打包的scheme名称
      - account，password为上传App Store用，password不是登录密码，是app上传的专用密码，开发者后台安全栏有个App专用密码，点击生成的
      - privateKey 上传蒲公英分发平台的apikey，目前只继承了蒲公英分发平台



## android打包相关说明

CocosCreator构建生成安卓工程之后是通过执行proj.android-studio目录下的**gradlew.bat**批处理文件打包的

目前默认是通过传入参数**assembleRelease**生成Release包，如果需要打Debug包可以修改为**assembleDebug**，打包App Bundle则传入**bundleRelease**生成Release包

- 包名修改：目前CocosCreator构建工程包默认采用了项目[local|settings]/builder.json下包名参数直接修改因为后期构建安卓工程后需要再根据自定义打包配置再修改build.gradle配置

  - ```javascript
    // 读取build.gradle文件
    const abgPath = path.join(this._androidDir, 'app', 'build.gradle');
    let gradleData = readFileSync(abgPath).toString();
    // 匹配包名
    let matcher1 = /applicationId[ ]+\"[a-zA-Z0-9_.]+\"/;
    // 使用pack.config.yml配置的渠道包名修改
    gradleData = gradleData.replace(matcher1, `applicationId "${channelInfo.packageName}"`);
    writeFileSync(abgPath, gradleData);
    ```

- versionCode，versionName修改，build.gradle修改对应配置

  - ```groovy
    android {
    	// ...
    	defaultConfig {
            versionCode 100
            versionName "1.2.6"
            if (project.hasProperty('VERSION_CODE')) {
                versionCode Integer.parseInt(VERSION_CODE)
            }
            if (project.hasProperty('VERSION_NAME')) {
                versionName VERSION_NAME
            }
        }
        // ...
    }
    ```

  - 通过执行gradlew.bat批处理执行的时候传入参数 *-PVERSION_CODE=110 -PVERSION_NAME=1.1.0* 添加gradle属性即可（-P是添加参数，想添加啥就啥，注意-P与参数名是连在一起的）

- 输出apk路径修改：gradlew.bat批处理传入参数 *-POUT_PUT_DIR*通过修改build.gradle配置中，如下修改目录路径以及apk文件名（注：如果出现打包异常语法有问题，可能是gradle版本导致的）

  - ```groovy
    android.applicationVariants.all { variant ->
    	// ...
        variant.outputs.all {
            if(project.hasProperty("OUT_PUT_DIR")){
                variant.getPackageApplication().outputDirectory = new File(OUT_PUT_DIR);
            }
            def outputFile = outputFileName
            if(outputFile != null && outputFile.endsWith('.apk')){
                if (android.defaultConfig.versionName != null) {
                    outputFileName = outputFileName.replace(".apk", "-${android.defaultConfig.versionName}.apk")
                }
            }
    
        }
    }

    //gradle 6.7用以下方法
    // 打包完成后复制到的目录
        def outputFileDir = "${project.projectDir.absolutePath}/apk/${variant.buildType.name}/${variant.versionName}"
        //确定输出文件名
        def today = new Date()
        def path = ((project.name != "app") ? project.name : rootProject.name.replace(" ", "")) + "_" +
                variant.flavorName + "_" +
                variant.buildType.name + "_" +
                variant.versionName + "_" +
                today.format('yyyyMMddhhmm') +
                ".apk"
        variant.outputs.forEach {
            it.outputFileName = path
        }
        // 打包完成后做的一些事,复制apk到指定文件夹
        variant.assemble.doLast {
            File out = new File(outputFileDir)
            copy {
                variant.outputs.forEach { file ->
                    copy {
                        from file.outputFile
                        into out
                    }
                }
            }
        }
    ```
  
  输出bundle路径修改：基本同apk,在build.gradle文件下新增**（2021-08-11更新）**
  
  ```groovy
  tasks.whenTaskAdded { task ->
      if (task.name.startsWith("bundleRelease")) {//如果该任务是bundleRelease
          def renameTaskName = "rename${task.name.capitalize()}Aab"
          def flavor = task.name.substring("bundle".length()).uncapitalize()
          def destnadir = "${buildDir}/outputs/bundle/${flavor}/"
          if(project.hasProperty("OUT_PUT_DIR")) {
              destnadir = OUT_PUT_DIR
          }
          tasks.create(renameTaskName, Copy) {//创建一个复制任务
              def path = "${buildDir}/outputs/bundle/${flavor}/"
              from(path)
              include "${project.name}-release.aab"
              destinationDir file(destnadir)
              rename "${project.name}-release.aab", "${project.name}-release-${android.defaultConfig.versionName}.aab"
          }
  
          task.finalizedBy(renameTaskName)
      }
  }
  ```
  



## ios打包相关说明

CocosCreator构建工程后是通过xcodebuild命令进行自动构建打包，

1.国内ios接入聚合基础sdk的需要在工程目录下的info.plist文件添加2个字段 BMSName BMSVersion ，用于控制防沉迷实名认证等（自行获取传给sdk）

2.`ExportOptionsDevelop.plist`打开发版IPA需要用到该文件，该文件可以通过xcode手动打一次development的包，在导出的ipa文件同目录下有一个`ExportOptions.plist`文件，修改文件名为->`ExportOptionsDevelop.plist`

3.`ExportOptionsAppStore.plist`打包上传AppStore需要用到该文件，该文件可以通过xcode手动打一次AppStore的包，在导出的ipa文件同目录下有一个`ExportOptions.plist`文件，修改文件名为->`ExportOptionsAppStore.plist`

4.把2,3点的两个文件中放置到项目根目录(proj.ios_mac)



## jenkins参数化构建部署相关说明(主机是windows系统为例)

1. 下载jenkins  window系统版本安装

2. 安装过程会提示推荐安装的jenkins插件，直接默认安装即可

3. 创建管理员用户

4. Manage Jenkins->SystemConfiguration->Manage Plugins 安装Extended Choice Parameter Plug-In插件，gitlab没安装的话也安装一下gitlab插件

5. Manage Jenkins->SystemConfiguration->Manage Nodes and Clouds 新建一个固定节点（[Cocos打包必须要在Agent模式下才可以](http://docs.cocos.com/creator/manual/zh/publish/publish-in-command-line.html#在-jenkins-上部署)）
   1. ![](https://gitee.com/wujianfen/auto-pack-creator/raw/master/mdpic/p1.png)
   2. ![](https://gitee.com/wujianfen/auto-pack-creator/raw/master/mdpic/p2.png)
   3. ![](https://gitee.com/wujianfen/auto-pack-creator/raw/master/mdpic/p3.png)
   4. ![](https://gitee.com/wujianfen/auto-pack-creator/raw/master/mdpic/p4.png)输入节点名称
   5. ![](https://gitee.com/wujianfen/auto-pack-creator/raw/master/mdpic/p5.png)填写远程工作目录，例如E:\test,标签是该个节点另外一个标识名称
   6. ![](https://gitee.com/wujianfen/auto-pack-creator/raw/master/mdpic/p6.png)选择只构建跟该节点标签匹配的job
   7. ![](https://gitee.com/wujianfen/auto-pack-creator/raw/master/mdpic/p7.png)
   8. ![](https://gitee.com/wujianfen/auto-pack-creator/raw/master/mdpic/p8.png)新建完成点击Launch启动该节点
   
6. 新建Item->创建一个自由风格的项目，添加相关参数，配置源码管理提供gitlab，添加构建命令
   1. ![](https://gitee.com/wujianfen/auto-pack-creator/raw/master/mdpic/p9.png)
   2. ![](https://gitee.com/wujianfen/auto-pack-creator/raw/master/mdpic/p10.png)
   3. ![](https://gitee.com/wujianfen/auto-pack-creator/raw/master/mdpic/p11.png)丢弃旧的构建，构建log配置，不然会越来越多占用空间
   4. ![](https://gitee.com/wujianfen/auto-pack-creator/raw/master/mdpic/p13.png)参数配置
   5. ![](https://gitee.com/wujianfen/auto-pack-creator/raw/master/mdpic/p14.webp)
   6. ![](https://gitee.com/wujianfen/auto-pack-creator/raw/master/mdpic/p15.png)
   7. ![](https://gitee.com/wujianfen/auto-pack-creator/raw/master/mdpic/p16.png)
   8. ![](https://gitee.com/wujianfen/auto-pack-creator/raw/master/mdpic/p17.webp)
   9. ![](https://gitee.com/wujianfen/auto-pack-creator/raw/master/mdpic/p18.png)
   
7. 后面选择对应渠道，输入版本号，点击构建即可

   

**2021-08-11更新**

1.新增选择构建安卓App Bundle包，用于上传谷歌商店

**2021-10-26**

2.新增安卓自家聚合sdk修改AndroidManifest配置中的bms版本号以及bms位置表示

#### 2021-11-04

3.新增ios打包流程

#### 2021-12-23

4.更新ios打包参数

