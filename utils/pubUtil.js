const Crypto = require('../static/plugins/cryptojs/cryptojs.js').Crypto;
const BlueMD5 = require('../static/plugins/MD5/md5.min.js');
const WxDiscode = require('../static/plugins/wx-parse/wxDiscode.js');
import Base64 from './Base64.js'
import __config from '../config/config';

/**
 * 公共自定义方法
 */
const pubUtils = {
  //时间格式化
  formatTime(date, split = '-') {
    if (typeof date == 'string') {
      date = Number(date);
    }
    if (typeof date == 'number') {
      date = new Date(date);
    }

    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
    return [year, month, day].map(this.formatNumber).join(split) + ' ' + [hour, minute, second].map(this.formatNumber).join(':')
  },
  // 日期格式化
  format: function (timeSpan, fmt) {
    if (!timeSpan) return;

    let timestr = timeSpan.replace(/-/g, '/').replace(/T|Z/g, ' ').trim();
    let date = new Date(timestr);
    let o = {
      "M+": date.getMonth() + 1, //month
      "d+": date.getDate(), //day
      "h+": date.getHours(), //hour
      "m+": date.getMinutes(), //minute
      "s+": date.getSeconds(), //second
      "q+": Math.floor((date.getMonth() + 3) / 3), //quarter
      "S": date.getMilliseconds() //millisecond
    };
    if (/(y+)/.test(fmt))
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));

    for (let k in o) {
      if (new RegExp("(" + k + ")").test(fmt)) {
        fmt = fmt.replace(RegExp.$1,
          RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
      }
    }

    return fmt;
  },

  //时间倒计时
  formatCountTime(time) {
    if (typeof time !== 'number' || time < 0) {
      return time
    }

    var hour = parseInt(time / 3600)
    time = time % 3600
    var minute = parseInt(time / 60)
    time = time % 60
    // 这里秒钟也取整
    var second = parseInt(time)

    return ([hour, minute, second]).map(function (n) {
      n = n.toString()
      return n[1] ? n : '0' + n
    }).join(':')
  },

  //数字格式化
  formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  },

  //数据加密 (BlueMD5工具加密)
  MD5(data){
    return BlueMD5(data);
  },

  //数据签名（Crypto工具加密）
  doSign(signKey, data) {
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
  },

  //文件上传签名
  doFileSignData(accesskey, policyText) {
    policyText = policyText || {
      "expiration": "2020-01-01T12:00:00.000Z", //设置该Policy的失效时间，超过这个失效时间之后，就没有办法通过这个policy上传文件了
      "conditions": [
        ["content-length-range", 0, 1048576000] // 设置上传文件的大小限制
      ]
    };
    var policyBase64 = Base64.encode(JSON.stringify(policyText))
    var message = policyBase64;
    var bytes = Crypto.HMAC(Crypto.SHA1, message, accesskey, { asBytes: true });
    var signature = Crypto.util.bytesToBase64(bytes);

    return { policy: policyBase64, signature };
  },

  /**
   * 获取随机 ID
   * @return {String} ID 字符串
   */
  getUUID() {
      var s = [];
      var hexDigits = "0123456789abcdef";
      for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
      }
      s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
      s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
      s[8] = s[13] = s[18] = s[23] = "-";

      var uuid = s.join("");
      return uuid;
  },

  /**
   * 获取随机颜色
   */
  getRandomColor() {
    let rgb = []
    for (let i = 0; i < 3; ++i) {
      let color = Math.floor(Math.random() * 256).toString(16)
      color = color.length == 1 ? '0' + color : color
      rgb.push(color)
    }
    return '#' + rgb.join('')
  },

  /*获取当前页url*/
  getCurrentPageUrl() {
    let pages = getCurrentPages(),
      currentPage = pages[pages.length - 1];
    let currRoute = currentPage && currentPage.route;
    if (currRoute && currRoute.startsWith('pages')) {
      currRoute =  '/' + currRoute;
    } 

    return currRoute;
  },

  /*获取当前页带参数的url*/
  getCurrentPageUrlWithArgs() {
    let pages = getCurrentPages(),
      currentPage = pages[pages.length - 1],
      url = currentPage.route,
      options = currentPage.options;

    //拼接url的参数
    let urlWithArgs = url;
    if (options){
      urlWithArgs = url + '?'
      for (let key in options) {
        let value = options[key]
        urlWithArgs += key + '=' + value + '&'
      }
      urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1)
    }

    if (urlWithArgs.startsWith('pages')) {
      urlWithArgs = '/' + urlWithArgs;
    }

    return urlWithArgs
  },

  //判断当前页面是否是底部导航页
  isTabPages(url){
    let currPage = url || this.getCurrentPageUrl();
    let tabPages = ['/pages/home/index', '/pages/notice/list/index','/pages/user/personal/index'];
    return tabPages.includes(currPage);
  },

  isSkipAuthPage(url) {
    let ignoreAuthPages = ['/pages/start1/index', '/pages/index1/index'];
    let currPage = url || this.getCurrentPageUrl();
    return ignoreAuthPages.includes(currPage);
  },

  //文件路径处理
  renderFilePath(path,defaultPath) {
    if (!path) return defaultPath || '/static/images/default/zhanwei.jpg';
    if (path.indexOf('http') !== -1) return path
    return `${__config.FILE_DOWNLOAD_URL}/${path}`
  },

  isImage(fileName){
    let fileType = fileName.substring(fileName.lastIndexOf('.') + 1);
    let imageTypes = ['jpg', 'png', 'jpeg', 'bmp', 'gif','ico','svg','webp']
    return imageTypes.includes(fileType.toLowerCase())
  },

  renderFileType(fileName) {
    return fileName.substring(fileName.lastIndexOf('.') + 1);
  },

  //图片屏幕适配尺寸计算
  calcImage: function (e) {
    var imageSize = {};
    var originalWidth = e.detail.width; //图片原始宽 
    var originalHeight = e.detail.height; //图片原始高 
    var originalScale = originalHeight / originalWidth; //图片高宽比 

    //获取屏幕宽高 
    wx.getSystemInfo({
      success: function (res) {
        var windowWidth = res.windowWidth;
        var windowHeight = res.windowHeight;
        var windowscale = windowHeight / windowWidth; //屏幕高宽比 

        if (originalScale < windowscale) { //图片高宽比小于屏幕高宽比 
          //图片缩放后的宽为屏幕宽 
          imageSize.imageWidth = windowWidth;
          imageSize.imageHeight = (windowWidth * originalHeight) / originalWidth;
        } else { //图片高宽比大于屏幕高宽比 
          //图片缩放后的高为屏幕高 
          imageSize.imageHeight = windowHeight;
          imageSize.imageWidth = (windowHeight * originalWidth) / originalHeight;
        }
      }
    });

    return imageSize;
  },

  repeat(str, times) {
    return (new Array(times + 1)).join(str)
  },

  pad(num, maxLength) {
    return this.repeat('0', maxLength - num.toString().length) + num
  },

  //跳转路径分发处理
  renderUrl(linkType, linkTarget) {
    let url = null;
    switch (linkType) {
      case '1':
        console.log("linkType", linkType);
        url = '/pages/search/index?linkTarget=' + linkTarget + '&linkType=' + linkType;
        break;
      default:
        break;
    }

    return url;
  },

  //获取请求错误信息
  getRequestErrorMessage(responseErr) {
    console.log('responseErr >>>', responseErr);

    let message = responseErr.errMsg || "抱歉，请求失败了！";
    if (!responseErr.statusCode) {
      message = message.trim();
      if (message == 'request:fail') {
        message = "抱歉，连接服务器失败。"
      } else if (message == 'request:fail timeout' || message == 'request:fail connect timed out'){
        message = "请求超时，请稍后再试。"
      }

      return message;
    }

    switch (responseErr.statusCode) {
      case 400:
        message = '抱歉，请求出错!'
        break;
      case 401:
        message = '抱歉，未授权访问！'
        break;
      case 403:
        message = '抱歉，服务器拒绝访问！'
        break;
      case 404:
        message = '抱歉，请求地址出错！'
        break;
      case 408:
        message = '抱歉，请求超时！'
        break;
      case 500:
        message = '抱歉，服务器内部错误！'
        break;
      case 501:
        message = '抱歉，服务未实现！'
        break;
      case 502:
        message = '抱歉，网关错误！'
        break;
      case 503:
        message = '抱歉，服务不可用！'
        break;
      case 504:
        message = '抱歉，网关超时！'
        break;
      case 505:
        message = '抱歉，HTTP版本不受支持！'
        break;
    }

    return message;
  },

  //获取请求结果集(业务数据)
  getResponseBusinessData(res) {
    let result = '';
    if (res && res.code == 0) {
      result = res.data;
    }

    if (__config.ENV === 'dev') {
      const time = new Date();
      const url = this.getCurrentPageUrlWithArgs();
      const formattedTime = `${url} @ ${this.pad(time.getHours(), 2)}:${this.pad(time.getMinutes(), 2)}:${this.pad(time.getSeconds(), 2)}.${this.pad(time.getMilliseconds(), 3)}`
      console.log(formattedTime + '-请求业务结果数据：', result);
    }

    return result;
  },

  /**
  * 时间 转 时间戳
  * @param  {[type]} stringTime [时间]
  * @return {[type]}            [时间戳]
  */
  formatTimeStamp(stringTime) {
    if (!stringTime){
      return '';
    }

    if (typeof stringTime === 'string'){
      stringTime = stringTime.replace(/-/g, '/').replace(/T|Z/g, ' ').trim();
    }
    
    var timestamp = new Date(stringTime).getTime();
    return timestamp;
  },

  //获取当前时间yyyy-mm-dd格式
  getNowDate() {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    if (month < 10) {
      month = '0' + month;
    }
    var day = date.getDate();
    if (day < 10) {
      day = '0' + day;
    }
    return year + '-' + month + '-' + day;
  },

  // 取剩余秒
  pluralize(time, label){
    return time + label + '前'
  },

  // 相对时间过滤器，传入时间，返回距离今天有多久
  timeAgo(time){
    time = time instanceof Date ? time : new Date(time.replace(/-/g, '/').replace(/T|Z/g, ' ').trim());

    const between = Date.now() / 1000 - (Number(time) / 1000)
    if (between < 3600) {
      if (Object.is(~~(between / 60), 0)) return '刚刚'
      return this.pluralize(~~(between / 60), ' 分钟')
    } else if (between < 86400) {
      return this.pluralize(~~(between / 3600), ' 小时')
    } else {
      return this.pluralize(~~(between / 86400), ' 天')
    }
  },

  /**
   * 深拷贝
   *
   * @param {*} obj
   * @param {Array<Object>} cache
   * @return {*}
   */
  deepCopy(obj, cache = []) {
    if (obj === null || typeof obj !== 'object') {
      return obj
    }

    const hit = this.find(cache, c => c.original === obj)
    if (hit) {
      return hit.copy
    }

    const copy = Array.isArray(obj) ? [] : {}

    cache.push({
      original: obj,
      copy
    })

    Object.keys(obj).forEach(key => {
      copy[key] = this.deepCopy(obj[key], cache)
    })

    return copy
  },
  find(list, f) {
    return list.filter(f)[0]
  },

  strDiscode(str){
    return WxDiscode.strDiscode(str);
  }
}

module.exports = pubUtils;