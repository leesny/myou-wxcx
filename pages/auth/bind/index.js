const App = getApp();

Page({
  data: {
    remind: '加载中',
    help_status: false,
    logincode_focus: false,
    loginpwd_focus: false,
    loginCode: '',
    loginPwd: '',
    angle: 0,
    avatarUrl: ''
  },
  onReady: function () {
    var _this = this;
    setTimeout(function () {
      _this.setData({
        remind: ''
      });
    }, 1000);
    wx.onAccelerometerChange(function (res) {
      var angle = -(res.x * 30).toFixed(1);
      if (angle > 14) { angle = 14; }
      else if (angle < -14) { angle = -14; }
      if (_this.data.angle !== angle) {
        _this.setData({
          angle: angle
        });
      }
    });

    //头像
    let userInfo = App.globalData.userInfo;
    if (userInfo) {
      this.setData({
        avatarUrl: userInfo.avatarUrl
      });
    }
  },

  formSubmit: function (event) {
    let formData = event.detail.value;
    if (!formData.loginCode) {
      App.utils.showErrorToast({
        title: '账号不能为空'
      });
      return;
    }

    if (!formData.loginPwd) {
      App.utils.showErrorToast({
        title: '密码不能为空'
      });
      return;
    }

    let params = {
      loginCode: formData.loginCode,
      loginPwd: App.utils.MD5(formData.loginPwd),
      clientType: 'mini',
      wxMinOpenId: App.globalData.openId
    }

    wx.showLoading({
      title: '正在登陆',
    });

    return App.HttpService.postRequest('/sm/login', {
      data: params
    }).then(res => {
      if (res && res.data && res.data.token) {
        App.globalData.isLogend = true;
        let token = res.data.token;

        //缓存TOKEN
        App.WxService.setStorageSync('token', token);

        return App.HttpService.getRequest('/sm/user/getCurrUser');
      } else {
        return Promise.reject('抱歉，登录失败！');
      }
    }).then((res) => {
      if (res && res.data && res.data.userId) {
        App.globalData.sysuser = res.data;
        App.WxService.setStorageSync('sysuser', res.data);
        App.goLastPage();
      } else {
        return Promise.reject('抱歉，未找到您的用户！');
      }
    }).then(() => {
      wx.hideLoading();
    }).catch(e => {
      console.log(e);
      wx.hideLoading();
    });
  },

  onInputBlur: function (opt) {
    let id = opt.target.id;
    if (id == 'login-code') {
      this.setData({
        'logincode_focus': false
      });
    } else if (id == 'login-pwd') {
      this.setData({
        'loginpwd_focus': false
      });
    }
  },

  onInputFocus: function (opt) {
    let id = opt.target.id;
    if (id == 'login-code') {
      this.setData({
        'logincode_focus': true
      });
    } else if (id == 'login-pwd') {
      this.setData({
        'loginpwd_focus': true
      });
    }
  },

  onShareAppMessage: function () {
    let entName = App.globalData.sysuser && App.globalData.sysuser.entShortName || '';
    return {
      title: entName + App.__constant.appName,
      desc: App.__constant.appShare,
      path: '/pages/home/index'
    }
  }
})