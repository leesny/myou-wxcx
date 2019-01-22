const App = getApp()

Page({
  data: {
    appName: "",
    applogo: "",
    support: "",
    logged: !1
  },
  onLoad(options) {
    App.globalData.redirectRoute = (options.redirect && decodeURIComponent(options.redirect)) || '/pages/home/index';

    this.setData({
      appName: App.__constant.appName,
      appLogo: App.__constant.appLogo,
      support: App.__constant.devTeam
    });
  },
  onShow() {
    App.checkLogined(isLogend => {
      this.setData({
        logged: Boolean(isLogend)
      });

      if (isLogend) {
        App.goLastPage();
      }
    });
  },

  confirmLogin(e) {
    console.log('confirmLogin getuserInfo >>>>', e);
    let userInfo = e.detail.userInfo;
    if (userInfo) {
      App.globalData.userInfo = userInfo;
      wx.setStorageSync('userInfo', userInfo);
      
      App.checkLogined().then(logined => {
        App.goLastPage();
      }).catch(e => {
        wx.redirectTo({
          url: "/pages/auth/bind/index"
        })
      })
    }
  },

  showModal() {
    App.WxService.showModal({
      title: '友情提示',
      content: '获取用户登录状态失败，请重新登录',
      showCancel: !1,
    })
  }
})