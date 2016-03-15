/**
 * 个人中心天气模块
 * @author dg.Liu | dongguang@staff.sina.com.cn
 * @created 2010-07-07
 * @fileoverview 博客个人中心改版天气预报
 * @modified  Liu Xiaoyue || xiaoyue3@staff.sina.com.cn
 */
$import("lib/component/class/comp_baseClass.js");
$import("lib/component/class/registComp.js");
$import("component/include/CitySelect.js");
$import("component/include/weather.js");
$import("lib/dialogConfig.js");
$import("lib/interface.js");
$registComp(978, {
	//选择城市链接
	change_city_id:"wt_city_change",
	//天气显示部分
	weather_con_id:"wt_city_show",
	//城市选择部分
	city_select_id:"wt_city_select",
	change_select_btn:"place",
	//隐藏表单用于输出已选城市编号
	city_value_id:"weather_city",
	viewType:"select",
	load : function(){
		var citys=$E(this.city_value_id).value.split(",");
		if(this.checkCitys(citys)){
			this.showDate();
			this.showView();	
			//trace("ccccccccccccccccccccccc");
			this.createWeacher();
			scope.weacher.get(citys);
		}else{
			this.selectView();
			this.createCitySelect();
		
		}
		this.bindBtn();
	},
	showDate:function(){ //新增显示当前月日 星期几
		var dateWrapper = $E("timeDate");
		dateWrapper.style.cursor = "pointer";
		var monthTime = dateWrapper.children[0], dateTime = dateWrapper.children[1];
		var myDate = new Date();
		var ary = ["一","二","三","四","五","六","日"];
		// var m = myDate.getMonth();  (), month = myDate.getMonth(), date = myDate.getDate();
		monthTime.innerHTML = (myDate.getMonth() + 1) + "月" + myDate.getDate() + "日";
		var day = parseInt(myDate.getDay());
		day = day === 0 ? day = 6 : day = day-1;
		dateTime.innerHTML = "星期" + ary[day];
	},
	checkCitys:function(array){
		var len=array.length;
		for(var i=0;i<len;i++){
			if(array[i]){
				return true;
			}			
		}
		return false;
		
	},
	showView:function(){
		$E(this.city_select_id).style.display="none";
		$E(this.change_city_id).style.display="";
		$E(this.change_city_id).parentNode.style.display="";
		$E(this.weather_con_id).style.display="";
		this.viewType="show";
	},
	selectView:function(){
//		$E(this.change_city_id).style.display="none";
//		$E(this.change_city_id).parentNode.style.display="none";
//		$E(this.weather_con_id).style.display="none";
		$E(this.city_select_id).style.display="";
		this.viewType="select";
	
	},
	createCitySelect:function(){
		if(!this.citySelect){
			this.citySelect=new App.CitySelect(this.city_select_id,this.showView.bind2(this));	
		}
	},
	createWeacher:function(){
		if(!scope.weacher){
			scope.weacher=new App.Weacher(this.weather_con_id);	
		}
	},
	showSelect:function(e){
		Core.Events.stopEvent();
		this.createCitySelect();
		this.selectView();
	},
	bindBtn : function(){
		Core.Events.addEvent($E(this.change_city_id),this.showSelect.bind2(this),"click");
	}
});
