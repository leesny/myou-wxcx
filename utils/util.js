const Crypto = require('../static/plugins/cryptojs/cryptojs.js').Crypto;

const utils = {
  //检查请求参数
  checkParams({ fn, params, fullresult }) {
    if (!fn || !fn.length) {
      console.error("请求方法(fn)必须传入！");
      return false;
    }

    if (!Array.isArray(params)) {
      console.error("请求参数(param)必须是数组！");
      return false;
    }

    return true;
  },

  //时间格式化
  formatTime(date){
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  },

  //数字格式化
  formatNumbe(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  },

  //数据签名（待测试）
  doSign(signKey, data){
    var raw = Crypto.util.bytesToBase64(Crypto.MD5(data, { asBytes: true }));

    var replaceAll = function (str, match, ment) {
      while (true) {
        var pos = str.indexOf(match);
        if (pos >= 0) {
          str = str.replace(match, ment);
        } else {
          break;
        }
      }

      return str;
    };

    raw = replaceAll(raw, "\\", "_");
    raw = replaceAll(raw, "/", "-");
    raw = replaceAll(raw, "+", "]");

    var enc = Crypto.HMAC(Crypto.MD5, raw, signKey);

    return enc.toUpperCase();
  }
}

module.exports = utils;
