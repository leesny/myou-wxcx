
const App = getApp();

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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  bindFormSubmit(e){
    let that = this;
    let msgDetail = e.detail.value.msgDetail;

    // 验证表单
    if (!msgDetail) {
      let error = "请填写信息";
      wx.showToast({
        title: `${error} `,
        image: '/static/images/icon/warn.png',
        duration: 2000
      })
      return;
    };

    wx.showLoading({
      title: '正在提交...',
    });

    App.HttpService.postRequest('/msg/feedBack',{
      data: {
        msgDetail: msgDetail
      }
    }).then((res) => {
      wx.hideLoading();
      wx.showModal({
        title: '衷心鸣谢',
        content: '已收到您的反馈，感谢您的支持！',
        showCancel:false,
        complete:function(){
          that.setData({
            msgDetail:''
          });
        }
      })
    }).catche(e => {
      wx.hideLoading();
    });
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