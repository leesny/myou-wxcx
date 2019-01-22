
const App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
      bgImg: '',
      avatar: '',
      nickName: 'OA用户'
    },

    sysuser:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.doGetUserInfo();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  doGetUserInfo(){
    var that = this;

    //检查是否授权
    App.checkAuthed().then(authed => {
      if (!authed){
        App.WxService.redirectTo('/pages/auth/confirm/index?redirect=/pages/user/personal/index')
      }else{
        //先从全局中获取
        let globalUserInfo = App.globalData.userInfo;
        if (globalUserInfo) {
          this.setData({
            nickName: globalUserInfo.nickName,
            avatarUrl: globalUserInfo.avatarUrl,
            bgImgUrl: globalUserInfo.avatarUrl
          })

          return this.doGetSysUserInfo();
        }
      }
    })    
  },

  doGetSysUserInfo(){
    let that = this;

    //检查是否登陆
    App.checkLogined().then(logined => {
      if (!logined) {
        App.WxService.redirectTo('/pages/auth/bind/index?redirect=/pages/user/personal/index')
      } else {
        //全局中获取
        let globalSysuser = App.globalData.sysuser;
        if (globalSysuser) {
          this.setData({
            sysuser: globalSysuser
          })
          return;
        }

        //调用系统API
        wx.showLoading({
          title: '加载中',
        });

        App.HttpService.getRequest('/sm/user/getCurrUser').then((res) => {
          wx.hideLoading();
          if (res && res.data && res.data.userId) {
            App.globalData.sysuser = res.data;

            that.setData({
              sysuser: res.data
            })
          }
        }).catch(error => {
          wx.hideLoading();
        })
      }
    })    
  },

  //解除绑定
  onUnbindTap(){
    let _this = this;
    wx.showModal({
      title: '温馨提示',
      content: '您确定解除与该微信号的关联吗？',
      showCancel: true,
      success: function (res) {
        if (res.confirm) {
          let openId = App.globalData.openId;
          App.HttpService.postRequest('/sm/unBindForWxMini', {
            data: {
              openId: openId
            },
            showLoading: false,
            showError: false
          }).then(res => {
            _this.logoutData();
          }).catch(e => {
            _this.logoutData();
          });
        } else if (res.cancel) {
        }
      },
    }) 
  },

  logoutData () {
    App.globalData.openId = null;
    
    wx.showToast({
      title: '解除成功！',
    });

    setTimeout(() => {
      App.WxService.redirectTo("/pages/auth/bind/index");
    }, 1500);
  },

  //页面跳转逻辑
  navigateTo(e) {
    let path = e.currentTarget.dataset.path;
    let entId = e.currentTarget.dataset.entid;
    if(entId){
      path = path + '?entId=' + entId;
    }
    App.WxService.navigateTo(path);
  },

  //设置首页显示
  onTapSetting(){
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  
})