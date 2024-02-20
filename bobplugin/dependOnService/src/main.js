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
        const source_lang = sourceLanguage || 'zh-CHS';
        const target_lang = targetLanguage || 'en';
        const translate_text = query.text || '';

        const dictionaryUrl = 'https://dict.youdao.com/jsonapi_s?doctype=json&jsonversion=4'

        if (translate_text !== '') {
            // 优化英文单词判定正则表达式
            if (/^[a-zA-Z,\.\?!'\s]+$/.test(translate_text)
                && translate_text.split(/\s+/).filter(word => /^[a-zA-Z\s]+$/.test(word)).length === 1) {
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
                    n = "".concat(_).concat(translate_text).concat(time + '').concat(w).concat(o),
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
                        const toDict = {
                            word: translate_text,
                            phonetics: [],
                            parts: [],
                            exchanges: [],
                            additions: []
                        }
                        if (resp.data.ec && resp.data.ec.word && resp.data.ec.word.trs && resp.data.ec.word.trs.length) {
                            const word = resp.data.ec.word
                            if (word.usphone) {
                                toDict.phonetics.push({
                                    "type": "us",
                                    "value": word.usphone,
                                    "tts": {
                                        "type": "url",
                                        "value": "https://dict.youdao.com/dictvoice?audio=" + word.usspeech + "&type=2"
                                    }
                                })
                            }
                            if (word.ukphone) {
                                toDict.phonetics.push({
                                    "type": "uk",
                                    "value": word.ukphone,
                                    "tts": {
                                        "type": "url",
                                        "value": "https://dict.youdao.com/dictvoice?audio=" + word.ukspeech + "&type=1"
                                    }
                                })
                            }
                            word.trs.forEach(function (e) {
                                toDict.parts.push({part: e.pos, means: [e.tran]})
                            })
                            if (word.wfs && word.wfs.length) {
                                word.wfs.forEach(function (e) {
                                    toDict.exchanges.push({name: e.wf.name, words: [e.wf.value]})
                                })
                            }
                            if (word.prototype) {
                                toDict.exchanges.push({name: '原形', words: [word.prototype]})
                            }
                            toDict.additions.push({
                                name: '标签',
                                value: (resp.data.ec.exam_type ? resp.data.ec.exam_type.join('/') : '')
                            })
                            completion({
                                result: {
                                    from: query.detectFrom,
                                    to: query.detectTo,
                                    fromParagraphs: translate_text.split('\n'),
                                    toParagraphs: resp.data.ec.web_trans,
                                    toDict: toDict,
                                },
                            });
                        } else if (resp.data.typos && resp.data.typos.typo && resp.data.typos.typo.length) {
                            // 优化未查询到单词时的模糊匹配
                            resp.data.typos.typo.forEach(function (e) {
                                toDict.exchanges.push({name: '您要找的是不是:' + e.trans, words: [e.word]})
                            })
                            // toDict.phonetics.push({
                            //     "type": "us",
                            //     "value": "未找到"
                            // })
                            toDict.parts.push({part: '抱歉,', means: ['未找到“' + translate_text + '”相关的词']})
                            completion({
                                result: {
                                    from: query.detectFrom,
                                    to: query.detectTo,
                                    fromParagraphs: translate_text.split('\n'),
                                    toParagraphs: ('抱歉没有找到“' + translate_text + '”相关的词').split('\n'),
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
                    const localHeader = {
                        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                        "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36"
                    }
                    url = 'https://aidemo.youdao.com/trans'
                    // 对超长的文本进行分段翻译,判断文本是否超过1000字符,如果超过,则按照句号进行拆分,取一千以内的最后一个句号的位置,进行分段翻译
                    // 判断超过10000字符直接返回,避免循环调用接口过多导致封禁
                    const originText = query.text
                    if (originText.length > 10000) {
                        completion({
                            error: {
                                type: 'api',
                                message: '接口限制单次调用1000字符以内,为了避免循环次数过多封禁ip,总字符数不能超过10000个字符!',
                            },
                        });
                    }
                    // 不能超过1000个字符,所以需要循环拆分每隔1000调用一次
                    let paramText = query.text
                    // 定义返回结果拼接变量
                    let concatRs = []
                    // 定义指向切分位置
                    let index = 0
                    while (true) {
                        if (originText.substring(index).length > 1000) {
                            let tmpText = originText.substring(index, index + 1000)
                            let idx = tmpText.lastIndexOf("。")
                            if (tmpText.lastIndexOf("．") > idx) {
                                idx = tmpText.lastIndexOf("．")
                            }
                            if (tmpText.lastIndexOf("\n") > idx) {
                                idx = tmpText.lastIndexOf("\n")
                            }
                            if (tmpText.lastIndexOf(".") > idx) {
                                idx = tmpText.lastIndexOf(".")
                            }
                            if (idx < 0) {
                                completion({
                                    error: {
                                        type: 'api',
                                        message: '单句翻译不能超过1000个字符!',
                                    },
                                });
                                break
                            }
                            index = index + idx + 1
                            paramText = tmpText.substring(0, idx + 1)
                            const response = await $http.request({
                                method: 'POST',
                                url: url,
                                header: localHeader,
                                body: Object.assign({}, {"q": paramText, "from": source_lang, "to": target_lang})
                            });
                            if (response.error) {
                                const {statusCode} = response.response;
                                let reason;
                                if (statusCode >= 400 && statusCode < 500) {
                                    reason = 'param';
                                } else {
                                    reason = 'api';
                                }
                                completion({
                                    error: {
                                        type: reason,
                                        message: `接口响应错误 - ${response.data.msg}`,
                                        addtion: JSON.stringify(response),
                                    },
                                });
                                break
                            } else {
                                const translations = response.data.translation;
                                if (!translations || !translations.length) {
                                    continue
                                }
                                translations.forEach(function (e) {
                                    concatRs.push(e)
                                })
                                // concatRs.push('\n')
                            }
                        } else {
                            const response = await $http.request({
                                method: 'POST',
                                url: url,
                                header: localHeader,
                                body: Object.assign({}, {
                                    "q": originText.substring(index),
                                    "from": source_lang,
                                    "to": target_lang
                                })
                            });
                            if (response.error) {
                                const {statusCode} = response.response;
                                let reason;
                                if (statusCode >= 400 && statusCode < 500) {
                                    reason = 'param';
                                } else {
                                    reason = 'api';
                                }
                                completion({
                                    error: {
                                        type: reason,
                                        message: `接口响应错误 - ${response.data.msg}`,
                                        addtion: JSON.stringify(response),
                                    },
                                });
                            } else {
                                const translations = response.data.translation;
                                if (!translations || !translations.length) {
                                    completion({
                                        error: {
                                            type: 'api',
                                            message: '接口未返回翻译结果',
                                        },
                                    });
                                    return;
                                }
                                translations.forEach(function (e) {
                                    concatRs.push(e)
                                })
                            }
                            break
                        }
                    }
                    completion({
                        result: {
                            from: query.detectFrom,
                            to: query.detectTo,
                            toParagraphs: concatRs,
                        },
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
