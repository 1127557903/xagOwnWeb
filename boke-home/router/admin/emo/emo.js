const express = require("express")
const router =  express.Router()

const db = require('../../../connect/connect')

const moment = require('moment')
const multer = require('multer')
const uploadfile = require('../../../config/files')
const unlinkfile = require('../../../methods/unlink')

router.get('/',(req,res) => {
    let sql = 'select * from code_map where code=?'
    db(sql,['emo']).then(data => {
        res.render('emo/emo',{emoCode:data})
    })
})

// 查询表情包
router.get('/select',async (req,res)=>{
    let { page,limit,alt,type,create_time } = req.query
    page = parseInt(page)
    limit = parseInt(limit)
    let str=''
    let dataArr = []
    let nameArr = []
    if (alt) {
        nameArr.push("alt like ?")
        dataArr.push(`%${alt}%`)
    }
    if (type) {
        nameArr.push("type=?")
        dataArr.push(type)
    }
    if (create_time) {
        nameArr.push('date(create_time) between ? and ?')
        let time = create_time.split(' ~ ')
        dataArr = [...dataArr,...time]
    }
    if (nameArr.length > 0) {
        str = `where ${nameArr.join(' and ')}`
    }
    let sql = `select * from emoticon ${str} limit ?,?`
    let data = await db(sql,[...dataArr,(limit*(page-1)),limit])
    let sql1 = `select count(*) from emoticon ${str}`
    let num = await db(sql1,dataArr)
    res.send({
        code: '0',
        data,
        count: num[0]['count(*)'],
    })
})

router.post('/add',multer({dest:"public/upload/emoImg"}).any(),(req,res) => {
    let { alt,type } = req.body
    let img = uploadfile(req.files[0])
    let create_time = moment().format('YYYY-MM-DD HH:mm:ss')
    let sql = 'insert into emoticon (src,alt,type,create_time) values (?,?,?,?)'
    db(sql,[img,alt,type,create_time]).then(data => {
        res.send({
            code: '200',
            msg: '添加成功'
        })
        return
    }).catch(err => {
        unlinkfile.hadName(img)
        res.send({
            code: '303',
            msg: err
        })
    })
})

router.post('/update',multer({dest:"public/upload/emoImg"}).any(),async (req,res) => {
    let { alt,type,titleImgChange,id } = req.body
    let str = ''
    let arr = [alt,type,id]
    if (titleImgChange == 'true') {
        var img = uploadfile(req.files[0])
        str = 'src=?,'
        let sql1 = 'select * from emoticon where id=?'
        let result = await db(sql1,[id])
        var deleteImg = result[0].src
        arr.unshift(img)
    }
    let sql = `update emoticon set ${str}alt=?,type=? where id=?`
    db(sql,arr).then(data => {
        unlinkfile.hadName(deleteImg)
        res.send({
            code: '200',
            msg: '修改成功'
        })
        return
    }).catch(err => {
        if (titleImgChange  == 'true') {
            unlinkfile.hadName(img)
        }
        res.send({
            code: '303',
            msg: err
        })
    })
})

// 删除表情包
router.post('/delete',async (req,res) => {
    let {ids} = req.body
    let sqlArr = ids.map(item => {
        return '?'
    })
    let str = sqlArr.join(',')
    let sql = `select * from emoticon where id in (${str})`
    let data = await db(sql,ids)
    let sql1 = `delete from emoticon where id in (${str})`
    db(sql1,ids).then(data1 => {
        data.forEach(item => {
            unlinkfile.hadName(item.src)
        })
        res.send({        
            "code": '200'
            ,"msg": '删除成功'
        })
    }).catch(err => {
        res.send({        
            "code": '303'
            ,"msg": err
        })
    })
})

router.get('/addMoreEmo',(req,res) => {
    let sql = 'select * from code_map where code=?'
    db(sql,['emo']).then(data => {
        res.render('emo/addMoreEmo',{emoCode:data})
    })
})

router.post('/addMore',multer({dest:"public/upload/emoImg"}).any(),(req,res) => {
    let { alt,type } = req.body
    let sqlArr = []
    let strArr = []
    let create_time = moment().format('YYYY-MM-DD HH:mm:ss')
    req.files.forEach(item => {
        console.log(item,'111')
        let img = uploadfile(item)
        sqlArr = [...sqlArr,img,alt,type,create_time]
        strArr.push('(?,?,?,?)') 
    })
    let str = strArr.join(',')
    let sql = `insert into emoticon (src,alt,type,create_time) values ${str}`
    db(sql,sqlArr).then(data => {
        res.send({
            code: '200',
            msg: '添加成功'
        })
        return
    }).catch(err => {
        sqlArr.forEach(item => {
            unlinkfile.hadName(item.img)
        })
        res.send({
            code: '303',
            msg: err
        })
    })
})

module.exports = router