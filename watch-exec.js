#!/usr/bin/env node

var exec = require('child_process').exec,
	program = require('commander'),
	watch = require('node-watch'),
	chalk = require('chalk'),
	notify = require('growl'),
	_ = require('lodash');

var MESSAGES = {
	0: 'Process completed.',
	8: 'Process restarting.',
	general: 'Process died.'
};

// Configure CLI parameters.
require('pkginfo')(module);
program
	.version(module.exports.version)
	.description(module.exports.description)
	.usage('--command [command] --watch [path]')
	.option('-c, --command [cmd]', 'command to run, and to restart when files change')
	.option('-w, --watch [path]', 'directory or file to watch for changes')
	.option('-n, --notify', 'show desktop notifications')
	.parse(process.argv);

if (!program.command || !program.watch) {
	program.help();
}

var prefix = '[' + module.exports.name + ']';

// Start process and listen for shutdown event.
var child;
var start = function () {
	child = exec(program.command);
	child.stdout.pipe(process.stdout);
	child.stderr.pipe(process.stderr);
	child.on('close', function (code) {
		if (program.notify) {
			notify(MESSAGES[code] || MESSAGES.general, {
				name: module.exports.name,
				title: code ? 'Failure' : 'Success',
				image: __dirname + '/icons/' + (code ? 'error.png' : 'ok.png')
			});
		}
		if ( ! _.contains([0, 8], code)) {
			console.log(chalk.black.bgRed('%s process has died – waiting for changes to restart.'), prefix);
		}
	});
};

// Listen for file changes and, when they occur, restart process.
watch(program.watch, _.debounce(function(path) {
	console.log(chalk.green('%s change detected on "%s". restarting process.'), prefix, path);
	child.kill();
	start();
}, 1000, {leading: true, trailing: false}));

// Initialize.
console.log(chalk.yellow('%s v%s'), prefix, module.exports.version);
console.log(chalk.yellow('%s watching: %s'), prefix, program.watch);
console.log(chalk.green('%s starting: %s'), prefix, program.command);
start();
