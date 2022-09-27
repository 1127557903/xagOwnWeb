const express = require("express");
const router = express.Router();
const loginRoute = require('../admin/login/login')
const indexRoute = require('../admin/index/index')
const setRoute = require('../admin/setInformation/setInformation')
const informationRoute = require('../admin/Information/Information')
const mailRoute = require('../admin/sendmail/sendmail')
const spotRoute = require('../admin/spot/spot')
const userRoute = require('../admin/user/user')
const adminsRouter = require('../admin/admins/admins')
const travelsRouter = require('../admin/travels/travels')
const rotationRouter = require('../admin/rotation/rotation')
const homeRouter = require('../admin/home/home')
const delicousRouter= require('../admin/delicous/delicous')
const hotelRouter = require('../admin/hotel/hotel')
const noticeRouter = require('../admin/notice/notice')
const editorRouter = require('../admin/editor/editor')
const codeRouter = require('../admin/code/code')
const emoRouter = require('../admin/emo/emo')




// const jwtt = require("express-jwt")
// const createError = require("http-errors");
// var {PRI_KEY} = require('../../config/jwtpass')

// const passPath = ['/admin','/admin/login']
// router.use(jwtt({ secret: PRI_KEY }).unless({ path:passPath }));


router.get('/',(req,res) => {
    res.render('login')
})
router.use('/login',loginRoute)
router.use((req,res,next) => {
    if (!req.session.user) {
        res.render('login', {msg: '请先登录'})
        return
    }
    next()
})
// 发送邮件
router.use('/sendmail',mailRoute)
// 主页
router.use('/index',indexRoute)
// 设定基础信息
router.use('/setInformation',setRoute)
router.use('/Information',informationRoute)
router.use('/spot',spotRoute)
// 用户管理
router.use('/user',userRoute)
// 账户管理（后台管理员）
router.use('/admins',adminsRouter)
// 游记管理
router.use('/travels',travelsRouter)
// 轮播管理
router.use('/rotation',rotationRouter)
// 酒店管理
router.use('/hotel',hotelRouter)
// 首页
router.use('/home',homeRouter)
// 美食管理
router.use('/delicous',delicousRouter)
router.use('/notice',noticeRouter)
router.use('/editor',editorRouter)
router.use('/code',codeRouter)
router.use('/emo',emoRouter)




router.use((err,req,res,next)=>{
    if (err.name === 'UnauthorizedError') {
        if (req.method === 'POST') {
            res.render('https://www.baidu.com')
        }
        if (req.method === 'GET') {
            res.render('404')
        }
    }
})
module.exports = router