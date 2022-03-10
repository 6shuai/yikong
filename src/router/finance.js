import Layout from '@/layout'

const financeRoutes = [
    {
		path: '/',
		component: Layout,
		children: [{
			path: '/finance',
			name: 'Finance',
			component: () => import('@/views/finance/index'),
            children: [
                {
                    path: 'projectView',
                    name: 'Finance--projectView',
                    component: () => import('@/views/finance/components/ProjectView/index'),
                    meta: {
                        title: '财务权责 - 项目视图'
                    }
                },
                {
                    path: 'contract',
                    name: 'Finance--contract',
                    component: () => import('@/views/finance/components/Contract/index'),
                    meta: {
                        title: '财务权责 - 合同'
                    }
                },
                {
                    path: 'returnMoney',
                    name: 'Finance--returnMoney',
                    component: () => import('@/views/finance/components/ReturnMoney/index'),
                    meta: {
                        title: '财务权责 - 回款'
                    }
                },
                {
                    path: 'invoice',
                    name: 'Finance--invoice',
                    component: () => import('@/views/finance/components/Invoice/index'),
                    meta: {
                        title: '财务权责 - 发票'
                    }
                },
                {
                    path: 'projectAuthority',
                    name: 'Finance--projectAuthority',
                    component: () => import('@/views/finance/components/projectAuthority/index'),
                    meta: {
                        title: '财务权责 - 项目权责'
                    }
                },
                {
                    path: 'employeeCommission',
                    name: 'Finance--employeeCommission',
                    component: () => import('@/views/finance/components/employeeCommission/index'),
                    meta: {
                        title: '财务权责 - 员工提成'  
                    }
                },
                {
                    path: 'commissionSystem',
                    name: 'Finance--commissionSystem',
                    component: () => import('@/views/finance/components/commissionSystem/index'),
                    meta: {
                        title: '财务权责 - 提成体系'  
                    }
                }
            ],
            redirect: '/finance/projectView'
		}],
		hidden: true
	}
]

export default financeRoutes