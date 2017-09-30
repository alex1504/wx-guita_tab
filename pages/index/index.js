import API from '../../api/index'

//获取应用实例
const app = getApp()

Page({
  data: {
    imgUrls: [
      'http://qiniu1.huzerui.com/17-9-30/51986108.jpg',
      'http://qiniu1.huzerui.com/17-9-30/52228221.jpg'
    ],
    indicatorDots: false,
    autoplay: 2000,
    interval: 5000,
    duration: 1000,

    guita_list: null

  },
  //事件处理函数
  navigateToDetail: function (e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../detail/index?id=' + id
    })
  },
  onLoad: function () {
    if (app.globalData.guita_list) {
      this.setData({
        guita_list: app.globalData.guita_list
      })
      return;
    }
    wx.showLoading({
      title: '加载中'
    })
    API.getChords()
      .then(res => {
        wx.hideLoading();
        this.setData({
          guita_list: res
        })
        app.globalData.guita_list = res
      })
  }
})
