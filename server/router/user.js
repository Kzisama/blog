const express = require('express')
const router = express.Router()

// 导入路由函数
const userHandler = require('../router_handler/user')

// 1. 导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi')
// 2.导入验证规则
const { reg_login_schema } = require('../schema/user')

// 注册新用户
router.post('/reguser', expressJoi(reg_login_schema), userHandler.reguser)

// 登录
router.post('/login', userHandler.login)

module.exports = router
