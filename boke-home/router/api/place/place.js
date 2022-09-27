const express = require("express");
const router = express.Router();
const db = require('../../../connect/connect')
const moment = require('moment')

router.get('/select',async (req,res) => {
    let {id} = req.query
    let sql = 'select * from place where id=?'
    let data = await db(sql,[id])
    let sql1 = 'select * from son_place where p_id=?'
    let data1= await db(sql1,[id])
    let dataArr = {}
    if(data && data.length > 0) {
        dataArr =  {...data[0],label: data[0].label.split(',')}
    }
    res.send({
        code: '200',
        data:{
            place:dataArr,
            son:data1
        },
        msg: '查询成功'
    })
})

// 查询所以景点数据
router.post('/selectAll',async (req,res)=>{
    let { page,limit,searchName,days } = req.body
    // where book like '%张%'
    page = parseInt(page)
    limit = parseInt(limit)
    let str=''
    let dataArr = []
    let nameArr = []
    if (searchName) {
        nameArr.push("name like ?")
        dataArr.push(`%${searchName}%`)
    }
    if (days) {
        nameArr.push("days=?")
        dataArr.push(days)
    }
    if (nameArr.length > 0) {
        str = `where ${nameArr.join(' and ')}`
    }
    let sql = `select * from place ${str} limit ?,?`
    let data = await db(sql,[...dataArr,(limit*(page-1)),limit])
    let sql1 = 'select count(*) from place'
    let num = await db(sql1)
    res.send({
        code: '200',
        data,
        count: num[0]['count(*)'],
    })
})

router.get('/getComment',async (req,res) =>{
    let {p_id} = req.query
    // let sql = 'select * from (select newcomment.*,newreply.id as r_id,newreply.text as reply_text,newreply.create_time as reply_create_time,newreply.from_id,newreply.to_id,newreply.from_nick_name,newreply.from_head_img,newreply.to_nick_name,newreply.to_head_img from (select * from comment where p_id=? limit 0,5) newcomment left join (select fromreply.*,users.nick_name as to_nick_name,users.head_img as to_head_img from (select reply.*,users.nick_name as from_nick_name,users.head_img as from_head_img from reply left join users on users.id=reply.from_id) fromreply left join users on users.id=fromreply.to_id) newreply on newcomment.id=newreply.c_id) reco left join users on reco.u_id=users.id'
    //    let sql = 'select * from (select newcomment.*,newreply.id as r_id,newreply.text as reply_text,newreply.create_time as reply_create_time,newreply.from_id,newreply.to_id,newreply.from_nick_name,newreply.from_head_img,newreply.to_nick_name,newreply.to_head_img from (select comment.*,count(c_likes.id) as likes from comment left join c_likes on c_likes.c_id=comment.id where p_id=? group by comment.id limit 0,5) newcomment left join (select fromreply.*,users.nick_name as to_nick_name,users.head_img as to_head_img from (select reply.*,users.nick_name as from_nick_name,users.head_img as from_head_img from reply left join users on users.id=reply.from_id) fromreply left join users on users.id=fromreply.to_id) newreply on newcomment.id=newreply.c_id) reco left join users on reco.u_id=users.id'
    let sql = 'select reco.*,users.nick_name,users.head_img from (select newcomment.*,newreply.id as r_id,newreply.text as reply_text,newreply.create_time as reply_create_time,newreply.from_id,newreply.to_id,newreply.from_nick_name,newreply.from_head_img,newreply.to_nick_name,newreply.to_head_img,newreply.r_likes from (select comment.*,count(c_likes.id) as likes from comment left join c_likes on c_likes.c_id=comment.id where comment.p_id=? group by comment.id limit 0,5) newcomment left join (select fromreply.*,users.nick_name as to_nick_name,users.head_img as to_head_img from (select reply.*,users.nick_name as from_nick_name,users.head_img as from_head_img,count(c_likes.id) as r_likes from reply left join users on users.id=reply.from_id left join c_likes on c_likes.r_id=reply.id group by reply.id) fromreply left join users on users.id=fromreply.to_id) newreply on newcomment.id=newreply.c_id) reco left join users on reco.u_id=users.id'
    let data = await db(sql,[p_id])
    // console.log(data)
    let numArr = data.map(item => item.id)
    let newNumArr = [...new Set(numArr)]
    let outArr= newNumArr.map(item =>{
        let arr = []
        let obj = {}
        data.forEach(one => {
            let {r_id,likes,r_likes,reply_text,reply_create_time,from_id,to_id,from_nick_name,from_head_img,to_nick_name,to_head_img,id,u_id,create_time,p_id,text,head_img,nick_name} = one
            if(id == item){
                obj={id,u_id,likes,create_time,p_id,text,head_img,nick_name}
                if (r_id) {
                    arr.push({r_id,reply_text,r_likes,reply_create_time,from_id,to_id,from_nick_name,from_head_img,to_nick_name,to_head_img})
                }
            }
        })
        console.log(obj,'obj')
        return {...obj,reply:arr}
    })
    // console.log(outArr,'aaa')
    res.send({
        code: '200',
        data:outArr,
        msg: '查询成功'
    })
})

router.post('/comment',async (req,res)=>{
    let create_time = moment().format('YYYY-MM-DD HH:mm:ss')
    let { id } = req.user
    let {p_id,text,c_id,to_id} = req.body
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
    let sql = 'insert into comment (p_id,u_id,text,create_time) values(?,?,?,?)'
    let data = await db(sql,[p_id,id,text,create_time])
    res.send({
        code: '200',
        data,
        msg: '新增成功'
    })
})

// 评论点赞
router.post("/good",async (req,res) => {
    let {c_id,r_id,p_id} = req.body
    let { id } =req.user
    let sql = 'insert into c_likes (c_id,r_id,p_id,u_id) values(?,?,?,?)'
    if(r_id) {
        sql = 'insert into c_likes (n_id,r_id,p_id,u_id) values(?,?,?,?)'
    }
    let data = await db(sql,[c_id,r_id,p_id,id])
    res.send({
        code: '200',
        data,
        msg: '点赞成功'
    })
})

// 取消评论点赞
router.post("/notgood",async (req,res) => {
    let {c_id,r_id} = req.body
    let { id } =req.user
    let sql = 'delete from c_likes where c_id=? and u_id=?'
    let arr = [c_id,id]
    if (r_id) {
        sql = 'delete from c_likes where n_id=? and u_id=? and r_id=?'
        arr = [c_id,id,r_id]
    }
    let data = await db(sql,arr)
    res.send({
        code: '200',
        data,
        msg: '取消点赞成功'
    })
})

// 查询评论点赞
router.get("/selectGood",async (req,res) => {
    let {p_id} = req.query
    console.log(p_id,'p_id')
    let { id } =req.user
    let sql = 'select * from c_likes where u_id=? and p_id=?'
    let data = await db(sql,[id,p_id])
    console.log(data,'data')
    let dataArr = data.map(item => {
        return item.c_id
    })
    res.send({
        code: '200',
        data:dataArr,
        msg: '查询成功'
    })
})

// 查询相关二级评论点赞
router.get("/getAllReply",async (req,res) => {
    let {c_id} = req.query
    let {id} = req.user
    let sql = 'select * from c_likes where n_id=? and u_id=?'
    let data = await db(sql,[c_id,id])
    let dataArr = data.map(item => {
        return item.r_id
    })
    res.send({
        code: '200',
        data: dataArr,
        msg: '查询成功'
    })
})



module.exports = router