"use strict";

const request = require("request");

const _helper = require("./_helper");

const ERR = {
	20: "要翻译的文本过长",
	30: "无法进行有效的翻译",
	40: "不支持的语言类型",
	50: "无效的 key",
	60: "无词典结果，仅在获取词典结果生效"
};

/**
 * 有道的翻译服务
 * http://fanyi.youdao.com/openapi?path=data-mode
 * @param {string} text
 * @return {Promise.<object>}
 */
module.exports = text => new Promise((resolve, reject) => request({
	url: "http://fanyi.youdao.com/openapi.do",
	qs: {
		keyfrom: "wufeifei",
		key: "716426270",
		type: "data",
		doctype: "json",
		version: "1.1",
		q: text
	},
	method: "GET"
}, (error, response) => {
	if (error) {
		reject(error);
		return;
	}
	
	try {
		/*
		 * 返回的数据如下（以「mango」为例）
		 * {
		 *   "query": "mango",
		 *   "errorCode": 0, // 用后即焚
		 *   "translation": [ // 数组 必有 -> 我们需要转成字符串
		 *     "芒果"
		 *   ],
		 *   "basic": { // 不一定有
		 *     "us-phonetic": "'mæŋɡo",          +
		 *     "phonetic": "'mæŋgəʊ",            |----> 在 上层对象中生成 phonic { uk: '__', us: '__' } 对象
		 *     "uk-phonetic": "'mæŋgəʊ",         +
		 *     "explains": [ // 不一定有 填充 [] -> result.translations:array
		 *       "n. [园艺] 芒果",
		 *       "n. (Mango)人名；(阿拉伯、意、肯)曼戈；(日)万五 (名)"
		 *     ]
		 *   },
		 *   "web": [{ // 不一定有
		 *     "value": [
		 *       "杧果属",
		 *       "芒果航空",
		 *       "曼戈"
		 *     ],
		 *     "key": "mango"
		 *   }, {
		 *     "value": [
		 *       "刨冰",
		 *       "芒果清清",
		 *       "绿芒果"
		 *     ],
		 *     "key": "green mango"
		 *   }, {
		 *     "value": [
		 *       "芒果果酱"
		 *     ],
		 *     "key": "Mango Jam"
		 *   }]
		 * }
		 */
		let result = JSON.parse(response.body);
		
		if (result.errorCode === 0) {
			let {basic, web} = result;
			
			basic = basic || {};
			
			resolve({
				by: "fanyi.youdao.com",
				phonic: _helper.parsePhonic(basic.phonetic, basic["uk-phonetic"], basic["us-phonetic"]),
				translations: (basic.explains || []).map(v => {
					return /^([\w \.&]+\.) (.+)$/.test(v) ? {
						pos: RegExp.$1,
						meanings: RegExp.$2.split(/\s*；\s*/)
					} : {
						pos: "",
						meanings: v.split(/\s*；\s*/)
					};
				}),
				examples: (web || []).map(v => {
					return {
						from: v.key,
						to: v.value.join("；")
					};
				})
			});
		} else {
			reject({
				code: result.errorCode,
				message: ERR[result.errorCode] || `其他错误：${result.errorCode}`
			});
		}
	} catch (ex) {
		reject(ex);
	}
}));