/**
 * @fileoverview 名人 blog 推荐
 * @author dcw1123 | chengwei1@staff.sina.com.cn
 * @created 2010-07-01
 */

$import("sina/sina.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/dom/getElementsByClass.js");
$import("sina/core/dom/getLeft.js");
$import("sina/core/dom/getTop.js");
$import("sina/core/dom/setStyle.js");
$import("sina/core/array/foreach.js");
$import("lib/interface.js");
$import("lib/dialogConfig.js");
$import("lib/checkAuthor.js");

$import("lib/login/ui.js");

$import("sina/ui/tween.js");
$import("msg/attention.js");
$import("lib/app.js");
$import("lib/sysmsg.js");

$import("product/attention/attention.js");


//切换页签，供 onclick 使用
if(!App.curTab) App.curTab = 0;
App.popBlogRecomm_toTabs = function(toIdx, curDom){
	var tabsBox		= $E("popBlogRecomm_tabsBox");
	var pagesBox	= $E("popBlogRecomm_pagesBox");
	var tabs		= $T(tabsBox, "li");
	var pages		= $T(pagesBox, "ul");
	
	if(toIdx == App.curTab) return;
	if(!$T(curDom, "a")[0]) return;
	
	seal_A($T(curDom, "a")[0]);
	release_A($T(tabs[App.curTab], "a")[0]);
	
	curDom.className = "borderc current";			//完成状态切换
	tabs[App.curTab].className = "borderc";
	pages[toIdx].style.display = "";
	pages[App.curTab].style.display = "none";
	
	App.curTab = toIdx;
	
	function seal_A(sDom){
		sDom.removeAttribute("href");
		sDom.style.textDecoration = "none";
		sDom.blur();
	}
	function release_A(rDom){
		rDom.setAttribute("href", "javascript:return false;");
		rDom.style.textDecoration = "underline";
	}
};



//加关注
App.popBlogRecomm_addAttention = function(uid, node){
	$T(node, "a")[0].blur();
	
	new Interface("http://control.blog.sina.com.cn/riaapi/profile/attention_add.php", "ijax").request({
		POST:{
			uid			:scope.$uid,
			aid			:uid
		},
		onSuccess : function (data) {
		},
		onError : function (err) {
			var SUCC_MSG = "已关注";
			var hrefNode = $T(node, "a")[0];
			var txtNode = $T(node, "cite")[0];
			switch(err.code){
				case "A33004":
				case "A33001":
					// updateAttButton({
					// 	txtNode:	txtNode,
					// 	text:		SUCC_MSG
					// });
					txtNode.innerHTML = SUCC_MSG;
					hrefNode.style.cssText += "; cursor:text; color:#999;";
					txtNode.style.cssText += "; cursor:text !important; text-decoration:none;";
					node.onclick = function(){ return false; };				//取消点击事件
					break;
				default:
					winDialog.alert($ATTENTION_MSG[err["code"]]);
					break;
			}
		}
	});
	
	/**
	 *	按钮变色动画
	 *	@ oParam.txtNode	//
	 *	@ oParam.text;		//
	 *	@ oParam.color;		//
	 */
	function updateAttButton(oParam){
		oParam.fontSize = oParam.fontSize || "12px";
		oParam.color	= oParam.color || "#5f9b00";	//绿色
		
		var top = Core.Dom.getTop(oParam.txtNode);
		var left = Core.Dom.getLeft(oParam.txtNode);
		var colorTxtNode			= $C("p");
		colorTxtNode.innerHTML		= oParam.text;
		colorTxtNode.style.cssText 	+= "; position:absolute; font-size:"+oParam.fontSize+"; color:"+oParam.color+"; left:"+left+"px; top:"+top+"px;"
		oParam.txtNode.innerHTML	= oParam.text;
		
		Core.Dom.setStyle(oParam.txtNode, "opacity", 0);
		document.body.appendChild(colorTxtNode);
		Ui.tween(oParam.txtNode, "opacity", 1, 1, "regularEaseIn");
		Ui.tween(colorTxtNode, "opacity", 0, 1, "regularEaseIn", {
			end:function(){
				document.body.removeChild(colorTxtNode);
			}
		});
	}
};


App.popBlogRecomm_addAttention = function(aid, node){
	var SUCC_MSG = "已关注";
	var hrefNode = $T(node, "a")[0];
	var txtNode = $T(node, "cite")[0];
	var attObj = new scope.Attention();
	
	/*判断登陆状态*/
	Lib.checkAuthor();
	if(!$isAdmin){
			new Lib.Login.Ui().login(function() {
					location.reload();
			});
			return;
	}
	
	attObj.add(scope.$uid, aid, false, function(){		//uid, aid, simpleMode, callback
		txtNode.innerHTML = SUCC_MSG;
		hrefNode.style.cssText += "; cursor:text; color:#999;";
		txtNode.style.cssText += "; cursor:text !important; text-decoration:none;";
		node.onclick = function(){ return false; };				//取消点击事件
	});
};




//分页
App.popBlogRecomm_pagination = function(_class, _type, _page, _id){
	var mod = _id.split("_")[1];
	new Interface("http://control.blog.sina.com.cn/riaapi/feed/feed_class.php?version=7", "jsload").request({
		GET:{
			'class': _class,
			'type': _type,
			'page': _page,
			'file': mod
		},
		onSuccess:function(res){
			var feedPartDom = $E(_id);
			if(!feedPartDom) return;
			
			feedPartDom.innerHTML = res.html;
			toAnchor(_id);
			function toAnchor(a){
				var href = window.location.href;				//处理锚点的 # 号。
				href = href.replace(/#.*/, "");
				if(a.indexOf("#") > -1){
					href += a;
				}else{
					href += "#"+a;
				}
				window.location.href = href;
			}
		},
		onError:function(res){
			winDialog.alert($SYSMSG[res.code]);
		}
	});
};




