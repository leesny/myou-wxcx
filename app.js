import WxValidate from './static/plugins/wx-validate/WxValidate'
import WxService from './static/plugins/wx-service/WxService'
import HttpResource from './services/HttpResource'
import HttpService from './services/HttpService'
import HttpCallService from './services/HttpCallService'
import __config from './config/config'
import __constant from './config/constant'
import utils from './utils/util'

App({
  globalData: {
    userInfo: null
  },

  //生命周期钩子函数
  onLaunch() {
    console.log('启动...')
  },
  onShow() {
    console.log('显示...')
  },
  onHide() {
    console.log('隐藏...')
  },

  //获取用户信息
  getUserInfo() {
    return this.WxService.login()
      .then(data => {
        console.log('wx login data >>>' + data)
        return this.WxService.getUserInfo()
      })
      .then(data => {
        console.log(data)
        this.globalData.userInfo = data.userInfo
        return this.globalData.userInfo
      })
  },

  //图片路径统一处理
  renderImage(path) {
    if (!path) return ''
    if (path.indexOf('http') !== -1) return path
    return `${this.__config.imgPath}${path}`
  },

  //plugins注册
  WxValidate: (rules, messages) => new WxValidate(rules, messages),
  HttpResource: (url, paramDefaults, actions, options) => new HttpResource(url, paramDefaults, actions, options).init(),
  HttpService: new HttpService({
    baseURL: __config.basePath,
    header: {
      'content-type': __config.reqContentType
    }
  }),
  HttpCallService: new HttpCallService({
    baseURL: __config.basePath,
    header: {
      'content-type': __config.reqContentType
    }
  }),
  WxService: new WxService,
  utils,
  __config,
  __constant
})