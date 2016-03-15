/**
 * @fileoverview
 *	调用uics给scope.nick 赋值
 * @author dg.liu | dongguang@staff.sina.com.cn
 * @version 1.0
 * @since 2009-03-18
 */
$import("lib/uic.js");
$import("sina/core/function/bind3.js");

setNick = {
	isWokding:0,
	get:function(callBack){
		var callBack = callBack || function(){};
		if((this.isWokding!=0&& this.isWokding<10) && !scope.nick){
			setTimeout(Core.Function.bind3(this.get,this,[callBack]),1000);
			this.isWokding++;
			return;
		}
		var _this=this;
		this.isWokding=1;
		if(scope.nick){
			_this.isWokding=0;
			callBack();
		}else{
			Lib.Uic.getNickName([scope.$uid],function(result){
				scope.nick=result;
				_this.isWokding=0;
				callBack();
			});
		}
	}
};