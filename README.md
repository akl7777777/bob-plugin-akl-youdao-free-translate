# bob-plugin-akl-youdao-free-translate
免费无限次使用有道翻译,根据网页版JavaScript加密算法开发的bobplugin;所以只要官网的算法不改,理论上就可以无限使用;本来是想做成纯插件的,但是bob内核JavaScript没有node那么全的加密库,所以只能借用Python启动一个服务运行虚拟的node环境

项目结构简介:
youdaoTranslateServer文件夹下用来启动Python服务,Python调用node环境的加密解密功能模拟请求
bobplugin文件夹下有两个目录
dependOnService里面是依赖于Python服务的插件,用此插件需要本地启动Python服务,本人亲测可用;
independently里面是不依赖于其他服务的独立插件,但是此插件依赖的node环境尚不完善,还需要和bob开发者共通谈论完善方案,故不可用;


使用方法如下:

第0步:
下载右侧的release
https://github.com/akl7777777/bob-plugin-akl-youdao-free-translate/releases/download/v_0.0.6/youdaoTranslateServer_macos_x86_64


第一步:
运行youdaoTranslateServer可执行文件,由于我今天手头只有一台Intel芯片的MacBook,而Python又不能跨平台打包,所以暂时只有一个打包好的文件,不确定apple芯片是否可以用;有兴趣的同学可以自行搭建Python环境打包或者直接启动服务.我本地用的是Python3.79版本Intel芯片macOS系统;打包命令 pyinstaller --onefile youdao.py 当然在那之前你需要先 pip install pyinstaller

注意: macos由于对软件限制较⼤，对未知来源的程序是禁⽌使⽤的，所以双击多半打不开，此时需要按
下⾯的步骤进⾏操作。

打开终端,执行如下命令:
chmod a+x <你的youdaoTranslateServer可执行文件存放的路径>

第⼀次跑时需要输⼊chmod。以后每次运⾏时，其它步骤不变，只是不必再输该chmod命令。

当然,如果你不想占用自己电脑的资源,有条件也可以用公司办公室的其他Windows电脑启动服务https://github.com/akl7777777/bob-plugin-akl-youdao-free-translate/releases/download/v_0.0.6/youdaoTranslateServer_windows_x86_64.exe,也可以使用公司或个人的Linux服务器启动服务https://github.com/akl7777777/bob-plugin-akl-youdao-free-translate/releases/download/v_0.0.6/youdaoTranslateServer_linux_x86_64

在后续的版本,插件会提供请求地址的输入框,填入对应的服务器地址即可;

第二步:

双击.bobplugin后缀的文件即可安装;安装后尽情享受吧!

效果图如下:

<img width="818" alt="image" src="https://user-images.githubusercontent.com/84266551/219827739-96298ad7-dddd-4542-986d-9a39a5dc1618.png">




### 开发不易,如果喜欢的话,可以给请作者吃一份特色腰花面,或者喝一杯可乐



<img width="629" alt="image" src="https://user-images.githubusercontent.com/84266551/219829225-51a7c532-36e7-40ae-97b9-66bb6d2c52b4.png">
