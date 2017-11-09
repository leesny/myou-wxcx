import __config from '../config/config'
import WxResource from '../static/plugins/wx-resource/lib/index'

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
    console.log('init....', url, paramDefaults, actions, options);
    const resource = new WxResource(this.setUrl(this.url), this.paramDefaults, this.actions, this.options)
    resource.interceptors.use(this.setInterceptors())
    return resource
  }

  /**
   * 设置请求路径
   */
  setUrl(url) {
    if (url.indexOf('http') !== -1) return url;
    return `${__config.basePath}${url}`
  }

  /**
   * 拦截器
   */
  setInterceptors() {
    return {
      request(request) {
        request.header = request.header || {}
        request.header['content-type'] = __config.reqContentType || 'application/json';
        if (request.url.indexOf('/api') !== -1 && wx.getStorageSync('token')) {
          request.header.Authorization = 'Bearer ' + wx.getStorageSync('token')
        }
        wx.showLoading({
          title: '加载中',
        })

        console.log('>>>>>>>>>>>request', request);
        return request
      },
      requestError(requestError) {
        wx.hideLoading()
        return Promise.reject(requestError)
      },
      response(response) {
        wx.hideLoading()
        if (response.statusCode === 401) {
          wx.removeStorageSync('token')
          wx.redirectTo({
            url: '/pages/login/index'
          })
        }
        return response
      },
      responseError(responseError) {
        wx.hideLoading()
        return Promise.reject(responseError)
      },
    }
  }
}

export default HttpResource