#!/usr/bin/env node

var exec = require('child_process').exec,
	program = require('commander'),
	watch = require('node-watch'),
	notify = require('growl'),
	_ = require('lodash');

var util = require('./util');

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
	.usage('--command <command> --watch [path]')
	.option('-c, --command <command>', 'command to run, and to restart when files change')
	.option('-w, --watch [path]', 'directories or files to watch for changes', util.collect, [])
	.option('-e, --exclude [path]', 'directories or files to exclude', util.collect, [])
	.option('-n, --notify', 'show desktop notifications')
	.parse(process.argv);

if (!program.command || !program.watch.length) {
	program.help();
}

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
			util.log.warn('process has died – waiting for changes to restart.');
		}
	});
};

var restart = _.debounce(function() {
	util.log.success('restarting process.');
	child.kill();
	start();
}, 1000, {leading: true, trailing: false});

// Listen for file changes and, when they occur, restart process.
watch(program.watch, function(path) {
	var isExcluded = _.some(program.exclude, function(exclude) {
		return path.search(exclude) >= 0;
	});
	if (!isExcluded) {
		util.log.info('change detected on "%s".', path);
		restart();
	}
});

// Log configuration.
util.log.info('v%s', module.exports.version);
util.log.info('watching: %s', program.watch.join(', '));
if (program.exclude.length) {
	util.log.info('excluding: %s', program.exclude.join(', '));
}

// Initialize.
util.log.success('starting: %s', program.command);
start();
