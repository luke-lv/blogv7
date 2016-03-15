
$import("comps/oop.js");
$import("comps/baihe/_baihe.js");

$import("sina/ui/tween/transition.js");
$import("sina/ui/tween/tweenStrategy.js");

Baihe.InterSlide = function(opt){
	var __this = this;
	this.src = opt.src;
	this.parent = opt.parent;
	this.height = opt.height;
	
	this.canNext = true;
	this.size = this.src.length;
	this.parent.style.height = this.height+"px";
	this.parent.onmouseover = function(){ __this.canNext = false; };
	this.parent.onmouseout = function(){ __this.canNext = true; };
	
	this.parent.innerHTML = "";
	
	var __cacheName = "";
	var __temp;
	var __fragment = document.createDocumentFragment();
	for(var i=0; i<this.size; i++){
		__temp = $C("li");
		__cacheName = Core.String.shorten(this.src[i].nick_name, 8);
		__temp.innerHTML = "<h4><a title="+this.src[i].nick_name+" href='http://blog.sina.com.cn/u/"+this.src[i].uid+"' target=_blank>"+__cacheName+"</a> 获得 1个<strong>"+this.src[i].prize+"</strong></h4>";
		__fragment.appendChild(__temp);
	}
	this.parent.appendChild(__fragment);
	
	this.tween = new Ui.TweenStrategy(0, -32, 0.7, Ui.Transition["regularEaseOut"]);
	if(this.size <= Math.floor(this.height/32)){
		traceError("lower height");
		return;			// 行高 32px
	}
	this.move();
	
}.$defineProto({
	
	move:function(){
		var __this = this;
		this.tween.onTween = function(val){
			var __firstNode = __this.parent.getElementsByTagName("li")[0];
			__firstNode.style.marginTop = parseInt(val, 10)+'px';
		};
		this.tween.onEnd = function(){
			var __firstNode = __this.parent.getElementsByTagName("li")[0];
			__firstNode.style.marginTop = 0;
			__this.parent.appendChild(__firstNode);
			setTimeout(function(){
				__this.move();
			}, 2000);
		}
		if(this.canNext){
			this.tween.start();
		}else{
			setTimeout(function(){
				__this.move();
			}, 2000);
		}
	}
	
	
});
	
	

	
