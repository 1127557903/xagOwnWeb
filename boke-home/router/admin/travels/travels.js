const express = require("express")
const router =  express.Router()
const db = require('../../../connect/connect')
const timeChange = require('../../../config/timefilter')

router.get('/',(req,res) => {
    res.render('travels/travels')
})

// 游记数据
router.get('/select',async (req,res)=>{
    let { page,limit,nick_name,users_name,days,create_time } = req.query
    // where book like '%张%'
    page = parseInt(page)
    limit = parseInt(limit)
    let str=''
    let dataArr = []
    let nameArr = []
    if (nick_name) {
        nameArr.push("users.nick_name like ?")
        dataArr.push(`%${nick_name}%`)
    }
    if (users_name) {
        nameArr.push("users.users_name like ?")
        dataArr.push(`%${users_name}%`)
    }
    if (create_time) {
        nameArr.push('date(create_time) between ? and ?')
        let time = create_time.split(' ~ ')
        dataArr = [...dataArr,...time]
    }
    if (nameArr.length > 0) {
        str = `where ${nameArr.join(' and ')}`
    }
    let sql = `select travels.*,users.nick_name,users.head_img,users.users_name from travels left join users on travels.u_id=users.id ${str} limit ?,?`
    let data = await db(sql,[...dataArr,(limit*(page-1)),limit])
    let sql1 = 'select count(*) from travels'
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

module.exports = router