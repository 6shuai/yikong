import Layout from '@/layout'

const projectRoutes = [
    // 项目
	{
		path: '/',
		component: Layout,
		children: [{
			path: '/project',
			name: 'Project',
            redirect: '/project/view',
			component: () => import('@/views/project/index'),
			meta: {
                title: '项目管理',
                icon: 'home'
            },
            children: [
                {
                    path: 'view',
                    name: 'Projcet--view',
                    component: () => import('@/views/project/projectView/projectList'),
                    meta: { title: '项目视图' }
                },
                {
                    path: 'returnMoney',
                    name: 'Projcet--returnMoney',
                    component: () => import('@/views/project/returnMoney/index'),
                    meta: { title: '回款列表' }
                }
            ],

            hidden: true
		}]
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
                            title: '项目 - 物料管理'
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
	},

    // 物料投放 审核
	{
		path: '/',
		component: Layout,
		children: [{
			path: '/materialAudit',
			name: 'MaterialAudit',
			component: () => import('@/views/materialAudit/index'),
			meta: {
				title: '物料投放审核'
			}
		}],
		hidden: true
	},

    // 物料投放 项目视图 -> 物料列表
	{
		path: '/',
		component: Layout,
		children: [{
			path: '/materialAudit/list',
			name: 'MaterialAudit--list',
			component: () => import('@/views/materialAudit/components/materialList'),
			meta: {
				title: '物料投放列表'
			}
		}],
		hidden: true
	},
]

export default projectRoutes