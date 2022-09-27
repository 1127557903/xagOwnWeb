const express = require("express")
const router =  express.Router()

const db = require('../../../connect/connect')
const timeChange = require('../../../config/timefilter')

const moment = require('moment')
const multer = require('multer')
const uploadfile = require('../../../config/files')
const unlinkfile = require('../../../methods/unlink')

router.get('/',(req,res)=>{
    res.render('delicous/delicous')
})

// 添加美食
router.post('/add',multer({dest:"public/upload/delicousImg"}).any(),async (req,res) => {
    const {name,price,isAllDay,type,label,beginTime,endTime,address} = req.body
    const files = req.files
    let imgArr = []
    files.forEach(item => {
       let img = uploadfile(item)
       imgArr.push(img)
    })
    let titleImg = imgArr[0]
    imgArr.shift()
    innerImg = imgArr.join(',')
    let sql = 'insert into delicious (name,price,isAllDay,type,label,beginTime,endTime,titleImg,innerImg,address) values(?,?,?,?,?,?,?,?,?,?)'
    db(sql,[name,price,isAllDay,type,label,beginTime,endTime,titleImg,innerImg,address]).then(data => {
        res.send({
            msg:'添加成功',
            code: '200',
            data
        })
        return
    }).catch(err => {
        res.send({
            msg:err,
            code: '303',
        })
    })
})

// 修改美食
router.post('/update',multer({dest:"public/upload/delicousImg"}).any(),async (req,res) => {
    let {name,price,isAllDay,type,label,beginTime,endTime,address,imgArr,titleImgChange,id} = req.body
    let sqlArr = [name,price,isAllDay,type,label,beginTime,endTime,address,id]
    let sql = 'update delicious set innerImg=?,name=?,price=?,isAllDay=?,type=?,label=?,beginTime=?,endTime=?,address=? where id=?'
    let sql1 = 'select * from delicious where id=?'
    let data1 = await db(sql1,id)
    let beforeImg = data1[0].innerImg.split(',')
    imgArr = JSON.parse(imgArr)
    let deleteImg = beforeImg.filter(item => {
        let had = true
        imgArr.forEach(one => {
            if(item == one) {
                had = false
            }
        })
        return had
    })
    const files = req.files
    let newimgArr = []
    files.forEach(item => {
       let img = uploadfile(item)
       newimgArr.push(img)
    })
    if(titleImgChange == 'true'){
        let titleImg = newimgArr[0]
        sqlArr.push(titleImg)
        newimgArr.shift()
        deleteImg.push(data1[0].titleImg)
        sql = 'update delicious set innerImg=?,titleImg=?,name=?,price=?,isAllDay=?,type=?,label=?,beginTime=?,endTime=?,address=? where id=?'
        sqlArr.unshift(titleImg)
    }
    let myImgArr = [...imgArr,...newimgArr]
    let innerImg = myImgArr.join(',')
    sqlArr.unshift(innerImg)
    db(sql,sqlArr).then(data => {
        deleteImg.forEach(item => {
            unlinkfile.hadName(item)
        })
        res.send({
            msg:'修改成功',
            code: '200',
            data
        })
        return
    }).catch(err => {
        res.send({
            msg:err,
            code: '303',
        })
    })
})

// 删除美食
router.post('/delete',async (req,res) => {
    let {ids} = req.body
    let sqlArr = ids.map(item => {
        return '?'
    })
    let str = sqlArr.join(',')
    let sql = `select * from delicious where id in (${str})`
    let data = await db(sql,ids)
    let sql1 = `delete from delicious where id in (${str})`
    db(sql1,ids).then(data1 => {
        data.forEach(item => {
            unlinkfile.hadName(item.titleImg)
            let arr = item.innerImg.split(',')
            console.log(item.innerImg,arr,item.titleImg,'aaa')
            arr.forEach(one => {
                unlinkfile.hadName(one)
            })
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

// 查询美食
router.get('/select',async (req,res)=>{
    let { page,limit,name,type } = req.query
    // where book like '%张%'
    page = parseInt(page)
    limit = parseInt(limit)
    let str=''
    let dataArr = []
    let nameArr = []
    if (name) {
        nameArr.push("name like ?")
        dataArr.push(`%${name}%`)
    }
    if (type) {
        nameArr.push("type=?")
        dataArr.push(type)
    }
    // if (create_time) {
    //     nameArr.push('date(create_time) between ? and ?')
    //     let time = create_time.split(' ~ ')
    //     dataArr = [...dataArr,...time]
    // }
    if (nameArr.length > 0) {
        str = `where ${nameArr.join(' and ')}`
    }
    let sql = `select * from delicious ${str} limit ?,?`
    let data = await db(sql,[...dataArr,(limit*(page-1)),limit])
    let sql1 = 'select count(*) from delicious'
    data = data.map(item => {
        // create_time:timeChange(item.create_time)
        let openTime = '全天'
        if(item.isAllDay == 0){
            openTime = `${item.beginTime}~${item.endTime}`
        }
        let imgArr = []
        if(item.innerImg){
            imgArr = item.innerImg.split(',')
            imgArr = imgArr.map((item,index) => {
                return {img:item,id:'img'+index}
            })
        }
        return {...item,newPrice:`${item.price}元`,openTime,imgArr}
    })
    let num = await db(sql1)
    res.send({
        code: '0',
        data,
        count: num[0]['count(*)'],
    })
})

// 添加菜品
router.post('/addFood',multer({dest:"public/upload/delicousImg"}).any(),(req,res) => {
    let {id,foodName} = req.body
    let img = uploadfile(req.files[0])
    let sql = 'insert into foods (d_id,name,img) values(?,?,?)'
    db(sql,[id,foodName,img]).then(data => {
        res.send({
            code:'200',
            msg: '添加成功',
        })
    }).catch(err => {
        unlinkfile.hadName(img)
        res.send({
            msg:err,
            code: '303',
        })
    })
})

router.get('/selectFood',(req,res)=>{
    let {id} = req.query
    let sql1 = 'select * from foods where d_id=?'
    db(sql1,[id]).then(data =>{
        res.send({
            code:'200',
            msg: '查询成功成功',
            data
        })
    }).catch(err => {
        res.send({
            msg:err,
            code: '303',
        })
    })
})

router.get('/deleteFood',async (req,res) => {
    let {id} = req.query
    let sql1 = 'select * from foods where id=?'
    let data1 = await db(sql1,[id])
    let sql = 'delete from foods where id=?'
    db(sql,[id]).then(data =>{
        unlinkfile.hadName(data1[0].img)
        res.send({
            code:'200',
            msg: '删除成功',
        })
    }).catch(err => {
        res.send({
            msg:err,
            code: '303',
        })
    })
})

module.exports = router