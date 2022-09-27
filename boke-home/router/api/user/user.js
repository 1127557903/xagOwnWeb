const express = require("express");
const router = express.Router();
const db = require('../../../connect/connect')

const multer = require('multer')
const uploadfile = require('../../../config/files')
const unlinkfile = require('../../../methods/unlink')

router.get('/',async (req,res)=>{
    console.log(req.user)
    let { username } = req.user
    let sql = 'select * from users where users_name=?'
    let data = await db(sql,[username])
    res.send({
        code: '200',
        data: data[0]
    })
})

router.get('/countLikes',async (req,res) => {
    let { id } = req.user
    let sql = 'select count(1) as num from c_likes where u_id=?'
    let sql1 = 'select count(1) as num from reply where from_id=?'
    let sql2 = 'select count(1) as num from comment where u_id=?'
    let sql3 = 'select count(1) as num from collection where u_id=?'
    let data = await db(sql,[id])
    let data1 = await db(sql1,[id])
    let data2 = await db(sql2,[id])
    let data3 = await db(sql3,[id])

    let num,num1,num2,num3 = 0
    if(data && data.length ==1 ) {
        num = data[0].num
    }
    if(data1 && data1.length ==1 ) {
        num1 = data1[0].num
    }
    if(data2 && data2.length ==1 ) {
        num2 = data2[0].num
    }
    if(data3 && data3.length ==1 ) {
        num3 = data3[0].num
    }
    let newdata = {
        likes: num,
        comment: num3 + num2,
        collection: num3
    }
    res.send({
        code:'200',
        data:newdata,
        msg:'查询成功'
    })
})

router.get('/travels',async (req,res) => {
    let { id } = req.user
    let sql = 'select travels.*,users.nick_name,users.head_img from travels left join users on travels.u_id=users.id where travels.u_id=?'
    let data = await db(sql,[id])
    res.send({
        code:'200',
        msg:'查询成功',
        data
    })
})

router.post('/setHead',multer({dest:"public/upload/headimg"}).any(),async (req,res)=>{
    let { username } = req.user
    let img = uploadfile(req.files[0])
    let sql = 'update users set head_img=? where users_name=?'
    let sql1 = 'select * from users where users_name=?'
    let data1 = await db(sql1,[username])
    db(sql,[img,username]).then( data => {
        unlinkfile.hadName(data1[0].head_img)
        res.send({
            code:'200',
            msg: '修改成功',
            data: img
        })
    }).catch(err => {
        res.send({
            code:'303',
            msg: '修改失败',
        })
    })
})

router.post('/setInformation',(req,res) => {
    let {nick_name,sex,age,sign} = req.body
    let { username } = req.user
    let arr = [nick_name,sex,age,sign]
    let sqlArr = []
    let sqlArr2 = []
    arr.forEach((item,index) => {
        if(item) {
            sqlArr.push(item)
            if(index == 0) {
                sqlArr2.push('nick_name=?')
            }
            if(index == 1) {
                sqlArr2.push('sex=?')
            }
            if(index == 2) {
                sqlArr2.push('age=?')
            }
            if(index == 3) {
                sqlArr2.push('sign=?')
            }
        }
    })
    sqlArr.push(username)
    let str = sqlArr2.join(',')
    let sql = `update users set ${str} where users_name=?`
    db(sql,sqlArr).then(data => {
        res.send({
            code:'200',
            msg: '修改成功',
        })
    }).catch(err => {
        console.log(err)
        res.send({
            code:'303',
            msg: '修改失败',
        })
    })
})

module.exports = router