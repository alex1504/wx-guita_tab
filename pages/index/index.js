import API from '../../api/index'

//获取应用实例
const app = getApp()

Page({
  data: {
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,

    guita_list: null

  },
  //事件处理函数
  navigateToDetail: function(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../detail/index?id='+id
    })
  },
  onLoad: function () {
    API.getChords()
      .then(res=>{
        this.setData({
          guita_list: res
        })
        app.globalData.guita_list = res
      })
  }
})
