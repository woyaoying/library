const db_user = wx.cloud.database().collection("user")
const db_admin = wx.cloud.database().collection("admin")
let name = ""
let pwd = ""
var app=getApp()

Page({
  data:{
    new_name:"",
    new_class:"",
    new_id:"",
    new_pwd:"",
    hiddenmodalput:true
  },
  //获取添加的新名字
  new_name(e){ 
    this.setData({
      new_name:e.detail.value
  })
  },
  //获取添加的新班级
  new_class(e){ 
    this.setData({
      new_class:e.detail.value
  })
  },
  //获取添加的新id
  new_id(e){ 
    this.setData({
      new_id:e.detail.value
  })
  },
  //获取添加的新密码
  new_pwd(e){ 
    this.setData({
      new_pwd:e.detail.value
  })
  },
  //取消添加
  add_user_cancel(){
    this.setData({
      hiddenmodalput:true
  })
  },
  //确认添加
  add_user_confirm(){
    wx.cloud.database().collection('user').add({
      data:{
        class:this.data.new_class,
        name:this.data.new_name,
        user_id:this.data.new_id,
        password:this.data.new_pwd,
        weigui_number:0
      }
    }).then(res => {
      console.log()
    })
    wx.showToast({
      title: '注册成功',
      icon:"none"
    })
    this.setData({
      hiddenmodalput:true
  })
  },
  add_user(){
    this.setData({
      hiddenmodalput:false
  })
  },
  //接收名称
  addname(event){
    name=event.detail.value 
    // console.log(event)
  },
  //接收密码
  addpwd(event){
    pwd=event.detail.value
  },
  //点击用户登录
  
  userlogin(){
    if(!(name&&pwd)){
      wx.showModal({
        title: '提示',
        content: '用户名或密码不为空',
        showCancel:false
      })
      return
    }
    db_user.where({
      user_id:name,
      password:pwd
    }).get().then(res=>{
      console.log(res)
        if(res.data[0]){
          app.Name=res.data[0]
          console.log("登录成功",app.Name.name)
          //跳转到用户界面
          app.searchWord=res.data[0].user_id
          wx.switchTab({
            url: '../main/main',
        })


        }else{
          wx.showToast({
            title: '用户名或密码错误',
            icon:"none"
          })
          return
        }
    })
  },
  //点击管理员登录
  adminlogin(){
    if(!(name&&pwd)){
      wx.showModal({
        title: '提示',
        content: '用户名或密码不为空',
        showCancel:false
      })
      return
    }
    db_admin.where({
      admin_id:name,
      password:pwd
    }).get().then(res=>{
      console.log(res)
        if(res.data[0]){
          app.Name=res.data[0]
          //跳转到管理员界面
          wx.navigateTo({
            url: '../../pages/admin_main/admin_main'
        })



        }else{
          wx.showToast({
            title: '用户名或密码错误',
            icon:"none"
          })
          return
        }
    })

  }
})