/**
 * @fileoverview 城市选择下拉列表
 * @author dg.Liu | dongguang@staff.sina.com.cn
 *
 */

$import("sina/core/events/addEvent.js");
$import("sina/core/string/shorten.js");
$import("lib/config/cityConfig.js");
$import("lib/app.js");
$import("sina/core/events/getEventTarget.js");
$import("lib/component/renderControl/renderByList.js");

App.CitySelect = Core.Class.create();

App.CitySelect.prototype = {
	canton_id:"cs_canton",
	city_id:"cs_city",
	submit_id:"cs_submit",
	cancel_id:"cs_cancel",
	initialize:function(container,hiddenFunc){
		this.container=container;
		this.hiddenFunc=hiddenFunc;
		this.initTemplate();
		this.bindEvents();
		this.buildCanton();
	},
	bindEvents:function(){
		Core.Events.addEvent($E(this.cancel_id),this.hidden.bind2(this),"click");
		Core.Events.addEvent($E(this.submit_id),this.save.bind2(this),"click");
	},
	hidden:function(){
		$E(this.container).style.display="none";
		this.hiddenFunc();
	},
	save:function(){
		Lib.checkAuthor();
		if(!$isLogin){
			new Lib.Login.Ui().login(this.save.bind2(this),true);
			return;
		}
		
		var cantonEle=$E(this.canton_id);
		var cityEle=$E(this.city_id);
		var cantonId=cantonEle.value;
		var canton = cantonEle.childNodes;
		for(var i=0; canton[i]; i++) {
			if(canton[i] && canton[i].value && canton[i].value == cantonId) {
				canton = canton[i].innerHTML;
				break;
			}
		}
		var cityId=cityEle.value;
		var city = cityEle.childNodes;
		for(var i=0; city[i]; i++) {
			if(city[i] && city[i].value && city[i].value == cityId) {
				city = city[i].innerHTML;
				break;
			}
		}
		if(cantonId=="0"){
			//showError("B36870");
			return;
		}
		if(cityId=="0"){
			//showError("B36871");
			return;
		}
		//http://control.blog.sina.com.cn/riaapi/profile/edit_currentCity.php?uid=1444388813&data={"place1":11,"place2":8}
		var postStr='{"place1":'+cantonId+',"place2":'+cityId+'}';
		if(!this._saveInterface){
      	  this._saveInterface = new Interface("http://control.blog.sina.com.cn/riaapi/profile/edit_currentCity.php", "jsload");
   		}
		this._saveInterface.request({
            GET: {uid:scope.$uid,data:postStr,rand:Math.random()},
            onSuccess: function(_data){
				this.hidden();
				// var weatherMoreLink = $E('weatherMoreLink');
				// weatherMoreLink.parentNode.removeChild(weatherMoreLink);
				$E('wt_city_change').style.display = 'none';
				$E('cs_canton').value = '0';
				$E('cs_city').value = '0';
				scope.weacher.setIsLoadOne(false);
            	//window.location.reload();
				var con = $E('wt_city_show');
				con.innerHTML = ['<div style="padding:30px 0 0 30px; height:200px">',
			           				'<img src="http://simg.sinajs.cn/blog7style/images/common/loading.gif">加载中…',
				           		'</div>'].join('');
				var stro = $E("place").children[0];
				stro.innerHTML = canton+city;
				stro.title = canton+city;
				$E('weather_city').value = cantonId+','+cityId;
				//修改用户切换一个城市后，再次切换城市，如果不选择地区，城市不会出现下拉菜单
				var cityEle=$E(this.city_id);
				cityEle.length = 1;
				Lib.Component.renderByList([978]);
            }.bind2(this)            ,
            onError: function(_data){
				showError(_data.code);
            },
            onFail: function(){
            }
		});
	},
	buildCanton:function(){
		var selectEle=$E(this.canton_id);
		var cantonNames=scope.Group.provinces.split(",");
		var cantonCodes=scope.Group.provcodes.split(",");
		cantonNames.pop();
		cantonCodes.pop();
//		cantonNames.unshift("请选择地区");
//		cantonCodes.unshift("0");
		this._createOption(selectEle,cantonNames,cantonCodes);
		//alert("ss445");
		//selectEle.style.height = "210px";
		Core.Events.addEvent(selectEle,this.huildCity.bind2(this),"change");
	},
	
	huildCity:function(){
		var ele=Core.Events.getEventTarget();
		var selectId=ele.value;
		var cityNames,cityCodes;
		if(selectId=="" || selectId==="0"){
			cityNames=[];
			cityCodes=[];
		}else{
			cityNames=scope.Group["prov"+selectId].split(",");
			cityCodes=scope.Group["code"+selectId].split(",");
		}
		cityNames.unshift("请选择城市");
		cityCodes.unshift("0");
		var cityEle=$E(this.city_id);
		cityEle.innerHTML="";
		if(selectId != ""){
			this._createOption(cityEle,cityNames,cityCodes);
		}	
	},
	_createOption:function(container,names,codes){
		var html="",len=names.length;
		for(var i=0;i<len;i++){
			var option=$C("option");
			option.value=codes[i];
			option.title=names[i];
			option.alt=names[i];
			
			option.innerHTML=Core.String.shorten(names[i],10);
			container.appendChild(option);
		}
	},
	initTemplate:function(){
		 html='<p>'+
		 		'<select id="'+this.canton_id+'" style="margin-right:5px;"><option value="0">请选择地区</option></select>'+
				'<select id="'+this.city_id+'"><option value="0">请选择城市</option></select>'+
			   '</p>'+
        	   '<p>'+
			   	'<a class="SG_aBtn SG_aBtnB" href="#" id="'+this.submit_id+'" onclick="return false"><cite>更改</cite></a>'+
				'<a class="SG_aBtn SG_aBtnB" href="#" id="'+this.cancel_id+'" onclick="return false"><cite>取消</cite></a>'+
			  '</p>';
		$E(this.container).innerHTML=html;
	}
};