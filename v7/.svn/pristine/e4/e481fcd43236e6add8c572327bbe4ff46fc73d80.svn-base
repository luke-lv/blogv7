/**
 * @fileoverview 页面的版式设置
 * @author xinyu@staff.sina.com.cn
 * @date 2009-08-08
 */

$import("sina/core/class/create.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/stopEvent.js");
$import("sina/core/events/fixEvent.js");
$import("sina/core/events/getEvent.js");
$import("sina/core/function/bind2.js");
$import("sina/core/function/bind3.js");
$import("sina/core/dom/insertHTML.js");
$import("sina/core/system/br.js");
$import("sina/core/dom/insertAfter.js");

$import("pageSet/tabs.js");
$import("pageSet/singleFunc/funcChangeFormat.js");


var setFormat = Core.Class.create();
setFormat.prototype = {
    initialize: function(){
        var _this = this;
        funcChangeFormat.addNoneDiv();
        var obj = $E('formsetSetting');
        lis = obj.getElementsByTagName('ul')[0].getElementsByTagName('li');
//        trace(__pageSetVar.formatInfo + ";" + lis.length);
        for (var i = 0; i < lis.length; i++) {
            if (lis[i].id.split('_')[1] == __pageSetVar.formatInfo) {
                lis[i].className = "selected";
            }
            Core.Events.addEvent(lis[i], Core.Function.bind3(_this.changeForamt, _this, [lis[i]]), 'click');
        }
    },
    
    changeForamt: function(obj){
    
        if (__pageSetVar.formatInfo == obj.id.split('_')[1]) {
            return;
        }

		
		funcChangeFormat.changeFormat(__pageSetVar.formatInfo + "-" + obj.id.split('_')[1]);
//		trace("__pageSetVar.formatInfo="+__pageSetVar.formatInfo+"obj.id="+obj.id);
		
		$callJob("Comp_render");//刷新页面组件
        
    }
    
};


