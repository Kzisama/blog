import Vue from 'vue'
import VueRouter from 'vue-router'
// import Reg_login from '@/views/Reg_login'
// import HomePage from '@/views/Home/HomePage'
// import All_articles from '@/views/Article/All_articles'
// import Add_article from '@/views/Article/Add_article'
// import UserInfo from '@/views/UserManage/UserInfo'
// import UserPwd from '@/views/UserManage/UserPwd'
import { getToken } from '@/untils/token'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/reg_login'
  },
  {
    path: '/reg_login',
    name: 'Reg_login',
    component: () => import(/* webpackChunkName: "Reg_login" */ '@/views/Reg_login'),
  },
  {
    path: '/home',
    name: 'HomePage',
    redirect: '/home/recommend_articles',
    component: () => import(/* webpackChunkName: "HomePage" */ '@/views/Home/HomePage'),
    // component: HomePage,
    children: [
      {
        path: 'recommend_articles',
        name: 'RecommendArticles',
        component: () => import(/* webpackChunkName: "Articles" */ '@/views/Article/Recommend_articles')
      },
      {
        path: 'all_articles',
        name: 'AllArticles',
        component: () => import(/* webpackChunkName: "Articles" */ '@/views/Article/All_articles'),
        // component: All_articles
      },
      {
        path: 'add_article',
        name: 'AddArticle',
        component: () => import(/* webpackChunkName: "Articles" */ '@/views/Article/Add_article'),
        // component: Add_article
      },
      {
        path: 'article_details',
        name: 'ArticleDetails',
        component: () => import(/* webpackChunkName: "ArticlesDetails" */ '@/components/ArticleDetails')
      },
      {
        path: 'user_info',
        name: 'UserInfo',
        component: () => import(/* webpackChunkName: "UserManage" */ '@/views/UserManage/UserInfo'),
        // component: UserInfo
      },
      {
        path: 'user_pwd',
        name: 'UserPwd',
        component: () => import(/* webpackChunkName: "UserManage" */ '@/views/UserManage/UserPwd'),
        // component: UserPwd
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

// 全局前置路由守卫
router.beforeEach((to, from, next) => {
  const token = getToken()
  if (to.name !== 'Reg_login' && !token) {
    next({ name: 'Reg_login' })
  } else if (to.name === 'Reg_login' && token) {
    next({ name: 'HomePage' })
  } else next()
})

export default router
