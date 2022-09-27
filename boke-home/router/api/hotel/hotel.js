const express = require("express");
const router = express.Router();
const db = require('../../../connect/connect')
const moment = require('moment')

router.get('/select',async (req,res)=>{
    var {page,limit} = req.query
    page = Number(page)
    limit = Number(limit)
    let sql = `select * from hotel limit ?,?`
    let sql1 = 'select count(*) from hotel'
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
    let sql = 'select * from hotel where id=?'
    db(sql,[id]).then(data=>{
        let resData = {...data[0],innerImgArr:data[0].innerImg.split(','),labels:data[0].label.split(','),serviceArr:data[0].service.split(',')}
        res.send({
            msg:'查询成功',
            code: '200',
            data:resData,
        })
        return
    }).catch(err => {
        res.send({
            msg:err,
            code: '303',
        })
    })
})

router.get('/selectRoom',(req,res)=>{
    let {id} = req.query
    let sql1 = 'select * from room where h_id=?'
    db(sql1,[id]).then(data =>{
        res.send({
            code:'200',
            msg: '查询成功',
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