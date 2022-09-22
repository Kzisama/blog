const db = require('../db/index')
// 导入格式化日期的模块
const moment = require('moment')

// 发布文章评论
exports.addComment = (req, res) => {
  const sqlStr = `select user_name,user_nickname,user_pic from user_table where user_id=?`
  db.query(sqlStr, req.user.user_id, (err, result) => {
    if (err) return res.cc(err)
    if (result.length !== 1) return res.cc('发布失败')
    // 执行成功
    const commentObj = {}
    commentObj.autId = req.user.user_id
    commentObj.content = req.body.content
    commentObj.artId = req.body.artId
    commentObj.pub_date = moment().format('YYYY-MM-DD HH:mm')
    commentObj.autName = result[0].user_name
    commentObj.autNickName = result[0].user_nickname
    commentObj.autPic = result[0].user_pic


    const sql = `insert into comment_table set?`
    db.query(sql, commentObj, (err2, result2) => {
      if (err2) return res.cc(err2)
      if (result2.affectedRows !== 1) return res.cc('发布失败')
      // 发布成功，更新文章列表中的数据
      // 更新数据文章列表中的数据
      const sql2 = `select * from comment_table where artId=?`
      db.query(sql2, commentObj.artId, (err, result) => {
        if (err) return res.cc(err)
        const comments = result.length
        // 执行成功
        const sql3 = `update article_table set comments=? where artId=?`
        db.query(sql3, [comments, commentObj.artId], (err, result) => {
          if (err) return res.cc(err)
          if (result.affectedRows !== 1) return res.cc('更新失败')
          res.send({
            status: 0,
            message: '发布成功',
            data: commentObj
          })
        })
      })
    })
  })
}

// 根据文章id获取评论列表
exports.getCommentsById = (req, res) => {
  const sqlStr = `select * from comment_table where artId=?`
  db.query(sqlStr, req.query.artId, (err, result) => {
    if (err) return res.cc(err)
    if (result.length === 0) return res.send({
      status: 0,
      message: '单机贴吧？'
    })
    res.send({
      status: 0,
      message: '获取评论列表成功',
      data: result
    })
  })
}
