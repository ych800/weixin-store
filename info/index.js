
/**
 * pages/store/info/index.js
 * 商户首页
 * 
 * @author dufu
 */
var _ = require("../../../utils/underscore");
var dataArr = require('../getStore.js');
var app = getApp();

Page(_.extend({

  /**
   * 页面的初始数据
   */
  data: {
    /*storeInfo: {
        storeName:'周琦奶茶店',
        phoneNum:'13343473729',
        address:'上海市曹杨路 999 号',
        logoUrl:'../../../resource/img/banner.png',//logo 图
        bgUrl:'../../../resource/img/banner.png'//背景图
    }*/
      storeInfo: dataArr.dataJson[0].data
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      wx.request({
        url: "http://localhost:8088/wxapp/getStore.json",
        data: {
            id: 1
        },
        success: function (res) {
            console.log(res);
        }
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
}, app.commpm));