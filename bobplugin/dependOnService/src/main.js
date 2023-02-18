var config = require('./config.js');
var utils = require('./utils.js');
// var CryptoJS = require("crypto-js");

/**
 * 由于各大服务商的语言代码都不大一样，
 * 所以我定义了一份 Bob 专用的语言代码，以便 Bob 主程序和插件之间互传语种。
 * Bob 语言代码列表 https://ripperhe.gitee.io/bob/#/plugin/addtion/language
 *
 * 转换的代码建议以下面的方式实现，
 * `xxx` 代表服务商特有的语言代码，请替换为真实的，
 * 具体支持的语种数量请根据实际情况而定。
 *
 * Bob 语言代码转服务商语言代码(以为 'zh-Hans' 为例): var lang = langMap.get('zh-Hans');
 * 服务商语言代码转 Bob 语言代码: var standardLang = langMapReverse.get('xxx');
 */

// var items = [
//     ['auto', 'xxx'],
//     ['zh-Hans', 'xxx'],
//     ['zh-Hant', 'xxx'],
//     ['en', 'xxx'],
// ];


function supportLanguages() {
  return config.supportedLanguages.map(([standardLang]) => standardLang);
}

function translate(query, completion) {

  (async () => {
    const targetLanguage = utils.langMap.get(query.detectTo);
    const sourceLanguage = utils.langMap.get(query.detectFrom);
    if (!targetLanguage) {
      const err = new Error();
      Object.assign(err, {
        _type: 'unsupportLanguage',
        _message: '不支持该语种',
      });
      throw err;
    }
    const source_lang = sourceLanguage || 'ZH';
    const target_lang = targetLanguage || 'EN';
    const translate_text = query.text || '';
    $log.error('***********46==>' + 46)

    if (translate_text !== '') {
      $log.error('***********49==>' + 49)

      const url = 'http://127.0.0.1:9527/youdaoTranslate';
      
      try {
        const body = Object.assign({}, {"text":translate_text,"source_lang":source_lang,"target_lang":target_lang});
        $log.error('***********55==>' + 55)

        $http.request({
          method: "POST",
          url: url,
          header: {
            "Content-Type": "application/json"
          },
          body: body,
          handler: function (resp) {
            $log.error('***********response==>' + JSON.stringify(resp))
            $log.error('***********resp.data==>' + JSON.stringify(resp.data))
            const rs = []
            if(resp.data.translateResult[0].length){
              for(let i = 0;i<resp.data.translateResult[0].length;i++){
                rs.push(resp.data.translateResult[0][i].tgt)
              }
            }
            $log.error('***********toParagraphs==>' + JSON.stringify(rs))

            completion({
              result: {
                from: query.detectFrom,
                to: query.detectTo,
                toParagraphs: rs,
              },
            });
          }
        });
      }
      catch (e) {
        $log.error('接口请求错误 ==> ' + JSON.stringify(e))
        Object.assign(e, {
          _type: 'network',
          _message: '接口请求错误 - ' + JSON.stringify(e),
        });
        throw e;
      }
    }
  })().catch((err) => {
    $log.error('***********解析返回值异常==>' + JSON.stringify(err))
    completion({
      error: {
        type: err._type || 'unknown',
        message: err._message || '未知错误',
        addtion: err._addtion,
      },
    });
  });
}

exports.supportLanguages = supportLanguages;
exports.translate = translate;
