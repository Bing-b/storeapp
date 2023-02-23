<template>
	<view>
		<view class="search-box">
			<!-- 使用 uni-ui 提供的搜索组件 -->
			<uni-search-bar @input="input" :radius="100" cancelButton="none" :focus="true"></uni-search-bar>
		</view>
		<!-- 搜索建议列表 -->
		<view class="sugg-list" v-if="searchResults.length !== 0">
			<view class="sugg-item" v-for="(item,i) in searchResults" :key="i" @click="gotoDetail(item.goods_id)">
				<view class="goods-name">
					{{ item.goods_name}}
				</view>
				<uni-icons type="arrowright" size="16"></uni-icons>
			</view>
		</view>
		<!-- 搜索历史 -->
		<view class="history-box" v-else>
			<view class="history-title">
				<text>搜索历史</text>
				<!-- 清空 -->
				<uni-icons type="trash" size="17" @click="clearHistory"></uni-icons>
			</view>
			<view class="history-list">
				<uni-tag :inverted="true" type="error" :text="item" v-for="(item,i) in historys" :key="i"
				@click="gotoGoodsList(item)"></uni-tag>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				timer: null, // 防抖延时器
				kw: '' ,// 搜索关键词
				searchResults: [] ,// 搜索结果列表
				historyList: ['apple','huawei','xiaomi']
			};
		},
		onLoad() {
			this.historyList = JSON.parse(uni.getStorageSync('kw') || '[]')
		},
		computed: {
			historys() {
				// 注意：由于数组是引用类型，所以不要直接基于原数组调用 reverse 方法，以免修改原数组中元素的顺序
				// 而是应该新建一个内存无关的数组，再进行 reverse 反转
				return [...this.historyList].reverse()
			}
		},
		methods: {
			input(e) {
				console.log(e)
				clearTimeout(this.timer)
				this.timer = setTimeout(() => {
					this.kw = e.trim()
					console.log(this.kw)
					this.getSearchList()
				},500)
			},
			async getSearchList() {
				const { data: res } = await uni.$http.get('/api/public/v1/goods/qsearch', {query: this.kw})
				if(res.meta.status !== 200) return uni.$showMsg()
				this.searchResults = res.message
				// 1. 查询到搜索建议之后，调用 saveSearchHistory() 方法保存搜索关键词
				this.saveSerachHistory()
			},
			gotoDetail(goods_id) {
				uni.navigateTo({
					// 指定详情页面的 URL 地址，并传递 goods_id 参数
					url:'/subpkg/goods_detail/goods_detail?goods_id=' + goods_id
				})
			},
			saveSerachHistory() {
				// 搜索关键词去重
				this.historyList = [...new Set([this.kw, ...this.historyList])]
				uni.setStorageSync('KW',JSON.stringify(this.historyList))
			},
			clearHistory() {
				this.historyList = []
				uni.setStorageSync('kw','[]')
			},
			// 点击跳转到商品列表页面
			gotoGoodsList(kw) {
			  uni.navigateTo({
			    url: '/subpkg/goods_list/goods_list?query=' + kw
			  })
			}

		}
	}
</script>

<style lang="scss">
.search-box {
	position: sticky;
	top: 0;
	z-index: 999;
}
.sugg-list {
	padding: 0 5px;
	.sugg-item {
		font-size: 12px;
		padding: 13px 0;
		border-bottom: 1px solid #efefef;
		display: flex;
		align-items: center;
		justify-content: space-between;
		.goods-name {
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			margin-right: 3px;
		}
	}
}
.history-box {
  padding: 0 5px;

  .history-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px;
    font-size: 13px;
    border-bottom: 1px solid #efefef;
  }

  .history-list {
    display: flex;
    flex-wrap: wrap;

    .uni-tag {
      margin-top: 5px;
      margin-right: 5px;
    }
  }
}

</style>
