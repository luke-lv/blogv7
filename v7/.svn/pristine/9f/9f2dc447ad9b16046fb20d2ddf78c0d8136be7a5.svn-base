/**
获取接口配置实例
**/

define('mods/common/getTransmission',function(require,exports,module){

	var $transmission = require('lib/common/transmission');
	var $find = require('lib/kit/obj/find');
	var $alert = require('mods/common/alert');
	var $log = require('mods/common/log');

	module.exports = function(){
		return new $transmission({
			verify : function(rs, conf, options){
				var result = false;
				var status = $find(rs, 'result.status');
				var data = $find(rs, 'result.data');

				var showLog = function(str){
					$log(
						str,
						'url:', conf.url,
						'rs:', rs,
						'conf:', conf,
						'options:', options
					);
				};

				if(status && data){
					if(status.code === 0){
						result = true;
					}else{
						if(conf.autoExecuteError){
							if(status.msg){
								$alert(status.msg);
							}else{
								$alert('系统繁忙');
							}
						}
						showLog('接口返回数据 status.code 不为 0 。');
					}
				}else{
					if(conf.autoExecuteError){
						$alert('系统繁忙');
					}
					showLog('接口返回数据格式不正确。');
				}
				return result;
			}
		});
	};

});
