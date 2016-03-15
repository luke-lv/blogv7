/**
@fileoverflow jquery plugin, 有限制字数的textarea
@authors yifei2 (yifei2@staff.sina.com.cn)
**/
define('plugins/limitTextarea/limitTextarea', function(require, exports, module) {

	var $ = require('lib');

	$.fn.limitTextarea = function(opts) {
		var defaults = {
			// 允许输入的最大字数
			maxNumber: 140,
			// 字数节点
			numberNode: null,
			// 输入后，字数未超出时调用的函数
			onOk: function(remainNumber) {},
			// 输入后，字数超出时调用的函数
			onOver: function(extraNumber) {}
		};
		var option = $.extend(defaults, opts);

		this.each(function() {
			var _this = $(this);
			if (option.numberNode) {
				option.numberNode.html(option.maxNumber);
			}

			// 回调
			var fn = function() {
				var remainNumber = option.maxNumber - _this.val().length;

				if (remainNumber >= 0) {
					if (option.numberNode) {
						option.numberNode.html(remainNumber);
					}
					option.onOk(remainNumber);
				} else {
					if (option.numberNode) {
						option.numberNode.html(0);
					}
					// 超过字数截取
					// _this.val(_this.val().substr(0, option.maxNumber));
					option.onOver((-remainNumber));
				}
			};

			// 绑定输入事件监听器
			if (window.addEventListener) {
				_this.get(0).addEventListener("input", fn, false);
			} else {
				_this.get(0).attachEvent("onpropertychange", fn);
			}
			if (window.VBArray && window.addEventListener) {
				// IE9
				_this.get(0).attachEvent("onkeydown", function() {
					var key = window.event.keyCode;
					// 处理回退与删除
					if (key === 8 || key === 46) {
						fn();
					}
				});
				// 处理粘贴
				_this.get(0).attachEvent("oncut", fn);
			}
		});
	};
});

