// 素材内容类型
export const contentTypeList = [
    { id: 4, name: '图集' },
    { id: 2, name: '视频' },
    { id: 1, name: '图片' },
    { id: 3, name: '游戏' }
]

// 根据素材id 获取素材类型
export const findContentType = (id) => {
    let data = contentTypeList.find(item => item.id == id )
    return data.name
}

// 角色对应的主页
export const roleHome = {
    '/project': [
        // {
        //     displayName: '项目管理',
        //     moduleName: 'Project',
        //     route: '/project/view'
        // },
        // {
        //     displayName: '回款处理',
        //     moduleName: 'ReturnMoney',
        //     route: '/project/returnMoney'
        // }
    ],
    '/finance': [ 
        {
            displayName: '财务管理',
            moduleName: 'Finance',
            route: '/finance'
        }
    ],
    '/operation': [
        {
            displayName: '播放管理',
            moduleName: 'ContentManage',
            route: '/operation/contentManage'
        },
        // {
        //     displayName: '监播统计',
        //     moduleName: 'PlayStatistics',
        //     route: '/operation/playStatistics'
        // },
        // {
        //     displayName: '素材审核',
        //     moduleName: 'MaterialAudit',
        //     route: '/materialAudit'
        // }
    ],
    '/boss': [],
    '/place/index': [],
}

