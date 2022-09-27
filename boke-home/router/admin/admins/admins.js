const express = require("express")
const router =  express.Router()
const db = require('../../../connect/connect')
const multer = require('multer')
const uploadfile = require('../../../config/files')
const unlinkfile = require('../../../methods/unlink')
const md5 = require('../../../config/md5')


router.get('/',(req,res) => {
    res.render('admins/admins')
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
        strArr.push('nickname like ?')
    }
    let str = strArr.join(' and ')
    if(str){
        str = 'where ' + str
    }
    let sql = `select * from admin ${str} limit ?,?`
    let data = await db(sql,[...arr,(limit*(page-1)),limit])
    let sql1 = `select count(*) from admin ${str}`
    let num = await db(sql1,arr)
    res.send({
        code: '0',
        data,
        count: num[0]['count(*)'],
    })
})

// 新增账号页面
router.get('/addadmins',(req,res) => {
    res.render('admins/addadmins')
})

// 新增账号
router.post('/add',multer({dest:"public/upload/headimg"}).any(),async (req,res) => {
    let { 
        users_name,
        password,
        repassword,
        sex,
        age,
        email
    } = req.body
    let img = uploadfile(req.files[0])
    if (!users_name || !password || !repassword || !age) {
        unlinkfile.hadName(img)
        res.send({
            "code": '303'
            ,"msg": "缺少必填参数"
            ,"data": {
              "src": ""
            }
        })
        return
    }
    if (password !== repassword) {
        unlinkfile.hadName(img)
        res.send({
            "code": '303'
            ,"msg": "两次密码不一致"
            ,"data": {
              "src": ""
            }
        })
        return
    }
    let sql1 = "select * from admin where users_name=?"
    let data = await db(sql1,[users_name])
    if(data && data.length !== 0) {
        unlinkfile.hadName(img)
        res.send({
            "code": '303'
            ,"msg": "该账号已存在"
            ,"data": {
              "src": ""
            }
        })
        return
    }
    let sql = "insert into admin (users_name,password,sex,age,email,head_pic) values (?,?,?,?,?,?)"
    try {
      let da = await  db(sql,[users_name,md5(password),sex,age,email,img])
    } catch(e) {
            unlinkfile.hadName(img) //删除文件
            res.send({
                "code": '400'
                ,"msg": e
                ,"data": {
                  "src": ''
                }
            })
            return
    }
    res.send({
        "code": '200'
        ,"msg": "上传成功"
        ,"data": {
          "src": img
        }
    })
})


module.exports = router