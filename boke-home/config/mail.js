let mail = {
    // host: 'smtp.ethereal.email',
    service: 'qq', // 使用了内置传输发送邮件 查看支持列表：https://nodemailer.com/smtp/well-known/
    port: 465, // SMTP 端口
    secureConnection: true, // 使用了 SSL
    auth: {
      user: '1127557903@qq.com',//你的邮箱
      // 这里密码不是qq密码，是你设置的smtp授权码
      pass: 'pgowyywledmdbaba',
    }
  }


//   原代码
    // let transporter = nodemailer.createTransport({
    //     // host: 'smtp.ethereal.email',
    //     service: 'qq', // 使用了内置传输发送邮件 查看支持列表：https://nodemailer.com/smtp/well-known/
    //     port: 465, // SMTP 端口
    //     secureConnection: true, // 使用了 SSL
    //     auth: {
    //       user: '1127557903@qq.com',//你的邮箱
    //       // 这里密码不是qq密码，是你设置的smtp授权码
    //       pass: 'pgowyywledmdbaba',
    //     }
    //   });
      
    //   let mailOptions = {
    //     from: '"测试管理" <1127557903@qq.com>', // sender address
    //     to: '1403548685@qq.com', // list of receivers
    //     subject: 'Hello', // Subject line
    //     // 发送text或者html格式
    //     // text: 'Hello 我是火星黑洞', // plain text body
    //     html: '<b>Hello 我是火星黑洞</b>' // html body
    //   };
      
    //   // send mail with defined transport object
    //   transporter.sendMail(mailOptions, (error, info) => {
    //     if (error) {
    //       return console.log(error);
    //     }
    //     console.log('Message sent: %s', info.messageId);
    //     // Message sent: <04ec7731-cc68-1ef6-303c-61b0f796b78f@qq.com>
    //   });

module.exports = mail