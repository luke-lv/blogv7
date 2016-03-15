/**
 * @fileoverview 类和接口的定义
 * @author Random | YangHao@staff.sina.com.cn
 * @enhanced dcw1123 | chengwei1@staff.sina.com.cn
 * @created 2010-10-14
 * @updated 2010-12-12
 * @example
 */
(function(){
	
	
	// 增强的：
	// this.$host 是宿主类的实例，并且 this.$host.$host... 可以链下去。
	Function.prototype.$define = function(def){
		var __this = this;
		return function(){
			var __me = this;
			__me.imHost = true;
			(function(){
				Array.prototype.push.call(arguments.callee.caller.arguments, __me);
				var args = arguments.callee.caller.caller.arguments;
				var idx = args.length-1;
				var maybeHost = idx>-1 ? args[idx] : null;
				__me.$host = (maybeHost && maybeHost.imHost) ? maybeHost : null;
			})();
			__this.apply(this, arguments);
		}.$define_lv2(def);
	};
	
	
	// 类的定义
	Function.prototype.$define_lv2 = function(def){
		var k;
		for(k in def){
			this.prototype[k] = def[k];
		}
		if(this.__interface__){
			for(k in this.prototype){
				if(this.prototype[k] === "NI"){
					throw new Error("类定义错误，接口方法[" + k + "]未实现");
				}
			}
		}
		this.prototype.constructor = this;
		this.$extends = this.$define = this.$implements = function(){
			throw new Error("$define 语句定义后面不能再作其它定义");
		};
		return this;
	};
	
	
	// 类继承的定义，增强的：
	// SubClass.$super.show.call(this); 可用 this.$super.show() 代替。
	Function.prototype.$extends = function(){
		var me = this;
		var i = arguments.length;
		var sup;
		var fn;
		if(i === 0){
			throw new Error("$extends 语句错误：未指定父类");
		}
		sup = arguments[0];
		fn = function(){
			var _this = this;
			this.$super = {};
			for(var fName in sup.prototype){		// 防止 for in 出 undefined
				if(!sup.prototype[fName]) continue;
				this.$super[fName] = (function(f){
					return function(){
						sup.prototype[f].apply(_this, arguments);
					}
				})(fName);
			}
			sup.apply(this, arguments);
			me.apply(this, arguments);
		};
		fn.prototype = object(sup.prototype);
		fn.prototype.constructor = fn;
		return fn;
	};
	
	
	// 接口实现方法的定义，接口是以 Object 对象的空方法实现的
	Function.prototype.$implements = function(){
		var arg = Array.prototype.slice.call(arguments, 0);
		var fn;
		var i = arg.length;
		var k;
		while(i--){
			if(typeof arg[i] !== "object"){
				throw new Error("$implements 语句错误：参数必须为 object 类型");
			}
			for(k in arg[i]){
				typeof this.prototype[k] === "undefined" && (this.prototype[k] = "NI");
			}
		}
		this.__interface__ = true;
		this.$extends = function(){
			throw new Error("$extends 语句错误：$extends 语句不能出现在 $implements 定义之后");
		};
		return this;
	};
	
	
	// 
	function object(o){
		function F(){}
		F.prototype = o;
		return new F();
	}
	
})();





