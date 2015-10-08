var chalk = require('chalk'),
	_ = require('lodash');

module.exports = {

	collect: function collect(val, memo) {
		memo.push(val);
		return memo;
	},

	log: {
		PREFIX: '[watch-exec] ',
		info: function(msg) {
			msg = this.PREFIX + msg;
			console.log.apply(console, [chalk.yellow(msg)].concat(_.rest(arguments)));
		},
		success: function (msg) {
			msg = this.PREFIX + msg;
			console.log.apply(console, [chalk.green(msg)].concat(_.rest(arguments)));
		},
		warn: function (msg) {
			msg = this.PREFIX + msg;
			console.log.apply(console, [chalk.black.bgRed(msg)].concat(_.rest(arguments)));
		}
	}
};
