//获取应用实例
const app = getApp()
var util = require('../../utils/util.js');  
let db_position_info=wx.cloud.database().collection("position_info");
let db_yuyue=wx.cloud.database().collection("yuyue");
let db_yuyue_all=wx.cloud.database().collection("yuyue_all");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    user_id:"",
    hidden:true,
    position_id:"",
    click1:0,

    /**
     * 选中的位置
     */
    list: [],
    /**
     * 1 可预订 
     * 2 有人 
     * 3 已选择
     * 4 我的预订
     */
    obj : [],

    //判断是否需要给新用户健预约表 
    yuyue_creat:1,


    /*楼层信息
    */
    floor: ['1F','2F','3F','4F','5F','6F'],
    floorIndex: 0,
    
    time: [
      "8:00",
      "9:00",
      "10:00",
      "11:00",
      "12:00",
      "13:00",
      "14:00",
      "15:00",
      "16:00",
      "17:00",
      "18:00",
      "19:00",
      "20:00",
      "21:00",
      "22:00",
    ],
    Time: [
      "8:00-9:00",
      "9:00-10:00",
      "10:00-11:00",
      "11:00-12:00",
      "12:00-13:00",
      "13:00-14:00",
      "14:00-15:00",
      "15:00-16:00",
      "16:00-17:00",
      "17:00-18:00",
      "18:00-19:00",
      "19:00-20:00",
      "20:00-21:00",
      "21:00-22:00",
    ],
       
    area: [
      "1号位",
      "2号位",
      "3号位",
      "4号位",
      "5号位",
      "6号位",
      "7号位",
      "8号位",
      "9号位",
      "10号位",
      "11号位",
      "12号位",
      "13号位",
      "14号位",
      "15号位",
      "16号位",
      "17号位",
      "18号位",
      "19号位",
      "20号位",
      "21号位",
      "22号位",
      "23号位",
      "24号位",
      "25号位",
      "26号位",
      "27号位",
      "28号位",
      "29号位",
      "30号位",
      "31号位",
      "32号位",
      "33号位",
      "34号位",
      "35号位",
      "36号位",
    ],

    date: [
        '星期一',
        '星期二',
        '星期三',
        '星期四',
        '星期五',
        '星期六',
        '星期天',
    ],
    /**
     * 日期选中
     */
    datePosition: 0,

    /**
     * 上拖动效果越界
     */
    offsetTop: 0,
    /**
     * 做拖动效果越界
     */
    offsetLeft: 0,
    /**
     * 调整左边的滚动条位置
     */
    left: 0,
    /**
     * 调整上的滚动条位置
     */
    top: 0,
    /**
     * 选座区域最小高度
     */
    min: 100,
    /**
     * 选座区域最大高度
     */
    max: 700,

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
        let that=this
        var day_type=new Date().getDay()-1 
        this.setData({
          datePosition:day_type
        })
        //利用云函数获取位置信息
        wx.cloud.callFunction({
          name: "get_status", 
          data :{
           floorIndex : 0,
            datePosition:0
          },
          success(res){       
            that.setData({
               obj:res.result.data[0].position_status
            })
           },
          fail(err){
            console.log("失败",err)
          }
        })

    var h = this.data.time.length
    var w = this.data.area.length

    var offsetH = h * 58 + h * 2
    var offsetW = w * 96 + h * 2
    var currentH = offsetH

    /**
     * 设置最高高度
     */
    if (offsetH > this.data.max) {
      // offsetH = this.data.max
      currentH = this.data.max
    }
    this.setData({
      offsetH: offsetH,
      offsetW: offsetW,
      currentH: currentH
    })

  },

  //楼层选择--->对应的座位界面需要刷新（从数据库调用position_info表）
  bindFloorPickerChange: function (e) {
    if(this.data.click1%2!=0){
      wx.showToast({
        title: '切换楼层前先点击提交',
        icon:"none",
        duration:2000
      })
      return
    }
    let that=this
    this.data.floor.forEach((ele, index) => {

    });
    this.setData({
      floorIndex: e.detail.value,
    })

    wx.cloud.callFunction({
      name: "get_status", 
      data :{
      floorIndex : parseInt(this.data.floorIndex),
      datePosition:parseInt(this.data.datePosition)
      },
      success(res){     
        that.setData({
          obj:res.result.data[0].position_status
        })
      },
      fail(err){
        console.log("失败",err)
      }
    })
  },
  
  /**
   * 选择日期--->对应的座位界面需要刷新（从数据库调用position_info表）
   */
  chooseDate: function(e) {
    var index = parseInt(e.currentTarget.id)
    var day_type=new Date().getDay()-1  
    console.log("day_type",day_type)   
    if(index<day_type){
      wx.showToast({
        title: '今天之前的不能再预约哦！',
        icon:"none",
        duration:2000
      })
      return
    }

    if(this.data.click1%2!=0){
      wx.showToast({
        title: '切换日期前先确定提交',
        icon:"none",
        duration:2000
      })
      return
    }
    let that=this
    
    //this.data.datePosition取值为0，1，2，3，4,5,6,
    if (index != this.data.datePosition) {
      this.setData({
        datePosition: index
      })
      wx.cloud.callFunction({
        name: "get_status", 
        data :{
        floorIndex : parseInt(this.data.floorIndex),
        datePosition:parseInt(this.data.datePosition)
        },
        success(res){
          // console.log("日期选择成功",res.result)
          that.setData({
            obj:res.result.data[0].position_status
          })
        },
        fail(err){
          console.log("失败",err)
        }
      })

    }
  },
  bindChange: function(e) {

    var x = e.detail.x
    var y = e.detail.y
    var offsetTop = 0;
    if (y > 0) {
      offsetTop += y
    }
    var offsetLeft = 0;
    if (x > 0) {
      offsetLeft += x;
    }
    this.setData({
      left: x,
      offsetLeft: offsetLeft,
      offsetTop: offsetTop,
      top: y
    })
  },
  choose: function(e) {
    let that=this
    var p = e.currentTarget.id.split(",")

    //i行号（从0开始）
    //j列号（从0开始）   
    var i = parseInt(p[0])
    var j = parseInt(p[1])
    var id = i + ',' + j // 1,2 
    this.setData({
      position_id:id
    })
    var item = this.data.obj[i][j]
      
    var status = item

    /**
     * 可预订
     */
    if (status == 1) {
      this.data.click1++
      that.data.obj[i][j]=3
      /**
       * 生成框里的数据
       */
      this.data.list.push({       
        floorIndex:this.data.floorIndex,
        datePosition:this.data.datePosition,
        time_id:i,
        area:this.data.area[j],
        id: id,       
      })
      /**
       * 更新全局数据
       */
      this.setData({
        obj: this.data.obj,
        list: this.data.list
      })
    } else if (status == 3) {
      /**
       * 已选择 取消选择
       */   
      item = 1 //将其状态恢复
      that.data.obj[i][j]=1
      this.data.click1++
      for (var m = 0; m < this.data.list.length; m++) {
        if (this.data.list[m].id == id) {
          this.data.list.splice(m, 1)//从列表中删除
          break;
        }
      }
      /**
       * 全局赋值
       */
      this.setData({
        obj: this.data.obj,
        list: this.data.list
      })
    }else if (status == 2) {
      wx.showToast({
        title: '已被预定',
        icon: 'none',
        duration: 2000
      })
    } 

  },
  
  
   /**
   * 确认预定
   * 1.提交数据到数据库（位置信息表，我的预约表）
   */
  confirm: function(e) { 
    if (this.data.list.length==0) {
      wx.showToast({
        title: '还没有选择哦！',
        icon: 'none',
        duration: 2000
      })
      return
    }
    var day_type=new Date().getDay()-1  
    if(this.data.datePosition<day_type){
      wx.showToast({
        title: '改之前的没有意义哦！',
        icon:"none",
        duration:2000
      })
      return
    }
    let that=this
    //给预约表中写入数据或者更新yuyue表
    if((this.data.click1%2)!=0){//列表没变换不进行云函数调用

          //将obj[i][j]中选定的值由3改为2(有人状态)
          for(var a=0;a<this.data.list.length;a++){
            var temp = this.data.list[a].id.split(",");
            var x = parseInt(temp[0])
            var y = parseInt(temp[1])
            if(this.data.obj[x][y]==3){
              this.data.obj[x][y]=2;
            }  
          }
          wx.cloud.callFunction({
            name: "updata_position", 
            data :{
              floorIndex : parseInt(that.data.floorIndex),
              datePosition:parseInt(that.data.datePosition),
              obj:that.data.obj
            },
            success(res){   
              console.log("更新position_info成功",res.result)
            },
            fail(err){
              console.log("失败",err)
            }
          })
    
          this.setData({
            obj: this.data.obj,
            click1:0
          })
          wx.showToast({
            title: '设定成功！',
            icon:"none",
            duration:2000
          })

    }
     
  },
})