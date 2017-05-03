/**
 * Created by ryarborough on 4/27/17.
 */

module.exports = function(grunt){
	grunt.initConfig({
		serve: {
			options: {
				port: 7000
			}
		}
	});
	grunt.loadNpmTasks('grunt-serve');
	grunt.registerTask('default', ['serve']);
};
