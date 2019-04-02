const mongoose = require('./db')
// 表模型
const newsScheam = new mongoose.Schema({
    'id': Number,
    'newsTitle': String,
    'newsImg': String,
    'newsCon': String,
    'newsTime': String,
    'sc': Boolean,
    'newsDetail': String
})
module.exports= mongoose.model('News',newsScheam, 'news')
