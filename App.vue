<script>
	export default {
		onLaunch: function() {
			let that=this;
			uni.addInterceptor('navigateTo', {//监听跳转
				success(e) {
					that.watchRouter();
				}
			})
			uni.addInterceptor('redirectTo', {//监听关闭本页面跳转
				success(e) {
					that.watchRouter();
				}
			})
		},
		onShow: function() {
			//console.log('App Show')
		},
		onHide: function() {
			//console.log('App Hide')
		},
		methods: {
			watchRouter() {
				console.log('路由跳转')
			}
		}
	}
	
</script>

<style lang="scss">
	/*每个页面公共css */
	// @import '@/uni_modules/uni-scss/index.scss';
	// /* #ifndef APP-NVUE */
	// @import '@/static/customicons.css';

	// 设置整个项目的背景色
	page {
		background-color: #f5f5f5;
	}

	/* #endif */
	.example-info {
		font-size: 14px;
		color: #333;
		padding: 10px;
	}
</style>
