import __config from '../config/config'
import utils from '../utils/index'
import WxResource from '../static/plugins/wx-resource/lib/index'
let showError = true;
let showLoading = false;
let App = getApp();

class HttpResource {
  constructor(url, paramDefaults, actions, options) {
    Object.assign(this, {
      url,
      paramDefaults,
      actions,
      options,
    })
  }

  /**
   * 返回实例对象
   */
  init() {
    const resource = new WxResource(this.setUrl(this.url), this.paramDefaults, this.actions, this.options)
    resource.interceptors.use(this.setInterceptors())
    return resource
  }

  /**
   * 设置请求路径
   */
  setUrl(url) {
    if (url.indexOf('http') !== -1) return url;
    return `${__config.API_BASE}${url}`
  }

  /**
   * 拦截器
   */
  setInterceptors() {
    return {
      request(request) {
        request.header = request.header || {}
        request.header['content-type'] = __config.reqContentType || 'application/json';
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

        showLoading = request.showLoading;
        showError = request.showError;

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
              //记录最后一次访问的页面
              let lastPageUrl = utils.getCurrentPageUrlWithArgs();
              if (showError) {
                // 弹窗提示单例，防止多次重复提示
                wx.showModal({
                  title: '哎呦……',
                  content: '您登录已失效，请重新登录！',
                  showCancel: true,
                  success: function (res) {
                    modalOpened = false;
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
                  if (res.confirm) { }
                }
              });

              //跳转到未授权提示页面
              // wx.navigateTo({
              //   url: '/auth/noauth',
              // });
              break;
            case -1:
            case 3:
              showError && wx.showModal({
                content: errMsg,
                showCancel: false,
                success: function (res) {
                  if (res.confirm) { }
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
        if (showLoading) {
          wx.hideLoading()
        }

        let message = utils.getRequestErrorMessage(responseError);
        showError && wx.showModal({
          title: '提示',
          content: message,
        });
        return Promise.reject(responseError)
      },
    }
  }
}

export default HttpResource