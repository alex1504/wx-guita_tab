import API from '../../api/index'
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

    API.getChords()
      .then(res => {
        wx.hideLoading();

        // 过滤歌曲
        res = res.filter(obj => {
          return loveSongs.indexOf(obj.id) > -1
        })

        // 若列表长度为0,显示提示
        if (res.length == 0) {
          this.setData({
            isTipShow: true
          })
        }

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
      })
  },

  // 取消收藏
  setSongFlag(e) {
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    let loveSongs = wx.getStorageSync('loveSongs') || [];

    console.log(index)
    let iIndex = loveSongs.indexOf(id);

    loveSongs.splice(iIndex, 1);
    // 本地存储
    wx.setStorage({
      key: "loveSongs",
      data: loveSongs
    })

    // 更新视图
    this.data.guita_list.splice(iIndex, 1);
    this.setData({
      guita_list: this.data.guita_list
    })

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