#!/usr/bin/env node

var exec = require('child_process').exec,
	program = require('commander'),
	watch = require('node-watch'),
	chalk = require('chalk'),
	_ = require('lodash');

// Configure CLI parameters.
require('pkginfo')(module);
program
	.version(module.exports.version)
	.description(module.exports.description)
	.usage('--command [command] --watch [path]')
	.option('-c, --command [cmd]', 'command to run, and to restart when files change')
	.option('-w, --watch [path]', 'directory or file to watch for changes')
	.parse(process.argv);

if (!program.command || !program.watch) {
	program.help();
}

// Start process and listen for shutdown event.
var child;
var start = function () {
	child = exec(program.command);
	child.stdout.pipe(process.stdout);
	child.stderr.pipe(process.stderr);
	child.on('close', function (code, signal) {
		if (code !== 8) {
			console.log(chalk.black.bgRed(' Process has died. Waiting for changes to restart. '));
		}
	});
};

// Listen for file changes and, when they occur, restart process.
watch(program.watch, _.debounce(function(path) {
	console.log(chalk.green(' → Change detected on "%s". Restarting process.'), path);
	child.kill();
	start();
}, 1000));

// Initialize.
start();
console.log(chalk.black.bgGreen(' Watching %s/ for changes. '), program.watch);
