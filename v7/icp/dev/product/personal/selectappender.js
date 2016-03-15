/**
 * 个人资料模块通用方法 
 * scope.personal.SelectAppender-年月日 联动部分
 */

$import("sina/sina.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/array/findit.js");

if(typeof(scope)=="undefined"){
	var scope={};
}

scope.personal={};

/**
 * select数据添加器
 * @param {Number} step 步长
 */
scope.personal.SelectAppender=function(step){
	this.step=step || 1;
};
scope.personal.SelectAppender.prototype={
	initialize:function(selObj,startValue,endValue){
		var i,m;
		if(this.step>=0){
			i=Math.min(startValue,endValue);
			m=Math.max(startValue,endValue);
			for (i; i <= m; i += this.step) {
			selObj.options.add(new Option(i,i));
				
			}
		}else{
			i=Math.max(startValue,endValue);
			m=Math.min(startValue,endValue);
			for (i; i >= m; i += this.step) {
				selObj.options.add(new Option(i,i));
			}
		}
		
	}
};


(function(proxy){
	var dateNum = function(y,m){

		if(!(y*m)){return 0;}
		var d = 31;
		switch(m){
			case 4:
			case 6:
			case 9:
			case 11:
				d = 30;
				break;
			case 2:
				d =new Date(y,2,0).getDate();
				break;
		}
		return d;
	};
	var operItem = function(dom,n){
		var ov = parseInt(dom.value) || 0;
		if(/msie/i.test(navigator.userAgent)){
			setTimeout(operDom, 200);
		}else{
			operDom();
		}
		function operDom(){
			while(dom.options.length > 1){
				dom.remove(1);
			}
			for(var i = 1; i <=n; i++){
				dom.options[dom.options.length] = new Option(i,i);
			}
			dom.value = Math.min(ov,n);
		}
	};
	scope.personal.selecter = function(oYear,oMonth,oDate,value){
		var sel = function(){
			operItem(oDate,dateNum(parseInt(oYear.value),parseInt(oMonth.value)));
		};
		Core.Events.addEvent(oYear, sel, 'change');
		Core.Events.addEvent(oMonth, sel, 'change');
		sel();
		oDate.value = value || "0";
	};
})();

