const express = require("express");
const router = express.Router();
const db = require('../../../connect/connect')
const moment = require('moment')

const multer = require('multer')
const uploadfile = require('../../../config/files')
const unlinkfile = require('../../../methods/unlink')

router.post("/writeTravels",multer({dest:"public/upload/travelsimg"}).any(),async (req,res) => {
    let {text,title}  = req.body
    let {id } = req.user
    let img = uploadfile(req.files[0])
    let create_time = moment().format('YYYY-MM-DD HH:mm:ss')
    let sql = 'insert into travels (text,img,title,u_id,create_time) values(?,?,?,?,?)'
    let data = await db(sql,[text,img,title,id,create_time])
    res.send({
        code: '200',
        data,
        msg:'添加成功'
    })
})

router.get('/Travelsdata', async (req,res) => {
    let {id} = req.query
    let sql = 'select travels.*,users.nick_name,users.sign,users.head_img from travels left join users on travels.u_id=users.id where travels.id=?'
    let data = await db(sql,[id])
    res.send({
        code:'200',
        data:data[0],
        msg:'查询成功'
    })
})

router.get('/getTravels',async (req,res) => {
    let {t_id} = req.query
    // let t_id = 1
    let sql = 'select reco.*,users.nick_name,users.head_img from (select newcomment.*,newreply.id as r_id,newreply.text as reply_text,newreply.create_time as reply_create_time,newreply.from_id,newreply.to_id,newreply.from_nick_name,newreply.from_head_img,newreply.to_nick_name,newreply.to_head_img,newreply.r_likes from (select comment.*,count(c_likes.id) as likes from comment left join c_likes on c_likes.c_id=comment.id where comment.t_id=? group by comment.id limit 0,5) newcomment left join (select fromreply.*,users.nick_name as to_nick_name,users.head_img as to_head_img from (select reply.*,users.nick_name as from_nick_name,users.head_img as from_head_img,count(c_likes.id) as r_likes from reply left join users on users.id=reply.from_id left join c_likes on c_likes.r_id=reply.id group by reply.id) fromreply left join users on users.id=fromreply.to_id) newreply on newcomment.id=newreply.c_id) reco left join users on reco.u_id=users.id'
    let data = await db(sql,[t_id])
    let numArr = data.map(item => item.id)
    let newNumArr = [...new Set(numArr)]
    let outArr= newNumArr.map(item =>{
        let arr = []
        let obj = {}
        data.forEach(one => {
            let {r_id,likes,r_likes,reply_text,reply_create_time,from_id,to_id,from_nick_name,from_head_img,to_nick_name,to_head_img,id,u_id,create_time,t_id,text,head_img,nick_name} = one
            if(id == item){
                obj={id,u_id,likes,create_time,t_id,text,head_img,nick_name}
                if (r_id) {
                    arr.push({r_id,reply_text,r_likes,reply_create_time,from_id,to_id,from_nick_name,from_head_img,to_nick_name,to_head_img})
                }
            }
        })
        return {...obj,reply:arr}
    })
    console.log(outArr,'aaa')
    res.send({
        code: '200',
        data:outArr,
        msg: '查询成功'
    })
})

// 查询评论点赞
router.get("/selectGood",async (req,res) => {
    let {t_id} = req.query
    let { id } =req.user
    let sql = 'select * from c_likes where u_id=? and t_id=?'
    let data = await db(sql,[id,t_id])
    let dataArr = data.map(item => {
        return item.c_id
    })
    res.send({
        code: '200',
        data:dataArr,
        msg: '查询成功'
    })
})

// 评论点赞
router.post("/good",async (req,res) => {
    let {c_id,r_id,t_id} = req.body
    let { id } =req.user
    let sql = 'insert into c_likes (c_id,r_id,t_id,u_id) values(?,?,?,?)'
    if(r_id) {
        sql = 'insert into c_likes (n_id,r_id,t_id,u_id) values(?,?,?,?)'
    }
    let data = await db(sql,[c_id,r_id,t_id,id])
    res.send({
        code: '200',
        data,
        msg: '点赞成功'
    })
})

// 回复
router.post('/comment',async (req,res)=>{
    let create_time = moment().format('YYYY-MM-DD HH:mm:ss')
    let { id } = req.user
    let {t_id,text,c_id,to_id} = req.body
    if(c_id && to_id){
        let sql = 'insert into reply (from_id,to_id,c_id,text,create_time) values(?,?,?,?,?)'
        let data = await db(sql,[id,to_id,c_id,text,create_time])
        res.send({
            code: '200',
            data,
            msg: '新增成功'
        })
        return
    }
    let sql = 'insert into comment (t_id,u_id,text,create_time) values(?,?,?,?)'
    let data = await db(sql,[t_id,id,text,create_time])
    res.send({
        code: '200',
        data,
        msg: '新增成功'
    })
})


// 查询帖子的搜藏点赞和回复数
router.get('/sum',async (req,res) => {
    let {id} = req.query
    let sql = "select count(1) as num from comment where t_id=?"
    let sql1 = "select count(1) as num from collection where t_id"
    let sql2 = "select count(1) as num from likes where t_id"
    let data = await db(sql,[id])
    let num = 0
    let num1 = 0
    let num2 = 0
    if (data && data.length == 1) {
        num = data[0].num
    }
    let data1 = await db(sql1,[id])
    if (data1 && data1.length == 1) {
        num1 = data1[0].num
    }
    let data2 = await db(sql2,[id])
    if (data2 && data2.length == 1) {
        num2 = data2[0].num
    }
    res.send({
        code:'200',
        data:{
            comment: num,
            collection: num1,
            likes: num2
        },
        msg: '查询成功'
    })
})

// 给游记点赞
router.post('/goodTie',async (req,res) => {
    let {t_id} = req.body
    console.log(t_id,'游记id数据')
    let u_id = req.user.id
    let sql = "insert into likes (t_id,u_id) values(?,?)"
    let data = await db(sql,[t_id,u_id])
    res.send({
        code: '200',
        data,
        msg:'点赞成功'
    })
})

// 取消游记点赞
router.post('/notgoodTie',async (req,res) => {
    let {t_id} = req.body
    let u_id = req.user.id
    console.log(t_id,u_id,'id')
    let sql = "delete from likes where t_id=? and u_id=?"
    let data = await db(sql,[t_id,u_id])
    res.send({
        code: '200',
        data,
        msg:'取消成功'
    })
})

// 给游记收藏
router.post('/collectionTie',async (req,res) => {
    let {t_id} = req.body
    console.log(t_id,'游记id数据')
    let u_id = req.user.id
    let sql = "insert into collection (t_id,u_id) values(?,?)"
    let data = await db(sql,[t_id,u_id])
    res.send({
        code: '200',
        data,
        msg:'点赞成功'
    })
})

// 取消游记收藏
router.post('/notcollectionTie',async (req,res) => {
    let {t_id} = req.body
    let u_id = req.user.id
    let sql = "delete from collection where t_id=? and u_id=?"
    let data = await db(sql,[t_id,u_id])
    res.send({
        code: '200',
        data,
        msg:'取消成功'
    })
})

// 获取登录人对当前游记的点赞和收藏状态
router.get("/getstate",async (req,res) => {
    let {t_id} = req.query
    let {id} = req.user
    let sql = "select * from likes where t_id=? and u_id=?"
    let sql1 = "select * from collection where t_id=? and u_id=?"
    let data = await db(sql,[t_id,id])
    let likes = false
    let collection = false
    if (data && data.length !== 0) {
        likes = true
    }
    let data1 = await db(sql1,[t_id,id])
    if (data1 && data1.length !== 0) {
        collection = true
    }
    res.send({
        code: '200',
        data:{
            likes,
            collection
        },
        msg:'查询成功'
    })
})

// 获取所有的游记
router.get("/allTravels",async (req,res) => {
    let sql = 'select * from travels limit 0,5'
    let data = await db(sql)
    res.send({
        code: '200',
        data,
        msg:'查询成功'
    })
})

module.exports = router