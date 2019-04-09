var express = require('express');
var router = express.Router();
const multer = require('multer')
const HomeModel = require('../db/home')
const DetailModel = require('../db/goodDetail')
const ClassifyModel = require('../db/classify')
const PhoneModel = require('../db/phone')
const PartModel = require('../db/part')
const upload = multer({
    // dest: 'G:/vivoImg'
    dest: 'C:/vivoImg'
})
const fs = require('fs')
const path = require('path')
var homeImg = '' //接收主图
var detailSwipe = [] //接收详情轮播图
var detailIntroduction = [] //接收详情介绍图片
//存储最大的ID值
var homeId = ''
//存储到mongo
function saveToMongo(obj,model) {
    (new model(obj)).save(function (err) {
        if (err) {
            console.log(err)
            return
        }
        console.log('数据插入成功')
    })
}
//判定分类
function setClassify(paramsId,paramsImg,paramsName,ID){
    ClassifyModel.find({}, function (err, data) {
        if(err){
            console.log(err)
        }
        for(var i=0;i<data[0].right.length;i++ ) {
            if (paramsId == i){
                // ClassifyModel.update({"id": "1"},{$push:{right: {right_data:{id:paramsId,img:paramsImg,name:paramsName}}}},function (err,result) {
                ClassifyModel.update({"id": "1", "right.id": paramsId},{"$push":{"right.$.rigth_data": {"id":ID,"img":paramsImg,"name":paramsName}}},function(err, result){
                    if(err){
                        console.log(err)
                    }
                    console.log(result)
                    console.log('更新部分成功')
                })

                ClassifyModel.update({"id": "1", "right.id": "0"},{"$push":{"right.$.rigth_data": {"id":ID,"img":paramsImg,"name":paramsName}}},function(err, result){
                    if(err){
                        console.log(err)
                    }
                    console.log('更新全部成功')
                })

            }
        }

    })
}
//手机
function phoneClassify(paramsId,paramsImg,paramsName,ID,paramsNameTwo,paramsPrice){
    PhoneModel.find({}, function (err, data) {
        if(err){
            console.log(err)
        }
        for(var i = 1; i < data[0].lower.length; i++ ) {
            if (i == paramsId ){
                console.log('i='+i)
                console.log('paramsId='+paramsId,data[0].lower[i])
                console.log('相等')
                // ClassifyModel.update({"id": "1"},{$push:{right: {right_data:{id:paramsId,img:paramsImg,name:paramsName}}}},function (err,result) {
                PhoneModel.update({"id": "1", "lower.id": paramsId},{"$push":{"lower.$.lower_data": {"id":ID,"ImageOne":paramsImg,"name":paramsName,"nameTwo":paramsNameTwo,"price":paramsPrice}}},function(err, result){
                    if(err){
                        console.log(err)
                    }
                    console.log('手机分类成功')
                })
                //给全部手机添加一条
                PhoneModel.update({"id": "1", "lower.id": '0'},{"$push":{"lower.$.lower_data": {"id":ID,"ImageOne":paramsImg,"name":paramsName,"nameTwo":paramsNameTwo,"price":paramsPrice}}},function(err, result){
                    if(err){
                        console.log(err)
                    }
                    console.log('全部手机增加成功')
                })
            }
        }

    })
}
//配件
function partClassify(paramsId,model){
    console.log("model:"+ JSON.stringify(model))
    PartModel.find({}, function (err, data) {
        if(err){
            console.log(err)
        }
        console.log(data[0].PartsLower.length+3,model.paramsId)
        for(var i = 4; i < data[0].PartsLower.length+3; i++ ) {
            if (i == paramsId ){
                console.log('相等')
                // ClassifyModel.update({"id": "1"},{$push:{right: {right_data:{id:paramsId,img:paramsImg,name:paramsName}}}},function (err,result) {
                PartModel.update({"id": "1", "PartsLower.id": paramsId},{"$push":{"PartsLower.$.PartsLower_data": model}},function(err, result){
                    if(err){
                        console.log(err)
                    }
                    console.log('配件分类成功')
                })
                //给全部配件添加一条
                PartModel.update({"id": "1", "PartsLower.id": "0"},{"$push":{"PartsLower.$.PartsLower_data": model}},function(err, result){
                    if(err){
                        console.log(err)
                    }
                    console.log('全部配件分类成功')
                })
            }
        }

    })
}
//删除主页商品
function deleteGoods(paramsId) {
    HomeModel.remove({id: paramsId}, function (err) {
        if(err){
            console.log(err)
        }
        console.log('主页商品删除成功')
    })
    DetailModel.remove({id: paramsId}, function (err) {
        if(err){
            console.log(err)
        }
        console.log('详情商品删除成功')
    })
    ClassifyModel.update({"id": "1"},{$pull:{"right.$.rigth_data": {"id":paramsId}}},function(err, result){
        if(err){
            console.log("错误"+err)
        }
        console.log(result)
        console.log('删除分类成功')
    })
    PhoneModel.remove({lower_data: paramsId}, function (err) {
        if(err){
            console.log(err)
        }
        console.log('手机删除成功')
    })
    PartModel.remove({PartsLower_data: paramsId},function (err) {
        if(err){
            console.log(err)
        }
        console.log('配件删除成功')
    })
}

//上传图片接口
router.post('/uploadHomeImg', upload.single('file'),function (req, res) {
    console.log(req.headers.host)
    var fileName = new Date().getTime() + '_' + req.file.originalname;
    var imgUrl = 'http://'+ req.headers.host + '/vivo-img/'+fileName
    homeImg = imgUrl
    fs.readFile(req.file.path, function(err, data) {
        if(err) {
            console.log('文件读取失败', err)
        } else {
            var des_file = path.resolve(__dirname, '../public/vivo-img/', fileName)
            console.log(des_file)
            fs.writeFile(des_file, data, function(err) {
                if(err) {
                    console.log('写入失败', err)
                } else {
                    console.log('写入成功')
                }
            })
        }
    })
    res.send({
        code: 200,
        message: '图片上传成功',
        success: true,
        data: null
    })
})
//详情图片接口
router.post('/uploadDetailImg', upload.single('file'),function (req, res) {
    console.log(JSON.parse(req.body.swiperLength).swiperLength)

    if (JSON.parse(req.body.swiperLength).swiperLength > 5) {
        detailSwipe = []
        res.send({
            code: 0,
            message: '上传失败，数量不能超过五张',
            success: false,
            data: null
        })
    }else {
        var fileName = new Date().getTime() + '_' + req.file.originalname;
        var imgUrl = 'http://'+ req.headers.host + '/vivo-img/'+fileName
        detailSwipe.push({
            "swipe": imgUrl
        })
        fs.readFile(req.file.path, function(err, data) {
            if(err) {
                console.log('文件读取失败', err)
            } else {
                var des_file = path.resolve(__dirname, '../public/vivo-img/', fileName)
                console.log(des_file)
                fs.writeFile(des_file, data, function(err) {
                    if(err) {
                        console.log('写入失败', err)
                    } else {
                        console.log('写入成功')
                    }
                })
            }
        })
        res.send({
            code: 200,
            message: '图片上传成功',
            success: true,
            data: null
        })
    }


})
//详情介绍接口
router.post('/uploadDetailIntroduction', upload.single('file'),function (req, res) {
    console.log(JSON.parse(req.body.detailLength).detailLength)
    if (JSON.parse(req.body.detailLength).detailLength > 10) {
        detailIntroduction = []
        res.send({
            code: 0,
            message: '上传失败，数量不能超过五张',
            success: false,
            data: null
        })
    }else {
        var fileName = new Date().getTime() + '_' + req.file.originalname;
        var imgUrl = 'http://'+ req.headers.host + '/vivo-img/'+fileName
        detailIntroduction.push({
            "one": imgUrl
        })
        fs.readFile(req.file.path, function(err, data) {
            if(err) {
                console.log('文件读取失败', err)
            } else {
                var des_file = path.resolve(__dirname, '../public/vivo-img/', fileName)
                console.log(des_file)
                fs.writeFile(des_file, data, function(err) {
                    if(err) {
                        console.log('写入失败', err)
                    } else {
                        console.log('写入成功')
                    }
                })
            }
        })
        res.send({
            code: 200,
            message: '图片上传成功',
            success: true,
            data: null
        })
    }


})

//发布商品
router.post('/publishGoods', function (req, res) {
    delete req.body.file
    delete req.body.close
    req.body.homeValue = 1
    //找到最大的ID值
    DetailModel.find({}, function (err, data) {
        if (err) {
            console.log(err)
        }
        homeId = Math.max.apply(Math, data.map(function (o) {
            return o.id
        }))
        setClassify(req.body.classify,homeImg,req.body.homeName,homeId)
        var home = {
            'isExit': req.body.isExit,
            'id': homeId+1,
            'homeImg': homeImg,
            'homeName': req.body.homeName,
            'homeNametwo': req.body.homeNametwo,
            'homeSwipe': detailSwipe,
            'homeBright': req.body.homeBright,
            'homeTitle': req.body.homeTitle,
            'homePrice': req.body.homePrice,
            'homeValue': 1,
            'Images': detailIntroduction
        }
        if(req.body.classify >= 4){
            partClassify(req.body.classify,home)
        }else {
            phoneClassify(req.body.classify,homeImg,req.body.homeName,homeId,req.body.homeNametwo,req.body.homePrice)
        }

        saveToMongo(home,HomeModel)
        saveToMongo(home,DetailModel)
        res.send({
            code: 200,
            message: '发布成功',
            success: true,
            phone: null
        })
        //    清空图片
        homeImg = null
        detailSwipe = []
        detailIntroduction = []
    })

})
//删除商品
router.post('/deleteGoods', function (req, res) {
    console.log(req.body)
    deleteGoods(req.body.id)
    // deleteDetailGoods(req.body.id)
    res.send({
        code: 0,
        message: '删除商品成功',
        success: true,
        data: null
    })
})
module.exports = router;
