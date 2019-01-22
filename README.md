# 微信小程序

## 项目说明：

- 基于微信小程序原生开发的一款在线应用，集成了微信团队提供的一些脚手架工具方法等

## 目录结构：

```
sharetable-wxcx/
  |
  |-config/                     # 配置文件
  |   |- config.js                 # 基本配置
  |   |- constant.js               # 静态值定义
  |   |- ... 
  |-static/                     # 静态文件
  |   |- images/                   # 图片
  |   |- plugins/                  # 插件
  |   |- styles/                   # 样式
  |   |- ...
  |-services/                   # 服务类
  |   |- HttpResource.js           # 资源请求封装
  |   |- HttpService.js            # API请求封装
  |   |- modules                   # 业务模块公共逻辑
  |        |- ...   
  |-utils                       # 工具类
  |   |- index.js                   # 聚合所有工具
  |   |- pubUtil.js                 # 公共工具方法 
  |   |- wxUtil.js                  # 微信相关工具方法
  |-components                  # 自定义组件
  |   |- templates                 # 公共模板  
  |   |- ...                       # 组件A ...
  |  
  |-pages/                      # 小程序页面（模块）
  |    |
  |    |- start                     # 启动页（欢迎、广告）
  |    |- index                     # 首页
  |    |- user                      # 我的
  |    |- auth                      # 账号授权
  |    |- address                   # 地址
  |    |- article                   # 文章
  |    |- help                      # 帮助中心                    
  |    |- ...                       # 业务模块
  |
  |-app.js                      # 小程序逻辑
  |-app.json                    # 小程序公共设置
  |-app.wxss                    # 小程序公共样式表
  |-...
```

