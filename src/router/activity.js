import Layout from '@/layout'
 
const activityRoutes = [
     //活动管理  新建活动
    {
        path: '/',
        component: Layout,
        meta: { title: '活动管理' },
        children: [
        {
            path: '/activity/add',
            name: 'Activity--add',
            component: () => import('@/views/activity/add'),
            meta: { title: '活动管理 - 创建' },
        }
        ],
        hidden: true
    },

    //活动管理  编辑活动
    {
        path: '/',
        component: Layout,
        meta: { title: '活动管理' },
        children: [
        {
            path: '/activity/edit/:id',
            name: 'Activity--edit',
            component: () => import('@/views/activity/add'),
            meta: { title: '活动管理 - 编辑' },
        }
        ],
        hidden: true
    },

    //活动管理  详情
    {
        path: '/',
        component: Layout,
        meta: { title: '活动管理' },
        children: [
        {
            path: '/activity/detail/:activityId',
            name: 'Activity--detail',
            component: () => import('@/views/activity/details/index'),
            meta: { title: '基本信息' },
            children: [
                {
                    path: 'screen',
                    name: 'Activity--detail-screen',
                    component: () => import('@/views/activity/details/screen'),
                    meta: { title: '屏幕' },
                },
                {
                    path: 'game',
                    name: 'Activity--detail-game',
                    component: () => import('@/views/activity/details/game'),
                    meta: { title: '游戏' },
                },
                {
                    path: 'merchant',
                    name: 'Activity--detail-merchant',
                    component: () => import('@/views/activity/details/merchant'),
                    meta: { title: '商户' },
                },
                {
                    path: 'pond',
                    name: 'Activity--detail-pond',
                    component: () => import('@/views/activity/details/pond'),
                    meta: { title: '奖池' },
                },
                {
                    path: 'limit',
                    name: 'Activity--detail-limit',
                    component: () => import('@/views/activity/details/limit'),
                    meta: { title: '领取限制' },
                },
                {
                    path: 'data',
                    name: 'Activity--detail-data',
                    component: () => import('@/views/activity/details/data'),
                    meta: { title: '数据' },
                }
            ]
        }
        ],
        hidden: true
    },

    //活动管理  新建优惠券
    {
        path: '/',
        component: Layout,
        meta: { title: '活动管理' },
        children: [
        {
            path: '/activity/couponAdd',
            name: 'Activity--addCoupon',
            component: () => import('@/views/activity/coupon/couponAdd'),
            meta: { title: '活动管理 - 创建优惠券' },
        }
        ],
        hidden: true
    },

    //活动管理  编辑优惠券
    {
        path: '/',
        component: Layout,
        meta: { title: '活动管理' },
        children: [
        {
            path: '/activity/couponAdd/:id',
            name: 'Activity--editCoupon',
            component: () => import('@/views/activity/coupon/couponAdd'),
            meta: { title: '活动管理 - 编辑优惠券' },
        }
        ],
        hidden: true
    },

    //活动管理  优惠券列表
    {
        path: '/',
        component: Layout,
        meta: { title: '活动管理' },
        children: [
        {
            path: '/activity/coupon',
            name: 'Activity--coupon',
            component: () => import('@/views/activity/coupon/index'),
            meta: { title: '活动管理 - 优惠券列表' },
        }
        ],
        hidden: true
    },

    //活动管理  优惠券详情
    {
        path: '/',
        component: Layout,
        meta: { title: '活动管理' },
        children: [
        {
            path: '/activity/coupon/:id',
            name: 'Activity--couponDetail',
            component: () => import('@/views/activity/coupon/detail'),
            meta: { title: '活动管理 - 优惠券详情' },
        }
        ],
        hidden: true
    },

    //活动管理  统计数据
    {
        path: '/',
        component: Layout,
        meta: { title: '活动管理' },
        children: [
        {
            path: '/activity/statistics/:id',
            name: 'Activity--statistics',
            component: () => import('@/views/activity/statistics/statistics'),
            meta: { title: '活动管理 - 统计数据' },
        }
        ],
        hidden: true
    },
]

export default activityRoutes