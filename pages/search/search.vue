<template>
	<view class="search">
		<Musichezd title="搜索" :icon="true" :iconback='true'></Musichezd>
		<view class="container">
			<scroll-view scroll-y="true">
				<!-- 搜索 -->
				<view class="index-search">
					<text class="iconfont icon-sousuo"></text>
					<input @input="handlToSuggest" @confirm="handToSearch(searchWrod)" v-model="searchWrod" type="text" placeholder="搜索歌曲" />
					<text @tap="handleToClose" v-show="searchType!==1" class="iconfont icon-cuo cuo"></text>
				</view>
				<block v-if="searchType==1">
					<view class="search-history">
						<view class="search-history-head">
							<text>历史记录</text>
							<text @tap="handleToClear" class="iconfont icon-lajitong"></text>
						</view>
						<view class="search-history-list">
							<view @tap="handleToWord(item)" v-for="(item,index) in searchHistory" :key="index">{{item}}
							</view>
						</view>
					</view>
					<view class="search-hot">
						<view class="search-hot-head">热搜榜</view>
						<view @tap="handleToWord(item.searchWord)" class="search-hot-item" :key="index"
							v-for="(item,index) in searchHot">
							<view class="search-hot-top">{{index+1}}</view>
							<view class="search-hot-word">
								<view>
									{{item.searchWord}}
									<image :src="item.iconUrl" mode="aspectFill"></image>
								</view>
								<view class="">
									{{item.content}}
								</view>
								<text class="search-hot-count">{{item.score}}</text>
							</view>
						</view>
					</view>
				</block>
				<block v-else-if="searchType==2">
					<view class="search-result">
						<view @tap="handleToDetail(item.id)" class="search-result-item"
							v-for="(item,index) in SearchList" :key="index">
							<view class="search-result-word">
								<view class="">{{item.name}}</view>
								<view class="">{{item.artists[0].name}}-{{item.album.name}}</view>
							</view>
							<text class="iconfont icon-zanting"></text>
						</view>
					</view>
				</block>
				<block v-else-if="searchType==3">
					<view class="search-suggest">
						<view class="search-suggest-head">搜索{{searchWrod}}</view>
						<view @tap="handleToWord(item.keyword)" class="search-suggest-item" :key='i' v-for="(item,i) in searchSuggest">
							<text class="iconfont icon-sousuo"></text>{{item.keyword}}
						</view>
					</view>
				</block>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import Musichezd from '@/components/musichead/Musichead.vue'
	import '@/static/iconfont/iconfont.css'
	import {
		searchHot,
		searchWord,
		searchSuggest
	} from '../../network/API.js'
	export default {
		data() {
			return {
				searchHot: [],
				searchWrod: '',
				searchHistory: [],
				searchType: 1,
				SearchList: [],
				searchSuggest:[]
			}
		},
		methods: {
			// 双向绑定，点击音乐
			handleToWord(searchWord) {
				this.searchWrod = searchWord;
				this.handToSearch(searchWord);
			},
			// 历史记录按下回车键.搜索音乐
			handToSearch(searchWrod) {
				this.searchHistory.unshift(searchWrod);
				this.searchHistory = [...new Set(this.searchHistory)]
				if (this.searchHistory.length == 10) {
					this.searchHistory.length = 10;
				}
				uni.setStorage({
					key: 'searchHistory',
					data: this.searchHistory
				});
				this.getSearchList(searchWrod)

			},
			handleToClear() {
				uni.removeStorage({
					key: 'searchHistory',
					success: (res) => {
						this.searchHistory = []
					}
				});
				this.searchHistory = [];
			},
			// 音乐列表
			getSearchList(searchWrod) {
				searchWord(searchWrod).then(res => {
					if (res[1].data.code == '200') {
						this.SearchList = res[1].data.result.songs;
						this.searchType = 2
					}
				})
			},
			// 点击关闭跳转到详情页
			handleToClose() {
				this.searchWrod = '';
				this.searchType = 1;
			},
			handleToDetail(songid) {
				uni.navigateTo({
					url: '../detail/detail?id=' + songid
				})
			},
			// 表单输入触发
			handlToSuggest(e){
				let value=e.target.value;
				if(!value){
					this.searchType=1;
					return ;
				}
				searchSuggest(value).then(res=>{
					if(res[1].data.code=='200'){
					this.searchSuggest = res[1].data.result.allMatch;
					this.searchType=3;
					}
				})
			}
		},
		onLoad() {
			searchHot().then(res => {
				if (res[1].data.code == '200') {
					this.searchHot = res[1].data.data;
				}
			});
			//取出本地存储
			uni.getStorage({
				key: 'searchHistory',
				success: (res) => {
					this.searchHistory = res.data;
				}
			})
		},
		components: {
			Musichezd
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

	.search-history {
		margin: 40rpx 30rpx;
		font-size: 28rpx;
	}

	.search-history-head {
		display: flex;
		justify-content: space-between;
		margin-bottom: 30rpx;
	}

	.search-history-list {
		display: flex;
		flex-wrap: wrap;
	}

	.search-history-list view {
		padding: 16rpx 28rpx;
		border-radius: 40rpx;
		margin-right: 30rpx;
		margin-bottom: 30rpx;
		background-color: #F7F7F7;
	}

	.search-hot {
		margin: 0 30rpx;
		font-size: 26rpx;
	}

	.search-hot-head {
		margin-bottom: 30rpx;
	}

	.search-hot-item {
		display: flex;
		align-items: center;
		margin-bottom: 58rpx;
	}

	.search-hot-top {
		color: #fb2222;
		width: 60rpx;
		margin-left: 8rpx;
	}

	.search-hot-word {
		flex: 1;
		position: relative;
	}

	.search-hot-word image {
		width: 48rpx;
		height: 22rpx;
	}

	.search-hot-word view:nth-child(1) {
		font-size: 30rpx;
		color: black;
	}

	.search-hot-word view:nth-child(2) {
		font-size: 24rpx;
		color: #ccc;
	}

	.search-hot-count {
		color: #696969;
		position: absolute;
		right: 0;
		top: 30%;
	}

	.search-result {
		border-top: 2px solid #e7e7e7;
		padding: 30rpx;
	}

	.search-result-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-bottom: 30rpx;
		margin-bottom: 30rpx;
		border-bottom: 2px solid #e7e7e7;
	}

	.search-result-word {}

	.search-result-word view:nth-child(1) {
		font-size: 28rpx;
		color: #235790;
		margin-bottom: 12rpx;
	}

	.search-result-word view:nth-child(2) {
		font-size: 22rpx;
		color: #898989;
	}

	.search-result-word text {
		font-size: 50rpx;
	}
	.search-suggest{
		border-top:2px solid #ccc ;
		padding: 40rpx;
		font-size: 26rpx;
		}
	.search-suggest-head{
		color: #4574a5;
		margin-bottom: 74rpx;
	}
	.search-suggest-item{
		color: #5d5d5d;
		margin-bottom: 74rpx;
	}
	.search-suggest-item text{
		color: #bdbdbd;
		margin-right: 28rpx;
		position: relative;
		top: 2rpx;
	}


</style>
