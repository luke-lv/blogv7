/**
分页模型
**/

define('mods/model/paging',function(require,exports,module){

	var $ = require('lib');
	var $model = require('lib/mvc/model');

	var Paging = $model.extend({
		defaults : {
			//页码列表中页码的数量
			listSize : 5,
			//页码最小为1
			current : 1,
			//总数量
			total : 1,
			//分页数量
			size : 1,
			//第一页页码
			first : 1,
			//最后一页页码
			last : 1,
			//上一页页码
			prev : null,
			//下一页页码
			next : null,
			//中间页码列表
			list : []
		},
		events : {
			'change:listSize' : 'compute',
			'change:current' : 'compute',
			'change:total' : 'compute',
			'change:size' : 'compute'
		},
		processors : {
			total : {
				set : function(value){
					return parseInt(value, 10) || 1;
				}
			},
			size : {
				set : function(value){
					return parseInt(value, 10) || 1;
				}
			},
			current : {
				set : function(value){
					return parseInt(value, 10) || 1;
				}
			},
			listSize : {
				set : function(value){
					return parseInt(value, 10) || 0;
				}
			}
		},
		compute : function(){
			var total = this.get('total');
			var size = this.get('size');
			var current = this.get('current');

			var first = 1;
			var last = Math.ceil(total / size);

			current = Math.min(Math.max(1, current), last);

			var prev = current - 1;
			if(prev <= 0){
				prev = null;
			}

			var next = current + 1;
			if(next > last){
				next = null;
			}

			var listSize = this.get('listSize');
			var pages = (function(){
				var list = [];
				var step = 0;
				var item = current;
				var delta = 0;

				for(step = 0; step < last * 2; step++){
					delta = Math.ceil(step / 2);
					delta = (step % 2 === 0) ? 0 - delta : delta;
					item = current + delta;
					if(item > 0 && item <= last){
						if(delta >= 0){
							list.push(item);
						}else{
							list.unshift(item);
						}
						if(list.length >= listSize){
							break;
						}
					}
				}

				return list;
			})();

			this.set({
				total : total,
				size : size,
				current : current,
				first : first,
				last : last,
				prev : prev,
				next : next,
				list : pages
			});

			this.trigger('compute');
		}
	});

	module.exports = Paging;

});
