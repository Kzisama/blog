// 引入数据库模块
const db = require('../db/index')
// 导入密码加密模块
const bcrypt = require('bcryptjs')
// 导入生成token的模块
const jwt = require('jsonwebtoken')
// 导入生成token的密钥
const config = require('../config')

// 注册用户
exports.reguser = (req, res) => {
  const userInfo = req.body
  // 对用户密码进行加密
  userInfo.password = bcrypt.hashSync(userInfo.password, 10)
  console.log(userInfo)
  // 定义sql语句
  const sqlStr = 'select * from user_table where user_name = ?'
  db.query(sqlStr, userInfo.username, (err, result) => {
    // 语句执行失败
    if (err) return res.cc(err)
    // 语句执行成功,判断用户名是否存在
    if (result.length > 0) return res.send({
      status: 0,
      message: '该用户名已被注册'
    })
    // 添加用户
    const sql = 'insert into user_table (user_name,user_password) values (?,?)'
    db.query(sql, [userInfo.username, userInfo.password], (err, result) => {
      if (err) return res.cc(err)
      if (result.affectedRows !== 1) return res.cc('注册失败')
      res.send('注册成功')
    })
  })
}

// 用户登录
exports.login = (req, res) => {
  const userinfo = req.body
  // 定义sql语句
  const sqlStr = 'select * from user_table where user_name=?'
  db.query(sqlStr, userinfo.username, (err, result) => {
    // 语句执行失败
    if (err) return res.cc(err)
    // 语句执行成功，但是没有找到这个数据
    if (result.length !== 1) return res.cc('登陆失败')
    // 判断密码是否正确,使用 bcrypt.compareSync 比较用户输入密码和数据中是否一致
    const compareResult = bcrypt.compareSync(userinfo.password, result[0].user_password)
    if (!compareResult) return res.cc('密码不正确')
    // 将用户信息保存在token中，剔除敏感的信息 如：密码，头像
    const user = { ...result[0], user_password: '', user_pic: '' }
    // 登录成功,生成 Token 字符串
    const tokenStr = jwt.sign(user, config.jwtSecretKey, { expiresIn: config.expiresIn })
    res.send({
      status: 0,
      message: '登录成功',
      token: tokenStr
    })
  })
}


