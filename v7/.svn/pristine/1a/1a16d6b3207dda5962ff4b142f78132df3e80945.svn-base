/**
 * 新推广页人物头像飘动
 * @author xy xinyu@staff.sina.com.cn
 */
$import("lib/jobs.js");

$import("sina/core/events/addEvent.js");
$import("sina/ui/tween.js");
$import("sina/core/dom/insertAfter.js");
$import("sina/core/function/bind3.js");

	
$registJob("exhperson", function(){
	var parent=$E('many_person');
	var zindex=10;
	var leftrang=442-50;
	var heightrang=477-50;
	var getPhoto = function(id){
		var n = parseInt(id) % 8 + 1;
		return "http://portrait" + n + ".sinaimg.cn/" + id + "/blog/50";
	};
	var zindexarr={};
	//var pergun=[{"uid":"123123","nikc":"昵称","article_link":"http://blog.sina.com.cn/s/xxxx","article_des":"哈哈哈哈哈"},{"uid":"123123","nikc":"昵称","article_link":"http://blog.sina.com.cn/s/xxxx","article_des":"哈哈哈哈哈"}]
	for(var i=0;i<persw.length;i++){
//		trace(i);
		var div=$C("div");
		div.id="p_"+persw[i];
		zindexarr[persw[i]]={};
		zindexarr[persw[i]].zindex=zindex++;
		zindexarr[persw[i]].xflag=Math.random()>0.5?false:true;
		zindexarr[persw[i]].yflag=Math.random()>0.5?false:true;
		zindexarr[persw[i]].xrate=2,//Math.ceil(Math.random()*3);
		zindexarr[persw[i]].yrate=2,//Math.ceil(Math.random()*3);
		div.setAttribute('zIndex',zindex++);
		div.innerHTML='<a href="http://blog.sina.com.cn/u/'+persw[i]+'" target="_blank"><img src="'+getPhoto(persw[i])+'"/></a>';
		div.style.cssText="position:absolute;z-index:"+zindexarr[persw[i]]+";left:"+(Math.floor(Math.random()*leftrang))+"px;top:"+(Math.floor(Math.random()*heightrang))+"px;width:50px;height:50px;";
		div.onmouseover=function(){
			this.style.zIndex=1000;
		};
		div.onmouseout=function(){
			this.style.zIndex=this.getAttribute('zIndex');
		};
		parent.appendChild(div);
	}
	var move=function(arr){
		for(var i in arr){
			var o=$E("p_"+i);
			if(o.style.zIndex==1000) continue;
//			trace(o.style.left);
			var l=parseInt(o.style.left);
			var t=parseInt(o.style.top);
			if(l>leftrang||l<0) arr[i].xflag=!arr[i].xflag;
			if(t>heightrang||t<0) arr[i].yflag=!arr[i].yflag;
			if(arr[i].xflag) o.style.left=(l+2)+"px";
			else o.style.left=(l-2)+"px";
			
			if(arr[i].yflag) o.style.top=(t+2)+"px";
			else o.style.top=(t-2)+"px";
		}
	};
	
	setInterval(function(){
		move(zindexarr);
	},150);
});
