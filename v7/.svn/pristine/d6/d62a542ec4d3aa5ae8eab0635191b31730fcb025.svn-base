var Spawn = require('./easy-spawn').spawn;
var async = require('async');
var util  = require('util');
/**
 * svn处理，增加
 * from: https://github.com/ddliu/node-svn-spawn/blob/master/lib/svn.js
 * @author wangqiang
 * @date 15/1/13
 */
var Client = function(opts){
	this._options = {};
	this.option({
		program: 'svn'
	}).option(opts || {});
};

Client.prototype.option = function(opt){
	this.mix(this._options, opt);
	return this;
};

Client.prototype.getOption = function(optName){
	return this._options[optName];
};

Client.prototype.mix = function(orignal, defauts){
	for (var p in defauts){
		if (typeof(orignal[p])=='undefined' && defauts.hasOwnProperty(p)) {
			orignal[p] = defauts[p];
		}
	}
	return orignal;
}

Client.prototype.cmd = function(params, callback) {
	params = params || [];
	if (!util.isArray(params)) {
		params = [params];
	}
	if (this.getOption('username') !== undefined) {
		params.push('--username', this.getOption('username'));
	}
	if (this.getOption('password') !== undefined) {
		params.push('--password', this.getOption('password'));
	}

	Spawn(this.getOption('program'), params, callback);

};

Client.prototype.joinParams = function(){
	var result = [];
	for (var i = 0; i < arguments.length; i++) {
		if (arguments[i] !== undefined && arguments[i] !== null) {
			if (util.isArray(arguments[i])) {
				result = result.concat(arguments[i]);
			}
			else {
				result.push(arguments[i]);
			}
		}
	}

	return result;
};

/**
 *
 * @param params
 * @param callback
 */
Client.prototype.checkout = function(params, callback) {

	if (typeof params === 'function') {
		callback = params;
		params = null;
	}

	params = this.joinParams('checkout', params);

	this.cmd(params, callback);
};

Client.prototype.update = function(params, callback) {
	if (typeof params === 'function') {
		callback = params;
		params = null;
	}
	params = this.joinParams('update', params);

	this.cmd(params, callback);
};

Client.prototype.copy = function(params, callback) {
	if (typeof params === 'function') {
		callback = params;
		params = null;
	}
	params = this.joinParams('copy', params);

	this.cmd(params, callback);
};

Client.prototype.sw = function(params, callback){
	if (typeof params === 'function') {
		callback = params;
		params = null;
	}
	params = this.joinParams('sw', params);

	this.cmd(params, callback);
};

Client.prototype.commit = function(params, callback) {
	if (typeof params === 'function') {
		callback = params;
		params = null;
	}
	params = this.joinParams('commit', params);

	this.cmd(params, callback);
};

Client.prototype.add = function(params, callback) {
	if (typeof params === 'function') {
		callback = params;
		params = null;
	}
	params = this.joinParams('add', params);

	this.cmd(params, callback);
};

Client.prototype.del = function(params, callback) {
	if (typeof params === 'function') {
		callback = params;
		params = null;
	}
	params = this.joinParams('delete', params);

	this.cmd(params, callback);
};

Client.prototype.info = function(params, callback) {
	if (typeof params === 'function') {
		callback = params;
		params = null;
	}

	params = this.joinParams('info', params);

	this.cmd(params, callback);
};

/**
 * svn info with parsed info in callback
 * @param  {Mixed}   params
 * @param  {Function} callback
 */
Client.prototype.getInfo = function(params, callback) {
	throw new Error('暂不支持');
	if (typeof params === 'function') {
		callback = params;
		params = null;
	}
	var self = this;

	params = this.joinParams(['info', '--xml'], params),

		async.waterfall([
			function(callback) {
				self.session('silent', true).cmd(params, callback);
			},
			function(data, callback) {
				xml2js.parseString(data,
					{
						explicitRoot: false,
						explicitArray: false
					},
					callback
				);
			},
		], function(err, data) {
			if (callback) {
				if (err) {
					callback(err);
				}
				else {
					callback(err, data.entry);
				}
			}
		});
};

Client.prototype.status = function(params, callback) {
	if (typeof params === 'function') {
		callback = params;
		params = null;
	}

	params = this.joinParams('status', params);

	this.cmd(params, callback);
};

/**
 * svn status with parsed info in callback
 *
 * @see status list https://github.com/apache/subversion/blob/trunk/subversion/svn/schema/status.rnc
 * @param  {Mixed}   params
 * @param  {Function} callback
 */
Client.prototype.getStatus = function(params, callback) {
	throw new Error('暂不支持');
	if (typeof params === 'function') {
		callback = params;
		params = null;
	}
	var self = this;

	params = this.joinParams(['status', '--xml'], params);

	async.waterfall([
		function(callback) {
			self.session('silent', true).cmd(params, callback);
		},
		function(data, callback) {
			xml2js.parseString(data,
				{
					explicitRoot: false,
					explicitArray: false
				},
				callback
			);
		}
	], function(err, data) {
		if (callback) {
			if (err) {
				callback(err);
			}
			else {
				var list = [];
				if ('target' in data) {
					data = data.target;
					if ('entry' in data) {
						if (util.isArray(data.entry)) {
							for (var i = 0; i < data.entry.length; i++) {
								list.push(data.entry[i]);
							}
						} else {
							list.push(data.entry);
						}
					}
				}
				callback(null, list);
			}
		}
	});
};

Client.prototype.log = function(params, callback) {
	if (typeof params === 'function') {
		callback = params;
		params = null;
	}

	params = this.joinParams('log', params);
	this.cmd(params, callback);
};

/**
 * svn log with parsed info in callback
 * sample result:
 * <code>
 * [
 * { '$': { revision: '1' },
 *   author: 'dong',
 *   date: '2013-05-21T10:23:35.427701Z',
 *   msg: 'tt'
 * } ...
 * ]
 * </code>
 * @param  {Mixed}   params
 * @param  {Function} callback
 */
Client.prototype.getLog = function(params, callback) {
	throw new Error('暂不支持');
	if (typeof params === 'function') {
		callback = params;
		params = null;
	}

	var self = this;

	params = this.joinParams(['log', '--xml'], params);

	async.waterfall([
		function(callback) {
			self.session('silent', true).cmd(params, callback);
		},
		function(data, callback) {
			xml2js.parseString(data,
				{
					explicitRoot: false,
					explicitArray: false
				},
				callback
			);
		}
	], function(err, data) {
		if (callback) {
			if (err) {
				callback(err);
			}
			else {
				var list = [];
				if (util.isArray(data)) {
					for (var i = 0; i < data.length; i++) {
						list.push(data[i].logentry);
					}
				}
				else if('logentry' in data) {
					list.push(data.logentry);
				}
				callback(null, list);
			}
		}
	});
};

/**
 * Add all local changes to for commit
 *
 * @param  {Object}   options
 *         - status
 * @param  {Function} callback
 */
Client.prototype.addLocal = function(options, callback) {
	throw new Error('暂不支持');
	if (typeof options === 'function') {
		callback = options;
		options = {
			status: null
		}
	}

	if (!'status' in options) {
		options.status = null;
	}

	var self = this;

	async.waterfall([
		function(callback) {
			self.getStatus(callback);
		},
		function(data, callback) {
			// do not run in parallel, or svn might be locked
			async.eachSeries(data, function(info, callback) {
				var path = info.$.path,
					status = info['wc-status'].$.item;

				if (options.status === null || options.status.indexOf(status) !== -1) {
					// add
					if (['none', 'unversioned'].indexOf(status) !== -1) {
						self.add(path, function(err) {
							callback(err);
						});
					}
					// delete
					else if(['missing'].indexOf(status) !== -1) {
						self.del(path, function(err) {
							callback(err);
						});
					}
					else {
						callback(null);
					}
				}
				else {
					callback(null);
				}
			}, function(err) {
				callback(err);
			});
		}
	], function(err) {
		callback && callback(err);
	});
};

Client.prototype.addLocalUnversioned = function(options, callback) {
	if (typeof options === 'function') {
		callback = options;
		options = {
		};
	}
	else if(options === undefined || options === null){
		options = {

		}
	}
	options.status = 'unversioned';
	this.addLocal(options, callback);
};



module.exports = Client;