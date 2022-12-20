const express = require("express");
const router = express.Router();
const cors = require('cors')

const loginRoute = require('../api/login/login')
const userRoute = require('../api/user/user')
const tripRoute = require('../api/trip/trip')
const homeRoute = require('../api/home/home')
const placeRoute = require('../api/place/place')
const travelsRoute = require('../api/travels/travels')
const delicousRoute = require('../api/delicous/delicous')
const hotelRoute = require('../api/hotel/hotel')
const noticeRouter = require('../api/notice/notice')
const emoRouter = require('../api/emo/emo')





const jwtt = require("express-jwt")
// const createError = require("http-errors");
var {PRI_KEY} = require('../../config/jwtpass')

const passPath = ['/api','/api/login','/api/login/setcode','/api/login/register','/api/login/sendEmailCode','/api/emo/selectAll','/api/login/codeLogin','/api/login/emailLogin']
router.use(jwtt({ secret: PRI_KEY }).unless({ path:passPath }));

router.use(cors());

router.use('/login',loginRoute)
router.use('/user',userRoute)
router.use('/trip',tripRoute)
router.use('/place',placeRoute)
router.use('/home',homeRoute)
router.use('/travels',travelsRoute)
router.use('/delicous',delicousRoute)
router.use('/hotel',hotelRoute)
router.use('/notice',noticeRouter)
router.use('/emo',emoRouter)



router.use((err,req,res,next)=>{
    if (err.name === 'UnauthorizedError') {
        res.send({
            code: '304',
            msg: '用户未登录'
        })
    }
})

module.exports = router