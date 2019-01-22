App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  doSetAppNargatorTitle(){
    let entName = App.globalData.sysuser && App.globalData.sysuser.entShortName || '首页';
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
    this.doSetAppNargatorTitle();
  },

  //加载数据
  loadData() {
    
  },

 
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
   let _this = this;

  //  App.checkLogined().then(logined => {
  //     if (logined){
  //       _this.initView();
  //     }else{
  //       App.signInAutoByCode(function () {
  //         _this.initView();
  //       })
  //     }
  //   })  
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

  }
})