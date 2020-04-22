import { postKeyValueRequest, get, post, put, del } from '@/utils/request';

//首页登录
export function userLogin(data) { return postKeyValueRequest('/sign_in', data); }

//退出登录
export function userLogout(data) { return get('/logout', data); }

//注册
export function userRegister(data) { return post('/entry/register', data); }

//更新用户信息 
export function userUpdate(data) { return put('/user/', data); }

//加载菜单列表
export function getAuthMenu(data) { return get('/user/authority', data); }

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

//成员管理   获取所有角色
export function getAllRoleList(data) { return get('/system/member/roles/', data); }

//成员管理   添加成员
export function memberCreated(data) { return post(`/system/member/?oid=${data.oid}&uid=${data.uid}`); }

//成员管理   移除成员
export function memberDelete(data) { return del(`/system/member/?oid=${data.oid}&uid=${data.uid}`); }

//成员管理   搜索用户
export function memberSearch(data) { return get(`/system/member/search_user/${data}`,); }

//成员管理   更新成员拥有的角色
export function memberRoleUpdate(data) { return put(`/system/member/role${data}`); }


//组织列表   新建组织
export function organizationCreated(data) { return post('/system/member/organization/', data); }

//组织列表   删除组织
export function organizationDelete(data) { return del(`/system/member/organization/${data}`,); }



