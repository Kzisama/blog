<template>
  <div class="artContainer" @click="toDetails">
    <div class="left">
      <!-- 作者信息 -->
      <div class="author">
        <span class="author_name">{{ !userNickName ? userName : userNickName }}</span> |
        <span class="pub_time">{{ articleItem.pub_date }}</span>
      </div>
      <!--   文章标题   -->
      <h2>{{ articleItem.title }}</h2>
      <!--   文章功能   -->
      <div class="actions">
        <i class="iconfont icon-good"><span>{{ articleItem.likes }}</span></i>
        <i class="iconfont icon-comment"><span>{{ articleItem.comments }}</span></i>
        <i class="iconfont icon-browse"><span>{{ articleItem.views }}</span></i>
      </div>
    </div>
    <!--  文章封面  -->
    <div class="right">
      <!-- img用src下载是get请求且不经过axios全局配置，会携带不上token。所以不能用img，只能自己写一个图片组件替代img -->
      <AuthImg :authSrc="$host+articleItem.cover_img" alt=""></AuthImg>
    </div>
  </div>
</template>

<script>
import AuthImg from '@/components/AuthImg'
import { getUserInfoByIdAPI } from '@/api'

export default {
  name: 'ArticleItem',
  components: {
    AuthImg
  },
  props: {
    articleItem: Object
  },
  data () {
    return {
      userName: '',
      userNickName: ''
    }
  },
  methods: {
    // 跳转到文章详情页
    toDetails () {
      this.$router.push({
        path: '/home/article_details',
        query: {
          artId: this.articleItem.artId
        }
      })
    }
  },
  async created () {
    const res = await getUserInfoByIdAPI(this.articleItem.author_id)
    this.userName = res.data.data[0].user_name
    this.userNickName = res.data.data[0].user_nickname
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
}

.artContainer {
  position: relative;
  box-sizing: border-box;
  display: flex;
  width: 100%;
  min-height: 200px;
  background-color: rgba(255, 255, 255, .4);
  border-radius: 5px;
  margin-bottom: 8px;
  padding: 10px 15px;
  cursor: pointer;
}

.left {
  flex: 1;
}

h2 {
  margin-top: 25px;
}

.actions {
  position: absolute;
  bottom: 25px;
}

.iconfont {
  font-size: 22px;
  margin-right: 25px;
}

.iconfont span {
  margin-left: 5px;
  font-size: 16px;
}

.right {
  width: 150px;
  height: 150px;
  background-color: #fff;
  margin: auto 0;
  border-radius: 10px;
  overflow: hidden;
}

.right img {
  display: block;
  width: 100%;
  height: 100%;
}

</style>
