/**
 * Created file.
 * @author wangqiang
 * @date 15/1/13
 */
var util = require('util');
var obj = util.inspect({a:1, b:2}, {a:2, c:3});
console.log(obj);