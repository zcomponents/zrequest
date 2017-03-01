#!/usr/bin/env node

'use strict';

/*
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept
 *
 * [
 * 	{
 * 		mime: 'type/subtype',
 * 		q: number [0, 1]
 * 	},
 * 	...
 * ]
 *
 * */

const zt = require('ztype');

const re = [
	/[\s]*[\,][\s]*/,
	/^(.+?)[\s]*[\;][\s]*q[\=]([\d\.]+?)$/i
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
	const accept = zt.al(HH['accept'], {
			s: HH['accept'],
			else: '*'
		})
		.trim()
		.toLowerCase()
		.split(re[0]).map(function (a) {
			const m = re[1].test(a) ? re[1].exec(a) : false;
			return {
				q: m && Number(m[2]) >= 0 ? Number(m[2]) : 1,
				mime: m ? m[1] : a
			};
		})
		.sort(function (a1, a2) {
			if (a1.q > a2.q) {
				return -1;
			}
			else if (a1.q < a2.q) {
				return 1;
			}
			else {
				return 0;
			}
		})
		.map(function (a) {
			Object.freeze(a);
			return a;
		});
	Object.freeze(accept);
	return accept;
};