const express = require("express")
const router =  express.Router()
const db = require('../../../connect/connect')
const timeChange = require('../../../config/timefilter')

const moment = require('moment')
const multer = require('multer')
const uploadfile = require('../../../config/files')
const unlinkfile = require('../../../methods/unlink')

router.get('/',(req,res)=> {
    res.render('rotation/rotation')
})

// 游记数据
router.get('/select',async (req,res)=>{
    let { page,limit,title,type,create_time } = req.query
    // where book like '%张%'
    page = parseInt(page)
    limit = parseInt(limit)
    let str=''
    let dataArr = []
    let nameArr = []
    if (title) {
        nameArr.push("title like ?")
        dataArr.push(`%${title}%`)
    }
    if (type) {
        nameArr.push("type like ?")
        dataArr.push(`%${type}%`)
    }
    if (create_time) {
        nameArr.push('date(create_time) between ? and ?')
        let time = create_time.split(' ~ ')
        dataArr = [...dataArr,...time]
    }
    if (nameArr.length > 0) {
        str = `where ${nameArr.join(' and ')}`
    }
    let sql = `select * from wonderful ${str} limit ?,?`
    console.log(sql,'sql')
    let data = await db(sql,[...dataArr,(limit*(page-1)),limit])
    let sql1 = 'select count(*) from wonderful'
    data = data.map(item => {
        return {...item,create_time:timeChange(item.create_time)}
    })
    let num = await db(sql1)
    res.send({
        code: '0',
        data,
        count: num[0]['count(*)'],
    })
})

// 轮播状态变化
router.post('/state',(req,res) => {
    let {id,state} = req.body
    let sql ='update wonderful set isShow=? where id=?'
    db(sql,[state,id]).then(data => {
        res.send({
            code: '200',
            data,
            msg: '修改成功'
        })
        return
    }).catch(e => {
        res.send({
            "code": '301'
            ,"msg": "删除失败"
            ,"data": e
        })
    })
})

// 添加和修改轮播
router.post('/add',multer({dest:"public/upload/rotationimg"}).any(),(req,res) => {
    let {title,text,type,isShow,id} = req.body
    if (!title || !text || !type  || (!isShow && isShow !== 0)) {
        if (req.files && res.files.length !== 0) {
            unlinkfile.noName(res.files[0])
        }
        res.send({
            code: '303',
            data:null,
            msg: '请填写完整表单'
        })
        return
    }
    let sql = 'update wonderful set title=?,text=?,type=?,isShow=? where id=?'
    let arr = [title,text,type,isShow,id]
    let img = ''
    if(!id) {
        sql = "insert into wonderful (title,text,type,isShow,create_time,img) values(?,?,?,?,?,?)"
        img = uploadfile(req.files[0])
        arr = [title,text,type,isShow,create_time,img]
    } else {
        if (req.files[0]) {
            sql = 'update wonderful set title=?,text=?,type=?,isShow=?,img=? where id=?'
            img = uploadfile(req.files[0])
            console.log(img)
            arr = [title,text,type,isShow,img,id]
        }
    }
    let create_time = moment().format('YYYY-MM-DD HH:mm:ss')
    console.log(sql,img,arr)
    db(sql,arr).then(data => {
        res.send({
            code: '200',
            msg: '成功',
            data
        })
        return
    }).catch(e => {
        unlinkfile.hadName(img)
        res.send({
            "code": '301'
            ,"msg": "失败"
            ,"data": e
        })
    })
})

// 删除轮播
router.post('/delete',async (req,res)=>{
    let {ids} = req.body
    if (!ids || ids.length == 0){
        res.send({
            "code": '303'
            ,"msg": "参数不全"
            ,"data": {
              "src": ""
            }
        })
        return
    }
    let str1=''
    ids.forEach((item,index) => {
        if(index == 0) {
            str1+='id=?'
            return
        }
        str1+=' or id=?'
    })
    let sql1 = `select img from wonderful where ${str1}`
    let imgs1 = await db(sql1,ids)
    imgs1 = imgs1.map(item => item.img)

    let sql4 = `delete from wonderful where ${str1}`
    db(sql4,ids)
    let arr = [...imgs1]
    arr.forEach(item => {
        unlinkfile.hadName(item)
    })
    res.send({        
        "code": '200'
        ,"msg": "删除成功"
        ,"data": {
        "src": ""
    }})
})

module.exports = router