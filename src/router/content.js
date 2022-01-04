import Layout from '@/layout'

const contentRoutes = [
    //内容管理  创建内容
	{
		path: '/',
		component: Layout,
		meta: {
			title: '内容管理'
		},
		children: [{
			path: '/content/add',
			name: 'Content--add',
			component: () => import('@/views/content/contentAdd'),
			meta: {
				title: '创建内容'
			}
		}],
		hidden: true
	},

	//内容管理  编辑内容
	{
		path: '/',
		component: Layout,
		meta: {
			title: '内容管理'
		},
		children: [{
			path: '/content/edit/:id',
			name: 'Content--edit',
			component: () => import('@/views/content/contentAdd'),
			meta: {
				title: '编辑内容'
			}
		}],
		hidden: true
	},

	//内容管理  内容详情
	{
		path: '/',
		component: Layout,
		meta: {
			title: '内容管理'
		},
		children: [{
			path: '/content/details/:id',
			name: 'Content--details',
			component: () => import('@/views/content/contentDetails'),
			meta: {
				title: '基本信息'
			},
			children: [
				{
					path: 'count',
					name: 'Content--details--count',
					meta: {
						title: '次数统计'
					},
					component: () => import('@/views/content/statistics/count')
				},
				{
					path: 'time',
					name: 'Content--details--time',
					meta: {
						title: '时间统计'
					},
					component: () => import('@/views/content/statistics/time')
				}
			]
		}],
		hidden: true
	}
]

export default contentRoutes