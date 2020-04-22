import axios from 'axios';
import { MessageBox, Message } from 'element-ui';
import qs from 'qs';

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
			if (res.code == 504 || res.code == 404) {
				Message.error({message: '服务器被吃了( ╯□╰ )'})
			} else if (res.code == 403) {
				Message.error({message: '权限不足，请联系管理员'})
			} else if (res.code == 401) {
				Message.error({message: '尚未登录，请登录'})
				router.replace('/');
			} else {
				Message.error({message: res.message});
			}

			if (res.code == 4) {
				// 登录过期
				MessageBox.confirm(
					'You have been logged out, you can cancel to stay on this page, or log in again',
					'Confirm logout',
					{
						confirmButtonText: 'Re-Login',
						cancelButtonText: 'Cancel',
						type: 'warning'
					}
				).then(() => {

				});
			}
			// return new Promise(() => {});
			return res
		} else {
			return res;
		}
	},
	(error) => {
		console.log(error)
		Message({
			message: error.message,
			type: 'error',
			duration: 3000
		});
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

