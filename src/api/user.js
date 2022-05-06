import { postKeyValueRequest, get, post, put, del } from '@/utils/request';

//首页登录
export function userLogin(data) { return postKeyValueRequest('/sign_in', data); }

//获取登录验证码
export function getLoginCode(data) { return get('/entry/verifyCode', data); }


//退出登录
export function userLogout(data) { return get('/logout', data); }

//注册
export function userRegister(data) { return post('/entry/register', data); }

//更新用户信息 
export function userUpdate(data) { return put('/user/', data); }

//修改登录密码 
export function userPasswordUpdate(data) { return put('/user/password', data); }


//加载菜单列表
export function getAuthMenu(data) { return get('/user/authority'); }

//权限管理  添加菜单路由权限
export function createdMenuAuth(data) { return post('/system/authority/', data); }

//权限管理  更新编辑菜单路由权限
export function eidtMenuAuth(data) { return put('/system/authority/', data); }

//权限管理  删除菜单路由权限
export function delMenuAuth(data) { return del(`/system/authority/${data}`, data); }

//权限管理  获取权限列表
export function getAuthList(data) { return get('system/authority/', data); }


//角色管理 角色列表
export function getRoleList(data) { return get('/system/role/', data); }

//角色管理 添加角色
export function roleCreated(data) { return post('/system/role/', data); }

//角色管理 更新角色
export function roleUpdate(data) { return put('/system/role/', data); }

//角色管理 删除角色
export function roleDelete(data) { return del(`/system/role/${data}`, data); }


//角色管理   获取所有权限列表
export function roleAllAuthList(data) { return get('/system/role/authority/', data); }

//角色管理   获取当前角色id 权限列表
export function currentRoleAuthList(data) { return get(`/system/role/role_authority/${data}`); }

//角色管理  更新权限
export function roleAuthUpdate(data) { return put(`/system/role/role_authority/${data}`); }


//成员管理  获取所有权限列表 id 获取分组下的成员
export function groupMemberList(data) { return get(`/system/member/${data}`); }

//成员管理   获取所有角色  data是一个数字，表示自己的组织类型
export function getAllRoleList(data) { return get(`/system/member/roles/${data}`); }

//成员管理   添加成员
export function memberCreated(data) { return post(`/system/member/?oid=${data.oid}&uid=${data.uid}`); }

//成员管理   移除成员
export function memberDelete(data) { return del(`/system/member/?oid=${data.oid}&uid=${data.uid}`); }

//成员管理   搜索用户
export function memberSearch(data) { return get(`/system/member/search_user/${data}`,); }

//成员管理   查询自己的组织  获取组织id去查询组织下的成员
export function organizationSearchId(data) { return get(`/system/member/organization/${data}`); }

//成员管理   新建组织 
export function organizationCreated(data) { return post('/system/member/organization/', data); }

//成员管理   获取组织类型 
export function organizationType(data) { return get(`/public/organization_type/${data}`); }

//成员管理   删除组织
export function organizationDelete(data) { return del(`/system/member/organization/?id=${data}`,); }

//成员管理   更新用户主页
export function memberHomePageUpdate(data) { return put(`/system/member/homePage${data}`,); }



//查询所有的 品牌
export function organizationList(data) { return get('/public/brand', data); }

//查询所有的组织 
export function organizationListProject(data) { return get('/public/organization', data); }


//品牌管理  列表
export function brandOrganizationList(data) { return get('/system/member/organizationForPage', data); }

//品牌管理  查看品牌详情
export function brandOrganizationDetail(data) { return get('/system/member/organizationDetail', data); }

//品牌管理  编辑修改品牌
export function brandOrganizationEdit(data) { return put('system/member/organization/', data); }


//组织类型  列表
export function organizationTypeList(data) { return get('/organizationType/', data); }

//组织类型  添加 或 修改
export function organizationTypeCreated(data) { return post('/organizationType/', data); }

//组织类型  删除
export function organizationTypeDelete(data) { return del(`/organizationType/${data}`); }



//群管理    列表
export function groupList(data) { return get('/group/', data); }

//群管理    删除
export function groupDelete(data) { return del(`/group/${data}`); }

//群管理    创建
export function groupCreated(data) { return post('/group/', data); }




//主页管理    创建 或 编辑
export function homePageCreate(data) { return post('/homePage/', data); }

//主页管理    角色列表
export function homePageRoleList(data) { return get('/homePage/role', data); }

//主页管理    更新主页绑定的角色
export function homePageRoleUpdate(data) { return put(`/homePage/role${data}`); }