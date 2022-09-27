const mail = require('../config/mail')
const nodemailer = require('nodemailer');

function sendmail(obj) {
    return new Promise((resolve,reject) => {
        let transporter = nodemailer.createTransport(mail);
      
        let mailOptions = {
          from: `"测试管理" <${mail.auth.user}>`, // sender address
          // to: '1403548685@qq.com', // list of receivers
          // subject: 'Hello', // Subject line
          // // 发送text或者html格式
          // // text: 'Hello 我是火星黑洞', // plain text body
          // html: '<b>Hello 我是火星黑洞</b>' // html body
        };
        mailOptions = Object.assign(mailOptions,obj)
        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            reject(error)
            return
          }
          resolve({msg:info.messageId})
          // Message sent: <04ec7731-cc68-1ef6-303c-61b0f796b78f@qq.com>
        });
    })
}

module.exports = sendmail