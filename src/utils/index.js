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
	var date = new Date(time); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
	var Y = date.getFullYear() + '-';
	var M = addZero(date.getMonth() + 1) + '-';
	var D = addZero(date.getDate());
	var h = '' + addZero(date.getHours()) + ':';
	var m = addZero(date.getMinutes()) + ':';
	var s = addZero(date.getSeconds());
	if (type === 'time') {
		return h + m + s;
	} else if (type === 'date') {
		return Y + M + D
	} else {
		return Y + M + D + h + m + s
	}
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
	var m = 0,
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


//上传路径
export const uploadUrl = 'common/upload/';

//上传游戏包路径 
export const uploadGamePackage = '/common/uploadApplicationPackage';

//获取登录验证码
export const getLoginCode = 'entry/verifyCode';

