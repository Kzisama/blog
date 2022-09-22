<template>
  <div>
    <el-empty description="空空如也" v-if="myArticleList.length===0"></el-empty>
    <!--  我的全部文章  -->
    <ArticleItem v-for="obj in myArticleList" :key="obj.artId" :articleItem="obj"></ArticleItem>
  </div>
</template>

<script>
import ArticleItem from '@/components/ArticleItem'
import { myArticlesAPI } from '@/api'

export default {
  name: 'All_articles',
  components:{
    ArticleItem
  },
  data(){
    return {
      myArticleList:[]
    }
  },
  async created () {
    const res = await myArticlesAPI()
    this.myArticleList = res.data.data
  }
}
</script>

<style scoped>
.el-empty {
  background-color: rgba(255,255,255,.4);
}

</style>
