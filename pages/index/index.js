import API from '../../api/index'

//获取应用实例
const app = getApp()

Page({
  data: {
    indicatorDots: false,
    autoplay: 2000,
    interval: 5000,
    duration: 1000,
    hotestList: [],
    latestList: [],
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
  getGuitaData() {
    this.setData({
      hotestList: [],
      latestList: []
    })
    if (app.globalData.hotestList) {
      this.setData({
        hotestList: app.globalData.hotestList
      })
    }
    if (app.globalData.latestList) {
      this.setData({
        latestList: app.globalData.latestList
      })
      return;
    }
    this.loadData(app.globalData.page)
  },
  getBanner() {
    if (app.globalData.banner_list) {
      this.setData({
        banner_list: app.globalData.banner_list
      })
      return;
    }
    API.getBanner()
      .then(res => {
        console.log(res)
        this.setData({
          banner_list: res
        })
        app.globalData.banner_list = this.data.banner_list;
      })
  },
  loadData(page) {
    wx.showLoading({
      title: '加载中',
    });
    const loveSongs = wx.getStorageSync('loveSongs') || [];

    const gethotestList = new Promise((resolve, reject) => {
      API.getChords(page, 6, 'view_count')
        .then(res => {
          res.forEach(function (obj) {
            if (loveSongs.indexOf(obj.id) == -1) {
              obj.love_flag = 1;
            } else {
              obj.love_flag = 2;
            }
          }.bind(this))

          res.forEach(obj => this.data.hotestList.push(obj));
          this.setData({
            hotestList: this.data.hotestList
          })
          app.globalData.hotestList = this.data.hotestList;
          resolve()
        })
    })

    const getLatestList = new Promise((resolve, reject) => {
      API.getChords(page, 6, 'createdAt')
        .then(res => {
          res.forEach(function (obj) {
            if (loveSongs.indexOf(obj.id) == -1) {
              obj.love_flag = 1;
            } else {
              obj.love_flag = 2;
            }
          }.bind(this))

          res.forEach(obj => this.data.latestList.push(obj));
          this.setData({
            latestList: this.data.latestList
          })
          app.globalData.latestList = this.data.latestList;
          resolve()
        })
    })

    Promise.all([gethotestList, getLatestList])
      .then(() => {
        wx.hideLoading();
      })

  },
  // 收藏或取消收藏
  setSongFlag(e) {
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    let list = e.currentTarget.dataset.list;
    let loveSongs = wx.getStorageSync('loveSongs') || [];

    let iIndex = loveSongs.indexOf(id);
    let key = `${list}[${index}].love_flag`
    if (iIndex == -1) {
      loveSongs.push(id);
      wx.setStorage({
        key: "loveSongs",
        data: loveSongs
      })
      this.setData({
        [key]: 2
      })
      wx.showToast({
        title: '收藏成功'
      })
    } else {
      loveSongs.splice(iIndex, 1);
      wx.setStorage({
        key: "loveSongs",
        data: loveSongs
      })
      this.setData({
        [key]: 1
      })
      wx.showToast({
        title: '取消收藏成功'
      })
    }
  }

})
