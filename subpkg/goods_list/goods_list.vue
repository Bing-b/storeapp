<template>
	<view>
		<view class="good-list">
			<view v-for="(goods, i) in goodsList" :key="i" @click="gotoDetail(goods)">
				<my-goods :goods="goods"></my-goods>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				queryObj: {
					query: '', // 查询关键词
					cid: '', // 商品分类id
					pagenum: 1,
					pagesize: 10
				},
				goodsList: [],
				total: 0,
				isLoading: false,  // 节流阀
				defaultPic: 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png',
				
			};
		},
		onLoad(options) {
			this.queryObj.query = options.query || ''
			this.queryObj.cid = options.cid || ''
			
			this.getGoodsList()
		},
		methods: {
			async getGoodsList(cb) {
				this.isLoading = true
				const { data: res } = await uni.$http.get('/api/public/v1/goods/search', this.query)
				this.isLoading = false
				
				// 只要数据请求完毕，就立即按需调用 cb 回调函数
				cb && cb()
				if(res.meta.status !== 200 ) return uni.$showMsg()
				this.goodsList = [...this.goodsList,...res.message.goods]
				this.total = res.message.total
			},
			gotoDetail(goods) {
				uni.navigateTo({
					url:'/subpkg/goods_detail/goods_detail?goods_id=' + goods.goods_id
				})
			}
		},
		// 触底事件监听
		onReachBottom() {
			// 判断是否还有下一页数据
			if(this.queryObj.pagenum * this.queryObj.pagesize >= this.total) return uni.$showMsg('数据加载完毕！')
			// 判断是否正在请求其它数据，如果是，则不发起额外的请求
			if(this.isLoading) return
			this.queryObj.pagenum += 1  
			this.getGoodsList()
		},
		// 下拉刷新的事件
		onPullDownRefresh() {
			// 重置关键数据
			this.queryObj.pagenum = 1
			this.total = 0
			this.isloading = false
			this.goodsList = []
			
			// 重新发起请求
			this.getGoodsList(() => uni.stopPullDownRefresh())
		}
		
	}
</script>

<style lang="scss">
.goods-item {
  display: flex;
  padding: 10px 5px;
  border-bottom: 1px solid #f0f0f0;

  .goods-item-left {
    margin-right: 5px;

    .goods-pic {
      width: 100px;
      height: 100px;
      display: block;
    }
  }

  .goods-item-right {
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .goods-name {
      font-size: 13px;
    }

    .goods-price {
      font-size: 16px;
      color: #c00000;
    }
  }
}

</style>
