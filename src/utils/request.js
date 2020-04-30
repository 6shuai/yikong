import axios from 'axios';
import { MessageBox, Message } from 'element-ui';
import qs from 'qs';
import store from '../store';
import router from '@/router';

const ajaxUrl = process.env.NODE_ENV === 'development'
	? '/' : `${document.location.origin}/`;   
axios.defaults.timeout = 60000;   
axios.defaults.baseURL = ajaxUrl;    //设置请求域名 
axios.defaults.withCredentials = true;  //携带cookie

// request i
axios.interceptors.request.use(
	(config) => {
		// config.headers = {
		// 	'Content-Type': 'application/x-www-form-urlencoded'
		// };

		return config;
	},
	(error) => {
		console.log(error); // for debug
		return Promise.reject(error);
	}
);

axios.interceptors.response.use(
	(response) => {
		const res = response.data;

		if (res.code !== 0) {
			Message.closeAll()
			//4 账号的时效期 过期
			//103 无权限访问 先做退出登录
			if(res.code === 4 || res.code === 103){
				store.dispatch('user/logout').then(() => {
					location.reload() // 为了重新实例化vue-router对象 避免bug
				})
			}else{
				Message.error({message: res.message});
			}

			
			// return new Promise(() => {});
			return res
		} else {
			return res;
		}
	},
	(error) => {
		Message.closeAll();
		switch (error.response.status) {
			case 504:
			case 404:
				Message.error({message: '服务器被吃了( ╯□╰ )'});
				break;
			case 403:
				Message.error({
					message: '权限不足，请联系管理员',
					onClose: () => {
						router.push({ path: '/home' })
					}
				});
				
				break;
			case 401:
				Message.error({message: '尚未登录，请登录'});
				router.push({ path: '/login' })
				break;
			default:
				Message.error({message: 'error'});
				break;
		}
		return Promise.reject(error);
	}
);

/**
 * get 请求方法
 * @param url
 * @param params
 * @returns {Promise}
 */
export function get(url, params = {}) {
    return new Promise((resolve, reject) => {
        axios.get(url, {
            params: params
        })
		.then(response => {
			resolve(response);
		})
		.catch(err => {
			reject(err)
		})
    })
}

/**
 * post 请求方法
 * @param url
 * @param data
 * @returns {Promise}
 */
export function post(url, data = {}) {
    return new Promise((resolve, reject) => {
        axios.post(url, data)
            .then(response => {
                resolve(response);
            }, err => {
                reject(err);
            })
    })
}

/**
 * postKeyValueRequest 请求方法
 * @param url
 * @param data
 * @returns {Promise}
 */
export function postKeyValueRequest(url, data = {}) {
    return new Promise((resolve, reject) => {
        axios.post(url, qs.stringify(data), {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		})
            .then(response => {
                resolve(response);
            }, err => {
                reject(err);
            })
    })
}



/**
 * delete 请求方法
 * @param url
 * @param data
 * @returns {Promise}
 */
export function del(url, data = {}) {
    return new Promise((resolve, reject) => {
        axios.delete(url, {data:qs.stringify(data)})
        .then(response => {
            resolve(response);
        }, err => {
            reject(err);
        })
    })
}

/**
 * patch 方法封装
 * @param url
 * @param data
 * @returns {Promise}
 */
export function patch(url, data = {}) {
    return new Promise((resolve, reject) => {
        axios.patch(url, data)
            .then(response => {
                resolve(response);
            }, err => {
                reject(err);
            })
    })
}

/**
 * put 方法封装
 * @param url
 * @param data
 * @returns {Promise}
 */
export function put(url, data = {}) {
    return new Promise((resolve, reject) => {
        axios.put(url, data)
            .then(response => {
                resolve(response);
            }, err => {
                reject(err);
            })
    })
}
