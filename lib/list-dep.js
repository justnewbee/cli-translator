"use strict";

const chalk = require("chalk");

var pkg = require("../package.json");

module.exports = () => {
	let dependencies = pkg.dependencies;
	let arr = ["依赖下面这些伟大的库：\n"];
	
	for (let k in dependencies) {
		if (dependencies.hasOwnProperty(k)) {
			arr.push(`  - ${chalk.bold(k)}@${dependencies[k]}`);
		}
	}
	
	return arr.join("\n");
};