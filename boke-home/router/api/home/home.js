const express = require("express")
const router =  express.Router()
const db = require('../../../connect/connect')

const fs = require('fs')
const multer = require('multer')
const path = require('path')

router.get('/wonderful',async (req,res)=>{
    let sql = 'select * from wonderful'
    let data = await db(sql)
    res.send({
        code: '200',
        data
    })
})

module.exports = router