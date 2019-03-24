const mongoose = require('./db')
// 表模型
const ChangeScheam = new mongoose.Schema({
    'changeImg': String,
})
module.exports= mongoose.model('Change',ChangeScheam, 'change')