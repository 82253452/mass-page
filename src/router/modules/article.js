/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const busiRouter = {
  path: '/article',
  component: Layout,
  redirect: 'noredirect',
  name: 'data',
  meta: {
    title: '编辑',
    icon: 'component',
    roles: ['article']
  },
  children: [
    {
      path: 'busiArticle/wxmpList',
      component: () => import('@/busi/wxmpList'),
      name: 'wxmpList',
      meta: { title: '文章流' }
    }
  ]
}

export default busiRouter
