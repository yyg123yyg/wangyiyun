import {
	baseUrl
} from "./config.js"


export function topList() {
	// let listIds=['3','0','2','1'];
	return new Promise((reslove) => {
		uni.request({
			url: `${baseUrl}/toplist/detail`,
			method: 'GET',
			success: (res) => {
				// console.log(res)
				let result = res.data.list
				result.length = 4;
				// for(let i=0;i<listIds;i++){
				// 	result[i].listId=listIds[i]
				// }
				reslove(result)
			}
		})
	})
}
export function list(listId){
	return uni.request({
		url: `${baseUrl}/playlist/detail?id=${listId}`,
		method: 'GET',
		
	})
}


// detail
export function songDetail(songId){
	return uni.request({
		url: `${baseUrl}/song/detail?ids=${songId}`,
		method: 'GET',
		
	})
}
export function songSimi(songId){
	return uni.request({
		url: `${baseUrl}/simi/song?id=${songId}`,
		method: 'GET',
		
	})
}
export function songComment(songId){
	return uni.request({
		url: `${baseUrl}/comment/music?id=${songId}`,
		method: 'GET',
		
	})
}
export function songLyric(songId){
	return uni.request({
		url: `${baseUrl}/Lyric?id=${songId}`,
		method: 'GET',
		
	})
}
export function songUrl(songId){
	return uni.request({
		url: `${baseUrl}/song/url?id=${songId}`,
		method: 'GET',
		
	})
}


// search

export function searchHot(){
	return uni.request({
		url: `${baseUrl}/search/hot/detail`,
		method: 'GET',
	})
}

export function searchWord(word){
	return uni.request({
		url: `${baseUrl}/search?keywords=${word}`,
		method: 'GET',
	})
}

export function searchSuggest(word){
	return uni.request({
		url: `${baseUrl}/search/suggest?keywords=${word}&type=mobile`,
		method: 'GET',
	})
}