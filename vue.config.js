const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  productionSourceMap:false,
  publicPath: process.env.NODE_ENV === 'production'
    ? '/ToolForBilibili/'
    : '/',
  devServer: {
    proxy: {  //配置跨域
      '/api': {
        target: 'https://api.bilibili.com/',
        changOrigin: true, 
        secure: true,
        ws: true,
        pathRewrite: {
          '^/api': ''
        }
      },
    }
  },
  css: {
    // css预设器配置项
    loaderOptions: {
      sass: {
        additionalData: `@import '~@/style/mixin.scss';`
      }
    },
  },
})
