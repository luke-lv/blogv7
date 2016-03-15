/** 
 * @fileoverview 对话框扩展。使用例子请参照发表长微博弹出的对话框。
 * @author Book | liming9@staff.sina.com.cn
 * @version 1 | 2012-03-28
 */
$import("sina/core/system/br.js");
$import("sina/ui/moduleDialog.js");
$import("sina/ui/renderer/opacityRenderer.js");
$import("sina/ui/dragger/borderDragger.js");

;(function(){
	var dialogTemplates={
		alert:[
			'<table id="#{panel}" class="CP_w">',
				'<thead id="#{titleBar}">',
					'<tr>',
						'<th class="tLeft"><span></span></th>',
						'<th class="tMid"><div class="bLyTop"><strong id="#{titleName}">提示</strong><cite><a id="#{btnClose}" href="javascript:;" class="CP_w_shut" title="关闭">关闭</a></cite></div></th>',
						'<th class="tRight"><span></span></th>',
					'</tr>',
				'</thead>',
				'<tfoot>',
					'<tr>',
						'<td class="tLeft"><span></span></td>',
						'<td class="tMid"><span></span></td>',
						'<td class="tRight"><span></span></td>',
					'</tr>',
				'</tfoot>',
				'<tbody>',
					'<tr>',
						'<td class="tLeft"><span></span></td>',
						'<td class="tMid">',
						'<div id="#{content}" class="CP_layercon1 longWeiboTips">',	
							'<p><strong id="#{text}"></strong></p>',
							'<p class="CP_w_btns_Mid"><a id="#{linkOk}" class="SG_aBtn SG_aBtnB icoBtn" href="javascript:;"><cite id="#{btnOk}"></cite></a></p>',
						'</div>',
						'</td>',
						'<td class="tRight"><span></span></td>',
					'</tr>',
				'</tbody>',
			'</table>'
		].join(""),
			
		confirm:[
			'<table id="#{panel}" class="CP_w">',
				'<thead id="#{titleBar}">',
					'<tr>',
						'<th class="tLeft"><span></span></th>',
						'<th class="tMid"><div class="bLyTop"><strong id="#{titleName}">提示</strong><cite><a id="#{btnClose}" href="#" onclick="return false;" class="CP_w_shut" title="关闭">关闭</a></cite></div></th>',
						'<th class="tRight"><span></span></th>',
					'</tr>',
				'</thead>',
				'<tfoot>',
					'<tr>',
						'<td class="tLeft"><span></span></td>',
						'<td class="tMid"><span></span></td>',
						'<td class="tRight"><span></span></td>',
					'</tr>',
				'</tfoot>',
				'<tbody>',
					'<tr>',
						'<td class="tLeft"><span></span></td>',
						'<td class="tMid">',
						'<div id="#{content}" class="CP_layercon1 longWeiboTips">',	
							'<p><strong id="#{text}"></strong></p>',
							'<p class="CP_w_btns_Mid">',
    							'<a id="#{linkOk}" class="SG_aBtn SG_aBtnB" href="#" onclick="return false;"><cite id="#{btnOk}"></cite></a>',
    							'<a id="#{linkCancel}" class="SG_aBtn SG_aBtnB" href="#" onclick="return false;"><cite id="#{btnCancel}"></cite></a>',
							'</p>',
						'</div>',
						'</td>',
						'<td class="tRight"><span></span></td>',
					'</tr>',
				'</tbody>',
			'</table>'
		].join("")
	};
	
	window.winDialogEx = new Ui.ModuleDialog(dialogTemplates, {}, {
		renderer:Ui.OpacityRenderer,
		dragger:Ui.BorderDragger,
		isAdamant:$IE6
	});
	
})();
