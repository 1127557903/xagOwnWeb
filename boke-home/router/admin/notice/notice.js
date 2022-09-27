const express = require("express")
const router =  express.Router()
const db = require('../../../connect/connect')
const md5 = require('../../../config/md5')
const timeChange = require('../../../config/timefilter')
const multer = require('multer')
const uploadfile = require('../../../config/files')
const unlinkfile = require('../../../methods/unlink')
const moment =require('moment')

router.get('/',(req,res)=>{
    res.render('notice/notice')
})
router.get('/editor',async (req,res)=>{
    let {title,url,addtype,id} = req.query
    if(addtype == 'update') {
        let sql = 'select * from notice where id=?'
        let data = await db(sql,[id])
        let text=data[0].text
        res.render('editor/editor',{title,url,text})
        return
    }
    res.render('editor/editor',{title,url,text:''})
})

router.post('/insert',multer({dest:"public/upload/htmls"}).any(),(req,res)=>{
    let fileName = uploadfile(req.files[0],'.html')
    let {title} = req.body
    let {user} = req.session
    let create_time = moment().format('YYYY-MM-DD HH:mm:ss')
    let sql = 'insert into notice (title,text,create_time,user) values(?,?,?,?)'
    db(sql,[title,fileName,create_time,user]).then(data => {
        res.send({
            code:'200',
            msg:'添加成功',
            data
        })
    }).catch(err => {
        console.log(err,'err')
        res.send({
            code:'303',
            msg:err
        })
    })
})

// 查询
router.get('/select',async (req,res)=>{
    let { page,limit,title,create_time } = req.query
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
    if (create_time) {
        nameArr.push('date(create_time) between ? and ?')
        let time = create_time.split(' ~ ')
        dataArr = [...dataArr,...time]
    }
    if (nameArr.length > 0) {
        str = `where ${nameArr.join(' and ')}`
    }
    let sql = `select * from notice ${str} limit ?,?`
    console.log(sql,'sql')
    let data = await db(sql,[...dataArr,(limit*(page-1)),limit])
    let sql1 = 'select count(*) from notice'
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

// 删除
router.post('/delete',async (req,res) => {
    let {ids} = req.body
    let sqlArr = ids.map(item => {
        return '?'
    })
    let str = sqlArr.join(',')
    let sql = `select * from notice where id in (${str})`
    let data = await db(sql,ids)
    let sql1 = `delete from notice where id in (${str})`
    db(sql1,ids).then(data1 => {
        unlinkfile.hadName(data[0].text)
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

// 修改状态
router.post('/state',async(req,res)=>{
    let sql = 'update notice set isShow=? where id=?'
    let { id,state } = req.body
    let data = await db(sql,[state,id])
    res.send({
        code:'200',
        msg: '修改成功'
    })
})

module.exports = router