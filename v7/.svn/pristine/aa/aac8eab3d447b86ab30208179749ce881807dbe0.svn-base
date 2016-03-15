/*
* 非 个人中心 组件设置页 中 隐藏组件
* author : meichun1@staff.sina.com.cn 
* 14:19 2010/8/20
*/

$import("lib/interface.js");
$import("lib/dialogConfig.js");
$import("lib/login/ui.js");

var moduleHidden = window.hiddenComponents || function(id) {
		new Interface("http://control.blog.sina.com.cn/riaapi/conf/module_hidden.php", "jsload").request({
				GET: {
						uid: scope.$uid,
						moduleid: id,
						productid: 1
				},
				onSuccess: function(data) {
						var module = $E('module_' + id);
						try{
							var mparent=module.parentNode;
							mparent.removeChild(module);
						if(!$T(mparent,'div').length){
							mparent.style.height="1px";
							mparent.style.visibility="hidden";
						}
						}
						catch(e){};
						
				},
				onError: function(data) {
						winDialog.alert($SYSMSG[data.code], {
								funcOk: function() {
										if (data.code == 'A00004') {
												new Lib.Login.Ui().login(function(){
																				  location.reload();
																				  });
										}
								},
								icon: "02"
						},
						"tips");

						if (data.code == 'A00005') { //说明权限问题，是另一个帐号登陆，所以跳到首页
								var tips = winDialog.getDialog('tips');
								var anchor = tips.getNodes()["btnClose"];
								var anchor2 = tips.getNodes()["linkOk"];
								var btnok = tips.getNodes()['btnOk'];
								anchor2.onclick = anchor.onclick = btnok.onclick = function() {
										window.location.href = 'http://blog.sina.com.cn/u/' + scope.$uid;
								};
								anchor2.href = anchor.href = 'http://blog.sina.com.cn/u/' + scope.$uid;
						}
				}
		});

};