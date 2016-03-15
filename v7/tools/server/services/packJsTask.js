var path = require('path');
var stream = require('stream');
var fs = require('fs');
var Q = require('q');
var URL = require('url');

var ecp = require('./easy-spawn');
var Spawn = ecp.spawn;
var exec   = ecp.exec;

var asyncTask = require('./asyncTask');

var trim = require('../services/trim');
var mkdirsSync = require('../services/mkdirsSync');
var SVNClient = require('../services/svn');


var packTool = require('js-combine-pack').tool;
var LineStream = packTool.lineStream;
var getFileAllJsDeps = packTool.getAllJsDeps;
var findFiles = packTool.findFiles;
var findJsAllImport = packTool.findJsAllImport;

/**
 * 处理打包任务
 * @author wangqiang
 * @date 15/1/4
 */
function Pack(packInfo, cmdMsg, processUser, docRoot) {
    var svnConfigDir = docRoot + '/cmd/subversion';
    // 前台填写的svn路径
    var svnUrl = packInfo.svnUrl;

    // 源文件目录，存放svn checkout下来的文件
    var productPath = path.resolve(docRoot + '/cmd/product_files/' + packInfo.productName);
    // 合并目录
    var tmpCombinePath = path.resolve(docRoot + '/cmd/combine_files/' + packInfo.productName);
    // 压缩目录
    var tmpMinifyPath = path.resolve(tmpCombinePath+'_mini_tmp');
    // 线上trunk目录
    var onlinePath = path.resolve(docRoot + '/cmd/online/' + packInfo.productName);
    // test online目录
    var testonlinePath = path.resolve(docRoot + '/cmd/test_online/' + packInfo.productName);

    // svn目录
    var svnDevTrunk = svnUrl;
    var svnOnlineTrunk = svnUrl.replace('/dev', '/online');
    var svnDevTagsUrl = svnUrl.replace('/trunk/', '/tags/');
    var svnOnlineTagsUrl = svnUrl.replace('/trunk/', '/tags/').replace('/dev', '/online');
    var svnTestonline = svnUrl.replace('/dev', '/testonline');

    var svnClient = new SVNClient({
        username: packInfo.svnAccount,
        password: packInfo.svnPwd
    });

    if (!fs.existsSync(svnConfigDir)) {
        mkdirsSync(svnConfigDir);
    }

    function isMatch(str, errMsg){
        var flag = -1 < str.indexOf(errMsg);
        return flag;
    }
    function stdout(str) {
        cmdMsg.add(str, cmdMsg.SUCCESS);
    }
    function stderr(str, errMsg, stdin) {
        cmdMsg.add(str, cmdMsg.SUCCESS);
        if (str === '\n') {
            return;
        } else if (isMatch(str, 'Store password unencrypted (yes/no)')) {
            stdin.write('yes\n');
        } else if (isMatch(str,'Password for')) {
            // 输入svn密码
            stdin.write(packInfo.svnPwd + '\n');
        } else if (isMatch(str,'(R)eject, accept (t)emporarily or accept (p)ermanently?')) {
            // 永久记录证书信息
            stdin.write('p\n');
        } else if (isMatch(str,'targets don\'t exist')) {
            cmdMsg.add('SVN路径不存在', cmdMsg.SUCCESS);
            this.kill('SIGINT');
        } else if (isMatch(str,'svn: E')) {
            cmdMsg.add('发生错误', cmdMsg.ERROR);
            this.kill('SIGINT');
        } else if (isMatch(str,'Select: (p)')) {
            cmdMsg.add('SVN 文件冲突！', cmdMsg.ERROR);
            this.kill('SIGINT');
        } else if (isMatch(str,'Username:')) {
            stdin.write(packInfo.svnAccount + '\n');
            console.log('user input OK!');
        } else if (isMatch(str, 'Store password unencrypted (yes/no)? ')) {
            stdin.write('yes\n');
        } else if (isMatch(str, 'svn: Failed')) {
            cmdMsg.add('=====打包出错', cmdMsg.ERROR);
            this.kill('SIGINT');
        } else if (isMatch(str, 'Could not authenticate to server: rejected Basic challenge')) {
            cmdMsg.add('=====SVN认证出错，请重试！', cmdMsg.ERROR);
            this.kill('SIGINT');
        }
    }
    function error(){
        cmdMsg.add('发生未知错误', cmdMsg.ERROR);
    }

    var startTime = Date.now();

    Q.Promise(function (resolve, reject) {
        cmdMsg.add('打包开始');
        resolve();
    })
    // 创建工作目录
    .then(function () {
        var isProductExist = false;
        cmdMsg.add('创建工作目录：'+productPath);
        // 创建工作目录
        if (!fs.existsSync(path.resolve(productPath+'/.svn'))) {
            cmdMsg.add('mkdir ' + productPath, cmdMsg.SUCCESS);
            mkdirsSync(productPath);
            isProductExist = false;
        } else {
            cmdMsg.add(productPath + ' is existed!', cmdMsg.SUCCESS);
            isProductExist = true;
        }
        return isProductExist;
    })
    // checkout or update工作目录
    .then(function (isProductExist) {
        var deferred = Q.defer();
        // check or update 目录
        var svnParams, method, svnUrl = packInfo.svnUrl;
        if (!isProductExist) {
            svnParams = [svnUrl, '--config-dir', svnConfigDir, productPath
            ];
            method = 'checkout';

        } else {
            svnParams = [svnUrl, productPath, '--config-dir',
                    svnConfigDir, '--accept', 'theirs-conflict' //, '--ignore-ancestry'
            ];
            method = 'sw';
        }
        cmdMsg.add('下载变更文件 '+method);
        svnClient[method](svnParams, {
            stdout: stdout,
            stderr: stderr,
            close: function (outMsg, errMsg, code, signal) {
                if (cmdMsg.hasError()) {
                    cmdMsg.end('code:' + code + ' signal:' + signal, cmdMsg.ERROR);
                } else {
                    deferred.resolve();
                }
            },
            error: error
        });

        return deferred.promise;
    })
    // 查找js conf文件
    .then(function () {
        if (packInfo.productType !== 'js') {
            return;
        }
        cmdMsg.add('================查找所有配置文件==================');
        cmdMsg.add('查找所有配置文件');
        // 查找所有的conf文件
        var confPath = productPath + '/conf';
        var jsFileReg = /\.js$/;
        var confFiles = [];
        fs.readdirSync(confPath).forEach(function (filename) {
            // Avoid to read this current file.
            if (!jsFileReg.test(filename)) {
                return;
            }

            confFiles.push(filename);
        });
        return confFiles;
    })
    // 查找js文件依赖，合并文件
    .then(function (confFiles) {
        if (packInfo.productType !== 'js') {
            return;
        }
        var deferred = Q.defer();
        cmdMsg.add('================合并文件==================');
        if (!fs.existsSync(tmpCombinePath)) {
            mkdirsSync(tmpCombinePath);
        }
        var importReg = /^[\uFEFF]*[ \t]*\$import\s*\(\s*(['|"])([\w\-\.\/\_]*)\1\s*\)\s*;?/i;
        var jsList = findFiles.allFilesList(productPath);
        var jsListCon = findFiles.allFilesCon(jsList,productPath);

        asyncTask.waterfall(confFiles, [
            function(confFile, callback){
                var combinePath = path.resolve(tmpCombinePath + '/' + confFile);

                cmdMsg.add('Combine '+confFile);
                if (!fs.existsSync(tmpCombinePath)) {
                    mkdirsSync(tmpCombinePath);
                }
                if (fs.existsSync(combinePath)) {
                    fs.unlink(combinePath);
                }
                callback(null, confFile, combinePath);
            },
            function(confFile, combinePath, callback){
                var confFilePath = path.join(productPath, 'conf', confFile);
                // 寻找文件依赖合并
                findJsAllImport(confFilePath,jsListCon,function(data){
                    fs.writeFileSync(combinePath, data);
                    callback(null);
                });
            }
        ], function(err){
            deferred.resolve(tmpCombinePath);
        });
        return deferred.promise;
    })
    // 创建online目录
    .then(function(tmpCombinePath){
        if (!fs.existsSync(onlinePath)) {
            mkdirsSync(onlinePath);
            cmdMsg.add('创建目录：'+onlinePath);
        }

        if (!fs.existsSync(tmpMinifyPath)) {
            mkdirsSync(tmpMinifyPath);
            cmdMsg.add('创建目录：'+tmpMinifyPath);
        }

        return tmpCombinePath;
    })
    // 压缩js文件
    .then(function (combinePath) {
        if (packInfo.productType !== 'js') {
            return;
        }
        cmdMsg.add('================压缩JS文件=================');

        var deferred = Q.defer();

        fs.readdir(combinePath, function (err, files) {
            asyncTask.waterfall(files, [
                function(file, cb){
                    var combineFilePath = combinePath + '/' + file;
                    var minifyFilePath  = tmpMinifyPath + '/' + file.replace(".dev", "");
                    var start = +new Date();

                    Spawn('uglifyjs', [combineFilePath, '-o', minifyFilePath], {
                        stdout: function(str){
                            cmdMsg.add(str);
                        },
                        stderr: function(str){
                            cmdMsg.add(str);
                        },
                        close: function(){
                            var timeSpend = (+new Date() - start) + 'ms';
                            cmdMsg.add('Time spend: '+timeSpend);
                            if (!cmdMsg.hasError()) {
                                cb();
                            } else {
                                cb(new Error('压缩文件出错!'));
                            }
                        },
                        error: function(){
                            cmdMsg.add('执行uglifyjs命令出错!', cmdMsg.ERROR);
                            cb(new Error('执行uglifyjs命令出错!'));
                        }
                    });
                    cmdMsg.add('Minify '+file);
                }
            ], function(err, result){
                if (err) {
                    deferred.reject(err);
                } else {
                    cmdMsg.add('压缩完成');
                    deferred.resolve();
                }

            });
        });
        return deferred.promise;
    })

    // 检查online目录
    .then(function () {
        var deferred = Q.defer();

        if (packInfo.isPackOnline === '1') {
            // 勾选提交svn选项，检查online目录
            fs.exists(path.resolve(onlinePath+'/.svn'), function(exists){
                if (!exists) {
                    if (fs.existsSync(onlinePath)) {
                        cmdMsg.add('====发现未创建的版本删除: '+onlinePath);
                        exec('rm -rf ' + onlinePath, function(err, stdout, stderr){
                            cmdMsg.add(stdout+stderr);
                            if(stderr){
                                deferred.reject();
                            }else{
                                deferred.resolve(0);
                            }
                        });
                    } else {
                        deferred.resolve(0);
                    }
                } else {
                    deferred.resolve(1);
                }
            });
        }else {
            // 没勾选提交svn选项，检查testonline目录
            fs.exists(path.resolve(testonlinePath+'/.svn'), function(exists){
                if (!exists) {
                    if (fs.existsSync(testonlinePath)) {
                        cmdMsg.add('====发现未创建的版本删除: '+testonlinePath);
                        exec('rm -rf ' + testonlinePath, function(err, stdout, stderr){
                            cmdMsg.add(stdout+stderr);
                            if(stderr){
                                deferred.reject();
                            }else{
                                deferred.resolve(0);
                            }
                        });
                    } else {
                        deferred.resolve(0);
                    }
                } else {
                    deferred.resolve(1);
                }
            });
        }

        return deferred.promise;
    })
    // 从svn下载online trunk文件 到 onlinePath对应的项目目录
    .then(function(hasTrunk){
        var deferred = Q.defer();

        var svnParams, method;
        if(packInfo.isPackOnline === '1') {
            // 勾选了提交svn选项
            cmdMsg.add('=========下载Online Trunk文件=========');
            if (!hasTrunk) {
                svnParams = [svnOnlineTrunk, onlinePath, '--config-dir', svnConfigDir
                ];
                method = 'checkout';
            } else {
                svnParams = [svnOnlineTrunk, onlinePath, '--config-dir',
                        svnConfigDir, '--accept', 'theirs-conflict' //, '--ignore-ancestry'
                ];
                method = 'sw';
            }
            svnClient[method](svnParams, {
                stdout: stdout,
                stderr: stderr,
                close : function(outMsg, errMsg, code, signal){
                    if (cmdMsg.hasError()) {
                        exec('rm -rf ' + onlinePath, function(err, stdout, stderr){
                            cmdMsg.add('请重新打包！', cmdMsg.ERROR);
                            cmdMsg.add((err?err:''), cmdMsg.ERROR);
                            cmdMsg.add('\nstdout:\n'+stdout, cmdMsg.ERROR);
                            cmdMsg.add('\nstderr:\n'+stderr, cmdMsg.ERROR);
                        });

                    } else {
                        deferred.resolve(svnOnlineTrunk);
                    }
                },
                error: error
            });
        }else {
            // 没有勾选提交svn选项
            cmdMsg.add('=========下载testonline文件=========');
            if (!hasTrunk) {
                svnParams = [svnTestonline, testonlinePath, '--config-dir', svnConfigDir
                ];
                method = 'checkout';
            } else {
                svnParams = [svnTestonline, testonlinePath, '--config-dir',
                        svnConfigDir, '--accept', 'theirs-conflict' //, '--ignore-ancestry'
                ];
                method = 'sw';
            }
            svnClient[method](svnParams, {
                stdout: stdout,
                stderr: stderr,
                close : function(outMsg, errMsg, code, signal){
                    if (cmdMsg.hasError()) {
                        exec('rm -rf ' + testonlinePath, function(err, stdout, stderr){
                            cmdMsg.add('请重新打包！', cmdMsg.ERROR);
                            cmdMsg.add((err?err:''), cmdMsg.ERROR);
                            cmdMsg.add('\nstdout:\n'+stdout, cmdMsg.ERROR);
                            cmdMsg.add('\nstderr:\n'+stderr, cmdMsg.ERROR);
                        });

                    } else {
                        deferred.resolve(svnTestonline);
                    }
                },
                error: error
            });
        }

        return deferred.promise;
    })
    // 将压缩后的文件Copy到Online Trunk，提交online目录
    .then(function(){
        var deferred = Q.defer();

        if(packInfo.isPackOnline === '1') {
            // 勾选了提交svn选项
            cmdMsg.add('=========将压缩后的文件Copy到Online Trunk=========');
            exec(['rsync', '-r', tmpMinifyPath+'/', onlinePath, '-av', '--exclude', '.svn'].join(' '),
            function(err, outMsg, errMsg){
                if (!err && !errMsg) {
                    cmdMsg.add(outMsg);
                    deferred.resolve();
                } else {
                    cmdMsg.add(err);
                    cmdMsg.end(errMsg);
                }
            });
        }else {
            // 没有勾选提交svn选项
            cmdMsg.add('=========将压缩后的文件Copy到testonline目录=========');
            exec(['rsync', '-r', tmpMinifyPath+'/', testonlinePath, '-av', '--exclude', '.svn'].join(' '),
            function(err, outMsg, errMsg){
                if (!err && !errMsg) {
                    cmdMsg.add(outMsg);
                    deferred.resolve();
                } else {
                    cmdMsg.add(err);
                    cmdMsg.end(errMsg);
                }
            });
        }

        return deferred.promise;
    })
    .then(function(){
        // 添加上传文件
        var deferred = Q.defer();

        if(packInfo.isPackOnline === '1') {
            // 勾选了提交svn选项
            cmdMsg.add('=========新添加上传文件Add到Online Trunk=========');
            exec('svn st '+onlinePath+' | awk \'{if ( $1 == \"?\") { print "svn add " $2}}\' | bash',function(err, outMsg, errMsg){
                cmdMsg.add('==============\nsvn add 结束');
                if(outMsg) {
                    cmdMsg.add(outMsg);
                }
                if(errMsg) {
                    cmdMsg.add(errMsg);
                }
                if (err) {
                    cmdMsg.end(err, cmdMsg.ERROR);
                } else {
                    deferred.resolve(1);
                }
            });
        }else {
            // 没有勾选提交svn选项
            cmdMsg.add('=========新添加上传文件Add到testonline目录=========');
            exec('svn st '+testonlinePath+' | awk \'{if ( $1 == \"?\") { print "svn add " $2}}\' | bash',function(err, outMsg, errMsg){
                cmdMsg.add('==============\nsvn add 结束');
                if(outMsg) {
                    cmdMsg.add(outMsg);
                }
                if(errMsg) {
                    cmdMsg.add(errMsg);
                }
                if (err) {
                    cmdMsg.end(err, cmdMsg.ERROR);
                } else {
                    deferred.resolve(1);
                }
            });
        }

        return deferred.promise;
    })
    .then(function(){
        // 提交online trunk上传到SVN
        var deferred = Q.defer();

        var msg, cmdParam;
        if(packInfo.isPackOnline === '1') {
            // 勾选了提交svn选项
            msg = ['"Submit online version. By', packInfo.svnAccount, packInfo.svnUrl, '"'].join(' ');
            cmdParam = [onlinePath, '--config-dir', svnConfigDir, '-m', msg];
            cmdMsg.add('=========将压缩后的文件commit到Online Trunk=========');
            svnClient.commit(cmdParam, {
                stdout: stdout,
                stderr: stderr,
                error : error,
                close : function(outMsg, errMsg, code, signal){
                    if (cmdMsg.hasError()) {
                        cmdMsg.end('code:' + code + ' signal:' + signal, cmdMsg.ERROR);
                    } else {
                        deferred.resolve(1);
                    }
                }
            });
        }else {
            // 没有勾选提交svn选项
            msg = ['"Submit testonline version. By', packInfo.svnAccount, packInfo.svnUrl, '"'].join(' ');
            cmdParam = [testonlinePath, '--config-dir', svnConfigDir, '-m', msg];
            cmdMsg.add('=========将压缩后的文件commit到testonline=========');
            svnClient.commit(cmdParam, {
                stdout: stdout,
                stderr: stderr,
                error : error,
                close : function(outMsg, errMsg, code, signal){
                    if (cmdMsg.hasError()) {
                        cmdMsg.end('code:' + code + ' signal:' + signal, cmdMsg.ERROR);
                    } else {
                        deferred.resolve(1);
                    }
                }
            });
        }

        return deferred.promise;
    })

    // 将未压缩的文件copy到Dev Tag
    .then(function(){
        if (packInfo.isPackOnline !== '1') {
            // 没有勾选提交svn选项，退出
            return;
        }

        var deferred = Q.defer();
        
        // 获取online trunk的svn版本号
        svnClient.info(['--config-dir', svnConfigDir, svnOnlineTrunk], {
            stdout: stdout,
            stderr: stderr,
            close: function(svnMsg){
                var revision = (/Last Changed Rev: (\d+)/).exec(svnMsg)[1];
                var svnDevTag = svnDevTagsUrl + '/' + revision;

                cmdMsg.add('检查Dev Tag是否存在：' + svnDevTag);
                svnClient.info(['--config-dir', svnConfigDir, svnDevTag], {
                    stdout: stdout,
                    stderr: stderr,
                    close: function(svnMsg){
                        if (!cmdMsg.hasError()) {
                            if (-1 === svnMsg.indexOf('URL: ' + svnDevTag)) {
                                // 不存在，提交dev tag
                                cmdMsg.add('=========将未压缩的文件copy到Dev Tag=========');
                                var msg = ['"Submit version. By', packInfo.svnAccount, '"'].join(' ');
                                var cmdParam = [svnDevTrunk, svnDevTag, '--config-dir', svnConfigDir, '-m', msg];
                                svnClient.copy(cmdParam, {
                                    stdout: stdout,
                                    stderr: stderr,
                                    error : error,
                                    close : function(outMsg, errMsg, code, signal){
                                        if (cmdMsg.hasError()) {
                                            cmdMsg.end('code:' + code + ' signal:' + signal, cmdMsg.ERROR);
                                        } else {
                                            deferred.resolve(1);
                                        }
                                    }
                                });
                            } else {
                                // 该tag已存在，不提交svn
                                cmdMsg.add('Dev Tag 已存在，不提交: ' + svnDevTag);
                                deferred.resolve(1);
                            }
                        } else {
                            reject(new Error('发生错误'));
                        }
                    },
                    error: error
                });
            },
            error: error
        });

        return deferred.promise;
    })
    // 将压缩后的文件copy到Online Tag
    .then(function(){
        if (packInfo.isPackOnline !== '1') {
            // 没有勾选提交svn选项，退出
            return;
        }

        var deferred = Q.defer();

        // 获取online trunk的svn版本号
        svnClient.info(['--config-dir', svnConfigDir, svnOnlineTrunk], {
            stdout: stdout,
            stderr: stderr,
            close: function(svnMsg){
                var revision = (/Last Changed Rev: (\d+)/).exec(svnMsg)[1];
                var svnOnlineTag = svnOnlineTagsUrl + '/' + revision;

                cmdMsg.add('检查Online Tag是否存在：' + svnOnlineTag);
                svnClient.info(['--config-dir', svnConfigDir, svnOnlineTag], {
                    stdout: stdout,
                    stderr: stderr,
                    close: function(svnMsg){
                        if (!cmdMsg.hasError()) {
                            if (-1 === svnMsg.indexOf('URL: ' + svnOnlineTag)) {
                                // 不存在，提交online tag
                                cmdMsg.add('=========将压缩后的文件copy到Online Tag=========');
                                var msg = ['"Submit version. By', packInfo.svnAccount, '"'].join(' ');
                                var cmdParam = [svnOnlineTrunk, svnOnlineTag, '--config-dir', svnConfigDir, '-m', msg];
                                svnClient.copy(cmdParam, {
                                    stdout: stdout,
                                    stderr: stderr,
                                    error : error,
                                    close : function(outMsg, errMsg, code, signal){
                                        if (cmdMsg.hasError()) {
                                            cmdMsg.end('code:' + code + ' signal:' + signal, cmdMsg.ERROR);
                                        } else {
                                            deferred.resolve(1);
                                        }
                                    }
                                });
                            } else {
                                // 该tag已存在，不提交svn
                                cmdMsg.add('Online Tag 已存在，不提交: ' + svnOnlineTag);
                                deferred.resolve(1);
                            }
                        } else {
                            reject(new Error('发生错误'));
                        }
                    },
                    error: error
                });
            },
            error: error
        });

        return deferred.promise;
    })

    .then(function(){
        cmdMsg.end('打包完成！\n耗时：'+(Date.now() - startTime)+' ms');
    }).catch(function(err){
        console.log('出错了',err);
        cmdMsg.end(err, cmdMsg.ERROR);
    });

}

module.exports = {
    start: function (packInfo, cmdMsg, processUser, docRoot) {
        Pack(packInfo, cmdMsg, processUser, docRoot);
    }
};