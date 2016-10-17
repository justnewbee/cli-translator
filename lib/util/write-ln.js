"use strict";

/**
 * 输出一行内容至 stdout
 * @param {string} [text]
 */
module.exports = function(text) {
	process.stdout.write((text || "") + "\n");
};