/**
 * 服务器启动
 * @author wangqiang
 * @date 14/11/3
 */
var jspack = require('./server/app');

jspack.start(function (server) {
    console.info('Express for jspack_v4 listening at http://localhost:%s', server.address().port);
});