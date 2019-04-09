var express = require('express');
var router = express.Router();
const md5 = require('blueimp-md5')
const models = require('../db/models')
const UserModel = models.getModel('user')
const _filter = {'pwd': 0, '__v': 0} // 查询时过滤掉
const sms_util = require('../util/sms_util')
const users = {}
const ajax = require('../api/ajax')
var svgCaptcha = require('svg-captcha')
const HomeModel = require('../db/home')
const ChangeModel = require('../db/change')
const ClassifyModel = require('../db/classify')
const goodDetailModel = require('../db/goodDetail')
const newsModel = require('../db/news')
const partModel = require('../db/part')
const phoneModel = require('../db/phone')
const setModel = require('../db/set')
//存储数据
var homeData = [
  {
    "isExit": false,
    "id": 1,
    "homeImg": "https://shopstatic.vivo.com.cn/vivoshop/commodity/71/4171_1496689409434hd_530x530.png",
    "homeName": "X9Plus 全网通",
    "homeNametwo": "优惠200元|限量促销",
    "homeSwipe": [
      {
        "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/71/4171_1496689409434hd_530x530.png"
      },
      {
        "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/71/4171_1482112378797_530x530.png"
      },
      {
        "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/71/4171_1482112377158_530x530.png"
      }
    ],
    "homeBright": "花呗免息，0首付0利率轻松购机",
    "homeTitle": "X9s Plus A 5.85英寸大屏，双引擎闪充，4015mAh大电池，持久续航（注：面部识别需升级到最新系统使用）",
    "homePrice": "2798",
    "homeValue": "1",
    "Images": [
      {
        "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20171115/20171115110719510981_original.jpg"
      },
      {
        "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20171113/20171113112115957344_original.jpg"
      },
      {
        "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20161219/20161219093807784269_original.jpg"
      },
      {
        "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20161219/20161219093810349285_original.jpg"
      },
      {
        "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20161219/20161219093813167921_original.jpg"
      },
      {
        "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20161219/20161219093814935600_original.jpg"
      },
      {
        "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20161219/20161219093817527717_original.jpg"
      },
      {
        "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20161219/20161219093820318903_original.jpg"
      },
      {
        "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20161219/20161219093822750588_original.jpg"
      },
      {
        "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20161219/20161219093824598774_original.jpg"
      },
      {
        "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20161219/20161219093827290232_original.jpg"
      },
      {
        "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20161219/20161219093829298284_original.jpg"
      },
      {
        "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20161219/2016121909383925061_original.jpg"
      },
      {
        "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20161230/20161230205257942403_original.jpg"
      },
      {
        "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20170629/2017062914535078223_original.jpg"
      }
    ]
  },
  {
    "isExit": false,
    "id": 2,
    "homeImg": "https://shopstatic.vivo.com.cn/vivoshop/commodity/40/4440_1508723830538hd_530x530.png",
    "homeName": "X20Plus 全面屏",
    "homeNametwo": "6.43英寸大屏|0.1s快速解锁",
    "homeBright": "4月21日0点-7月31日0点，感恩促销直降200，到手价2598",
    "homeTitle": "X20A 18:9高清全面屏，Face Wake面部识别，0.1s面部解锁，前后2x1200万像素，2400万感光单元。",
    "homePrice": "3498",
    "homeValue": "1",
    "homeSwipe": [
      {
        "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/40/4440_1508723830538hd_530x530.png"
      },
      {
        "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/40/4440_1508723832425hd_530x530.png"
      },
      {
        "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/40/4440_1508723828993hd_530x530.png"
      }
    ],
    "Images": [
      {
        "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20171115/20171115110055603150_original.jpg"
      },
      {
        "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20171019/20171019200901204411_original.jpg"
      },
      {
        "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20171019/20171019200902359537_original.jpg"
      },
      {
        "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20171019/20171019200922571186_original.jpg"
      },
      {
        "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20171019/20171019201528695755_original.jpg"
      },
      {
        "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20171019/2017101920094926848_original.jpg"
      },
      {
        "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20171019/20171019200948703417_original.jpg"
      },
      {
        "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20171019/2017101920101331912_original.jpg"
      },
      {
        "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20171019/20171019201119431711_original.jpg"
      },
      {
        "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20171019/20171019201051376383_original.jpg"
      },
      {
        "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20171019/20171019201051448387_original.jpg"
      },
      {
        "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20171019/20171019201158341496_original.jpg"
      },
      {
        "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20171027/2017102711364996936_original.jpg"
      },
      {
        "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20171027/20171027113700613256_original.jpg"
      }
    ]
  },
  {
    "isExit": false,
    "id": 3,
    "homeImg": "https://shopstatic.vivo.com.cn/vivoshop/commodity/95/4495_1509454710945hd_530x530.png",
    "homeName": "Y69 全面屏手机",
    "homeNametwo": "前置2400万像素",
    "homeBright": "4月24日—5月1日，购机加赠爱奇艺VIP月卡；直降200元促销，到手价999",
    "homeTitle": "Y69A 32GB内存，前置1600万柔光自拍，正面指纹解锁，一体式机身设计，分屏多任务。",
    "homePrice": "2498",
    "homeValue": "1",
    "homeSwipe": [
      {
        "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/95/4495_1509454710945hd_530x530.png"
      },
      {
        "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/95/4495_1509454714610hd_530x530.png"
      },
      {
        "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/95/4495_1509454706314hd_530x530.png"
      }
    ],
    "Images": [
      {
        "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20171031/20171031232228644662_original.jpg"
      },
      {
        "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20171031/20171031232229235145_original.jpg"
      },
      {
        "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20171102/20171102143039424294_original.jpg"
      },
      {
        "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20171031/20171031232243781406_original.jpg"
      },
      {
        "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20171031/20171031232353254161_original.jpg"
      },
      {
        "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20171101/20171101191141708950_original.jpg"
      },
      {
        "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20171031/20171031232409516746_original.jpg"
      },
      {
        "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20171031/20171031232409523196_original.jpg"
      },
      {
        "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20171031/20171031232442377774_original.jpg"
      },
      {
        "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20171031/20171031232442208606_original.jpg"
      },
      {
        "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20171031/2017103123244195095_original.jpg"
      },
      {
        "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20171031/20171031232457784713_original.jpg"
      },
      {
        "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20171031/20171031232457762898_original.jpg"
      },
      {
        "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20171031/20171031232456912178_original.jpg"
      },
      {
        "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20171031/20171031232519457796_original.jpg"
      },
      {
        "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20171031/2017103123251879781_original.jpg"
      }
    ]
  },
  {
    "isExit": false,
    "id": 4,
    "homeImg": "https://shopstatic.vivo.com.cn/vivoshop/commodity/66/4266_1496689781362hd_530x530.png",
    "homeName": "Xplay6 128G版",
    "homeNametwo": "后置双摄|免费镭射镌刻",
    "homeBright": "0首付0利息购机，购机赠豪礼",
    "homeTitle": "Xplay6 A 曲面2K屏，全曲面设计；6GB大运存，旗舰精品；骁龙820处理器，强劲核心；后置双摄，2400万感光单元，专业级虚化；超窄边框，超长续航。",
    "homePrice": "3998",
    "homeValue": "1",
    "homeSwipe": [
      {
        "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/66/4266_1496689781362hd_530x530.png"
      },
      {
        "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/66/4266_1500026039430hd_530x530.png"
      },
      {
        "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/66/4266_1490271072649hd_530x530.png"
      }
    ],
    "Images": [
      {
        "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20171115/20171115105005767122_original.jpg"
      },
      {
        "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20171116/20171116155420650567_original.jpg"
      },
      {
        "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20170323/20170323155103829614_original.jpg"
      },
      {
        "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20170323/20170323155114886378_original.jpg"
      },
      {
        "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20170323/20170323155120205409_original.jpg"
      },
      {
        "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20170329/20170329154926638158_original.jpg"
      },
      {
        "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20170922/20170922151756502731_original.jpg"
      },
      {
        "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20170323/20170323155216955152_original.jpg"
      },
      {
        "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20170323/20170323155227379507_original.jpg"
      },
      {
        "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20170821/20170821083311616767_original.jpg"
      },
      {
        "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20170323/20170323155304684132_original.jpg"
      },
      {
        "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20170329/20170329154947686685_original.jpg"
      },
      {
        "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20170323/20170323155330211312_original.jpg"
      },
      {
        "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20170323/20170323155342477248_original.jpg"
      },
      {
        "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20171109/20171109160002274104_original.jpg"
      },
      {
        "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20170629/20170629145248102954_original.jpg"
      }
    ]
  },
  {
    "isExit": false,
    "id": 5,
    "homeImg": "https://shopstatic.vivo.com.cn/vivoshop/commodity/11/4111_1492998667334hd_530x530.png",
    "homeName": "Y55 全网通",
    "homeNametwo": "大屏美颜自拍",
    "homeBright": "截止至5月2日，Y55优惠100元促销",
    "homeTitle": "Y55A 八核处理器，大屏美颜自拍，双卡全网通，支持128GB扩展内存，弧面玻璃，超薄机身",
    "homePrice": "1098",
    "homeValue": "1",
    "homeSwipe": [
      {
        "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/11/4111_1492998667334hd_530x530.png"
      },
      {
        "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/11/4111_1500023519212hd_530x530.png"
      },
      {
        "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/11/4111_1500023520345hd_530x530.png"
      }
    ],
    "Images": [
      {
        "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20171115/20171115111517182942_original.jpg"
      },
      {
        "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20170421/20170421091204610656_original.jpg"
      },
      {
        "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20170421/20170421091210168540_original.jpg"
      },
      {
        "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20170421/20170421091215924855_original.jpg"
      },
      {
        "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20170421/20170421091221372744_original.jpg"
      },
      {
        "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20170421/20170421091230675858_original.jpg"
      },
      {
        "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20170421/20170421091237320807_original.jpg"
      },
      {
        "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20170421/20170421091244500855_original.jpg"
      },
      {
        "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20170421/20170421091253281854_original.jpg"
      },
      {
        "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20170421/20170421091321785328_original.jpg"
      },
      {
        "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20170421/2017042109132813680_original.jpg"
      },
      {
        "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20170421/2017042109133367195_original.jpg"
      },
      {
        "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20170421/20170421091341301683_original.jpg"
      },
      {
        "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20170421/20170421091351664625_original.jpg"
      }
    ]
  },
  {
    "isExit": false,
    "id": 6,
    "homeImg": "https://shopstatic.vivo.com.cn/vivoshop/commodity/80/4180_1496689544465hd_530x530.png",
    "homeName": "Y66 全网通",
    "homeNametwo": "5.5英寸大屏|支持花呗分期",
    "homeBright": "5.5英寸高清大屏，性价比优选",
    "homeTitle": "Y66A手机，3GB运存+32GB内存，后置1300万像素，5000万超清合成；3000mAh大电池，持续流畅！",
    "homePrice": "1298",
    "homeValue": "1",
    "homeSwipe": [
      {
        "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/80/4180_1496689544465hd_530x530.png"
      },
      {
        "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/80/4180_1498696044402hd_530x530.png"
      },
      {
        "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/80/4180_1482292661461_530x530.png"
      }
    ],
    "Images": [
      {
        "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20171115/20171115111347370611_original.jpg"
      },
      {
        "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20170508/20170508105840743296_original.jpg"
      },
      {
        "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20170818/20170818091719515839_original.jpg"
      },
      {
        "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20170508/20170508100448642718_original.jpg"
      },
      {
        "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20170512/20170512171500354782_original.jpg"
      },
      {
        "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20170508/20170508100453239195_original.jpg"
      },
      {
        "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20170508/20170508100455817484_original.jpg"
      },
      {
        "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20170508/20170508100457898864_original.jpg"
      },
      {
        "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20170704/20170704171315298575_original.jpg"
      },
      {
        "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20170508/20170508100508348528_original.jpg"
      },
      {
        "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20170508/20170508100511234495_original.jpg"
      },
      {
        "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20170508/2017050810051339260_original.jpg"
      },
      {
        "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20170508/20170508100516296671_original.jpg"
      },
      {
        "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20170508/20170508100518638841_original.jpg"
      },
      {
        "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20170508/20170508100520942637_original.jpg"
      }
    ]
  }
]
var changeData = [
  {
    "changeImg": "https://shopstatic.vivo.com.cn/campaign/commodity/20180331/20180331214959305333_original.jpg"
  },
  {
    "changeImg": "https://shopstatic.vivo.com.cn/campaign/commodity/20180331/20180331215010137940_original.jpg"
  },
  {
    "changeImg": "https://shopstatic.vivo.com.cn/campaign/commodity/20180331/20180331215017701679_original.jpg"
  },
  {
    "changeImg": "https://shopstatic.vivo.com.cn/campaign/commodity/20180331/20180331215024461942_original.jpg"
  },
  {
    "changeImg": "https://shopstatic.vivo.com.cn/campaign/commodity/20180331/20180331215031571257_original.jpg"
  }
]
var classifyData = {
  "left": [
    {
      "id":"0",
      "name":"全部分类"
    },
    {
      "id":"1",
      "name": "Xplay系列"
    },
    {
      "id":"2",
      "name": "X系列"
    },
    {
      "id":"3",
      "name": "Y系列"
    },
    {
      "id":"4",
      "name": "充电器"
    },
    {
      "id":"5",
      "name": "保护膜"
    },
    {
      "id":"6",
      "name": "耳机音响"
    },
    {
      "id":"7",
      "name": "智能外设"
    }
  ],
  "right":[
    {
      "rigth_data":[
        {
          "id": 1,
          "img":"https://shopstatic.vivo.com.cn/vivoshop/commodity/71/4171_1496689409434hd_530x530.png",
          "name": "X9Plus"
        },
        {
          "id": 2,
          "img":"https://shopstatic.vivo.com.cn/vivoshop/commodity/40/4440_1508723830538hd_530x530.png",
          "name": "X20Plus"
        },
        {
          "id": 3,
          "img":"https://shopstatic.vivo.com.cn/vivoshop/commodity/95/4495_1509454710945hd_530x530.png",
          "name": "Y69"
        },
        {
          "id": 4,
          "img": "https://shopstatic.vivo.com.cn/vivoshop/commodity/66/4266_1496689781362hd_530x530.png",
          "name": "Xplay6"
        },
        {
          "id": 5,
          "img": "https://shopstatic.vivo.com.cn/vivoshop/commodity/11/4111_1492998667334hd_530x530.png",
          "name": "Y55"
        },
        {
          "id": 6,
          "img": "https://shopstatic.vivo.com.cn/vivoshop/commodity/80/4180_1496689544465hd_530x530.png",
          "name": "Y66"
        },
        {
          "id":7,
          "img": "https://shopstatic.vivo.com.cn/vivoshop/commodity/27/5027_1526972514378hd_250x250.png",
          "name":"乐心手环"
        },
        {
          "id":8,
          "img":"https://shopstatic.vivo.com.cn/vivoshop/commodity/20/4020_1481558694236_530x530.png",
          "name":"闪充充电器"
        },
        {
          "id":9,
          "img":"https://shopstatic.vivo.com.cn/vivoshop/commodity/82/1882_1481558960471_530x530.png",
          "name":"原装音乐耳机"
        },
        {
          "id":10,
          "img":"https://shopstatic.vivo.com.cn/vivoshop/commodity/73/4273_1491007460873hd_250x250.png",
          "name":"原装数据线"
        },
        {
          "id":11,
          "img":"https://shopstatic.vivo.com.cn/vivoshop/commodity/83/4183_1482921083765_530x530.png",
          "name":"原装钢化膜"
        },
        {
          "id":12,
          "img":"https://shopstatic.vivo.com.cn/vivoshop/commodity/81/4181_1482720908043_250x250.png",
          "name":"3D高清保护膜"
        }
      ],
      "id": "0"
    },
    {
      "rigth_data":[
        {
          "id": 4,
          "img": "https://shopstatic.vivo.com.cn/vivoshop/commodity/66/4266_1496689781362hd_530x530.png",
          "name": "Xplay6"
        }
      ],
      "id": "1"
    },
    {
      "rigth_data":[
        {
          "id": 1,
          "img":"https://shopstatic.vivo.com.cn/vivoshop/commodity/71/4171_1496689409434hd_530x530.png",
          "name": "X9Plus"
        },
        {
          "id": 2,
          "img":"https://shopstatic.vivo.com.cn/vivoshop/commodity/40/4440_1508723830538hd_530x530.png",
          "name": "X20Plus"
        },{
          "id": 4,
          "img": "https://shopstatic.vivo.com.cn/vivoshop/commodity/66/4266_1496689781362hd_530x530.png",
          "name": "Xplay6"
        }
      ],
      "id": "2"
    },
    {
      "rigth_data":[
        {
          "id": 3,
          "img":"https://shopstatic.vivo.com.cn/vivoshop/commodity/95/4495_1509454710945hd_530x530.png",
          "name": "Y69"
        },
        {
          "id": 5,
          "img": "https://shopstatic.vivo.com.cn/vivoshop/commodity/11/4111_1492998667334hd_530x530.png",
          "name": "Y55"
        },
        {
          "id": 6,
          "img": "https://shopstatic.vivo.com.cn/vivoshop/commodity/80/4180_1496689544465hd_530x530.png",
          "name": "Y66"
        }
      ],
      "id": "3"
    },
    {
      "rigth_data":[
        {
          "id":8,
          "img":"https://shopstatic.vivo.com.cn/vivoshop/commodity/20/4020_1481558694236_530x530.png",
          "name":"闪充充电器"
        },
      ],
      "id": "4"
    },
    {
      "rigth_data":[
        {
          "id":11,
          "img":"https://shopstatic.vivo.com.cn/vivoshop/commodity/83/4183_1482921083765_530x530.png",
          "name":"原装钢化膜"
        },
        {
          "id":12,
          "img":"https://shopstatic.vivo.com.cn/vivoshop/commodity/81/4181_1482720908043_250x250.png",
          "name":"3D高清保护膜"
        }
      ],
      "id": "5"
    },
    {
      "rigth_data":[
        {
          "id":9,
          "img":"https://shopstatic.vivo.com.cn/vivoshop/commodity/82/1882_1481558960471_530x530.png",
          "name":"原装音乐耳机"
        }
      ],
      "id": "6"
    },
    {
      "rigth_data":[
        {
          "id":7,
          "img": "https://shopstatic.vivo.com.cn/vivoshop/commodity/27/5027_1526972514378hd_250x250.png",
          "name":"乐心手环"
        }
      ],
      "id": "7"
    }
  ],
    "id": "1"
}
var goodDetailData =  [
      {
        "isExit": false,
        "id": 1,
        "homeImg": "https://shopstatic.vivo.com.cn/vivoshop/commodity/71/4171_1496689409434hd_530x530.png",
        "homeName": "X9Plus 全网通",
        "homeNametwo": "优惠200元|限量促销",
        "homeSwipe": [
          {
            "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/71/4171_1496689409434hd_530x530.png"
          },
          {
            "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/71/4171_1482112378797_530x530.png"
          },
          {
            "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/71/4171_1482112377158_530x530.png"
          }
        ],
        "homeBright": "花呗免息，0首付0利率轻松购机",
        "homeTitle": "X9s Plus A 5.85英寸大屏，双引擎闪充，4015mAh大电池，持久续航（注：面部识别需升级到最新系统使用）",
        "homePrice": "2798",
        "homeValue": "1",
        "Images": [
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20171115/20171115110719510981_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20171113/20171113112115957344_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20161219/20161219093807784269_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20161219/20161219093810349285_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20161219/20161219093813167921_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20161219/20161219093814935600_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20161219/20161219093817527717_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20161219/20161219093820318903_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20161219/20161219093822750588_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20161219/20161219093824598774_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20161219/20161219093827290232_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20161219/20161219093829298284_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20161219/2016121909383925061_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20161230/20161230205257942403_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20170629/2017062914535078223_original.jpg"
          }
        ]
      },
      {
        "isExit": false,
        "id": 2,
        "homeImg": "https://shopstatic.vivo.com.cn/vivoshop/commodity/40/4440_1508723830538hd_530x530.png",
        "homeName": "X20Plus 全面屏",
        "homeNametwo": "6.43英寸大屏|0.1s快速解锁",
        "homeBright": "4月21日0点-7月31日0点，感恩促销直降200，到手价2598",
        "homeTitle": "X20A 18:9高清全面屏，Face Wake面部识别，0.1s面部解锁，前后2x1200万像素，2400万感光单元。",
        "homePrice": "3498",
        "homeValue": "1",
        "homeSwipe": [
          {
            "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/40/4440_1508723830538hd_530x530.png"
          },
          {
            "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/40/4440_1508723832425hd_530x530.png"
          },
          {
            "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/40/4440_1508723828993hd_530x530.png"
          }
        ],
        "Images": [
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20171115/20171115110055603150_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20171019/20171019200901204411_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20171019/20171019200902359537_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20171019/20171019200922571186_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20171019/20171019201528695755_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20171019/2017101920094926848_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20171019/20171019200948703417_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20171019/2017101920101331912_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20171019/20171019201119431711_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20171019/20171019201051376383_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20171019/20171019201051448387_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20171019/20171019201158341496_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20171027/2017102711364996936_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20171027/20171027113700613256_original.jpg"
          }
        ]
      },
      {
        "isExit": false,
        "id": 3,
        "homeImg": "https://shopstatic.vivo.com.cn/vivoshop/commodity/95/4495_1509454710945hd_530x530.png",
        "homeName": "Y69 全面屏手机",
        "homeNametwo": "前置2400万像素",
        "homeBright": "4月24日—5月1日，购机加赠爱奇艺VIP月卡；直降200元促销，到手价999",
        "homeTitle": "Y69A 32GB内存，前置1600万柔光自拍，正面指纹解锁，一体式机身设计，分屏多任务。",
        "homePrice": "2498",
        "homeValue": "1",
        "homeSwipe": [
          {
            "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/95/4495_1509454710945hd_530x530.png"
          },
          {
            "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/95/4495_1509454714610hd_530x530.png"
          },
          {
            "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/95/4495_1509454706314hd_530x530.png"
          }
        ],
        "Images": [
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20171031/20171031232228644662_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20171031/20171031232229235145_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20171102/20171102143039424294_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20171031/20171031232243781406_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20171031/20171031232353254161_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20171101/20171101191141708950_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20171031/20171031232409516746_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20171031/20171031232409523196_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20171031/20171031232442377774_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20171031/20171031232442208606_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20171031/2017103123244195095_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20171031/20171031232457784713_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20171031/20171031232457762898_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20171031/20171031232456912178_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20171031/20171031232519457796_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20171031/2017103123251879781_original.jpg"
          }
        ]
      },
      {
        "isExit": false,
        "id": 4,
        "homeImg": "https://shopstatic.vivo.com.cn/vivoshop/commodity/66/4266_1496689781362hd_530x530.png",
        "homeName": "Xplay6 128G版",
        "homeNametwo": "后置双摄|免费镭射镌刻",
        "homeBright": "0首付0利息购机，购机赠豪礼",
        "homeTitle": "Xplay6 A 曲面2K屏，全曲面设计；6GB大运存，旗舰精品；骁龙820处理器，强劲核心；后置双摄，2400万感光单元，专业级虚化；超窄边框，超长续航。",
        "homePrice": "3998",
        "homeValue": "1",
        "homeSwipe": [
          {
            "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/66/4266_1496689781362hd_530x530.png"
          },
          {
            "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/66/4266_1500026039430hd_530x530.png"
          },
          {
            "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/66/4266_1490271072649hd_530x530.png"
          }
        ],
        "Images": [
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20171115/20171115105005767122_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20171116/20171116155420650567_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20170323/20170323155103829614_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20170323/20170323155114886378_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20170323/20170323155120205409_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20170329/20170329154926638158_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20170922/20170922151756502731_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20170323/20170323155216955152_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20170323/20170323155227379507_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20170821/20170821083311616767_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20170323/20170323155304684132_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20170329/20170329154947686685_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20170323/20170323155330211312_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20170323/20170323155342477248_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20171109/20171109160002274104_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20170629/20170629145248102954_original.jpg"
          }
        ]
      },
      {
        "isExit": false,
        "id": 5,
        "homeImg": "https://shopstatic.vivo.com.cn/vivoshop/commodity/11/4111_1492998667334hd_530x530.png",
        "homeName": "Y55 全网通",
        "homeNametwo": "大屏美颜自拍",
        "homeBright": "截止至5月2日，Y55优惠100元促销",
        "homeTitle": "Y55A 八核处理器，大屏美颜自拍，双卡全网通，支持128GB扩展内存，弧面玻璃，超薄机身",
        "homePrice": "1098",
        "homeValue": "1",
        "homeSwipe": [
          {
            "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/11/4111_1492998667334hd_530x530.png"
          },
          {
            "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/11/4111_1500023519212hd_530x530.png"
          },
          {
            "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/11/4111_1500023520345hd_530x530.png"
          }
        ],
        "Images": [
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20171115/20171115111517182942_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20170421/20170421091204610656_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20170421/20170421091210168540_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20170421/20170421091215924855_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20170421/20170421091221372744_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20170421/20170421091230675858_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20170421/20170421091237320807_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20170421/20170421091244500855_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20170421/20170421091253281854_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20170421/20170421091321785328_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20170421/2017042109132813680_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20170421/2017042109133367195_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20170421/20170421091341301683_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20170421/20170421091351664625_original.jpg"
          }
        ]
      },
      {
        "isExit": false,
        "id": 6,
        "homeImg": "https://shopstatic.vivo.com.cn/vivoshop/commodity/80/4180_1496689544465hd_530x530.png",
        "homeName": "Y66 全网通",
        "homeNametwo": "5.5英寸大屏|支持花呗分期",
        "homeBright": "5.5英寸高清大屏，性价比优选",
        "homeTitle": "Y66A手机，3GB运存+32GB内存，后置1300万像素，5000万超清合成；3000mAh大电池，持续流畅！",
        "homePrice": "1298",
        "homeValue": "1",
        "homeSwipe": [
          {
            "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/80/4180_1496689544465hd_530x530.png"
          },
          {
            "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/80/4180_1498696044402hd_530x530.png"
          },
          {
            "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/80/4180_1482292661461_530x530.png"
          }
        ],
        "Images": [
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20171115/20171115111347370611_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20170508/20170508105840743296_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20170818/20170818091719515839_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20170508/20170508100448642718_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20170512/20170512171500354782_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20170508/20170508100453239195_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20170508/20170508100455817484_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20170508/20170508100457898864_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20170704/20170704171315298575_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20170508/20170508100508348528_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20170508/20170508100511234495_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20170508/2017050810051339260_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20170508/20170508100516296671_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20170508/20170508100518638841_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20170508/20170508100520942637_original.jpg"
          }
        ]
      },
      {
        "isExit": false,
        "id": 7,
        "homeImg": "https://shopstatic.vivo.com.cn/vivoshop/commodity/27/5027_1526972514378hd_250x250.png",
        "homeName": "乐心手环",
        "homeNametwo": "【首发价239，领券再减20，前50名下单用户送体脂秤】",
        "homeBright": "首发价239，领券再减20，前50名下单用户送体脂秤",
        "homeTitle": "全天24小时心率监测，支持12项运动模式全纪录，超长续航，IP68级防水。中奖用户体脂秤将在5月31日前单独发出。",
        "homeValue": "1",
        "homePrice": "239",
        "homeSwipe": [
          {
            "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/27/5027_1526972514378hd_530x530.png"
          },
          {
            "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/27/5027_1526972555460hd_530x530.png"
          },
          {
            "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/27/5027_1526972611298hd_530x530.png"
          },
          {
            "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/27/5027_1526972617808hd_530x530.png"
          }
        ],
        "Images": [
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20180522/20180522150955749515_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20180522/20180522150955946411_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20180522/2018052215095521932_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20180522/2018052215095745571_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20180522/20180522150959696322_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20180522/20180522150959849536_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20180522/20180522150959796166_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20180522/20180522151002571997_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20180522/20180522151002264542_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20180522/20180522151002434978_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20180110/20180110111720797899_original.jpg"
          }
        ]
      },
      {
        "isExit": false,
        "id": 8,
        "homeImg": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20/4020_1481558694236_530x530.png",
        "homeName": "vivo原装闪充充电器",
        "homeNametwo": "vivo原装旅行充电头，支持双引擎闪充，不含数据线（ 不支持X9Plus/X20Plus低压闪充",
        "homeBright": "vivo原装闪充充电器-9V/2A快充",
        "homeTitle": "vivo原装旅行充电头，支持双引擎闪充，不含数据线（ 不支持X9Plus/X20Plus低压闪充 ）",
        "homeValue": "1",
        "homePrice": "85",
        "homeSwipe": [
          {
            "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20/4020_1481558694236_530x530.png"
          },
          {
            "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20/4020_1456733531803_530x530.png"
          },
          {
            "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20/4020_1456733534360_530x530.png"
          }
        ],
        "Images": [
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20160229/201602291614408070_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20160229/201602291614462415_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20160229/201602291614533948_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20160229/201602291614558048_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20160229/201602291614495925_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20160229/201602291614437442_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20160229/201602291614385696_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20161220/20161220104443338583_original.jpg"
          }
        ]
      },
      {
        "isExit": false,
        "id": 9,
        "homeImg": "https://shopstatic.vivo.com.cn/vivoshop/commodity/82/1882_1481558960471_530x530.png",
        "homeName": "vivo XE600i 原装音乐耳机",
        "homeNametwo": "【直降10元，限时促销】vivo原装HiFi耳机，适配全部vivo机型；三频均衡，让音乐更震撼；入耳式设计，有效阻隔噪音，尽享音乐时光；轻量化设计，佩戴舒适！",
        "homeBright": "直降10元，限时促销",
        "homeTitle": "vivo原装旅行充电头，支持双引擎闪充，不含数据线（ 不支持X9Plus/X20Plus低压闪充 ）",
        "homeValue": "1",
        "homePrice": "89",
        "homeSwipe": [
          {
            "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/82/1882_1481558960471_530x530.png"
          },
          {
            "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/82/1882_1447902809866_530x530.png"
          },
          {
            "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/82/1882_1447902810338_530x530.png"
          }
        ],
        "Images": [
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20160818/20160818164932573700_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20160818/20160818164953579712_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20160818/2016081816500395651_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20160818/20160818165007673346_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20160818/201608181651084158_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20170113/20170113090615670252_original.jpg"
          }
        ]
      },
      {
        "isExit": false,
        "id": 10,
        "homeImg": "https://shopstatic.vivo.com.cn/vivoshop/commodity/73/4273_1491007460873hd_250x250.png",
        "homeName": "vivo原装闪充数据线—2A电流输出",
        "homeNametwo": "【限时包邮】X9Plus、X20Plus专用原装闪充数据线，闪充功能需搭配原装低压闪充充电器使用。温馨提示：除X9Plus、X20Plus外其他机型无闪充功能",
        "homeBright": "【限时包邮】",
        "homeTitle": "X系列，XPlay系列机型原装闪充数据线（注：不支持X9Plus/X20Plus闪充），充电更快速。由于销量火爆，付款订单将按照支付顺序7天内发货！",
        "homeValue": "1",
        "homePrice": "29",
        "homeSwipe": [
          {
            "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/59/4459_1506593158905hd_530x530.png"
          },
          {
            "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/59/4459_1506593164284hd_530x530.png"
          },
          {
            "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/59/4459_1506593158905hd_530x530.png"
          }
        ],
        "Images": [
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20170928/20170928180858405227_original.jpg"
          }
        ]
      },
      {
        "isExit": false,
        "id": 11,
        "homeImg": "https://shopstatic.vivo.com.cn/vivoshop/commodity/83/4183_1482921083765_530x530.png",
        "homeName": "vivo X9原装柔性钢化膜",
        "homeNametwo": "【限时包邮】X9原装柔性钢化膜，两片装，平面贴膜，2.5D弧面位置不在贴膜覆盖范围，适用X9s、X9机型",
        "homeBright": "限时包邮",
        "homeTitle": "X9原装保护膜，两片装，平面贴膜，2.5D弧面位置不在贴膜覆盖范围，适用X9 Plus机型",
        "homeValue": "1",
        "homePrice": "29",
        "homeSwipe": [
          {
            "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/83/4183_1482921083765_530x530.png"
          },
          {
            "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/83/4183_1482921084622_530x530.png"
          },
          {
            "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/83/4183_1482921085636_530x530.png"
          }
        ],
        "Images": [
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20161228/20161228182922570780_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20161228/20161228182924725469_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20161228/20161228182926902290_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20161228/2016122818292876139_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20161228/20161228182930584710_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20170313/2017031310001685049_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20161228/20161228182935300354_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20170113/20170113090936206455_original.jpg"
          }
        ]
      },
      {
        "isExit": false,
        "id": 12,
        "homeImg": "https://shopstatic.vivo.com.cn/vivoshop/commodity/81/4181_1482720908043_250x250.png",
        "homeName": "vivo Xplay6原装3D高清保护膜",
        "homeNametwo": "【限时包邮】【两片装】请先观看详情中贴膜教程视频，按照教程贴膜",
        "homeBright": "限时包邮,两片装",
        "homeTitle": "原装保护膜，两片装，平面贴膜，2.5D弧面位置不在贴膜覆盖范围，适用vivo Xplay6机型",
        "homeValue": "1",
        "homePrice": "39",
        "homeSwipe": [
          {
            "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/81/4181_1482720908043_530x530.png"
          },
          {
            "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/81/4181_1482720907295_530x530.png"
          },
          {
            "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/81/4181_1482720908843_530x530.png"
          }
        ],
        "Images": [
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20161226/201612261443000927_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20161226/20161226144302130582_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20161226/20161226144304526755_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20161226/20161226144306895595_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20161226/20161226144308953683_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20161226/20161226144311376601_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20161226/20161226144313148401_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20161226/20161226164924516569_original.jpg"
          }
        ]
      }
    ]
var newsData = [
      {
        "id": 1,
        "newsTitle": "vivo X21全面屏手机五大个热门问题详解",
        "newsImg": "https://bbsfiles.vivo.com.cn/vivobbs/attachment/portal/201804/18/211307l0sr8tqrpststut0.jpg",
        "newsCon": "X21给人的第一感觉是比X20更加惊艳的，6.28英寸的大屏幕，19:9的屏幕比例，屏占比达到了90.3%，全面屏视野比X20更加广阔。",
        "newsTime": "2018-4-22",
        "sc": false,
        "newsDetail": "<img src='https://bbs.vivo.com.cn/forum.php?mod=image&aid=6487059&size=720x0&key=95498692e14f5992&type=fixnone' style='width:100%;margin-bottom: 10px' ><p style='margin-bottom: 10px';>和以往的vivo X系列不同，vivo X21这一次的包装不再沿用白色的简约设计，反而是用了深蓝色的外包装，增加了一点科技感和炫酷感。</p><img src='https://bbs.vivo.com.cn/forum.php?mod=image&aid=6487084&size=720x0&key=7f1f552b52fc3a49&type=fixnone' style='width:100%'><p style='margin-top:10px'>在附件方面，和X20一样，有透明手机壳x1、充电器、耳机一副。手机本身有原装贴膜，不过自X20开始，就没有再附送多一张贴膜了。vivo X21标配的耳机是XE680/XE710两款耳机随机发送，铛儿拿到的是XE710耳机，刚好可以和之前用过的XE600i和XE680做个对比。</p><img src='https://bbs.vivo.com.cn/forum.php?mod=image&aid=6487091&size=720x0&key=6ed55c3127662901&type=fixnone' style='width:100%;margin-bottom:10px;margin-top:10px'></img><p>XE710耳机的外形采用了人耳耳廓仿真外形的设计，佩戴起来比XE680更加舒适。铛儿的耳廓属于较小的类型，所以之前佩戴XE600i和XE680耳机时，都很容易下滑掉落，XE710的外形设计对我来说刚刚好，隔音效果也很不错，也不会像XE680一样戴久了出现耳朵疼的情况。不过，由于XE710是随机发送的，所以能不能拿到这副标配耳机全靠运气咯~</p><img src='https://bbs.vivo.com.cn/forum.php?mod=image&aid=6487095&size=720x0&key=a6f6e8aeae4cbe9c&type=fixnone' style='margin-top:10px;width:100%'></img>"
      },
      {
        "id": 2,
        "newsTitle": "vivo X21屏幕指纹版，黑科技多到爆",
        "newsImg": "https://bbsfiles.vivo.com.cn/vivobbs/attachment/portal/201804/12/190408w8123imwv3w22z4t.jpg",
        "newsCon": "vivo X21屏幕指纹版已经是vivo第二款屏幕指纹手机'简称X21UD'，也是目前全世界在售手机中唯一一款屏幕指纹解锁手机。",
        "newsTime": "2018-4-22",
        "sc": false,
        "newsDetail": "<p>有句话说的好「销量就能证明这产品好不好」，虽然只是片面之词其中会有很多因素在里面，对于全球销售前五的vivo来说，创新和提供用户需求才是赢得用户的拥护，这次vivo发布全新手机X21，并同时发布一款全球最领先水平的vivo X21屏幕指纹版，它已经是vivo第二款屏幕指纹手机（简称X21UD），也是目前全世界在售手机中唯一一款屏幕指纹解锁手机。</p><p style='margin-top:10px;margin-bottom:10px'>vivo X21UD对于我一直长期使用vivo的老用户还是有不错的升级，比如异形全面屏、红外辅助让面脸识别在暗光下也能快速解锁，更舒服的导航手势、Jovi人工智能真正能让我感受到它的用处、首款基于P3色域能够自动色彩管理的安卓手机、安卓唯一P3色域炫彩相机、逆光拍照和夜景效果同样让人惊喜。</p><h3>vivo X21屏幕指纹版图鉴分享</h3><img src='https://bbsfiles.vivo.com.cn/vivobbs/attachment/forum/201804/04/105458fzaood0zl00hnn50.jpg.thumb.jpg' style='margin-top:10px;width:100%'><img src='https://bbsfiles.vivo.com.cn/vivobbs/attachment/forum/201804/04/105456fj42zdjz11hvnt1x.jpg.thumb.jpg' style='margin-bottom:10px;margin-top:10px;width:100%'><img src='https://bbsfiles.vivo.com.cn/vivobbs/attachment/forum/201804/04/105519q2b6n2o6ok3gzo7u.jpg.thumb.jpg' style='margin-bottom:10px;width:100%'><img src='https://bbsfiles.vivo.com.cn/vivobbs/attachment/forum/201804/04/105500b2grsdfg2sg2adgg.jpg.thumb.jpg' style='margin-bottom:10px;width:100%'><img src='https://bbsfiles.vivo.com.cn/vivobbs/attachment/forum/201804/04/105502f06vscmsbtwt7sg8.jpg.thumb.jpg' style='margin-bottom:10px;width:100%'><img src='https://bbsfiles.vivo.com.cn/vivobbs/attachment/forum/201804/04/105515orhr2gikk49hkmjz.jpg.thumb.jpg' style='margin-bottom:10px;width:100%'><img src='https://bbsfiles.vivo.com.cn/vivobbs/attachment/forum/201804/04/105517x0nn0nkzyn0ltlnh.jpg.thumb.jpg' style='margin-bottom:10px;width:100%'><img src='https://bbsfiles.vivo.com.cn/vivobbs/attachment/forum/201804/04/105518dq7sz6pbxhaps37z.jpg.thumb.jpg' style='margin-bottom:10px;width:100%'>"
      },
      {
        "id": 3,
        "newsTitle": "vivo X21冰钻黑图赏，黑色也要唱着高调",
        "newsImg": "https://bbsfiles.vivo.com.cn/vivobbs/attachment/portal/201804/23/175957thm7fz3m6am6l7fz.jpg",
        "newsCon": "X21带来了3D玻璃机身，这种质感过渡，在黑色版本上基本不会视觉残留，就像黑的看不见接缝，看不到瑕疵。",
        "newsTime": "2018-4-22",
        "sc": false,
        "newsDetail": "<img src='http://bbs.vivo.com.cn/forum.php?mod=image&aid=6500789&size=720x0&key=74d2ef2488e2292e&type=fixnone' style='margin-bottom:10px;width:100%'><p>我可能是喜欢黑色，大多数情况下，衣服买黑色，鞋子买黑色，钱包买黑色，倒不是说喜欢黑色的单一纯粹和耐脏，在旁人看来会显得人很无趣，而事实上，黑色运用在很多产品设计上都是给人神秘高雅有意境的存在。服饰上，而在电子产品的选择上，同级别的定位里，我会首选黑色作为我的数码装备主旋律色。</p><img src='http://bbs.vivo.com.cn/forum.php?mod=image&aid=6500790&size=720x0&key=5c975f33e8edb152&type=fixnone' style='margin-bottom:10px;margin-top:10px;width:100%'><p style='margin-bottom:10px;'>vivo上个月发布了vivo X21共三款配色，虽说我对红色比较中意（本命年），但拿到这只极光黑X21时简直合不拢嘴，不得不夸一夸vivo的调色功底，这个镜面的感觉好棒呀，而且黑色也并不是传统的纯黑色，带一点透明感，在某些环境光比大的场景下，还会错看成其他颜色。</p><p style='margin-bottom:10px;margin-top:10px'>上一次用vivo玻璃材质的手机还是vivo X5Pro，玻璃给人的感觉不同于金属的僵硬冰冷，握在手里有温润感，和亲近感。X21带来了3D玻璃机身，熟悉的「三明治」结构设计，不同的是，这次弧度的背板玻璃和金属中框衔接的很紧密，浑然一体，手指划过也只是轻微的错落感。这种质感过渡，在黑色版本上基本不会视觉残留，就像黑的看不见接缝，看不到瑕疵。</p><img src='http://bbs.vivo.com.cn/forum.php?mod=image&aid=6500791&size=720x0&key=551778d364f3ae20&type=fixnone' style='margin-top:10px;width:100%'><img src='http://bbs.vivo.com.cn/forum.php?mod=image&aid=6500792&size=720x0&key=59dfbded3d3d8e67&type=fixnone' style='margin-bottom:10px;margin-top:10px;width:100%'><p>事实上，在拿到极光黑vivo X21之前我特别担心这是否像TOTAL BLACK的vivo Xplay6那样，活脱脱就是一个指纹收集器呢？这可是很影响观感的呀，你看看买手机送抹布的索尼Z5P，多不好。</p><img src='http://bbs.vivo.com.cn/forum.php?mod=image&aid=6500793&size=720x0&key=61ee8223a18b2cec&type=fixnone' style='margin-bottom:10px;margin-top:10px;width:100%'><p>好在，vivo X21的抗油污玻璃机身设计在某些程度上解决的指纹污渍残留的问题，虽然不是完全不沾指纹，但已经好太多了，握感也相较于X20提升了一截。</p><img src='http://bbs.vivo.com.cn/forum.php?mod=image&aid=6500794&size=720x0&key=61e04bb011821e4d&type=fixnone' style='margin-top:10px;margin-bottom:10px;width:100%'><p>作为热销机vivo X20的升级版，X21在升级上虽说有些保守的，但也并非小幅度改良，依然是主打全面屏设计，不过这次的6.28英寸，90.3%的屏占比，窄边框设计更为震撼了。同时前脸也撞衫iPhone X和一些竞品，也就是大家口中的「齐刘海」设计，本质上这是为了向更标准的全面屏靠拢而妥协的一种结果，获得更大的屏占比就得砍掉额头两边无可厚非。X21的刘海也处在当今主流的手机设计趋势下，保留了更高的屏占比，更大尺寸的屏幕，这些都是「刘海全面屏」浪潮的必然结果，没什么抄袭与借鉴，懂得大局观，知道消费者想要什么，就足够。</p><img src='http://bbs.vivo.com.cn/forum.php?mod=image&aid=6500795&size=720x0&key=66a5e9849b284bd4&type=fixnone' style='margin-top:10px;margin-bottom:10px;width:100%'><img src='http://bbs.vivo.com.cn/forum.php?mod=image&aid=6500796&size=720x0&key=bb2b4213f63641ad&type=fixnone' style='margin-bottom:10px;width:100%'><img src='http://bbs.vivo.com.cn/forum.php?mod=image&aid=6500797&size=720x0&key=80bf977f98b248c2&type=fixnone' style='margin-bottom:10px;width:100%'><p>机身细节还做了一些改变，比如，3.5mm的耳机孔挪到了顶部，sim卡槽挪到了底部，虽然更习惯从底部插入耳机，但整体影响不大，无伤大雅。</p><img src='http://bbs.vivo.com.cn/forum.php?mod=image&aid=6500798&size=720x0&key=4229708e398d240b&type=fixnone'style='margin-bottom:10px;margin-top:10px;width:100%;'><p>拍照是vivo X21的主打卖点之一，配置了全新的后置摄像头，具有2*1200万像素折合2400万感光单元，最高可拍摄2400万像素的照片（需手动开启）。值得一提的是，X21加入了P3色域相机，理论上成像和观感都有提升，此外这一次还融入了AI元素，配合vivo图像魔方技术，官方称在弱光和逆光环境下都能拍摄出高质量的画面。</p><h3 style='margin-bottom:10px;margin-top:20px'>更多图赏</h3><img src='http://bbs.vivo.com.cn/forum.php?mod=image&aid=6500799&size=720x0&key=e431462688b6b793&type=fixnone' style='margin-bottom:10px;width:100%'><img src='http://bbs.vivo.com.cn/forum.php?mod=image&aid=6500800&size=720x0&key=8d714f06598da3e9&type=fixnone' style='margin-bottom:10px;width:100%'><img src='http://bbs.vivo.com.cn/forum.php?mod=image&aid=6500801&size=720x0&key=ceb42e04437ad43a&type=fixnone' style='margin-bottom:10px;width:100%'><img src='http://bbs.vivo.com.cn/forum.php?mod=image&aid=6500802&size=720x0&key=1a927f57644833dd&type=fixnone' style='margin-bottom:10px;width:100%'><img src='http://bbs.vivo.com.cn/forum.php?mod=image&aid=6500803&size=720x0&key=135e1986c15de5e3&type=fixnone' style='margin-bottom:10px;width:100%'>"
      },
      {
        "id": 4,
        "newsTitle": "你的女朋友vivo X21，从内到外都是美",
        "newsImg": "https://bbsfiles.vivo.com.cn/vivobbs/attachment/portal/201804/18/210355fmpl8qqnu737qlz9.jpg",
        "newsCon": "X21屏幕指纹版可是拥有一项黑科技的，那就是屏幕指纹解锁。这项科技目前全球只有vivo拥有，没有之一。",
        "newsTime": "2018-4-22",
        "sc": false,
        "newsDetail": "<img src='https://bbsfiles.vivo.com.cn/vivobbs/attachment/forum/201804/07/213251pfwtzq7ivvue06g7.jpg.thumb.jpg' style='margin-bottom:10px;width:100%'><p>vivo X21到了我手中也快半个月了，在半个月的使用过程中，不得不说X21给我的感觉实在是太惊艳了。以至于本人的前任“X20”在X21的面前已经完全到了被嫌弃的地步。究竟是什么让X20在X21面前如此的黯然失色呢？让我细细给你们道来。</p><img src='https://bbsfiles.vivo.com.cn/vivobbs/attachment/forum/201804/07/213310lj12neyaaq1lnzq5.jpg.thumb.jpg' style='margin-top:10px;margin-bottom:10px;width:100%'><p>首先当然是这块刘海屏。从X20到X21，很多消费者就像楼主本人我一样，实在有些不解。以vivo公司的性子，X20不升到X30也至少是X25呀。这次为何vivo在命名上如此低调？难道真的只有一点点升级吗？当然不是，X21屏幕指纹版可是拥有一项黑科技的，那就是屏幕指纹解锁。这项科技目前全球只有vivo拥有，没有之一。可惜楼主本人拿到手中的仅仅是一部不带指纹的普通版。当然，除了屏幕指纹的重大升级，全面屏发展到刘海屏，也可以认为是全面屏的再次进化。</p><img src='https://bbsfiles.vivo.com.cn/vivobbs/attachment/forum/201804/07/213301soea7w1qah616i4w.jpg.thumb.jpg' style='margin-top:10px;margin-bottom:10px;width:100%'><p>vivo X21的刘海屏拥有极高的屏占比，官方宣称达到90.3%。如此一来，升级到6.3寸屏幕的X21在整机手感上与普通5.5寸屏幕的手机大小一般。它不同于某果的那条宽宽的刘海。X21的刘海尽可能的缩短最小化。在保障两颗传感器，听筒，前置摄像头最紧凑的位置后，其余全是屏幕。这让楼主本人不得不大喝一声彩，这视野，绝对够大。</p><img src='https://bbsfiles.vivo.com.cn/vivobbs/attachment/forum/201804/07/213322jzxoemf4zomzh6ro.jpg.thumb.jpg' style='margin-top:10px;margin-bottom:10px;width:100%'><p>vivo X21采用的是super AMOLED屏幕，还拥有P3色域彩色管理技术。强大的硬件加软件配合，给我赏心悦目的视觉感受。无论是看图片，浏览网页还是看视频，玩游戏。这块屏幕所表达出来的色彩既鲜艳，又不失真实。如果一定要我说这块屏幕有啥缺点的话，那就是它并没有经过专业的校色。但谁要X21只是一款手机呢，娱乐才是最主要的，看着好看舒服不就行了么？</p><img src='https://bbsfiles.vivo.com.cn/vivobbs/attachment/forum/201804/07/213337qro3hxhoiii3fko3.jpg.thumb.jpg' style='margin-bottom:10px;margin-top:10px;width:100%'><p>除了刘海屏的突破，X21在后盖这次又再次突破。打破从X6时代开始的一体金属后盖，细历了两年的厚积薄发，X21终于突破性的弄出了这么一块四曲面玻璃后盖。不得不说这是我喜欢X21的第二个重大因素。玻璃无论手感还是视觉，都比金属后盖有着质的提升。以前因为都是平面的玻璃，最多是2.5D的伪3D玻璃。这样会让手机在手中握感略差，不太符合人机学。但这次这块后盖则是真正的3D曲面玻璃。</p><img src='https://bbs.vivo.com.cn/forum.php?mod=image&aid=6481804&size=720x0&key=9ec8e358650f12dc&type=fixnone' style='margin-top:10px;margin-bottom:10px;width:100%'><p>它的大曲面大弧度尽最大可能的贴合了你的手掌，避免了平面玻璃的突兀感。当我把X21拿在手心，中指和无名指能滑腻腻的感受到鹅卵石般的圆润。即使我稍稍用力抓握后盖的边缘，也不会有割手感。不得不说这感觉实在是太好了。</p><img src='https://bbsfiles.vivo.com.cn/vivobbs/attachment/forum/201804/07/213350w5zbz5qydh7lt5bq.jpg.thumb.jpg' style='margin-top:10px;margin-bottom:10px;width:100%'><p>同时玻璃后盖的光泽比以往金属一体后盖的光泽看起来更加的闪亮，如果用磨砂来形容金属后盖，那么用高光来形容玻璃后盖则最合适不过了。楼主看了多年的磨砂后盖，也是时候看腻味了。</p><img src='https://bbsfiles.vivo.com.cn/vivobbs/attachment/forum/201804/07/213345purbr2r1drrmy2g1.jpg.thumb.jpg' style='margin-top:10px;margin-bottom:10px;width:100%'><p style='font-size:.5rem'>*综述*</p><div style='margin-top:15px'><p>拥有完美色彩显示的大屏占比刘海屏</p><p>极致手感的曲面玻璃后盖</p><p>玩游戏不输他人的6+128G的强大性能配置</p><p>vivo X21无论是颜值还是性能性价比很高</p></div>"
      }
    ]
var partData =  {
      "PartsUpper": [
        {
          "id": 0,
          "name": "全部"
        },
        {
          "id": 4,
          "name": "充电器"
        },
        {
          "id": 5,
          "name": "保护膜"
        },
        {
          "id": 6,
          "name": "耳机音响"
        },
        {
          "id": 7,
          "name": "智能外设"
        }
      ],
      "PartsLower": [
        {
          "PartsLower_data": [
            {
              "isExit": false,
              "id": 7,
              "homeImg": "https://shopstatic.vivo.com.cn/vivoshop/commodity/27/5027_1526972514378hd_250x250.png",
              "homeName": "乐心手环",
              "homeNametwo": "【首发价239，领券再减20，前50名下单用户送体脂秤】",
              "homeBright": "首发价239，领券再减20，前50名下单用户送体脂秤",
              "homeTitle": "全天24小时心率监测，支持12项运动模式全纪录，超长续航，IP68级防水。中奖用户体脂秤将在5月31日前单独发出。",
              "homeValue": "1",
              "homePrice": "239",
              "homeSwipe": [
                {
                  "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/27/5027_1526972514378hd_530x530.png"
                },
                {
                  "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/27/5027_1526972555460hd_530x530.png"
                },
                {
                  "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/27/5027_1526972611298hd_530x530.png"
                },
                {
                  "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/27/5027_1526972617808hd_530x530.png"
                }
              ],
              "Images": [
                {
                  "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20180522/20180522150955749515_original.jpg"
                },
                {
                  "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20180522/20180522150955946411_original.jpg"
                },
                {
                  "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20180522/2018052215095521932_original.jpg"
                },
                {
                  "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20180522/2018052215095745571_original.jpg"
                },
                {
                  "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20180522/20180522150959696322_original.jpg"
                },
                {
                  "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20180522/20180522150959849536_original.jpg"
                },
                {
                  "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20180522/20180522150959796166_original.jpg"
                },
                {
                  "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20180522/20180522151002571997_original.jpg"
                },
                {
                  "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20180522/20180522151002264542_original.jpg"
                },
                {
                  "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20180522/20180522151002434978_original.jpg"
                },
                {
                  "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20180110/20180110111720797899_original.jpg"
                }
              ]
            },
            {
              "isExit": false,
              "id": 8,
              "homeImg": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20/4020_1481558694236_530x530.png",
              "homeName": "vivo原装闪充充电器",
              "homeNametwo": "vivo原装旅行充电头，支持双引擎闪充，不含数据线（ 不支持X9Plus/X20Plus低压闪充",
              "homeBright": "vivo原装闪充充电器-9V/2A快充",
              "homeTitle": "vivo原装旅行充电头，支持双引擎闪充，不含数据线（ 不支持X9Plus/X20Plus低压闪充 ）",
              "homeValue": "1",
              "homePrice": "85",
              "homeSwipe": [
                {
                  "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20/4020_1481558694236_530x530.png"
                },
                {
                  "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20/4020_1456733531803_530x530.png"
                },
                {
                  "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20/4020_1456733534360_530x530.png"
                }
              ],
              "Images": [
                {
                  "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20160229/201602291614408070_original.jpg"
                },
                {
                  "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20160229/201602291614462415_original.jpg"
                },
                {
                  "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20160229/201602291614533948_original.jpg"
                },
                {
                  "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20160229/201602291614558048_original.jpg"
                },
                {
                  "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20160229/201602291614495925_original.jpg"
                },
                {
                  "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20160229/201602291614437442_original.jpg"
                },
                {
                  "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20160229/201602291614385696_original.jpg"
                },
                {
                  "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20161220/20161220104443338583_original.jpg"
                }
              ]
            },
            {
              "isExit": false,
              "id": 9,
              "homeImg": "https://shopstatic.vivo.com.cn/vivoshop/commodity/82/1882_1481558960471_530x530.png",
              "homeName": "vivo XE600i 原装音乐耳机",
              "homeNametwo": "【直降10元，限时促销】vivo原装HiFi耳机，适配全部vivo机型；三频均衡，让音乐更震撼；入耳式设计，有效阻隔噪音，尽享音乐时光；轻量化设计，佩戴舒适！",
              "homeBright": "直降10元，限时促销",
              "homeTitle": "vivo原装旅行充电头，支持双引擎闪充，不含数据线（ 不支持X9Plus/X20Plus低压闪充 ）",
              "homeValue": "1",
              "homePrice": "89",
              "homeSwipe": [
                {
                  "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/82/1882_1481558960471_530x530.png"
                },
                {
                  "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/82/1882_1447902809866_530x530.png"
                },
                {
                  "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/82/1882_1447902810338_530x530.png"
                }
              ],
              "Images": [
                {
                  "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20160818/20160818164932573700_original.jpg"
                },
                {
                  "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20160818/20160818164953579712_original.jpg"
                },
                {
                  "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20160818/2016081816500395651_original.jpg"
                },
                {
                  "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20160818/20160818165007673346_original.jpg"
                },
                {
                  "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20160818/201608181651084158_original.jpg"
                },
                {
                  "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20170113/20170113090615670252_original.jpg"
                }
              ]
            },
            {
              "isExit": false,
              "id": 10,
              "homeImg": "https://shopstatic.vivo.com.cn/vivoshop/commodity/73/4273_1491007460873hd_250x250.png",
              "homeName": "vivo原装闪充数据线—2A电流输出",
              "homeNametwo": "【限时包邮】X9Plus、X20Plus专用原装闪充数据线，闪充功能需搭配原装低压闪充充电器使用。温馨提示：除X9Plus、X20Plus外其他机型无闪充功能",
              "homeBright": "【限时包邮】",
              "homeTitle": "X系列，XPlay系列机型原装闪充数据线（注：不支持X9Plus/X20Plus闪充），充电更快速。由于销量火爆，付款订单将按照支付顺序7天内发货！",
              "homeValue": "1",
              "homePrice": "29",
              "homeSwipe": [
                {
                  "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/59/4459_1506593158905hd_530x530.png"
                },
                {
                  "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/59/4459_1506593164284hd_530x530.png"
                },
                {
                  "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/59/4459_1506593158905hd_530x530.png"
                }
              ],
              "Images": [
                {
                  "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20170928/20170928180858405227_original.jpg"
                }
              ]
            },
            {
              "isExit": false,
              "id": 11,
              "homeImg": "https://shopstatic.vivo.com.cn/vivoshop/commodity/83/4183_1482921083765_530x530.png",
              "homeName": "vivo X9原装柔性钢化膜",
              "homeNametwo": "【限时包邮】X9原装柔性钢化膜，两片装，平面贴膜，2.5D弧面位置不在贴膜覆盖范围，适用X9s、X9机型",
              "homeBright": "限时包邮",
              "homeTitle": "X9原装保护膜，两片装，平面贴膜，2.5D弧面位置不在贴膜覆盖范围，适用X9 Plus机型",
              "homeValue": "1",
              "homePrice": "29",
              "homeSwipe": [
                {
                  "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/83/4183_1482921083765_530x530.png"
                },
                {
                  "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/83/4183_1482921084622_530x530.png"
                },
                {
                  "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/83/4183_1482921085636_530x530.png"
                }
              ],
              "Images": [
                {
                  "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20161228/20161228182922570780_original.jpg"
                },
                {
                  "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20161228/20161228182924725469_original.jpg"
                },
                {
                  "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20161228/20161228182926902290_original.jpg"
                },
                {
                  "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20161228/2016122818292876139_original.jpg"
                },
                {
                  "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20161228/20161228182930584710_original.jpg"
                },
                {
                  "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20170313/2017031310001685049_original.jpg"
                },
                {
                  "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20161228/20161228182935300354_original.jpg"
                },
                {
                  "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20170113/20170113090936206455_original.jpg"
                }
              ]
            },
            {
              "isExit": false,
              "id": 12,
              "homeImg": "https://shopstatic.vivo.com.cn/vivoshop/commodity/81/4181_1482720908043_250x250.png",
              "homeName": "vivo Xplay6原装3D高清保护膜",
              "homeNametwo": "【限时包邮】【两片装】请先观看详情中贴膜教程视频，按照教程贴膜",
              "homeBright": "限时包邮,两片装",
              "homeTitle": "原装保护膜，两片装，平面贴膜，2.5D弧面位置不在贴膜覆盖范围，适用vivo Xplay6机型",
              "homeValue": "1",
              "homePrice": "39",
              "homeSwipe": [
                {
                  "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/81/4181_1482720908043_530x530.png"
                },
                {
                  "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/81/4181_1482720907295_530x530.png"
                },
                {
                  "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/81/4181_1482720908843_530x530.png"
                }
              ],
              "Images": [
                {
                  "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20161226/201612261443000927_original.jpg"
                },
                {
                  "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20161226/20161226144302130582_original.jpg"
                },
                {
                  "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20161226/20161226144304526755_original.jpg"
                },
                {
                  "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20161226/20161226144306895595_original.jpg"
                },
                {
                  "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20161226/20161226144308953683_original.jpg"
                },
                {
                  "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20161226/20161226144311376601_original.jpg"
                },
                {
                  "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20161226/20161226144313148401_original.jpg"
                },
                {
                  "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20161226/20161226164924516569_original.jpg"
                }
              ]
            }
          ],
          "id": "0"
        },
        {
          "PartsLower_data": [
            {
              "isExit": false,
              "id": 8,
              "homeImg": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20/4020_1481558694236_530x530.png",
              "homeName": "vivo原装闪充充电器",
              "homeNametwo": "vivo原装旅行充电头，支持双引擎闪充，不含数据线（ 不支持X9Plus/X20Plus低压闪充",
              "homeBright": "vivo原装闪充充电器-9V/2A快充",
              "homeTitle": "vivo原装旅行充电头，支持双引擎闪充，不含数据线（ 不支持X9Plus/X20Plus低压闪充 ）",
              "homeValue": "1",
              "homePrice": "85",
              "homeSwipe": [
                {
                  "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20/4020_1481558694236_530x530.png"
                },
                {
                  "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20/4020_1456733531803_530x530.png"
                },
                {
                  "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20/4020_1456733534360_530x530.png"
                }
              ],
              "Images": [
                {
                  "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20160229/201602291614408070_original.jpg"
                },
                {
                  "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20160229/201602291614462415_original.jpg"
                },
                {
                  "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20160229/201602291614533948_original.jpg"
                },
                {
                  "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20160229/201602291614558048_original.jpg"
                },
                {
                  "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20160229/201602291614495925_original.jpg"
                },
                {
                  "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20160229/201602291614437442_original.jpg"
                },
                {
                  "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20160229/201602291614385696_original.jpg"
                },
                {
                  "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20161220/20161220104443338583_original.jpg"
                }
              ]
            },
            {
              "isExit": false,
              "id": 10,
              "homeImg": "https://shopstatic.vivo.com.cn/vivoshop/commodity/73/4273_1491007460873hd_250x250.png",
              "homeName": "vivo原装闪充数据线—2A电流输出",
              "homeNametwo": "【限时包邮】X9Plus、X20Plus专用原装闪充数据线，闪充功能需搭配原装低压闪充充电器使用。温馨提示：除X9Plus、X20Plus外其他机型无闪充功能",
              "homeBright": "【限时包邮】",
              "homeTitle": "X系列，XPlay系列机型原装闪充数据线（注：不支持X9Plus/X20Plus闪充），充电更快速。由于销量火爆，付款订单将按照支付顺序7天内发货！",
              "homeValue": "1",
              "homePrice": "29",
              "homeSwipe": [
                {
                  "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/59/4459_1506593158905hd_530x530.png"
                },
                {
                  "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/59/4459_1506593164284hd_530x530.png"
                },
                {
                  "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/59/4459_1506593158905hd_530x530.png"
                }
              ],
              "Images": [
                {
                  "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20170928/20170928180858405227_original.jpg"
                }
              ]
            }
          ],
          "id": "4"
        },
        {
          "PartsLower_data": [
            {
              "isExit": false,
              "id": 11,
              "homeImg": "https://shopstatic.vivo.com.cn/vivoshop/commodity/83/4183_1482921083765_530x530.png",
              "homeName": "vivo X9原装柔性钢化膜",
              "homeNametwo": "【限时包邮】X9原装柔性钢化膜，两片装，平面贴膜，2.5D弧面位置不在贴膜覆盖范围，适用X9s、X9机型",
              "homeBright": "限时包邮",
              "homeTitle": "X9原装保护膜，两片装，平面贴膜，2.5D弧面位置不在贴膜覆盖范围，适用X9 Plus机型",
              "homeValue": "1",
              "homePrice": "29",
              "homeSwipe": [
                {
                  "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/83/4183_1482921083765_530x530.png"
                },
                {
                  "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/83/4183_1482921084622_530x530.png"
                },
                {
                  "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/83/4183_1482921085636_530x530.png"
                }
              ],
              "Images": [
                {
                  "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20161228/20161228182922570780_original.jpg"
                },
                {
                  "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20161228/20161228182924725469_original.jpg"
                },
                {
                  "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20161228/20161228182926902290_original.jpg"
                },
                {
                  "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20161228/2016122818292876139_original.jpg"
                },
                {
                  "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20161228/20161228182930584710_original.jpg"
                },
                {
                  "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20170313/2017031310001685049_original.jpg"
                },
                {
                  "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20161228/20161228182935300354_original.jpg"
                },
                {
                  "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20170113/20170113090936206455_original.jpg"
                }
              ]
            },
            {
              "isExit": false,
              "id": 12,
              "homeImg": "https://shopstatic.vivo.com.cn/vivoshop/commodity/81/4181_1482720908043_250x250.png",
              "homeName": "vivo Xplay6原装3D高清保护膜",
              "homeNametwo": "【限时包邮】【两片装】请先观看详情中贴膜教程视频，按照教程贴膜",
              "homeBright": "限时包邮,两片装",
              "homeTitle": "原装保护膜，两片装，平面贴膜，2.5D弧面位置不在贴膜覆盖范围，适用vivo Xplay6机型",
              "homeValue": "1",
              "homePrice": "39",
              "homeSwipe": [
                {
                  "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/81/4181_1482720908043_530x530.png"
                },
                {
                  "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/81/4181_1482720907295_530x530.png"
                },
                {
                  "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/81/4181_1482720908843_530x530.png"
                }
              ],
              "Images": [
                {
                  "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20161226/201612261443000927_original.jpg"
                },
                {
                  "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20161226/20161226144302130582_original.jpg"
                },
                {
                  "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20161226/20161226144304526755_original.jpg"
                },
                {
                  "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20161226/20161226144306895595_original.jpg"
                },
                {
                  "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20161226/20161226144308953683_original.jpg"
                },
                {
                  "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20161226/20161226144311376601_original.jpg"
                },
                {
                  "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20161226/20161226144313148401_original.jpg"
                },
                {
                  "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20161226/20161226164924516569_original.jpg"
                }
              ]
            }
          ],
          "id": "5"
        },
        {
          "PartsLower_data": [
            {
              "isExit": false,
              "id": 9,
              "homeImg": "https://shopstatic.vivo.com.cn/vivoshop/commodity/82/1882_1481558960471_530x530.png",
              "homeName": "vivo XE600i 原装音乐耳机",
              "homeNametwo": "【直降10元，限时促销】vivo原装HiFi耳机，适配全部vivo机型；三频均衡，让音乐更震撼；入耳式设计，有效阻隔噪音，尽享音乐时光；轻量化设计，佩戴舒适！",
              "homeBright": "直降10元，限时促销",
              "homeTitle": "vivo原装旅行充电头，支持双引擎闪充，不含数据线（ 不支持X9Plus/X20Plus低压闪充 ）",
              "homeValue": "1",
              "homePrice": "89",
              "homeSwipe": [
                {
                  "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/82/1882_1481558960471_530x530.png"
                },
                {
                  "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/82/1882_1447902809866_530x530.png"
                },
                {
                  "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/82/1882_1447902810338_530x530.png"
                }
              ],
              "Images": [
                {
                  "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20160818/20160818164932573700_original.jpg"
                },
                {
                  "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20160818/20160818164953579712_original.jpg"
                },
                {
                  "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20160818/2016081816500395651_original.jpg"
                },
                {
                  "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20160818/20160818165007673346_original.jpg"
                },
                {
                  "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20160818/201608181651084158_original.jpg"
                },
                {
                  "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20170113/20170113090615670252_original.jpg"
                }
              ]
            }
          ],
          "id": "6"
        },
        {
          "PartsLower_data":[
            {
              "isExit": false,
              "id": 7,
              "homeImg": "https://shopstatic.vivo.com.cn/vivoshop/commodity/27/5027_1526972514378hd_250x250.png",
              "homeName": "乐心手环",
              "homeNametwo": "【首发价239，领券再减20，前50名下单用户送体脂秤】",
              "homeBright": "首发价239，领券再减20，前50名下单用户送体脂秤",
              "homeTitle": "全天24小时心率监测，支持12项运动模式全纪录，超长续航，IP68级防水。中奖用户体脂秤将在5月31日前单独发出。",
              "homeValue": "1",
              "homePrice": "239",
              "homeSwipe": [
                {
                  "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/27/5027_1526972514378hd_530x530.png"
                },
                {
                  "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/27/5027_1526972555460hd_530x530.png"
                },
                {
                  "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/27/5027_1526972611298hd_530x530.png"
                },
                {
                  "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/27/5027_1526972617808hd_530x530.png"
                }
              ],
              "Images": [
                {
                  "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20180522/20180522150955749515_original.jpg"
                },
                {
                  "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20180522/20180522150955946411_original.jpg"
                },
                {
                  "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20180522/2018052215095521932_original.jpg"
                },
                {
                  "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20180522/2018052215095745571_original.jpg"
                },
                {
                  "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20180522/20180522150959696322_original.jpg"
                },
                {
                  "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20180522/20180522150959849536_original.jpg"
                },
                {
                  "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20180522/20180522150959796166_original.jpg"
                },
                {
                  "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20180522/20180522151002571997_original.jpg"
                },
                {
                  "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20180522/20180522151002264542_original.jpg"
                },
                {
                  "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20180522/20180522151002434978_original.jpg"
                },
                {
                  "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20180110/20180110111720797899_original.jpg"
                }
              ]
            }
          ],
          "id": "7"
        }
      ],
      "id": "1"
    }
var phoneData = {
      "upper": [
        {
          "id": 0,
          "name": "全部"
        },
        {
          "id": 1,
          "name": "Xplay系列"
        },
        {
          "id": 2,
          "name": "X系列"
        },
        {
          "id": 3,
          "name": "Y系列"
        }
      ],
      "lower": [
        {
          "lower_data": [
            {
              "id": "1",
              "ImageOne": "https://shopstatic.vivo.com.cn/vivoshop/commodity/71/4171_1496689409434hd_530x530.png",
              "name": "X9Plus 全网通",
              "nametwo": "优惠200元|限量促销",
              "Price": "2798"
            },
            {
              "id": "2",
              "ImageOne": "https://shopstatic.vivo.com.cn/vivoshop/commodity/40/4440_1508723830538hd_530x530.png",
              "nametwo": "6.43英寸大屏|0.1s快速解锁",
              "name": "X20Plus 全面屏",
              "Price": "3498"
            },
            {
              "id": "3",
              "ImageOne": "https://shopstatic.vivo.com.cn/vivoshop/commodity/95/4495_1509454710945hd_530x530.png",
              "name": "Y79 全面屏手机",
              "nametwo": "前置2400万像素",
              "Price": "2498"
            },
            {
              "id": "4",
              "ImageOne": "https://shopstatic.vivo.com.cn/vivoshop/commodity/66/4266_1496689781362hd_530x530.png",
              "name": "Xplay6 128G版",
              "nametwo": "后置双摄|免费镭射镌刻",
              "Price": "3998"
            },
            {
              "id": "5",
              "ImageOne": "https://shopstatic.vivo.com.cn/vivoshop/commodity/11/4111_1492998667334hd_530x530.png",
              "name": "Y55 全网通",
              "nametwo": "大屏美颜自拍",
              "Price": "1098"
            },
            {
              "id": "6",
              "ImageOne": "https://shopstatic.vivo.com.cn/vivoshop/commodity/80/4180_1496689544465hd_530x530.png",
              "name": "Y66 全网通",
              "nametwo": "5.5英寸大屏|支持花呗分期",
              "Price": "1298"
            }
          ],
          "id": "0"
        },
        {
          "lower_data": [
            {
              "id": "4",
              "ImageOne": "https://shopstatic.vivo.com.cn/vivoshop/commodity/66/4266_1496689781362hd_530x530.png",
              "name": "Xplay6 128G版",
              "nametwo": "后置双摄|免费镭射镌刻",
              "Price": "3998"
            }
          ],
          "id": "1"
        },
        {
          "lower_data": [
            {
              "id": "1",
              "ImageOne": "https://shopstatic.vivo.com.cn/vivoshop/commodity/71/4171_1496689409434hd_530x530.png",
              "name": "X9Plus 全网通",
              "nametwo": "优惠200元|限量促销",
              "Price": "2798"
            },
            {
              "id": "2",
              "ImageOne": "https://shopstatic.vivo.com.cn/vivoshop/commodity/40/4440_1508723830538hd_530x530.png",
              "nametwo": "6.43英寸大屏|0.1s快速解锁",
              "name": "X20Plus 全面屏",
              "Price": "3498"
            }
          ],
          "id": "2"
        },
        {
          "lower_data": [
            {
              "id": "5",
              "ImageOne": "https://shopstatic.vivo.com.cn/vivoshop/commodity/11/4111_1492998667334hd_530x530.png",
              "name": "Y55 全网通",
              "nametwo": "大屏美颜自拍",
              "Price": "1098"
            },
            {
              "id": "6",
              "ImageOne": "https://shopstatic.vivo.com.cn/vivoshop/commodity/80/4180_1496689544465hd_530x530.png",
              "name": "Y66 全网通",
              "nametwo": "5.5英寸大屏|支持花呗分期",
              "Price": "1298"
            },
            {
              "id": "3",
              "ImageOne": "https://shopstatic.vivo.com.cn/vivoshop/commodity/95/4495_1509454710945hd_530x530.png",
              "name": "Y79 全面屏手机",
              "nametwo": "前置2400万像素",
              "Price": "2498"
            }
          ],
          "id": "3"
        }
      ],
      "id": "1"
    }
var setData =  [
      {
        "isExit": false,
        "id": 7,
        "homeImg": "https://shopstatic.vivo.com.cn/vivoshop/commodity/27/5027_1526972514378hd_250x250.png",
        "homeName": "乐心手环",
        "homeNametwo": "【首发价239，领券再减20，前50名下单用户送体脂秤】",
        "homeBright": "首发价239，领券再减20，前50名下单用户送体脂秤",
        "homeTitle": "全天24小时心率监测，支持12项运动模式全纪录，超长续航，IP68级防水。中奖用户体脂秤将在5月31日前单独发出。",
        "homeValue": "1",
        "homePrice": "239",
        "homeSwipe": [
          {
            "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/27/5027_1526972514378hd_530x530.png"
          },
          {
            "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/27/5027_1526972555460hd_530x530.png"
          },
          {
            "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/27/5027_1526972611298hd_530x530.png"
          },
          {
            "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/27/5027_1526972617808hd_530x530.png"
          }
        ],
        "Images": [
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20180522/20180522150955749515_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20180522/20180522150955946411_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20180522/2018052215095521932_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20180522/2018052215095745571_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20180522/20180522150959696322_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20180522/20180522150959849536_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20180522/20180522150959796166_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20180522/20180522151002571997_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20180522/20180522151002264542_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20180522/20180522151002434978_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20180110/20180110111720797899_original.jpg"
          }
        ]
      },
      {
        "isExit": false,
        "id": 8,
        "homeImg": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20/4020_1481558694236_530x530.png",
        "homeName": "vivo原装闪充充电器",
        "homeNametwo": "vivo原装旅行充电头，支持双引擎闪充，不含数据线（ 不支持X9Plus/X20Plus低压闪充",
        "homeBright": "vivo原装闪充充电器-9V/2A快充",
        "homeTitle": "vivo原装旅行充电头，支持双引擎闪充，不含数据线（ 不支持X9Plus/X20Plus低压闪充 ）",
        "homeValue": "1",
        "homePrice": "85",
        "homeSwipe": [
          {
            "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20/4020_1481558694236_530x530.png"
          },
          {
            "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20/4020_1456733531803_530x530.png"
          },
          {
            "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20/4020_1456733534360_530x530.png"
          }
        ],
        "Images": [
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20160229/201602291614408070_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20160229/201602291614462415_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20160229/201602291614533948_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20160229/201602291614558048_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20160229/201602291614495925_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20160229/201602291614437442_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20160229/201602291614385696_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20161220/20161220104443338583_original.jpg"
          }
        ]
      },
      {
        "isExit": false,
        "id": 9,
        "homeImg": "https://shopstatic.vivo.com.cn/vivoshop/commodity/82/1882_1481558960471_530x530.png",
        "homeName": "vivo XE600i 原装音乐耳机",
        "homeNametwo": "【直降10元，限时促销】vivo原装HiFi耳机，适配全部vivo机型；三频均衡，让音乐更震撼；入耳式设计，有效阻隔噪音，尽享音乐时光；轻量化设计，佩戴舒适！",
        "homeBright": "直降10元，限时促销",
        "homeTitle": "vivo原装旅行充电头，支持双引擎闪充，不含数据线（ 不支持X9Plus/X20Plus低压闪充 ）",
        "homeValue": "1",
        "homePrice": "89",
        "homeSwipe": [
          {
            "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/82/1882_1481558960471_530x530.png"
          },
          {
            "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/82/1882_1447902809866_530x530.png"
          },
          {
            "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/82/1882_1447902810338_530x530.png"
          }
        ],
        "Images": [
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20160818/20160818164932573700_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20160818/20160818164953579712_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20160818/2016081816500395651_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20160818/20160818165007673346_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20160818/201608181651084158_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20170113/20170113090615670252_original.jpg"
          }
        ]
      },
      {
        "isExit": false,
        "id": 10,
        "homeImg": "https://shopstatic.vivo.com.cn/vivoshop/commodity/73/4273_1491007460873hd_250x250.png",
        "homeName": "vivo原装闪充数据线—2A电流输出",
        "homeNametwo": "【限时包邮】X9Plus、X20Plus专用原装闪充数据线，闪充功能需搭配原装低压闪充充电器使用。温馨提示：除X9Plus、X20Plus外其他机型无闪充功能",
        "homeBright": "【限时包邮】",
        "homeTitle": "X系列，XPlay系列机型原装闪充数据线（注：不支持X9Plus/X20Plus闪充），充电更快速。由于销量火爆，付款订单将按照支付顺序7天内发货！",
        "homeValue": "1",
        "homePrice": "29",
        "homeSwipe": [
          {
            "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/59/4459_1506593158905hd_530x530.png"
          },
          {
            "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/59/4459_1506593164284hd_530x530.png"
          },
          {
            "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/59/4459_1506593158905hd_530x530.png"
          }
        ],
        "Images": [
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20170928/20170928180858405227_original.jpg"
          }
        ]
      },
      {
        "isExit": false,
        "id": 11,
        "homeImg": "https://shopstatic.vivo.com.cn/vivoshop/commodity/83/4183_1482921083765_530x530.png",
        "homeName": "vivo X9原装柔性钢化膜",
        "homeNametwo": "【限时包邮】X9原装柔性钢化膜，两片装，平面贴膜，2.5D弧面位置不在贴膜覆盖范围，适用X9s、X9机型",
        "homeBright": "限时包邮",
        "homeTitle": "X9原装保护膜，两片装，平面贴膜，2.5D弧面位置不在贴膜覆盖范围，适用X9 Plus机型",
        "homeValue": "1",
        "homePrice": "29",
        "homeSwipe": [
          {
            "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/83/4183_1482921083765_530x530.png"
          },
          {
            "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/83/4183_1482921084622_530x530.png"
          },
          {
            "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/83/4183_1482921085636_530x530.png"
          }
        ],
        "Images": [
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20161228/20161228182922570780_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20161228/20161228182924725469_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20161228/20161228182926902290_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20161228/2016122818292876139_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20161228/20161228182930584710_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20170313/2017031310001685049_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20161228/20161228182935300354_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20170113/20170113090936206455_original.jpg"
          }
        ]
      },
      {
        "isExit": false,
        "id": 12,
        "homeImg": "https://shopstatic.vivo.com.cn/vivoshop/commodity/81/4181_1482720908043_250x250.png",
        "homeName": "vivo Xplay6原装3D高清保护膜",
        "homeNametwo": "【限时包邮】【两片装】请先观看详情中贴膜教程视频，按照教程贴膜",
        "homeBright": "限时包邮,两片装",
        "homeTitle": "原装保护膜，两片装，平面贴膜，2.5D弧面位置不在贴膜覆盖范围，适用vivo Xplay6机型",
        "homeValue": "1",
        "homePrice": "39",
        "homeSwipe": [
          {
            "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/81/4181_1482720908043_530x530.png"
          },
          {
            "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/81/4181_1482720907295_530x530.png"
          },
          {
            "swipe": "https://shopstatic.vivo.com.cn/vivoshop/commodity/81/4181_1482720908843_530x530.png"
          }
        ],
        "Images": [
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20161226/201612261443000927_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20161226/20161226144302130582_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20161226/20161226144304526755_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20161226/20161226144306895595_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20161226/20161226144308953683_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20161226/20161226144311376601_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20161226/20161226144313148401_original.jpg"
          },
          {
            "one": "https://shopstatic.vivo.com.cn/vivoshop/commodity/20161226/20161226164924516569_original.jpg"
          }
        ]
      }
    ]
function saveToMongo(obj,model) {
  (new model(obj)).save(function (err) {
    if (err) {
      console.log(err)
      return
    }
    console.log('数据插入成功')
  })
}
function findMongodbData (model) {
  return new Promise((resolve, reject) => {
    model.find({}, function(err, data) {
      if(err) {
        return reject(err);
      }
      resolve(data)
    });
  })
}
// homeData.forEach(function (ele) {
//   saveToMongo(ele, HomeModel)
// })

// changeData.forEach(function (ele) {
//   saveToMongo(ele, ChangeModel)
// })

// saveToMongo(classifyData, ClassifyModel)

// goodDetailData.forEach(function (ele) {
//   saveToMongo(ele, goodDetailModel)
// })

// newsData.forEach(function (ele) {
//   saveToMongo(ele, newsModel)
// })

// saveToMongo(partData, partModel)

// saveToMongo(phoneData, phoneModel)

// setData.forEach(function (ele) {
//   saveToMongo(ele, setModel)
// })

/*
密码登陆
 */
router.post('/login_pwd', function (req, res) {
  const name = req.body.name
  const pwd = md5(req.body.pwd)
  const captcha = req.body.captcha.toLowerCase()
  console.log('/login_pwd', name, pwd, captcha, req.session)

  // 可以对用户名/密码格式进行检查, 如果非法, 返回提示信息
  if(captcha!==req.session.captcha) {
    return res.send({code: 1, msg: '验证码不正确'})
  }
  // 删除保存的验证码
  delete req.session.captcha

  UserModel.findOne({name}, function (err, user) {
    if (user) {
      console.log('findUser', user)
      if (user.pwd !== pwd) {
        res.send({code: 1, msg: '用户名已经存在!'})
      } else {
        req.session.userid = user._id
        res.send({code: 0, data: {_id: user._id, name: user.name, phone: user.phone}})
      }
    } else {
      const userModel = new UserModel({name, pwd})
      userModel.save(function (err, user) {
        // 向浏览器端返回cookie(key=value)
        // res.cookie('userid', user._id, {maxAge: 1000*60*60*24*7})
        req.session.userid = user._id
        const data = {_id: user._id, name: user.name}
        // 3.2. 返回数据(新的user)
        res.send({code: 0, data})
      })
    }
  })
})

/*
一次性图形验证码
 */
router.get('/captcha', function (req, res) {
  var captcha = svgCaptcha.create({
    ignoreChars: '0o1l',
    noise: 2,
    color: true
  });
  req.session.captcha = captcha.text.toLowerCase();
  console.log(req.session.captcha)
  /*res.type('svg');
  res.status(200).send(captcha.data);*/
  res.type('svg');
  res.send(captcha.data)
});

/*
发送验证码短信
*/
router.get('/sendcode', function (req, res, next) {
  //1. 获取请求参数数据
  var phone = req.query.phone;
  //2. 处理数据
  //生成验证码(6位随机数)
  var code = sms_util.randomCode(6);
  //发送给指定的手机号
  console.log(`向${phone}发送验证码短信: ${code}`);
  sms_util.sendCode(phone, code, function (success) {//success表示是否成功
    if (success) {
      users[phone] = code
      console.log('保存验证码: ', phone, code)
      res.send({"code": 0})
    } else {
      //3. 返回响应数据
      res.send({"code": 1, msg: '短信验证码发送失败'})
    }
  })
})

/*
短信登陆
*/
router.post('/login_sms', function (req, res, next) {
  var phone = req.body.phone;
  var code = req.body.code;
  console.log('/login_sms', phone, code);
  if (users[phone] != code) {
    res.send({code: 1, msg: '手机号或验证码不正确'});
    return;
  }
  //删除保存的code
  delete users[phone];


  UserModel.findOne({phone}, function (err, user) {
    if (user) {
      req.session.userid = user._id
      res.send({code: 0, data: user})
    } else {
      //存储数据
      const userModel = new UserModel({phone})
      userModel.save(function (err, user) {
        req.session.userid = user._id
        res.send({code: 0, data: user})
      })
    }
  })

})

/*
根据sesion中的userid, 查询对应的user
 */
router.get('/userinfo', function (req, res) {
  // 取出userid
  const userid = req.session.userid
  // 查询
  UserModel.findOne({_id: userid}, _filter, function (err, user) {
    // 如果没有, 返回错误提示
    if (!user) {
      // 清除浏览器保存的userid的cookie
      delete req.session.userid

      res.send({code: 1, msg: '请先登陆'})
    } else {
      // 如果有, 返回user
      res.send({code: 0, data: user})
    }
  })
})


router.get('/logout', function (req, res) {
  // 清除浏览器保存的userid的cookie
  delete req.session.userid
  // 返回数据
  res.send({code: 0})
})
router.get('/search_shops', function (req, res) {
  const {geohash, keyword} = req.query
  ajax('http://cangdu.org:8001/v4/restaurants', {
    'extras[]': 'restaurant_activity',
    geohash,
    keyword,
    type: 'search'
  }).then(data => {
    res.send({code: 0, data})
  })
})

//vivo-首页
router.get('/index_goods', function (req, res) {
  findMongodbData(HomeModel)
      .then(data => {
        res.send({
          code: 200,
          message: '数据请求成功',
          success: true,
          home: data
        })
      })

    // HomeModel.find({}, function(err, data) {
    //     if(err) {
    //         console.log(err);
    //     } else {
    //         res.send({
    //             code: 200,
    //             message: '数据请求成功',
    //             success: true,
    //             home: data
    //         })
    //     }
    // });
})
//分类
router.get('/classify', function (req, res) {
  findMongodbData(ClassifyModel)
      .then(data => {
        res.send({
          code: 200,
          message: '数据请求成功',
          success: true,
          classify: data
        })
      })
    // ClassifyModel.find({}, function(err, data) {
    //     if(err) {
    //         console.log(err);
    //     } else {
    //         res.send({
    //             code: 200,
    //             message: '数据请求成功',
    //             success: true,
    //             classify: data
    //         })
    //     }
    // });
})
//动态
router.get('/news', function (req, res) {
  findMongodbData(newsModel)
      .then(data => {
        res.send({
          code: 200,
          message: '数据请求成功',
          success: true,
          news: data,
          totalCount: data.length
        })
      })
    // newsModel.find({}, function(err, data) {
    //     if(err) {
    //         console.log(err);
    //     } else {
    //         res.send({
    //             code: 200,
    //             message: '数据请求成功',
    //             success: true,
    //             news: data,
    //             totalCount: data.length
    //         })
    //     }
    // });
})
//详情
router.get('/goodDetail', function (req, res) {
  findMongodbData(goodDetailModel)
      .then(data => {
        res.send({
          code: 200,
          message: '数据请求成功',
          success: true,
          goodDetail: data,
          totalCount: data.length
        })
      })
    // goodDetailModel.find({}, function(err, data) {
    //     if(err) {
    //         console.log(err);
    //     } else {
    //         res.send({
    //             code: 200,
    //             message: '数据请求成功',
    //             success: true,
    //             goodDetail: data,
    //             totalCount: data.length
    //         })
    //     }
    // });
})
//以旧换新
router.get('/change', function (req, res) {
  findMongodbData(ChangeModel)
      .then(data => {
        res.send({
          code: 200,
          message: '数据请求成功',
          success: true,
          change: data
        })
      })
    // ChangeModel.find({}, function(err, data) {
    //     if(err) {
    //         console.log(err);
    //     } else {
    //         res.send({
    //             code: 200,
    //             message: '数据请求成功',
    //             success: true,
    //             change: data
    //         })
    //     }
    // });
})
//获取手机分类列表
router.get('/phone', function (req, res) {
  findMongodbData(phoneModel)
      .then(data => {
        res.send({
          code: 200,
          message: '数据请求成功',
          success: true,
          phone: data
        })
      })
    // phoneModel.find({}, function(err, data) {
    //     if(err) {
    //         console.log(err);
    //     } else {
    //         res.send({
    //             code: 200,
    //             message: '数据请求成功',
    //             success: true,
    //             phone: data
    //         })
    //     }
    // });
})
//获取配件分类列表
router.get('/part', function (req, res) {
  findMongodbData(partModel)
      .then(data => {
        res.send({
          code: 200,
          message: '数据请求成功',
          success: true,
          parts: data
        })
      })
  // partModel.find({}, function(err, data) {
  //   if(err) {
  //     console.log(err);
  //   } else {
  //     res.send({
  //       code: 200,
  //       message: '数据请求成功',
  //       success: true,
  //       parts: data
  //     })
  //   }
  // });
})




module.exports = router;
