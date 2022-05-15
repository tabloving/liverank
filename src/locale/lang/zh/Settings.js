export default {
  title: '个性化设置',
  save: '保存设置',
  defaultSearch: {
    title: '默认查询值',
    des: '📢 数据存储在本地 {days} 天，清缓存会同时清除数据，望周知！',
    placeholder: '请输入您需要设置的值',
    validatemsg: '输入不能为空。若想保持不变，请开启锁定',
  },
  lockDefault: {
    title: '锁定默认查询',
  },
  darkMode: {
    title: '暗黑模式开关',
  },
  autoRefresh: {
    title: '自动刷新数据',
    des: '开启后，将会每{days}s自动刷新一次数据，建议开启。V2.x版本已锁定开启。',
  },
  hotTags: {
    title: '快捷标签开关',
  },
  setHotTags: {
    title: '快捷标签设置',
    placeholder: '请输入标签，按回车确认',
    des: '提示：使用冒号或者 / 可以设置别名，例如：lol：英雄联盟',
  },
  validateMsg: {
    isExist: '别名 或 值 已经存在了！无需重复添加。',
    confirm: {
      content: '你有未保存的数据，关闭后将放弃本次修改，是否继续关闭？',
      title: '检测到有未保存的数据',
    },
    cancel: '您取消了设置',
    addTag: {
      input: '最多支持5个，请删除后再添加',
      message: '最多支持5个快捷标签！',
      noTags: '您还没有添加任何快捷标签！'
    },
    save: {
      noChange: '没有数据更改！',
      success: '恭喜你，设置成功！',
    },
  },
};
