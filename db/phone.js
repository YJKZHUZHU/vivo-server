const mongoose = require('./db')
// 表模型
const PhoneScheam = new mongoose.Schema({
    "upper": Array,
    "lower": Array,
    "id": String
})
module.exports= mongoose.model('Phone',PhoneScheam, 'phone')
