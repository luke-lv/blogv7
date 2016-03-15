/**
 * 处理文件拷贝.
 * @author wangqiang
 * @date 15/1/19
 */
var grunt = require('grunt');
var loader = require('grunt-loadnpmtasks')(grunt);
grunt.task.init = function() {};
loader.loadNpmTasks('grunt-contrib-cssmin');

function hook_write(stream, fn) {
	var old_write = stream.write;
	stream.write = function(){
		var args = [].slice.call(arguments);
		fn.apply(null, args);
		old_write.apply(stream, args);
	}

	return old_write;
}

function unhook_write(stream, fn){
	stream.write = fn;
}

exports.start = function(config, done, hookout, hookerr){
	var outwrite = hook_write(process.stdout, hookout);
	var errwrite = hook_write(process.stderr, hookerr);
	grunt.initConfig(config);
	grunt.tasks(['cssmin'], {
		verbose: true
	},function(){
		unhook_write(process.stdout, outwrite);
		unhook_write(process.stderr, errwrite);
		done(grunt);
	});
}
