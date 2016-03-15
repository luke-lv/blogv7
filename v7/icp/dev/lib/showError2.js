/**
 * @fileoverview 封装的showerror,在不需要stopEvent()的地方使用
 * @author xy xinyu@staff.sina.com.cn
 * @example 
 * 
 * 
 * 			window.showError2('成功了',{
 *					icon:'02',
 *					funcText:'是',
 *					callback:function(){
 *						alert(123);
 *					}
 *				});
 */


//<table class="CP_w" id="_93131253351751390_entity" style="position: fixed; z-index: 1024; left: 494px; top: 121.083px;"><thead id="_93131253351751390_titleBar" style="-moz-user-select: none; cursor: move;"><tr><th class="tLeft"><span/></th><th class="tMid"><div class="bLyTop"><strong id="_93131253351751390_titleName">提示</strong><cite><a title="关闭" class="CP_w_shut" onclick="return false;" href="http://blog.sina.com.cn/u/1514459635" id="_93131253351751390_btnClose">关闭</a></cite></div></th><th class="tRight"><span/></th></tr></thead><tfoot><tr><td class="tLeft"><span/></td><td class="tMid"><span/></td><td class="tRight"><span/></td></tr></tfoot><tbody><tr><td class="tLeft"><span/></td><td class="tMid"><div class="CP_layercon1" id="_93131253351751390_content"><div class="CP_prompt"><img width="50" height="50" align="absmiddle" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" class="SG_icon SG_icon201" id="_93131253351751390_icon" alt="警告"/><table class="CP_w_ttl"><tbody><tr><td id="_93131253351751390_text">成功了</td></tr></tbody></table><div class="CP_w_cnt SG_txtb" id="_93131253351751390_subText"/><p class="CP_w_btns_Mid"><a onclick="return false;" href="http://blog.sina.com.cn/u/1514459635" class="SG_aBtn SG_aBtnB" id="_93131253351751390_linkOk"><cite id="_93131253351751390_btnOk"> <span id="_93131253351751390_ok">确定</span> </cite></a></p></div></div></td><td class="tRight"><span/></td></tr></tbody></table>
$import('sina/core/events/addEvent.js');
$import('sina/core/events/removeEvent.js');
$import('sina/core/function/bind2.js');
(function(){
var showerror2tpl=[
'<table id="#{panel}" class="CP_w">',
'<thead id="#{titleBar}">',
	'<tr>',
		'<th class="tLeft"><span></span></th>',
		'<th class="tMid"><div class="bLyTop"><strong id="#{titleName}">提示标题</strong><cite><a id="#{btnClose}" href="#" onclick="return false;" class="CP_w_shut" title="关闭">关闭</a></cite></div></th>',
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
		'<div id="#{content}" class="CP_layercon1">',	
		'</div>',
		'</td>',
		'<td class="tRight"><span></span></td>',
	'</tr>',
'</tbody>',
'</table>'
].join("");

var content=[
			'<div class="CP_prompt">',
			'<img id="errordialog2icon" class="SG_icon SG_icon201" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" width="50" height="50" align="absmiddle"/>',
			'<table class="CP_w_ttl"><tr><td id="errordialog2text"></td></tr></table>',
			'<div id="errordialog2subtext" class="CP_w_cnt SG_txtb"></div>',
			'<p class="CP_w_btns_Mid"><a id="errordialog2link" class="SG_aBtn SG_aBtnB" href="javascript:;" onclick="return false;"><cite id="errordialog2btnok"> <span id="errordialog2btntext"></span> </cite></a></p>',
			'</div>'
].join('');

window.showError2=function(text,option){
	var str=text;
	if(/^[A|B]{1}\d{4,5}$/gi.test(text)){
		str=$SYSMSG[text];
	}
	this.option=option||{};
	this.option.icon=this.option.icon||'01';
	this.option.funcText=this.option.funcText||'确定';
	this.option.callback=this.option.callback||function(){};
	
	var iconSet={
			"01":{"classN":"SG_icon SG_icon201","alt":"警告"},
			"02":{"classN":"SG_icon SG_icon202","alt":"失败"},
			"03":{"classN":"SG_icon SG_icon203","alt":"成功"},
			"04":{"classN":"SG_icon SG_icon204","alt":"询问"}
	};
	window._errordialog = winDialog.createCustomsDialog({
                    tpl: showerror2tpl,
                    title: "提示",
                    content: content,
                    width: 303,
                    height: 108
                }, "__errordialog");
	$E('errordialog2text').innerHTML=str;
	$E('errordialog2icon').className=iconSet[this.option.icon].classN;
	$E('errordialog2icon').alt=iconSet[this.option.icon].alt;
	$E('errordialog2btntext').innerHTML=this.option.funcText;
	Core.Events.addEvent($E('errordialog2btnok'),function(){
		this.option.callback();
		window._errordialog.hidden();
		return false;
	}.bind2(this));
	window._errordialog.addEventListener("hidden",function(){
		this.destroy();
	});

	
	window._errordialog.show();
	window._errordialog.setMiddle();
	window._errordialog.setAreaLocked(true);
	
};
})();