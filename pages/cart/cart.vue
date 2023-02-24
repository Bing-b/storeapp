<template>
	<view class="cart-container" v-if="cart.length !== 0">
		<!-- 收获地址 -->
		<my-address></my-address>
		<!-- 购物车商品列表的标题区域 -->
		<view class="cart-title">
		  <!-- 左侧的图标 -->
		  <uni-icons type="shop" size="18"></uni-icons>
		  <!-- 描述文本 -->
		  <text class="cart-title-text">购物车</text>
		</view>
		<!-- 商品列表区域 -->
		<!-- uni-swipe-action 是最外层包裹性质的容器 -->
		<uni-swipe-action>
		  <block v-for="(goods, i) in cart" :key="i">
			<!-- uni-swipe-action-item 可以为其子节点提供滑动操作的效果。需要通过right-options 属性来指定从右向左滑操作按钮的配置信息 -->
			<uni-swipe-action-item :right-options="options" @click="swipeActionClickHandler(goods)">
			  <my-goods :goods="goods" :show-radio="true" :show-num="true" @radio-change="radioChangeHandler" @num-change="numberChangeHandler"></my-goods>
			</uni-swipe-action-item>
		  </block>
		</uni-swipe-action>

		<!-- 结算区域 -->
		<my-settle></my-settle>
		

	</view>
	<!-- 空白购物车区域 -->
	<view class="empty-cart" v-else>
		<text class="tip-text">空空如也~</text>
	</view>
</template>

<script>
	// 引入mixin 模块
	import badgeMix from '@/mixins/tabbar-badge.js'
	// 按需导入 mapState 这个辅助函数
	import { mapState, mapMutations } from 'vuex'
	
	export default {
		mixins:[badgeMix],
		data() {
			return {
				options:[{
					text: '删除',
					style: {
						backgroundColor: '#c00000'
					}
				}]
			};
		},
		computed: {
			...mapState('m_cart',  ['cart'])
		},
		methods:{
			...mapMutations('m_cart', ['updateGoodsState', 'updateGoodsCount', 'removeGoodsById']),
			
			radioChangeHandler(e) {
				this.updateGoodsState(e)
			},
			// 商品的数量发生了变化
			numberChangeHandler(e) {
			  this.updateGoodsCount(e)
			},
			// 点击了滑动操作按钮
			swipeActionClickHandler(goods) {
			  this.removeGoodsById(goods.goods_id)
			}


		}
	}
</script>

<style lang="scss">
.cart-container {
  padding-bottom: 50px;
}
.cart-title {
  height: 40px;
  display: flex;
  align-items: center;
  font-size: 14px;
  padding-left: 5px;
  border-bottom: 1px solid #efefef;
  .cart-title-text {
    margin-left: 10px;
  }
}
.goods-item {
  // 让 goods-item 项占满整个屏幕的宽度
  width: 750rpx;
  // 设置盒模型为 border-box
  box-sizing: border-box;
  display: flex;
  padding: 10px 5px;
  border-bottom: 1px solid #f0f0f0;
}

.empty-cart {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 150px;

  .empty-img {
	width: 90px;
	height: 90px;
  }

  .tip-text {
	font-size: 12px;
	color: gray;
	margin-top: 15px;
  }
}

</style>
