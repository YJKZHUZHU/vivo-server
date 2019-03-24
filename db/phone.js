const mongoose = require('./db')
// 表模型
const PhoneScheam = new mongoose.Schema({
    "upper": Array,
    "lower": Array
})
module.exports= mongoose.model('Phone',PhoneScheam, 'phone')