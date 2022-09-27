const express = require("express")
const router =  express.Router()
const db = require('../../../connect/connect')
const multer = require('multer')
const uploadfile = require('../../../config/files')
const unlinkfile = require('../../../methods/unlink')

router.get('/',(req,res) => {
    res.render('code/code')
})

// 跳转新增码表页面
router.get('/addCodeView',(req,res) => {
    res.render('code/addCode')
})

router.post('/addCode',(req,res) => {
    console.log(req.body,'req')
    let {name,code,value} = req.body
    if (typeof value !== 'string') {
        var newValue = [...new Set(value)]
        if(newValue.length !== value.length) {
            res.render('code/overAdd',{
                code: '303',
                msg: '存在相同码值'
            })
            return
        }
        var insertArr = []
        var strArr = []
        newValue.forEach((item,index) => {
            insertArr = [...insertArr,name,code,item]
            strArr.push('(?,?,?)')
        })
        var str = strArr.join(',')
        var sql = `insert into code_map (name,code,value) values${str}`
    } else {
        insertArr = [name,code,value]
        sql = `insert into code_map (name,code,value) values(?,?,?)`
    }
    db(sql,insertArr).then(data => {
        res.render('code/code',{
            code: '200',
            msg: '添加成功'
        })
        return
    }).catch(err => {
        res.render('code/overAdd',{
            code: '303',
            msg: err
        })
    })
})

// 查询码表
router.get('/select',async (req,res)=>{
    let { page,limit,name,code,value } = req.query
    page = parseInt(page)
    limit = parseInt(limit)
    let str=''
    let dataArr = []
    let nameArr = []
    if (name) {
        nameArr.push("name like ?")
        dataArr.push(`%${name}%`)
    }
    if (value) {
        nameArr.push("value like ?")
        dataArr.push(`%${value}%`)
    }
    if (code) {
        nameArr.push("code like ?")
        dataArr.push(`%${code}%`)
    }
    // if (type) {
    //     nameArr.push("type=?")
    //     dataArr.push(type)
    // }
    // if (create_time) {
    //     nameArr.push('date(create_time) between ? and ?')
    //     let time = create_time.split(' ~ ')
    //     dataArr = [...dataArr,...time]
    // }
    if (nameArr.length > 0) {
        str = `where ${nameArr.join(' and ')}`
    }
    let sql = `select * from code_map ${str} limit ?,?`
    let data = await db(sql,[...dataArr,(limit*(page-1)),limit])
    let sql1 = 'select count(*) from code_map'
    let num = await db(sql1)
    res.send({
        code: '0',
        data,
        count: num[0]['count(*)'],
    })
})

router.post('/add',async (req,res) => {
    let {code,value} = req.body
    let sql1='select * from code_map where code=?'
    let data1 = await db(sql1,code)
    if(!data1 || data1.length == 0){
        res.send({
            code:'303',
            msg:'该码表不存在，请先添加码表'
        })
        return
    }
    let sql = 'insert into code_map (name,code,value) values(?,?,?)'
    db(sql,[data1[0].name,code,value]).then(data => {
        res.send({
            code:'200',
            msg:'添加成功'
        })
        return
    }).catch(err => {
        res.send({
            code:'303',
            msg:err
        })
    })
})

router.post('/update',(req,res) => {
    let {code,value,id} = req.body
    let sql = 'update code_map set code=?,value=? where id=?'
    db(sql,[code,value,id]).then(data => {
        res.send({
            code: '200',
            msg: '修改成功'
        })
        return
    }).catch(err => {
        res.send({
            code: '303',
            msg: err
        })
    })
})

// 删除码值
router.post('/delete',async (req,res) => {
    let {ids} = req.body
    let sqlArr = ids.map(item => {
        return '?'
    })
    let str = sqlArr.join(',')
    let sql = `select * from code_map where id in (${str})`
    let data = await db(sql,ids)
    let sql1 = `delete from code_map where id in (${str})`
    db(sql1,ids).then(data1 => {
        data.forEach(item => {
            if(item.img) {
                unlinkfile.hadName(item.img)
            }
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

router.post('/addImg',multer({dest:"public/upload/codeImg"}).any(),async (req,res) => {
    let { id } = req.body
    let img = uploadfile(req.files[0])
    let sql = 'update code_map set img=? where id=?'
    let sql1 = 'select * from code_map where id=?'
    let data1 = await db(sql1,[id])
    db(sql,[img,id]).then(data => {
        if(data1 && data1[0].img){
            unlinkfile.hadName(data1[0].img)
        }
        res.send({
            code: '200',
            msg: '设置成功'
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

module.exports = router