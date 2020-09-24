// ajax请求
// 比如: 安装axios
// PS C:\ziliao\003_vue\18_单文件组件\vuetest> cnpm install save --axios
// https://cli.vuejs.org/zh/config/#devserver-proxy 网站参考
// vue.config.js 配置代理
// 组件中调用 比如 src\views\About.vue

// 也可以引入vue路由来解决

module.exports = {
  devServer: {
    proxy: {
      //  /api可以改为*代表所有请求 ，拦截关键字，<url>,
      '/api': {
        // 代理到哪个地址
        target: 'http://localhost:88',
        // ws: true,
        // 是否跨域
        changeOrigin: true,
        logLevel: 'debug'
        // pathRewrite: {
        //   '^/api': ''
        // }
      }
    }
  }
}
