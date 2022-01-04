import Layout from '@/layout'

const timelineRoutes = [
    //时间轴  创建
	{
		path: '/',
		component: Layout,
		meta: {
			title: '时间轴'
		},
		children: [{
			path: '/timeline/add',
			name: 'Timeline--add',
			component: () => import('@/views/timeline/timelineAdd'),
			meta: {
				title: '创建时间轴'
			}
		}],
		hidden: true
	},

	//时间轴  编辑
	{
		path: '/',
		component: Layout,
		meta: {
			title: '时间轴'
		},
		children: [{
			path: '/timeline/edit/:id',
			name: 'Timeline--edit',
			component: () => import('@/views/timeline/timelineAdd'),
			meta: {
				title: '编辑时间轴'
			}
		}],
		hidden: true
	},

	//时间轴  详情
	{
		path: '/timeline/details/:id',
		name: 'Timeline--details',
		component: () => import('@/views/timeline/timelineDetails'),
		meta: {
			title: '时间轴详情'
		},
		hidden: true
	}
]

export default timelineRoutes