<template>
  <div id="home">
    <el-backtop :visibility-height="10"></el-backtop>
    <div>
      <!--  主体内容  -->
      <div class="content">
        <aside class="left">
          <!-- 用户信息 -->
          <div class="my_info">
            <!-- 头像 -->
            <div class="block">
              <el-avatar shape="square" :size="60" :src="userAvatar ? userAvatar : squareUrl"></el-avatar>
              <!--              <h4>{{ !user.user_nickname ? user.user_name : user.user_nickname }}</h4>-->
              <h4>{{ !userInfo.user_nickname ? userInfo.user_name : userInfo.user_nickname }}</h4>
            </div>
            <!-- 信息 -->
            <div class="user_info">
              <div class="item">
                <h5>全部文章</h5>
                <span>{{ user.user_articles }}</span>
              </div>
              <div class="item">
                <h5>点赞数</h5>
                <span>{{ user.user_likes }}</span>
              </div>
            </div>
          </div>
          <!-- 功能模块 -->
          <el-menu
              class="el-menu-vertical-demo"
              router
              background-color="rgba(255, 255, 255, .2)"
              text-color="#000"
              active-text-color="#ffd04b">
            <!-- 推荐文章 -->
            <el-menu-item index="/home/recommend_articles">
              <i class="el-icon-watermelon"></i>
              <span slot="title">推荐文章</span>
            </el-menu-item>
            <!-- 文章管理 -->
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-reading"></i>
                <span>我的文章</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="/home/all_articles">全部文章</el-menu-item>
                <el-menu-item index="/home/add_article">发布文章</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <!-- 用户管理 -->
            <el-submenu index="2">
              <template slot="title">
                <i class="el-icon-user-solid"></i>
                <span>用户管理</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="/home/user_info">修改个人信息</el-menu-item>
                <el-menu-item index="/home/user_pwd">修改密码</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <!-- 退出登录 -->
            <el-menu-item @click="exit">
              <i class="el-icon-unlock"></i>
              <span slot="title">退出登录</span>
            </el-menu-item>
          </el-menu>
        </aside>

        <main>
          <keep-alive exclude="ArticleDetails">
            <router-view></router-view>
          </keep-alive>
        </main>

        <aside class="right">
          <el-calendar v-model="value">
          </el-calendar>
        </aside>

      </div>
    </div>
  </div>
</template>

<script>
import { getUserAvatar, myArticlesAPI, tokenAPI } from '@/api'
import { delToken } from '@/untils/token'
import { mapMutations, mapState } from 'vuex'

export default {
  name: 'HomePage',
  data () {
    return {
      user: {},
      squareUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
      value: new Date()
    }
  },
  computed: {
    ...mapState(['userInfo', 'userAvatar'])
  },
  methods: {
    // 退出登录
    exit () {
      this.$confirm('确定要退出登录吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delToken()
        this.$router.push('/reg_login')
        this.$message({
          type: 'success',
          message: '已退出登录!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    ...mapMutations(['updateUserInfo', 'updateUserAvatar'])
  },
  async created () {
    const res = await tokenAPI()
    console.log(res)
    // 将用户信息保存到vuex中
    this.updateUserInfo(res.data.result)
    const res2 = await myArticlesAPI()
    this.user = {
      // user_name: res.data.result.user_name,
      // user_nickname: res.data.result.user_nickname,
      // user_pic: res.data.result.user_pic,
      user_articles: res2.data.data.length,
      user_likes: res2.data.data.reduce((prev, item) => prev += item.likes, 0)
    }
    // 判断用户有没有头像
    const res3 = await getUserAvatar()
    if (!res3.data.data[0].user_pic) {
      // 没有头像什么也不干--使用默认头像
    } else {
      // 有头像--保存到vuex中
      // this.squareUrl = res3.data.data[0].user_pic
      this.updateUserAvatar(res3.data.data[0].user_pic)
    }
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
}

#home {
  height: 100vh;
  /* 让滚动条不占据位置 */
  overflow: overlay;
  background: url(../../assets/wallhaven-l3xk6q.jpg) no-repeat;
  background-size: cover;
}

.content {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 150vh;
  margin: 10px auto;
}


.left {
  position: sticky;
  top: 10px;
  width: 244px;
}

.my_info {
  display: flex;
  flex-direction: column;
  position: relative;
  margin-bottom: 10px;
  background-color: rgba(255, 255, 255, .4);
  border-radius: 4px;
  width: 100%;
  height: 188px;
}

.block {
  margin: 15px 0;
  text-align: center;
}

.user_info {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.item {
  flex: 1;
  text-align: center;
}

.item h5 {
  margin-bottom: 15px;
}

.el-menu-vertical-demo {
  border-radius: 5px;
}

main {
  margin: 0 8px;
  width: 632px;
  min-width: 500px;
  /*background-color: rgba(255, 255, 255, .4);*/
}

.right {
  min-height: 100px;
  width: 360px;
  background-color: rgba(255, 255, 255, .4);
  border-radius: 5px;
}

.el-calendar {
  background-color: rgba(255, 255, 255, .2);
  border-radius: 5px;
}

/deep/ .el-calendar-day {
  height: 50px;
}
</style>
