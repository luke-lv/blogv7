$import("sina/ui/dialog/windowDialog.js");
$import("sina/ui/dialog/backShadow.js");
$import("sina/core/events/addEvent.js");
(function(){

	var alerthtml=[						//alert 模板
	'<table id="#{entity}" border="0" cellspacing="0" cellpadding="0" class="gModLayerBox twrap">',
		'<tr>',
			'<td></td>',
			'<td class="fixSize"></td>',
		'</tr>',
		'<tr>',
			'<td>',
				'<div class="layerDoc">',
					'<div class="midLayer">',
						'<div id="#{titleBar}" class="gDialogTop">',
							'<strong id="#{titleName}"></strong><cite><a id="#{btnClose}" href="#" class="CP_w_shut" title="关闭">关闭</a></cite>',
						'</div>',
						'<div id="#{content}" class="gDialogDoc">',
							'<div class="diaBd">',
								'<div class="gDiaC1"><img id="#{icon}" alt="警告" src="http://simg.sinajs.cn/blog7style/images/bring/warm.gif" width="50" height="50"/></div>',
								'<div class="gDiaC2">',
									'<h5 id="#{text}"></h5>',
									'<p id="#{subText}"></p>',
								'</div>',
								'<div class="clearit"></div>',
							'</div>',
							'<div class="btnRow"><a id="#{linkOk}" href="#" onclick="return false" class="SG_aBtnB"><cite id="#{btnOk}"><span id="#{ok}">确定</span></cite></a></div>',
						'</div>',
					'</div>',
				'</div>',
			'</td>',
			'<td class="tBg"></td>',
		'</tr>',
		'<tr>',
			'<td>',
				'<div class="tBg"></div>',
			'</td>',
			'<td class="tBg fixSize"></td>',
		'</tr>',
	'</table>'
	].join("");
	
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
			"alert": alerthtml
		});
	}
	
	scope.baby=scope.baby||{};
	scope.baby.winDialog=winDialog;

})();
