const db = require('../db/index')

const jwt = require('jsonwebtoken')
const config = require('../config')

const bcrypt = require('bcryptjs')

// 获取用户信息
exports.getUserInfo = (req, res) => {
  // 去掉无用的 Bearer
  const token = (req.headers.authorization || '').slice(7)
  // 对token进行解密
  const result = jwt.verify(token, config.jwtSecretKey)
  res.send({
    status: 0,
    result
  })
}

// 获取用户头像
exports.getUserAvatar = (req, res) => {
  const sqlStr = `select user_pic from user_table where user_id=?`
  db.query(sqlStr, req.user.user_id, (err, result) => {
    if (err) return res.cc(err)
    if (result.length === 0) return res.cc('获取失败')
    res.send({
      status: 0,
      message: '获取成功',
      data: result
    })
  })
}

// 根据用户id获取用户名、用户昵称、头像
exports.getUserInfoById = (req, res) => {
  const userId = req.params.id
  const sqlStr = `select user_name,user_nickname,user_pic from user_table where user_id=?`
  db.query(sqlStr, userId, (err, result) => {
    if (err) return res.cc(err)
    if (result.length === 0) return res.cc('查询失败')
    res.send({
      status: 0,
      message: '查询成功',
      data: result
    })
  })
}

// 更新用户头像
exports.updateAvatar = (req, res) => {
  const sqlStr = 'update user_table set user_pic=? where user_id=?'
  db.query(sqlStr, [req.body.avatar, req.user.user_id], (err, result) => {
    // 执行 SQL 语句失败
    if (err) return res.cc(err)

    // 执行 SQL 语句成功，但是影响行数不等于 1
    if (result.affectedRows !== 1) return res.cc('更新头像失败！')

    // 更新用户头像成功
    return res.send({
      status: 0,
      message: '更新头像成功'
    })
  })
}

// 更新用户昵称
exports.updateNickname = (req, res) => {
  const sqlStr = 'update user_table set user_nickname=? where user_id=?'
  db.query(sqlStr, [req.body.nickname, req.user.user_id], (err, result) => {
    // 执行 SQL 语句失败
    if (err) return res.cc(err)

    // 执行 SQL 语句成功，但是影响行数不等于 1
    if (result.affectedRows !== 1) return res.cc('更新昵称失败！')

    // 更新用户头像成功
    return res.send({
      status: 0,
      message: '更新昵称成功'
    })
  })
}

// 更新用户密码
exports.updatePwd = (req, res) => {
  // res.send(req.body)

  // 定义根据 id 查询用户数据的 SQL 语句
  const sql = `select * from user_table where user_id=?`

  // 执行 SQL 语句查询用户是否存在
  db.query(sql, req.user.user_id, (err, results) => {
    // 执行 SQL 语句失败
    if (err) return res.cc(err)

    // 检查指定 id 的用户是否存在
    if (results.length !== 1) return res.cc('用户不存在！')

    // 判断提交的旧密码是否正确
    const compareResult = bcrypt.compareSync(req.body.oldPwd, results[0].user_password)
    if (!compareResult) return res.cc('原密码错误！')
    // 定义更新用户密码的 SQL 语句
    const sql = `update user_table set user_password=? where user_id=?`

    // 对新密码进行 bcrypt 加密处理
    const newPwd = bcrypt.hashSync(req.body.newPwd, 10)

    // 执行 SQL 语句，根据 id 更新用户的密码
    db.query(sql, [newPwd, req.user.user_id], (err, results) => {
      // SQL 语句执行失败
      if (err) return res.cc(err)
      // SQL 语句执行成功，但是影响行数不等于 1
      if (results.affectedRows !== 1) return res.cc('更新密码失败！')
      // 更新密码成功
      res.send({
        status: 0,
        message: '更新成功'
      })
    })
  })
}

