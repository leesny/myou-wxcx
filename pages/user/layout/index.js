
const App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    layoutLists: [{
      name: '九宫格',
      path: '../../../static/images/default/home_layout1@2x.png',
      appBoxStyle: 'grid'
    }, {
      name: '分组',
      path: '../../../static/images/default/home_layout2@2x.png',
      appBoxStyle: 'group'
    }],

    checked: "grid"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //缓存取值
    let  checked = App.WxService.getStorageSync('appBoxStyle') || 'grid';
  
    this.setData({
      checked: checked
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  radioChange(e){
    App.WxService.setStorageSync('appBoxStyle', e.detail.value);
    App.WxService.switchTab('/pages/user/personal/index');
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