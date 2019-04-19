const mongoose = require('./db')
// 表模型
const orderScheam = new mongoose.Schema({
    'id': Number,
    'name': String,
    'price': String,
    'img': String,
    'listname': String,
    'value': String,
    'orderTime': String,
    'userName': String,
    'orderNumber':String,
    'ly': String,
    'address':String,
    'orderStatus': String
})
module.exports= mongoose.model('Order',orderScheam, 'order')
