// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database()
  console.log(event.obj)
    try {
      return await db.collection('position_info').where({
        floor :event.floorIndex,
        week :event.datePosition
      }).update({
        data :{
          position_status:event.obj
        }
        
      })
    } catch(e) {
      console.error(e)
    }

}