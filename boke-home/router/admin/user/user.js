const express = require("express");
const router = express.Router();
const db = require('../../../connect/connect')

router.get('/',(req,res)=>{
    res.render('user/user')
})

router.get('/select',async (req,res)=>{
    let { page,limit,users_name,nick_name } = req.query
    page = parseInt(page)
    limit = parseInt(limit)
    let arr=[]
    let strArr=[]
    if(users_name){
        strArr.push('users_name like ?')
        arr.push(`%${users_name}%`)
    }
    if(nick_name){
        arr.push(`%${nick_name}%`)
        strArr.push('nick_name like ?')
    }
    let str = strArr.join(' and ')
    if(str){
        str = 'where ' + str
    }
    let sql = `select * from users ${str} limit ?,?`
    let data = await db(sql,[...arr,(limit*(page-1)),limit])
    let sql1 = `select count(*) from users ${str}`
    let num = await db(sql1,arr)
    res.send({
        code: '0',
        data,
        count: num[0]['count(*)'],
    })
})

router.post('/state',async(req,res)=>{
    let sql = 'update users set state=? where id=?'
    let { id,state } = req.body
    let data = await db(sql,[state,id])
    res.send({
        code:'200',
        msg: '修改成功'
    })
})

module.exports = router