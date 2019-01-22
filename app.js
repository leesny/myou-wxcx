import WxValidate from './static/plugins/wx-validate/WxValidate'
import WxService from './static/plugins/wx-service/WxService'
import HttpResource from './services/HttpResource'
import HttpService from './services/HttpService'
import __config from './config/config'
import __constant from './config/constant'
import __permissions from './config/permissions'
import utils from './utils/index'
// const aldstat = require("./utils/ald-stat.js");

App({
  globalData: {
    staticMode: true, //是否是静态开发模式(前后端分离模式下，开发页面阶段时为true)
    authOnLaunch: false, //是否启动就检查用户授权
    checkRegist: true, //是否检测当前用户已注册
    isLogend: false, //是否已登录
    userInfo: null, //微信用户信息
    sysuser: null, //系统用户信息
    openId: null, //微信openId
    deviceInfo: {} , //设备信息
    redirectRoute: null, //需要重定向的页面路由

    //业务数据,供页面间传值
    business:{
      
    },   
  },

  //生命周期函数
  onLaunch(options) {
    let _this = this;
    
    //1.获取设备信息
    this.getDeviceInfo();
  
    //2.检查授权
    this.globalData.authOnLaunch && this.doAuthorization();
  },

  // 用户信息授权检查
  doAuthorization() {
    // 静态开发模式跳过授权检查(生成一个随机OPENID)
    if (this.globalData.staticMode) {
      const UUID = utils.getUUID();
      console.warn('当前为静态页面开发模式...请注意切换模式。已生成随机OpenId:', UUID);
      this.globalData.openId = UUID;
      return;
    }

    console.log('checkAuthed >>>>>');
    return this.checkAuthed().then(authed => {
      console.log('authed >>>>>', authed);
      if (authed) {//已授权
        this.checkLogined().then(logined => {
          console.log('检查登录状态：', logined);
          !logined && this.signInAutoByCode();
        }).catch(err => {
          this.signInAutoByCode();
        });
      } else { //未授权
        // 获取当前页面
        let currRoute = utils.getCurrentPageUrl();
        if (!['/pages/auth/confirm/index', '/pages/start/index', '/pages/auth/bind/index'].includes(currRoute)) {
          console.log(`未获取到微信授权: ${currRoute}`);
          this.globalData.redirectRoute = currRoute;
          wx.redirectTo({
            url: '/pages/auth/confirm/index',
          })
        }
      }
    }).catch(e => {
      console.log(e);
    });
  },

  //检查是否已授权
  checkAuthed(){
    let currRoute = utils.getCurrentPageUrl();
    console.log(`checkAuthed 触发所在页面：${currRoute || '未获取到，可能正在启动中...'} `);
    
    // 缓存中取值
    if (!this.globalData.userInfo) {
      let userInfoCache = wx.getStorageSync('userInfo');
      if (userInfoCache) {
        this.globalData.userInfo = userInfoCache;
      }
    }
    
    // if (this.globalData.staticMode) {
    //   return Promise.resolve(true);
    // }

    // 跳过授权或已有授权信息
    return Promise.resolve(Boolean(this.globalData.userInfo));
  },

  //检查用户登录
  checkLogined() {
    let currRoute = utils.getCurrentPageUrl();
    console.log(`checkLogined 触发所在页面：${currRoute || '未获取到，可能正在启动中...'} `);
    console.log('checkLogined >>> sysuser:',this.globalData.sysuser);

    if (!this.globalData.sysuser){
      //缓存中取值
      let sysuserCache = wx.getStorageSync('sysuser');
      if (sysuserCache) {
        this.globalData.sysuser = sysuserCache;
      }
    }

    // if (this.globalData.staticMode) {
    //   return Promise.resolve(true);      
    // }

    let logined = !!(this.globalData.sysuser && this.globalData.userInfo);
    return Promise.resolve(logined);
    // return this.WxService.checkSession().then(res => {
    //   return logined;
    // }).catch(e => {
    //   console.log(`微信SESSION检查: ${e.errMsg}`);
    //   return Promise.resolve(false);
    // })
  },

  //获取设备信息
  getDeviceInfo(){
    return this.WxService.getSystemInfo().then(res => {
      let device = {
        model: res.model,
        pixelRatio: res.pixelRatio,
        windowWidth: res.windowWidth,
        windowHeight: res.windowHeight,
        language: res.language,
        version: res.version,
        platform: res.platform
      };

      this.globalData.deviceInfo = device;
    }).catch(e => {
      console.log('getSystemInfo e:', e);
    })
  },

  //手动授权
  doManualAuth(cb) {
    let that = this;
    
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
            wx.showModal({
              title: '提示',
              content: '您尚未开启用户授权，立即设置？',
              showCancel: false,
              success: function (res) {
                  if (res.confirm) {
                    wx.openSetting({
                      success: function (res) {
                        if (res.authSetting["scope.userInfo"]) {
                          that.signInAutoByCode(cb);
                        }
                      }
                    })
                  } else if (res.cancel) {
                    wx.showToast({
                      title: '未获取到您用户授权！',
                    })
                  }
                }
            })
        }else{
          that.signInAutoByCode(cb);
        }
      }
    })
  },

  //自动登录
  /**
   * 步骤：
   *   1. 获取code
   *   2. 获取用户信息
   *   3. 后台收录用户，并自动登录
   *   4. 返回登录结果
   */
  signInAutoByCode(cb) {
    let that = this;
    let wxcode = "";
    console.log('signInAutoByCode userInfo>>> ',this.globalData.userInfo);
    this.WxService.login()
      .then(data => {
        console.log('data >>>>', data);
        wxcode = data.code;
        return this.WxService.getUserInfo();
      })
      .then(wxuser => {
        this.globalData.userInfo = wxuser.userInfo;
      })
      .then(() => {
        if (!this.globalData.checkRegist){
          return false;
        } else {
          return this.checkRegistered(wxcode)
        }
      })
      .then(binded => {
        console.log('checkRegistered binded >>>> ', binded);
        if (!binded) {
          return Promise.reject({
            binded:false,
            message: '未绑定微信账号！'
          });
        }else{
          return this.autoLoginWithOpenId(cb);
        }
      })
      .catch(err => {
        console.log(err);
        if (err && err.errMsg == 'getUserInfo:fail auth deny' && !utils.isSkipAuthPage()){
          wx.showModal({
            title: '提示',
            content: '您点击了拒绝授权，将无法正常使用OA平台。请10分钟后再次点击授权，或者删除小程序重新进入。',
            success: function (res) {
              if (res.confirm) {
                that.doManualAuth();
              } else if (res.cancel) {
                wx.navigateTo({
                  url: '/pages/auth/confirm/index',
                })
              }
            },
          })
        } else if (err && err.binded === false){
          //获取当前路由
          let currRoute = utils.getCurrentPageUrl();
          console.log('currRoute >>>>>', currRoute);
          if (currRoute != '/pages/auth/bind/index'){
            wx.redirectTo({
              url: '/pages/auth/bind/index',
            })
          }
        }
      })
  },

  checkRegistered(code) {
    return this.HttpService.getRequest('/sm/checkWxMinOpenId', {
      data: {
        jsCode:code
      }
    }).then(res => {
      if(res && res.data && res.data.openId){
        this.globalData.openId = res.data.openId;
        return !!res.data.binded;
      }else{
        return Promise.reject(res);
      }
    }).catch(e => {
      return Promise.reject(e);
    });
  },
  
  //自动登录
  autoLoginWithOpenId(cb){
    let openId = this.globalData.openId;
    return this.HttpService.postRequest('/sm/login', {
      data: {
        wxMinOpenId:openId,
        clientType:'mini'
      }
    }).then(res => {
      if (res && res.data && res.data.token) {
        this.globalData.isLogend = true;
        let token = res.data.token;

        //缓存TOKEN
        this.WxService.setStorageSync('token', token);

        return this.HttpService.getRequest('/sm/user/getCurrUser');
      } else {
        return Promise.reject('抱歉，登录失败！');
      }
    }).then((res) => {
      if (res && res.data && res.data.userId) {
        this.globalData.sysuser = res.data;
        
        cb && cb();
        this.globalLoginedCallBack && this.globalLoginedCallBack();
      } else {
        return Promise.reject('抱歉，未找到您的用户！');
      }
    }).catch(e => {
      console.log('bind exception: ', e);
    });
  },

  goLastPage() {
    let redirectUrl = this.globalData.redirectRoute || '/pages/home/index';
    if (utils.isTabPages(redirectUrl)) {
      wx.switchTab({
        url: redirectUrl,
      })
    } else {
      wx.redirectTo({
        url: redirectUrl
      })
    }
  },

  //全局登录成功后回调方法(一般用于index页登录后同步执行)
  globalLoginedCallBack(){

  },

  //plugins注册
  WxValidate: (rules, messages) => new WxValidate(rules, messages),
  HttpResource: (url, paramDefaults, actions, options) => new HttpResource(url, paramDefaults, actions, options).init(),
  HttpService: new HttpService({
    baseURL: __config.API_BASE
  }),
  WxService: new WxService,
  utils,
  __config,
  __constant,
  __permissions
})