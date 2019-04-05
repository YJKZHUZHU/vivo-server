const mongoose = require('./db')
// 表模型
const PartScheam = new mongoose.Schema({
    "PartsUpper": Array,
    "PartsLower": Array,
    "id": String
})
module.exports= mongoose.model('Part',PartScheam, 'part')
