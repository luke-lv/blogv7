/**
 * 个人资料模块通用方法
 */

$import("sina/sina.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/array/findit.js");

$import("lib/config/cityConfig.js");


if(typeof(scope)=="undefined"){
	var scope={};
}

scope.personal={};

/**
 * 获取指定name的radio button的选中项的值
 * @param {String} name
 */
scope.personal.getRBValueByName=function(name){
	for(var i=0;i<$N(name).length;i++){
		if($N(name)[i].checked){
			return $N(name)[i].value;
		}
	}
};


/**
 * 错误消息管理器
 * @param {String} msgObjIDs
 */
scope.personal.FailedMsgManager=function(msgObjIDs){
	this._msgObjIDs = msgObjIDs || [];
};
scope.personal.FailedMsgManager.prototype={
	showFailed:function(msgObjID){
		$E(msgObjID).style.display="";
	},
	hiddenFailed:function(msgObjID){
		$E(msgObjID).style.display="none";
	},
	clearAll:function(){
		var i,len=this._msgObjIDs.length;
		for(i=0;i<len;i++){
			$E(this._msgObjIDs[i]).style.display="none";
		}
	}
};

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
				var op = $C("option");
				op.innerHTML = i;
				op.value = i;
				selObj.appendChild(op);
			}
		}else{
			i=Math.max(startValue,endValue);
			m=Math.min(startValue,endValue);
			for (i; i >= m; i += this.step) {
				var op = $C("option");
				op.innerHTML = i;
				op.value = i;
				selObj.appendChild(op);
			}
		}
		
	}
};

/**
 * JSON转换为字符串的方法
 * @param {Object} json
 */
scope.personal.jsonToString=function(json){
	var k,s=[];
	for(k in json){
		s.push("\""+k+"\":\""+json[k].toString().replace(/"/g,"\\\"")+"\"");
	}
	return "{"+s.join(",")+"}";
};

/**
 * 根据value设置select
 * @param {Object} selObj
 * @param {String} v
 */
scope.personal.setSelectValue=function(selObj,v){
	var i,len=selObj.length;
	for(i=0;i<len;i++){
		if(selObj.options[i].value==v){
			selObj.selectedIndex=i;
			break;
		}
	}
};


/**
 * @author Robin Young | yonglin@staff.sina.com.cn
 */

(function(proxy){
	var dateNum = function(y,m){
		var isLeap = function(y){
			return y%400?(y%100?(y%4?0:1):0):1;
		};
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
				d = isLeap(y) ? 29 : 28;
				break;
		}
		return d;
	};
	var operItem = function(dom,n){
		var ov = parseInt(dom.value) || 0;
		if(/msie/.test(navigator.userAgent.toLowerCase())){
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
})(scope.personal);




/**
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @modified by Random | YangHao@staff.sina.com.cn
 * @省市的选择级联
 */

(function(){
	var Group = scope.Group;
	
	scope.personal.ProvinceAndCity = function(provDom,cityDom,provCode,cityCode){
		this.provDom  = provDom;
		this.cityDom  = cityDom;
		this.provCode = provCode;
		this.cityCode = cityCode;
		this.init();
	};
	(function(_p){
		_p.init = function(){
			this.loadProv();
			this.loadCity();
			Core.Events.addEvent(
				this.provDom,
				(function(_this){
					return function(){
						_this.cityCode = 1000;
						_this.provCode = _this.provDom.value;
						_this.loadCity();
					};
				})(this),
				"change"
			);
		};
		_p.disp = function(){};
		
		//显示省的列表。
		_p.loadProv = function(){
			var provOps = this.provDom.options;
			var provcodes = Group.provcodes.split(",");
			var provinces = Group.provinces.split(",");
			if(provOps.length <= 1){
				provOps[0] = new Option("请选择",0);
				for(var i = 0, len = provcodes.length; i < len; i ++){
					provOps[provOps.length] = new Option(provinces[i],provcodes[i]);
				}
			}
			if(Core.Array.findit(provcodes,this.provCode) != -1){
				this.provDom.value = this.provCode;
			}else{
				this.provDom.value = 0;
			}
		};
		//根据省id来显示城市列表。
		_p.loadCity = function(){
			if(this.provCode == "1001" || this.provCode == "0"){
				this.cityDom.style.display = "none";
				this.cityDom.disabled = true;
				return false;
			}else{
				this.cityDom.disabled = false;
				this.cityDom.style.display = "";
			}
			var cityOps = this.cityDom.options;
			while(cityOps.length){
				this.cityDom.remove(0);
			}
			var cityCodes = Group["code" + this.provCode].split(",");
			var cityTexts = Group["prov" + this.provCode].split(",");
			cityOps[0] = new Option("请选择",0);
			for(var i = 0, len = cityCodes.length; i < len; i ++){
				cityOps[cityOps.length] = new Option(cityTexts[i], cityCodes[i]);
			}
			if(Core.Array.findit(cityCodes, this.cityCode) != -1){
				this.cityDom.value = this.cityCode;
			}else{
				this.cityDom.value = 1000;
			}
			this.cityDom.selectedIndex=0;
		};
		_p.loadNewData = function(provCode, cityCode){
			this.provCode = provCode;
			this.cityCode = cityCode;
			this.loadProv();
			this.loadCity();
		};
	})(scope.personal.ProvinceAndCity.prototype);
})();
