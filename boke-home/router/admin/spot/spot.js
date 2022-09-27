const express = require("express")
const router =  express.Router()
const db = require('../../../connect/connect')

const multer = require('multer')
const uploadfile = require('../../../config/files')
const unlinkfile = require('../../../methods/unlink')

//景点管理页面
router.get('/',async (req,res)=>{
    res.render('spot/spot')
})
// 景点详情页面
router.get('/detail',async (req,res)=>{
    let {id} = req.query
    let sql = 'select * from place where id=?'
    let data = await db(sql,[id])
    let sql1 = "select * from place_img where p_id=?"
    let imgs= await db(sql1,[id])
    let sql2 = "select * from son_place where p_id=?"
    let sons= await db(sql2,[id])
    res.render('spot/detail',{data:data[0],imgs,sons})
})
// 景点添加页面
router.get('/add',async (req,res)=>{
    // let sql = 'select * from place'
    // let data = await db(sql)
    res.render('spot/add',{data:{}})
})
// 添加景点
router.post('/adds',multer({dest:"public/upload/spotimg"}).any(),async (req,res)=>{
    let { name, lng, lat ,address,play,days,impression,symbol,label} = req.body
    if (!name || !lng || !lat || !address || !play|| !days|| !impression || !symbol || !label) {
        unlinkfile.noName(req.files[0]) //删除文件
        res.send({
            "code": '303'
            ,"msg": "参数不全"
            ,"data": {
              "src": ""
            }
        })
        return
    }
    let lng_lat = lng+','+lat
    let img = uploadfile(req.files[0]) //文件处理
    let sql = 'insert into place (name,address,img,lng_lat,play,days,impression,symbol,label) values(?,?,?,?,?,?,?,?,?)'
    try {
        db(sql,[name,address,img,lng_lat,play,days,impression,symbol,label])
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
// 景点修改页面
router.get('/update',async (req,res)=>{
    let { id } = req.query
    let sql = 'select * from place where id=?'
    let data = await db(sql,[id])
    console.log(data[0],id)
    res.render('spot/add',{data:data[0],id})
})
// 景点修改
router.post('/update',multer({dest:"public/upload/spotimg"}).any(), async(req,res)=>{
    let { id, name, lng, lat ,address,play,days,impression,symbol,label,oldImg } = req.body
    let img =''
    let str=''
    let lng_lat=lng+','+lat
    let arr = [name, lng_lat ,address,play,days,impression,symbol,label,id]
    if (req.files && req.files[0]) {
        img = uploadfile(req.files[0])
        str=',img=?'
        arr=[name, lng_lat ,address,play,days,impression,symbol,label,img,id]
    }
    if (!id || !name || !lng || !lat || !address || !play|| !days|| !impression || !symbol || !label) {
        if(img) {
            unlinkfile.hadName(img) //删除文件
        }
        res.send({
            "code": '303'
            ,"msg": "参数不全"
            ,"data": {
              "src": ""
            }
        })
        return
    }
    let sql = `update place set name=?,lng_lat=?,address=?,play=?,days=?,impression=?,symbol=?,label=?${str} where id=?`
    try {
        let data = await db(sql,arr)
    } catch(e) {
        if(e) {
            if(img){
                unlinkfile.hadName(img) //删除文件
            }
            console.log(111)
            res.send({
                "code": '400'
                ,"msg": e
                ,"data": {
                  "src": ""
                }
            })
            return
        }
    }
    if(img){
        unlinkfile.hadName(oldImg) //删除文件
    }
    res.send({
        "code": '200'
        ,"msg": "修改成功"
        ,"data": {
          "src": ""
        }
    })
})
// 查询景点数据
router.get('/select',async (req,res)=>{
    let { page,limit,searchName,days } = req.query
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
        code: '0',
        data,
        count: num[0]['count(*)'],
    })
})

// 删除景点
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
    let str2=''
    ids.forEach((item,index) => {
        if(index == 0) {
            str1+='id=?'
            str2+='p_id=?'
            return
        }
        str1+=' or id=?'
        str2+='or p_id=?'
    })
    let sql1 = `select img from place where ${str1}`
    let imgs1 = await db(sql1,ids)
    imgs1 = imgs1.map(item => item.img)
    let sql2 = `select img from place_img where ${str2}`
    let imgs2 = await db(sql2,ids)
    imgs2 = imgs2.map(item => item.img)
    let sql3 = `select img from son_place where ${str2}`
    let imgs3 = await db(sql3,ids)
    imgs3 = imgs3.map(item => item.img)

    let sql4 = `delete from place where ${str1}`
    let sql5 = `delete from place_img where ${str2}`
    let sql6 = `delete from son_place where ${str2}`
    db(sql4,ids)
    db(sql5,ids)
    db(sql6,ids)
    let arr = [...imgs1,...imgs2,...imgs3]
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


// 转到景点图片页面
router.get('/place_img',async (req,res)=>{
    let {id} = req.query
    let sql = 'select * from place_img where p_id=?'
    let data = await db(sql,[id])
    res.render('spot/img',{data,id})
})
// 添加子景点图片
router.post('/addimg',multer({dest:"public/upload/spotimg"}).any(),async (req,res)=>{
    let {id} = req.body
    let imgs = []
    for (let i=0;i<req.files.length;i++){
        let img = uploadfile(req.files[i]) //文件处理
        imgs.push(img)
        let sql = 'insert into place_img (img,p_id) values(?,?)'
        let data = await db(sql,[img,id])
    }
    res.send({
        "code": '200'
        ,"msg": "上传成功"
        ,"data": {
          "src": imgs
        }
    })
})
// 删除景点图片
router.post('/delImg',(req,res)=>{
    let {id,img} = req.body
    let sql = 'delete from place_img where id=?'
    db(sql,[id]).then(data => {
        unlinkfile.hadName(img) //删除文件
        res.send({
            "code": '200'
            ,"msg": "删除成功"
            ,"data": data
        })
        return
    }).catch(e =>{
        res.send({
            "code": '301'
            ,"msg": "删除失败"
            ,"data": e
        })
    })
})

// 跳转子景点页面
router.get('/son_place',async (req,res)=>{
    let {id} = req.query
    let sql = 'select * from son_place where p_id=?'
    let data = await db(sql,[id])
    res.render('spot/son',{data,id})
})

// 子景点添加页面
router.get('/son_add',(req,res)=>{
    let {id} = req.query
    res.render('spot/son_add',{id,data:{}})
})

// 子景点添加页面
router.get('/son_update',async (req,res)=>{
    let {id,p_id} = req.query
    let sql = 'select * from son_place where id=? and p_id=?'
    let data = await db(sql,[id,p_id])
    res.render('spot/son_add',{id:p_id,data:data[0]})
})

// 子景点添加
router.post('/son_add',multer({dest:"public/upload/spotimg"}).any(),async (req,res)=>{
    let {name,type,text,id} = req.body
    if (!name || !type || !text || !id) {
        unlinkfile.noName(img)
        res.send({
            "code": '303'
            ,"msg": "参数不全"
            ,"data": {
              "src": ""
            }
        })
        return
    }
    let img = uploadfile(req.files[0]) //文件处理
    let sql="insert into son_place (name,type,text,img,p_id) values(?,?,?,?,?)"
    let data = await db(sql,[name,type,text,img,id])
    res.send({
        "code": '200'
        ,"msg": "添加成功"
        ,"data": {
          "src": ""
        }
    })
})
// 修改子景点
router.post('/son_update',multer({dest:"public/upload/spotimg"}).any(),async (req,res)=>{
    let { name,text,xid,type,oldImg } = req.body
    var img =''
    if(req.files && req.files.length !== 0){
        img = uploadfile(req.files[0])
    }
    if (!name || !type || !text || !xid) {
        if(img){
            unlinkfile.hadName(img)
        }
        res.send({
            "code": '303'
            ,"msg": "参数不全"
            ,"data": {
              "src": ""
            }
        })
        return
    }
    let arr = [name,text,type,xid]
    var str = ''
    if (img) {
        arr = [name,text,type,img,xid]
        str = ',img=?'
    }
    let sql = `update son_place set name=?,text=?,type=?${str} where id=?`
    try{
        let data = await db(sql,arr)
    } catch(e) {
        if(img){
            unlinkfile.hadName(img) //删除文件
        }
        res.send({
            "code": '400'
            ,"msg": e
            ,"data": {
              "src": ''
            }
        })
        return
    }
    if(img){
        unlinkfile.hadName(oldImg) //删除文件
    }
    res.send({
        "code": '200'
        ,"msg": "上传成功"
        ,"data": {
          "src": img
        }
    })
})

// 删除子景点
router.post('/del_son',(req,res)=>{
    let {id,img} = req.body
    let sql = 'delete from son_place where id=?'
    db(sql,[id]).then(data => {
        unlinkfile.hadName(img) //删除文件
        res.send({
            "code": '200'
            ,"msg": "删除成功"
            ,"data": data
        })
    })
})

module.exports = router