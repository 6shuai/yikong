import Layout from '@/layout'

const merchantRoutes = [
    // 商户管理 - 添加商户
	{
		path: '/',
		component: Layout,
		meta: {
			title: '商户管理'
		},
		children: [{
			path: '/merchant/add',
			name: 'Merchant--add',
			component: () => import('@/views/merchant/MerchantAdd'),
			meta: {
				title: '商户管理 - 添加商户'
			},
		}],
		hidden: true
	},

	// 商户管理 - 编辑商户
	{
		path: '/',
		component: Layout,
		meta: {
			title: '商户管理'
		},
		children: [{
			path: '/merchant/edit/:id',
			name: 'Merchant--edit',
			component: () => import('@/views/merchant/MerchantAdd'),
			meta: {
				title: '商户管理 - 编辑商户'
			},
		}],
		hidden: true
	},

	// 商户管理 - 商户详情
	{
		path: '/',
		component: Layout,
		meta: {
			title: '商户管理'
		},
		children: [{
			path: '/merchant/detail/:id',
			name: 'Merchant--detail',
			component: () => import('@/views/merchant/MerchantDetail'),
			meta: {
				title: '商户管理 - 商户详情'
			},
		}],
		hidden: true
	}
]

export default merchantRoutes