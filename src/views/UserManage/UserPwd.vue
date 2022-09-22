<template>
  <div>
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="原密码" prop="oldPwd" autocomplete="off">
        <el-input v-model.trim="ruleForm.oldPwd"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="pass">
        <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { updateUserPwdAPI } from '@/api'
import { delToken } from '@/untils/token'

export default {
  name: 'UserPwd',
  data () {
    const validateOldPwd = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入原密码'))
      } else if (value.length < 6 || value.length > 12) {
        callback(new Error('请输入 6~12 位原密码'))
      }
      callback()
    }
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass')
        }
        callback()
      }
    }
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      ruleForm: {
        pass: '',
        checkPass: '',
        oldPwd: ''
      },
      rules: {
        pass: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' }
        ],
        oldPwd: [
          { validator: validateOldPwd, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          // console.log(this.ruleForm)
          const res = await updateUserPwdAPI(this.ruleForm)
          console.log(res)
          if (res.data.status === 0) {
            this.success()
            delToken()
            await this.$router.push('/reg_login')
          } else if (res.data.status === 1 && res.data.message === '"newPwd" contains an invalid value') {
            this.fail('新密码不能和原密码一致')
          } else {
            this.fail(res.data.message)
          }
        } else {
          this.fail()
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    // 提交成功后弹窗
    success () {
      this.$message({
        message: '更新用户信息成功',
        type: 'success'
      })
    },
    // 提交失败后弹窗
    fail (str = '请填写修改信息') {
      this.$message.error(str)
    }
  }
}
</script>

<style scoped>
.el-form {
  padding: 30px 100px 0 0;
  text-align: center;
  min-height: 500px;
  background-color: rgba(255, 255, 255, .4);
}
</style>
