/**
 * luorui1@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("lib/dialogConfig.js");
$import("lib/interface.js");
$import("lib/checkAuthor.js");


$registJob('tbind',function(){
	var btnCancel = $E('cancelBind');
	var btnSave = $E('save_setting');
	var cb1 = $E('cb1');
	var cb2 = $E('cb2');
	var msgBox = $E('message_box');
	var errBox = $E('error_box');
	var timer = 0;
	var timer2 = 0;
	var icancel = new Interface('http://control.blog.sina.com.cn/t_sina_blog/save_user_data.php?method=delete_t_sina', 'ajax');
	var ichangeSet = new Interface('http://control.blog.sina.com.cn/t_sina_blog/save_user_data.php?method=set_profile', 'ajax');

	if (btnCancel){
		btnCancel.onclick = function(){
			if (!checkPermission()) return false;
			winDialog.confirm('确定要取消绑定新浪微博？',{
				funcOk: function(){
					icancel.request({
						GET: {
							rand: parseInt(Math.random()*1000000)
						},
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
	if (btnSave){
		btnSave.onclick = function(){
			if (!checkPermission()) return false;
			ichangeSet.request({
				GET:{
					p_push_t: cb1.checked?'1':'0',
					p_get_t: cb2.checked?'1':'0'
				},
				onSuccess: function(){
					showMsg('修改成功');
				},
				onError: function(data){
					showError(data.code);
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
