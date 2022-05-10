import Layout from '@/layout'

const bossRoutes = [
	{
		path: '/',
        component: Layout,
		children: [{
            path: '/boss',
            name: 'Boss',
            component: () => import('@/views/priceSystem/index'),
			meta: {
				title: '价格体系'
			}
		}],
		hidden: true
	}
]

export default bossRoutes