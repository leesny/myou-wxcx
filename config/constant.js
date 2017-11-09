import config from './config'

export default {
  //项目相关
  appName:"跨境电商",
  appLogo:"/static/images/default/app_logo_2x.png",

  //资源请求地址
  imgPath: config.imgPath,

  errorMsg: {
    "AccessPermissionDeny": '服务请求被拒绝，检查是否未登陆！',
    "InvalidSign": '鉴权失败，服务请求被拒绝！',
    "java.lang.IllegalStateException": '服务请求失败，请稍后再试！',
    "RuntimeException": '服务请求失败，请稍后再试！',
    "IllegalStateException": '服务请求失败，请稍后再试！',
    "InvalidService": '服务请求失败，请稍后再试！',
    "NoExporterException": '服务请求失败，请稍后再试！',
  }
}