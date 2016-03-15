/**
 * @fileoverview 城市选择下拉列表
 * @author dg.Liu | dongguang@staff.sina.com.cn
 *
 */

$import("sina/core/events/addEvent.js");
$import("lib/config/cityConfig.js");
$import("lib/app.js");

App.Weacher = Core.Class.create();

App.Weacher.prototype = {
	initialize:function(container,hiddenFunc){
		this.container=container;
		this.initTemplate();
		this.initDetailTemplate();
		this.bindEvent();
		var gotoCity;
	},
	get:function(citys){
		trace("get_citys:"+citys);
		this.citysCode=citys;
		this.citysName=this.getCity();
		trace("citysName:"+this.citysName);
		if(this.citysName[0]=="北京"&&this.citysName[1]=="朝阳"){
			this.citysName[1]="北京";
		}
		this.loadDate(this.citysName[1]);
	},
	loadDate:function(city){
		 Utils.Io.JsLoad.request("http://php.weather.sina.com.cn/iframe/index/w_cl.php", {GET: {
		 	city:city,
			day:"1",
			code:"js",
			charset:"utf-8",
			cbf:"scope.weacher.render"
		 }});
	},
	getCity:function(){
		if(!this.allCityCodes){
			this.allCityCodes=scope.Group.provcodes.split(",");
			this.allCityNames=scope.Group.provinces.split(",");
		}
		var citysName=[];
		var len=this.allCityCodes.length;
		for(var i=0;i<len;i++){
			if(this.citysCode[0]==this.allCityCodes[i]){
				switch(this.allCityNames[i]) {
					case "天津":
					case "北京":
					case "上海":
					case "香港":
					case "澳门":
					case "重庆":
						citysName.push(this.allCityNames[i]);
						break;
					default:
						citysName.push(scope.Group["prov"+this.allCityCodes[i]].split(",")[0]);
						break;
				}
				var data=scope.Group["code"+this.allCityCodes[i]].split(",");
				for(var j=0;j<data.length;j++){
					if(this.citysCode[1]==data[j]){
						var name=scope.Group["prov"+this.allCityCodes[i]].split(",")[j];
//						if(name=="其他"){
//							name=scope.Group["prov"+this.allCityCodes[i]].split(",")[0];
//						}
						citysName.push(name);
						trace("names:"+citysName);
						return citysName;
					}
				}
			}
		}
		return false;
	},
	initTemplate:function(){
		var html='<div class="weather_l" style="cursor:pointer;">\
		               	<span class="ico_wd"></span>\
		               	<p class="temper">#{t1}</p>\
						<p class="temper_num">#{t1}</p>\
	               </div>';
		this._temp=new Ui.Template(html);
		
	},
	initDetailTemplate:function(){
		 var htmls='<div class="tempbox" style = "display:none;">\
		               	<span></span>\
		               	<span class="tempnum">#{t1}℃~#{t2}℃</span>\
						<p class="wind">#{d1}<br/>#{s1}</p>\
	               </div>';
		this._tpl=new Ui.Template(htmls);
	},
	render:function(data){
		var wData=data.w;
		var city;
		for(var name in wData){
			trace("result:"+name)
			city=name;
		}
		var _data=wData[city];
		if(_data){

			var obj={
				f1:_data[0].f1,
				f2:_data[0].f2,
				t1:_data[0].t1 != '' ? _data[0].t1 : _data[0].t2,
				t2:_data[0].t2,
				s1:_data[0].s1 != '' ? _data[0].s1 : _data[0].s2,
				s2:_data[0].s2,
				d1:_data[0].d1 != '' ? _data[0].d1 : _data[0].d2,
				d2:_data[0].d2
			};

			if(_data[0].s1!=_data[0].s2){
				obj.s1=_data[0].s1+"转"+_data[0].s2;
			}
			var detail = $E("detailTem");
			if (_data[0].f1) {
				detail.className = "ico_temp " + _data[0].f1 + "_0";
			}else{
				detail.className = "ico_temp " + _data[0].f2 + "_0";
			};
			

			$E(this.container).innerHTML = this._temp.evaluate(obj);
			$E("detailTem").innerHTML = this._tpl.evaluate(obj);

			if(!this.isLoadOne) {
				$E("detailTem").children[0].children[0].innerHTML = city;
			} else {
				var provcodes = scope.Group.provcodes.split(',');
				var provinces = scope.Group.provinces.split(',');
				for(var i=0; provcodes[i]; i++) {
					if(provcodes[i] == this.citysCode[0]) {
						$E("detailTem").children[0].children[0].innerHTML = provinces[i];
						break;
					}
				}
			}
			gotoCity = city;
			$E('wt_city_change').style.display = '';
		}else{
			if(!this.isLoadOne){
				this.loadDate(this.citysName[0]);
				this.isLoadOne=true;
			}
		}
	},
	bindEvent:function(){
		Core.Events.addEvent($E("goto"),function(){	
			$E("detailTem").children[0].style.display = "";
		},"mouseover");
		Core.Events.addEvent($E("goto"),function(){
			$E("detailTem").children[0].style.display="none";
		},"mouseout");
		Core.Events.addEvent($E("goto"),function(){
			Core.Events.stopEvent();
			if(!this.isLoadOne) {
				window.open('http://php.weather.sina.com.cn/search.php?c=1&city='+encodeURIComponent(gotoCity)+'&dpc=1');
			}
			
		});
	},
	setIsLoadOne : function(data) {
		this.isLoadOne = data;
	}
};
