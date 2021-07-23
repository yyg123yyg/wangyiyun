import Vue from "vue"
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state:{
		topListIds:[],
		nextId:'',
		preId:''
	},
	mutations:{
		INIT_TOPLISTIDS(state,payload){
			state.topListIds=payload
		},
		NEXT_ID(state,payload){
			state.topListIds.forEach((item,i)=>{
				if(item.id==payload){
					state.nextId=state.topListIds[i+1].id
				}
			})
		},
		PRE_ID(state,payload){
			state.topListIds.forEach((item,i)=>{
				if(item.id==payload){
					state.preId=state.topListIds[i-1].id
				}
			})
		}
	}
})