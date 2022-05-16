# <p align=center style=" color:#00adeb">Live Rank</p>

<p align=center>
本工具主要用途是获取到B站直播间取消的人气显示进行可视化。
<br>主要目的还是为了学习练手，复习知识点。功能纯粹、界面整洁、使用简单。
<br>练习项目，仅供参考，不足之处还望大佬指点。</p>

<p align=center>
<img src='https://img.shields.io/badge/vue-2.6.14-success?style=flat-square' alt="vue version" style='cursor:pointer' />
<img src='https://img.shields.io/badge/vuex-3.6.2-success?style=flat-square' alt="vuex version" style='cursor:pointer' />
<img src='https://img.shields.io/badge/element-3.6.2-blue?style=flat-square' alt="element version" style='cursor:pointer' />
<img src='https://img.shields.io/badge/vueI18n-8.27.1-success?style=flat-square' alt="vueI18n version" style='cursor:pointer' />
<img src='https://img.shields.io/badge/axios-0.26.1-orange?style=flat-square' alt="vueI18n version" style='cursor:pointer' />
</p>

### 目录结构
```
├── public/
└── src/
    ├── assets/                    // 静态资源
    ├── components/                // 公共组件
    ├── locale/                    // 国际化语言包
    ├── storeage/                  // 本地数据处理
    ├── store/                     // 状态管理
    ├── style/                     // 全局样式
    ├── utils/                     // 工具函数
    ├── App.vue
    ├── main.js
└── ...
```

### 基本功能

+ 查询直播间或者用户
+ 显示基本信息，以及主要的人气值
+ 设置、锁定默认查询
+ 暗黑模式支持
+ 定时自动刷新数据 `值：20s`
+ 快捷搜索标签开关
+ 快捷标签支持别名
+ 输入匹配快捷标签
+ 联想输入 `关闭快捷标签`
+ 支持语言选择 `中英文`
+ 本地数据缓存，防止误刷新丢失数据
+ `css-doodle` 支持
+ 移动端适配
......

### 项目预览

预览地址：[`⏳ 传送门`](https://ailiuyang.cc/ToolForBilibili/)

