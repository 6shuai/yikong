import Layout from '@/layout'

const homeRoutes = [
    {
		path: '/',
		component: Layout,
		children: [{
			path: '/project/:id',
			name: 'Project--detail',
			component: () => import('@/views/home/detail'),
            children: [
                {
                    path: '/project/:id',
                    name: 'Project--contract',
                    component: () => import('@/views/home/info'),
                    meta: {
                        title: '项目详情 - 基本信息'
                    }
                },
                {
                    path: 'contract',
                    name: 'Project--contract',
                    component: () => import('@/views/home/contract'),
                    meta: {
                        title: '项目详情 - 合同'
                    }
                },
                {
                    path: 'material',
                    name: 'Project--material',
                    component: () => import('@/views/home/material'),
                    meta: {
                        title: '项目详情 - 物料'
                    }
                },
                {
                    path: 'finance',
                    name: 'Project--finance',
                    component: () => import('@/views/home/finance'),
                    meta: {
                        title: '项目详情 - 财务'
                    }
                },
                {
                    path: 'member',
                    name: 'Project--member',
                    component: () => import('@/views/home/member'),
                    meta: {
                        title: '项目详情 - 成员'
                    }
                },
            ],
            redirect: '/project/contract'
		}],
		hidden: true
	}
]

export default homeRoutes