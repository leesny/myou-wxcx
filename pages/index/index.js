//图片预加载组件
const ImgLoader = require('../templates/img-loader/img-loader.js')

const App = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [], //轮播图
    navBars: [], //分类列表
    newsList: [], //消息列表
    productsList: [], //商品列表
    interval: 3000,
    duration: 800,
    indicatorcolor: '#fff',
    indicatoractivecolor: '#E60012',
    imgBasePath: App.__config.imgPath,
    opeartionList: [{
      value: '1',
      imagePath: '/static/images/icon/home_sign_in@3x.png',
      linkName: '每日签到'
    }, {
      value: '2',
      imagePath: "../../static/images/icon/home_open_store@3x.png",
      linkName: '我要开店'
    }, {
      value: '3',
      imagePath: "../../static/images/icon/home_integral@3x.png",
      linkName: '积分商城'
    }, {
      value: '4',
      imagePath: "../../static/images/icon/home_offline_activities@3x.png",
      linkName: '线下活动'
    }] //操作
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var navBars = [];
    var newsList = [];
    var productsList = [];

    //初始化图片预加载组件
    this.imgLoader = new ImgLoader(this);

    //加载页面数据
    this.getStorePart().then(res => {
      let banners = res[0] && res[0].subs;
      this.loadBannerImgs(banners);
    }).then(() => {
      return this.getStoreMallCate();
    }).then(res => {
      navBars = res;
      return this.getStoreMessages();
    }).then(res => {
      newsList = res;
      return this.getStoreGoodsItemBySort();
    }).then(res => {
      productsList = res;

      this.setData({
        navBars: navBars,
        newsList: newsList,
        productsList: productsList
      });
    });
  },

  //banner图片加载处理
  loadBannerImgs: function(banners) {
    if (!banners || !banners.length) {
      return;
    }

    //缩略图
    let imgUrlThums = banners.map(function(item) {
      return {
        url: App.__config.imgPath + item.imagePath.imagePrefix + '-50-20' + item.imagePath.imageSuffix,
        loaded: false
      };
    });

    //原图
    let imgUrlOrgis = banners.map(function(item) {
      return {
        url: App.__config.imgPath + item.imagePath.imagePath,
        loaded: false
      };
    });

    //先加载缩略图
    this.setData({ imgUrls: imgUrlThums })

    //同时对原图进行预加载，加载成功后再替换
    imgUrlOrgis.forEach((item, index) => {
      this.imgLoader.load(item.url, (err, data) => {
        if (!err) {
          let dataKey = 'imgUrls[' + index + ']';
          this.setData({
            [dataKey]: {
              url: data.src,
              loaded: true
            }
          });
        }
      })
    });
  },

  // 获取顶部轮播图
  getStorePart: function() {
    return App.HttpCallService.jsonCall({
      fn: 'mallsale.storeHandler.getStorePart',
      params: ["10025", 2, 4],
    }).then(res => {
      if (res && res.data && res.data.success && res.data.target && res.data.target.success) {
        const data = res.data.target.target;
        return Promise.resolve(data);
      }
    })
  },
  // 获取分类
  getStoreMallCate: function() {
    return App.HttpCallService.jsonCall({
      fn: 'mallsale.storeHandler.getStoreMallCate',
      params: ["10025", 0, 4],
    }).then(res => {
      if (res && res.data && res.data.success && res.data.target && res.data.target.success) {
        const data = res.data.target.target;
        return Promise.resolve(data);
      }
    })
  },

  //获取消息列表
  getStoreMessages: function() {
    return App.HttpCallService.jsonCall({
      fn: 'mallsale.messageHandler.getStoreMessages',
      params: ["10025", 1, 4],
    }).then(res => {
      if (res && res.data && res.data.success && res.data.target && res.data.target.success) {
        const data = res.data.target.target;
        return Promise.resolve(data);
      }
    })
  },

  //获取商品列表
  getStoreGoodsItemBySort: function() {
    return App.HttpCallService.jsonCall({
      fn: 'mallsale.goodsHandler.getStoreGoodsItemBySort',
      params: ["10025", 0],
    }).then(res => {
      if (res && res.data && res.data.success && res.data.target && res.data.target.success) {
        const data = res.data.target.target;
        return Promise.resolve(data);
      }
    })
  },



  methods: {}
})