const mongoose = require('./db')
// 表模型
const PartScheam = new mongoose.Schema({
    "PartsUpper": Array,
    "PartsLower": Array
})
module.exports= mongoose.model('Part',PartScheam, 'part')