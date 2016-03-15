/**
 * Created file.
 * @author wangqiang
 * @date 15/1/14
 */
var grunt = require('grunt');
var loader = require('grunt-loadnpmtasks')(grunt);
grunt.task.init = function() {};
loader.loadNpmTasks('grunt-contrib-cssmin');
var config = {
	cssmin: {
		target: {
			files: [{
				expand: true,
				cwd: '../../blog7style/css',
				src: ['./conf/blog/personalM.css'],
				dest: '../cmd/blog7style/css'
			}]
		}
	}
};
grunt.initConfig(config);
//process.stdin.on('data', function(chunk){
//	console.log('===========log ', chunk.toString());
//});
grunt.tasks(['cssmin'], {
	verbose: true
},function(){
	console.log('end');
});


