import API from '../../api/index'

//获取应用实例
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        tabs: ['最热', '最新'],
        activeTab: 0,
        hotestList: [],
        latestList: [],
        isTabFix: false,
        hotestListScrT: app.globalData.hotestListScrT || 0,
        latestListScrT: app.globalData.latestListScrT || 0
    },
    onShow: function () {
        // 若globaldata变化了，重新更改视图；恢复scrT位置
        let flag = wx.getStorageSync('globalChange')
        if (flag) {
            this.setData({
                hotestList: app.globalData.hotestList,
                latestList: app.globalData.latestList
            })
            wx.setStorageSync('globalChange', false)
        }
    },
    onReady() {
        // 取回页面滚动距离
        this.retrieveScrT()
    },
    // 取回页面滚动距离
    retrieveScrT() {
        if (wx.pageScrollTo) {
            if (this.data.activeTab == 0) {
                wx.pageScrollTo({
                    scrollTop: app.globalData.hotestListScrT || 0,
                    duration: 0
                })
            } else {
                wx.pageScrollTo({
                    scrollTop: app.globalData.latestListScrT || 0,
                    duration: 0
                })
            }
        }
    },
    onPageScroll(obj) {
        if (this.data.activeTab == 0) {
            if (obj.scrollTop >= 1000) {
                this.setData({
                    isTabFix: true
                })
            }else if(obj.scrollTop <= 900) {
                this.setData({
                    isTabFix: false
                })
            }
            this.setData({
                hotestListScrT: obj.scrollTop
            })
            app.globalData.hotestListScrT = obj.scrollTop
        } else {
            console.log(obj.scrollTop)
            if (obj.scrollTop >= 1000) {
                this.setData({
                    isTabFix: true
                })
            } else if(obj.scrollTop <= 900) {
                this.setData({
                    isTabFix: false
                })
            }
            this.setData({
                latestListScrT: obj.scrollTop
            })
            app.globalData.latestListScrT = obj.scrollTop
        }
    },
    changeTab(e) {
        const index = e.currentTarget.dataset.index;
        this.setData({
            activeTab: index
        })
        this.retrieveScrT()
    },
    //事件处理函数
    navigateToDetail: function (e) {
        const id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../detail/index?id=' + id
        })
    },
    onLoad: function (options) {
        this.setActiveTab(options.type)
        this.getGuitaData();
    },
    setActiveTab(type) {
        if (type == 'hot') {
            this.setData({
                activeTab: 0
            })
        }
        if (type == 'new') {
            this.setData({
                activeTab: 1
            })
        }
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
        } else {
            wx.showLoading({
                title: '加载中'
            })
            this.loadhotestList(app.globalData.hotestListPage)
        }

        if (app.globalData.latestList) {
            this.setData({
                latestList: app.globalData.latestList
            })
        } else {
            wx.showLoading({
                title: '加载中'
            })
            this.loadlatestList(app.globalData.latestListPage)
        }
    },
    loadhotestList(hotestListPage) {
        if (app.globalData.isLoadAllHot) return;
        wx.showLoading({
            title: '加载中',
        });
        let loveSongs = wx.getStorageSync('loveSongs') || [];
        API.getChords(hotestListPage, 10, 'view_count')
            .then(res => {
                wx.hideLoading();
                if (res.length == 0) {
                    wx.showToast({
                        title: '已加载所有数据',
                    })
                    app.globalData.isLoadAllHot = true;
                    return;
                }
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
                app.globalData.hotestListPage += 1;
            })
    },
    loadlatestList(latestListPage) {
        console.log(latestListPage)
        if (app.globalData.isLoadAllNew) return;
        wx.showLoading({
            title: '加载中',
        });
        let loveSongs = wx.getStorageSync('loveSongs') || [];

        API.getChords(latestListPage, 10, 'createdAt')
            .then(res => {
                wx.hideLoading();
                if (res.length == 0) {
                    wx.showToast({
                        title: '已加载所有数据',
                    })
                    app.globalData.isLoadAllNew = true;
                    return;
                }
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
                app.globalData.latestListPage += 1;
            })
    },
    onReachBottom() {
        if (this.data.activeTab == 0) {
            this.loadhotestList(app.globalData.hotestListPage);
        } else {
            this.loadlatestList(app.globalData.latestListPage);
        }
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
        let id = e.currentTarget.dataset.id;
        let index = e.currentTarget.dataset.index;
        let list = e.currentTarget.dataset.list;
        let loveSongs = wx.getStorageSync('loveSongs') || [];

        let iIndex = loveSongs.indexOf(id);
        let key = `${list}[${index}].love_flag`
        let love_flag;
        if (iIndex == -1) {
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