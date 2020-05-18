// pages/admin_main/admin_main.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  seat_change(){
    wx.navigateTo({
      url: '../../pages/admin_seat/admin_seat'
  })
  },
  search_weigui(){
    wx.navigateTo({
      url: '../../pages/admin_weigui/admin_weigui'
  })
  },
  search_yuyue(){
    wx.navigateTo({
      url: '../../pages/admin_yuyue/admin_yuyue'
  })
  },
  code_product(){
    wx.navigateTo({
      url: '../../pages/code_image/code_image'
  })

  }
})
