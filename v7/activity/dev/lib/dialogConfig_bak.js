$import("sina/ui/dialog/windowDialog.js");
$import("sina/ui/dialog/backShadow.js");
$import("sina/core/events/addEvent.js");

var DialogTemplate={};

/**
 * alert的模板
 * 需配置模板的各个节点(加*号为必须的)：
 * 		entity 整个dialog对象[*]
 * 		titleBar 标题栏区域
 * 		titleName 标题名称
 * 		btnClose 关闭按钮[*]
 * 		content 内容区域[*]
 * 		icon 图标
 * 		text 文本区域[*]
 * 		subText 次级文本区域
 * 		linkOk 确定按钮的焦点节点[*]
 * 		btnOk 确定按钮[*]
 * 		ok 确定按钮的文字节点[*]
 */
DialogTemplate.alert=[
'<table id="#{entity}" class="CP_w">',
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
			'<div class="CP_prompt">',
			'<img id="#{icon}" class="SG_icon SG_icon201" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" width="50" height="50" align="absmiddle"/>',
			'<table class="CP_w_ttl"><tr><td id="#{text}"></td></tr></table>',
			'<div id="#{subText}" class="CP_w_cnt SG_txtb"></div>',
			'<p class="CP_w_btns_Mid"><a id="#{linkOk}" class="SG_aBtn SG_aBtnB" href="#" onclick="return false;"><cite id="#{btnOk}"> <span id="#{ok}"></span> </cite></a></p>',
			'</div>',
		'</div>',
		'</td>',
		'<td class="tRight"><span></span></td>',
	'</tr>',
'</tbody>',
'</table>'
].join("");

//

/**
 * confirm的模板
 * 需配置模板的各个节点：(加*号为必须的)
 * 		entity 整个dialog对象[*]
 * 		titleBar 标题栏区域
 * 		titleName 标题名称
 * 		btnClose 关闭按钮[*]
 * 		content 内容区域[*]
 * 		icon 图标
 * 		text 文本区域[*]
 * 		subText 次级文本区域
 * 		linkOk 确定按钮的焦点节点[*]
 * 		btnOk 确定按钮[*]
 * 		ok 确定按钮的文字节点[*]
 * 		linkCancel 取消按钮的焦点节点[*]
 * 		btnCancel 取消按钮[*]
 * 		cancel 取消按钮的文字节点[*]
 */
DialogTemplate.confirm=[
'<table id="#{entity}" class="CP_w">',
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
			'<div class="CP_prompt">',
			'<img id="#{icon}" class="SG_icon SG_icon201" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" width="50" height="50" align="absmiddle"/>',
			'<table class="CP_w_ttl"><tr><td id="#{text}"></td></tr></table>',
			'<div id="#{subText}" class="CP_w_cnt SG_txtb"></div>',
			'<p class="CP_w_btns">',
				'<a  id="#{linkOk}" class="SG_aBtn SG_aBtnB" href="#" onclick="return false;"><cite id="#{btnOk}"> <span id="#{ok}"></span> </cite></a>',
				'<a style="margin-left:5px;" id="#{linkCancel}" class="SG_aBtn SG_aBtnB" href="#" onclick="return false;"><cite id="#{btnCancel}"> <span id="#{cancel}"></span> </cite></a></p>',
			'</div>',
		'</div>',
		'</td>',
		'<td class="tRight"><span></span></td>',
	'</tr>',
'</tbody>',
'</table>'
].join("");


/**
 * iframe的模板
 * 需配置模板的各个节点：
 * 		entity 整个dialog对象
 * 		titleBar 标题栏区域
 * 		titleName 标题名称
 * 		btnClose 关闭按钮
 * 		content 内容区域
 * 		loadState 装载时要显示的内容
 * 		iframe 框架对象
 */
DialogTemplate.iframe=[
	'<table id="#{entity}" class="CP_w">',
		'<thead id="#{titleBar}">',
			'<tr>',
				'<th class="tLeft"><span></span></th>',
				'<th class="tMid">',
					'<div class="bLyTop">',
						'<strong id="#{titleName}">提示标题</strong>',
						'<cite><a id="#{btnClose}" href="javascript:;" class="CP_w_shut" title="关闭">关闭</a></cite>',
					'</div>',
				'</th>',
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
					'<div id="#{content}" style="vertical-align: top;" class="CP_layercon1">',
						'<div id="#{loadState}">Loading...</div>',
						'<iframe frameborder="0" scrolling="no" style="width:100%;height:100%;display:none;" id="#{iframe}"></iframe>',
					'</div>',
				'</td>',
				'<td class="tRight"><span></span></td>',
			'</tr>',
		'</tbody>',
	'</table>'
].join("");



/**
 * customs的模板
 * 需配置模板的各个节点：(加*号为必须的)
 *		entity 整个dialog对象[*]
 * 		titleBar 标题栏区域
 * 		titleName 标题名称
 * 		btnClose 关闭按钮
 * 		content 内容区域 [*]
 */
DialogTemplate.customs=[
	'<table id="#{entity}" class="CP_w">',
		'<thead id="#{titleBar}">',
			'<tr>',
				'<th class="tLeft"><span></span></th>',
				'<th class="tMid">',
					'<div class="bLyTop">',
						'<strong id="#{titleName}">提示标题</strong>',
						'<cite><a id="#{btnClose}" href="#" onclick="return false;" class="CP_w_shut" title="关闭">关闭</a></cite>',
					'</div>',
				'</th>',
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
				'<td class="tMid" id="#{content}">',
				'</td>',
				'<td class="tRight"><span></span></td>',
			'</tr>',
		'</tbody>',
	'</table>'
].join("");


/**
 * 显示图标配置
 * "01":[!]
 * "02":[×]
 * "03":[√]
 * "04":[?]
 */
var	iconSet={
	"01":{"class":"SG_icon SG_icon201","alt":"警告"},
	"02":{"class":"SG_icon SG_icon202","alt":"失败"},
	"03":{"class":"SG_icon SG_icon203","alt":"成功"},
	"04":{"class":"SG_icon SG_icon204","alt":"询问"}
};

var dialogBackShadow;
var winDialog={},_winDialog;

winDialog.alert=function(text,cfg,name){
	if(!_winDialog){
		initDialog();
		_winDialog.alert(text,cfg,name);
	}else{
		_winDialog.alert(text,cfg,name);
	}
};

winDialog.confirm=function(text,cfg,name){
	if(!_winDialog){
		initDialog();
		_winDialog.confirm(text,cfg,name);
	}else{
		_winDialog.confirm(text,cfg,name);
	}
};

winDialog.showIframe=function(cfg,name){
	if(!_winDialog){
		initDialog();
		_winDialog.showIframe(cfg,name);
	}else{
		_winDialog.showIframe(cfg,name);
	}
};

winDialog.createCustomsDialog=function(cfg,name){
	if(!_winDialog){
		initDialog();
		return _winDialog.createCustomsDialog(cfg,name);
	}else{
		return _winDialog.createCustomsDialog(cfg,name);
	}
};

winDialog.getDialog=function(name){
	if(!_winDialog){
		initDialog();
		return _winDialog.getDialog(name);
	}else{
		return _winDialog.getDialog(name);
	}
};

winDialog.close=function(name){
	if(!_winDialog){
		initDialog();
		_winDialog.close(name);
	}else{
		_winDialog.close(name);
	}
};


function initDialog(){
	dialogBackShadow = new BackShadow(0.4);
	_winDialog = new Sina.Ui.WindowDialog(dialogBackShadow, {
		"alert": DialogTemplate.alert,
		"confirm": DialogTemplate.confirm,
		"iframe": DialogTemplate.iframe,
		"customs": DialogTemplate.customs
	});
	_winDialog.iconSet=iconSet;
}
			
