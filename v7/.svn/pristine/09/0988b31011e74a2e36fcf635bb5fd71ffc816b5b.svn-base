/**
 * @author darkty2009
 */
$import("sina/core/events/stopEvent.js");
$import("lib/interface.js");
$import("lib/showError.js");

$registJob("commtrash", function() {
	
	// DELETE:http://control.blog.sina.com.cn/admin/comment/comment_recycle_del.php?uid=1623916663&version=7&ids=60cb00770100g218|1389433|413147,60cb00770100fuur|1375508|400289
	// RESUME:http://control.blog.sina.com.cn/admin/comment/comment_recycle_resume.php?uid=1623916663&version=7&ids=60cb00770100g0gg|1380193|252744,60cb00770100g0gg|1380195|252740
	// CLEAR:http://control.blog.sina.com.cn/admin/comment/comment_clear_del.php?clear=1&uid=1623916663&version=7&varname=requestId_61165768
	var BASIC_URL = "control.blog.sina.com.cn";
	
	var all 	= Core.Dom.getElementsByClass(document, "div", "chbox");
	var chooses = document.getElementsByName("ids[]");
	
	if(!chooses.length)return;
	
	for(var i=0;i<all.length;i++) {
		all[i].firstChild.checked = false;
	}
	
	all[0].onclick = function() {
		for(var i=1;i<all.length;i++) {
			all[i].firstChild.checked = this.firstChild.checked;
		}
	};
	/**
	all[all.length-1].onclick = function() {
		for(var i=0;i<all.length-1;i++) {
			all[i].firstChild.checked = this.firstChild.checked;
		}
	};
	**/
	var chooLen = chooses.length;
	
	function checkAll(dom) {
		trace("check");
		
		if(!dom.checked) {
			all[0].firstChild.checked = false;
			//all[all.length-1].firstChild.checked = false;
		}else {
			var flag = true;
			for(var i=0;i<chooLen;i++) {
				if(!chooses[i].checked) {
					flag = false;
					break;
				}
			}
			
			all[0].firstChild.checked = flag;
			//all[all.length-1].firstChild.checked = flag;
		}
	}
	
	for(var j = 0; j < chooLen; j ++) {
		chooses[j].onclick = function() {
			checkAll(this);
		};
		chooses[j].checked=chooses[0].checked;
	}
	
	function getIds() {
		var array = [];
		for(var i=0;i<chooses.length;i++) {
			if(chooses[i].checked){
				array.push(chooses[i].value);
			}
		}
		
		return array.join(",");
	}
	/**
	$E("deleteAll1").onclick = function() {
		if(!getIds())
		{
			winDialog.alert("请先选择一条垃圾评论");
			return;	
		}		
		winDialog.confirm("是否删除这些评论？", {
			
			funcOk:function() {
				try {
					Core.Events.stopEvent();
				}catch(e) {
				
				}
				new Interface("http://control.blog.sina.com.cn/admin/comment/comment_recycle_del.php?version=7&ids="+getIds(), "jsload").request({
					GET: {
						uid:scope.$uid,
						version:7
					},
					onSuccess:function(data) {
						winDialog.alert("评论删除成功！", {
							funcOk:function() {
								window.location.reload();
							}
						});
					},
					onError:function(res) {
						showError(res.code);
					}
				});
			}
		});
	};
	**/
	/**
	$E("resumePage1").onclick = function() {
		if(!getIds())
		{
			winDialog.alert("请先选择一条垃圾评论");
			return;	
		}	
		winDialog.confirm("是否恢复这些评论？", {
			funcOk:function() {
				try {
					Core.Events.stopEvent();
				}catch(e) {
				
				}
				new Interface("http://control.blog.sina.com.cn/admin/comment/comment_recycle_resume.php?version=7&ids="+getIds(), "jsload").request({
					GET: {
						uid:scope.$uid
					},
					onSuccess:function(data) {
						winDialog.alert("评论恢复成功！", {
							funcOk:function() {
								window.location.reload();
							}
						});
					},
					onError:function(res) {
						showError(res.code);
					}
				});
			}
		});
	};
	**/
	/**
	$E("clearAll1").onclick = function() {
		winDialog.confirm("是否删除所有垃圾评论？删除后不可恢复。", {
			funcOk:function() {
				try {
					Core.Events.stopEvent();
				}catch(e) {
				
				}
				new Interface("http://control.blog.sina.com.cn/admin/comment/comment_clear_del.php?version=7", "jsload").request({
					GET: {
						uid:scope.$uid
					},
					onSuccess:function(data) {
						winDialog.alert("删除操作成功！", {
							funcOk:function() {
								window.location.reload();
							}
						});
					},
					onError:function(res) {
						showError(res.code);
					}
				});
			}
		});
	};
	**/
	
	window.commentResume2 = function(dom, url) {
		try {
			Core.Events.stopEvent();
		}catch(e) {
		
		}
		new Interface(url, "jsload").request({
			GET: {
				
			},
			onSuccess:function(data) {
				window.location.reload();
			},
			onError:function(res) {
				showError(res.code);
			},
			onFail:function(res) {
				trace("on Fail");
			}
		});
	};
	/**
	window.commentDelete = function(url) {
		try {
			Core.Events.stopEvent();
		}catch(e) {
		
		}
		new Interface(url, "jsload").request({
			GET: {
				
			},
			onSuccess:function(data) {
				window.location.reload();
			},
			onError:function(res) {
				showError(res.code);
			},
			onFail:function(res) {
				trace("on Fail");
			}
		});
	};
	**/
	
	
});
