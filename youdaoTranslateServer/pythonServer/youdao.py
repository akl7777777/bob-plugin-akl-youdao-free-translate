import requests
import subprocess
from functools import partial
from flask import Flask, request

subprocess.Popen = partial(subprocess.Popen, encoding="utf-8")
import execjs

app = Flask(__name__)


@app.route('/youdaoTranslate', methods=['POST'])
def youdaoTranslate():
    data = request.json
    # translate_words = input('请输入要翻译的内容：')
    translate_words = ''
    source_lang = 'AUTO'
    target_lang = 'AUTO'
    if 'text' in data:
        translate_words = data['text']
    # if 'source_lang' in data:
    #     source_lang = data['source_lang']
    # if 'target_lang' in data:
    #     target_lang = data['target_lang']
    # ctx = execjs.compile(open('youdao.js', encoding='utf-8').read())
    ctx = execjs.compile('''
        const crypto = require('crypto');
        const r = "fanyideskweb", i = "webfanyi";
        function m(e) {
            return crypto.createHash("md5").update(e).digest()
        }
        function p(e) {
            return crypto.createHash("md5").update(e.toString()).digest("hex")
        }
        function b(e, t) {
            return p(`client=${r}&mysticTime=${e}&product=${i}&key=${t}`)
        }
        function f() {
            const e = 'fsdsogkndfokasodnaso', s = 'client,mysticTime,product', u = 'fanyi.web', l = '1.0.0', d = 'web';
            const t = (new Date).getTime();
            return {
                sign: b(t, e),
                client: r,
                product: i,
                appVersion: l,
                vendor: d,
                pointParam: s,
                mysticTime: t,
                keyfrom: u
            }
        }
         A = (t,o,n)=>{
            o = "ydsecret://query/key/B*RGygVywfNBwpmBaZg*WT7SIOUP2T0C9WHMZN39j^DAdaZhAnxvGcCY6VYFwnHl"
            n = "ydsecret://query/iv/C@lZe2YzHtZ2CYgaXKSVfsb7Y4QWHjITPPZ0nQp87fBeJ!Iv6v^6fvi2WN@bYpJ4"
            if (!t)
                return null;
            const a = Buffer.alloc(16, m(o))
              , r = Buffer.alloc(16, m(n))
              , i = crypto.createDecipheriv("aes-128-cbc", a, r);
            let s = i.update(t, "base64", "utf-8");
            return s += i.final("utf-8"),
            s
        }
    ''')
    params = ctx.call('f')
    data = {
        'i': translate_words,
        'from': source_lang,
        'to': target_lang,
        'domain': '0',
        'dictResult': 'true',
        'keyid': 'webfanyi'
    }
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36 Edg/108.0.1462.54',
        'Cookie': 'OUTFOX_SEARCH_USER_ID_NCOO=976405377.6815147; OUTFOX_SEARCH_USER_ID=-198948307@211.83.126.235; _ga=GA1.2.1162596953.1667349221; search-popup-show=12-2',
        'Referer': 'https://fanyi.youdao.com/'
    }
    data.update(params)
    results = requests.post('https://dict.youdao.com/webtranslate', data=data, headers=headers)
    fanyi = eval(ctx.call('A', results.text))
    # print(fanyi['translateResult'][0][0]['tgt'])
    # 判断key是否存在,修正异常返回的处理逻辑
    if 'translateResult' in fanyi:
        for paragraph in fanyi['translateResult']:
            s = ''
            for item in paragraph:
                s += item['tgt']
            print(s)
    return fanyi


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=9527)
