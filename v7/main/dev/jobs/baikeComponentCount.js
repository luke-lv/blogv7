/**
 * @fileoverview 临时用于统计百科组件module_119出现次数的统计
 * 此外，组件内部由于php输出，还存在两个统计布码点
 * @author wujian|wujian@staff.sina.com.cn
 * @create 2010-11-17
 */

$import("sina/sina.js");
$import("lib/sendLog.js");
$import("sina/core/events/addEvent.js")


$registJob("baikeComponentCount", function(){
	var comp=$E("module_119");
	if(comp){		
		v7sendLog("89_01_01_"+"3_"+scope.$uid,scope.$pageid,'');	
		//给内部a绑定统计事件	
		var urls=$T(comp,"a");
		for (var i=0,len=urls.length; i<len; i++) {
			(function(num){
				Core.Events.addEvent(urls[i],function(){
						v7sendLog("89_01_01_"+num+"_"+scope.$uid,scope.$pageid,'');
					},"click");
				}
			)(i+1)			
		};
	}
	
});
