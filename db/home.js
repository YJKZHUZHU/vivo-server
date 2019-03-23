const mongoose = require('./db')
// 表模型
const HomeScheam = new mongoose.Schema({
    'isExit': Boolean,
    'id': Number,
    'homeImg': String,
    'homeName': String,
    'homeNametwo': String,
    'homeSwipe': Array,
    'homeBright': String,
    'homeTitle': String,
    'homePrice': String,
    'homeValue': String,
    'Images': Array
})
module.exports= mongoose.model('Home',HomeScheam, 'home')