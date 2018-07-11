import API from '../../api/index'

//获取应用实例
const app = getApp()

Page({
    data: {
        indicatorDots: false,
        autoplay: 2000,
        interval: 5000,
        duration: 1000,
        hotestList: [],
        latestList: [],
        banner_list: [],
    },
    // 若globaldata变化了，重新更改视图
    onShow: function () {
        let flag = wx.getStorageSync('globalChange')
        console.log(flag)
        if (!flag) {
            return;
        }
        this.setData({
            hotestList: app.globalData.hotestList,
            latestList: app.globalData.latestList
        })
        wx.setStorageSync('globalChange', false)
    },
    navigateToDetail(e){
        const id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/detail/index?id='+id
        })
    },
    //事件处理函数
    onBannerTap: function (e) {
        const type = e.currentTarget.dataset.type;
        const href = e.currentTarget.dataset.href;
        const appid = e.currentTarget.dataset.appid;
        if (type === 'page') {
            wx.navigateTo({
                url: href
            })
        }
    },
    onLoad: function () {
        this.getLoveSongsByOpenId()
            .then(() => {
                this.getGuitaData();
                this.getBanner();
            })

    },
    getGuitaData() {
        this.setData({
            hotestList: [],
            latestList: []
        })
        if (app.globalData.hotestList) {
            this.setData({
                hotestList: app.globalData.hotestList
            })
        }
        if (app.globalData.latestList) {
            this.setData({
                latestList: app.globalData.latestList
            })
            return;
        }
        this.loadData(app.globalData.page)
    },
    getBanner() {
        if (app.globalData.banner_list) {
            this.setData({
                banner_list: app.globalData.banner_list
            })
            return;
        }
        API.getBanner()
            .then(res => {
                this.setData({
                    banner_list: res
                })
                app.globalData.banner_list = this.data.banner_list;
            })
    },
    // 获取收藏歌曲列表并存在data
    getLoveSongsByOpenId() {
        const openId = app.globalData.openid || wx.getStorageSync('openid');
        return API.getCollectChordsById(openId)
            .then(res => {
                this.setData({
                    loveSongs: res
                })
                wx.setStorageSync('loveSongs', res)
            })
    },
    loadData(page) {
        wx.showLoading({
            title: '加载中',
        });
        const loveSongs = this.data.loveSongs || [];

        const gethotestList = new Promise((resolve, reject) => {
            API.getChords(page, 8, 'view_count')
                .then(res => {
                    res.forEach(function (obj) {
                        if (loveSongs.indexOf(obj.id) == -1) {
                            obj.love_flag = 1;
                        } else {
                            obj.love_flag = 2;
                        }
                    }.bind(this))

                    res.forEach(obj => this.data.hotestList.push(obj));
                    this.setData({
                        hotestList: this.data.hotestList
                    })
                    app.globalData.hotestList = this.data.hotestList;
                    resolve()
                })
        })

        const getLatestList = new Promise((resolve, reject) => {
            API.getChords(page, 8, 'createdAt')
                .then(res => {
                    res.forEach(function (obj) {
                        if (loveSongs.indexOf(obj.id) == -1) {
                            obj.love_flag = 1;
                        } else {
                            obj.love_flag = 2;
                        }
                    }.bind(this))

                    res.forEach(obj => this.data.latestList.push(obj));
                    this.setData({
                        latestList: this.data.latestList
                    })
                    app.globalData.latestList = this.data.latestList;
                    resolve()
                })
        })

        Promise.all([gethotestList, getLatestList])
            .then(() => {
                wx.hideLoading();
            })

    },
    // 更新全局数据及标识--这里通过every跳出循环
    updateGlobalList(songId, flag) {
        wx.setStorageSync('globalChange', true)
        let hotestList = app.globalData.hotestList
        let latestList = app.globalData.latestList
        let isNotFind = hotestList.every((obj, index) => {
            if (obj.id == songId) {
                let temp = obj;
                temp.love_flag = flag
                hotestList.splice(index, 1, temp)
                return false
            } else {
                return true
            }
        })
        // 若歌曲属于最热列表
        if (!isNotFind) {
            app.globalData.hotestList = hotestList
            return;
        }
        // 若歌曲属于最新列表
        latestList.every((obj, index) => {
            if (obj.id == songId) {
                let temp = obj;
                temp.love_flag = flag
                latestList.splice(index, 1, temp)
                return false
            } else {
                return true
            }
        })
        app.globalData.latestList = latestList

    },
    // 收藏或取消收藏
    setSongFlag(e) {
        let openId = wx.getStorageSync('openid').toString()
        let id = e.currentTarget.dataset.id
        let index = e.currentTarget.dataset.index
        let loveSongs = this.data.loveSongs || []

        let list = e.currentTarget.dataset.list;
        let iIndex = loveSongs.indexOf(id);
        let key = `${list}[${index}].love_flag`
        let love_flag;

        wx.showLoading({
            title: '加载中'
        });

        if (iIndex == -1) {
            // 收藏
            love_flag = 2

            API.setCollect(openId, id, 1)
                .then(res => {
                    API.setCollectNum(id, 1)
                        .then(() => {
                            loveSongs.unshift(id);
                            wx.setStorageSync('loveSongs', loveSongs)

                            this.setData({
                                [key]: love_flag
                            })

                            // 更新全局数据及标识
                            this.updateGlobalList(id, love_flag)

                            wx.showToast({
                                title: '收藏成功'
                            })
                        })
                })

        } else {
            // 取消收藏
            love_flag = 1

            API.setCollect(openId, id, 2)
                .then(res => {
                    API.setCollectNum(id, 2)
                        .then(() => {
                            loveSongs.splice(iIndex, 1);
                            wx.setStorageSync('loveSongs', loveSongs)

                            this.setData({
                                [key]: love_flag
                            })

                            // 更新全局数据及标识
                            this.updateGlobalList(id, love_flag)

                            wx.showToast({
                                title: '取消收藏成功'
                            })
                        })
                })

        }
    }

})