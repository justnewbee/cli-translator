"use strict";

const chalk = require("chalk");

const iciba = require("./translate/iciba");
const youdao = require("./translate/youdao");

function getPhonicOutput(phonic) {
	if (!phonic) {
		return "";
	}
	
	let output;
	
	if (typeof phonic === "string") {
		output = `[ ${phonic} ]`;
	} else {
		output = `英 [ ${phonic.uk} ] 美 [ ${phonic.us} ]`;
	}
	
	return chalk.magenta(" " + output);
}

/**
 * 翻译并输出结果
 * @param {string} text
 * @return {Promise.<array.<string>>} 不同来源的返回数据不一样 我们需要在各自的 translate 接口中将对象或 XML 进行修正处理 保证返回数据如下
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
]).then(results => results.map(result => {
	let arr = [];
	let {translations, examples} = result;
	
	arr.push(chalk.bold(text) + getPhonicOutput(result.phonic) + chalk.gray(`  ~  powered by ${result.by}`));
	
	if (translations && translations.length) {
		arr.push("");
		
		translations.forEach(v => {
			arr.push(chalk.gray("- ") + `${v.pos ? chalk.green(v.pos + " ") : ""}${v.meanings.join(chalk.gray("；"))}`);
		});
	}
	if (examples && examples.length) {
		arr.push("");
		
		examples.forEach((v, k) => {
			arr.push(`${k + 1}. ${v.from.replace(new RegExp("(" + text + ")", "gi"), chalk.bold(chalk.yellow("$1")))}`);
			arr.push(chalk.cyan("   " + v.to));
		});
	}
	
	return arr.join("\n");
}));