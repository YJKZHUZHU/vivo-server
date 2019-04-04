var express = require('express');
var router = express.Router();
const multer = require('multer')
const NewsModel = require('../db/news')
const upload = multer({
    // dest: 'G:/vivoImg'
    dest: 'C:/vivoImg'
})
const fs = require('fs')
const path = require('path')
var newsImg = '' //接收动态封面
var newsDetailImg = [] //接收详情插图
//存储最大的ID值
var newsId = ''
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
router.post('/uploadNewsImg', upload.single('file'),function (req, res) {
    console.log(req.headers.host)
    var fileName = new Date().getTime() + '_' + req.file.originalname;
    var imgUrl = 'http://'+ req.headers.host + '/vivo-img/'+fileName
    newsImg = imgUrl
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
router.post('/uploadNewsDetailImg', upload.single('file'),function (req, res) {
   console.log(req.body)
    if (JSON.parse(req.body.newsDetailLength).newsDetailLength > 5) {
        newsDetailImg = []
        res.send({
            code: 0,
            message: '上传失败，数量不能超过五张',
            success: false,
            data: null
        })
    }else {
        var fileName = new Date().getTime() + '_' + req.file.originalname;
        var imgUrl = 'http://'+ req.headers.host + '/vivo-img/'+fileName
        newsDetailImg.push({
            "list": imgUrl
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
//发布动态
router.post('/publishAritcle', function (req, res) {
    console.log(req.body)
    //找到最大的ID值
    NewsModel.find({}, function (err,data) {
        if (err) {
            console.log(err)
        }
        newsId = Math.max.apply(Math, data.map(function (o) {
            return o.id
        }))
        delete req.body.file
        delete req.body.close
        req.body.newsDetail = req.body.newsDetail.split('/')
        console.log(req.body.newsDetail)
        var newsDetail = ''
        for(var i in req.body.newsDetail) {
            newsDetail +=`<img src='${newsDetailImg[i].list}' style='width:100%;margin-bottom: 10px' ><p style='margin-bottom: 10px';>${req.body.newsDetail[i]}</p>`
        }
        var news = {
            'sc': req.body.sc,
            'id': newsId+1,
            'newsImg': newsImg,
            'newsTitle': req.body.newsTitle,
            'newsCon': req.body.newsCon,
            'newsTime': req.body.newsTime,
            'newsDetail': newsDetail
        }
        saveToMongo(news,NewsModel)
        res.send({
            code: 200,
            message: '发布成功',
            success: true,
            phone: null
        })
        //    清空图片
        newsImg = null
        newsDetailImg = []
    })
})
module.exports = router;
