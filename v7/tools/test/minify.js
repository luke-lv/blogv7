/**
 * Created file.
 * @author wangqiang
 * @date 15/1/8
 */
var UglifyJS = require('uglify-js');
var start = +new Date();
var miniResult = UglifyJS.minify('../cmd/combine_files/blog7/editor_new_publish.dev.js');
console.log(miniResult);
console.log(+new Date() - start, 'ms');