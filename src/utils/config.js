// 物料内容类型
export const contentTypeList = [
    { id: 4, name: '图集' },
    { id: 2, name: '视频' },
    { id: 1, name: '图片' },
    { id: 3, name: '游戏' }
]

// 根据物料id 获取物料类型
export const findContentType = (id) => {
    let data = contentTypeList.find(item => item.id == id )
    return data.name
}