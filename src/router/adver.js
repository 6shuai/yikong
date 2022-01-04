import Layout from '@/layout'

const adverRoutes = [
    //插播广告 创建
	{
		path: '/',
		component: Layout,
		meta: {
			title: '插播广告'
		},
		children: [{
			path: '/cutInAdver/add',
			name: 'CutInAdver--add',
			component: () => import('@/views/cutInAdver/add'),
			meta: {
				title: '插播广告 - 创建'
			},
		}],
		hidden: true
	},

	//插播广告 编辑
	{
		path: '/',
		component: Layout,
		meta: {
			title: '插播广告'
		},
		children: [{
			path: '/cutInAdver/edit/:id',
			name: 'CutInAdver--edit',
			component: () => import('@/views/cutInAdver/add'),
			meta: {
				title: '插播广告 - 编辑'
			},
		}],
		hidden: true
	},


	//插播广告 详情
	{
		path: '/',
		component: Layout,
		meta: {
			title: '插播广告'
		},
		children: [{
			path: '/cutInAdver/:adverId',
			name: 'CutInAdver--detail',
			component: () => import('@/views/cutInAdver/detail'),
			meta: {
				title: '插播广告 - 详情'
			},
		}],
		hidden: true
	}
]

export default adverRoutes