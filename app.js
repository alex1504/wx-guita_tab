
const Bmob = require('./utils/bmob.js');
Bmob.initialize("c92d74832497129e2f4a5ece80414d22", "e3e54449888e0554b8c5e8fb1279b671");

App({
  onLaunch: function () {
    const _this = this;
    wx.getUserInfo({
      success: function (res) {
        const userInfo = res.userInfo
        const nickName = userInfo.nickName
        const avatarUrl = userInfo.avatarUrl
        const gender = userInfo.gender //性别 0：未知、1：男、2：女
        const province = userInfo.province
        const city = userInfo.city
        const country = userInfo.country
        //---
        _this.globalData.from = nickName;
        _this.globalData.fromAvatar = avatarUrl;
        console.log(res)
        
        
      }
    })
  },
  globalData: {
    guita_list: null,
    banner_list:null,
    page: 1,
    isLoadAll: false
  }
})