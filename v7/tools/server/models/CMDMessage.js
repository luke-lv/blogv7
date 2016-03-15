var EventEmitter = require('events').EventEmitter;
var util = require('util');
/**
 * 存储命令行信息类
 * @author wangqiang
 * @date 14/11/26
 */
function CMDMessage() {
	this._cachedData = [];
	this.isEnd = false;
	this.isError = false;
}
util.inherits(CMDMessage, EventEmitter);

CMDMessage.prototype.add = function (data, code) {
	code = code || CMDMessage.SUCCESS;
	var cache = {data: data, code: code};
	if (code == CMDMessage.ERROR) {
		this.isError = true;
	}
	this._cachedData.push(cache);
	this.emit('data', cache);
};
CMDMessage.prototype.end = function (msg, code) {
//    this.clear();
	this.isEnd = true;
	if (msg) {
		this.add(msg, code);
	}
	this.emit('end', this.getData());
};
CMDMessage.prototype.clear = function () {
	this._cachedData = [];
};
CMDMessage.prototype.remove = function (item) {
	var data = this.getData();
	var index = data.indexOf(item);
	if (index > -1) {
		data.splice(index, 1)
	}
};

CMDMessage.prototype.getData = function(){
	return this._cachedData;
};

CMDMessage.prototype.hasError = function(){
	return this.isError;
};

['SUCCESS', 'ERROR'].forEach(function(status){
	CMDMessage[status] = CMDMessage.prototype[status] = status;
});

module.exports = CMDMessage;

