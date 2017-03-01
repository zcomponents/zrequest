#!/usr/bin/env node

'use strict';

/*
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Charset
 *
 * [
 * 	{
 * 		charset: 'charsetName',
 * 		q: number [0, 1]
 * 	},
 * 	...
 * ]
 *
 * */

const zt = require('ztype');

const re = [
	/[\s]*[\,][\s]*/,
	/^(.+?)[\s]*[\;][\s]*q[\=]([\d\.]+)$/i
];

module.exports = function (request) {
	const R = zt.al(request, {
		o: request,
		else: {}
	});
	const HH = zt.al(R.headers, {
		o: R.headers,
		else: {}
	});
	const charset = zt.al(HH['accept-charset'], {
			s: HH['accept-charset'],
			else: '*'
		})
		.trim()
		.toLowerCase()
		.split(re[0])
		.map(function (c) {
			const m = re[1].test(c) ? re[1].exec(c) : false;
			return {
				q: m && Number(m[2]) >= 0 ? Number(m[2]) : 1,
				charset: m ? m[1] : c
			};
		})
		.sort(function (c1, c2) {
			if (c1.q > c2.q) {
				return -1;
			}
			else if (c1.q < c2.q) {
				return 1;
			}
			else {
				return 0;
			}
		})
		.map(function (c) {
			Object.freeze(c);
			return c;
		});
	Object.freeze(charset);
	return charset;
};