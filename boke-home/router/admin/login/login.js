const express = require("express")
const router =  express.Router()
const db = require('../../../connect/connect')
const md5 = require('../../../config/md5')
// const jwt = require("jsonwebtoken");
// const {PRI_KEY,EXPIR} = require('../../../config/jwtpass')
var svgCaptcha = require('svg-captcha');
router.get('/',(req,res)=>{
    res.render('login')
})
router.post('/',async (req,res)=>{
    let {username,password,code} = req.body
    if (code !== req.session.code) {
        res.send({code: '301',msg: '验证码错误，请重新输入'})
        return
    }
    let sql = 'select * from admin where users_name=?'
    let data = await db(sql,[username])
    // console.log(data,md5(password),username)
    if (!data || data.length < 1) {
        res.send({code:'303',msg:'账号或密码错误'})
        return
    }
    if (md5(password) !== data[0].password) {
        res.send({code:'303',msg:'账号或密码错误'})
        return

    }
    // let token = jwt.sign(
    //     {
    //       username,
    //     },
    //     PRI_KEY,
    //     {
    //       expiresIn: EXPIR,
    //     }
    // );
    req.session.user = username
    res.send({code:'200',msg:'登录成功'})
})

router.get('/getCode',(req,res)=>{
    // let a = '1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM'
    // let nums = a.split('')
    // let arr =[]
    // for (let i=0;i<6;i++) {
    //     arr.push(nums[Math.round(Math.random()*62)])
    // }
    var captcha = svgCaptcha.create({  
        // 翻转颜色  
        inverse: false,  
        // 字体大小  
        fontSize: 36,  
        // 噪声线条数  
        noise: 2,  
        // 宽度  
        width: 100,  
        // 高度  
        height: 40,  
        // 长度
        size:6
      });
    req.session.code = captcha.text
    res.setHeader('Content-Type', 'image/svg+xml');
    res.write(String(captcha.data));
    res.end()
})
router.get('/loginOut',(req,res)=>{
    delete req.session.user
    res.render('login')
})

module.exports = router