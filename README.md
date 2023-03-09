# bob-plugin-akl-youdao-free-translate
免费无限次使用有道翻译,根据网页版JavaScript加密算法开发的bobplugin;所以只要官网的算法不改,理论上就可以无限使用;

~~**本来是想做成纯插件的,但是bob内核JavaScript没有node那么全的加密库,所以只能借用Python启动一个服务运行虚拟的node环境**~~

#### **重大更新!有道插件新增免启动服务本地版,可以不用启动服务了;不过服务启动的方式依然保留.两种可以切换使用**

## **重大更新,支持单个单词详细查询,并且不用再启动服务了**

## **增加万字长文翻译功能;支持万字长文一次翻译,不用截断!**



**下载地址:[有道Bob插件_v0.1.7](https://github.com/akl7777777/bob-plugin-akl-youdao-free-translate/releases/download/v0.1.7/bob-plugin-akl-youdao-free-translate_v0.1.7.bobplugin)**

使用方法:双击安装,直接使用,支持单词模式和超长万字文本模式自动切换

效果图如下:

![iShot_2023-03-05_19 02 08](https://user-images.githubusercontent.com/84266551/222956626-b69aa14e-de7f-437c-8677-d96e283d6d44.gif)


<img width="750" alt="image" src="https://user-images.githubusercontent.com/84266551/221099163-e6f89b07-0a3a-42ae-8c1c-f95ae24901ad.png">

### 友情链接==>ChatGPT免费桌面版客户端(支持Windows,macOS)
下载地址:[OpenAI-ChatGPT免费桌面版客户端](https://github.com/akl7777777/free-chatgpt-client-pub)

### bob翻译插件大合集:

>[OpenAI ChatGPT(免秘钥)插件](https://github.com/akl7777777/bob-plugin-akl-chatgpt-free-translate)

>[DeepL翻译插件(免秘钥)](https://github.com/akl7777777/bob-plugin-akl-deepl-free-translate)

>[有道翻译插件(免秘钥)](https://github.com/akl7777777/bob-plugin-akl-youdao-free-translate)

>[CNKI学术翻译插件(免秘钥)](https://github.com/akl7777777/bob-plugin-akl-cnki-free-translate)

>[火山翻译插件(免秘钥)](https://github.com/akl7777777/bob-plugin-akl-volcengine-free-translate)

>[百度翻译插件(免秘钥)](https://github.com/akl7777777/bob-plugin-akl-baidu-free-translate)

>[腾讯翻译君插件(免秘钥)](https://github.com/akl7777777/bob-plugin-akl-tencent-free-translate)

>[腾讯交互翻译插件(免秘钥)](https://github.com/akl7777777/bob-plugin-akl-transmart-free-translate)

>[彩云小译插件(免秘钥)](https://github.com/akl7777777/bob-plugin-akl-caiyunxiaoyi-free-translate)

>[只为日语 - MOJi辞書（じしょ）](https://github.com/akl7777777/bob-plugin-akl-mojidict-translate)

>[Papago Naver 韩语翻译(免秘钥)](https://github.com/akl7777777/bob-plugin-akl-papago-free-translate)

>[Bob翻译剪切板图片的AlfredWorkflow](https://github.com/akl7777777/BobTranslateClipboard)

>[Bob的Postman接口调试插件](https://github.com/akl7777777/bob-plugin-akl-postman)



https://user-images.githubusercontent.com/84266551/221367028-17e66c24-12a8-458b-b96a-856b545cb271.mp4




项目结构简介:
youdaoTranslateServer文件夹下用来启动Python服务,Python调用node环境的加密解密功能模拟请求
bobplugin文件夹下有两个目录
dependOnService里面是依赖于Python服务的插件,用此插件需要本地启动Python服务,本人亲测可用;
independently里面是不依赖于其他服务的独立插件,但是此插件依赖的node环境尚不完善,还需要和bob开发者共通谈论完善方案,故不可用;

bob插件主要为bob用户开发,bob是一款macOS上的翻译软件,bob官网地址:https://bobtranslate.com/


使用方法如下(总共分三步):

第0步:
下载右侧的release
https://github.com/akl7777777/bob-plugin-akl-youdao-free-translate/releases/download/v_0.0.7/youdaoTranslateServer_macos_x86_64


第一步:
运行youdaoTranslateServer可执行文件,由于我今天手头只有一台Intel芯片的MacBook,而Python又不能跨平台打包,所以暂时只有一个打包好的文件,不确定apple芯片是否可以用;有兴趣的同学可以自行搭建Python环境打包或者直接启动服务.我本地用的是Python3.79版本Intel芯片macOS系统;打包命令 pyinstaller --onefile youdao.py 当然在那之前你需要先 pip install pyinstaller

注意: macos由于对软件限制较⼤，对未知来源的程序是禁⽌使⽤的，所以双击多半打不开，此时需要按
下⾯的步骤进⾏操作。

打开终端,执行如下命令:
chmod a+x <你的youdaoTranslateServer可执行文件存放的路径>

第⼀次跑时需要输⼊chmod。以后每次运⾏时，其它步骤不变，只是不必再输该chmod命令。

当然,如果你不想占用自己电脑的资源,有条件也可以用公司办公室的其他Windows电脑启动服务https://github.com/akl7777777/bob-plugin-akl-youdao-free-translate/releases/download/v_0.0.6/youdaoTranslateServer_windows_x86_64.exe

也可以使用公司或个人的Linux服务器启动服务https://github.com/akl7777777/bob-plugin-akl-youdao-free-translate/releases/download/v_0.0.6/youdaoTranslateServer_linux_x86_64

在后续的版本,插件会提供请求地址的输入框,填入对应的服务器地址即可;

第二步:

配置服务器域名,本地启动默认域名是http://127.0.0.1:9527/youdaoTranslate  可以不用修改;如果服务部署在其他机器,可以根据自己机器的域名来配置如下图

<img width="509" alt="image" src="https://user-images.githubusercontent.com/84266551/219946403-2eff0fde-af34-4172-8ad9-e3638acfccf9.png">

第三步:

双击.bobplugin后缀的文件即可安装;安装后尽情享受吧!

效果图如下:

<img width="818" alt="image" src="https://user-images.githubusercontent.com/84266551/219827739-96298ad7-dddd-4542-986d-9a39a5dc1618.png">


此外,对于其他非bob用户,需要调用有道翻译的也可以直接调用服务如下图:
入参样例:
{"text":"你好"}
返回值样例:
{
    "code": 0,
    "translateResult": [
        [
            {
                "src": "你好",
                "srcPronounce": "nĭhăo",
                "tgt": "hello"
            }
        ]
    ],
    "type": "zh-CHS2en"
}
<img width="911" alt="image" src="https://user-images.githubusercontent.com/84266551/219946834-05c71d59-f024-4777-9448-5692a677e2d2.png">



### 开发不易,如果喜欢的话,可以给请作者吃一份特色腰花面,或者喝一杯可乐



<img width="629" alt="image" src="https://user-images.githubusercontent.com/84266551/219829225-51a7c532-36e7-40ae-97b9-66bb6d2c52b4.png">
