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