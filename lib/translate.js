"use strict";

const iciba = require("./translate/iciba");
const youdao = require("./translate/youdao");

/**
 * 返回翻译数据
 * @param {string} text
 * @return {Promise.<Object>} 不同来源的返回数据不一样 我们需要在各自的 translate 接口中将对象或 XML 进行修正处理 保证返回数据如下
 * {
 *   by: string, // 翻译者
 *   phonetic: string|object.<us:string, uk:string>, // 发音或中文拼音 如果是英文且有英美两种发音会返回一个对象 us+uk 「可能为空」
 *   translations: array.<object.<pos:string, meanings:array>>, // 可能有的含义「需要判空数组」
 *   examples: array.<object.<from:string, to:string>> 用例-解释对「需要判空数组」
 * }
 */

module.exports = text => Promise.all([
	youdao(text),
	iciba(text)
]);