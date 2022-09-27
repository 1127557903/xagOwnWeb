const express = require("express")
const router =  express.Router()
const db = require('../../../connect/connect')
const sendmail = require('../../../methods/sendmail')

router.get('/',async (req,res)=>{
    let username =  req.session.user
    let sql = 'select * from admin where users_name=?'
    let data = await db(sql,[username])
    console.log(data,'data')
    res.render('index', {data})
})
router.post('/ip',async (req,res)=>{
    let {ip,city,equipment} = req.body
    let user = req.session.user
    let sql = "select * from admin where users_name=?"
    let data = await db(sql, [user])
    let mail = data[0].email
    if(!mail){
        res.send({code: 200})
        return
    }
    if (data && data[0].ip && data[0].city) {
        if (city !== data[0].city || ip !== data[0].ip) {
            let message = {
                to: mail, // list of receivers
                subject: '异地登录提醒', // Subject line
                // 发送text或者html格式
                // text: 'Hello 我是火星黑洞', // plain text body
                html: `    <div>亲爱的达州行用户：</div>
                <div>经系统检测，您的帐号${user}在异地成功登录：</div>
                <div style="margin-top: 15px;">
                    <div>时间：${new Date().getDate()}</div>
                    <div>登录业务：${equipment}</div>
                    <div>参考地点：${city}</div>
                </div>
                <div style="margin-top: 15px;">
                    <div>如非本人登录，请前往达州行安全中心<a href="localhost:3000">（点此进入）</a>，尽快修改密码。</div>
                    <div>如果是您本人操作，请忽略本次提醒。</div>
                </div>` // html body
            }
            let sql2 = 'update admin set ip=?,city=? where users_name=?'
            let result = db(sql2,[ip,city,user])
            sendmail(message).then(data=>{
                res.send({code: 303,msg:'异地登录中'})
            }).catch(err =>{
                console.log(err)
                res.send({code:'333',msg:'发送失败'})
            })
        }
    } else {
        let sql2 = 'update admin set ip=?,city=? where users_name=?'
        let result = db(sql2,[ip,city,user])
        res.send({code: 200})
    }
})
router.get('/test', (req,res)=> {
    res.render('test')
})

module.exports = router