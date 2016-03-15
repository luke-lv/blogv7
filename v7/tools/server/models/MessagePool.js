/**
 * 信息池
 * @author wangqiang
 * @date 14/12/26
 */
var uuid = require('node-uuid');

var pool = {};

var count = 1;

var length = 0;

module.exports = {
	get length() {
		return length;
	},
	/**
	 * 设置消息池的消息
	 * @param channel
	 * @param val
	 */
	set: function (channel, val) {
		if (pool.channel && val) {
			length ++;
		}
		pool[channel] = val;
	},
	/**
	 * 获取消息池的消息
	 * @param channel
	 * @returns {*}
	 */
	get: function (channel) {
		return pool[channel];
	},
	/**
	 * 删除消息池里的消息
	 * @param channel
	 */
	remove: function(channel){
		if ('string' === typeof channel) {
			pool[channel] = null;
			delete pool[channel];
		} else {
			for (var p in pool) {
				if (pool[p] == channel) {
					pool[p] = null;
					delete pool[p];
				}
			}
		}

	},
	getId: function(){
		return uuid.v4();
	}
}