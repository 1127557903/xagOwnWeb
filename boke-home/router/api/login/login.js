const express = require("express");
const router = express.Router();
const db = require('../../../connect/connect')
const md5 = require('../../../config/md5')
const jwt = require('jsonwebtoken')
const sendmail = require('../../../methods/sendmail')
var {PRI_KEY} = require('../../../config/jwtpass')

router.post('/',async (req,res)=>{
    let { username,password } = req.body
    let sql = 'select * from users where users_name=?'
    let data = await db(sql,[username])
    if(!data || data.length === 0) {
        res.send({
            code: '203',
            msg: '用户名或密码错误'
        })
        return
    }
    if(md5(password) !== data[0].password){
        res.send({
            code: '203',
            msg: '用户名或密码错误'
        })
        return
    }
    // let token = await jwt.sign({id:data[0].id,username},PRI_KEY,{ expiresIn: '30s' })
    let token = await jwt.sign({id:data[0].id,username},PRI_KEY,{})
    let {nickName,sex,age,tel,email,state} = data[0]
    res.send({
        code: '200',
        msg: '登陆成功',
        data: {token,user:{nickName,sex,age,tel,email,state,username}}
    })
})

router.post('/register',async (req,res)=>{
    let { username,password,repassword } = req.body
    let sql = 'select * from users where users_name=?'
    let data = await db(sql,[username])
    if(data && data.length !== 0) {
        res.send({
            code: '201',
            msg: '该用户已存在'
        })
        return
    }
    if(password !== repassword){
        res.send({
            code: '202',
            msg: '两次密码不一致'
        })
        return
    }
    let sql1 = 'insert into users (users_name,password,state) values(?,?,?)'
    db(sql1,[username,md5(password),1])
    res.send({
        code: '200',
        msg: '注册成功'
    })
})

// 未登录生成二维码产生的code验证
router.post('/setcode',async (req,res) => {
    let {code} = req.body

    let sql = 'insert into login_code (code) values(?)'
    let data1 = await db(sql,[code])
    let sql2 = 'select * from login_code where code=?'
    let index = 0
    let timer2 = setInterval(async () => {
        index++
        let result = await db(sql2,[code])
        if(result[0].isScanning) {
            res.send({code:'200',msg:'扫描成功,请确认登录！'})
            clearInterval(timer2)
            return
        }
        if(index == 60){
            let sql3 = 'delete from login_code where code=?'
            await db(sql3,[code])
            res.send({code:'300',msg:'二维码失效'})
            clearInterval(timer2)
            return
        }
    },1000)
})

// 已登录端扫描二维码匹配code
router.get('/getcode',async (req,res) => {
    let {code} = req.query
    if(!code){
        res.send({
            code:'305',
            msg:'无效二维码'
        })
        return
    }
    let {username,id} = req.user
    let sql2 = 'select * from login_code where code=?'
    let data2 = await db(sql2,[code])
    let isScanning = JSON.stringify([username,id])
    if(data2 && data2.length !== 0 && data2[0].code == code){
        let sql = 'update login_code set isScanning=? where code=?'
        let data1 = await db(sql,[isScanning,code])
        res.send({
            code:'200',
            msg:'扫描成功',
            data:{
                code
            }
        })
    } else {
        let sql3 = 'delete from login_code where code=?'
        await db(sql3,[code])
        res.send({
            code:'305',
            msg:'无效二维码'
        })
    }
})

// 确认登录
router.get('/sureCodeLogin',async(req,res) => {
    let {code} = req.query
    let sql2 = 'select * from login_code where code=?'
    let data2 = await db(sql2,[code])
    console.log(code,'code')
    if(data2 && data2.length !== 0 && data2[0].code == code){
        let sql = 'update login_code set isSure=? where code=?'
        let data1 = await db(sql,[1,code])
        res.send({
            code:'200',
            msg:'已确认登录'
        })
    } else {
        let sql3 = 'delete from login_code where code=?'
        await db(sql3,[code])
        res.send({
            code:'307',
            msg:'登录失败'
        })
    }
})
// pc扫描后查询是否调用登录
router.post('/codeLogin',(req,res) => {
    let {code} = req.body
    let sql2 = 'select * from login_code where code=?'
    let index = 0
    let timer2 = setInterval(async () => {
        index++
        let result = await db(sql2,[code])
        if(result[0].isSure == 1) {
            let {id,username} = JSON.parse(result[0].isScanning)
            let token = await jwt.sign({id,username},PRI_KEY,{})
            let sql3 = 'delete from login_code where code=?'
            await db(sql3,[code])
            res.send({code:'200',msg:'登录成功！',token})
            clearInterval(timer2)
            return
        }
        if(index == 60){
            let sql3 = 'delete from login_code where code=?'
            await db(sql3,[code])
            res.send({code:'300',msg:'登录失效，请重试！'})
            clearInterval(timer2)
            return
        }
    },1000)
})
// 发送邮箱验证码
router.post('/sendEmailCode',async(req,res) => {
    let {email} = req.body
    let sql = 'select * from users where email = ?'
    let data = await db(sql,[email])
    if(!data || data.length == 0){
        res.send({code:'333',msg:'该邮箱没有绑定账号'})
        return
    }

    let code = Math.round(Math.random()*1000000)
    let message = {
        to: email, // list of receivers
        subject: 'xagOwnWeb网站邮箱登录验证码', // Subject line
        // 发送text或者html格式
        // text: 'Hello 我是火星黑洞', // plain text body
        html: `<div class="mymail">
                    <p>您好，如果 ${data[0].nick_name} 不是您的xagownweb网站昵称，请不要点击此邮件中的任何内容！</p>

                    <p>以下是您的验证码：</p>
                    <h1>${code}</h1>
                    <p>我们收到了来自您的xagownweb网站的安全请求。请使用上方的验证码来验证您的账号归属。</p>

                    <p>请注意：该验证码将在10分钟后过期，请尽快验证！</p>

                    <p>享受您的历险！</p>
                    <p>xagownweb网站客服团队</p>

                    <p>如果您有任何疑问，请访问<a href="localhost:8080" target="_blank" >xagOwnWeb</a>网站，进行访问</p>
                </div>` // html body
    }
    sendmail(message).then(async data=>{
        res.send({code:'200',msg:'发送成功'})
        // 发送成功后先删除多余数据
        let sql3 = 'delete from login_code where user=?'
        await db(sql3,[email])
        // 再存储验证码
        let sql1 = 'insert into login_code (code,user) values(?,?)'
        await db(sql1,[code,email])
        // 最后过期删除
        let sql2 = 'delete from login_code where code=?'
        var timer2 = setTimeout(async () => {
            await db(sql2,[code])
            clearTimeout(timer2)
        },60000)
    }).catch(err =>{
        console.log(err)
        res.send({code:'333',msg:'发送失败'})
    })
})
// 邮箱登录
router.post('/emailLogin',async(req,res) => {
    let {email,code} = req.body
    let sql = 'select * from login_code where user=? and code=?'
    let result = await db(sql,[email,code])
    if(!result || result.length ==0){
        res.send({
            code:'307',
            msg: '验证码错误'
        })
        return
    }
    let sql1 = 'select * from users where email=?'
    let data = await db(sql1,[email])
    if(!data || data.length == 0){
        res.send({
            code:'308',
            msg: '邮箱账号不存在'
        })
        return
    }
    const {nickName,sex,age,tel,state,username} = data[0]
    let token = await jwt.sign({id:data[0].id,username:data[0].username},PRI_KEY,{})
    res.send({
        code: '200',
        msg: '登录成功',
        data: {token,user:{nickName,sex,age,tel,email,state,username}}
    })
})
module.exports = router