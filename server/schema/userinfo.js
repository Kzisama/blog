const joi = require('joi')

// dataUri() 指的是如下格式的字符串数据：
// data:image/png;base64,VE9PTUFOWVNFQ1JFVFM=
const avatar = joi.string().dataUri().required()

const nickname = joi.string().min(3).required()

exports.update_avatar_schema = {
  body: {
    avatar,
  },
}

exports.update_nickname_schema = {
  body: {
    nickname,
  },
}
