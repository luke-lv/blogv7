/**
 * Created file.
 * @author wangqiang
 * @date 15/1/5
 */
var fs = require('fs');
fs.readdir('./', function(err, files){
	console.log(files);
})