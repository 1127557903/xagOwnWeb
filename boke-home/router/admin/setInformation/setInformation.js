const express = require('express')
const router = express.Router()
const fs = require('fs')
const multer = require('multer')
const path = require('path')
const db = require('../../../connect/connect')
const uploadfile = require('../../../config/files')

// const upload = multer({
//     dest:"public/upload"
// });

// const singleMidle = upload.single("singleFile");//一次处理一张
// const arrMidle  = upload.array("arrayFile", 5);//一次最多处理5张
// const fieldsMidle  = upload.fields([
//   {name:"fieldSingleFile", maxCount:1},
//   {name:"fieldArrayFile", maxCount:4}
// ]);//可同时处理多个上传控件的上传
// //实际项目中根据自己的情况，使用以上三种用法之一即可！

router.get('/toSetHead',(req,res) => {
    res.render('setInformation/setHead')
})

// 修改后端头像

router.post('/setHead',multer({dest:"public/upload/headimg"}).any(),async (req,res) => {

    // uploadfile(req.files[0],)
    let username = req.session.user
    let file = req.files[0]
    let ext = path.parse(file.originalname).ext
    fileName = file.destination + '/' +file.filename+ext
    fs.rename(file.path,fileName,async (err) => {
        let sql = 'select head_pic from admin where users_name=?'
        let resl = await db(sql, [username])
        let addsql = 'update admin set head_pic=? where users_name=?'
        let name = fileName.replace('public','')
        let result = await db(addsql, [name,username])
        if (resl && resl.length > 0) {
           let oldPic = 'public'+resl[0].head_pic
           fs.unlink(oldPic, function(err){
            if(err){
                throw err;
            }
                res.send({
                    "code": 0
                    ,"msg": ""
                    ,"data": {
                      "src": fileName
                    }
                  })
            })
        }
    })
})

module.exports = router