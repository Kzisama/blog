const express = require('express')
const router = express.Router()

// 导入解析 formdata 格式表单数据的包
const multer = require('multer')
// 导入处理路径的核心模块
const path = require('path')

// 创建 multer 的实例对象，通过 dest 属性指定文件的存放路径
const upload = multer({ dest: path.join(__dirname, '../uploads') })

// 导入验证数据的中间件
const expressJoi = require('@escook/express-joi')
// 导入文章的验证模块
const { add_article_schema } = require('../schema/article')

const articleHandler = require('../router_handler/articles')
const db = require('../db')

// 获取全部文章
router.get('/get_all', articleHandler.getAllArticles)

// 获取我的全部文章
router.get('/get_my_all',articleHandler.getMyArticles)

// 根据id获取文章信息
router.get('/get_article',articleHandler.getArticleById)

// 新增文章
// 发布新文章的路由
// upload.single() 是一个局部生效的中间件，用来解析 FormData 格式的表单数据
// 将文件类型的数据，解析并挂载到 req.file 属性中
// 将文本类型的数据，解析并挂载到 req.body 属性中
router.post('/add', upload.single('cover_img'), expressJoi(add_article_schema), articleHandler.addArticle)

// 给文章点赞
router.post('/likes',articleHandler.giveArticleLike)

module.exports = router
