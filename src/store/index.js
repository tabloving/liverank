import Vue from 'vue'
import Vuex from 'vuex'
import i18n from '../locale'
import axios from 'axios';

const instance = axios.create({
  baseURL: '/api',
  timeout: 3000
})

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    resData: 0,
    lang: i18n.locale,
    msg: ['Store.msg.msg1', 'Store.msg.msg2', 'Store.msg.msg3', 'Store.msg.msg4', 'Store.msg.msg5', 'Store.msg.msg6'],
    liveInfo: {
      tit: '',
      uid: 'Store.noResult.unknown',
      uname: 'Store.noResult.unknown',
      uface: '',
      fans: 'Store.noResult.unknown',
      status: 0,
      cate: 'Store.noResult.area',
      roomid: 'Store.noResult.unknown',
      online: 'Store.noResult.unknown',
      watched: 'Store.noResult.unknown',
      live_time: 0
    },
    updatemsg: false,
    settings: false
  },
  getters: {
    liveMsg(state) {
      let msg;
      switch (state.liveInfo.status) {
        case 0:
          msg = i18n.t('Store.status.off');
          break;
        case 1:
          msg = i18n.t('Store.status.live');
          break;
        case 2:
          msg = i18n.t('Store.status.loop');
          break;
      }
      return msg
    },
    offmsg(state) {
      return state.msg[Math.floor(Math.random() * state.msg.length)]
    },
    toRoom(state) {
      return state.resData ? `https://live.bilibili.com/${state.liveInfo.roomid}` : '/';
    },
    liveTitle(state, getters) {
      return state.resData ? state.liveInfo.status ? state.liveInfo.tit : i18n.t('Store.title', { doing: i18n.t(getters.offmsg) }) : i18n.t('Store.noResult.title')
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
              cate: info['cate_name'] || 'Store.noResult.area',
              roomid: info['roomid'],
              online: info['online'] || '0',
              watched: info["watched_show"] ? info["watched_show"]['num'] : '0',
              live_time: info['live_time']
            }
          } else {
            state.resData = 0
            state.liveInfo = {
              tit: '',
              uid:'Store.noResult.unknown',
              uname: payload.keyword || 'Store.noResult.unknown',
              uface: '',
              fans: 'Store.noResult.unknown',
              status: 0,
              cate: 'Store.noResult.area',
              roomid: 'Store.noResult.unknown',
              online: 'Store.noResult.unknown',
              watched: 'Store.noResult.unknown',
            };
            payload.$notify.warning({
              title: `${i18n.t('Store.noResult.msg.title')}`,
              message: i18n.t('Store.noResult.msg.message')
            })
          }
        }).catch(error => {
          payload.$message.error(`${i18n.t('Store.error')}：${error.message}`);
        })
    },
    drawerControl(state, payload) {
      let [target, op] = payload
      let ret = op === 'on' ? true : false
      state[target] = ret
    },
    changeLang(state, payload) {
      i18n.locale = state.lang  = payload
      sessionStorage.setItem('lang', payload)
    }
  },
  actions: {
    doSearch({ commit, state }, payload) {
      setInterval(() => {
        state.resData && commit('getData', payload);
      }, 20000)
    }
  },
  modules: {
  }
})
