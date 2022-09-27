const express = require("express")
const router =  express.Router()
const db = require('../../../connect/connect')
const multer = require('multer')
const uploadfile = require('../../../config/files')
const unlinkfile = require('../../../methods/unlink')

router.get('/',(req,res)=>{
    res.render('editor/editor')
})

router.post('/uploadImg',multer({dest:"public/upload/editorImg"}).any(),(req,res)=>{
    let img = uploadfile(req.files[0])
    res.send({
        code:'200',
        data: img
    })
})


module.exports = router