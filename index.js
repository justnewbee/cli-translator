#!/usr/bin/env node

"use strict";

const chalk = require("chalk");
const figlet = require("figlet");
const commander = require("commander");
const inquirer = require("inquirer");
const clui = require("clui");

const translate = require("./lib/translate");

/**
 * 输出一行内容至 stdout
 * @param {string} text
 */
function writeLn(text) {
	process.stdout.write(text + "\n");
}

commander.parse(process.argv);

writeLn(chalk.green(figlet.textSync("translate", {
	horizontalLayout: "full"
})));

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

(commander.args[0] ? Promise.resolve(commander.args[0]) : inquirer.prompt([{
	name: "text",
	type: "input",
	message: "输入需要翻译的词或句子：",
	validate(value) {
		return value.length ? true : "你要翻译的是什么呢";
	}
}]).then(o => o.text)).then(text => {
	var spinner = new clui.Spinner("正在获取结果");
	spinner.start();
	
	return translate(text).then(results => {
		spinner.stop();
		
		let output = [];
		
		results.forEach((result, index) => {
			if (index > 0) {
				output.push("");
				output.push("");
			}
			
			let {translations, examples} = result;
			
			output.push(chalk.bold(text) + getPhonicOutput(result.phonic) + chalk.gray(`  ~  powered by ${result.by}`));
			
			if (translations && translations.length) {
				output.push("");
				
				translations.forEach(v => {
					output.push(chalk.gray("- ") + `${v.pos ? chalk.green(v.pos + " ") : ""}${v.meanings.join(chalk.gray("；"))}`);
				});
			}
			if (examples && examples.length) {
				output.push("");
				
				examples.forEach((v, k) => {
					output.push(`${k + 1}. ${v.from.replace(new RegExp("(" + text + ")", "gi"), chalk.bold(chalk.yellow("$1")))}`);
					output.push(chalk.cyan("   " + v.to));
				});
			}
		});
		
		output.push("");
		
		return output;
	}, err => {
		spinner.stop();
		
		throw err;
	});
}).then(arr => writeLn(arr.join("\n")), err => {
	console.error(chalk.red(err.message));
	console.log(err.stack);
});