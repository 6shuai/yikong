import Layout from '@/layout'

const bossRoutes = [
	{
		path: '/',
        component: Layout,
		children: [
			{
				path: '/boss',
				redirect: '/priceSystem',
				name: 'Boss',
				component: () => import('@/views/priceSystem/index'),
				meta: {
					title: '价格体系'
				}
			},
			{
				path: '/priceSystem/:id',
				name: 'PriceSystem',
				component: () => import('@/views/priceSystem/screenList'),
				meta: {
					title: '价格体系'
				}
			}
		],
		hidden: true
	}
]

export default bossRoutes