const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  productionSourceMap:false,
  chainWebpack: config => {
    config.module
      .rule("i18n")
      .resourceQuery(/blockType=i18n/)
      .type('javascript/auto')
      .use("i18n")
        .loader("@kazupon/vue-i18n-loader")
        .end();
  },
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
