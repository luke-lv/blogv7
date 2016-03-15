/**
 * 新推广页
 * @author xy xinyu@staff.sina.com.cn
 */
$import("lib/jobs.js");

$import("sina/core/events/addEvent.js");
$import("sina/ui/tween.js");
$import("sina/core/dom/insertAfter.js");
$import("sina/core/function/bind3.js");
window.cur=0;
window.pre=cur;
window.next=1;
	
$registJob("exh", function(){
	
	var ucur=0;
	var unext=1;
	window.clickflag=false;
	window.ontween=false;
	var intervalfunc=function(){
		if(window.clickflag==true)
			return;
		window.clickflag=false;
//		trace('cur='+cur+";next="+next);
		
		$E(confpic[cur].btnid).className='';
		$E(confpic[next].btnid).className='cur';
		
		window.ontween=true;
		Ui.tween($E('pic_bg'), ['opacity'], [0], 0.5, 'simple', {end:function(){
			$E('pic_bg').className=confpic[next].pclass;
			$E(confpic[cur].txtid).style.display="none";
			$E(confpic[next].txtid).style.display="";
			Ui.tween($E('pic_bg'), ['opacity'], [1], 0.5, 'simple', {end:function(){
				cur=next;
				pre=cur;
				next=(next+1)%confpic.length;
				window.clickflag=false;
				window.ontween=false;
			}});
		}});
		
	};

	window.picInterval=setInterval(function(){
		intervalfunc();
	},4000);


	var clickfunc=function(next){
		if(window.clickflag==false){
			window.clickflag=true;
		}
		if(window.ontween==true){
			return;
		}
		if(window.picInterval)
			clearInterval(window.picInterval);
		trace("cur="+cur+";next="+next);
		window.next=next;
		$E(confpic[window.cur].btnid).className='';
		for(var i=0;i<confpic.length;i++){
			$E(confpic[i].btnid).className='';
		}
		$E(confpic[window.next].btnid).className='cur';
		window.ontween=true;
		Ui.tween($E('pic_bg'), ['opacity'], [0], 0.5, 'simple', {end:function(){
			$E('pic_bg').className=confpic[window.next].pclass;
			$E(confpic[window.cur].txtid).style.display="none";
			$E(confpic[window.next].txtid).style.display="";
			Ui.tween($E('pic_bg'), ['opacity'], [1], 0.5, 'simple', {end:function(){
				window.cur=window.next;
				window.next=(window.next+1)%confpic.length;
				window.clickflag=false;
				window.ontween=false;
			}});
		}});
		
	};
	
	Core.Events.addEvent($E('pic_bg'),function(){
		if(window.picInterval){
			clearInterval(window.picInterval);
		}
	},'mouseover');

	Core.Events.addEvent($E('pic_bg'),function(){
		clearInterval(window.picInterval);
		window.picInterval=setInterval(function(){
			intervalfunc();
		},4000);
	},'mouseout');

	for(var i=0;i<confpic.length;i++){
		Core.Events.addEvent($E(confpic[i].btnid),Core.Function.bind3(clickfunc, this, [i]));
	}
	
	//垂直部分的滚动---------------
	var hrzul=$E('hrzul');
	var lis=$T(hrzul,'li');
	
	trace(hrzul.offsetHeight);
	var onflag=false;
	hrzul.onmouseover=function(){
		onflag=true;
	};
	hrzul.onmouseout=function(){
		onflag=false;
	};
	var hshow=setInterval(function(){
		if(onflag==true)return;
		var tp=parseInt(hrzul.style.top);
		if(tp+hrzul.offsetHeight<=0)
		hrzul.style.top="133px";
		else
			hrzul.style.top=(tp-5)+'px';
	},120);
});
