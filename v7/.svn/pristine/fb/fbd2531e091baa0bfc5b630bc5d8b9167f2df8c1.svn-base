/**
 * @desc	自定样式的对话框
 * @auth	dcw1123 | chengwei1@staff.sina.com.cn
 */

$import("sina/core/events/addEvent.js");
$import("sina/ui/dialog/windowDialog.js");
$import("sina/ui/dialog/backShadow.js");
$import("comps/_comps.js");


// 本次样式定死。往后修改。
Comps.stylishDialog = (function(){
	
	var _TPL = {};
	
	// 不行不行，太脑残了，太脑残了。
	var icon = {					// 对于简单的变样式，一定要改成只需修改 entity.className 就能更换样式！否则样式完全没法统一。
		ok:		"ico_ok.jpg",
		err:	"ico_error.jpg",
		sup:	"ico_warning.jpg",
		ask:	"ico_question.jpg"
	};
	
	_TPL.confirm = [
	'<div style="position:absolute; width:369px; font-size:12px;" id="#{entity}">',
		'<div style="padding:5px 6px 9px 14px; border:1px solid #c57f10 ;background:#fffce7 url(http://simg.sinajs.cn/blog7actstyle/images/bg_5years.gif) no-repeat left bottom; z-index:1">',
			'<p style="display:inline; float:right; margin:0; cursor:pointer; width:8px; height:8px; font-size:0; background:url(http://simg.sinajs.cn/blog7actstyle/images/btn_close.gif) no-repeat 0 0;" class="close" id="#{btnCls}"></p>',
			'<div style="width:338px; margin:7px 0 0; padding:0 0 13px 12px;" id="#{content}">',
				'<a style="float:left; margin:3px 13px 0 10px;"><img src="http://simg.sinajs.cn/blog7actstyle/images/#{icon}" alt="" style="border:none"/></a>',
				'<h3 style="padding:17px 9px 20px; color:#ff0018; margin:0; font-size:14px;" id="#{subject}"></h3>',
				'<div style="margin:10px 0 0 62px; color:#333;" id="#{subText}"></div>',
			'</div>',
			'<p style="width:320px; margin:0; padding:24px 20px 13px 0; border-top:1px solid #f1dab6; text-align:center">',
				'<a href="#" id="#{btnOk}" onclick="return false;">',
					'<img src="http://simg.sinajs.cn/blog7actstyle/images/btn_confirm.jpg" width="48" height="22" alt="" style="border:none; margin-right:10px"/>',
				'</a>',
				'<a href="#" id="#{btnCancel}" onclick="return false;">',
					'<img src="http://simg.sinajs.cn/blog7actstyle/images/btn_cancel.jpg" width="48" height="22" alt="" style="border:none"/>',
				'</a>',
			'</p>',
		'</div>',
	'</div>',].join("");
	
	
	_TPL.alert = [
	'<div style="position:absolute; width:369px; font-size:12px;" id="#{entity}">',
		'<div style="padding:5px 6px 9px 14px; border:1px solid #c57f10 ;background:#fffce7 url(http://simg.sinajs.cn/blog7actstyle/images/bg_5years.gif) no-repeat left bottom; z-index:1">',
			'<p style="display:inline; float:right; margin:0; cursor:pointer; width:8px; height:8px; font-size:0; background:url(http://simg.sinajs.cn/blog7actstyle/images/btn_close.gif) no-repeat 0 0;" class="close" id="#{btnCls}"></p>',
			'<div style="width:338px; margin:7px 0 0; padding:0 0 13px 12px;" id="#{content}">',
				'<a style="float:left; margin:3px 13px 0 10px;"><img src="http://simg.sinajs.cn/blog7actstyle/images/#{icon}" alt="" style="border:none"/></a>',
				'<h3 style="padding:17px 9px 20px; color:#ff0018; margin:0; font-size:14px;" id="#{subject}"></h3>',
				'<div style="margin:10px 0 0 62px; color:#333;" id="#{subText}"></div>',
			'</div>',
			'<p style="width:320px; margin:0; padding:24px 20px 13px 0; border-top:1px solid #f1dab6; text-align:center">',
				'<a href="#" id="#{btnOk}" onclick="return false;">',
					'<img src="http://simg.sinajs.cn/blog7actstyle/images/btn_confirm.jpg" width="48" height="22" alt="" style="border:none; margin-right:10px"/>',
				'</a>',
			'</p>',
		'</div>',
	'</div>',].join("");
	
	
	
	_TPL.noBtn = [
	'<div style="position:absolute; width:369px; font-size:12px;" id="#{entity}">',
		'<div style="padding:5px 6px 9px 14px; border:1px solid #c57f10 ;background:#fffce7 url(http://simg.sinajs.cn/blog7actstyle/images/bg_5years.gif) no-repeat left bottom; z-index:1">',
			'<a href="#" onclick="return false;" style="display:inline; float:right; margin:0; cursor:pointer; width:8px; height:8px; font-size:0; background:url(http://simg.sinajs.cn/blog7actstyle/images/btn_close.gif) no-repeat 0 0;" class="close" id="#{btnCls}"></a>',
			'<div style="width:338px; margin:7px 0 0; padding:0 0 13px 12px;" id="#{content}">',
				
				'<a style="float:left; margin:3px 13px 0 10px;"><img src="http://simg.sinajs.cn/blog7actstyle/images/#{icon}" alt="" style="border:none"/></a>',
				'<h3 style="padding:17px 9px 20px; color:#ff0018; margin:0; font-size:14px;" id="#{subject}"></h3>',
				'<div style="margin:10px 0 0 62px; color:#333;" id="#{subText}"></div>',
				
			'</div>',
		'</div>',
	'</div>',].join("");
	
	
	
	_TPL.loading = [
	'<div style="position:absolute; width:369px; font-size:12px; height:50px;" id="#{entity}">',
		'<div style="padding:5px 6px 9px 14px; border:1px solid #c57f10; height:50px; background:#fffce7 url(http://simg.sinajs.cn/blog7actstyle/images/bg_5years.gif) no-repeat left bottom; z-index:1">',
			'<div style="width:338px; margin:7px 0 0; padding:0 0 13px 12px;" id="#{content}"></div>',
		'</div>',
	'</div>',].join("");
	
	
	
	var shadow = new BackShadow(0.4);
	
	return {
		alert: function(txt, cfg, name){
			var cfg = cfg || {};
			var _tpl = _TPL.alert;
			var dgInst;
			var dgNodes;
			var dgMgr;
			
			_tpl = _tpl.replace("#{icon}", icon[cfg.icon || "sup"]);
			
			// 自定义的有效参数三个。
			cfg.tpl = _tpl;							// 自定义模板
			cfg.content = cfg.content || "";		// 支持 #{id} 模板，进入 #{content} 节点（如果有的话），觉得意义不大。
			cfg.title = cfg.title || "";			// 进入 #{titleName} 节点（如果有的话），拖动条的文字标题。
			
			// alert 的功能参数
			cfg.funcOk = cfg.funcOk || function(){ dgInst.hidden(); };
			cfg.funcCls = cfg.funcCls || function(){ dgInst.hidden(); };
			
			cfg.subject = txt || "";
			cfg.subText = cfg.subText || "";
			
			// 对话框实例和节点
			//dgInst = winDialog.createCustomsDialog(cfg, name);			// 不引入 dialogConfig.js。
			dgMgr = new Sina.Ui.WindowDialog(shadow, {
				"alert": cfg.tpl
			});
			dgInst = dgMgr.createCustomsDialog(cfg, name);
			dgNodes = dgInst.nodes;
			
			// 对话框设置
			dgNodes.subject.innerHTML = cfg.subject;
			if(cfg.subText){
				dgNodes.subText.innerHTML = cfg.subText;
			}else{
				dgNodes.subText.style.display = "none";
			}
			
			Core.Events.addEvent(dgNodes.btnOk, function(){
				dgInst.hidden();				// 如果 callback 上否则会消失不掉了。因为被重新 new 了一个。
				cfg.funcOk();
			}, "click");
			
			Core.Events.addEvent(dgNodes.btnOk, function(event){
				event = event || window.event;
				var key = event.keyCode || event.which;
				if(key == 13){
					dgInst.hidden();
					cfg.funcOk();
				}
			}, "keydown");
			
			Core.Events.addEvent(dgNodes.btnCls, function(){
				dgInst.hidden();
				cfg.funcCls();
			}, "click");
			
			dgInst.setMiddle();
			dgInst.show();
			setTimeout(function(){
				dgNodes.btnOk.focus();
			}, 0);
			
			return dgNodes;
		},
		
		confirm: function(txt, cfg, name){
			var cfg = cfg || {};
			var _tpl = _TPL.confirm;
			var dgInst;
			var dgNodes;
			
			_tpl = _tpl.replace("#{icon}", icon[cfg.icon || "sup"]);
			
			// 自定义的有效参数三个。
			cfg.tpl = _tpl;							// 自定义模板
			cfg.content = cfg.content || "";		// 支持 #{id} 模板，进入 #{content} 节点（如果有的话），觉得意义不大。
			cfg.title = cfg.title || "";			// 进入 #{titleName} 节点（如果有的话），拖动条的文字标题。
			
			// confirm 的功能参数
			cfg.funcOk = cfg.funcOk || function(){ dgInst.hidden(); };
			cfg.funcCancel = cfg.funcCancel || function(){ dgInst.hidden(); };
			cfg.funcCls = cfg.funcCls || function(){ dgInst.hidden(); };
			
			cfg.subject = txt || "";
			cfg.subText = cfg.subText || "";
			
			// 对话框实例和节点
			dgInst = new Sina.Ui.WindowDialog(shadow, {
				"confirm": cfg.tpl
			}).createCustomsDialog(cfg, name);
			dgNodes = dgInst.nodes;
			
			// 对话框设置
			dgNodes.subject.innerHTML = cfg.subject;
			if(cfg.subText){
				dgNodes.subText.innerHTML = cfg.subText;
			}else{
				dgNodes.subText.style.display = "none";
			}
			
			Core.Events.addEvent(dgNodes.btnOk, function(){
				dgInst.hidden();
				cfg.funcOk();
			}, "click");
			
			Core.Events.addEvent(dgNodes.btnCls, function(){
				dgInst.hidden();
				cfg.funcCls();
			}, "click");
			
			Core.Events.addEvent(dgNodes.btnCancel, function(){
				dgInst.hidden();
				cfg.funcCancel();
			}, "click");
			
			Core.Events.addEvent(dgNodes.btnCancel, function(event){
				event = event || window.event;
				var key = event.keyCode || event.which;
				if(key == 13){
					dgInst.hidden();
					cfg.funcCancel();
				}
			}, "keydown");
			
			dgInst.setMiddle();
			dgInst.show();
			setTimeout(function(){
				dgNodes.btnCancel.focus();
			}, 0);
			
			return dgNodes;
		},
		
		noBtn: function(txt, cfg, name){		// 没有按钮！就对了
			var cfg = cfg || {};
			var _tpl = _TPL.noBtn;
			var dgInst;
			var dgNodes;
			var dgMgr;
			
			_tpl = _tpl.replace("#{icon}", icon[cfg.icon || "sup"]);
			
			// 自定义的有效参数三个。
			cfg.tpl = _tpl;							// 自定义模板
			cfg.content = cfg.content || "";		// 支持 #{id} 模板，进入 #{content} 节点（如果有的话），觉得意义不大。
			cfg.title = cfg.title || "";			// 进入 #{titleName} 节点（如果有的话），拖动条的文字标题。
			
			// alert 的功能参数
			cfg.funcCls = cfg.funcCls || function(){ dgInst.hidden(); };
			
			cfg.subject = txt || "";
			cfg.subText = cfg.subText || "";
			
			// 对话框实例和节点
			dgMgr = new Sina.Ui.WindowDialog(shadow, {
				"alert": cfg.tpl				// 没错 就是 alert
			});
			dgInst = dgMgr.createCustomsDialog(cfg, name);
			dgNodes = dgInst.nodes;
			
			// 对话框设置
			dgNodes.subject.innerHTML = cfg.subject;
			if(cfg.subText){
				dgNodes.subText.innerHTML = cfg.subText;
			}else{
				dgNodes.subText.style.display = "none";
			}
			
			Core.Events.addEvent(dgNodes.btnCls, function(event){
				event = event || window.event;
				var key = event.keyCode || event.which;
				if(key == 13){
					dgInst.hidden();
					cfg.funcCls();
				}
			}, "keydown");
			
			Core.Events.addEvent(dgNodes.btnCls, function(){
				dgInst.hidden();
				cfg.funcCls();
			}, "click");
			
			dgInst.setMiddle();
			dgInst.show();
			setTimeout(function(){
				dgNodes.btnCls.focus();
			}, 0);
			
			return dgNodes;
		},
		
		loading: function(chtml){		// cfg 不处理
			var cfg = cfg || {};
			var _tpl = _TPL.loading;
			var dgInst;
			var dgNodes;
			var dgMgr;
			
			// 自定义的有效参数三个。
			cfg.tpl = _tpl;							// 自定义模板
			cfg.content = cfg.content || "";		// 支持 #{id} 模板，进入 #{content} 节点（如果有的话），觉得意义不大。
			cfg.title = cfg.title || "";			// 进入 #{titleName} 节点（如果有的话），拖动条的文字标题。
			
			// 对话框实例和节点
			dgMgr = new Sina.Ui.WindowDialog(shadow, {
				"alert": cfg.tpl				// 没错，可用 alert
			});
			dgInst = dgMgr.createCustomsDialog(cfg, name);
			dgNodes = dgInst.nodes;
			dgNodes.content.innerHTML = chtml;
			
			dgInst.setMiddle();
			dgInst.show();
			
			return dgInst;			// 不应返回 dgNodes
		}
		
	}
	
})();
	
	
	
	
	