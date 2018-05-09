import API from './api/index.js'

const Bmob = require('./utils/bmob.js');
Bmob.initialize("c92d74832497129e2f4a5ece80414d22", "e3e54449888e0554b8c5e8fb1279b671");

App({
    onLaunch: function () {
        // API.scratchChords('告白气球')
        //   .then(res => {
        //     console.log(res)
        //   })
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
                console.log(_this.globalData)
            }
        })
        this.login()
    },
    globalData: {
        hotestList: null,
        latestList: null,
        hotestListPage: 2,
        isLoadAllHot: false,
        latestListPage: 2,
        isLoadAllNew: false,
        banner_list: null,
    },
    login() {
        var user = new Bmob.User();
        var _this = this;
        var newOpenid = wx.getStorageSync('openid')
        if (newOpenid) {
            this.globalData.openid = newOpenid;
            return;
        }
        wx.login({
            success: function (res) {
                user.loginWithWeapp(res.code).then(function (user) {
                    var openid = user.get("authData").weapp.openid;
                    _this.globalData.openid = openid;
                    if (user.get("nickName")) {
                        wx.setStorageSync('openid', openid)
                    } else {
                        //注册成功的情况
                        var u = Bmob.Object.extend("_User");
                        var query = new Bmob.Query(u);
                        query.get(user.id, {
                            success: function (result) {
                                wx.setStorageSync('own', result.get("uid"));
                            },
                            error: function (result, error) {
                                console.log("查询失败");
                            }
                        });
                        //保存用户其他信息，比如昵称头像之类的
                        wx.getUserInfo({
                            success: function (result) {
                                var userInfo = result.userInfo;
                                var nickName = userInfo.nickName;
                                var avatarUrl = userInfo.avatarUrl;
                                var u = Bmob.Object.extend("_User");
                                var query = new Bmob.Query(u);
                                query.get(user.id, {
                                    success: function (result) {
                                        result.set('nickName', nickName);
                                        result.set("userPic", avatarUrl);
                                        result.set("openid", openid);
                                        result.save();
                                    }
                                });
                            }
                        });
                    }
                }, function (err) {
                    console.log(err, 'errr');
                });
            }
        });
    }
});
