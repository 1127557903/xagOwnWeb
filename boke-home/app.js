const express = require('express')
var app = express()
const bodyParser = require('body-parser')
const path = require('path')
const cookieSession = require('cookie-session')


var adminRouter = require('./router/admin/admin')
var apiRouter = require('./router/api/api')

app.use(cookieSession({
	name:'bokeuser',
  keys:['user','arahghfdtdt'],
  maxAge:10000000 //保留cookie的时间
}))
app.listen(3000,()=>{
    console.log('启动')
})
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.set("view engine", "ejs"); //设置模板引擎为ejs
app.set("views", path.join(__dirname, "views")); //设置模板存放目录
app.use(express.static(path.join(__dirname, "public"))); //设置静态资源存放目录
// app.use('/',(req,res,next) => {
//   console.log('进入了')
//   next()
// })
app.use('/admin',adminRouter)
app.use('/api',apiRouter)

// ngrok http 3000 在终端中输入启动映射