import Layout from '@/layout'

const placeRoutes = [
    //场所管理  创建场所
	{
		path: '/',
		component: Layout,
		meta: {
			title: '场所管理'
		},
		children: [{
			path: '/place/add',
			name: 'Place--add',
			component: () => import('@/views/place/PlaceAdd'),
			meta: {
				title: '创建场所'
			}
		}],
		hidden: true
	},

	//场所管理  编辑场所
	{
		path: '/',
		component: Layout,
		meta: {
			title: '场所管理'
		},
		children: [{
			path: '/place/edit/:id',
			name: 'Place--edit',
			component: () => import('@/views/place/PlaceAdd'),
			meta: {
				title: '编辑场所'
			}
		}],
		hidden: true
	},

	//场所管理  详情页
	{
		path: '/',
		component: Layout,
		children: [{
			path: '/place/details/:id',
			name: 'Place--details',
			component: () => import('@/views/place/PlaceDetails'),
			meta: {
				title: '场所详情'
			}
		}],
		hidden: true
	}
]

export default placeRoutes