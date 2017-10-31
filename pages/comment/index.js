import API from '../../api/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotList: [],
    allList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const songId = options.id;
    API.getComments(songId)
        .then(res=>{
          this.setData({
            allList: res
          })
          res = res.sort((obj1,obj2)=>{
            return obj2.star - obj1.star
          })
          res = res.slice(0, 5);
          res = res.filter(obj=>{
            return obj.star > 1
          })
          this.setData({
            hotList: res
          })
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