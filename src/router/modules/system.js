/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const busiRouter = {
  path: '/system',
  component: Layout,
  redirect: 'noredirect',
  name: 'weapp',
  meta: {
    title: '系统管理',
    icon: 'component',
    roles: ['admin']
  },
  children: [
    {
      path: 'sysUserRole',
      component: () => import('@/busi/sysUserRole'),
      name: 'sysUserRole',
      meta: { title: '用户管理' }
    }
  ]
}

export default busiRouter
