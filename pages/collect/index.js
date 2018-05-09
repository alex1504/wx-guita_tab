import API from '../../api/index'

//获取应用实例
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        guita_list: [],
        isTipShow: false
    },

    showDetail(e) {
        const id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../detail/index?id=' + id
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let loveSongs = wx.getStorageSync('loveSongs') || [];

        wx.showLoading({
            title: '加载中'
        })

        console.log(loveSongs)

        API.getCollectChords(loveSongs)
            .then(res => {
                // 添加标识
                res.forEach(function (obj) {
                    if (loveSongs.indexOf(obj.id) == -1) {
                        obj.love_flag = 1;
                    } else {
                        obj.love_flag = 2;
                    }
                }.bind(this))

                // 更新视图
                this.setData({
                    guita_list: res
                })

                // 若列表长度为0,显示提示
                if (res.length == 0) {
                    this.setData({
                        isTipShow: true
                    })
                }

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
    // 取消收藏
    setSongFlag(e) {
        let openId = wx.getStorageSync('openid').toString()
        let id = e.currentTarget.dataset.id;
        let index = e.currentTarget.dataset.index;
        let loveSongs = wx.getStorageSync('loveSongs') || [];

        let iIndex = loveSongs.indexOf(id);
        let love_flag = 1;

        wx.showLoading({
            title: '加载中'
        });

        API.setCollect(openId, id, 2)
            .then(res => {
                API.setCollectNum(id, 2)
                    .then(() => {
                        loveSongs.splice(iIndex, 1);
                        wx.setStorageSync('loveSongs', loveSongs)

                        // 更新视图
                        this.data.guita_list.splice(index, 1);
                        this.setData({
                            guita_list: this.data.guita_list
                        })

                        // 更新全局数据及标识
                        this.updateGlobalList(id, love_flag)

                        // 若列表长度为0,显示提示
                        if (this.data.guita_list.length == 0) {
                            this.setData({
                                isTipShow: true
                            })
                        }

                        // 提示
                        wx.showToast({
                            title: '取消收藏成功'
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