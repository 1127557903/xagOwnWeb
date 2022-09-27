const express = require("express")
const router =  express.Router()

const db = require('../../../connect/connect')

const moment = require('moment')
const multer = require('multer')
const uploadfile = require('../../../config/files')
const unlinkfile = require('../../../methods/unlink')

router.get('/',(req,res)=>{
    res.render('hotel/hotel')
})

// 添加酒店
router.post('/add',multer({dest:"public/upload/hotelImg"}).any(),async (req,res) => {
    const {name,price,start,type,label,address,slogan,service} = req.body
    const files = req.files
    let imgArr = []
    files.forEach(item => {
       let img = uploadfile(item)
       imgArr.push(img)
    })
    let titleImg = imgArr[0]
    imgArr.shift()
    innerImg = imgArr.join(',')
    let sql = 'insert into hotel (name,price,start,type,label,address,slogan,service,titleImg,innerImg) values(?,?,?,?,?,?,?,?,?,?)'
    db(sql,[name,price,start,type,label,address,slogan,service,titleImg,innerImg]).then(data => {
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

// 修改酒店
router.post('/update',multer({dest:"public/upload/hotelImg"}).any(),async (req,res) => {
    let {name,price,start,type,label,address,slogan,service,titleImgChange,imgArr,id} = req.body
    let sqlArr = [name,price,start,type,label,slogan,service,address,id]
    let sql = 'update hotel set innerImg=?,name=?,price=?,start=?,type=?,label=?,slogan=?,service=?,address=? where id=?'
    let sql1 = 'select * from hotel where id=?'
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
        sql = 'update hotel set innerImg=?,titleImg=?,name=?,price=?,start=?,type=?,label=?,slogan=?,service=?,address=? where id=?'
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

// 删除酒店
router.post('/delete',async (req,res) => {
    let {ids} = req.body
    let sqlArr = ids.map(item => {
        return '?'
    })
    let str = sqlArr.join(',')
    let sql = `select * from hotel where id in (${str})`
    let data = await db(sql,ids)
    let sql1 = `delete from hotel where id in (${str})`
    db(sql1,ids).then(data1 => {
        data.forEach(item => {
            unlinkfile.hadName(item.titleImg)
            let arr = item.innerImg.split(',')
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

// 查询酒店
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
    let sql = `select * from hotel ${str} limit ?,?`
    let data = await db(sql,[...dataArr,(limit*(page-1)),limit])
    let sql1 = 'select count(*) from hotel'
    data = data.map(item => {
        let imgArr = []
        if(item.innerImg){
            imgArr = item.innerImg.split(',')
            imgArr = imgArr.map((item,index) => {
                return {img:item,id:'img'+index}
            })
        }
        return {...item,newPrice:`${item.price}元`,imgArr}
    })
    let num = await db(sql1)
    res.send({
        code: '0',
        data,
        count: num[0]['count(*)'],
    })
})

// 添加房型
router.post('/addRoom',multer({dest:"public/upload/hotelImg"}).any(),(req,res) => {
    let {id,roomName,price,breakfast,bed,people,cancelRule,smoke} = req.body
    let arr = [roomName,price,breakfast,bed,people,cancelRule,smoke]
    let result = arr.findIndex(item => !item)
    let img = uploadfile(req.files[0])
    if(result !== -1){
        unlinkfile.hadName(img)
        res.send({
            msg:'请填写完整表单',
            code: '303',
        })
        return
    }
    let sql = 'insert into room (h_id,name,img,price,breakfast,bed,people,cancelRule,smoke) values(?,?,?,?,?,?,?,?,?)'
    db(sql,[id,roomName,img,price,breakfast,bed,people,cancelRule,smoke]).then(data => {
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

// 查询房型
router.get('/selectRoom',(req,res)=>{
    let {id} = req.query
    let sql1 = 'select * from room where h_id=?'
    db(sql1,[id]).then(data =>{
        res.send({
            code:'200',
            msg: '查询成功',
            data
        })
    }).catch(err => {
        res.send({
            msg:err,
            code: '303',
        })
    })
})

router.get('/deleteRoom',async (req,res) => {
    let {id} = req.query
    let sql1 = 'select * from room where id=?'
    let data1 = await db(sql1,[id])
    let sql = 'delete from room where id=?'
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