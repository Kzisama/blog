const express = require('express')

const app = express()

// 配置跨域设置
const cors = require('cors')
app.use(cors())

// 配置解析表单数据中间件
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// 在路由之前定义一个req.cc中间件,封装响应失败时的数据
app.use((req, res, next) => {
  res.cc = (err, status = 1) => {
    res.send({
      status,
      message: err instanceof Error ? err.message : err
    })
  }
  next()
})

// 导入配置文件
const config = require('./config')
// 导入解析token模块
const expressJWT = require('express-jwt')
// 使用 .unless({ path: [/^\/api\//] }) 指定哪些接口不需要进行 Token 的身份认证
app.use(expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api\//] }))

// 托管静态资源文件
app.use('/uploads', express.static('./uploads'))

// 路由模块 -- 登录注册
const userRouter = require('./router/user')
app.use('/api', userRouter)

// 路由模块 -- 用户信息
const userInfoRouter = require('./router/userinfo')
app.use('/userinfo', userInfoRouter)

// 路由模块 -- 文章列表
const articlesRouter = require('./router/articles')
app.use('/article', articlesRouter)

// 路由模块 -- 评论列表
const commentsRouter = require('./router/comments')
app.use('/comments', commentsRouter)

// 全局错误级别中间件
app.use((err, req, res, next) => {
  // 身份认证失败导致的错误
  if (err.name === 'UnauthorizedError') return res.cc('身份认证失败')
  // 其他错误
  if (err) return res.cc(err)
  next()
})

app.listen(3007, () => {
  console.log('api server running at http://127.0.0.1:3007')
})
