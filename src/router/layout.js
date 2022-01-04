import Layout from '@/layout'

const layoutRoutes = [
    //屏幕布局 创建
	{
		path: '/',
		component: Layout,
		meta: {
			title: '屏幕布局'
		},
		children: [{
			path: '/screen/layout/add',
			name: 'Layout--add',
			component: () => import('@/views/screenLayout/components/AddScreenLayout'),
			meta: {
				title: '屏幕布局 - 创建'
			},
		}],
		hidden: true
	},


	//屏幕布局 编辑
	{
		path: '/',
		component: Layout,
		meta: {
			title: '屏幕布局'
		},
		children: [{
			path: '/screen/layout/edit/:id',
			name: 'Layout--edit',
			component: () => import('@/views/screenLayout/components/AddScreenLayout'),
			meta: {
				title: '屏幕布局 - 编辑'
			},
		}],
		hidden: true
	},


	//屏幕布局 详情
	{
		path: '/',
		component: Layout,
		meta: {
			title: '屏幕布局详情'
		},
		children: [{
			path: '/screen/layout/detail/:id',
			name: 'Layout--detail',
			component: () => import('@/views/screenLayout/detail'),
			meta: {
				title: '屏幕布局 - 详情'
			},
		}],
		hidden: true
	}
]

export default layoutRoutes