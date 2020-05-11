/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const busiRouter = {
  path: '/article',
  component: Layout,
  redirect: 'noredirect',
  name: 'data',
  meta: {
    title: '公众号文章',
    icon: 'component',
    roles: ['admin', 'user']
  },
  children: [
    // {
    //   path: 'busiArticle/pending',
    //   component: () => import('@/busi/busiArticlePending'),
    //   name: 'busiArticle1',
    //   meta: { title: '待审核数据' }
    // },
    {
      path: 'busiArticle/audited',
      component: () => import('@/busi/busiArticleAudited'),
      name: 'busiArticle2',
      meta: { title: '已采集数据' }
    },
    {
      path: 'busiArticle/pushed',
      component: () => import('@/busi/busiArticlePushed'),
      name: 'busiArticle3',
      meta: { title: '已发布数据' }
    }
  ]
}

export default busiRouter
