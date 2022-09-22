const joi = require('joi')

// 定义 标题、分类Id、内容、发布状态 的验证规则
const title = joi.string().required()
const content = joi.string().required().allow('')

exports.add_article_schema = {
  body:{
    title,
    content
  }
}
