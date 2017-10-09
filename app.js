
const Bmob = require('./utils/bmob.js');
Bmob.initialize("c92d74832497129e2f4a5ece80414d22", "e3e54449888e0554b8c5e8fb1279b671");

App({
  onLaunch: function () {
    
  },
  globalData: {
    guita_list: null,
    page: 1,
    isLoadAll: false
  }
})