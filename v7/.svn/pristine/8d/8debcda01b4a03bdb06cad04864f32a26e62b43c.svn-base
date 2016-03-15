/**
 * 根据routes文件，在conf/page目录中自动创建页面入口文件
 * @authors yifei2 yifei2@staff.sina.com.cn
 */

var $fs = require('fs');
var $path = require('path');

var config = {
	// 本地基本路径
	localBasePath: $path.resolve(__dirname, '../'),
	// 代码分支目录
	target: 'trunk/',
	routesPath: 'js/conf/routes/',
	pagePath: 'js/conf/page/'
};

// 遍历目录
// 返回文件路径
function travel(dir, callback) {
    $fs.readdirSync(dir).forEach(function (filename) {
        var pathname = $path.join(dir, filename);

        if ($fs.statSync(pathname).isDirectory()) {
            travel(pathname, callback);
        } else {
            callback(pathname, filename);
        }
    });
}

// 在文件内容中获取依赖数组
function getRequire(fileContent) {
	var Reg = /\[[\s\S]+?\]/ig;
	var match = Reg.exec(fileContent);
	var res = [];

	if(match && match[0]) {
		res = match[0].replace(/\[/g, '')
		.replace(/\]/g, '')
		.replace(/\r/g, '')
		.replace(/\n/g, '')
		.replace(/\t/g, '')
		.replace(/\'/g, '')
		.replace(/\"/g, '');
		res = res.split(',');
	}
	
	return res;
}

// 创建页面入口文件
function createPageFile(filename, requireArr) {
	var bannerCode = '/**\n' + ' * @fileoverview 业务入口文件，由程序自动生成，请看app/tools/buildPageFile.js\n' + ' * @authors yifei2 <yifei2@staff.sina.com.cn>\n' + ' */\n';
	var requireCode = '';
	var fileTpl = '';
	for (var i = 0; i < requireArr.length; i++) {
		requireCode = requireCode + '\trequire(\'' + requireArr[i] + '\');\n';
	}
	fileTpl = bannerCode + 'define(\'conf/page/' + filename.replace('.js', '') + '\', function(require,exports,module) {\n' + requireCode + '});';

	var targetPath = $path.resolve(config.localBasePath, config.target + config.pagePath);
	$fs.writeFileSync(targetPath + '/' + filename, fileTpl, 'utf-8');
}

// main函数
function main() {
	var targetPath = $path.resolve(config.localBasePath, config.target + config.routesPath);

	travel(targetPath, function(pathname, filename) {
		var fileContent = $fs.readFileSync(pathname, 'utf-8');
		var requireArr = getRequire(fileContent);
		if(requireArr && requireArr.length > 0) {
			createPageFile(filename, requireArr);
		}
	});
}

main();