import Layout from '@/layout'

const projectRoutes = [
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
                    {
                        path: 'invoiceCenter',
                        name: 'Project--invoiceCenter',
                        component: () => import('@/views/project/invoiceCenter/index'),
                        meta: {
                            title: '项目详情 - 发票中心'
                        }
                    }
                ],
                redirect: '/project/contract'
            },
            {
                path: '/invoiceApply',
                name: 'InvoiceApply',
                component: () => import('@/views/project/invoiceCenter/components/InvoiceApply'),
                meta: {
                    title: '申请发票'
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