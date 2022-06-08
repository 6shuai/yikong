import Layout from '@/layout'

const operationRoutes = [
    // 内容管理
	{
		path: '/operation',
		redirect: '/operation/contentManage',
		component: Layout,
		children: [
			{
				path: 'contentManage',
				name: 'ContentManage',
				component: () => import('@/views/operation/contentManage/index'),
				meta: {
					title: '内容管理'
				}
			}
		],
		hidden: true
	},

	{
		path: '/operation',
		component: Layout,
		children: [
			{
				path: 'screenLayout',
				name: 'ContentManage--screenLayout',
				component: () => import('@/views/operation/contentManage/screenLayout'),
				meta: {
					title: '配置屏幕布局'
				}
			}
		],
		hidden: true
	},

	{
		path: '/operation',
		component: Layout,
		children: [
			{
				path: 'lockPosition',
				name: 'ContentManage--lockPosition',
				component: () => import('@/views/operation/contentManage/lockPosition'),
				meta: {
					title: '配置屏幕时长'
				}
			}
		],
		hidden: true
	},

	// 监播统计
	{
		path: '/operation',
		component: Layout,
		children: [
			{
				path: 'playStatistics',
				name: 'PlayStatistics',
				component: () => import('@/views/operation/playStatistics/index'),
				meta: {
					title: '监播统计'
				}
			}
		],
		hidden: true
	},

    // 素材投放 审核
	{
		path: '/',
		component: Layout,
		children: [{
			path: '/materialAudit',
			name: 'MaterialAudit',
			component: () => import('@/views/materialAudit/index'),
			meta: {
				title: '素材投放审核'
			}
		}],
		hidden: true
	},

    // 素材投放 项目视图 -> 素材列表
	{
		path: '/',
		component: Layout,
		children: [{
			path: '/materialAudit/list',
			name: 'MaterialAudit--list',
			component: () => import('@/views/materialAudit/components/materialList'),
			meta: {
				title: '素材投放列表'
			}
		}],
		hidden: true
	},
]

export default operationRoutes