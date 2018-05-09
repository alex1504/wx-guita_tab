import API from '../../api/index'

Page({

    /**
     * 页面的初始数据
     */
    data: {
        contact: '',
        feedback: ''
    },
    onInputContact(e) {
        this.setData({
            contact: e.detail.value
        })
    },
    onInputTextarea(e) {
        this.setData({
            feedback: e.detail.value
        })
    },
    submit() {
        const contact = this.data.contact
        const feedback = this.data.feedback
        if (!contact || !feedback) {
            wx.showToast({
                title: '内容为空',
            })
            return;
        }
        API.submitFeedback(contact, feedback)
            .then(res => {
                wx.showToast({
                    title: '提交反馈成功',
                })
            })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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