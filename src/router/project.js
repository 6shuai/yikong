import Layout from '@/layout'

const projectRoutes = [
    // 项目
    {
		path: '/project',
		redirect: '/project/view',
		component: Layout,
		children: [
			{
				path: 'view',
				name: 'Project',
				component: () => import('@/views/project/projectView/projectList'),
				meta: {
					title: '项目管理'
				}
			}
		],
        hidden: true
	},
    {
		path: '/project',
		component: Layout,
		children: [
			{
				path: 'returnMoney',
				name: 'ReturnMoney',
				component: () => import('@/views/project/returnMoney/index'),
				meta: {
					title: '回款处理'
				}
			}
		],
        hidden: true
	},
    {
		path: '/',
		component: Layout,
        meta: {
            title: '项目管理'
        },
		children: [
            {
                path: '/project/:id',
                name: 'Project--detail',
                component: () => import('@/views/project/projectView/detail'),
                children: [
                    {
                        path: '/project/:id',
                        name: 'Project--contract',
                        component: () => import('@/views/project/projectView/info/index'),
                        meta: {
                            title: '项目 - 基本信息'
                        }
                    },
                    {
                        path: 'contract',
                        name: 'Project--contract',
                        component: () => import('@/views/project/projectView/contract/index'),
                        meta: {
                            title: '项目 - 合同'
                        }
                    },
                    {
                        path: 'material',
                        name: 'Project--material',
                        component: () => import('@/views/project/projectView/material/index'),
                        meta: {
                            title: '项目 - 素材管理'
                        }
                    },
                    {
                        path: 'playStatistics',
                        name: 'Project--playStatistics',
                        component: () => import('@/views/project/projectView/playStatistics/index'),
                        meta: {
                            title: '项目 - 监播数据'
                        }
                    },
                    {
                        path: 'finance',
                        name: 'Project--finance',
                        component: () => import('@/views/project/projectView/finance/index'),
                        meta: {
                            title: '项目 - 财务'
                        }
                    },
                    {
                        path: 'member',
                        name: 'Project--member',
                        component: () => import('@/views/project/projectView/member/index'),
                        meta: {
                            title: '项目 - 成员'
                        }
                    },
                    {
                        path: 'locating',
                        name: 'Project--locating',
                        component: () => import('@/views/project/projectView/locating/index'),
                        meta: {
                            title: '项目 - 寻位锁位'
                        }
                    },
                    {
                        path: 'invoiceCenter',
                        name: 'Project--invoiceCenter',
                        component: () => import('@/views/project/projectView/invoiceCenter/index'),
                        meta: {
                            title: '项目 - 发票中心'
                        }
                    }
                ],
                redirect: '/project/contract'
            },
            {
                path: '/invoiceApply',
                name: 'Project--invoiceApply',
                component: () => import('@/views/project/projectView/invoiceCenter/components/InvoiceApply'),
                meta: {
                    title: '项目 - 申请发票'
                }
            },
            {
                path: '/project/:id/locating',
                name: 'Project--locatingss',
                component: () => import('@/views/project/projectView/locating/components/SelectScreen'),
                children: [
                    {
                        path: 'selectScreen',
                        name: 'Project-selectScreen',
                        component: () => import('@/views/project/projectView/locating/components/SelectScreen'),
                        meta: {
                            title: '预选大屏'
                        }
                    }
                ],
                meta: {
                    title: '寻位锁位'
                }
            }
        ],
		hidden: true
	}
]

export default projectRoutes