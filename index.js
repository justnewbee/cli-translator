#!/usr/bin/env node

"use strict";

const chalk = require("chalk");
const figlet = require("figlet");
const commander = require("commander");
const inquirer = require("inquirer");
const clui = require("clui");

const writeLn = require("./lib/util/write-ln");
const translate = require("./lib/translate");
const listSource = require("./lib/list-source");
const listDep = require("./lib/list-dep");

commander
		.option("-s, --source", "查看支持的翻译源")
		.option("-d, --dep", "查看此 CLI 的依赖")
		.parse(process.argv);

writeLn(chalk.green(figlet.textSync("translate", {
	horizontalLayout: "full"
})));

if (commander.source) {
	writeLn(listSource());
	process.exit();
}
if (commander.dep) {
	writeLn(listDep());
	process.exit();
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
	
	translate(text).then(str => {
		spinner.stop();
		
		writeLn(str);
//		
//		arr.forEach((v, i) => {
//			if (i > 0) {
//				writeLn();
//			}
//			writeLn(str);
//			writeLn();
//		});
	});
});