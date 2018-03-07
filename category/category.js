// pages/store/category/category.js
var _ = require("../../../utils/underscore");
var dataArr = require('../getStore.js');
/*
******:购物车传参数;
    {
        "shopcart":{
            "id": 1,
            "userId":1,
            "storeId":1,
            "product":{
                "id":1
            },
            "quantity":6,
            "productSku":{
                "id":1
            }
        }
    }
*/
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //菜单列表
    storeInfo:[],
    //左侧菜单栏显示index 下标
    currentIndex:0,
    //右侧显示模块id
    scrollView: 'proDetail0',
    deviceHeight:null,
    deviceWidth:null,
    //购物车
    //shoppingCarData:[],
    //规格弹出框
    isModalHide:true,
    menuOffset:null,
    //购物车
    showCarModal:false,
    shoppingCar:{
        //showCarModal: false,
        data:[]
    },
    
  },

  //关闭规格modal
  closeModal:function(){
    //清除数据:
    this.setData({
        isModalHide:true
    })
  },

  //菜单切换:
  toggleMenu:function(e){
     this.setData({
         'currentIndex': e.currentTarget.dataset.curIndex,
         'scrollView': 'proDetail' + e.currentTarget.dataset.curIndex
     });
  },

  //产品列表导航:
  navigateChange: function (e) {
      console.log('点击导航');
      /*wx.navigateTo({
          url: '',
      });*/
  },
 
  //滚动
  scrollPage:function(e){
    var $this = this;
    var selectorQuery = wx.createSelectorQuery();
    selectorQuery.selectAll('#' + e.currentTarget.id + ' .detail_view_item').boundingClientRect(function (rects) {
        var cur_index = 0;
        if (rects.length>0){
            rects.forEach(function (rect) {
                if(rect.top <= 0){
                    cur_index = rect.dataset.index;
                    return false;
                }
            });
            $this.setData({
                'currentIndex': cur_index
            },function(){
                var footerHeight = 0;
                wx.createSelectorQuery().select('#footer').boundingClientRect(function (r) { 
                    footerHeight = r.height;
                }).exec();
                wx.createSelectorQuery().select('.menuList .item.active').boundingClientRect(function (r) {
                    if (r.bottom > $this.data.deviceHeight - footerHeight){
                        var n = $this.data.deviceHeight - r.top;
                        $this.setData({
                            'menuOffset': (n + r.height)
                        });
                    }else if(r.top <0){
                        $this.setData({
                            'menuOffset': 0
                        });
                    }
                }).exec()
            });
        }
    }).exec()
  },

  //加
  countAdd: function(e){
    console.log(e);
    var index = e.currentTarget.dataset.index;
    var temp = this.data.shoppingCar.data;
        temp[index].count +=1;
      this.setData({
          shoppingCar:{
              data: temp,
              //showCarModal: this.data.shoppingCar.showCarModal,
          },
          isModalHide: false,
      });
  },

  //减
  countReduce: function (e) {
    var index = e.currentTarget.dataset.index;
    var temp = this.data.shoppingCar.data;
        temp[index].count -= 1;
    if (temp[index].count < 0) {
        temp[index].count = 0;
    }
    this.setData({
        shoppingCar:{
            data: temp,
            //showCarModal: this.data.shoppingCar.showCarModal,
        } 
    });  
  },

  //清空购物车：
  clearCar:function(){
    console.log('清空购物车..');
    wx.showModal({
        title: '清空购物车？',
        content: '',
        cancelText:'取消',
        cancelColor:'#2D7DDF',
        confirmText:'清空',
        confirmcolor:'#2D7DDF',
        success:function(res){
            if(res.cancel){
                console.log('取消清空购物车...');
            }else if(res.confirm){
                console.log('清空购物车...');
            }
            console.log('清空')
        },
        fail:function(err){
            console.log(err);
        }
    })
  },
  //显示购物车:
  showShoppingCar:function(e){
      var $this = this;
      if (e.currentTarget.id == 'carBtn'||e.target.id == 'carBtn' || e.target.id == 'carModal'){
          this.setData({
              showCarModal: !$this.data.showCarModal,
          })
      }
    
  },
  //结算
  settlement:function(){
      
      this.setData({
          showCarModal:false,
      });
      wx.showActionSheet({
          itemList: ['外卖', '堂吃', '自带'],
          success: function (res) {
              console.log(res);
          },
          fail: function (res) {
              console.log(res.errMsg)
          }
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      //获取到数据,遍历生成购物车数据模型;,模拟数据: dataArr.dataJson[0].data
      var item = dataArr.dataJson[0].data.listOfCategory[this.data.currentIndex].listOfProduct;
      var $this = this;
      if(item && item.length){
        for (var i = 0; i < item.length; i++) {
            //产品名称, 产品id, 数量,  类别id
            // name ,   id,    count, categoryId
            this.data.shoppingCar.data.push({
                'name':item[i].name,
                'id':item[i].id,
                'saleprice': item[i].saleprice,
                'categoryId':item[i].categoryId,
                'count':0 //默认初始化为0                
            });
        }
    }
    console.log(this.data.shoppingCar.data);
      //获取设备信息;
      wx.getSystemInfo({
          success: function(res) {
              console.log(res);
              $this.setData({
                  'deviceHeight':res.windowHeight,
                  'deviceWidth': res.windowWidth
              })
          },
      })

      //设置值;
      this.setData({
          'storeInfo': dataArr.dataJson[0].data,
          'shoppingCar': this.data.shoppingCar
      });

      //set navigationBar title
      wx.setNavigationBarTitle({
          title: dataArr.dataJson[0].data.name,
      });

      
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
});

/*
    //一元二次方程: y = -2x2 + bx + c; 
    ax2+bx =-c
    a<0;假设a = -2, 开口向下; 
    c是线和y轴焦点(0,c); 
    抛物线与x轴焦点([-b±√(b^2-4ac)]/(2a),0); x轴焦点有两个坐标;
    -b±√(b^2-4ac)]/(2a) = x0;
    求解 b = a*x0^2 -c;
    y = 
    
*/
//js 
// width, height 是目标元素的 的宽,高; 
function fly(e){
    var a = -1;
    var c = this.data.deviceHeight - e.detail.scrollTop;
    var x0 = -(this.data.deviceWidth - e.dtail.offsetLeft); //x0<0,x轴焦点;
    var b = a*Math(x0,2)-c;//求解 b;
    /* 抛物线方程式:y = a*Math.pom(x,2) + b*x + c ; */
    var arr = [];
    for(var i=0;i<10;i++){
        var x = Math.round(i/10 * c);
        var y = Math.round(a * Math.pom(x, 2) + b * x + c);
        arr.push(i*10+'%{-webkit-transform3d:('+x+'px,'+y+'px,0)}');
    }
    console.log(arr);
}
//设置宽度:关键帧 :
/*@-webkit-keyframes:fly{
    0%{-webkit-transform2d:(x0,y0)},
    10%{-webkit-transform2d:(0,0)},
    20%{-webkit-transform2d:(0,0)},
    30%{-webkit-transform2d:(0,0)},
    40%{-webkit-transform2d:(0,0)},
    50%{-webkit-transform2d:(0,0)},
    60%{-webkit-transform2d:(0,0)},
    70%{-webkit-transform2d:(0,0)},
    80%{-webkit-transform2d:(0,0)},
    90%{-webkit-transform2d:(0,0)},
    100%{-webkit-transform2d:(s,0)},
}*/