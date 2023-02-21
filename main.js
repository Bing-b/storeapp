
// #ifndef VUE3
import Vue from 'vue'
import App from './App'
import { $http } from '@escook/request-miniprogram' // 网络请求包，支持axios




Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import App from './App.vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif


uni.$http = $http
$http.baseUrl = 'https://api-ugo-web.itheima.net'

	uni.showLoading({
		title: '数据加载中...'
	})
$http.beforeRequest = function (options) {
	uni.hideLoading()
}

// 封装 uni.$showMsg() 方法
uni.$showMsg = function (title = '数据加载失败！', duration = 1500) {
	uni.showToast({
		title,
		duration,
		icon: 'none'
	})
}