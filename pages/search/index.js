import API from '../../api/index'

const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        searchTxt: '',
        searchSongs: [],
        isTipShow: false,
        hotSongs: []
    },
    // 事件
    onSearch(e) {
        this.setData({
            searchSongs: []
        })

        const searchTxt = this.data.searchTxt;
        const loveSongs = wx.getStorageSync('loveSongs') || [];

        wx.showLoading({
            title: '查找中...'
        })
        API.searchChord(searchTxt)
            .then(res => {
                console.log(res)
                wx.hideLoading();
                if (!res || res && res.length == 0) {
                    this.setData({
                        isTipShow: true
                    })
                    return;
                }

                res.forEach(function (obj) {
                    if (loveSongs.indexOf(obj.id) == -1) {
                        obj.love_flag = 1;
                    } else {
                        obj.love_flag = 2;
                    }
                }.bind(this))

                this.setData({
                    searchSongs: res
                })

                this.setData({
                    isTipShow: false
                })

            })
    },
    bindSearchInput(e) {
        if (!e.detail.value) {
            this.setData({
                isTipShow: false
            })
        }
        this.setData({
            searchTxt: e.detail.value
        })
    },
    showDetail(e) {
        const id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../detail/index?id=' + id
        })
    },
    // 更新全局数据及标识--这里通过every跳出循环
    updateGlobalList(songId, flag) {
        wx.setStorageSync('globalChange', true)
        let hotestList = app.globalData.hotestList
        let latestList = app.globalData.latestList
        hotestList.every((obj, index) => {
            if (obj.id == songId) {
                let temp = obj;
                temp.love_flag = flag
                hotestList.splice(index, 1, temp)
                return false
            }
            if (index == hotestList.length - 1) {
                latestList.every((obj, index) => {
                    if (obj.id == songId) {
                        let temp = obj;
                        temp.love_flag = flag
                        latestList.splice(index, 1, temp)
                        return false
                    }
                })
            }
        })
        app.globalData.hotestList = hotestList
        app.globalData.latestList = latestList
    },
    // 收藏或取消收藏
    setSongFlag(e) {
        let openId = wx.getStorageSync('openid').toString()
        let id = e.currentTarget.dataset.id;
        let index = e.currentTarget.dataset.index;
        let loveSongs = wx.getStorageSync('loveSongs') || [];
        let love_flag;

        let iIndex = loveSongs.indexOf(id);
        if (iIndex == -1) {
            love_flag = 2
            API.setCollect(openId, id, 1)
                .then(res => {
                    API.setCollectNum(id, 1)
                        .then(() => {
                            loveSongs.unshift(id);
                            wx.setStorageSync('loveSongs', loveSongs)

                            // 更新视图
                            let key = 'searchSongs[' + index + '].love_flag'

                            // 注意setData对数组的index只能是固定整数，不能动态，因此需提前用变量存起拼接好的key，这是因为在key中[]中的非整数值会被识别为变量
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

                            // 更新视图
                            let key = 'searchSongs[' + index + '].love_flag'
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
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.showLoading({
            title: '加载中...'
        });
        API.getChords(1, 999999, 'searchCount')
            .then(res => {
                wx.hideLoading();
                res.sort((a, b) => {
                    a.search_count = typeof a.search_count == 'undefined' ? 0 : a.search_count
                    b.search_count = typeof b.search_count == 'undefined' ? 0 : b.search_count
                    return b.search_count - a.search_count
                })
                // 搜索排名前12
                let filterArr = res.slice(0, 12);
                // 搜索量至少大于等于30
                filterArr = filterArr.filter(obj => {
                    return obj.search_count >= 30
                });
                this.setData({
                    hotSongs: filterArr
                })
            })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})