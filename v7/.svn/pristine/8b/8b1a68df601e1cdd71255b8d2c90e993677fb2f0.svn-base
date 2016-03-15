/**
 * chengwei1@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/core/array/foreach.js");
$import("sina/core/string/trim.js");
$import("sina/core/events/getEvent.js");
$import("sina/core/events/getEventTarget.js");
$import("sina/core/events/fireEvent.js");
$import("lib/interface.js");

$import("lib/dialogConfig.js");
$import("msg/regmsg.js");

(function(){
	var people = $E("people");
	var heads = $T(people, "li");
	var nextBtn = $E("nextBtn");
	
	var nextPhp = "http://control.blog.sina.com.cn/riaapi/reg/attention_add_batch.php";
	var nextJump = "http://control.blog.sina.com.cn/reg/reg_blog_init.php";
	
	DialogTemplate.alert = $SYSMSG["alert"];		//模板覆盖，此次本页面的构建的样式与 blog7 冲突。
	
	Core.Array.foreach(heads, function(li, i){
		
		//hover
		li.onmouseover = function(){
			//curHover
			if(hasClass(this, "current")){
				var evt = Core.Events.getEvent();
				var evtTarg = Core.Events.getEventTarget(evt);
				if(evtTarg.tagName.toUpperCase() !== "A"){
					addClass(this, "curhover");
				}
			}else{
				var evt = Core.Events.getEvent();
				var evtTarg = Core.Events.getEventTarget(evt);
				if(evtTarg.tagName.toUpperCase() !== "A"){
					addClass(this, "hover");
				}
			}
		};
		li.onmouseout = function(){
			if(hasClass(this, "current")){
				delClass(this, "curhover");
			}else{
				delClass(this, "hover");
			}
		};
		
		//current	多选。
		li.onclick = function(){					//点击要响应一次 hover?
			var evt = Core.Events.getEvent();
			var evtTarg = Core.Events.getEventTarget(evt);
			if(evtTarg.tagName.toUpperCase() !== "A"){
				if(hasClass(this, "current")){
					addClass(this, "hover");
					delClass(this, "current");
					delClass(this, "curhover");
				}else{
					delClass(this, "hover");
					addClass(this, "current");
					addClass(this, "curhover");
				}
			}
		};
	});
	
	nextBtn.onclick = function(){
		//收集数据。
		var chosen = [];
		Core.Array.foreach(heads, function(li, i){
			if(hasClass(li, "current")){
				chosen[chosen.length] = li.id;
			}
		});
		// alert(chosen);
		// alert(chosen.constructor);
		// chosen = chosen.join(",");
		// alert(chosen);
		// alert(chosen.constructor);
		
		(new Interface(nextPhp, "jsload")).request({
			GET : {
				uid : scope.$uid,
				aids : chosen.join(","),
				version : 7
			},
			onSuccess : function(res){
				window.location.href = nextJump + "?version=7";
			},
			onError : function(res){
				winDialog.alert($SYSMSG[res.code], {
					funcOk : function(){
						if(res.code == "A11003"){
							window.location.href = "http://blog.sina.com.cn/u/"+scope.$uid;
						}
					}
				});
			}
		});
		return false;
	};
	
	function addClass(dom, clz){		//有就不加了。class 唯一。
		if(!hasClass(dom, clz)){
			dom.className = Core.String.trim(dom.className.concat(" " + clz));
		}
	}
	function delClass(dom, clz){		//全删，保证 class 唯一。	//( +|^)clz(?=( |$))
		var reg = new RegExp("( +|^)" + clz + "(?=( |$))", "ig");
		dom.className = Core.String.trim(dom.className.replace(reg, ""));
	}
	function hasClass(dom, clz){
		if(!dom){ return false; }
		var reg = new RegExp("( +|^)" + clz + "(?=( |$))", "ig");
		return reg.test(dom.className);
	}
	// 	function array2Str(arr){		//单维，纯数。
	// 	// if(arr.constructor.indexOf("Array")){
	// 	// 	trace("arr 不是数组");
	// 	// 	return false;
	// 	// }
	// 	var strTemp = "";
	// 	for(var i=0; i<arr.length; i++){
	// 		strTemp += arr[i] + ",";
	// 	}
	// 	// alert(strTemp);
	// 	//strTemp = "[" + strTemp.slice(0,-1) +"]";
	// 	strTemp = strTemp.slice(0,-1);
	// 	// alert(strTemp);
	// 	// alert(typeof strTemp);
	// 	return strTemp;
	// }
})();

