const App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [],
    indicatorDots: !1,
    autoplay: !1,
    current: 0,
    interval: 3000,
    duration: 1000,
    circular: !1,
  },

  onLoad() {
    this.loadData();
  },

  loadData() {
    //本地文件
    let welcomImgs = [];
    welcomImgs.push('../../static/images/temp/welcome.png')
    this.setData({
      imgUrls: welcomImgs
    });

    // 调用接口获取欢迎页图片
    // App.HttpService.getRequest('/sm/startFiler/listStartFileInfo').then(response => {
    //   let result = App.utils.getResponseBusinessData(response);
    //   let welcomImgs = [];
    //   if(result && result.length){
    //     result.forEach(item => {
    //       if (item.filePath){
    //         welcomImgs.push(App.utils.renderFilePath(item.filePath));
    //       }
    //     });
    //   }

    //   if (!welcomImgs.length){
    //     //welcomImgs.push('../../static/images/temp/welcome.png');
    //     return this.goIndex();
    //   }

    //   this.setData({
    //     imgUrls: welcomImgs
    //   });
    // }).catch(err => {
    //   console.log('err', err);
    // });
  },

  swiperchange(e) { },

  bindload(e) {
    let time = this.data.imgUrls.length < 3 ? 3 : this.data.imgUrls.length;
    setTimeout(this.goTo, time * 1000);
  },

  bindtap() {
    this.goIndex();
  },

  goTo() {
    if (!App.globalData.authOnLaunch) {
      return this.goIndex();
    }

    App.checkAuthed()
      .then(authed => {
        if (!authed) {
          this.goAuth();
          return Promise.reject('userinfo no authed');
        } else {
          return Promise.resolve(true);
        }
      })
      .then(App.checkLogined)
      .then(logined => {
        if (!logined) {
          this.goLogin();
        } else {
          this.goIndex();
        }
      }
      ).catch(e => {
        console.log('e >>>', e);
      })
  },

  goAuth() {
    App.WxService.redirectTo('/pages/auth/confirm/index')
  },

  goIndex() {
    App.WxService.switchTab('/pages/home/index')
  },

  goLogin() {
    App.WxService.redirectTo('/pages/auth/bind/index')
  },
})