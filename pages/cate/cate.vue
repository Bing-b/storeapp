<template>
	<view>
		<!-- 使用自定义的搜索组件 -->
		<my-search @click='gotoSearch'></my-search>
		<view class="scroll-view-container">
			<!-- 左侧滚动视图区域 -->
			<scroll-view class="left-scroll-view" scroll-y :style="{height: wh + 'px'}">
				<block v-for="(item, i) in cateList" :key="i">
					<view :class="['left-scroll-view-item', i === active ? 'active' : '']"
					@click="activeChange(i)"
					>{{ item.cat_name}}</view>
				</block>
			</scroll-view> 
			<!-- 右侧滚动视图区域 -->
			<scroll-view class="right-scroll-view" scroll-y :scroll-top="scrollTop" :style="{height: wh + 'px'}">
				 <view class="cate-lv2" v-for="(item2, i2) in cateLevel2" :key="i2">
				    <view class="cate-lv2-title">/ {{item2.cat_name}} /</view>
					 <view class="cate-lv3-list">
					      <!-- 三级分类 Item 项 -->
					      <view class="cate-lv3-item" v-for="(item3, i3) in item2.children" 
						  :key="i3" @click="gotoGoodsList(item3)">
					        <!-- 图片 -->
					        <image :src="defaultPic"></image>
					        <!-- 文本 -->
					        <text>{{item3.cat_name}}</text>
					      </view>
					    </view>
				  </view>
			</scroll-view> 
		</view>
	</view>
</template>

<script>
	// 引入mixin 模块
	import badgeMix from '@/mixins/tabbar-badge.js'
	import { mapGetters } from 'vuex'
	export default {
		mixins: [badgeMix],
		data() {
			return {
				scrollTop: 0, // 滚动条距离顶部的距离
				wh: 0,  // 窗口的可用高度 = 屏幕高度 - navigationBar高度 - tabBar 高度
				cateList: [], // 分类数据列表
				active: 0,  // 当前选中项的索引，默认让第一项被选中
				cateLevel2: [],// 二级分类列表
				defaultPic: 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png'
			};
		},
		onLoad() {
			const sysInfo = uni.getSystemInfoSync() // 获取当前系统的信息
			this.wh = sysInfo.windowHeight - 50  // 可用高度 = 屏幕高度 - navigationBar高度 - tabBar高度 - 自定义的search组件高度
			
			this.getCateList() 
		},
		computed: {
		    // 将 m_cart 模块中的 total 映射为当前页面的计算属性
		    ...mapGetters('m_cart', ['total']),
		},
		methods: {
			async getCateList() {
				const { data: res } = await uni.$http.get('/api/public/v1/categories')
				if(res.meta.status !== 200) return uni.$showMsg()
				this.cateList = res.message
				//console.log(this.cateList)
				this.cateLevel2 = res.message[0].children
			},
			activeChange(i) {
				this.active = i
				this.cateLevel2 = this.cateList[i].children
				// 让 scrollTop 的值在 0 与 1 之间切换
				this.scrollTop = this.scrollTop? 1 : 0
				
			},
			gotoGoodsList(item3) {
				uni.navigateTo({
					url: '/subpkg/goods_list/goods_list?cid=' + item3.cat_id,
					fail(err) {
						console.log(err)
					}
				})
			},
			gotoSearch() {
				uni.navigateTo({
					url: '/subpkg/search/search',
				})
			},
		
		}
	}
</script>

<style lang="scss">
.scroll-view-container {
	display: flex;
	.left-scroll-view {
		width: 120px;
		.left-scroll-view-item {
			line-height: 60px;
			background-color: #f7f7f7;
			text-align: center;
			font-size: 12px;
			&.active {
				background-color: #ffffff;
				position: relative;
				&::before {
					content: '';
					display: block;
					width: 3px;
					height: 30px;
					background-color: #C00000;
					position: absolute;
					left: 0;
					top: 50%;
					transform: translateY(-50%);
				}
			}
		}
		
	}
	.cate-lv2-title {
	  font-size: 12px;
	  font-weight: bold;
	  text-align: center;
	  padding: 15px 0;
	}
	.cate-lv3-list {
	  display: flex;
	  flex-wrap: wrap;
	
	  .cate-lv3-item {
	    width: 33.33%;
	    margin-bottom: 10px;
	    display: flex;
	    flex-direction: column;
	    align-items: center;
	
	    image {
	      width: 60px;
	      height: 60px;
	    }
	
	    text {
	      font-size: 12px;
	    }
	  }
	}
}
</style>
