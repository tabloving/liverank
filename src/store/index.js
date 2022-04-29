import Vue from 'vue'
import Vuex from 'vuex'

import axios from 'axios';
const instance = axios.create({
  baseURL: '/api',
  timeout: 3000
})
Vue.use(Vuex)

let msg = [
  "跳广播体操",
  "突破次元壁",
  "思考人生",
  "追番",
  "觅食",
  "偷看小姐姐",
];
let offmsg = msg[Math.floor(Math.random() * msg.length)];
export default new Vuex.Store({
  state: {
    resData: 0,
    liveInfo: {
      tit: '',
      uid: '未知',
      uname: '未知',
      uface: '',
      fans: 0,
      status: 0,
      cate: '未知分区',
      roomid: 0,
      online: 0,
      watched: 0,
    },
    drawer: false
  },
  getters: {
    liveMsg(state) {
      let msg;
      switch (state.liveInfo.status) {
        case 0:
          msg = '未开播';
          break;
        case 1:
          msg = '直播中';
          break;
        case 2:
          msg = '轮播中';
          break;
      }
      return msg
    },
    toRoom(state) {
      return state.resData ? `https://live.bilibili.com/${state.liveInfo.roomid}` : '/';
    },
    liveTitle(state) {
      return state.resData ? state.liveInfo.status ? state.liveInfo.tit : `主播正在${offmsg}` : '该用户还未创建直播间'
    }
  },
  mutations: {
    getData(state, payload) {
      instance.get("x/web-interface/search/type", {
        params: {
          keyword: payload.key,
          search_type: "live",
          platform: "pc",
          __refresh__: true,
          from_spmid: 333.337,
          preload: true,
          com2co: true,
          page: 1,
          page_size: 42,
          highlight: 1,
          single_column: 0,
          dynamic_offset: 0,
        },
      })
        .then((result) => {
          if (result["data"]["code"] !== 0) return;
          let data = result["data"]["data"]["result"];
          let res = data["live_room"] ?? data["live_user"];
          if (res) {
            state.resData = 1;
            let info = res[0];
            state.liveInfo = {
              tit: info['title'],
              uid: info['uid'],
              uname: info['uname'],
              uface: info['uface'],
              fans: info['attentions'],
              status: info['live_status'],
              cate: info['cate_name'] || '未知分区',
              roomid: info['roomid'],
              online: info['online'] || 0,
              watched: info["watched_show"] ? info["watched_show"]['num'] : 0,
            }
          } else {
            state.resData = 0
            state.liveInfo = {
              tit: '',
              uid: '未知',
              uname: payload.keyword || '未知',
              uface: '',
              fans: '未知',
              status: 0,
              cate: '未知',
              roomid: '未知',
              online: '未知',
              watched: '未知',
            };
            payload.$notify.warning({
              title: '提示',
              message: '当前未查询到相关直播，请确认输入的信息无误后再试！'
            })
          }
        })
    },
    open(state){
      state.drawer = true
    },
    close(state){
      state.drawer = false
    }
  },
  actions: {
    doSearch({ commit, state }, payload) {
     setInterval(() => {
      state.resData && commit('getData', payload);
      }, 15000)
    }
  },
  modules: {
  }
})
