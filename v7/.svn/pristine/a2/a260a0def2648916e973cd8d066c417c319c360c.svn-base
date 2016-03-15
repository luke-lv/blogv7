/*
* author : meichun1@staff.sina.com.cn 
* 育儿博客 开通注册 加关注
* 17:38 2010/8/5
*/
$import("sina/sina.js");
$import("sina/core/array/foreach.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/system/br.js");
$import("lib/interface.js");

$import("msg/regmsg.js");

$import("lib/dialogConfig.js");

$registJob("baby_concern",
function() {

		DialogTemplate.alert=$SYSMSG.alert;
		var blogContactLi = $T($E('blogContact'), "li");

		/*添加事件*/
		var cur = function(elem) {
				return (/current/).test(elem.className);
		};
		Core.Array.foreach(blogContactLi,
		function(elem, i) {
				elem.onmouseover = function(evt) {
						evt = evt || event;
						if ((evt.target || evt.srcElement).nodeName == "A") {
								return true;
						}
						elem.className = cur(elem) ? "current curhover": "hover";
				};

				elem.onmouseout = function() {
						elem.className = cur(elem) ? "current": "";
				};

				elem.onclick = function(evt) {
						evt = evt || event;
						if ((evt.target || evt.srcElement).nodeName == "A") {
								return true;
						}
						elem.className = cur(elem) ? "hover": "current curhover";
				};
		});

		var next = $E("next");

		/*提交数据*/
		next.onclick = function() {
				var data = [];
				Core.Array.foreach(blogContactLi,
				function(li) {
						if (li.className.match(/current/)) {
								data.push(li.id);
						}
				});
				new Interface("http://control.blog.sina.com.cn/riaapi/reg/attention_add_batch.php", "jsload").request({
						GET: {
								uid: scope.$uid,
								aids: data + "",
								version: 7
						},
						onSuccess: function(res) {
								window.location.href = "http://blog.sina.com.cn/u/" + scope.$uid;
						},
						onError: function(res) {
								winDialog.alert($SYSMSG[res.code], {
										funcOk: function() {
												if (res.code == "A11003") {
														window.location.href = "http://blog.sina.com.cn/u/" + scope.$uid;
												}
										}
								});
						}
				});
				return false;
		};

});