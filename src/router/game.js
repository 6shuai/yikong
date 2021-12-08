import Layout from '@/layout'

const gameRoutes = [
    //游戏管理  创建
    {
        path: '/',
        component: Layout,
        meta: { title: '游戏管理' },
        children: [{
            path: '/games/add',
            name: 'Games--add',
            component: () => import('@/views/games/gameAdd'),
            meta: { title: '创建游戏' },
        }],
        hidden: true
    },

    //游戏管理  编辑
    {
        path: '/',
        component: Layout,
        meta: { title: '游戏管理' },
        children: [{
            path: '/games/edit/:id',
            name: 'Games--edit',
            component: () => import('@/views/games/gameAdd'),
            meta: { title: '编辑游戏' },
        }],
        hidden: true
    },

    //游戏管理  详情
    {
        path: '/',
        component: Layout,
        meta: { title: '游戏管理' },
        children: [
            {
                path: '/games/details/:id',
                name: 'Games--details',
                component: () => import('@/views/games/details/index'),
                meta: { title: '游戏信息' },
                children: [
                    {
                        path: 'package',
                        name: 'Games--details-package',
                        component: () => import('@/views/games/details/package'),
                        meta: { title: '包管理' }
                    },
                    {
                        path: 'list',
                        name: 'Games--details-list',
                        component: () => import('@/views/games/details/gameList'),
                        meta: { title: '游戏列表' }
                    }
                ]
            },
            {
                path: '/games/details/:id/gameData/:gameId',
                name: 'Games--details-data-edit',
                component: () => import('@/views/games/details/gameData'),
                meta: { title: '编辑游戏' },
                children: [
                    {
                        path: 'adver/:adverId',
                        name: 'Games--details-data-adver',
                        component: () => import('@/views/cutInAdver/detail'),
                        meta: { title: '插播广告' },
                    },
                    {
                        path: 'rank',
                        name: 'Games--details-rank',
                        component: () => import('@/views/games/details/rankTemp'),
                        meta: { title: '排行榜管理' }
                    },
                    {
                        path: 'activity/:activityId',
                        name: 'Games--details-data-activity',
                        component: () => import('@/views/activity/details/index'),
                        meta: { title: '活动' },
                        children: [
                            {
                                path: 'screen',
                                name: 'Games--details-data-screen',
                                component: () => import('@/views/activity/details/screen'),
                                meta: { title: '屏幕' },
                            },
                            {
                                path: 'game',
                                name: 'Games--details-data-game',
                                component: () => import('@/views/activity/details/game'),
                                meta: { title: '游戏' },
                            },
                            {
                                path: 'merchant',
                                name: 'Games--details-data-merchant',
                                component: () => import('@/views/activity/details/merchant'),
                                meta: { title: '商户' },
                            },
                            {
                                path: 'pond',
                                name: 'Games--details-data-pond',
                                component: () => import('@/views/activity/details/pond'),
                                meta: { title: '奖池' },
                            },
                            {
                                path: 'limit',
                                name: 'Games--details-data-limit',
                                component: () => import('@/views/activity/details/limit'),
                                meta: { title: '领取限制' },
                            },
                            {
                                path: 'data',
                                name: 'Games--details-data-data',
                                component: () => import('@/views/activity/details/data'),
                                meta: { title: '数据' },
                            }
                        ]
                    },
                ]
            },
            {
                path: '/games/details/:id/gameData',
                name: 'Games--details-data-add',
                component: () => import('@/views/games/details/gameData'),
                meta: { title: '添加游戏' }
            },
        ],
        hidden: true
    },
]

export default gameRoutes