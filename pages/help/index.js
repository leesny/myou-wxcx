// pages/about/index.js
var App = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  feedbackSubmit: function (e) {
    wx.showToast({
      title: '成功',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  //提交表单
  feedbackSubmit(e) {
    var that = this
    console.log(e)
    var suggest = e.detail.value.suggest
    var relaPhone = e.detail.value.relaPhone
    //var relaPhone = '18256934272'
    if (suggest==''){
      that.showModal('建议不能为空')
      return
    }
    if (relaPhone=='') {
      that.showModal('联系方式不能为空')
      return
    }
    if (relaPhone.length!=11){
      that.showModal('请输入正确的联系方式')
      return
    }
    App.HttpService.getRequest('/mem/createMemSuggest',{
      data: {
        //memId: App.globalData.userInfo.userId,
        suggest: suggest,
        relaPhone: relaPhone
      }
    }).then(response =>{
      let result = App.utils.getResponseBusinessData(response);
      console.log("result===",result)
      wx.showModal({
        title: '提示', 
        content: '提交成功', 
        success: function (res) {
          wx.switchTab({
              url: `/pages/user/index`,
            })
        }
      })
    })

    
  },

  //弹窗提示
  showModal(e) {
    App.WxService.showModal({
      title: '提示',
      content: e,
      showCancel:false
    })
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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

  }
})