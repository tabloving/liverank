import Vue from 'vue';
import App from './App.vue';
import store from './store';
import Utils from './Utils'
// 引入国际化
import i18n from './locale'
// 引入全局样式
import './style/global.style.scss'

import {
  Input, Autocomplete, Empty, Tooltip, Button, Notification, MessageBox, Icon, Message, Drawer, Switch, Timeline, TimelineItem, Dropdown, DropdownMenu, DropdownItem
} from 'element-ui';

let comps = {
  Input, Autocomplete, Empty, Tooltip, Button, Icon, Drawer, Switch, Timeline, TimelineItem, Dropdown, DropdownMenu, DropdownItem
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

export const vm = new Vue({
  store,
  i18n,
  render: (h) => h(App),
}).$mount('#app');
