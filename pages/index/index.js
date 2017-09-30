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

    guita_list: [],

  },
  //事件处理函数
  navigateToDetail: function (e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../detail/index?id=' + id
    })
  },
  onLoad: function () {
    this.setData({
      guita_list:[]
    })
    if (app.globalData.guita_list) {
      this.setData({
        guita_list: app.globalData.guita_list
      })
      return;
    }
    wx.showLoading({
      title: '加载中'
    })
    
    this.loadData(app.globalData.page)
  },
  loadData(page){
    if (app.globalData.isLoadAll) return;
    API.getChords(page)
      .then(res => {
        wx.hideLoading();
        if(res.length == 0){
          wx.showToast({
            title: '已加载所有数据',
          })
          app.globalData.isLoadAll = true;
          return;
        }
        res.forEach(obj => this.data.guita_list.push(obj));
        this.setData({
          guita_list: this.data.guita_list
        })
        app.globalData.guita_list = this.data.guita_list;
        app.globalData.page += 1;
      })
  },
  onReachBottom(){
    this.loadData(app.globalData.page);
  }

})
