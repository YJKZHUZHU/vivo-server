var express = require('express');
var router = express.Router();
const multer = require('multer')
const HomeModel = require('../db/home')
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
    //找到最大的ID值
    HomeModel.find({}, function (err,data) {
        if (err) {
            console.log(err)
        }
        homeId = data[data.length-1].id
        delete req.body.file
        delete req.body.close
        req.body.homeValue = 1
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
        saveToMongo(home,HomeModel)
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
module.exports = router;
