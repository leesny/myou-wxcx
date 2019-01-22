import __config from '../config/config'
import utils from '../utils/index'
import WxRequest from '../static/plugins/wx-request/lib/index'
let showError = true;
let showLoading = false;

class HttpService extends WxRequest {
  constructor(options) {
    super(options)
    this.$$prefix = ''
    this.$$path = {};
    this.interceptors.use({
      request(request) {
        console.log('request >>>', request);
        request.header = request.header || {}
        request.header['content-type'] = __config.reqContentType || 'application/json';
        console.log('HttpService request url >>> ', request.url);

        if (request.url.indexOf('/oa') !== -1) {
          let token = wx.getStorageSync("token");
          console.log('token>>>>', token);
          token && (request.header.token = wx.getStorageSync('token'));
        }

        if (request.showLoading) {
          wx.showLoading({
            title: '加载中',
          });
        }

        showError = Boolean(request.showError);
        showLoading = Boolean(request.showLoading);

        return request
      },
      requestError(requestError) {
        if (showLoading) {
          wx.hideLoading();
        }

        return Promise.reject(requestError)
      },
      response(response) {
        if (showLoading) {
          wx.hideLoading();
        }

        console.log('HttpService response >>> ', response);
        if (response.statusCode == 200 && response.data && response.data.code === 0) {
          return response.data;
        }

        if (response.statusCode === 401 || !response.data || response.data.code != 0) {
          //业务错误处理
          let code = response.data.code;
          let errMsg = response.data.message || "请求出错了";
          switch (parseInt(code)) {
            case 1:
              wx.removeStorageSync("token");

              //记录最后一次访问的页面
              let lastPageUrl = utils.getCurrentPageUrlWithArgs();   
              if (showError) {
                // 弹窗提示单例，防止多次重复提示
                showError = false;
   
                wx.showModal({
                  title: '哎呦……',
                  content: '您登录已失效，请重新登录！',
                  showCancel: true,
                  success: function (res) {
                    showError = false;

                    if (res.confirm) {
                      wx.redirectTo({
                        url: '/pages/auth/bind/index?redirect=' + encodeURIComponent(lastPageUrl),
                      })

                    } else if (res.cancel) {
                      wx.hideNavigationBarLoading() //完成导航加载
                    }
                  },
                })
              }   
              break;
            case 2:
              showError && wx.showModal({
                content: errMsg,
                showCancel: false,
                success: function (res) {
                  if (res.confirm) {}
                }
              });
              break;
            case -1:
            case 3:
              showError && wx.showModal({
                content: errMsg,
                showCancel: false,
                success: function (res) {
                  if (res.confirm) {}
                }
              });

              break;
            default:
              showError && wx.showModal({
                content: errMsg,
                showCancel: false,
                success: function (res) {
                  if (res.confirm) { }
                }
              });

              break;
          }

          return Promise.reject(response);
        }

        return response
      },
      responseError(responseError) {
        if (__config.showGlobalLoading) {
          wx.hideLoading()
        }

        let message = utils.getRequestErrorMessage(responseError);
        console.log('HttpService message >>>', message);
        showLoading && wx.showModal({
          title: '提示',
          content: message,
        });

        return Promise.reject(responseError)
      },
    })
  }
}

export default HttpService