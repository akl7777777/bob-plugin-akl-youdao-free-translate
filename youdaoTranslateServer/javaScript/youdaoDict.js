const crypto = require('crypto');

var y = ["option_avatar", "nickname"]
    , w = "Mk6hqtUp33DGGtoS63tTJbMUYjRrG1Lu"
    , v = "webdict"
    , _ = "web"
    , x = "https://dict.youdao.com"
    , k = "https://dict.youdao.com/jsonapi_s?doctype=json&jsonversion=4"
    , S = "https://dict-subsidiary.youdao.com";

h = function (t) {
    return crypto.createHash("md5").update(t.toString()).digest("hex")
}

var text = 'what'
time = "".concat(text).concat(v).length % 10,
    r = "".concat(text).concat(v),
    o = h(r),
    n = "".concat(_).concat(text).concat(time).concat(w).concat(o),
    f = h(n),
    l = {
        q: text,
        le: 'en',
        t: time,
        client: _,
        sign: f,
        keyfrom: v
    }
    console.log(f)
