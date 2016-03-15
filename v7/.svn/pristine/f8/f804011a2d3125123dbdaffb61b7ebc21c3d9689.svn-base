$import("comps/oop.js");
$import("comps/baihe/_baihe.js");
$import("comps/msgTips.js");

$import("sina/core/events/addEvent.js");
$import("sina/core/events/getEvent.js");
$import("sina/core/events/getEventTarget.js");
$import("sina/core/string/byteLength.js");
$import("sina/core/string/trim.js");
$import("sina/core/string/shorten.js");


Baihe.addNotes = function(opt){
	this.inputArr = opt.inputArr,
	this.arr = opt.arr;
	this.faces = opt.faces;
	this.wordsLimit = opt.limit || 18;
	this.timers = {};
	
	for (var i=0; i<this.faces.length; i++){
		this.faces[i].onmouseover = this.imgover;
		this.faces[i].onmouseout = this.imgout;
	}
	//this.inputChange();
	this.addCtrl();
}.$defineProto({
	imgover: function(){
		var __this = this;
		if (+__this.getAttribute('imgover'))	return;
		__this.style.border = "2px solid #08C211";
	},
	
	imgout: function(){
		var __this = this;
		if (+__this.getAttribute('imgover'))	return;
		__this.style.border = "2px solid #FFFFFF";
	},
	
	toNullInput: function(node, callback, noFocus){
		var curScrollTop = document.documentElement.scrollTop;
		var tween = new Ui.TweenStrategy(
			curScrollTop,
			curScrollTop+getMatchClientY(node)-30,
			0.6,
			Ui.Transition["regularEaseOut"]
		);
		tween.onTween = function(val){
			document.documentElement.scrollTop = val;
		};
		tween.onEnd = function(){
			if(!noFocus) node.focus();
			callback && callback();
		};
		tween.start();
		function getMatchClientY(node){
			return node.getBoundingClientRect().top;
		}
	},
	
	addCtrl: function(){
		var __this = this;
		var input;
		
		for (var i=0; i<__this.arr.length; i++){
			if(__this.arr[i].id == "faces"){
				Core.Events.addEvent(__this.arr[i], (function(){
					return function(){
						var evt = Core.Events.getEvent();
						var target = Core.Events.getEventTarget(evt);
						if(target.tagName.toLowerCase() == "img" ){
							for (var i=0; i<__this.faces.length; i++){
								__this.faces[i].setAttribute('imgover', 0);
								__this.faces[i].style.border = "2px solid #FFFFFF";
							}
							target.setAttribute('imgover',1);
							target.style.border = "2px solid #08C211";
						}
					};
				})(__this.arr[i]));
			}else{
				// 
				Core.Events.addEvent(__this.arr[i], (function(li){
					return function(){
						var s;
						var evt = Core.Events.getEvent();
						var target = Core.Events.getEventTarget(evt);
						if (target.tagName.toLowerCase() == "a"){
							s = target.innerHTML;
							var __input = li.getElementsByTagName("input")[0];
							__input.value = s;
						}
					};
				})(__this.arr[i]), "click");
				
				// 
				input = __this.arr[i].getElementsByTagName("input")[0];
				if(!input) continue;
				
				// 
				var lenLimitMsg = new Comps.msgTips("输入内容过长了", document.body, true);
				
				Core.Events.addEvent(input, (function(__input, idx){
					return function(){
						__this.timers[idx] = setInterval(function(){
							trace(idx+"_counting");
							var val = __input.value;
							var len = Core.String.byteLength(Core.String.trim(val));	// 空格显示，但不计数
							if(len > __this.wordsLimit){
								__input.value = Core.String.shorten(val, __this.wordsLimit, "");
								lenLimitMsg.showAt(__input);
							}
						}, 500);
					};
				})(input, i), "focus");
				
				// 
				Core.Events.addEvent(input, (function(__input, idx){
					return function(){
						clearInterval(__this.timers[idx]);		// 必须执行一次
						var val = __input.value;
						var len = Core.String.byteLength(Core.String.trim(val));	// 空格显示，但不计数，提交时给清了就行。
						if(len > __this.wordsLimit){
							__input.value = Core.String.shorten(val, __this.wordsLimit, "");
							lenLimitMsg.showAt(__input);
						}
					};
				})(input, i), "blur");
			}
		}
	}
	
});