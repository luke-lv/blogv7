/**
 * http://blog.sina.com.cn/lm/iframe/xhtml/2009/1112/182.html这个页面的js
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
	
$registJob("exhibition", function(){
	
	var ucur=0;
	var unext=1;
	window.clickflag=false;
	window.ontween=false;
	//大图的间隔事件
	var intervalfunc=function(){
		if(window.clickflag==true)
			return;
		window.clickflag=false;
		trace('cur='+cur+";next="+next);
		
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
//			return;
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
	
	//中部头像的滚动
	var userInterval=setInterval(function(){
		
		Ui.tween($E(confuser[ucur].udiv), ['marginTop'], [-71], 2, 'simple', {end:function(){
			$E('userdiv').appendChild($E(confuser[ucur].udiv));
			$E(confuser[ucur].udiv).style.marginTop='0px';
			$E(confuser[unext].udiv).style.marginTop='0px'
			ucur=unext;
			unext=(unext+1)%confuser.length;
		}});

	},4000);
});
