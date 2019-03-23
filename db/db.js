const mongoose = require('mongoose')
// 1. 连接数据库
mongoose.connect('mongodb://localhost:27017/vivo-yjk')
const conn = mongoose.connection
/*
连接成功
 */
conn.on('connected', function () {
    console.log('数据库连接成功!')
})
/*
连接异常
 */
conn.on('error', function (err) {
    console.log('数据库连接异常，异常原因:'+err)
})
/*
连接断开
 */
conn.on('discommected', function () {
    console.log('数据库连接断开')
})
module.exports = mongoose
