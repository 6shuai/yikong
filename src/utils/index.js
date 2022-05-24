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


//计算时间差（相差秒）
// var beginTime="08:31:00";
// var endTime="21:50:00";
export function timeDifference(beginTime, endTime) {
	if (!beginTime) return;
	var start1 = beginTime.split(":");
	var startAll = parseInt(start1[0] * 60) + parseInt(start1[1]);
	if (!endTime) {
		return startAll * 60 + parseInt(start1[2]);
	}

	var end1 = endTime.split(":");
	var endAll = parseInt(end1[0] * 60) + parseInt(end1[1]);
	let minute = endAll - startAll;

	return minute * 60 - (parseInt(start1[2]) - parseInt(end1[2]));
}

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
export function findTimeHasYtd(data) {
	let fixedValue = '1970-01-01 '
	if (!data) return
	if (data.indexOf(fixedValue) > -1) {
		return data.split(fixedValue)[1]
	} else {
		return fixedValue + data
	}
}


//秒 转成  时分秒
export function formatSeconds(theTime) {
	var middle = 0 // 分
	var hour = 0 // 小时

	if (theTime > 60) {
		middle = parseInt(theTime / 60)
		theTime = parseInt(theTime % 60)
		if (middle > 60) {
			hour = parseInt(middle / 60)
			middle = parseInt(middle % 60)
		}
	}
	var result = ""
	if(theTime > 0){
		result = parseInt(theTime) + "秒"
	}
	if (middle > 0) {
		result = "" + parseInt(middle) + "分" + result
	}
	if (hour > 0) {
		result = "" + parseInt(hour) + "小时" + result
	}
	return result
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
export const Subtr = function (arg1, arg2) {
	var r1, r2, m, n;
	try {
		r1 = arg1.toString().split(".")[1].length
	} catch (e) {
		r1 = 0
	}
	try {
		r2 = arg2.toString().split(".")[1].length
	} catch (e) {
		r2 = 0
	}
	m = Math.pow(10, Math.max(r1, r2));
	n = (r1 >= r2) ? r1 : r2;
	return Number(((arg1 * m - arg2 * m) / m).toFixed(n));
}


//价格格式   
//整数部分大于4位 使用千位分割
export const priceFormat = (x) => {
	//强制保留两位小数
	var f = parseFloat(x);
	if (isNaN(f)) return x;
	var f = Math.round(x * 100) / 100;
	var s = f.toString();
	var rs = s.indexOf('.');
	if (rs < 0) {
		rs = s.length;
		s += '.';
	}
	while (s.length < (rs + 1) + 2) {
		s += '0';
	}
	//每三位用一个逗号隔开
	var leftNum = s.split(".")[0];
	var rightNum = "." + s.split(".")[1];
	var result;
	//定义数组记录截取后的价格
	var resultArray = new Array();
	if (leftNum.length > 3) {
		var i = true;
		while (i) {
			resultArray.push(leftNum.slice(-3));
			leftNum = leftNum.slice(0, leftNum.length - 3);
			if (leftNum.length < 4) {
				i = false;
			}
		}
		//由于从后向前截取，所以从最后一个开始遍历并存到一个新的数组，顺序调换
		var sortArray = new Array();
		for (var i = resultArray.length - 1; i >= 0; i--) {
			sortArray.push(resultArray[i]);
		}
		result = leftNum + "," + sortArray.join(",") + rightNum;
	} else {
		result = s;
	}
	// return {
	//     full: Number(result.replace(/\,/g,'')),
	// 	decimal: '￥' + result + '元'
	// }
	return '￥' + result + '元'
}


//宽高比计算
export const aspectRatioCompute = (width, height) => {
	// id=1(16:9)  id=2(16:10)  id=3(9:16)  id=4(10:16)  id=5(4:3)  id=6(3:4)  id=7(21:9)
	if (width > height) {
		let ratio = width / height;
		if (ratio < 1.5) {
			return '4 : 3'
		} else if (ratio >= 1.5 && ratio < 2.3) {
			return '16 : 9'
		} else {
			return '21 : 9'
		}
	} else {
		let ratio = height / width;
		if (ratio < 1.5) {
			return '3 : 4'
		} else if (ratio >= 1.5 && ratio < 2.3) {
			return '9 : 16'
		} else {
			return '21 : 9'
		}
	}
}


//上传路径
export const uploadUrl = 'common/upload/';

//上传游戏包路径 
export const uploadGamePackage = '/common/uploadApplicationPackage';

//获取登录验证码
export const getLoginCode = 'entry/verifyCode';