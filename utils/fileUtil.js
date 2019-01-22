import pubUtil from './pubUtil.js';
import wxUtil from './wxUtil.js';

/**
 * 文件下载、预览工具方法
 */
const fileUtils = {
  //获取文件类型;
  getFileTypeClassName(type) {
    var fileType = {};
    fileType['pdf'] = 'pdf';
    fileType['zip'] = 'zip';
    fileType['7z'] = 'zip';
    fileType['rar'] = 'rar';
    fileType['csv'] = 'csv';
    fileType['doc'] = 'doc';
    fileType['docx'] = 'docx';
    fileType['xls'] = 'xls';
    fileType['xlsx'] = 'xls';
    fileType['txt'] = 'txt';
    fileType['ppt'] = 'ppt';
    fileType['pptx'] = 'ppt';
    fileType['mp3'] = 'mp3';
    fileType['mp4'] = 'mp3';
    fileType['avi'] = 'avi';
    fileType = fileType[type] || 'image';
    return fileType;
  },

  /**
   * 文件预览
   *   @param String path    当前预览的文件路径
   *   @param Array  allPaths 当前附件列表中的所有文件路径
   */
  previewFile(path, allPaths) {
    if (!path) {
      wxUtil.showErrorToast({ title: '未找到文件！' })
      return;
    }

    //路径补全
    path = pubUtil.renderFilePath(path);

    //文件后缀名
    let fileType = path.split(".").pop();
    let fileTypeName = this.getFileTypeClassName(fileType);

    //小程序目前支持的文件类型
    if (!['doc', 'xls', 'ppt', 'pdf', 'docx', 'xlsx', 'pptx','image'].includes(fileTypeName)){
      wx.showModal({
        title: '预览提示',
        content: '抱歉，小程序不支持预览该类型文件！',
      });

      return;
    }

    let currImgUrls = [];
    allPaths && allPaths.forEach(item => {
      //防止路径不全，补齐路径
      let curr = pubUtil.renderFilePath(item);
      if(pubUtil.isImage(curr)){
        currImgUrls.push(curr);
      };
    });

    wx.showLoading({
      title: '正在打开...',
    });

    //图片预览
    if (fileTypeName == 'image') {
      if (!currImgUrls || !currImgUrls.length) {
        currImgUrls = [path];
      }
      wx.previewImage({
        current: path, // 当前显示图片的http链接
        urls: currImgUrls, // 需要预览的图片http链接列表
        complete: function () {
          wx.hideLoading();
        }
      })

      return;
    }
    //文件预览
    wx.downloadFile({
      url: path,
      success: function (res) {
        var tmpPath = res.tempFilePath
        wx.openDocument({
          filePath: tmpPath,
          success: function (res) {
            console.log('打开文档成功')
          }
        })
      },
      fail: function (res) {
        wx.showModal({
          title: '下载失败',
          content: JSON.stringify(res),
        })
      },
      complete: function (e) {
        wx.hideLoading();
      }
    })
  },

  /**
   * 下载保存一个文件
   */
  downloadSaveFile(url, success, fail) {
    let that = this;
    console.log('url >>>>', url);
    wx.downloadFile({
      url: url.toString(),
      success: function (res) {
        wx.saveFile({
          tempFilePath: res.tempFilePath,
          success: function (result) {
            if (success) {
              success(result);
            }
          },
          fail: function (e) {
            if (fail) {
              fail(e);
            }
          }
        })

      },
      fail: function (e) {
        if (fail) {
          fail(e);
        }
      }
    })
  },

  /**
   * 多文件下载并且保存，必须所有文件下载成功才算返回成功
   */
  downloadSaveFiles(urls, success, fail) {
    let that = this;

    let savedFilePaths = [];
    let urlsLength = urls.length;
    console.log(urls[0], typeof urls[0]);

    for (let i = 0; i < urlsLength; i++) {
      that.downloadSaveFile(urls[i].toString(),
        function (res) {
          //一个文件下载保存成功
          let savedFilePath = res.savedFilePath;
          savedFilePaths.push(savedFilePath);
          console.info("savedFilePath:%s", savedFilePath);
          if (savedFilePaths.length == urlsLength) { //如果所有的url 才算成功
            if (success) {
              success(savedFilePaths)
            }
          }
        },
        function (e) {
          console.info("下载失败");
          if (fail) {
            fail(e);
          }
        }
      )
    }
  },

  /**
   * 文件上传，返回文件数组
   */
  upLoadFiles() {
    let targetFiles = [];
    return App.WxService.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
    }).then(res => {
      wx.showLoading({
        title: '正在上传···',
      })

      let tempFiles = res.tempFilePaths;

      let uploadLoops = [];
      let doUpload = function (item) {
        return App.WxService.uploadFile({
          url: App.__config.FILE_UPLOAD_URL, //文件上传地址
          filePath: item,
          name: 'file',
          formData: {
            'token': App.WxService.getStorageSync('token')
          },
        }).then((res, index) => {
          let file = JSON.parse(res.data).data[0]
          file.imagePath = App.utils.renderFilePath(file.filePath);
          file.fileType = App.utils.renderFileType(file.fileName);
          file.isImage = App.utils.isImage(file.fileName);
          targetFiles.push(file)
        })
      };

      tempFiles.forEach(item => {
        uploadLoops.push(doUpload(item));
      });

      // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
      return Promise.all(uploadLoops).then(() => {
        wx.hideLoading()
        return targetFiles;
      }).catch(e => {
        wx.hideLoading()
      })
    });
  }
};

module.exports = fileUtils;