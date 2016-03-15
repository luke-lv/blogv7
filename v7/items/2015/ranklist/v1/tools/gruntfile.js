var $path = require('path');

module.exports = function(grunt) {

	var timeStamp;
	var dateStamp;

	(function(){

		var date = new Date();
		var yy = date.getFullYear();
		var mm = date.getMonth() + 1;
		var dd = date.getDate();

		timeStamp = date - 0;
		dateStamp = [
			yy,
			(mm < 10 ? '0' + mm : mm),
			(dd < 10 ? '0' + dd : dd)
		].join('');

	})();

	// Project configuration.
	grunt.initConfig({
		timeStamp : timeStamp,
		dateStamp : dateStamp,
		projectDir : $path.resolve(__dirname,'../'),
		// Clean files for example publish.
		clean: {
			beforePublish : [
				'temp/online'
			],
			beforeConcat : [
				'temp/concat'
			],
			removeTemp : [
				'temp/concat/**/_*'
			]
		},
		copy: {
			test : {
				expand : true,
				cwd : '../work/',
				src : 'js/*.js',
				dest : 'temp/test/'
			},
			clearDebugScript : {
				expand : true,
				cwd : 'temp/dev/',
				src : 'js/*.js',
				dest : 'temp/temp/',
				options : {
					process: function (content, srcpath) {
						//移除调试代码
						return content.replace(/\/\*debug-start\*\/[^\/]+\/\*debug-end\*\//mg, '');
					}
				}
			},
			beforeCompress : {
				expand : true,
				cwd : 'temp/dev/',
				src : 'js/conf/**/*.js',
				dest : 'temp/temp/'
			},
			afterCompress : {
				expand : true,
				cwd : 'temp/temp/',
				src : 'js/*.js',
				dest : 'temp/concat/'
			},
			toOnline : {
				files : [
					{
						expand : true,
						cwd : 'temp/concat/',
						src : 'js/*.js',
						dest : 'temp/online/'
					},
					{
						expand : true,
						cwd : 'temp/concat/',
						src : 'js/conf/**/*.js',
						dest : 'temp/online/'
					},
					{
						expand : true,
						cwd : 'temp/dev/',
						src : 'images/**/*',
						dest : 'temp/online/'
					}
				]
			}
		},
		cssmin : {
			options : {
				compatibility : 'ie7'
			},
			publish : {
				expand : true,
				cwd : 'temp/dev/css/',
				src : ['**/*.css'],
				dest : 'temp/online/css/'
			}
		},
		concat : {
			test : {
				src: [
					'temp/test/js/lithe.js',
					'temp/test/js/config.js',
					'temp/test/js/conf/global.js',
					'temp/test/js/conf/page/main.js',
					'temp/test/js/conf/routes/*.js'
				],
				dest: 'temp/test/js/lithe.js'
			},
			afterLitheConcat : {
				src: [
					'temp/concat/js/lithe.js',
					'temp/concat/js/config.js',
					'temp/concat/js/conf/global.js',
					'temp/concat/js/conf/page/main.js',
					'temp/concat/js/conf/routes/*.js'
				],
				dest: 'temp/concat/js/lithe.js'
			}
		},
		confirm : {
			distribute : {
				msg : 'publish ?'
			}
		},
		litheGetAllRequiredFiles : {
			options : {
				cwd: '<%=projectDir%>'
			},
			packPrepare : {
				src : 'tools/temp/dev/js/',
				dest : 'tools/temp/temp/js/',
				alias : 'config.js',
				target : 'conf/'
			}
		},
		litheConcat : {
			options : {
				cwd: '<%=projectDir%>'
			},
			test : {
				src : 'work/js/',
				dest : 'tools/temp/test/js/',
				walk : true,
				alias : 'config.js',
				global : 'conf/global.js',
				withoutGlobal : [
					'conf/mods/',
					'conf/routes/',
					'conf/pl/',
					'conf/page/'
				],
				target : 'conf/'
			},
			publish : {
				src : 'tools/temp/temp/js/',
				dest : 'tools/temp/concat/js/',
				walk : true,
				alias : 'config.js',
				global : 'conf/global.js',
				withoutGlobal : [
					'conf/mods/',
					'conf/routes/',
					'conf/pl/',
					'conf/page/'
				],
				target : 'conf/'
			}
		},
		litheCompress : {
			options : {
				cwd: '<%=projectDir%>'
			},
			publish : {
				src : 'tools/temp/temp/js/',
				dest : 'tools/temp/temp/js/'
			}
		},
		svnConfig : {
			trunk : {
				from : $path.resolve(__dirname),
				to : function(url){
					var trunkUrl = url.replace(/\/tools$/, '');
					var branchesUrl = trunkUrl.replace(/\/trunk\//, '/branches/');
					var tagsUrl = trunkUrl.replace(/\/trunk\//, '/tags/');
					grunt.config.set('svnConfig.branches', branchesUrl);
					grunt.config.set('svnConfig.tags', tagsUrl);
					return trunkUrl;
				}
			}
		},
		svnInit : {
			options : {
				repository : '',
				cwd: '<%=projectDir%>/tools'
			},
			trunk : {
				repository : '<%=svnConfig.trunk%>',
				map : {
					'dev' : {
						'html' : 'folder',
						'js' : 'folder'
					},
					'online' : 'folder'
				}
			},
			branches : {
				repository : '<%=svnConfig.branches%>'
			},
			tags : {
				repository : '<%=svnConfig.tags%>',
				map : {
					'dev' : 'folder',
					'online' : 'folder',
					'qb' : {
						'release_0' : 'folder'
					}
				}
			}
		},
		svnCheckout : {
			options : {
				repository: '<%=svnConfig.trunk%>',
				cwd : '<%=projectDir%>'
			},
			deploy : {
				map : {
					'dev' : 'dev',
					'online' : 'online'
				}
			},
			prepareForPublish : {
				map : {
					'tools/temp/online' : 'online',
					'tools/temp/dev' : 'dev'
				}
			}
		},
		svnCommit : {
			options : {
				repository: '<%=svnConfig.trunk%>',
				cwd : '<%=projectDir%>'
			},
			online : {
				log : '[dev]',
				svn : 'online',
				src : 'tools/temp/online'
			}
		},
		svnCopy : {
			options : {
				repository: '<%=svnConfig.trunk%>'
			},
			branch : {
				question : 'Input the branch name',
				rename : '<%=dateStamp%>_{ask}',
				from : '<%=svnConfig.trunk%>/dev',
				to : '<%=svnConfig.branches%>'
			},
			tagDev : {
				rename : function(info){
					grunt.config.set('svnCopy.tagDev.revision', info.revision);
					return info.revision;
				},
				from : '<%=svnConfig.trunk%>/dev',
				to : '<%=svnConfig.tags%>/dev'
			},
			tagOnline : {
				rename : function(info){
					return grunt.config.get('svnCopy.tagDev.revision');
				},
				from : '<%=svnConfig.trunk%>/online',
				to : '<%=svnConfig.tags%>/online'
			}
		}
	});

	grunt.loadNpmTasks('grunt-lithe');
	grunt.loadNpmTasks('grunt-svn-workflow');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-cssmin');

	grunt.registerTask(
		'packWithCompress',
		'Pack and compress files for publish',
		[
			'svnConfig',
			'clean:beforePublish',
			'clean:beforeConcat',
			'svnCheckout:prepareForPublish',
			'litheGetAllRequiredFiles:packPrepare',
			'copy:beforeCompress',
			'copy:clearDebugScript',
			'litheCompress:publish',
			'copy:afterCompress',
			'clean:removeTemp',
			'litheConcat:publish',
			'concat:afterLitheConcat',
			'cssmin:publish',
			'copy:toOnline'
		]
	);

	grunt.registerTask(
		'distribute',
		'Commit online files, and generate tags',
		[
			'confirm:distribute',
			'svnConfig',
			'svnCommit:online',
			'svnCopy:tagDev',
			'svnCopy:tagOnline'
		]
	);

	grunt.registerTask(
		'deploy',
		'[COMMON] Checkout the workingcopy according to the folder map.',
		[
			'svnConfig',
			'svnCheckout:deploy'
		]
	);

	grunt.registerTask(
		'test',
		'[COMMON] Generate packed files for test',
		[
			'svnConfig',
			'litheConcat:test',
			'copy:test'
		]
	);

	grunt.registerTask(
		'branch',
		'[COMMON] Create a branch',
		[
			'svnConfig',
			'svnCopy:branch'
		]
	);

	grunt.registerTask(
		'update',
		'[COMMON] Update files, then pack and compress files',
		[
			'deploy',
			'packWithCompress'
		]
	);

	grunt.registerTask(
		'publish',
		'[COMMON] Pack and compress files, then distribute',
		[
			'packWithCompress',
			'distribute'
		]
	);

	// By default, deploy the workingcopy.
	grunt.registerTask('default', [
		'deploy'
	]);

};




