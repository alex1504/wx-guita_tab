import API from '../../api/index'

const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        songId: '',
        hotList: [],
        allList: [],
        inputTip: '评论曲谱',
        inputText: '',
        to: '',
        toAvatar: '',
        toContent: '',
        isFocus: false,
        scrollTop: 0,
        openid: app.globalData.openid
    },
    scrollTopFun: function (e) {
        console.log(e)
        if (e.detail.scrollTop > 300) {
            this.setData({
                'scrollTop.goTop_show': true
            });
        } else {
            this.setData({
                'scrollTop.goTop_show': false
            });
        }
    },
    // 兼容性较好
    goTop: function (e) {
        if (wx.pageScrollTo) {
            wx.pageScrollTo({
                scrollTop: 0
            })
        }
    },
    // 调试器没问题，真机下有问题
    backToTop: function (e) {
        let _top = this.data.scrollTop;
        if (_top == 1) {
            _top = 0;
        } else {
            _top = 1;
        }
        this.setData({
            'scrollTop': _top
        });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const songId = options.id;
        this.setData({
            songId: songId
        })
        this.loadComments(songId)

    },
    loadComments(songId) {
        const openid = this.data.openid
        return new Promise((resolve, reject) => {
            wx.showToast({
                icon: 'loading',
                title: '加载中'
            })
            this.setData({
                allList: [],
                hostList: []
            })
            API.getComments(songId)
                .then(res => {
                    console.log(res);
                    res.forEach(obj => {
                        if (obj.star_by && obj.star_by.indexOf(openid) !== -1) {
                            obj.isStar = true;
                        } else {
                            obj.isStar = false;
                        }
                    })
                    res = res.sort((obj1, obj2) => {
                        return obj2.createdAt - obj1.createdAt
                    })
                    this.setData({
                        allList: res
                    })
                    res = res.sort((obj1, obj2) => {
                        return obj2.star - obj1.star
                    })
                    res = res.slice(0, 5);
                    res = res.filter(obj => {
                        return obj.star > 20
                    })
                    this.setData({
                        hotList: res
                    })
                    resolve()
                })
        })

    },
    toggleGoodComment(e) {
        const id = e.currentTarget.dataset.id;
        const openid = wx.getStorageSync('openid')
        const songId = this.data.songId;
        API.toggleLoveComment(openid, id)
            .then(res => {
                this.loadComments(songId)
                    .then(() => {
                        wx.showToast({
                            title: res.msg
                        })
                    })

            })
    },
    replyComment(e) {
        const id = e.currentTarget.dataset.id;
        const from = e.currentTarget.dataset.from;
        const fromAvatar = e.currentTarget.dataset.fromAvatar;
        const content = e.currentTarget.dataset.content;

        this.setData({
            id: id,
            inputTip: `回复：${from}`,
            to: from,
            toAvatar: fromAvatar,
            toContent: content,
            isFocus: true,
            scrollTop: 0
        })

        this.goTop();
        console.log(e)
    },
    cancleReplyTo() {
        this.setData({
            id: '',
            inputTip: '评论曲谱',
            to: '',
            toAvatar: '',
            toContent: '',
            inputText: ''
        })
    },
    bindInput(e) {
        this.setData({
            inputText: e.detail.value
        })
    },
    launchComment() {
        if (!this.data.inputText.replace(/\s/g, '')) {
            wx.showToast({
                title: '内容为空',
                icon: ''
            })
            return;
        }
        API.addComment({
            'songId': this.data.songId,
            'from': app.globalData.from,
            'fromAvatar': app.globalData.fromAvatar,
            'content': this.data.inputText,
            'to': this.data.to,
            'toAvatar': this.data.toAvatar,
            'toContent': this.data.toContent
        }).then(res => {
            this.loadComments(this.data.songId)
                .then(() => {
                    wx.showToast({
                        title: '发布评论成功'
                    })
                    this.cancleReplyTo();
                })
        }).catch(err => {
            wx.showToast({
                title: '发布评论失败'
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
        console.log(app.globalData)
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