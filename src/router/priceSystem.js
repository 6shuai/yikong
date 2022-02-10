import Layout from '@/layout'

const priceSystemRoutes = [
    // 屏幕刊例价列表
	{
		path: '/',
		component: Layout,
		meta: {
			title: '屏幕刊例价'
		},
		children: [{
			path: '/priceSystem/:id',
			name: 'PriceSystem--list',
			component: () => import('@/views/priceSystem/screenList'),
			meta: {
				title: '屏幕刊例价'
			}
		}],
		hidden: true
	}
]

export default priceSystemRoutes