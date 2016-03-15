/**
 * zhihang1@staff.sina.com.cn
 * 此文件将绑定微米时以浮层的方式显示弹窗，目前暂不使用
 */
/*$import("sina/sina.js");
$import("lib/dialogConfig.js");
$import("lib/interface.js");
$import("lib/checkAuthor.js");
$import("sina/ui/dialog.js");
$import("sina/ui/renderer/opacityRenderer.js");
$import("sina/ui/panel.js");

$registJob('weimibind2',function(){
	var btnCancel = $E('cancelBind');
	var btnBind = $E('bindweimi');
	var msgBox = $E('message_box');
	var errBox = $E('error_box');
	var timer = 0;
	var timer2 = 0;
	var ibind = new Interface('http://control.blog.sina.com.cn/wemeet/bindwemeet.php', 'ajax');
	var icancel = new Interface('http://control.blog.sina.com.cn/wemeet/bindwemeet.php?cancel=1', 'ajax');
	var ilike = new Interface('http://control.blog.sina.com.cn/wemeet/att_wemeet.php','ajax'); 
	var popCfg = {
		tpl : [
			'<div id="#{panel}" class="l_weimi">',
				'<p class="txt"></p>',
				'<p>',
					'<input type="checkbox" checked="checked" id="likeweimi">',
					'<label for="likeweimi">关注微米官方微博账号</label>',
				'</p>',
				'<div class="icon_w">',
					'<img src="http://simg.sinajs.cn/blog7style/images/common/layer/l_icon_weimi.png">',
					'<span class="wm">微米</span>',
					'<img src="http://simg.sinajs.cn/blog7style/images/common/layer/l_v.png">',
				'</div>',
				'<div class="btn">',
					'<a class="sure" href="javascript:;" id="popconfirm">确定</a>',
					'<a class="cancel" href="javascript:;" id="popcancel">取消</a>',
				'</div>',
			'</div>'
		].join(''),
		width : '360px',
		height : '400px',
		zIndex : '9999'
	};	

	if(btnBind){
		btnBind.onclick = function(){
			if (!checkPermission()) return false;
			ibind.request({
				onSuccess: function(){
					// window.location = 'http://control.blog.sina.com.cn/wemeet/creat_follower_in_wemeet.php';
					alertPop();
				},
				onError: function(data){
					showError(data.code);
				}
			});
		}
	}
	if (btnCancel){
		btnCancel.onclick = function(){
			if (!checkPermission()) return false;
			winDialog.confirm('确定要取消绑定微米？',{
				funcOk: function(){
					icancel.request({
						onSuccess: function(){
							window.location.reload();
						},
						onError: function(data){
							showError(data.code);
						}
					});
				},
				funcCancel: function(){
				}
			});
			return false;
		};
	}

	var url = location.href;
	var anchor = /#([^#]*)/g.exec(url);
	if (anchor){
		switch (anchor[1]){
			case 'bindok':
				showMsg('绑定成功');
				break;
			case 'bindfail':
				showErr('网络原因，暂时无法完成操作...请稍后再试');
				break;
			case 'bindexist':
				winDialog.alert('已绑定微博账户，不能重复绑定');
				break;
		}
		var loc = document.location.toString();
		document.location = loc.replace('bindok', '').replace('bindexist', '').replace('bindfail', '');
	}

	function showMsg(str){
		msgBox.innerHTML = str;
		msgBox.parentNode.style.display = 'block';
		clearTimeout(timer);
		timer = setTimeout(function(){msgBox.parentNode.style.display = 'none';}, 2000);

	}

	function showErr(str){
		errBox.innerHTML = str;
		errBox.parentNode.style.display = 'block';
		clearTimeout(timer2);
		timer2 = setTimeout(function(){errBox.parentNode.style.display = 'none';}, 2000);
	}

	function checkPermission(){
		Lib.checkAuthor();
		if (!$isAdmin) {
			winDialog.alert($SYSMSG['A00003'],{
				funcOk: function(){
					window.location.reload();
				},
				funcClose: function(){
					window.location.reload();
				}
			});
			return;
		}else{
			return true;
		}
	}

	function alertPop(){
		// console.log(document.documentElement.clientHeight,document.body.clientHeight,document.documentElement.offsetWidth,document.body.offsetWidth)
		var w=document.documentElement.offsetWidth || document.body.offsetWidth,
			h=document.documentElement.offsetHeight || document.body.offsetHeight;			
		var bgShadow = new Ui.Panel();
		bgShadow.setTemplate('<div id="#{panel}" style="background-color:black"></div>')
		.setSize({width:w,height:h})
		// .setAdamant($IE6)		
		.setFixed(true)
		.setPosition({x:0,y:0,z:8888});
		Core.Dom.setStyle(bgShadow.nodes.panel,"opacity",0.4);
		bgShadow.show();
		
		var pop = new Ui.Dialog();
		pop.setTemplate(popCfg.tpl)
		// .setSize({width:popCfg.width})
		// .setFixed(true) //报错
		.setPosition({z:popCfg.zIndex})
		.setMiddle();
		// Core.Dom.setStyle(pop.nodes.panel,"position",'fixed');		
		pop.show(Ui.OpacityRenderer);
		$E('popcancel').onclick = function(){
			pop.hidden(Ui.OpacityRenderer);
			window.location.reload();
		}
		$E('popconfirm').onclick = function(){
			ilike.request({
				onSuccess: function(){
					pop.hidden(Ui.OpacityRenderer);
					window.location.reload();
				},
				onError: function(data){
					pop.hidden(Ui.OpacityRenderer);
					window.location.reload();
				}
			})
		}
	}



});*/
