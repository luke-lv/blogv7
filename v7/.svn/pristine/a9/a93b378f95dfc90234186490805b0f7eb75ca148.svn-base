/**
 * @desc	根据操作点，显示提示信息
 * @auth	dcw1123 | chengwei1@staff.sina.com.cn
 */

$import("sina/core/events/addEvent.js");
$import("comps/tips.js");

Comps.msgTips = function(text, nid, delay){
	
	// 模板
	var TPL = [
	'<table class="ctTipb" id="#{entity}">',
		'<thead>',
			'<th class="tLeft"><span></span></th>',
			'<th class="tMid"><span></span></th>',
			'<th class="tRight"><span></span></th>',
		'</thead>',
		'<tfoot>',
			'<td class="tLeft"><span></span></td>',
			'<td class="tMid"><span></span></td>',
			'<td class="tRight"><span></span></td>',
		'</tfoot>',
		'<tbody>',
			'<tr>',
			'<td class="tLeft"><span></span></td>',
			'<td class="tMid">',
				'<div id="#{content}" class="visit" style="width:auto; _padding-top:2px; margin:1px 10px 0pt 10px; height:16px;"></div>',
				//'<div class="ctTipBCon"><a title="关闭" class="shut" href="#" onclick="return false;"></a>',
					// '<div class="xlx"></div>',		// 小浪
					// '<div id="#{content}" class="visit" style="width:auto; _padding-top:2px; margin:1px 10px 0pt 10px; height:16px;"></div>',
				// '</div>',
			'</td>',
			'<td class="tRight"><span></span></td>',
		'</tr>',
		'</tbody>',
	'</table>'].join("");
	
	var mode = (typeof delay=="boolean" && delay) ? 1 : 2;			// 1 手动显示，2 自动显示
	var text = text || "——";
	var nid = nid || {};
	var relNode = nid.nodeType ? nid : $E(nid);
	var timer = 0;
	var tips = new Comps.TipsSimp({
		template: TPL
	});
	
	function init(){
		tips.setContent(text);
		tips.setToNode({
			node:	relNode,
			direct:	3
		});
		
		// boolean 且 true 则切换手动显示模式
		if(mode == 2){
			tips.appear();
			timer = setTimeout(function(){
				tips.disappear();
			}, delay||1500);
		}
		
		// 点击关闭
		Core.Events.addEvent(tips.nodes.btnCls, function(){
			clearTimeout(timer);
			tips.disappear();
		});
	}
	
	
	// 执行
	init();
	
	
	this.show = function(){
		tips.appear();
		clearTimeout(timer);
		timer = setTimeout(function(){
			tips.disappear();
		}, (mode==1) ? 1500 : (delay||1500));			// mode = 1 肯定 delay = true
	};
	this.showAt = function(node){
		tips.setToNode({
			node:	node,
			direct:	3
		});
		tips.appear();
		clearTimeout(timer);
		timer = setTimeout(function(){
			tips.disappear();
		}, (mode==1) ? 1500 : (delay||1500));
	};
	this.setText = function(text){
		tips.setContent(text);
	};
	
};




