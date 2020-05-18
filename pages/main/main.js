let app = getApp();
let animationShowHeight = 300; 
const LENGTH = 10;


Page({
	data: {
    adv: [
      '../../picture/7.jpg',
      '../../picture/8.jpg',
      '../../picture/10.jpg'
      
		],
		id:"",
		user_id:"",
		list:[],
		obj_info:[],

    /*-------公告--------*/
		noticeList: [{
			id: 1,
			content: '1、切记在预约时，无论是切换楼层或者选时间之前一定要点击下方“确定预定”。'
		},{
			id: 2,
			content: '2、5月19日，图书馆因检查更换设备，暂停对外开放使用，请各位注意调整预约时间。'
		}],
    /*----------*/

	},
	
	onLoad: function(){

	},
	onShow:function(e){

		//获取全局数据
	 
		let val = app.searchWord;
		this.setData({
			id:val
		})
		console.log("this.data.id",this.data.id)
	 },
  
	createOrder(e){ 
		wx.navigateTo({
					url: '../../pages/yuyuedetail/yuyuedetail?id='+this.data.id
    	})
	},
	scanCode(){
		let that=this
		// 允许从相机和相册扫码
		wx.scanCode({
			success (res) {
				console.log("扫描结果1",res)
				if(res.result==="111"){
					wx.showToast({
						title: '二维码有误，联系管理员重新生成！',
						duration: 2000,
						icon: "none",
					})
					return
				}
				wx.cloud.database().collection("admin").where({
					admin_id:"admin"
				}).get().then(re=>{
					console.log("数据库结果",re.data[0].verify_info)
					console.log("扫描结果2",res.result)
					if(res.result===re.data[0].verify_info){
						
						//成功后需要修改position_sign表的信息
						wx.cloud.callFunction({
							name: "get_yuyue", 
							data :{
								user_id:that.data.id
							},
							complete(res){
								if(res.result.data.length){
									that.setData({
										list:res.result.data[0].list_info
									})
									//获取扫码时的时间
									var day_type=new Date().getDay()-1  
									console.log("day_type",day_type)   
									var hour_type=new Date().getHours()-7
									console.log("hour_type",hour_type) 
									
									for(var m=0;m<that.data.list.length;m++){

										if(that.data.list[m].datePosition===day_type){
											//在一天
											var temp = that.data.list[m].id.split(",");
											var x = parseInt(temp[0])
											var y = parseInt(temp[1])
											if(hour_type===x){
												//系统认为提前一小时都算合适

												//先将相应的position_sign表查出来
												wx.cloud.database().collection("position_sign").where({
													week :day_type,
													floor:that.data.list[m].floorIndex
												}).get().then(async re=> {
													console.log(re)
													that.setData({
														obj_sign:re.data[0].position_status
													})
														
																that.data.obj_sign[x][y]=0

														//修改position_sign表
														wx.cloud.database().collection('position_sign').where({
															floor :that.data.list[m].floorIndex,
															week:day_type
														}).update({
															data :{
																position_status:that.data.obj_sign
															}  
														}).then(res => {
															console.log("签到表写入成功",res)
														})
												})
												
											
												//因为同一时段只能预约一个，一旦成功肯定再无能签到的
												wx.showToast({
													title: '签到成功！',
													duration: 2000,
													icon: "none",
												})
												return
											}else{
												//不是提前一小时之内
												continue
											}

										}else{
											//此条预约不在今天
											continue
										}
										


									}
									//for循环结束
										wx.showToast({
											title: '只能提前一小时之内哦！',
											duration: 2000,
											icon: "none",
										})
										return


								}else{
									wx.showToast({
										title: '你没有预约哦！',
										duration: 2000,
										icon: "none",
									})
									return
								}

							}
					  })
					}else{
						wx.showToast({
							title: '请扫正确的二维码！！！',
							duration: 2000,
							icon: "none",
						})
						return
					}
					
				})
			}
		})

		


	}
  })