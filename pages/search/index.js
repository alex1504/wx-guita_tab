import API from '../../api/index'

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchTxt: '',
    searchSongs: [],
    isTipShow: false
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
        wx.hideLoading();
        if (res.length == 0) {
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
  // 收藏或取消收藏
  setSongFlag(e) {
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    let loveSongs = wx.getStorageSync('loveSongs') || [];

    let iIndex = loveSongs.indexOf(id);
    if (iIndex == -1) {
      loveSongs.push(id);
      // 本地存储
      wx.setStorage({
        key: "loveSongs",
        data: loveSongs
      })
      // 注意setData对数组的index只能是固定整数，不能动态，因此需提前用变量存起拼接好的key，这是因为在key中[]中的非整数值会被识别为变量
      // 更新视图
      let key = 'searchSongs[' + index + '].love_flag'
      this.setData({
        [key]: 2
      })
      // 提示
      wx.showToast({
        title: '收藏成功'
      })
    } else {
      loveSongs.splice(iIndex, 1);
      // 本地存储
      wx.setStorage({
        key: "loveSongs",
        data: loveSongs
      })
      // 更新视图
      let key = 'searchSongs[' + index + '].love_flag'
      this.setData({
        [key]: 1
      })
      // 提示
      wx.showToast({
        title: '取消收藏成功'
      })
    }

    // let id = e.currentTarget.dataset.id;
    // let index = e.currentTarget.dataset.index;
    // let flag = this.data.searchSongs[index].love_flag == 1 ? 2 : 1;
    // console.log(flag)
    // API.setSongFlag(id,flag)
    //   .then(res=>{
    //     const key = 'searchSongs['+index+'].love_flag'
    //     console.log(key)
    //     // 注意setData对数组的index只能是固定整数，不能动态，因此需提前用变量存起拼接好的key，这是因为在key中[]中的非整数值会被识别为变量
    //     this.setData({
    //       [key] : flag
    //     })
    //   })
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