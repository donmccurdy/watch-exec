module.exports = function (grunt) {

	grunt.initConfig({
		bump: {
			options: {
				pushTo: 'origin',
				files: ['package.json'],
				commitFiles: ['package.json']
			}
		}
	});

	grunt.loadNpmTasks('grunt-bump');

};
