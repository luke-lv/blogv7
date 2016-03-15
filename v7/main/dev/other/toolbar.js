/**
 * @fileoverview
 * 博客个首右下角的工具条
 * 	出现条件：
 * 		一、访客登录查看他人博客个首
 * 		二、当前页面的 document.referrer 是 个人中心
 * 		三、当前登录者满足两个条件之一：与博主不是好友或没关注博主
 *	工具条出现位置，页面右下角
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @history
 *
 */
$import("sina/core/function/bind2.js");
$import("sina/ui/panel.js");
$import("sina/utils/cookie/deleteCookie.js");

$import("lib/app.js");
$import("lib/checkAuthor.js");
$import("lib/interface.js");
$import("lib/component/include/attention.js");
$import("lib/component/include/invite.js");

App.ToolBar = function () {
	if(!$isLogin){
		Lib.checkAuthor();
	}
	// 如果 document.referrer 不是 个人中心，或者未登录，或者是博主本人，都不做任何处理
	if(/^http:\/\/control\.blog\.sina\.com\.cn\/blogprofile\/index\.php/.test(document.referrer) != true
			|| !$isLogin || $isAdmin){
		return;
	}
	this.init();
};

App.ToolBar.prototype = {
	width	: 351,
	height	: 31,
	init	: function () {
		var __this = this;
		// 检查当前访客和博主是否既不是好友，也没关注博主，如果是，就出工具条
		var getRelationship = new Interface("http://control.blog.sina.com.cn/riaapi/activity/get_relation.php", "jsload");
		getRelationship.request({
			GET : {
				bzuid	: scope.$uid,
				lguid	: $UID
			},
			onSuccess	: function (oData){
				oData = oData || {};
				var is_friend = oData.is_friend;
				var is_attention = oData.is_attention;
				if(is_friend == 0 && is_attention == 0){
					__this.domInit(is_friend, is_attention);
				}
			},
			onError	: function (){},
			onFail	: function (){}
		});
	},
	domInit	: function (bIsFriend, bIsAttention) {
		var __this = this;
		var _add_attention = bIsAttention ? ' btn01_dis" onclick="return false"'
									: '" onclick="Lib.Component.Attention();this.className=\'btn01 btn01_dis\';return false;';
		var _add_friend = bIsFriend ? ' btn02_dis" onclick="return false"'
									: '" onclick="Lib.invite(\'' + scope.$uid + '\');return false;';
		var html = ['<div id="#{entity}" class="toolbar">'
				, '<a href="#" class="btn01' + _add_attention + '" title="关注此博主"></a>'
			    , '<a href="#" class="btn02' + _add_friend + '" title="加好友"></a>'
			    , '<a href="http://control.blog.sina.com.cn/blogprofile/index.php" class="link01"'
					, ' title="返回个人中心">返回个人中心&gt;&gt;</a>'
			    , '<span id="#{content}" class="link02"><a id="#{blog680}" href="#" class="on"'
					, ' onclick="return false;">博客推荐</a></span>'
			, '</div>'	
			].join("");
				
		if (!this._dialog) {
			this._dialog = new Ui.Panel();
			this._dialog.setTemplate(html);
			this._dialog.entity.style.zIndex = "101";
			if(this._dialog.ifm){
				this._dialog.ifm.style.zIndex="101";
			}
			this._dialog.setFixed(true);
			this._dialog.setPos	= function (){
				// location
				var pageSize = Core.System.pageSize();
		    	var _x = Math.min(pageSize[2], document.documentElement.clientWidth) - __this.width;
		   		var _y = Math.min(pageSize[3], document.documentElement.clientHeight) - __this.height;
		        __this._dialog.setPosition({
		            x: _x,
		            y: _y
		        });
			};
			this._dialog.setPos();
			this._dialog.show();
			this.nodes = this._dialog.getNodes();

			if(scope.handler_680 != null){
				setTimeout(function () {
					scope.handler_680._toolbarHeight = 31;
					(scope.handler_680.setPos.bind2(scope.handler_680))();
					__this.nodes.blog680.className = "on";
				}, 1000);
			}
			
			Core.Events.addEvent(this.nodes.blog680, function(){
				if(__this.show680){
					__this.show680();
				}
			});
			
			Core.Events.addEvent(window, function(){
				if(__this._dialog && __this._dialog.entity){
					__this._dialog.setPos();
				}
			},"resize");
		}
	},
	show680	: function () {
		var __this = this;
		
		var show = function () {
			scope.handler_680._mode = "many";
			scope.handler_680._toolbarHeight = 31;
			(scope.handler_680.setPos.bind2(scope.handler_680))();
			if(scope.handler_680._slide == null){
				(scope.handler_680.show.bind2(scope.handler_680))();
			}else{
				(scope.handler_680.toggle.bind2(scope.handler_680))();
			}
		};
		
		if(scope.handler_680 == null || scope.handler_680 == ""){
			$callJob("680");
		}else{
			if(scope.handler_680.uiStatus == "0"){
				scope.handler_680 = null;
				$callJob("680");
				setTimeout(function () {
					show();
					__this.nodes.blog680.className = "";
				}, 1000);
			}
			else{
				show();
				this.nodes.blog680.className = (scope.handler_680.uiStatus == "1") ? "on" : "";
			}
		}
	}
};