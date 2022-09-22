const express = require('express')
const router = express.Router()

const userinfoHandler = require('../router_handler/userinfo')

// 验证规则模块
const expressJoi = require('@escook/express-joi')
// 头像验证规则对象
const { update_avatar_schema,update_nickname_schema } = require('../schema/userinfo')
const { update_userPwd_schema } = require('../schema/user')

// 获取用户信息
router.get('/getuserinfo',userinfoHandler.getUserInfo)

// 获取用户头像
router.get('/getuseravatar',userinfoHandler.getUserAvatar)

// 根据用户id获取用户名和用户昵称
router.get('/get_userinfo_byid/:id',userinfoHandler.getUserInfoById)

// 更新用户头像
router.post('/update/avatar',expressJoi(update_avatar_schema),userinfoHandler.updateAvatar)

// 更新用户昵称
router.post('/update/nickname',expressJoi(update_nickname_schema),userinfoHandler.updateNickname)

// 修改密码
router.post('/update/password',expressJoi(update_userPwd_schema),userinfoHandler.updatePwd)

module.exports = router
