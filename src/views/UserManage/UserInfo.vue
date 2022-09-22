<template>
  <div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="用户昵称" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <!--  上传头像  -->
      <el-form-item label="用户头像" prop="file">
        <el-upload
            action=""
            list-type="picture-card"
            :limit="1"
            :auto-upload="false"
            :on-change="getFile"
            :on-remove="removeFile">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" round @click="submitForm('ruleForm')">确认更新</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import { updateUserNicknameAPI, updateUserAvatarAPI } from '@/api'
import { mapMutations } from 'vuex'

export default {
  name: 'UserInfo',
  data () {
    return {
      ruleForm: {
        name: '',
        pic: null
      },
      rules: {
        name: [
          { min: 3, message: '长度不得少于 3 个字符', trigger: 'blur' }
        ]
      },
      dialogImageUrl: '',
      dialogVisible: false,
    }
  },
  methods: {
    ...mapMutations(['updateUserAvatar', 'updateUserNickName']),
    // 提交表单
    submitForm (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          // const res1 = await updateUserNicknameAPI(this.ruleForm.name)
          // const res2 = await updateUserAvatarAPI(this.ruleForm.pic)
          // console.log(res1)
          // console.log(res2)
          if (this.ruleForm.pic && this.ruleForm.name) {
            await updateUserAvatarAPI(this.ruleForm.pic)
            await updateUserNicknameAPI(this.ruleForm.name)
            // 视图更新--头像
            this.updateUserAvatar(this.ruleForm.pic)
            // 视图更新--昵称
            this.updateUserNickName(this.ruleForm.name)
            this.success()
            // 重置表单
            this.resetForm()
          } else if (this.ruleForm.name && !this.ruleForm.pic) {
            await updateUserNicknameAPI(this.ruleForm.name)
            // 视图更新--昵称
            this.updateUserNickName(this.ruleForm.name)
            this.success()
            // 重置表单
            this.resetForm()
          } else if (!this.ruleForm.name && this.ruleForm.pic) {
            await updateUserAvatarAPI(this.ruleForm.pic)
            // 视图更新--头像
            this.updateUserAvatar(this.ruleForm.pic)
            this.success()
            // 重置表单
            this.resetForm()
          } else {
            this.fail()
          }
        } else {
          this.fail()
          return false
        }
      })
    },
    // 重置表单
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    // 获取到图片的信息,要传递的是file.raw中的内容
    getFile (file) {
      this.getBase64(file.raw).then(res => {
        console.log(res)
        // 将图片转换成为了base64
        this.ruleForm.pic = res
      })
    },
    // 移除文件
    removeFile () {
      delete this.ruleForm.pic
    },
    // 获取图片转base64
    getBase64 (file) {
      return new Promise(function (resolve, reject) {
        const reader = new FileReader()
        let imgResult = ''
        reader.readAsDataURL(file)
        reader.onload = function () {
          imgResult = reader.result
        }
        reader.onerror = function (error) {
          reject(error)
        }
        reader.onloadend = function () {
          resolve(imgResult)
        }
      })
    },
    // 提交成功后弹窗
    success () {
      this.$message({
        message: '更新用户信息成功',
        type: 'success'
      })
    },
    // 提交失败后弹窗
    fail () {
      this.$message.error('请填写修改信息')
    }
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
}

.el-form {
  min-height: 400px;
  background-color: rgba(255, 255, 255, .4);
}

.el-form-item {
  margin-bottom: 20px;
}

</style>
