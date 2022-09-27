const express = require("express");
const router = express.Router();
const db = require('../../../connect/connect')
const moment = require('moment')

router.get('/select',async (req,res)=>{
    var {page,limit} = req.query
    page = Number(page)
    limit = Number(limit)
    let sql = `select * from delicious limit ?,?`
    let sql1 = 'select count(*) from delicious'
    let data1 = await db(sql1)
    db(sql,[(limit*(page-1)),limit]).then(data => {
        let reData = data.map(item => {
            return {...item,innerImgs:item.innerImg.split(',')}
        })
        res.send({
            msg:'查询成功',
            code: '200',
            data:reData,
            count: data1[0]['count(*)']
        })
        return
    }).catch(err => {
        res.send({
            msg:err,
            code: '303',
        })
    })
})

router.get('/selectDetail',(req,res)=>{
    let {id} = req.query
    let sql = 'select * from delicious where id=?'
    db(sql,[id]).then(data=>{
        res.send({
            msg:'查询成功',
            code: '200',
            data:data[0],
        })
        return
    }).catch(err => {
        res.send({
            msg:err,
            code: '303',
        })
    })
})

router.get('/selectFood',(req,res)=>{
    let {id} = req.query
    let sql1 = 'select * from foods where d_id=?'
    db(sql1,[id]).then(data =>{
        res.send({
            code:'200',
            msg: '查询成功成功',
            data
        })
    }).catch(err => {
        res.send({
            msg:err,
            code: '303',
        })
    })
})


module.exports = router