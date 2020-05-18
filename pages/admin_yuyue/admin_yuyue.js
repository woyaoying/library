// pages/search/search.js
let db_yuyue_all=wx.cloud.database().collection('yuyue_all');
let db_weigui=wx.cloud.database().collection('weigui');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    obj_yuyue:[],
    obj_weigui:[],
    user_id:"",
    info:[],
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
    floor: ['1F','2F','3F','4F','5F','6F'],
    list:[],
  },
  //键盘输入时实时赋值
  input(e){
    this.setData({
      user_id:e.detail.value
    })
  },
  //点击完成按钮时触发
  confirm(e){
    let that =this
    db_yuyue_all.where({
      user_id:this.data.user_id
    }).get().then(async res => {
       console.log(res)
       if(!res.data.length){
         wx.showToast({
           title: '该学生暂时没有预约信息！',
           duration: 2000,
           icon: "none"
         })
         //清空info
         that.setData({
           info:[]
         })
         return 
       }
       for(var i=0;i<res.data.length;i++){
          var temp = res.data[i].id.split(",");
          var x = parseInt(temp[0])
          var y = parseInt(temp[1])
          that.data.info.push({       
            floorIndex:res.data[i].floor,
            datePosition:res.data[i].datePosition,
            x:x,
            y:y       
          })
        
      }
      this.setData({
        info:this.data.info
      })   
      })
  },
 
})