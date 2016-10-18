"use strict";

const Preferences = require("preferences");

const pref = new Preferences("@jianchun/cli-translator");

/**
 * 获取或设置
 * @param {string} path
 */
module.exports = function(path) {
	if (arguments.length === 0) {
		return pref;
	}
	
	let pathArr = path.split(".");
	let o = pref;
	let p;
	
	if (arguments.length === 1) { // getter
		p = pathArr.shift();
		
		while (o && p) {
			o = o[p];
			p = pathArr.shift();
		}
		
		return p ? undefined : o;
	}
	
	let lastP = pathArr.pop(); // last is special
	p = pathArr.shift();
	
	while (p) {
		if (!o[p]) {// create if not exist
			o[p] = {};
		}
		
		o = o[p];
		p = pathArr.shift();
	}
	
	o[lastP] = arguments[1];
};