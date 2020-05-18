// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  console.log("event.floorIndex=",event.floorIndex)
  console.log("event.datePosition=",event.datePosition)
  return await cloud.database().collection("position_info").where({
    floor :event.floorIndex,
    week :event.datePosition
  }).get();
}