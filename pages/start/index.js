const App = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: ['../../static/images/tmp/welcome.png', '../../static/images/tmp/welcome2.jpg'],
    indicatorDots: !1,
    autoplay: !1,
    current: 0,
    interval: 3000,
    duration: 1000,
    circular: !1,
  },
  swiperchange(e) {},

  bindload(e) {
    setTimeout(App.WxService.getStorageSync('token') ? this.goIndex : this.goLogin, 3000)
  },

  goIndex() {
    App.WxService.switchTab('/pages/index/index')
  },

  goLogin() {
    App.WxService.redirectTo('/pages/login/index')
  },
})