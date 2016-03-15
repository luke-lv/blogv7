/**
 * @Author: Rui Luo || luorui1@staff.sina.com.cn
 * @Overview: 绑定MSN账号页面
 * @Date: 2010.10.21
 * 以非常规的方式完成冲pv需求，后期有其他同学再优化吧
 */
$import("lib/interface.js");
$import("sina/utils/cookie/getCookie.js");
$import("sina/utils/cookie/setCookie.js");
var timer = 0;
var node = $E('disconnectBtn');
	var url = 'http://control.blog.sina.com.cn/blog_rebuild/msn/api/clearLink.php?uid=18349307145&msn_mail=huohuiliang_hhl@hotmadil.com';
	var setUrl = 'http://control.blog.sina.com.cn/blog_rebuild/msn/api/saveMsnSet.php';
	var lock = false;
	var setLock = false;
	var iDisconnect = new Interface(url, 'ajax');
	var iSaveSet = new Interface(setUrl, 'ajax');
	var tipNode = $E('connectMsnTip');
	var tipNode2 = $E('connectMsnTip2');
	var saveSetBtn = $E('btnSaveSet');


function msnrefreshWindow(){
			clearTimeout(timer);
				if (Utils.Cookie.getCookie('reg_token')){
					trace('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');
					var tk=Utils.Cookie.getCookie('reg_token');
					Utils.Cookie.setCookie('reg_token', '', '','/','.blog.sina.com.cn');
					msnBinding(tk);
				//window.location.href = 'http://move.blog.sina.com.cn/msnmove/msn_move_confirm.php';
			}else{
				timer = setTimeout(msnrefreshWindow , 1000);
				trace('xunhuan');
			}
	}
	// 绑定msn账号
	function msnBinding(token){
		var cur_uid = scope.$uid;
		if(cur_uid){
			new Interface("http://control.blog.sina.com.cn/blog_rebuild/msn/api/setLink.php", "ijax").request({
				POST:{
					token: token
				},
				onSuccess:function(res){		// 绑定成功
					showTip('绑定成功。', 0);
					var iframe = $E('msn_sina_btn');
					iframe.parentNode.removeChild(iframe);
					trace('remove iframe');
					trace('Binding is successful: '+ res);
					setTimeout(function(){
						window.location.reload();
					}, 2000);
				},
				onError:function(res){			// 绑定错误。
					trace('Binding is failed: '+ res.code);
					winDialog.alert('绑定失败，请重试。', {
						funcOk: function(){
							window.location.reload();
						},
						funcClose: function(){
							window.location.reload();
						}
					});
				}
			});
			trace("msn binding, curuid:" + cur_uid);
		}else{
			traceError("no uid");
		}
	}



	
	
	//绑定取消绑定按钮事件
	if (node){
		node.onclick = function(){
			if (lock) return;
			lock = true;

			var dialog = winDialog.confirm("您确认要解除绑定吗？解除绑定后您将不能用此MSN账号来登录您的新浪博客。", {
				funcOk: function(){
					doDisconnect();
				},
				funcCancel: function(){
					lock = false;
				},
				funcClose: function(){
					lock = false;
				},
				textOk:"确定",
				textCancel:"取消"
			});

			function doDisconnect(){
				trace('do disconnect!');
				var uid = scope.$uid;
				var msn_mail = encodeURIComponent($E('connectedAcc').innerHTML);

				iDisconnect.request({
					GET: {
						uid: uid,
						msn_mail: msn_mail
					},
					onSuccess: function(data){
						showTip('解除绑定成功。', 1);
						new Image().src = 'http://control.blog.sina.com.cn/blog_rebuild/msn/api/msnLoginOut.php';
						trace('disconnect success: '+ data);
						setTimeout(function(){
							lock = false;
							window.location.reload();
						}, 2000);
					},
					onError: function(data){
						trace('error: '+ data)
						lock = false;
					}
				});
			}

		};
	}

	/**
	 * 保存设置按钮事件
	 */
	if (saveSetBtn){
		saveSetBtn.onclick = function(){
			if (setLock) return;
			setLock = true;
			var islink = $E('inputIsLink').checked?1:0;
			var islinkimg = $E('inputIsLinkImg').checked?1:0;
			var msg = {
				"A00085": "没登录博客",
				"A00083": "设置参数错误",
				"A00084": "博客号还没绑定msn",
				"A00006": "修改成功！"
			};
			iSaveSet.request({
				POST: {
					islink: islink,
					imglink: islinkimg
				},
				onSuccess: function(res){
					showTip(msg['A00006'], 1);
					setTimeout(function(){
						showTip('', 1);
					}, 2000);
					setLock = false;
				},
				onError: function(res){
					showTip('保存修改失败，'+msg[res.code], 1, 'error');
					setTimeout(function(){
						showTip('', 1);
					}, 2000);
					setLock = false;
				}
			});
		};
	}

	/**
	 * 重写ui.js的funcSuccess方法
	 * @param arg1 alt值，这里不用，这个是在其他页面登录用的。
	 * @param token 绑定用token必须有这个才能调绑定msn接口
	 */
	window.funcSuccess = function(arg1, token){
		trace('funcSuccess. binding msn! token:'+token);
		msnBinding(token);
	};

	/**
	 * 重写ui.js的funcNoAccount方法
	 * @param token 绑定用token必须有这个才能调绑定msn接口
	 */
	window.funcNoAccount = function(token){
		trace('funcNoAccount. binding msn! token:'+token);
		msnBinding(token);
	};
	function signInCompleted(sender, signInCompletedEventArgs){
            alert("ok");
            }




	//显示提示消息
	function showTip(str, loc, icon){
		var node = tipNode || tipNode2;
		node.style.display = 'none';
		var textNode = null;
		if (str){
			node.style.display = 'block';
			textNode = node.getElementsByTagName('div')[0];
			textNode.innerHTML = str;
			if (icon == 'error'){
				node.getElementsByTagName('img')[0].className = 'SG_icon SG_icon202';
			}else{
				node.getElementsByTagName('img')[0].className = 'SG_icon SG_icon203';
			}
		}else{
			node.style.display = 'none';
		}
	}

