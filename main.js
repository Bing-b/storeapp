
// #ifndef VUE3
import Vue from 'vue'
import App from './App'
import { $http } from '@escook/request-miniprogram' // 网络请求包，支持axios
import store from 'store/store.js'



Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App,
	store
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


$http.beforeRequest = function (options) {
	uni.showLoading({
		title: '数据加载中...'
	})
	 // 判断请求的是否为有权限的 API 接口
	if(options.url.indexOf('/my/') !== -1) {
		// 为请求头添加身份认证字段
		options.header = {
			Authorization: store.state.m_user.token
		}
	}
}

$http.afterRequest = function() {
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