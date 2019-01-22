// 服务器环境集线
const apiHub = {
  //开发环境
  dev: {
    // API_BASE:'https://leetia.com/oa',
    // FILE_UPLOAD_URL:'https://leetia.com/oa/upload',
    // FILE_DOWNLOAD_URL:'https://leetia.com/oa/dlfile',

    API_BASE: 'http://oatest.simpleway.com.cn/oa',
    FILE_UPLOAD_URL: 'http://oatest.simpleway.com.cn/oa/upload',
    FILE_DOWNLOAD_URL: 'http://oatest.simpleway.com.cn/oa/dlfile',
    OSS_CONFIG:{
      ACCESSID: 'LTAIwtIcT7dIRKmC',
      ACCESSKEY: 'f1FIBfId6ASqKmLuioQ4wMlFV5876T1'
    }
  },

  //测试环境
  test: {
    API_BASE: 'https://sharetable.oneplacelife.com/oa',
    FILE_UPLOAD_URL: 'https://sharetable.oneplacelife.com/oa/upload',
    FILE_DOWNLOAD_URL: 'https://sharetable.oneplacelife.com/oa/dlfile',

    OSS_CONFIG: {
      ACCESSID: 'LTAIwtIcT7dIRKmC',
      ACCESSKEY: 'f1FIBfId6ASqKmLuioQ4wMlFV5876T1'
    }
  },

  //生产环境
  prod: {
    API_BASE: 'https://oa.simpleway.com.cn/oa',
    FILE_UPLOAD_URL: 'https://oa.simpleway.com.cn/oa/upload',
    FILE_DOWNLOAD_URL: 'https://oa.simpleway.com.cn/oa/dlfile',

    OSS_CONFIG: {
      ACCESSID: 'LTAIwtIcT7dIRKmC',
      ACCESSKEY: 'f1FIBfId6ASqKmLuioQ4wMlFV5876T1'
    }
  }
}

// 手动切换环境服务地址
const ENV = "dev";

// 导出配置
export default {
  ENV:ENV,
  ...apiHub[ENV],
  reqContentType: 'application/json', // 'application/json' 或者 'application/x-www-form-urlencoded'
  showGlobalLoading: false, //开启全局loading,会每调用一次接口都执行loading
}