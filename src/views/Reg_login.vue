<template>
  <div id="reg_login">
    <!--  Login  -->
    <form v-if="flag" class="login">
      <h3>登录</h3>
      <label for="username">用户名</label>
      <input type="text" placeholder="Username" id="username" v-model="loginForm.username" autocomplete="off">
      <label for="password">密码</label>
      <input type="password" placeholder="Password" id="password" v-model="loginForm.password">
      <button @click.prevent="userLoginFN">登录</button>
      <a href="javascript:" @click="flag=!flag">没有帐号?去注册</a>
    </form>
    <!--  Reg  -->
    <el-form v-else :model="ruleForm" :label-position="labelPosition" status-icon :rules="rules" ref="ruleForm"
             label-width="100px" class="demo-ruleForm">
      <h3>注册</h3>
      <el-form-item label="用户名" prop="username">
        <el-input v-model="ruleForm.username" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="pass">
        <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">注册</el-button>
      </el-form-item>
      <a href="javascript:" style="margin-left: 100px" @click="flag=!flag">已有帐号?去登陆</a>
    </el-form>
  </div>
</template>

<script>
import { reguserAPI, loginAPI } from '@/api'
import { setToken } from '@/untils/token'

export default {
  name: 'reg_login',
  data () {
    const checkUsername = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('用户名不能为空'))
      } else {
        if (value.length < 6 || value.length > 10) {
          return callback(new Error('请输入6~10位用户名'))
        }
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass')
        }
        if (value.length < 6) {
          callback(new Error('请输入不小于6位的密码'))
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
      labelPosition: 'right',
      flag: true, // 表单切换
      // 注册表单
      rules: {
        pass: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' }
        ],
        username: [
          { validator: checkUsername, trigger: 'blur' }
        ]
      },
      ruleForm: {
        username: '',
        pass: '',
        checkPass: ''
      },
      // 登录表单
      loginForm: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    // 注册新用户
    submitForm (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          await reguserAPI(this.ruleForm)
          this.regSuccess()
          this.flag = !this.flag
        } else {
          this.regFail()
          return false
        }
      })
    },
    // 注册成功后弹窗
    regSuccess () {
      this.$message({
        message: '注册成功',
        type: 'success'
      })
    },
    // 注册失败后弹窗
    regFail () {
      this.$message({
        message: '注册失败',
        type: 'error'
      })
    },
    // 用户登录
    async userLoginFN () {
      const res = await loginAPI(this.loginForm)
      if (res.data.status === 1) { // 登录失败
        this.loginFail()
      } else {  // 登录成功
        setToken(res.data.token)
        this.loginSuccess()
        await this.$router.push({
          path: '/home'
        })
      }
    },
    // 登录成功弹窗
    loginSuccess () {
      this.$message({
        message: '登录成功',
        type: 'success'
      })
    },
    // 登录失败弹窗
    loginFail () {
      this.$message({
        message: '账号或密码错误',
        type: 'error'
      })
    }
  },
}
</script>

<style scoped>
a {
  text-decoration: none;
}

#reg_login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-image: linear-gradient(45deg, #ccfbff, #ef96c5);
}

.el-form {
  width: 400px;
  height: 520px;
  padding: 50px 50px 0;
  background: rgba(255, 255, 255, .3);
  border-radius: 10px;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 40px rgba(8, 7, 16, 0.6);
}

/deep/ .el-form-item__label {
  width: 80px !important;
}

.el-form-item {
  color: #000;
}

/deep/ .el-form-item__label {
  font-size: 16px;
}

.el-input {
  height: 50px;
}

.el-button {
  width: 95%;
}

/deep/ .el-input__inner {
  width: 287px;
}

.login {
  height: 520px;
  width: 400px;
  background-color: rgba(255, 255, 255, 0.13);
  position: absolute;
  transform: translate(-50%, -50%);
  top: 50%;
  left: 50%;
  border-radius: 10px;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 40px rgba(8, 7, 16, 0.6);
  padding: 50px 35px;
}

.login h3, h3 {
  font-size: 32px;
  font-weight: 500;
  line-height: 42px;
  text-align: center;
}

.login label {
  display: block;
  margin-top: 30px;
  font-size: 16px;
  font-weight: 500;
}

.login input {
  display: block;
  height: 50px;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.07);
  border-radius: 3px;
  padding: 0 10px;
  margin-top: 8px;
  font-size: 14px;
  font-weight: 300;
}

::placeholder {
  color: #000;
}

.login button {
  margin-top: 50px;
  width: 424px;
  background-color: #ffffff;
  color: #080710;
  margin-bottom: 12px;
  padding: 15px 0;
  font-size: 18px;
  font-weight: 600;
  border-radius: 5px;
  cursor: pointer;
}
</style>
