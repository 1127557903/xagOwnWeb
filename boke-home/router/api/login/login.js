const express = require("express");
const router = express.Router();
const db = require('../../../connect/connect')
const md5 = require('../../../config/md5')
const jwt = require('jsonwebtoken')
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
        if(index == 10){
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
    let {username,id} = req.user
    let sql2 = 'select * from login_code where code=?'
    let data2 = await db(sql2,[code])
    let isScanning = JSON.stringify([username,id])
    if(data2 && data2.length !== 0 && data2[0].code == code){
        let sql = 'update login_code set isScanning=? where code=?'
        let data1 = await db(sql,[isScanning])
        res.send({
            code:'200',
            msg:'扫描成功'
        })
    }
})

// 确认登录
router.get('/sureCodeLogin',async(req,res) => {
    let {code} = req.query
    let sql2 = 'select * from login_code where code=?'
    let data2 = await db(sql2,[code])
    if(data2 && data2.length !== 0 && data2[0].code == code){
        let sql = 'update login_code set isSure=? where code=?'
        let data1 = await db(sql,[1])
        res.send({
            code:'200',
            msg:'已确认登录'
        })
    }
})

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
            res.send({code:'200',msg:'登录成功！',token})
            clearInterval(timer2)
            return
        }
        if(index == 10){
            let sql3 = 'delete from login_code where code=?'
            await db(sql3,[code])
            res.send({code:'300',msg:'登录失效，请重试！'})
            clearInterval(timer2)
            return
        }
    },1000)
})

module.exports = router