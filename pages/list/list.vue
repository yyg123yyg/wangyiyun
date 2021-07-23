<template>
	<view class="list">
		<view class="fixbg" :style="{'background-image':'url('+playList.coverImgUrl+')'}"></view>
		<Musichezd title="歌单" :icon="true"></Musichezd>
		<view class="container" v-show="!isLoading">
			<scroll-view scroll-y="true">
				<view class="list-head">
					<!-- 左边 -->
					<view class="list-head-img">
						<image :src="playList.coverImgUrl" mode=""></image>
						<text class="iconfont icon-jiantou1">{{playList.playCount|formatCount}}</text>
					</view>
					<!-- 右边 -->
					<view class="list-head-text">
						<view class="">{{playList.name}}</view>
						<view class="">
							<image :src="playList.creator.avatarUrl" mode=""></image>
							<text>{{playList.creator.nickname}}</text>
						</view>
						<view class="">{{playList.description}}</view>
					</view>
				</view>
				<!-- 条件差异化 -->
				<!-- #ifdef MP-WEIXIN -->
				<button open-type="share" class="list-share">
					<text class="iconfont icon-shuju"></text>分享给微信好友
				</button>
				<!-- #endif -->
				<!-- 音乐列表 -->
				<view class="list-music">
					<view class="list-music-head">
						<text class="iconfont icon-diantai"></text>
						<text>播放全部</text>
						<text>(共{{playList.trackCount}}首)</text>
					</view>
					<view @tap="handtodetail(item.id)" class="list-music-item" :key='index'
						v-for="(item,index) in playList.tracks">
						<view class="list-music-top">{{index+1}}</view>
						<view class="list-music-song">
							<text>{{item.name}}</text>
							<view class="">
								<!-- <image v-if="privilieges[index].flag>60&&privilieges<70" src="" mode=""></image> -->
								<!-- <image v-if="privilieges[index].maxbr==999000" src="" mode=""></image> -->
								{{item.ar[0].name}}- {{item.name}}
							</view>
						</view>
						<text class="iconfont icon-diantai"></text>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import Musichezd from '@/components/musichead/Musichead.vue'
	import {
		list
	} from '../../network/API.js'
	export default {
		data() {
			return {
				playList: {
					creator: {
						avatarUrl: '',
					
					}
				},
				privilieges: [],
				isLoading: true
			}
		},
		components: {
			Musichezd
		},
		onLoad(options) {
			uni.showLoading({
				title: '加载中...'
			})
			list(options.listId).then(res => {
				// console.log(res)
				if (res[1].data.code == '200') {
					this.playList = res[1].data.playlist
					this.privilieges = res[1].data.privilieges;
					this.$store.commit('INIT_TOPLISTIDS', res[1].data.playlist.trackIds)
					// console.log(res[1].data.playlist.trackIds)
					this.isLoading = false
					uni.hideLoading();
				}
			})
		},
		methods: {
			handtodetail(id) {
				uni.navigateTo({
					url:'../detail/detail?id='+id
				})
			}
		},

	}
</script>

<style scoped>
	.list-head {
		display: flex;
		height: 264rpx;
	}

	.list-head-img {
		width: 264rpx;
		height: 264rpx;
		background-color: #0077AA;
		margin-left: 10rpx;
		border-radius: 12rpx;
		position: relative;
		overflow: hidden;
	}

	.list-head-img image {
		width: 264rpx;
		height: 264rpx;
	}

	.list-head-img .iconfont {
		position: absolute;
		right: 0;
	}

	.list-head-text {
		flex: 1;
		display: flex;
		flex-direction: column;
		margin-left: 20rpx;
		color: #fff;
	}

	.list-head-text view:nth-child(1) {
		margin-left: 20rpx;
		font-size: 40rpx;
	}

	.list-head-text view:nth-child(2) {
		display: flex;
		margin: 15px 0;
		margin-left: 20rpx;
		font-size: 22rpx;
	}

	.list-head-text view:nth-child(2) image {
		width: 54rpx;
		height: 54rpx;
		border-radius: 50%;
	}

	.list-head-text view:nth-child(2) text {
		margin-left: 10rpx;
		line-height: 55rpx;
	}

	.list-head-text view:nth-child(3) {
		line-height: 34rpx;
		font-size: 22rpx;
		margin-left: 20rpx;
	}

	.list-share {
		width: 330rpx;
		height: 74rpx;
		background: rgba(0, 0, 0, .4);
		border-radius: 37rpx;
		color: #fff;
		line-height: 74rpx;
		text-align: center;
		font-size: 28rpx;
	}

	.list-share text {
		margin-right: 16rpx;
	}

	.list-music {
		background: #FFF;
		border-radius: 50rpx;
		margin-top: 40rpx;
		overflow: hidden;
	}

	.list-music-head {
		height: 50rpx;
		margin: 30rpx 0 70rpx 26rpx;
	}

	.list-music-head text:nth-child(1) {
		height: 50rpx;
		font-size: 50rpx
	}

	.list-music-head text:nth-child(2) {
		font-size: 30rpx
	}

	.list-music-head text:nth-child(3) {
		font-size: 26rpx;
		color: #ccc;
	}

	.list-music-item {
		display: flex;
		margin: 0 32rpx 66rpx 47rpx;
		align-items: center;
		color: #959595;
	}

	.list-music-top {
		color: #000000;
		width: 58rpx;
		font-size: 50rpx;
		line-height: 50rpx;
	}

	.list-music-song {
		flex: 1;
	}

	.list-music-song text {
		font-size: 28rpx;
		color: #000000;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		width: 40vw;
		margin-left: 20rpx;
		display: block;
	}

	.list-music-song view:nth-child(2) {
		/* display: flex; */
		font-size: 20rpx;
		align-items: center;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		width: 60vw;
	}

	.list-music-song view:nth-child(2) image {
		width: 32rpx;
		height: 20rpx;
		margin-left: 10rpx;
	}

	.list-music-item .iconfont {
		font-size: 50rpx;
		color: #c7c7c7;
	}
</style>
