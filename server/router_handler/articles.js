// 导入数据库模块
const db = require('../db/index')

// 导入处理路径的 path 核心模块
const path = require('path')

// 导入格式化日期的模块
const moment = require('moment')

// 获取全部文章
exports.getAllArticles = (req, res) => {
  const sqlStr = `select * from article_table where is_delete=0`
  db.query(sqlStr, (err, result) => {
    if (err) return res.cc(err)
    if (!result) return res.cc('还没有文章')
    res.send({
      status: 0,
      message: '获取文章列表成功',
      data: result
    })
  })
}

// 获取我的全部文章
exports.getMyArticles = (req, res) => {
  const sqlStr = `select * from article_table where author_id = ? and is_delete = 0`
  db.query(sqlStr, req.user.user_id, (err, result) => {
    if (err) return res.cc(err)
    if (!result) return res.cc('没有找到文章')
    res.send({
      status: 0,
      message: '获取文章成功',
      data: result
    })
  })
}

// 根据id获取文章信息
exports.getArticleById = (req, res) => {
  const sqlStr = `select * from article_table where artId=?`
  db.query(sqlStr, req.query.artId, (err, result) => {
    if (err) return res.cc(err)
    if (result.length !== 1) return res.cc('查询错误')
    res.send({
      status: 0,
      message: '查询成功',
      data: result
    })
  })
}

// 新增文章
exports.addArticle = (req, res) => {
  // 判断是否有封面
  if (!req.file || req.file.fieldname !== 'cover_img') return res.cc('封面是必要参数')
  // 添加文章
  const articleInfo = {
    // 文章标题和内容
    ...req.body,
    // 文章封面存放路径
    cover_img: path.join('/uploads', req.file.filename),
    // 文章发布时间
    pub_date: moment().format('YYYY-MM-DD HH:mm'),
    // 文章作者id
    author_id: req.user.user_id,
    // 点赞
    likes: 0,
    // 评论
    comments: 0,
    // 浏览
    views: 0
  }
  const sqlStr = `insert into article_table set ?`
  db.query(sqlStr, articleInfo, (err, result) => {
    if (err) return res.cc(err)
    if (result.affectedRows !== 1) return res.cc('发布失败')
    res.send({
      status: 0,
      message: '发布文章成功'
    })
  })
}

// 给文章点赞或取消点赞
exports.giveArticleLike = (req, res) => {
  // 根据路由信息获取到该文章原本的点赞数
  const sqlStr = `select likes from article_table where artId=?`
  db.query(sqlStr, req.body.artId, (err, result) => {
    if (err) return res.cc(err)
    if (result.length !== 1) return res.cc('点赞时发生错误')
    const oldLikes = result[0].likes
    // 在原来的点赞数上进行加减1
    let newLikes = oldLikes
    if (!req.body.isLike) { // 传递过来的状态为未点赞
      newLikes = oldLikes + 1
    } else {
      newLikes = oldLikes - 1
    }
    const sql = `update article_table set likes=? where artId=?`
    db.query(sql, [newLikes, req.body.artId], (err, result2) => {
      if (err) return res.cc(err)
      if (result2.affectedRows !== 1) return res.cc('点赞失败')
      res.send({
        status: 0,
        message: '点赞成功'
      })
    })
  })
}
