/**
 * Created file.
 * @author wangqiang
 * @date 15/1/15
 */
process.on('message', function(m) {
	console.log('CHILD got message:', m);
});
process.send({ foo: 'bar' });