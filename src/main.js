import Vue from 'vue';
import App from './App.vue';
import store from './store';
import Utils from './Utils'

import './style/global.style.scss'

import { Input, Autocomplete, Button, Notification, MessageBox, Icon, Message, Drawer, Switch } from 'element-ui';

let comps = { Input, Autocomplete, Button, Icon, Drawer, Switch };
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
  render: (h) => h(App),
}).$mount('#app');
