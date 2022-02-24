import Layout from '@/layout'

const projectRoutes = [
    {
		path: '/',
		component: Layout,
		children: [{
			path: '/project/:id',
			name: 'Project--detail',
			component: () => import('@/views/project/detail'),
            children: [
                {
                    path: '/project/:id',
                    name: 'Project--contract',
                    component: () => import('@/views/project/info'),
                    meta: {
                        title: '项目详情 - 基本信息'
                    }
                },
                {
                    path: 'contract',
                    name: 'Project--contract',
                    component: () => import('@/views/project/contract'),
                    meta: {
                        title: '项目详情 - 合同'
                    }
                },
                {
                    path: 'material',
                    name: 'Project--material',
                    component: () => import('@/views/project/material'),
                    meta: {
                        title: '项目详情 - 物料'
                    }
                },
                {
                    path: 'finance',
                    name: 'Project--finance',
                    component: () => import('@/views/project/finance'),
                    meta: {
                        title: '项目详情 - 财务'
                    }
                },
                {
                    path: 'member',
                    name: 'Project--member',
                    component: () => import('@/views/project/member'),
                    meta: {
                        title: '项目详情 - 成员'
                    }
                },
                {
                    path: 'locating',
                    name: 'Project--locating',
                    component: () => import('@/views/project/lockPositionList'),
                    meta: {
                        title: '项目详情 - 寻位锁位'
                    }
                },
            ],
            redirect: '/project/contract'
		}],
		hidden: true
	}
]

export default projectRoutes