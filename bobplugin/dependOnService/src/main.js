var config = require('./config.js');
var utils = require('./utils.js');

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

    if (translate_text !== '') {
      const serverUrl = $option.serverUrl;

      const url = serverUrl || 'http://127.0.0.1:9527/youdaoTranslate';
      try {
        const body = Object.assign({}, { "text": translate_text, "source_lang": source_lang, "target_lang": target_lang });
        $http.request({
          method: "POST",
          url: url,
          header: {
            "Content-Type": "application/json"
          },
          body: body,
          handler: function (resp) {
            if (resp.error) {
              $log.error('*********** resp ==> ' + JSON.stringify(resp))
              completion({
                error: {
                  type: resp.error.code || 'unknown',
                  message: resp.error.localizedDescription || '未知错误',
                  addtion: resp.error.localizedDescription,
                },
              });
            }
            const rs = []
            if (resp.data.translateResult && resp.data.translateResult.length) {
              for (let i = 0; i < resp.data.translateResult.length; i++) {
                if (resp.data.translateResult[i].length) {
                  let rsParagraph = ''
                  for (let j = 0; j < resp.data.translateResult[i].length; j++) {
                    rsParagraph += resp.data.translateResult[i][j].tgt
                  }
                  rs.push(rsParagraph)
                }
              }
            }

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
