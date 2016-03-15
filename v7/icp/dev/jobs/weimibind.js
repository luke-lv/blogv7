/**
 * @fileoverview 绑定微米
 * @author Edwin | zhihang1@staff.sina.com.cn
 * @created 2014-02-10
 */
$import("sina/sina.js");
$import("lib/dialogConfig.js");
$import("lib/interface.js");
$import("lib/checkAuthor.js");


$registJob('weimibind',function(){
	var btnCancel = $E('cancelBind');
	var btnBind = $E('bindweimi');
	var msgBox = $E('message_box');
	var errBox = $E('error_box');
	var timer = 0;
	var timer2 = 0;
	var ibind = new Interface('http://control.blog.sina.com.cn/wemeet/bindwemeet.php', 'ajax');
	var icancel = new Interface('http://control.blog.sina.com.cn/wemeet/bindwemeet.php?cancel=1', 'ajax');

	if(btnBind){
		btnBind.onclick = function(){
			if (!checkPermission()) return false;
			ibind.request({
				onSuccess: function(){
					window.location = 'http://control.blog.sina.com.cn/wemeet/creat_follower_in_wemeet.php';
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



});
