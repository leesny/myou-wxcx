import __config from '../config/config'
import HttpService from './HttpService'
import WxRequest from '../static/plugins/wx-request/lib/index'
import WxService from '../static/plugins/wx-service/WxService'
import Utils from '../utils/util'

class HttpCallService extends HttpService {
  constructor(options) {
    super(options)
    this.$$prefix = ''
    this.$$path = {
      wechatSignUp: '/user/wechat/sign/up',
      wechatSignIn: '/user/wechat/sign/in',
      decryptData: '/user/wechat/decrypt/data'
    };
    this.interceptors.use({
      request(request) {
        request.header = request.header || {}
        request.header['content-type'] = __config.reqContentType || 'application/json'
        if (request.url.indexOf('/api') !== -1 && wx.getStorageSync('token')) {
          request.header.Authorization = 'Bearer ' + wx.getStorageSync('token')
        }
        wx.showLoading({
          title: '加载中',
        })
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
    })

    this.wxService = new WxService();
  }

  //前后端交互接口
  jsonCall({ fn, params = [], fullresult = true }) {
    let wxService = this.wxService,
      userAttrId = wxService.getStorageSync('userAttrId'),
      signFlag = wxService.getStorageSync('signFlag'),
      signKey = wxService.getStorageSync('signKey');

    // 参数校验
    if (!Utils.checkParams({ fn, params, fullresult })) {
      return;
    };

    //获取签名KEY,再调用
    if (!userAttrId || signFlag === null || (signFlag && !signKey)) {
      return this.getSignKey().then(() => {
        return this.invokeRequest({ fn, params, fullresult })
      });

      //无需签名,直接调用
    } else {
      return this.invokeRequest({ fn, params, fullresult });
    }
  }

  //Invoke调用
  invokeRequest({ fn, params = [], fullresult = true }) {
    let wxService = this.wxService,
      userAttrId = wxService.getStorageSync('userAttrId'),
      signFlag = wxService.getStorageSync('signFlag'),
      signKey = wxService.getStorageSync('signKey');

    // 打包数据
    let data = {
      p0: fn,
      p1: JSON.stringify(params),
      userAttrId: userAttrId,
      fullresult: fullresult
    };

    // API签名
    if (signFlag) {
      data.sign = Utils.doSign(signKey, data);
    }

    // 发起请求
    return this.postRequest("/", {
      data: data
    })
  }

  getSignKey() {
    let wxService = this.wxService,
      userAttrId = wxService.getStorageSync('userAttrId');
    return this.getRequest(__config.signKeyPah, {
      data: {
        userAttrId: userAttrId,
        p0: ""
      }
    }).then(result => {
      if (result && result.statusCode == 200 && result.data) {
        let userAttrId = result.data.userAttrId;
        let signFlag = result.data.target && result.data.target.target && result.data.target.target.signFlag;
        let signKey = result.data.target && result.data.target.target && result.data.target.target.signKey;

        wxService.setStorageSync('signKey', signKey);
        wxService.setStorageSync('signFlag', signFlag);
        wxService.setStorageSync('userAttrId', userAttrId);
      }
    });
  }
}

export default HttpCallService