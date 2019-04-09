const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://127.0.0.1:27017';
const deleteModel = {
    deleteClassifyData(paramId){
        MongoClient.connect(url, function(err, client) {
            if(err) {
               console.log("删除错误"+err)
            } else {
                const db = client.db('vivo-yjk')
                db.collection('classify').updateOne({
                    "id": "1"
                },{"$pull": {"rigth.$.rigth_data": {"id":paramId}}})
                client.close()
            }
        })
    }
}
module.exports = deleteModel

