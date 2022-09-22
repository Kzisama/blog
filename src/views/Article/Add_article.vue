<template>
  <div>
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="标题" prop="title">
        <el-input v-model.trim="form.title"></el-input>
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <el-input type="textarea" v-model="form.content"></el-input>
      </el-form-item>
      <el-form-item label="选择封面">
        <el-upload
            action=""
            list-type="picture-card"
            :limit="1"
            :auto-upload="false"
            :on-change="getFile"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">发布文章</el-button>
      </el-form-item>
    </el-form>
    <!--  发布成功后弹窗  -->
  </div>
</template>

<script>
import { addArticleAPI } from '@/api'

export default {
  name: 'Add_article',
  data () {
    // 自定义文章内容校验规则
    const contentRule = (rule, value, callback) => {
      if (value === '' || value.trim().length === 0) {
        callback(new Error('内容不能为空'))
      } else {
        callback()
      }
    }
    return {
      form: {
        title: '',
        content: '',
        file: null
      },
      rules: {
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          { min: 3, message: '不得少于3个字符', trigger: 'blur' }
        ],
        content: [
          { validator: contentRule, trigger: 'blur' }
          // {required: true, message: '请输入文章内容', trigger: 'blur'},
          // { min: 1, message: '内容不可以为空哦', trigger: 'blur' }
        ],
        file: [
          { required: true, message: '需要一张图片哦', trigger: 'blur' }
        ]
      },
      dialogImageUrl: '',
      dialogVisible: false,
    }
  },
  methods: {
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 获取到图片的信息,要传递的是file.raw中的内容
    getFile (file) {
      this.form.file = file.raw
      console.log(file)
    },
    // 发布文章成功后弹窗
    addSuccess () {
      this.$message({
        message: '发布文章成功',
        type: 'success'
      })
    },
    // 发布文章失败后弹窗
    addFail () {
      this.$message({
        message: '请填写完整信息哦',
        type: 'error'
      })
    },
    onSubmit () {
      // 通过验证之后再发送请求
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          // 后台接收fromData数据格式的数据
          // 注意要在headers中修改 'Content-Type': 'multipart/form-data'
          const formdata = new FormData()
          formdata.append('title', this.form.title)
          formdata.append('content', this.form.content.trim())
          formdata.append('cover_img', this.form.file)
          const res = await addArticleAPI(formdata)
          if (res.data.status === 0) {
            this.addSuccess()
            await this.$router.push({
              path: '/home/all_articles'
            })
          }
          console.log(res)
        } else {
          this.addFail()
          return false
        }
      })
    },
  }
}
</script>

<style scoped>
.el-form {
  background-color: rgba(255, 255, 255, .4);
}

/deep/ .el-form .el-form-item__label {
  color: #000;
}

.el-textarea {
  min-height: 400px;
}

/deep/ .el-textarea .el-textarea__inner {
  height: 400px !important;
}
</style>
