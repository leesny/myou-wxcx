var App = getApp();
var WxParse = require('../tpls/wx-parser/wx-parser.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    //内容
    siteContent: {
      contentTitle: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    console.log('options >>>', options);
    let articleType = parseInt(options.articleType || 1);
    let id = options.id;
    let code = options.code;

    //动态设置title
    let title = options.title || "文章详情";
    switch (articleType) {
      case 1: //通知、公告、帮助文档
        that.getSiteContent(code);
        break;
      case 2: //TA的故事
        that.getIntroContent(id);
        break;
    }

    wx.setNavigationBarTitle({
      title: title
    })
  },

  //获取内容信息
  getSiteContent(code) {
    wx.showLoading({
      title: '正在加载...',
    })

    App.HttpService.getRequest('/sm/content/getContentByContentCode', { data: { contentCode: code.toString() } })
      .then(response => {
        console.log('response >>>', response);
        wx.hideLoading();

        let result = App.utils.getResponseBusinessData(response);
        if (!result) {
          wx.showModal({
            title: '提示',
            content: '没有获取到内容！',
          })
          return;
        }

        let content = "<p> " + result.contentInfo + "</p>"
        WxParse.wxParse('article', 'html', content, this, 5);
      })
      .catch(err => {
        wx.hideLoading();
      });

  },

  //获取TA的故事
  getIntroContent(id) {
    wx.showLoading({
      title: '正在加载...',
    })
    App.HttpService.getRequest('/sm/intro/listIntroContentByIntroId', { data: { introId: id } })
      .then(response => {
        wx.hideLoading();

        let result = App.utils.getResponseBusinessData(response);
        if (!result) {
          wx.showModal({
            title: '提示',
            content: '没有获取到内容！',
          })
          return;
        }

        let imgTags = result.reduce((imgTag, item, index, array) => {
          let imagePath = App.utils.renderFilePath(item.imagePath);
          return imgTag + ' <img src="' + imagePath + '" />';
        }, '');

        WxParse.wxParse('article', 'html', imgTags, this, 5);
      })
      .catch(err => {
        wx.hideLoading();
      });
  },

  onShow: function () {

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
    return {
      title: App.__constant.appName + '——' + 'TA的故事',
      path: '/pages/article/index?id=' + this.data.siteContent.msgId + "&type=" + this.data.siteContent.msgType,
      success: function (res) {
        // 转发成功
        wx.showToast({
          title: '转发成功',
          icon: 'success',
          duration: 1500
        })
      },
      fail: function (res) {
        if (res && res.errMsg == 'shareAppMessage:fail cancel') {
          // 取消
          App.utils.showErrorToast({
            title: '取消转发',
            duration: 500
          });
        } else {
          // 转发失败
          App.utils.showErrorToast({
            title: '转发失败'
          });
        }
      }
    }
  }
})