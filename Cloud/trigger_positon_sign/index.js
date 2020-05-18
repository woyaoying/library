// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  //此函数内置触发器，每天整点会准时触发，来检测是否有预约未到的情况
  //1.浏览position_sign表状态标志，0为已经扫码签到1为未签到

  var day_type=new Date().getDay()-1
  console.log("day_type",day_type)

  var hour_type=new Date().getHours()-8
  console.log("hour_type",hour_type)


  let obj_sign=[]
  let obj_info=[]
  //提前将今天的签到状态从数据库读出来

  await cloud.database().collection("position_info").where({
    week :day_type
  }).get().then(res=> {

    obj_info=res.data

    cloud.database().collection("position_sign").where({
      week :day_type,
    }).get().then(re=> {

      obj_sign=re.data
      // console.log("obj_sign=",obj_sign[0].floor)
      // console.log("obj_info=",obj_info[0].position_status[3][0])

    for(var floor=0;floor<6;floor++){   
      console.log("最开始")     
          for(var j=0;j<36;j++){
            // console.log("第一步")
            // console.log(obj_info[floor].floor)
            // console.log(obj_info[floor].week)
            // console.log(obj_info[floor].position_status)
            if(obj_info[floor].position_status[hour_type][j]===2){
              //此位置有人订，查找position_sign判断其签到没有


                console.log("第二步")
                if(obj_sign[floor].position_status[hour_type][j]===1){
                  //违规，将其计入违规表
                  cloud.database().collection("weigui").add({
                    data: {
                      week:day_type,
                      floor: floor,
                      id: hour_type + ',' + j 
                    }
                  })
                  .then(res => {
                    console.log("成功添加",res)
                  })



                  console.log("第三步")
                  //将position_info表还原
                  obj_info[floor].position_status[hour_type][j]=1;
                  cloud.database().collection('position_info').where({
                    floor :floor,
                    week:day_type
                  }).update({
                    data :{
                      position_status:obj_info[floor].position_status
                    }  
                  }).then(res => {
                    console.log("还原成功",res)
                  })

                }
                // else{


                //   console.log("第四步")
                //   //未违规，将position_sign表还原
                //   obj_sign[floor].position_status[hour_type][j]=1;
                //   cloud.database().collection('position_sign').where({
                //     floor :floor,
                //     week:day_type
                //   }).update({
                //     data :{
                //       position_status:obj_sign[floor].position_status
                //     }  
                //   }).then(res => {
                //     console.log("还原sign成功",res)
                //   })
                // }

              }
          }
    }
    })

    
  })

}