<template>
  <div>
    <ArticleItem v-for="obj in articleList" :key="obj.artId" :articleItem="obj"></ArticleItem>
  </div>
</template>

<script>
import ArticleItem from '@/components/ArticleItem'
import { getAllArticlesAPI } from '@/api'

export default {
  name: 'Recommend_article',
  components: {
    ArticleItem
  },
  data () {
    return {
      articleList: []
    }
  },
  async created () {
    const res = await getAllArticlesAPI()
    this.articleList = res.data.data
  },
}
</script>

<style scoped>

</style>
