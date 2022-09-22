<template>
  <div>
    <!--  文章详情  -->
    <div class="details">
      <div>{{ !userNickName ? userName : userNickName }} | {{ articleInfo.pub_date }}</div>
      <h2>{{ articleInfo.title }}</h2>
      <p>{{ articleInfo.content }}</p>
      <div class="actions">
        <i :class="[iconfont,!isLike?icon_xxx:'icon-good1']"
           @click="articleLike(isLike)">
          <span>{{ articleInfo.likes }}</span>
        </i>
        <i class="iconfont icon-comment"><span>{{ articleInfo.comments }}</span></i>
        <i class="iconfont icon-browse"><span>{{ articleInfo.views }}</span></i>
      </div>
    </div>
    <!--  发布评论  -->
    <div class="add_comment">
      <!--  头像:注意是自己的头像  -->
      <div class="avatar">
        <img :src="userAvatar ? userAvatar : squareUrl" alt="">
      </div>
      <!--  文本  -->
      <textarea placeholder="发一条友善的评论吧" v-model="contentObj.content"></textarea>
      <!--  发布按钮  -->
      <button @click="addComment">发表</button>
    </div>
    <!--  文章评论  -->
    <ArticleComment
        v-for="obj in commentsList" :key="obj.commentId"
        :commentItem="obj">
    </ArticleComment>
  </div>
</template>

<script>
import { getArticleByIdAPI, getUserInfoByIdAPI, getCommentsAPI, addCommentAPI, likesAPI } from '@/api'
import ArticleComment from '@/components/ArticleComment'
import { mapState } from 'vuex'

export default {
  name: 'ArticleDetails',
  components: {
    ArticleComment
  },
  data () {
    return {
      squareUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
      articleInfo: {},
      userName: '',
      userNickName: '',
      commentsList: [],
      // 发表评论对象
      contentObj: {
        content: '',
        artId: this.$route.query.artId
      },
      // 点赞状态
      isLike: null,
      iconfont: 'iconfont',
      icon_xxx: 'icon-good',
      bgc: 'bgc'
    }
  },
  computed: {
    ...mapState(['userAvatar'])
  },
  // 使用 keep-alive 会将数据保留在内存中，如果要在每次进入页面的时候获取最新的数据，需要在 activated 阶段获取数据，承担原来 created 钩子函数中获取数据的任务。
  async created () {
    // 获取文章信息
    const res = await getArticleByIdAPI(this.$route.query.artId)
    this.articleInfo = res.data.data[0]
    // 获取用户信息
    const res2 = await getUserInfoByIdAPI(this.articleInfo.author_id)
    this.userName = res2.data.data[0].user_name
    this.userNickName = res2.data.data[0].user_nickname
    // 获取评论列表
    const res3 = await getCommentsAPI(this.$route.query.artId)
    this.commentsList = res3.data.data
    console.log(res3)
    // 评论数
    if (res3.data.data !== undefined) {
      this.articleInfo.comments = res3.data.data.length
    } else {
      this.articleInfo.comments = 0
    }
  },
  methods: {
    addSuccess () {
      this.$message({
        message: '发表评论成功',
        type: 'success'
      })
    },
    addFail () {
      this.$message({
        message: '发表失败，请填写正确内容哦',
        type: 'warning'
      })
    },
    // 发表评论
    async addComment () {
      if (this.contentObj.content.trim().length > 0) {
        const res = await addCommentAPI(this.contentObj)
        this.addSuccess()
        if (this.commentsList === undefined) {
          // 一开始没有评论
          this.commentsList = []
          this.commentsList.unshift(res.data.data)
          this.articleInfo.comments++
        } else {
          // 如果有评论那就插入到队首进行展示
          this.commentsList.unshift(res.data.data)
          this.articleInfo.comments++
        }
        // 文本域置空
        this.contentObj.content = ''
      } else {
        this.addFail()
      }
    },
    // 文章点赞或取消点赞
    async articleLike (articleActive) {
      if (!articleActive) { // 处于未点赞状态
        await likesAPI(this.$route.query.artId, this.isLike)
        // 点赞完成后视图层+1
        this.articleInfo.likes++
        // 点赞状态改变
        this.isLike = true
      } else { // 处于点赞状态
        await likesAPI(this.$route.query.artId, this.isLike)
        // 点赞完成后视图层-1
        this.articleInfo.likes--
        this.isLike = false
      }
    },
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
}

.details {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  min-height: 600px;
  padding: 20px;
  background-color: rgba(255, 255, 255, .4);
  border-radius: 4px;
}

h2 {
  margin: 15px 0;
  letter-spacing: 3px;
}

p {
  text-indent: 2em;
  font-size: 20px;
  letter-spacing: 3px;
  line-height: 30px;
}

.actions {
  position: absolute;
  bottom: 20px;
}

.iconfont {
  font-size: 22px;
  margin-right: 25px;
}

.iconfont span {
  margin-left: 5px;
  font-size: 16px;
}

.add_comment {
  box-sizing: border-box;
  display: flex;
  margin-top: 20px;
  padding: 10px;
  width: 100%;
  min-height: 90px;
  background-color: rgba(255, 255, 255, .4);
  border-radius: 5px;
}

.add_comment .avatar {
  margin-right: 15px;
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

.add_comment textarea {
  flex: 1;
  padding: 5px;
  font-size: 14px;
  border: none;
  background-color: #fcfcfc;
  border-radius: 5px;
  resize: none;
  outline: none;
}

.add_comment button {
  margin-left: 10px;
  border-radius: 4px;
  outline: none;
  width: 70px;
  height: 64px;
  color: #fff;
  background-color: #00a1d6;
  border: 1px solid #00a1d6;
  font-size: 14px;
}

.add_comment button:hover {
  background-color: #00b5e5;
}

</style>
