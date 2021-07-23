<template>
	<view class="music-head">
		<view v-if="icon" class="music-head-icon" :class="{iconBlack:iconback}">
			<text @tap="handleToBack" class="iconfont icon-jiantou2"></text>|<text @tap="handleToHome"
				class="iconfont icon-index-copy"></text>
		</view>
		{{title}}
	</view>
</template>

<script>
	import '@/static/iconfont/iconfont.css'
	export default {
		name: "musichead",
		props: {
			title: {
				type: String,
				default: '网易云音乐'
			},
			icon: {
				type: Boolean
			},
			iconback:{
				type:Boolean,
				default:false
			}
		},
		methods: {
			handleToBack() {
				uni.navigateBack({

				})
			},
			handleToHome() {
				uni.navigateTo({
					url:'../../pages/index/index'
				})
			}
		}
	}
</script>

<style scoped>
	
	.music-head {
		width: 100%;
		height: 75px;
		font-size: 16px;
		line-height: 75px;
		text-align: center;
		position: relative;
	}

	.music-head-icon {
		position: absolute;
		left: 8px;
		top: 23px;
		border: 1px solid #ccc;
		width: 90px;
		height: 30px;
		line-height: 31px;
		background: rgba(0, 0, 0, .3);
		border-radius: 15px;
		display: flex;
		justify-content: space-evenly;
		color: #FFFFFF;
		font-size: 18px;
	}
	.iconBlack{
		background:#fff !important ;
		color: #000000;
	}
</style>
