import API from '../../api/index'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    guita_detail: {}
  },

  // 收藏或取消收藏
  setSongFlag(e) {
    let id = e.currentTarget.dataset.id;
    let loveSongs = wx.getStorageSync('loveSongs') || [];

    let iIndex = loveSongs.indexOf(id);
    if (iIndex == -1) {
      API.setCollectNum(id, 1)
        .then(()=>{
          loveSongs.push(id);
          // 本地存储
          wx.setStorage({
            key: "loveSongs",
            data: loveSongs
          })
          // 更新视图
          this.setData({
            'guita_detail.love_flag': 2
          })
          // 提示
          wx.showToast({
            title: '收藏成功'
          })
        })
      
    } else {
      API.setCollectNum(id, 2)
        .then(() => {
          loveSongs.splice(iIndex, 1);
          // 本地存储
          wx.setStorage({
            key: "loveSongs",
            data: loveSongs
          })
          // 更新视图
          this.setData({
            'guita_detail.love_flag': 1
          })
          // 提示
          wx.showToast({
            title: '取消收藏成功'
          })
        })
     
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    

    wx.showLoading({
      title: '加载中'
    })
    const id = options.id;
    const loveSongs = wx.getStorageSync('loveSongs') || [];

    API.setViewNum(id);
    API.getChordById(id)
      .then(obj => {
        wx.hideLoading();


        if (loveSongs.indexOf(obj.id) == -1) {
          obj.love_flag = 1;
        } else {
          obj.love_flag = 2;
        }

        this.setData({
          guita_detail: obj
        })
        console.log(obj)

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