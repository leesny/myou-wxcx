/**
 * 封装微信工具方法
 */
const wxUtils = {

  //错误弹窗提示
  showErrorToast(options) {
    let option = Object.assign({
      title: '操作失败',
      image: '/static/images/icon/warn.png',
      duration: 3000
    }, options);

    wx.showToast(option);
  },

  //加载遮罩...
  showLoading(options) {
    let option = Object.assign({
      title: '加载中'
    }, options);

    wx.showLoading(option);
  },

  hideLoading() {
    wx.hideLoading();
  },

  // 成功提示及页面回退
  showTipAndBack(msg, backDelta) {
    wx.showToast({
      title: msg,
      icon: 'success',
      duration: 1500,
    });
    
    setTimeout(() => {
      // 页面回退
      wx.navigateBack({
        delta: backDelta || 1,
      })
    }, 1000);
  },

  checkWxBaseVersion() {
    return new Promise((resolve, reject) => {
      wx.getSystemInfo({
        success: function (res) {
          var version = res.SDKVersion;
          version = version.replace(/\./g, "")
          resolve(version);
        }
      })
    });
  }
};

export default wxUtils;