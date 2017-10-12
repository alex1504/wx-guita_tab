import API from '../../api/index'

//获取应用实例
const app = getApp()

Page({
  data: {
   
    indicatorDots: false,
    autoplay: 2000,
    interval: 5000,
    duration: 1000,

    guita_list: [],
    banner_list: []

  },
  //事件处理函数
  navigateToDetail: function (e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../detail/index?id=' + id
    })
  },
  onLoad: function () {
    this.getGuitaData();
    this.getBanner();
  },
  getGuitaData(){
    this.setData({
      guita_list: []
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
  getBanner(){
    if (app.globalData.banner_list) {
      this.setData({
        banner_list: app.globalData.banner_list
      })
      return;
    }
    API.getBanner()
      .then(res=>{
        console.log(res)
        this.setData({
          banner_list: res
        })
        app.globalData.banner_list = this.data.banner_list;
      })
  },
  loadData(page){
    if (app.globalData.isLoadAll) return;
    wx.showLoading({
      title: '加载中',
    });
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
