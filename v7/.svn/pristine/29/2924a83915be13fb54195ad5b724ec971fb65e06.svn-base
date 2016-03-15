/**
 * Created file.
 * @author wangqiang
 * @date 15/1/15
 */
var child_process = require('child_process');
var n = child_process.fork('./child.js');
n.stdout.on('data', function(chunk){
	console.log(chunk.toString());
});
n.on('message', function(m) {
	console.log('PARENT got message:', typeof m);
});
n.send({ hello: 'world' });