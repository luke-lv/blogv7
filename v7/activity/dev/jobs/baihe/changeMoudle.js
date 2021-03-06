$import("sina/core/events/addEvent.js");
$import("sina/core/string/trim.js");

$registJob("changeMoudle", function(){
	var changeBtn = $E("select_skin");
	var skinList = $E("skin_thumb_list");
	var changeNode = $E("nine_g_sk09");
	var skinArr = skinList.getElementsByTagName("a");
	
	var __imgHoverClass = "fixed_skin_name";
	var __classPrefix = "nine_g_sk0";
	var __lastTemplateClass = __classPrefix+changeNode.getAttribute("templateIdx");			// 找到当前模板号
	var __lastThumbImgId;
	
	var i;
	for(i=0; i<skinArr.length; i++){
		if(skinArr[i].className.indexOf(__imgHoverClass)>-1){
			__lastThumbImgId = i;				// 找到当前模板在选择框中的 index
			break;
		}
	}
	
	var skinArrLength = skinArr.length;
	for(i=0; i<skinArrLength; i++){
		Core.Events.addEvent(skinArr[i], (function(idx){
			return function(){
				var templateIdx = $T(skinArr[idx], "img")[0].getAttribute("name");		// 要传给绍敏的模板代号
				var templateClass = __classPrefix + templateIdx;						// 根据模板号生成的模板 class
				
				delClass(changeNode, __lastTemplateClass);
				addClass(changeNode, templateClass);
				delClass(skinArr[__lastThumbImgId], __imgHoverClass);
				addClass(skinArr[idx], __imgHoverClass);
				
				changeNode.setAttribute("templateIdx", templateIdx);	// 标记一下当前模板代号没办法，取那个复杂的 class 太悲摧了。
				
				__lastTemplateClass = templateClass;
				__lastThumbImgId = idx;
			};
		})(i), "click");
	}
	
	Core.Events.addEvent(changeBtn, function(){
		if(skinList.style.display == "none") skinList.style.display = "block";
		else skinList.style.display = "none";
	}, "click");
	
	
	function addClass(dom, clz){
		if(!dom){ return false; }
		if(!hasClass(dom, clz)){
			dom.className = Core.String.trim(dom.className.concat(" " + clz));
		}
	}
	function delClass(dom, clz){
		if(!dom){ return false; }
		var reg = new RegExp("( +|^)" + clz + "(?=( |$))", "ig");
		dom.className = Core.String.trim(dom.className.replace(reg, ""));
	}
	function hasClass(dom, clz){
		if(!dom){ return false; }
		var reg = new RegExp("( +|^)" + clz + "(?=( |$))", "ig");
		return reg.test(dom.className);
	}
});


