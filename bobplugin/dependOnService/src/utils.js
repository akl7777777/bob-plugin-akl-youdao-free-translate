var config = require('./config.js');

const langMap = new Map(config.supportedLanguages);
const langMapReverse = new Map(config.supportedLanguages.map(([standardLang, lang]) => [lang, standardLang]));

// 将英文标点替换为中文标点
function replacePunctuation(str) {
    return str.replace(/(\w)'/g, '$1’').replace(/'/g, '’')
        .replace(/(\w)"/g, '$1”').replace(/"/g, '”')
        .replace(/(\w)'/g, '$1‘').replace(/'/g, '‘')
        .replace(/(\w)'/g, '$1’').replace(/'/g, '’')
        .replace(/(\w)!/g, '$1！').replace(/!/g, '！')
        .replace(/(\w)\?/g, '$1？').replace(/\?/g, '？')
        .replace(/(\w),/g, '$1，').replace(/,/g, '，')
        .replace(/(\w)\./g, '$1。').replace(/\./g, '。')
        .replace(/(\w);/g, '$1；').replace(/;/g, '；')
        .replace(/(\w):/g, '$1：').replace(/:/g, '：');
}

exports.langMap = langMap;
exports.langMapReverse = langMapReverse;
exports.replacePunctuation = replacePunctuation;
