const express = require("express")
const router =  express.Router()
const db = require('../../../connect/connect')

router.get('/select',(req,res)=>{
    let sql = 'select * from notice where isShow=?'
    db(sql,[1]).then(data =>{
        res.send({
            code:'200',
            msg: '查询成功',
            data
        })
        return
    }).catch(err => {
        res.send({
            code:'200',
            msg: 'err',
        })
    })
})

module.exports = router