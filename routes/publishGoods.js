var express = require('express');
var router = express.Router();
const multer = require('multer')
const HomeModel = require('../db/home')
const upload = multer({
    dest: 'G:/vivoImg'
    // dest: 'C:/vivoImg'
})
const fs = require('fs')
const path = require('path')
var detailSwipe = [] //接收详情轮播图
var detailIntroduction = [] //接收详情介绍图片
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
        data: imgUrl
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
            data: detailSwipe
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
            data: detailIntroduction
        })
    }


})
//发布商品
router.post('/publishGoods', function (req, res) {
    var number = 6
    number++
    console.log(req.body)
    console.log(typeof req.body.homeImg,typeof req.body.homeSwipe,typeof req.body.Images)
    // console.log(req.body.homeImg.replace(/\'/g, ""))
    // req.body.homeImg = req.body.homeImg.replace(/\'/g, "")
    // req.body.homeSwipe = req.body.homeSwipe.replace(/\'/g, "")
    // req.body.Images = req.body.Images.replace(/\'/g, "")
    // JSON.parse(req.body.homeImg)
    // JSON.parse(req.body.homeSwipe)
    // JSON.parse(req.body.Images)
    // var homeData = req.body
    // console.log(JSON.parse(req.body.homeSwipe),JSON.parse(req.body.Images),JSON.parse(req.body.homeImg))
    // console.log(typeof req.body.homeImg)
    delete req.body.file
    delete req.body.close
    req.body.homeValue = 1
    req.body.id = number
    var home = {
        'isExit': req.body.isExit,
        'id': number,
        'homeImg': req.body.homeImg.replace(/\'/g, ""),
        'homeName': req.body.homeName,
        'homeNametwo': req.body.homeNametwo,
        'homeSwipe': req.body.homeSwipe.replace(/\'/g, ""),
        'homeBright': req.body.homeBright,
        'homeTitle': req.body.homeTitle,
        'homePrice': req.body.homePrice,
        'homeValue': 1,
        'Images': req.body.Images.replace(/\'/g, "")
    }
    console.log(home)
    console.log(req.body)
    // HomeModel.save(req.body, function (err, data) {
    //     if(err){
    //         console.log(err)
    //     }else {
    //         console.log('数据存储成功')
    //     }
    // })
    // saveToMongo(home,HomeModel)
    res.send({
        code: 200,
        message: '发布成功',
        success: true,
        phone: null
    })
})


module.exports = router;
