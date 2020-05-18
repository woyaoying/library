// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  
  console.log("event.user_id=",event.user_id)
  return await cloud.database().collection("yuyue").where({
    user_id:event.user_id
  }).get();
}