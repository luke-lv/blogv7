$import("comps/oop.js");
$import("comps/baihe/_baihe.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/getEvent.js");
$import("sina/core/events/getEventTarget.js");
$import("sina/ui/tween/transition.js");
$import("sina/ui/tween/tweenStrategy.js");
$import("sina/core/dom/getStyle.js");


Baihe.slideFaces = function(opt){
	var __this = this;
	this.parent = opt.parent;
	this.leftArrow = opt.leftArrow;
	this.rightArrow = opt.rightArrow;
	this.pic = opt.pic;
	if(!this.pic.length) return;
	
	this.faces = opt.faces;
	this.disPlayNum = opt.disPlayNum;
	
	this.disPlayWidth = opt.disPlayWidth*this.disPlayNum;	//移动的宽度
	
	this.offsetMargin = parseInt(Core.Dom.getStyle(this.pic[0], "marginLeft"), 10);
	trace("dcw  "+this.offsetMargin)
	this.groupNum = Math.ceil(this.pic.length/this.disPlayNum);
	trace("dsjdsjklsfl" + this.groupNum);
	this.parentMarginLeft =  -(this.pic.length-1)*this.disPlayWidth;
	this.picMarginLeft = (this.pic.length-1)*this.disPlayWidth + this.offsetMargin;
	this.parentWidth = (this.pic.length*2-1)*this.disPlayWidth;
	
	this.parent.style.marginLeft = this.parentMarginLeft + 'px';
	this.parent.style.width = this.parentWidth + 'px';
	this.pic[0].style.marginLeft = this.picMarginLeft + 'px';
	
	
	this.isTween = false;
	this.curIndex = 1;
	this.direction = "left";
	
	this.tween = new Ui.TweenStrategy(
		0,
		__this.picMarginLeft,
		0.5,
		Ui.Transition["regularEaseOut"]
	);
	this.tween.onTween = function(val){
		__this.pic[0].style.marginLeft = parseInt(val, 10)+'px';
	};
	this.tween.onEnd = function(){
		if(__this.direction == "left"){
			__this.curIndex++;
		}else{
			__this.curIndex--;
		}
		__this.ctrlBtnMgr();
		__this.isTween = false;
	};	
	this.slideFaces();
	
}.$defineProto({
	ctrlBtnMgr: function (){
		__this = this;
		trace(__this.curIndex);
		if(__this.curIndex>1){
			__this.leftArrow.style.display = "block";
		}else if(__this.curIndex == 1){
			__this.leftArrow.style.display = "none";
		}
		if(__this.curIndex == __this.groupNum){
			__this.rightArrow.style.display = "none";
		}else if(__this.curIndex < __this.groupNum){
			__this.rightArrow.style.display = "block";
		}		
	},
		
	slideFaces: function(){
		__this = this;
		if (__this.groupNum > 1){
			__this.rightArrow.style.display = "block";
			Core.Events.addEvent(__this.rightArrow, function(){
				if(__this.isTween) return;
				__this.isTween = true;
				__this.direction = "left";
				__this.tween.startValue = __this.tween.endValue;
				__this.tween.endValue = __this.tween.startValue-__this.disPlayWidth;		
				// trace(__this.tween.startValue);
				// trace(__this.tween.endValue);	
				__this.tween.start();
			}, "click");
			
			Core.Events.addEvent(__this.leftArrow, function(){
				if(__this.isTween) return;
				__this.isTween = true;
				__this.direction = "right";
				__this.tween.startValue = __this.tween.endValue;
				__this.tween.endValue = __this.tween.startValue+__this.disPlayWidth;
				// trace(__this.tween.startValue);
				// trace(__this.tween.endValue);
				__this.tween.start();
			}, "click");
		}
	}
});