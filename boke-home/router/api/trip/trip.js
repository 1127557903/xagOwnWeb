const express = require("express");
const router = express.Router();
const db = require('../../../connect/connect')
const moment = require('moment')

const multer = require('multer')
const uploadfile = require('../../../config/files')
const unlinkfile = require('../../../methods/unlink')

router.get('/',async (req,res)=>{
    let sql = 'select * from place limit 5'
    let data = await db(sql,[])
    let dataArr = data.map(item => {
        return {...item,label:item.label.split(',')}
    })
    res.send({
        code: '200',
        data:dataArr,
        msg: '查询成功'
    })
})

router.post('/saveTrip',(req,res)=>{
    let {  distance,trip,num } = req.body
    let { id } = req.user
    let str = JSON.stringify(trip)
    let time = moment().format('YYYY-MM-DD HH:mm:ss');
    let sql = 'insert into road (distance,trip,num,creat_time,c_id) values (?,?,?,?,?)'
    try{
        db(sql,[ distance,str,num,time,id])
    } catch(e) {
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
        code: '200',
        data:'data',
        msg: '新增成功'
    })
})

router.post('/changeTrip',(req,res)=>{
    let {  distance,trip,num,id } = req.body
    let str = JSON.stringify(trip)
    let sql = 'update road set distance=?,trip=?,num=? where id=?'
    try{
        db(sql,[distance,str,num,id])
    } catch(e) {
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
        code: '200',
        data:'data',
        msg: '修改成功'
    })
})

router.get('/select',async (req,res) =>{
    let { id } = req.user
    let sql = 'select * from road where c_id=? order by creat_time desc'
    let data = await db(sql,[id])
    data= data.map(item => {
        let one = item
        one.trip = JSON.parse(item.trip)
        return one
    })
    res.send({
        code: '200',
        data,
        msg: '查询成功'
    })
})

router.post('/selectAll',async (req,res) =>{
    let {page,limit} = req.body
    page = parseInt(page)
    limit = parseInt(limit)
    let sql = 'select * from road where recommend=1  order by creat_time desc limit ?,?'
    let sql1 = 'select count(*) from road where recommend=1'
    let data = await db(sql,[(limit*(page-1)),limit])
    data= data.map(item => {
        let one = item
        one.trip = JSON.parse(item.trip)
        return one
    })
    let data1 = await db(sql1)
    res.send({
        code: '200',
        data,
        msg: '查询成功',
        count: data1[0]['count(*)']
    })
})

router.post('/setRecommend',multer({dest:"public/upload/roadimg"}).any(),async (req,res) => {
    console.log(req.files,'文件')
    let {name,days,checkboxGroup,recommend,id} = req.body
    let sql1 = 'select * from road where id=?'
    let result = await db(sql1,[id])
    if (result.length !== 0 && result[0].imgs) {
        let oldImgsArr = JSON.parse(result[0].imgs)
        oldImgsArr.forEach(item =>{
            unlinkfile.hadName(item)
        })
    }
    let imgsArr = []
    req.files.forEach(item => {
        let img = uploadfile(item)
        imgsArr.push(img)
    })
    let imgs = JSON.stringify(imgsArr)
    let type =checkboxGroup
    let sql = 'update road set name=?,days=?,type=?,recommend=?,imgs=? where id=?'
    db(sql,[name,days,type,recommend,imgs,id]).then(data => {
        res.send({
            code: '200',
            data,
            msg: '设置成功'
        })
        return
    }).catch(e =>{
        imgsArr.forEach(item => {
            unlinkfile.hadName(item)
        })
        res.send({
            code: '400',
            data:e,
            msg: '设置失败'
        })
    })
})

router.post('/cancelRecommend',async (req,res) => {
    let { id,recommend } =req.body
    console.log(id,'di')
    let sql ='update road set recommend=? where id=?'
    let data = db(sql,[recommend,id])
    res.send({
        code: '200',
        data,
        msg: '取消成功'
    })
})

router.get('/selectRecommend',async (req,res) => {
    // let sql = 'select * from road where recommend=1 order by quote limit 5'
    let {id} = req.user
    let sql = 'select road.*,users.head_img,users.nick_name,count(road_like.id) as nums from road left join users on road.c_id=users.id left join road_like on road_like.r_id=road.id where road.recommend=1 group by road.id order by road.quote limit 5'
    let data = await db(sql)
    let newData =[]
    for (let i=0;i<data.length;i++) {
        let sql1 = 'select * from road_like where r_id=? and u_id=?'
        let inData = await db(sql1,[data[i].id,id])
        if (inData && inData.length !== 0) {
            newData.push({...data[i],isLike: true})
        } else {
            newData.push({...data[i],isLike: false})
        }
    }
    console.log(data,'data');
    res.send({
        code: '200',
        data:newData,
        msg: '查询成功'
    })
})

router.post('/likeornot',async (req,res) => {
    let {r_id} = req.body
    let {id} = req.user
    let sql = 'select * from road_like where r_id=? and u_id=?'
    let data = await db(sql,[r_id,id])
    if (data.length == 0) {
        let sql1 = 'insert into road_like (r_id,u_id) values(?,?)'
        db(sql1,[r_id,id])
        res.send({
            code: '200',
            data,
            msg: '点赞成功'
        })
        return
    }
    let sql1 = 'delete from road_like where r_id=? and u_id=?'
    db(sql1,[r_id,id])
    res.send({
        code: '200',
        data,
        msg: '取消点赞成功'
    })
})

module.exports = router