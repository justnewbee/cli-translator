"use strict";

const request = require("request");
const xml2js = require("xml2js");

const _helper = require("./_helper");

module.exports = text => new Promise((resolve, reject) => request({
	url: "http://dict-co.iciba.com/api/dictionary.php", // TODO my key
	qs: {
		w: text,
		key: "1F9CA812CB18FFDFC95FC17E9C57A5E1"
	},
	method: "GET"
}, (error, response) => {
	let xmlStr = response.body.replace(/[\r\n]/g, "");
	
	xml2js.parseString(xmlStr, (err, result) => {
		if (err) {
			reject(err);
		}
		
		let {ps, pos, acceptation, sent} = result.dict;
		ps = ps || [];
		
		resolve({
			by: "dict-co.iciba.com",
			phonic: _helper.parsePhonic("", ps[0], ps[1]),
			translations: (pos || []).map((v, k) => { // pos === Part of Speech
				return {
					pos: v,
					meanings: acceptation[k].split(/\s*；\s*/).filter(vv => !!vv)
				};
			}).filter(v => v.meanings.length),
			examples: (sent || []).map(v => {
				return {
					from: v.orig[0],
					to: v.trans[0]
				};
			})
		});
	});
}));