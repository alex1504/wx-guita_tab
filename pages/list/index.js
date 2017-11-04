import API from '../../api/index'

//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ['最热','最新'],
    activeTab: 0,
    hotList: []
  },
  changeTab(e){
    const index = e.currentTarget.dataset.index;
    this.setData({
      activeTab: index
    })
  },
  //事件处理函数
  navigateToDetail: function (e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../detail/index?id=' + id
    })
  },
  onLoad: function () {
    console.log(111)
    this.getGuitaData();
  },
  getGuitaData() {
    this.setData({
      hotList: [],
      newList: []
    })
    if (app.globalData.hotList) {
      this.setData({
        hotList: app.globalData.hotList
      })
    }else{
      wx.showLoading({
        title: '加载中'
      })
      this.loadHotList(app.globalData.hotListPage)
    }
    
    if (app.globalData.newList) {
      this.setData({
        newList: app.globalData.newList
      })
    } else {
      wx.showLoading({
        title: '加载中'
      })
      this.loadNewList(app.globalData.newListPage)
    }
  },
  loadHotList(hotListPage) {
    if (app.globalData.isLoadAllHot) return;
    wx.showLoading({
      title: '加载中',
    });
    const loveSongs = wx.getStorageSync('loveSongs') || [];
    API.getChords(hotListPage, 10, 'view_count')
      .then(res => {
        wx.hideLoading();
        if (res.length == 0) {
          wx.showToast({
            title: '已加载所有数据',
          })
          app.globalData.isLoadAllHot = true;
          return;
        }
        res.forEach(function (obj) {
          if (loveSongs.indexOf(obj.id) == -1) {
            obj.love_flag = 1;
          } else {
            obj.love_flag = 2;
          }
        }.bind(this))


        res.forEach(obj => this.data.hotList.push(obj));
        this.setData({
          hotList: this.data.hotList
        })
        app.globalData.hotList = this.data.hotList;
        app.globalData.hotListPage += 1;
      })
  },
  loadNewList(newListPage) {
    if (app.globalData.isLoadAllNew) return;
    wx.showLoading({
      title: '加载中',
    });
    const loveSongs = wx.getStorageSync('loveSongs') || [];
    API.getChords(newListPage, 10, 'createdAt')
      .then(res => {
        wx.hideLoading();
        if (res.length == 0) {
          wx.showToast({
            title: '已加载所有数据',
          })
          app.globalData.isLoadAllNew = true;
          return;
        }
        res.forEach(function (obj) {
          if (loveSongs.indexOf(obj.id) == -1) {
            obj.love_flag = 1;
          } else {
            obj.love_flag = 2;
          }
        }.bind(this))


        res.forEach(obj => this.data.newList.push(obj));
        this.setData({
          newList: this.data.newList
        })
        app.globalData.newList = this.data.newList;
        app.globalData.newListPage += 1;
      })
  },
  onReachBottom() {
    if(this.data.activeTab == 0){
      this.loadHotList(app.globalData.hotListPage);
    }else{
      this.loadNewList(app.globalData.newListPage);
    }
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
