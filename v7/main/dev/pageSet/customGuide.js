$import("sina/core/class/create.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/stopEvent.js");
$import("sina/core/events/fixEvent.js");
$import("sina/core/events/getEvent.js");
$import("sina/core/function/bind2.js");
$import("sina/core/function/bind3.js");
$import("sina/core/dom/insertHTML.js");
$import("sina/core/system/br.js");
$import("pageSet/singleFunc/funcChangeFormat.js");
$import("pageSet/singleFunc/funcRefreshPageComponents.js");
/**
 * @fileoverview 用户向导
 * @author xinyu@staff.sina.com.cn
 * @date 2009-08-11
 */
var customGuide = Core.Class.create();
customGuide.prototype = {
    initialize: function(){
        var _this = this;
        
        var obj = $E('userWizardContent');
        lis = obj.getElementsByTagName('ul')[0].getElementsByTagName('li');
        for (var i = 0; i < lis.length; i++) 
            Core.Events.addEvent(lis[i], Core.Function.bind3(_this.userGuide, _this, [lis[i]]), 'click');
    },
    userGuide: function(obj){
		
        if (__pageSetVar.guideInfo && __pageSetVar.guideInfo == obj.id) {
            return;
        }
		
        if (__pageSetVar.guideInfo) 
            $E(__pageSetVar.guideInfo + "").className = "";
			
        __pageSetVar.guideInfo = obj.id;
        obj.className = "selected";
        var toformat = "";
        switch (obj.id) {
            case "userWizard_1":
                toformat = "1";
                break;
            case "userWizard_2":
                toformat = "2";
                break;
            case "userWizard_3":
                toformat = "2";
                break;
            case "userWizard_4":
                toformat = "4";
                break;
            default:
                break;
        }
		
        funcChangeFormat.changeFormat(__pageSetVar.formatInfo + "-" + toformat);
		
        this.userComponent(obj.id);
    },
    userComponent: function(id){
        var hiddendiv = $E('hiddendiv');
        for (var i = 1; i < 4; i++) {
            var childs = Core.Dom.getChildrenByClass($E("column_" + i), "SG_conn");
            for (var j = 0; j < childs.length; j++) 
                hiddendiv.appendChild(childs[j]);
        }
        switch (id) {
            case "userWizard_1":
                scope.component_lists = {
					"1": {
						size: 210,
						list: [901, 12, 17, 1, 2, 3]
					},
					"2": {
						size: 730,
						list: [10001]
					}
				};
                break;
            case "userWizard_2":
                scope.component_lists = {"1":{
                    size: 730,
                    list: [10001]
                }, "2":{
                    size: 210,
                    list: [901, 3, 10002, 63, 1, 12]
                }};
                break;
            case "userWizard_3":
                scope.component_lists = {"1":{
                    size: 730,
                    list: [10004, 10001]
                }, "2":{
                    size: 210,
                    list: [901, 86, 12, 17, 2]
                }};
                break;
            case "userWizard_4":
                scope.component_lists = {
					"1": {
						size: 510,
						list: [10001]
					},
					"2": {
						size: 210,
						list: [3, 12, 1, 10002]
					},
					"3": {
						size: 210,
						list: [901, 8, 17, 2]
					}
				};
                break;
            default:
                break;
        }
        //重新记录页面有哪些组件--------------------------
		__pageSetVar.component_list = [];
		trace("用户向导重新设置组件");
			for (var k in scope.component_lists) {
				
			    __pageSetVar.component_list = __pageSetVar.component_list.concat(scope.component_lists[k].list);
				for(var i=0;i<scope.component_lists[k].list.length;i++){
					trace("id="+scope.component_lists[k].list[i]);
					var comp=$E('module_'+scope.component_lists[k].list[i]);
					if(!comp){
						comp = $C('div');
		                comp.id = "module_" + scope.component_lists[k].list[i];
		                comp.className = 'SG_conn';
						
		                comp.innerHTML = '<div class="SG_connHead"><span class="title">' + __pageSetVar.originalComponentsData[scope.component_lists[k].list[i]].ria_title + '</span><span class="edit"></span></div><div class="SG_connBody"></div><div class="SG_connFoot"></div>';
						trace("name="+__pageSetVar.originalComponentsData[scope.component_lists[k].list[i]].ria_title);
					}
					$E('column_'+k).appendChild(comp);
					 dragBase.add(scope.component_lists[k].list[i]);
				}
			}
			
		if ($E('customModuleText')) {
            $E('customModuleText').innerHTML = '页面最多放置25个组件，您已放置<strong>' + __pageSetVar.component_list.length + '</strong>个组件';
        }
        //--------------------------------------------------------
        
//        funcRefreshPageComponents(scope.component_lists);//刷新页面组件
		
		$callJob("Comp_render");//刷新页面组件

        funcChangeFormat.addNoneDiv();
    }
   
};


