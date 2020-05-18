// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database()
    try {
      return await db.collection('yuyue').where({
        user_id:event.user_id,
      }).update({
        data :{
          list_info:event.list_info
        }
        
      })
    } catch(e) {
      console.error(e)
    }


}