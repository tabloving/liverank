export default {
  title: 'Personalization Settings',
  save: 'Save',
  defaultSearch: {
    title: 'Default Search Value',
    des: '📢 The data is stored locally for {days} days, clearing the cache will clear the data at the same time.' ,
    placeholder: 'Input your default key',
    validatemsg: 'The input cannot be empty. If you want to leave it unchanged, please turn on locking',
  },
  lockDefault: {
    title: 'Lock Default Query',
  },
  darkMode: {
    title: 'Dark Mode',
  },
  autoRefresh: {
    title: 'AutoRefresh',
    des: 'When turned on, the data will be automatically refreshed every 20s, it is recommended to turn it on. v2.x version is locked to turn it on.' ,
  },
  hotTags: {
    title: 'Hot Tags',
  },
  setHotTags: {
    title: 'Hot Tag Settings',
    placeholder: 'Enter a tag and press enter key',
    des: 'Tip: Use a colon or / to set an alias, e.g. lol: League of Legends',
  },
  validateMsg: {
    isExist: 'Alias or value already exists! No need to add it again.' ,
    confirm: {
      content: 'You have unsaved data, closing will discard this modification, do you want to continue closing?' ,
      title: 'Unsaved data detected',
    },
    cancel: 'You canceled the settings',
    addTag: {
      input: 'Up to 5 supported, please delete and add again',
      message: 'Up to 5 shortcut tags are supported!',
      noTags: "You haven't added any quick tags yet!"
    },
    save: {
      noChange: 'No data change!' ,
      success: 'Congratulations, the setup was successful!' ,
    },
  },
};
