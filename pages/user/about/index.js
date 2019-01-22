
const App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    queryId: '',
    entInfo: {},
    showShareImg: false,
    shareImgSrc: '',
    qrImgTempPath:'',//小程序码临时路径
    entLogoTempPath:'',//企业二维码临时路径
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let entId = options.entId;
    if (!entId) {
      //全局中获取
      let globalSysuser = App.globalData.sysuser;
      if (globalSysuser) {
        entId = globalSysuser.entId;
      }
    }

    this.setData({
      queryId: entId
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let entId = this.data.queryId;
    let entInfo = {}
    this.doGetCompanyInfo(entId).then(res => {
      entInfo = this.data.entInfo;
      //1. 请求后端API生成小程序码
      return this.getQrImage();
    }).then(res => {
      //2. canvas绘制文字和图片
      let ctx = wx.createCanvasContext('shareCanvas');
      ctx.setFillStyle('white')
      ctx.fillRect(0, 0, 600, 850);

      //logo
      let logoImgPath = this.data.entLogoTempPath || '/static/images/default/logo.png';
      ctx.drawImage(logoImgPath, 125, 60, 150, 70);

      //企业名称
      ctx.setFontSize(18)
      ctx.setTextAlign = ("center");
      ctx.setFillStyle('#111111')
      ctx.fillText(entInfo.fullName, 120, 162)
      ctx.setTextBaseline('middle');

      //公司简介
      ctx.setFontSize(16)
      ctx.setFillStyle('#6F6F6F')
      ctx.fillText('公司简介 ', 10, 210)
      let finalHeight = this.draw_long_text(entInfo.entIntro || '暂无', ctx, 10, 240);

      // 官方网站
      ctx.setFontSize(16)
      ctx.setFillStyle('#6F6F6F')
      ctx.fillText('官方网站   ' + (entInfo.webSite || ''), 10, finalHeight + 80)

      // 客服电话
      ctx.setFontSize(16)
      ctx.setFillStyle('#6F6F6F')
      ctx.fillText('客服电话   ' + (entInfo.telPhone || ''), 10, finalHeight + 80 + 40)

      // 二维码
      let qrImgPath = this.data.qrImgTempPath||'/static/images/temp/share-qrcode.jpg';
      ctx.drawImage(qrImgPath, 125, finalHeight + 80 + 40 + 50, 160, 240);
   
      ctx.setTextAlign = ("center");
      ctx.setFontSize(16)
      ctx.fillText('长按扫码查看详情', 140, finalHeight + 80 + 40 + 50 + 240 + 30)
      ctx.draw();
    })
  },

  draw_long_text: function (longtext, cxt, begin_width, begin_height) {
    var linelenght = 50;
    var text = "";
    var count = 0;
    var begin_width = begin_width;
    var begin_height = begin_height;
    var stringLength = longtext.length;
    var newtext = longtext.split("");
    var context = cxt;
    context.textAlign = 'left';
    context.setFontSize(14);

    //屏幕能显示的字数
    let showMaxFont = 22;
    let deviceInfo = App.globalData.deviceInfo;
    if (deviceInfo && deviceInfo.windowWidth) {
      showMaxFont = parseInt(deviceInfo.windowWidth / 15)
    }

    //高度控制最高125 超出不显示
    let maxHeight = begin_height + 125;

    for (let i = 0; i <= stringLength; i++) {
      if (count == showMaxFont) {
        context.fillText(text, begin_width, begin_height);
        begin_height = begin_height + 25;
        text = "";
        count = 0;

        if (begin_height >= maxHeight){
          break;
        }
      }

      if (i == stringLength) {
        context.fillText(text, begin_width, begin_height);
      }
      var text = text + newtext[0];
      count++;
      newtext.shift();
    }

    let final_height = begin_height;

    return final_height;
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  doGetCompanyInfo(entId) {
    let that = this;
    let entData = {};
    
    wx.showNavigationBarLoading();

    //调用系统API
    return App.HttpService.getRequest('/sm/ent/info', {
      data: {
        entId: entId
      }
    }).then((res) => {
      wx.hideLoading();
      if (res && res.data) {
        entData = res.data;
        entData.logoPath = App.utils.renderFilePath(entData.logoPath,'/static/images/default/logo.png');
      }
      that.setData({
        entInfo: entData
      })
      return App.WxService.downloadFile({
        url: entData.logoPath,
      });
    }).then(res => {
      if (res.errMsg === "downloadFile:ok") {
        that.setData({
          entLogoTempPath: res.tempFilePath
        })
      }

      wx.hideNavigationBarLoading();
    }).catch(error => {
      wx.hideNavigationBarLoading();
    });
  },

  //页面跳转逻辑
  navigateTo(e) {
    let index = e.currentTarget.dataset.index
    let path = e.currentTarget.dataset.path
    if (!path){
      return;
    }
    switch (parseInt(index)) {
      case 1:
        App.WxService.makePhoneCall({
          phoneNumber: path
        });
        break
      default:
        break;
    }
  },

  //设置首页显示
  onTapSetting() {

  },

  //发送朋友圈（小程序目前只支持生成图片保存到相册）
  onSaveBtnTap() {
    let that = this;

    this.onCanvasToFile().then(() => {
      wx.showLoading({
        title: '保存中...',
      })

      let filePath = this.data.shareImgSrc;
      return App.WxService.saveImageToPhotosAlbum({
        filePath: filePath
      })
    }).then(res => {
      wx.hideLoading();

      wx.showModal({
        title: '存图成功',
        content: '图片成功保存到相册了，去发圈噻~',
        showCancel: false,
        confirmText: '好的',
        confirmColor: '#72B9C3',
        success: function (res) {
          if (res.confirm) {
          }

          that.setData({
            showShareImg: false
          });
        }
      })
    }).catch((res) => {
      if (res && res.errMsg == 'saveImageToPhotosAlbum:fail cancel') {
        // 取消
        App.utils.showErrorToast({
          title: '保存已取消',
          duration: 500
        });
      } else {
        // 失败
        App.utils.showErrorToast({
          title: '保存失败'
        });
      }
    });
  },

  onCanvasToFile() {
    let that = this;

    if (!this.data.qrImgTempPath){
      wx.showLoading({
        title: '正在生成图片...',
        success:function(){
          setTimeout(() => {
            that.onCanvasToFile();
          },500);
        }
      });
      return;
    }

    return App.WxService.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 600,
      height: 850,
      destWidth: 600,
      destHeight: 850,
      canvasId: 'shareCanvas'
    }).then(res => {
      that.setData({
        showShareImg: true,
        shareImgSrc: res.tempFilePath
      })
    }).catch(e => {
      console.log('canvasToTempFilePath e : ', e);
    });
  },

  onHideShareBox() {
    this.setData({
      showShareImg: false
    });
  },

  copyWebSite() {
    let that = this;
    let webSite = this.data.entInfo.webSite;

    wx.setClipboardData({
      data: webSite,
      success() {
        wx.showModal({
          title: '复制成功',
          content: '网站地址复制成功，快粘贴到手机浏览器访问吧~',
          showCancel: false,
          confirmText: '我知道了',
          confirmColor: '#72B9C3',
          success: function (res) {
            if (res.confirm) {
            }
          }
        })
      }
    });
  },


  //获取小程序二维码
  getQrImage() {
    let that = this;
    let path = 'pages/home/index';
    let qrImgPath = ''

    //调用系统API
    return App.HttpService.getRequest('/wxmini/getwxacode', {
      data: {
        path: path,
        width: 300
      }
    }).then((res) => {
      qrImgPath = App.utils.renderFilePath(res.data)
      that.setData({
        qrImgPath: qrImgPath
      })
      return App.WxService.downloadFile({
        url: qrImgPath
      });
    }).then(res => {
      // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
      if (res.errMsg === "downloadFile:ok") {
        that.setData({
          qrImgTempPath: res.tempFilePath
        })
      }
      
      wx.hideLoading();
    }).catch(error => {
      wx.hideLoading();
    });
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
  onShareAppMessage: function (e) {
    let entInfo = this.data.entInfo;
    return {
      title: entInfo.fullName,
      imageUrl: entInfo.logoPath,
      path: '/pages/home/index',
      success: function (res) {
        wx.showToast({
          title: '分享成功啦~',
          icon: 'success',
          duration: 2000,
          success: function (res) {

          }
        })
      },
      fail: function (res) {
        if (res && res.errMsg == 'shareAppMessage:fail cancel') {
          // 取消
          App.utils.showErrorToast({
            title: '分享已取消',
            duration: 500
          });
        } else {
          // 转发失败
          App.utils.showErrorToast({
            title: '分享失败'
          });
        }
      }
    }

  },

})