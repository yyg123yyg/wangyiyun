<template>
	<view>
		<view class="fixbg" :style="{'background-image':'url('+songDetail.al.picUrl+')'}"></view>
		<Musichezd :icon="true" :title="songDetail.name"></Musichezd>
		<view class="container">
			<scroll-view scroll-y="true" class="scroll">
				<view class="detail-play" @tap="handToPlay">
					<image v-if="songDetail.al.picUrl" :src="songDetail.al.picUrl" mode=""></image>
					<!-- <text class="iconfont icon-bofang play-pause" ></text> -->
					<text class="iconfont play-pause" :class="iconPlay"></text>
					<view class=""></view>
				</view>
				<!-- 歌词 -->
				<view class="detail-lyric">
					<view :style="{transform:'translateY('+-(lyricIndex-1)*82 +'rpx)'}" class="detail-lyric-wrap">
						<view :class="{active:lyricIndex==index}" v-for="(item,index) in songLyric" :key="index"
							class="detail-lyric-item">{{item.lyric}}
						</view>
					</view>
				</view>
				<view class="detail-like">
					<view class="detail-like-head">
						喜欢这首歌的人也听
					</view>
					<view @tap="handToSimi(item.id)" class="detail-like-item" v-for="(item,index) in songSimi"
						:key="index">
						<view class="detail-like-img">
							<image v-if="item.album.picUrl" :src="item.album.picUrl" class="detail-like-image" mode="">
							</image>
						</view>
						<view class="detail-like-song">
							<view>{{item.name}}</view>
							<view class="">
								<!-- <image src="" mode=""></image>
								<image src="" mode=""></image> -->
								{{item.album.artists[0].name}}{{item.name}}
							</view>
						</view>
						<text class="iconfont icon-zanting"></text>
					</view>
				</view>
				<!-- 评论 -->
				<view class="detail-comment">
					<view class="detail-comment-head">
						精彩评论
					</view>
					<view class="detail-comment-item" v-for="(item,index) in songComment" :key="index">
						<view class="detail-comment-img">
							<image :src="item.user.avatarUrl" mode=""></image>
						</view>
						<!-- 右 -->
						<view class="detail-comment-content">
							<view class="detail-comment-title">
								<view class="detail-comment-name">
									<view>{{item.user.nickname | formatCount}}</view>
									<view>{{item.time | formatTime}}</view>
								</view>
								<view class="detail-comment-like">
									{{item.likedCount}}
									<text class="iconfont icon-tuijian"></text>
								</view>
							</view>
							<view class="detail-comment-text">
								{{item.content}}
							</view>
						</view>
					</view>
				</view>
				
					<text @tap="nextsong" class="iconfont icon-yduixiayiqu next" ></text>
				<text @tap="presong" class="iconfont icon-yduishangyiqu pre" ></text>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import Musichezd from '@/components/musichead/Musichead.vue'
	import '@/static/iconfont/iconfont.css'
	import {
		songDetail,
		songSimi,
		songComment,
		songLyric,
		songUrl
	} from '../../network/API.js'
	export default {
		data() {
			return {
				songDetail: {
					al: {
						picUrl: ''
					}
				},
				songSimi: [],
				songComment: [],
				songLyric: [],
				lyricIndex: 0,
				iconPlay: 'icon-bofang',
				isPlayRotate: true,
				timer: '',
				currentId:''

			}
		},
		onUnload() {
			this.cancellistenLyricIndex()
			// #ifdef H5
			this.bgAudioManager.destroy()
			// #endif
		},
		onHide() {
			this.cancellistenLyricIndex()
			// #ifdef H5
			this.bgAudioManager.destroy()
			this.iconPlay='icon-zanting'
			// #endif
		},
		onLoad(options) {
			uni.showLoading({
				title: '加载中...'
			})
			this.getMusic(options.id)
			// console.log(options.id)
		},
		components: {
			Musichezd
		},
		methods: {
			getMusic(songId) {
				this.currentId=songId
				// 下一曲id
				this.$store.commit("NEXT_ID", songId);
				this.$store.commit("PRE_ID", this.currentId);
				// console.log(this.$store.state.nextId)
				// console.log(this.currentId)
				uni.showLoading({
					title: '加载中...'
				})
				Promise.all([songDetail(songId), songSimi(songId), songComment(songId), songLyric(songId), songUrl(
					songId)]).then(res => {
					// console.log(res)
					if (res[0][1].data.code == '200') {
						this.songDetail = res[0][1].data.songs[0];
					}
					if (res[1][1].data.code == '200') {
						this.songSimi = res[1][1].data.songs
					}
					if (res[2][1].data.code == '200') {
						this.songComment = res[2][1].data.hotComments
					}
					if (res[3][1].data.code == '200') {
						let lyric = res[3][1].data.lrc.lyric;
						let re = /\[([^\]]+)\]([^\[]+)/g;
						let result = [];
						lyric.replace(re, ($0, $1, $2) => {
							result.push({
								"time": this.formatTimeTOsec($1),
								"lyric": $2
							})
						});
						this.songLyric = result
						// console.log(result)
					}
					if (res[4][1].data.code == '200') {
						// #ifdef MP-WEIXIN
						this.bgAudioManager = uni.getBackgroundAudioManager();
						this.bgAudioManager.title = this.songDetail.name;
						// #endif
						
						// #ifdef H5
						if (!this.bgAudioManager) {
							this.bgAudioManager = uni.createInnerAudioContext();
						}
						this.iconPlay = 'icon-zanting';
						this.isPlayRotate = false;
						// #endif

						this.bgAudioManager.src = res[4][1].data.data[0].url || '';
						// 调用歌词滚动
						this.listenLyricIndex()
						this.bgAudioManager.onPlay(() => {
							this.iconPlay = 'icon-bofang';
							this.isPlayRotate = true
							this.listenLyricIndex()
						});
						this.bgAudioManager.onPause(() => {
							this.iconPlay = 'icon-zanting';
							this.isPlayRotate = false
							this.cancellistenLyricIndex()
						});
						// 时间到下一曲
						this.bgAudioManager.onEnded(() => {
							this.getMusic(this.$store.state.nextId)
						})
					}
					uni.hideLoading();
				});
			},
			formatTimeTOsec(value) {
				let arr = value.split(':')
				return (Number(arr[0] * 60) + Number(arr[1])).toFixed(1)
			},
			handToPlay() {
				if (this.bgAudioManager.paused) {
					this.bgAudioManager.play()
				} else {
					this.bgAudioManager.pause()
				}
			},
			// 歌词滚动
			listenLyricIndex() {
				clearInterval(this.tiemr)
				this.timer = setInterval(() => {
					for (let i = 0; i < this.songLyric.length; i++) {
						if (this.bgAudioManager.currentTime > this.songLyric[this.songLyric.length - 1].time) {
							this.lyricIndex = this.songLyric.length - 1;
							break;
						}
						if (this.bgAudioManager.currentTime > this.songLyric[i].time && this.bgAudioManager
							.currentTime < this.songLyric[i + 1].time) {
							this.lyricIndex = i;
						}
					}
					// console.log(this.lyricIndex)
				}, 500)
			},
			cancellistenLyricIndex() {
				clearInterval(this.timer)
			},
			// 相似歌曲
			handToSimi(id) {
				this.getMusic(id)
			},
			nextsong(){
				 this.getMusic(this.$store.state.nextId)
				console.log(this.$store.state.nextId)
			},
			presong(){
				this.getMusic(this.$store.state.preId)
			}
		}

	}
</script>

<style scoped>
	.detail-play {
		width: 580rpx;
		height: 580rpx;
		background-size: cover;
		margin: 214rpx auto 0 auto;
		position: relative;
		background: url(../../static/光盘.png) no-repeat;
		background-position: center;
	}

	.detail-play image {
		width: 370rpx;
		height: 370rpx;
		border-radius: 50%;
		position: absolute;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		margin: auto;
	}

	.detail-play .play-pause {
		width: 100rpx;
		height: 100rpx;
		font-size: 100rpx;
		color: #fff;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 99;
	}

	.detail-play view {}

	.detail-lyric {
		color: #919193;
		font-size: 32rpx;
		line-height: 82rpx;
		height: 246rpx;
		text-align: center;
		overflow: hidden;
	}

	.detail-lyric-wrap {
		transition: .5s;
	}

	.detail-lyric-item {
		line-height: 82rpx;
	}

	.active {
		color: #fff;
	}

	.detail-like {
		margin: 0 30rpx;
	}

	.detail-like-head {
		font-size: 36rpx;
		color: #fff;
		margin: 50rpx 0;
	}

	.detail-like-item {
		display: flex;
		align-items: center;
		margin-bottom: 28rpx;
	}


	.detail-like-img {
		width: 82rpx;
		height: 82rpx;
		border-radius: 20rpx;
		margin-right: 20rpx;
	}

	.detail-like-img .detail-like-image {
		/* width: 82rpx;
		height: 82rpx; */
		width: 100%;
		height: 100%;
	}

	.detail-like-song {
		flex: 1;
		color: #c6c2bf;
	}

	.detail-like-song view:nth-child(1) {
		font-size: 28rpx;
		color: #fff;
		margin-bottom: 12rpx;
	}

	.detail-like-song view:nth-child(2) {
		font-size: 22rpx;

	}

	.detail-like-item text {
		font-size: 50rpx;
	}

	.detail-comment {
		margin: 0 30rpx;
	}

	.detail-comment-head {
		font-size: 36rpx;
		color: #fff;
		margin: 50rpx 0;
	}

	.detail-comment-item {
		margin-bottom: 28rpx;
		display: flex;
	}

	.detail-comment-img {
		border-radius: 50%;
		width: 64rpx;
		height: 64rpx;
		overflow: hidden;
		margin-right: 18rpx;
	}

	.detail-comment-img image {
		width: 100%;
		height: 100%;
	}

	.detail-comment-content {
		flex: 1;
	}

	.detail-comment-title {
		display: flex;
		justify-content: space-between;
	}

	.detail-comment-name {
		color: #55ff7f;
	}

	.detail-comment-name view:nth-child(1) {
		font-size: 26rpx;
	}

	.detail-comment-name view:nth-child(1) {
		font-size: 20rpx;
	}

	.detail-comment-like {
		font-size: 28rpx;
	}

	.detail-comment-text {
		font-size: 28rpx;
		line-height: 40rpx;
		color: #fff;
		margin-top: 20rpx;
		border-bottom: 2px solid #ccc;
		padding-bottom: 40rpx;
	}
	.scroll{
		position: relative;
	}
	.next{
		width: 100rpx;
		height: 100rpx;
		position: absolute;
		left: 80%;
		top: 50%;
		color: #fff;
		background-color: red;
		z-index: 99;
		font-size: 100rpx;
		text-align: center;
		line-height: 100rpx;
		border-radius: 50%;
	}
	.pre{
		width: 100rpx;
		height: 100rpx;
		position: absolute;
		right: 80%;
		top: 50%;
		color: #fff;
		background-color: red;
		z-index: 99;
		font-size: 100rpx;
		text-align: center;
		line-height: 100rpx;
		border-radius: 50%;
	}
	
</style>
