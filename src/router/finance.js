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
                    component: () => import('@/views/finance/projectView/index'),
                    meta: {
                        title: '财务 - 项目视图'
                    }
                },
                {
                    path: 'contract',
                    name: 'Finance--contract',
                    component: () => import('@/views/finance/contract/index'),
                    meta: {
                        title: '财务 - 合同'
                    }
                },
                {
                    path: 'returnMoney',
                    name: 'Finance--returnMoney',
                    component: () => import('@/views/finance/returnMoney/index'),
                    meta: {
                        title: '财务 - 回款'
                    }
                },
                {
                    path: 'invoice',
                    name: 'Finance--invoice',
                    component: () => import('@/views/finance/invoice/index'),
                    meta: {
                        title: '财务 - 发票'
                    }
                },
                {
                    path: 'projectAuthority',
                    name: 'Finance--projectAuthority',
                    component: () => import('@/views/finance/projectAuthority/index'),
                    meta: {
                        title: '财务 - 项目权责'
                    }
                },
                {
                    path: 'employeeCommission',
                    name: 'Finance--employeeCommission',
                    component: () => import('@/views/finance/employeeCommission/index'),
                    meta: {
                        title: '财务 - 员工提成'  
                    }
                },
                {
                    path: 'commissionSystem',
                    name: 'Finance--commissionSystem',
                    component: () => import('@/views/finance/commissionSystem/index'),
                    meta: {
                        title: '财务 - 提成体系'  
                    }
                },
                {
                    path: 'invoiceCenter',
                    name: 'Finance--invoiceCenter',
                    component: () => import('@/views/finance/invoiceCenter/index'),
                    meta: {
                        title: '财务 - 发票中心'  
                    }
                },
                {
                    path: 'contractApproval',
                    name: 'Finance--contractApproval',
                    component: () => import('@/views/contractApproval/index'),
                    meta: {
                        title: '财务 - 合同审核'
                    }
                },
            ],
            redirect: '/finance/projectView'
		}],
		hidden: true
	}
]

export default financeRoutes