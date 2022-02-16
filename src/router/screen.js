import Layout from '@/layout'

const screenRoutes = [
    //屏幕管理  创建大屏
	{
		path: '/',
		component: Layout,
		meta: {
			title: '屏幕管理'
		},
		children: [{
			path: '/screen/add',
			name: 'Screen--add',
			component: () => import('@/views/screen/screenAdd'),
			meta: {
				title: '创建屏幕'
			}
		}],
		hidden: true
	},

	//屏幕管理  编辑大屏
	{
		path: '/',
		component: Layout,
		meta: {
			title: '屏幕管理'
		},
		children: [{
			path: '/screen/edit/:id',
			name: 'Screen--edit',
			component: () => import('@/views/screen/screenAdd'),
			meta: {
				title: '编辑屏幕'
			}
		}],
		hidden: true
	},

	//屏幕管理  详情页
	{
		path: '/',
		component: Layout,
		children: [{
			path: '/screen/details/:id',
			name: 'Screen--details',
			component: () => import('@/views/screen/screenDetails'),
			meta: {
				title: '屏幕详情'
			},
            children: [
				{
					path: 'timeSeries',
					name: 'Screen--details--timeSeries',
					meta: {
						title: '监播数据(时序)'
					},
					component: () => import('@/views/screen/statistics/timeSeries')
				},
				{
					path: 'statistics',
					name: 'Screen--details--statistics',
					meta: {
						title: '监播数据(统计)'
					},
					component: () => import('@/views/screen/statistics/statistics')
				},
				{
					path: 'timeline',
					name: 'Screen--details--timeline',
					meta: {
						title: '时间轴数据'
					},
					component: () => import('@/views/screen/statistics/timelineData')
				}
			]
		}],
		hidden: true
	},

	//屏幕管理  探针数据
	{
		path: '/',
		component: Layout,
		children: [{
			path: '/screen/probeData/:id',
			name: 'Screen--probeData',
			component: () => import('@/views/screen/probeData'),
			meta: {
				title: '探针数据'
			}
		}],
		hidden: true
	}
]

export default screenRoutes