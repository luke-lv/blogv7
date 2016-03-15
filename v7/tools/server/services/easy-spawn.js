/**
 * Created file.
 * @author wangqiang
 * @date 15/1/15
 */
var cp = require('child_process');
var Spawn = cp.spawn;
function mix(orignal, defauts){
	for (var p in defauts){
		if (typeof(orignal[p])=='undefined' && defauts.hasOwnProperty(p)) {
			orignal[p] = defauts[p];
		}
	}
	return orignal;
}
exports.spawn = function(cmd, params, opts){
	var emptyFn = new Function();
	var cmd = Spawn(cmd, params, {cwd: opts.cwd || __dirname});
	var cmdStdin  = cmd.stdin,
		cmdStdout = cmd.stdout,
		outMsg    = '',
		cmdStderr = cmd.stderr,
		errMsg    = '';
	if (typeof opts === 'function') {
		var oldOpts = opts;
		opts = {
			close: oldOpts
		}
	}
	opts = mix(opts, {
		close : emptyFn,
		error : emptyFn,
		stderr: emptyFn,
		stdout: emptyFn
	});
	cmdStderr.on('data', function(data){
		var str = data.toString();
		errMsg += str;
		opts.stderr.call(cmd, str, errMsg, cmdStdin);
	});
	cmdStdout.on('data', function(data){
		var str = data.toString();
		outMsg += str;
		opts.stdout.call(cmd, str, outMsg, cmdStdin) ;
	});
	cmd.on('close', function(code, signal){
		opts.close.call(cmd, outMsg, errMsg, code, signal)
	}).on('error', function(err){
		opts.error.call(cmd, err, outMsg, errMsg)
	});
};

exports.exec = cp.exec;