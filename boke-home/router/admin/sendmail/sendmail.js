const express = require("express")
const router =  express.Router()
const sendmail = require('../../../methods/sendmail')

router.post('/',(req,res)=>{
    // 发送消息内容
    let message = {
        to: '1403548685@qq.com', // list of receivers
        subject: 'Hello', // Subject line
        // 发送text或者html格式
        // text: 'Hello 我是火星黑洞', // plain text body
        html: '<b>Hello 我做个测试</b>' // html body
    }
    sendmail(message).then(data=>{
        res.send({code:'200',msg:'发送成功'})
    }).catch(err =>{
        console.log(err)
        res.send({code:'333',msg:'发送失败'})
    })
})
router.post('/remoteLogin',(req,res)=>{
    // 发送消息内容
    let message = {
        to: '1403548685@qq.com', // list of receivers
        subject: 'Hello', // Subject line
        // 发送text或者html格式
        // text: 'Hello 我是火星黑洞', // plain text body
        html: '<b>Hello 我做个测试</b>' // html body
    }
    sendmail(message).then(data=>{
        res.send({code:'200',msg:'发送成功'})
    }).catch(err =>{
        console.log(err)
        res.send({code:'333',msg:'发送失败'})
    })
})
module.exports = router