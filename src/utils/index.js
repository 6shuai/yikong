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
	let date = new Date(time); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
	let Y = date.getFullYear();
	let M = '-' + addZero(date.getMonth() + 1) + '-';
	let D = addZero(date.getDate());
	let h = ' ' + addZero(date.getHours()) + ':';
	let m = addZero(date.getMinutes()) + ':';
	let s = addZero(date.getSeconds());
	let result = '';
	switch (type) {
		case 'year': 
			result = Y;
			break;
		case 'time':
			result = h + m + s;
			break;
		case 'date':
			result = Y + M + D
			break;
		default:
			result = Y + M + D + h + m + s
			break;
	}
	return result
}

//低于10 前面加0
function addZero(data) {
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


//  yyyy-MM-dd 日期 后面加上 HH:mm:ss  00:00:00
export function dateAddHMS(date) {
	if (!date) return
	if (date.indexOf('00:00:00') > -1) {
		return date.split(' 00:00:00')[0]
	} else {
		return date + ' 00:00:00'
	}
}

// 时间里是否包含 1970-01-01  有就删除  没有就添加
export function findTimeHasYtd(data){
	let fixedValue = '1970-01-01 '
	if(!data) return 
	if(data.indexOf(fixedValue) > -1){
		return data.split(fixedValue)[1]
	}else{
		return fixedValue + data
	}
}


//小数点精准计算
export const accMul = function (arg1 = 0, arg2 = 0) {
	let m = 0,
		s1 = arg1.toString(),
		s2 = arg2.toString();
	try {
		m += s1.split(".")[1].length;
	} catch (e) {}
	try {
		m += s2.split(".")[1].length;
	} catch (e) {}
	return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
}

// 减法小数点精度计算
export const Subtr = function(arg1, arg2) {
    var r1, r2, m, n;
    try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
    try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
    m = Math.pow(10, Math.max(r1, r2));
    n = (r1 >= r2) ? r1 : r2;
    return Number(((arg1 * m - arg2 * m) / m).toFixed(n));
}


//上传路径
export const uploadUrl = 'common/upload/';

//上传游戏包路径 
export const uploadGamePackage = '/common/uploadApplicationPackage';

//获取登录验证码
export const getLoginCode = 'entry/verifyCode';

