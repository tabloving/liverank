import Vue from 'vue'
import VueI18n from 'vue-i18n';

import ElementLocale from 'element-ui/lib/locale'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
import enLocale from 'element-ui/lib/locale/lang/en'

import customLocaleZH from './lang/zh'
import customLocaleEN from './lang/en'

Vue.use(VueI18n)

const lang = sessionStorage.getItem('lang') || 'zh'
const i18n = new VueI18n({
  locale: lang, // 默认语言
  fallbackLocale: 'zh', // 设置回滚本地语言
  messages: {
    en: {
      ...enLocale,
      ...customLocaleEN
    },
    zh: {
      ...zhLocale,
      ...customLocaleZH
    }
  }
})

ElementLocale.i18n((key, value) => i18n.t(key, value))

export default i18n