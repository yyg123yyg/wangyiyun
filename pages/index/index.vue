<template>
	<view class="content">
		<!-- 头部 -->
		<Musichezd :icon='false' />
		<view class="container">
			<!-- 滚动 -->
			<scroll-view scroll-y="true">
				<!-- 搜索 -->
				<view class="index-search" @tap='handleToSearch'>
					<text class="iconfont icon-sousuo"></text>
					<input type="text" placeholder="搜索歌曲" />
				</view>
				<view v-if="loading">
					<skeleton :loading="loading" :avatarSize="skeleton1.avatarSize" :row="skeleton1.row"
						:showTitle="skeleton1.showTitle" avatarShape='square' v-for="(item,i) in 4" :key="i">
					</skeleton>
				</view>
			<!-- 	<skeleton  v-if="loading" :loading="loading" :avatarSize="skeleton1.avatarSize" :row="skeleton1.row"
					:showTitle="skeleton1.showTitle" avatarShape='square' v-for="(item,i) in 4" :key="i">
				</skeleton> -->
				
				<!-- 歌曲列表 -->
				<view v-else class="index-list">
					<view @tap="handToList(item.id)" class="index-list-item" v-for="(item,index) in topList"
						:key="index">
						<!-- 左盒子 -->
						<view class="index-list-img">
							<image :src="item.coverImgUrl"></image>
							<text>{{item.updateFrequency}}</text>
						</view>
						<!-- 右盒子 -->
						<view class="index-list-text">
							<view v-for="(item,index) in item.tracks" :key="index">
								{{index+1}}-{{item.first}}-{{item.second}}
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import Skeleton from '../../components/primewind-skeleton/components/skeleton/index.vue'
	import Musichezd from '@/components/musichead/Musichead.vue'
	import {
		topList
	} from '../../network/API.js'
	export default {
		data() {
			return {
				topList: [],
				loading: true,
				skeleton1: {
					avatarSize: '52px',
					row: 3,
					showTitle: false,
				}
			}
		},
		components: {
			Musichezd,
			Skeleton
		},
		onLoad() {
			topList().then((res) => {
				if (res.length) {
					setTimeout(()=>{
						this.topList = res
						this.loading=false
						// console.log(this.topList.length)
					},1000)
					
				}
			})
		},
		methods: {
			handToList(index) {
				uni.navigateTo({
					url: '../list/list?listId=' + index
				})
			},
			handleToSearch() {
				uni.navigateTo({
					url: '../search/search'
				})
			}
		}
	}
</script>

<style scoped>
	.index-search {
		display: flex;
		height: 70rpx;
		margin: 70rpx 30rpx 30rpx 30rpx;
		background-color: #F7F7F7;
		border-radius: 50rpx;
		align-items: center;
	}

	.index-search text {
		font-size: 26rpx;
		margin-right: 26rpx;
		margin-left: 28rpx;
	}

	.index-search input {
		font-size: 28rpx;
		flex: 1;
	}

	.index-list {
		display: flex;
		flex-direction: column;
	}

	.index-list-item {
		display: flex;
		width: 100%;
		margin-bottom: 12rpx;
	}

	.index-list-img {
		width: 212rpx;
		height: 212rpx;
		position: relative;
		margin: 0 22rpx;
	}

	.index-list-img image {
		width: 100%;
		height: 100%;
		border-radius: 30rpx;
		/* background-color: #0077AA; */
	}

	.index-list-img text {
		position: absolute;
		bottom: 16rpx;
		left: 12rpx;
		font-size: 20rpx;
		color: #FFFFFF;
		font-weight: 700;
	}

	.index-list-text {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-evenly;
		font-size: 12rpx;
	}
</style>
