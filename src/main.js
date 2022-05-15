import Vue from 'vue';
import App from './App.vue';
import store from './store';
import Utils from './Utils'
import VueI18n from 'vue-i18n';
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
import enLocale from 'element-ui/lib/locale/lang/en'
import ElementLocale from 'element-ui/lib/locale'
import customLocale from './locale'

import './style/global.style.scss'

import {
  Input, Autocomplete, Empty, Tooltip, Button, Notification, MessageBox, Icon, Message, Drawer, Switch, Timeline, TimelineItem, Dropdown, DropdownMenu, DropdownItem
} from 'element-ui';

let comps = {
  Input, Autocomplete, Empty, Tooltip, Button, Icon, Drawer, Switch, Timeline, TimelineItem, Dropdown, DropdownMenu, DropdownItem, VueI18n
};
Object.entries(comps).forEach(([key, comp]) => {
  Vue.use(comp);
});

Vue.config.productionTip = false;
Vue.config.keyCodes.enter = 13;
Vue.prototype.$notify = Notification;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$message = Message;
Vue.prototype.$Utils = Utils

const i18n = new VueI18n({
  locale: 'zh', // 默认语言
  fallbackLocale: 'zh', // 设置回滚本地语言
  messages: {
    en: {
      ...enLocale,
      ...customLocale.enLocale
    },
    zh: {
      ...zhLocale,
      ...customLocale.zhLocale
    }
  }
})

ElementLocale.i18n((key, value) => i18n.t(key, value))

export const vm = new Vue({
  store,
  i18n,
  render: (h) => h(App),
}).$mount('#app');
