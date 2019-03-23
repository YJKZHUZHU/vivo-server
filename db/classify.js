const mongoose = require('./db')
// 表模型
const ClassifyScheam = new mongoose.Schema({
    'left': Array,
    'right': Array
})
module.exports= mongoose.model('Classify',ClassifyScheam, 'classify')