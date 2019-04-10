const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://127.0.0.1:27017';
const deleteModel = {
    deleteClassifyData(paramId){
        console.log(paramId)
        MongoClient.connect(url, function(err, client) {
            if(err) {
               console.log("删除错误"+err)
            } else {
                const db = client.db('vivo-yjk')
                db.collection('classify').updateOne({
                    "id": 1
                },{
                    "$pull": {"right.$[item].right_data": {"id":paramId}}},{"arrayFilters":[{"item.id":paramId}],"multi": true},function (err) {
                    if (err) {
                        console.log(err)
                    }else {
                        console.log('进来了')
                    }
                })
                client.close()
            }
        })
    }
}
module.exports = deleteModel

