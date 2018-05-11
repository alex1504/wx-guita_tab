import API from '../../api/index'

const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        guita_detail: {},
    },
    // 获取收藏歌曲列表并存在data
    getLoveSongsByOpenId() {
        const openId = app.globalData.openid || wx.getStorageSync('openid');
        return API.getCollectChordsById(openId)
            .then(res => {
                this.setData({
                    loveSongs: res
                })
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
        let id = e.currentTarget.dataset.id;
        let loveSongs = this.data.loveSongs || [];
        let iIndex = loveSongs.indexOf(id);
        let love_flag;

        wx.showLoading({
            title: '加载中'
        });

        if (iIndex == -1) {
            love_flag = 2
            API.setCollect(openId, id, 1)
                .then(res => {
                    API.setCollectNum(id, 1)
                        .then(() => {
                            // 更新收藏列表
                            loveSongs.unshift(id);
                            wx.setStorageSync('loveSongs', loveSongs)

                            // 更新视图
                            this.setData({
                                'guita_detail.love_flag': love_flag
                            })

                            // 更新全局数据及标识
                            this.updateGlobalList(id, love_flag)


                            // 提示
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
                            // 更新收藏列表
                            loveSongs.splice(iIndex, 1);
                            wx.setStorageSync('loveSongs', loveSongs)

                            // 更新视图
                            this.setData({
                                'guita_detail.love_flag': love_flag
                            })

                            // 更新全局数据及标识--这里通过every跳出循环
                            this.updateGlobalList(id, love_flag)

                            // 提示
                            wx.showToast({
                                title: '取消收藏成功'
                            })
                        })
                })
        }
    },

    // 显示图片查看器
    showImageReader: function (e) {
        const _this = this;
        const index = e.currentTarget.dataset.index;
        wx.previewImage({
            current: _this.data.guita_detail.chord_images[index],
            urls: _this.data.guita_detail.chord_images
        })
    },
    navigateToComment: function (e) {
        const id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../comment/index?id=' + id
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        wx.showLoading({
            title: '加载中'
        })
        const id = options.id;

        this.getLoveSongsByOpenId()
            .then(() => {
                const loveSongs = this.data.loveSongs
                API.setViewNum(id);
                API.getChordById(id)
                    .then(obj => {
                        wx.hideLoading();

                        if (loveSongs.indexOf(obj.id) == -1) {
                            obj.love_flag = 1;
                        } else {
                            obj.love_flag = 2;
                        }
                        obj.song_name = obj.song_name.length > 15 ? obj.song_name.slice(0,15) + '...' : obj.song_name;
                        this.setData({
                            guita_detail: obj
                        })
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