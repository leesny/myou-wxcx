const App = getApp()

Page({
  data: {
    appName: "",
    applogo: "",
    logged: !1
  },
  onLoad() {
    this.setData({
      appName: App.__constant.appName,
      appLogo: App.__constant.appLogo
    });
  },
  onShow() {
    const token = App.WxService.getStorageSync('token')
    this.setData({
      logged: !!token
    })
    token && setTimeout(this.goIndex, 1500)
  },

  confirmLogin() {

    //方式1: 填写账号登陆
    this.signInByAccout(this.goIndex);

    //方式2: 根据CODE登陆
    //this.signInAutoByCode(this.goIndex);

    //方式3: 自动注册再登陆
    //this.wechatRegistSignIn(this.goIndex);
  },

  goIndex() {
    App.WxService.switchTab('/pages/index/index')
  },

  showModal() {
    App.WxService.showModal({
      title: '友情提示',
      content: '获取用户登录状态失败，请重新登录',
      showCancel: !1,
    })
  },

  //账号登陆
  signInByAccout(cb) {
    if (App.WxService.getStorageSync('token')) {
      return;
    }

    App.HttpCallService.jsonCall({
      fn: 'mallmem.memLoginHandler.quickLogin',
      params: ["18523454567", "9999", "WEIXIN"],
    }).then(res => {
      const data = res.data
      if (data.success) {
        App.WxService.setStorageSync('token', data.userAttrId)
        cb()
      }
    })
  },

  //Code登陆
  signInAutoByCode(cb) {
    if (App.WxService.getStorageSync('token')) {
      return;
    }

    App.WxService.login()
      .then(data => {
        console.log('wechatSignUp', data.code)
        return App.HttpCallService.jsonCall({
          fn: 'mallmem.memLoginHandler.doWxMpLogin',
          params: [data.code]
        })
      })
      .then(res => {
        const data = res.data
        console.log('wechatSignUp', data)
        if (data.success) {
          App.WxService.setStorageSync('token', data.userAttrId)
          cb()
        } else if (data.target == null) {
          this.showModal()
        } else {
          this.wechatSignUp(cb)
        }
      })
  },

  //微信用户注册
  wechatSignUp(cb) {
    if (App.WxService.getStorageSync('token')) {
      return;
    }

    App.WxService.login()
      .then(data => {
        console.log('wechatSignIn', data.code)
        return App.HttpCallService.jsonCall({
          fn: '',
          params: [data.code]
        })
      })
      .then(res => {
        const data = res.data
        console.log('wechatSignIn', data)
        if (data.success) {
          App.WxService.setStorageSync('token', data.data.token)
          cb()
        } else if (data.target == null) {
          this.showModal()
        } else {
          this.wechatSignUp(cb)
        }
      })
  },

  wechatRegistSignIn() {
    let code;

    App.WxService.login()
      .then(data => {
        code = data.code
        return App.WxService.getUserInfo()
      })
      .then(data => {
        return App.HttpCallService.jsonCall({
          fn: "wechatDecryptData",
          params: [{
            encryptedData: data.encryptedData,
            iv: data.iv,
            rawData: data.rawData,
            signature: data.signature,
            code: code
          }]
        })
      })
      .then(data => {
        console.log(data)
      })
  },


})