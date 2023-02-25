var config = require('./config.js');
var utils = require('./utils.js');
var CryptoJS = require("crypto-js");

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

        const dictionaryUrl = 'https://dict.youdao.com/jsonapi_s?doctype=json&jsonversion=4'

        if (translate_text !== '') {
            if (translate_text.split(/\s+/).filter(word => /^[a-zA-Z]+$/.test(word)).length === 1) {
                // 只做英文单词,正则排除
                let y = ["option_avatar", "nickname"]
                    , w = "Mk6hqtUp33DGGtoS63tTJbMUYjRrG1Lu"
                    , v = "webdict"
                    , _ = "web"
                const h = function (t) {
                    return CryptoJS.MD5(t.toString()).toString(CryptoJS.enc.Hex);
                }
                let time = "".concat(translate_text).concat(v).length % 10,
                    r = "".concat(translate_text).concat(v),
                    o = h(r),
                    n = "".concat(_).concat(translate_text).concat(time+'').concat(w).concat(o),
                    f = h(n)

                // 查字典,不查句子
                const body = Object.assign({}, {
                    "q": translate_text,
                    "keyfrom": "webdict",
                    "sign": f,
                    "client": "web",
                    "t": time
                });
                $http.request({
                    method: "POST",
                    url: dictionaryUrl,
                    header: {
                        "content-type": "application/x-www-form-urlencoded",
                        "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36"
                    },
                    body: body,
                    handler: function (resp) {
                        if (resp.error) {
                            completion({
                                error: {
                                    type: resp.error.code || 'unknown',
                                    message: resp.error.localizedDescription || '未知错误',
                                    addtion: resp.error.localizedDescription,
                                },
                            });
                        }
                        if (resp.data.ec && resp.data.ec.word && resp.data.ec.word.trs && resp.data.ec.word.trs.length) {
                            const word = resp.data.ec.word
                            const toDict = {
                                word: translate_text,
                                phonetics: [],
                                parts: [],
                                exchanges: [],
                                additions: []
                            }
                            if (word.usphone) {
                                toDict.phonetics.push({
                                    "type": "us",
                                    "value": word.usphone
                                })
                            }
                            if (word.ukphone) {
                                toDict.phonetics.push({
                                    "type": "uk",
                                    "value": word.ukphone
                                })
                            }
                            word.trs.forEach(function (e) {
                                toDict.parts.push({part: e.pos, means: [e.tran]})
                            })
                            toDict.additions.push({name: '标签', value: resp.data.ec.exam_type.join('/')})
                            completion({
                                result: {
                                    from: query.detectFrom,
                                    to: query.detectTo,
                                    fromParagraphs: translate_text.split('\n'),
                                    toParagraphs: resp.data.ec.web_trans,
                                    toDict: toDict,
                                },
                            });
                        } else {
                            $log.error('*********** 词典查询err ==> ' + JSON.stringify(resp.data))
                            completion({
                                error: {
                                    type: 'unknown',
                                    message: JSON.stringify(resp.data) || '未知错误',
                                    addtion: '未知错误',
                                },
                            });
                        }
                    }
                });
            } else {

                const serverUrl = $option.serverUrl;
                const type = $option.type;

                let url = serverUrl || 'http://127.0.0.1:9527/youdaoTranslate';

                if (type === 'local') {
                    url = 'https://aidemo.youdao.com/trans'
                    const body = Object.assign({}, {"q": translate_text, "from": source_lang, "to": target_lang});
                    $http.request({
                        method: "POST",
                        url: url,
                        header: {
                            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                            "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36"
                        },
                        body: body,
                        handler: function (resp) {
                            if (resp.error) {
                                $log.error('*********** 本地resp ==> ' + JSON.stringify(resp))
                                completion({
                                    error: {
                                        type: resp.error.code || 'unknown',
                                        message: resp.error.localizedDescription || '未知错误',
                                        addtion: resp.error.localizedDescription,
                                    },
                                });
                            }
                            if (resp.data.translation && resp.data.translation.length) {
                                completion({
                                    result: {
                                        from: query.detectFrom,
                                        to: query.detectTo,
                                        toParagraphs: resp.data.translation,
                                    },
                                });
                            } else {
                                completion({
                                    error: {
                                        type: 'unknown',
                                        message: JSON.stringify(resp.data) || '未知错误',
                                        addtion: '未知错误',
                                    },
                                });
                            }
                        }
                    });
                } else {
                    try {
                        const body = Object.assign({}, {
                            "text": translate_text,
                            "source_lang": source_lang,
                            "target_lang": target_lang
                        });
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
                    } catch (e) {
                        $log.error('接口请求错误 ==> ' + JSON.stringify(e))
                        Object.assign(e, {
                            _type: 'network',
                            _message: '接口请求错误 - ' + JSON.stringify(e),
                        });
                        throw e;
                    }
                }
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
