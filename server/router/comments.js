const express = require('express')
const router = express.Router()

const commentsHandler = require('../router_handler/comments')

// 发布文章评论
router.post('/add_comment', commentsHandler.addComment)

// 获取评论列表
router.get('/get_comments', commentsHandler.getCommentsById)

module.exports = router
