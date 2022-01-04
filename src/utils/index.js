/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
	if (arguments.length === 0) {
		return null
	}
	const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
	let date
	if (typeof time === 'object') {
		date = time
	} else {
		if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
			time = parseInt(time)
		}
		if ((typeof time === 'number') && (time.toString().length === 10)) {
			time = time * 1000
		}
		date = new Date(time)
	}
	const formatObj = {
		y: date.getFullYear(),
		m: date.getMonth() + 1,
		d: date.getDate(),
		h: date.getHours(),
		i: date.getMinutes(),
		s: date.getSeconds(),
		a: date.getDay()
	}
	const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
		const value = formatObj[key]
		// Note: getDay() returns 0 on Sunday
		if (key === 'a') {
			return ['日', '一', '二', '三', '四', '五', '六'][value]
		}
		return value.toString().padStart(2, '0')
	})
	return time_str
}

/**
 * @param {number} time
 * @param {string} type
 * @returns {string}
 */
export function formatTime(time, type) {
	var date = new Date(time);    //时间戳为10位需*1000，时间戳为13位的话不需乘1000
	var Y = date.getFullYear() + '-';
	var M = addZero(date.getMonth()+1) + '-';
	var D = addZero(date.getDate()) + ' ';
	var h = addZero(date.getHours()) + ':';
	var m = addZero(date.getMinutes()) + ':';
	var s = addZero(date.getSeconds());
	if(type === 'time'){
		return h + m + s;
	}else if(type === 'date'){
		return Y + M + D
	}else{  
		return Y + M + D + h + m + s
	}
}

//低于10 前面加0
function addZero(data){
	return data < 10 ? '0' + data : data
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
	const search = url.split('?')[1]
	if (!search) {
		return {}
	}
	return JSON.parse(
		'{"' +
		decodeURIComponent(search)
		.replace(/"/g, '\\"')
		.replace(/&/g, '","')
		.replace(/=/g, '":"')
		.replace(/\+/g, ' ') +
		'"}'
	)
}

export const ajaxUrl = process.env.NODE_ENV === 'development' ?
	'/' : `${document.location.origin}/`;

//上传路径
export const uploadUrl = 'common/upload/';

//上传游戏包路径 
export const uploadGamePackage = '/common/uploadApplicationPackage';

//获取登录验证码
export const getLoginCode = 'entry/verifyCode';