// 服务器环境集线
const apiHub = {
  //开发环境
  dev: {
    HOST_IP: 'http://test.simpleway.com.cn',
    CALL_PATH: '/cbmall-call',
    INVOKE_PATH: '/jsoncall/directCall/invoke',
    CONTEXT_PATH: '/'
  },

  //测试环境
  test: {
    HOST_IP: 'http://test.simpleway.com.cn',
    CALL_PATH: '/cbmall-call',
    INVOKE_PATH: '/jsoncall/directCall/invoke',
    CONTEXT_PATH: '/'
  },

  //生产环境
  prod: {
    HOST_IP: 'http://test.simpleway.com.cn',
    CALL_PATH: '/cbmall-call',
    INVOKE_PATH: '/jsoncall/directCall/invoke',
    CONTEXT_PATH: '/'
  }
}

// 手动切换环境服务地址
const ENV = "dev";

// 导出配置
export default {
  //json 或 form-urlencoded
  reqContentType: 'application/x-www-form-urlencoded', //application/json

  basePath: apiHub[ENV]['HOST_IP'] + apiHub[ENV]['CALL_PATH'] + apiHub[ENV]['INVOKE_PATH'],
  signKeyPah: apiHub[ENV]['HOST_IP'] + apiHub[ENV]['CALL_PATH'] + "/jsoncall/loginCall/getLoginToken",
  loginPath: apiHub[ENV]['HOST_IP'] + apiHub[ENV]['CALL_PATH'] + "/jsoncall/loginCall/login",
  logoutPah: apiHub[ENV]['HOST_IP'] + apiHub[ENV]['CALL_PATH'] + "/jsoncall/loginCall/logout",
  uploadPath: apiHub[ENV]['HOST_IP'] + apiHub[ENV]['CALL_PATH'] + "/f-ul",
  imgPath: apiHub[ENV]['HOST_IP'] + apiHub[ENV]['CALL_PATH'] + '/',
  domain: apiHub[ENV]['HOST_IP']
}