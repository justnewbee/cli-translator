"use strict";

const chalk = require("chalk");

const iciba = require("./translate/iciba");
const youdao = require("./translate/youdao");

/**
 * 封装翻译接口 使其不会 fail 且输出结果一致
 * @param {function} translateApi
 * @param {string} text
 * @param {string} sourceTitle
 * @param {string} poweredBy
 * @return {Promise.<string>|*}
 */
function wrapTranslatePromise(translateApi, text, sourceTitle, poweredBy) {
	return translateApi(text).then(result => {
		let arr = [];
		let {translations, examples, phonic} = result;
		
		// 音标
		if (phonic) {
			let phonicOutput;
			
			if (typeof phonic === "string") {
				phonicOutput = `[ ${phonic} ]`;
			} else {
				phonicOutput = `英 [ ${phonic.uk} ] 美 [ ${phonic.us} ]`;
			}
			
			arr.push(chalk.magenta(phonicOutput));
		}
		
		// 翻译
		if (translations && translations.length) {
			arr.push(translations.map(v => chalk.gray("- ") + `${v.pos ? chalk.green(v.pos + " ") : ""}${v.meanings.join(chalk.gray("；"))}`).join("\n"));
		}
		
		// 例子
		if (examples && examples.length) {
			arr.push(examples.map((v, k) => `${k + 1}. ${v.from.replace(new RegExp("(" + text + ")", "gi"), chalk.bold(chalk.yellow("$1")))}\n   ${chalk.cyan(v.to)}`).join("\n"));
		}
		
		return arr.join("\n\n");
	}, err => `${chalk.red("翻译失败：")}\n${chalk.gray(JSON.stringify(err))}`).then(str => `「${sourceTitle}」${chalk.gray(`- powered by ${poweredBy}`)}\n\n${str}`);
}

/**
 * 翻译并输出结果
 * @param {string} text
 * @return {Promise.<array.<string>>} 不同来源的返回数据不一样 我们需要在各自的 translate 接口中将对象或 XML 进行修正处理 保证返回数据如下
 * {
 *   phonetic: string|object.<us:string, uk:string>, // 发音或中文拼音 如果是英文且有英美两种发音会返回一个对象 us+uk 「可能为空」
 *   translations: array.<object.<pos:string, meanings:array>>, // 可能有的含义「需要判空数组」
 *   examples: array.<object.<from:string, to:string>> 用例-解释对「需要判空数组」
 * }
 */
module.exports = text => Promise.all([
	wrapTranslatePromise(youdao, text, "有道", "dict-co.iciba.com"),
	wrapTranslatePromise(iciba, text, "爱词霸", "fanyi.youdao.com")
]).then(arr => {
	arr.unshift(`${chalk.bold(text)} 的翻译结果`);
	
	return arr.join("\n\n");
});