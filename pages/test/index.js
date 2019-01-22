App = getApp();

// pages/home/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    appBoxStyle: 'grid', //grid|group|free
    msgNum: {},
    isTopLoading: !App.globalData.isLogend
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  doSetAppNargatorTitle(){
    let entName = App.globalData.sysuser && App.globalData.sysuser.entShortName || '';
    let navgationTitle = entName + App.__constant.appName;

    wx.setNavigationBarTitle({
      title: navgationTitle
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
     
  },

  initView(){
    this.doSetLayout()
      .then(() => {
        this.loadData();
      })
      .then(() => {
        this.setData({
          isTopLoading: false
        });
      })
      .catch(e => {
        this.setData({
          isTopLoading: false
        });
        console.log(e);
      });
  },

  //加载数据
  loadData() {
    return App.HttpService.getRequest('/msg/listNum').then(res => {
      let obj = {};
      if (res.data && res.data.length) {
        res.data.forEach(item => {
          obj[item.name] = item.num;
        })

        // 通知数字提示
        // let noticeNum = obj.notice;
        // if (wx.setTabBarBadge && parseInt(noticeNum) > 0) {
        //   wx.setTabBarBadge({
        //     index: 1,
        //     text: parseInt(noticeNum).toString()
        //   })
        // }
      };

      this.setData({
        msgNum: obj,
      })

      //设置顶部名称
      this.doSetAppNargatorTitle();
    })
  },

  //设置布局
  doSetLayout() {
    let style = wx.getStorageSync('appBoxStyle') || 'grid';
    this.setData({
      'appBoxStyle': style
    });

    return Promise.resolve();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
   let _this = this;

   //this.doSetAppNargatorTitle();

   App.checkLogined().then(logined => {
      if (logined){
        _this.initView();
      }else{
        App.signInAutoByCode(function () {
          _this.initView();
        })
      }
    })  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    App.globalData.business.publishUsers = {};
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
    wx.showNavigationBarLoading(); //在标题栏中显示加载

    this.loadData().then(() => {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    })
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

  }
})