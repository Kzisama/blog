import request from '@/untils/request'
import qs from 'qs'

// 用户--注册
export const reguserAPI = formObj => request({
  url: '/api/reguser',
  method: 'POST',
  data: qs.stringify({
    username: formObj.username,
    password: formObj.pass
  })
})

// 用户--登录
export const loginAPI = formObj => request({
  url: '/api/login',
  method: 'POST',
  data: qs.stringify({
    username: formObj.username,
    password: formObj.password
  })
})

// 用户--获取用户数据
export const tokenAPI = () => request({
  url: '/userinfo/getuserinfo',
  method: 'GET'
})

// 用户--获取头像
export const getUserAvatar = () => request({
  url: '/userinfo/getuseravatar',
  method: 'GET'
})

// 用户--根据id获取用户名、用户昵称、头像
export const getUserInfoByIdAPI = uerId => request({
  url: `/userinfo/get_userinfo_byid/${uerId}`,
  method: 'GET'
})

// 用户--更新头像
export const updateUserAvatarAPI = avatar => request({
  url: '/userinfo/update/avatar',
  method: 'POST',
  data: {
    avatar
  }
})

// 用户--更新昵称
export const updateUserNicknameAPI = nickname => request({
  url: '/userinfo/update/nickname',
  method: 'POST',
  data: {
    nickname
  }
})

// 用户--更新密码
export const updateUserPwdAPI = obj => request({
  url: '/userinfo/update/password',
  method: 'POST',
  data:{
    oldPwd:obj.oldPwd,
    newPwd: obj.checkPass
  }
})

// 文章--获取所有文章(推荐文章)
export const getAllArticlesAPI = () => request({
  url: '/article/get_all',
  method: 'GET'
})

// 文章--根据id获取文章信息
export const getArticleByIdAPI = artId => request({
  url: `/article/get_article?artId=${artId}`,
  method: 'GET',
})

// 文章--我的所有文章
export const myArticlesAPI = () => request({
  url: '/article/get_my_all',
  method: 'GET'
})

// 文章--发布文章
export const addArticleAPI = formdata => request({
  url: '/article/add',
  method: 'POST',
  data: formdata,
  headers: {
    'Content-Type': 'multipart/form-data'
  }
})

// 文章--点赞
export const likesAPI = (artId, isLike) => request({
  url: '/article/likes',
  method: 'POST',
  data: {
    artId,
    isLike
  }
})

// 评论--根据文章id获取评论
export const getCommentsAPI = artId => request({
  url: `/comments/get_comments?artId=${artId}`,
  method: 'GET'
})

// 评论--发表评论
export const addCommentAPI = contentObj => request({
  url: '/comments/add_comment',
  method: 'POST',
  data: contentObj
})

