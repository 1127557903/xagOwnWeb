const express = require("express")
const router =  express.Router()
const db = require('../../../connect/connect')
const md5 = require('../../../config/md5')

router.get('/',async (req,res)=>{
    let username = req.session.user
    let sql = 'select * from admin where users_name=?'
    let data = await db(sql,[username])
    res.render('information/information',{data:data[0], num: 0})
})

// 修改后台用户密码
router.post('/resetpassword',async (req,res) =>{
    let {user} =  req.session
    let {password,newpassword} = req.body
    let sql = 'update admin set password=?  where users_name=?'
    let sql1 = 'select * from admin where users_name=? and password=?'
    let data1 = await db(sql1,[user,md5(password)])
    if(!data1 || data1.length == 0) {
         res.send({
             code: '401',
             msg: '原密码错误',
             data: ''
         })
         return
    }
    let data = await db(sql,[md5(newpassword),user])
    res.send({
        code: '200',
        msg: '修改成功，请重新登录',
        data: ''
    })
})

module.exports = router