// 服务器环境集线
const apiHub = {
  //开发环境
  dev: {
    // API_BASE:'https://leetia.com/oa',
    // FILE_UPLOAD_URL:'https://leetia.com/oa/upload',
    // FILE_DOWNLOAD_URL:'https://leetia.com/oa/dlfile',

    API_BASE: '',
    FILE_UPLOAD_URL: 'http://oatest.sw.com.cn/oa/upload',
    FILE_DOWNLOAD_URL: 'http://oatest.sw.com.cn/oa/dlfile',
    OSS_CONFIG:{
      ACCESSID: '',
      ACCESSKEY: ''
    }
  },

  //测试环境
  test: {
    API_BASE: 'https://sw.oneplacelife.com/oa',
    FILE_UPLOAD_URL: 'https://sw.oneplacelife.com/oa/upload',
    FILE_DOWNLOAD_URL: 'https://sw.oneplacelife.com/oa/dlfile',

    OSS_CONFIG: {
      ACCESSID: '',
      ACCESSKEY: ''
    }
  },

  //生产环境
  prod: {
    API_BASE: 'https://oa.sw.com.cn/oa',
    FILE_UPLOAD_URL: 'https://oa.sw.com.cn/oa/upload',
    FILE_DOWNLOAD_URL: 'https://oa.sw.com.cn/oa/dlfile',

    OSS_CONFIG: {
      ACCESSID: '',
      ACCESSKEY: ''
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
