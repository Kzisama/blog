<template>
  <div class="comment">
    <div class="left">
      <!--  头像  -->
      <div class="avatar">
        <img :src="commentItem.autPic?commentItem.autPic:squareUrl" alt="">
      </div>
    </div>
    <div class="right">
      <!-- 作者 -->
      <div class="aut">{{ !commentItem.autNickName ? commentItem.autName : commentItem.autNickName }}</div>
      <!--  评论内容  -->
      <p class="text">
        {{ commentItem.content }}
      </p>
      <!--  作者和发布时间  -->
      <div class="pub_date">{{ commentItem.pub_date }}</div>
    </div>
  </div>
</template>

<script>
import AuthImg from '@/components/AuthImg'
import { getUserInfoByIdAPI } from '@/api'

export default {
  name: 'ArticleComment',
  components: {
    AuthImg
  },
  props: {
    commentItem: Object
  },
  data () {
    return {
      squareUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
    }
  },
  async created () {
    const res = await getUserInfoByIdAPI(this.commentItem.autId)
    this.commentItem.autNickName = res.data.data[0].user_nickname
    this.commentItem.autPic = res.data.data[0].user_pic
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
}

.comment {
  display: flex;
  box-sizing: border-box;
  margin-top: 15px;
  padding: 15px;
  width: 100%;
  min-height: 100px;
  background-color: rgba(255, 255, 255, .4);
  border-radius: 4px;
}

.left {
  float: left;
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
}

.avatar img {
  display: block;
  width: 100%;
  height: 100%;
}

.right {
  margin-left: 20px;
}

.aut {
  margin: 10px 0 15px;
}

.pub_date {
  margin-top: 12px;
  color: #454649;
}
</style>
