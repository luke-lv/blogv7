/**
 * @fileoverview msn 提示消息
 * @author wujian@staff.sina.com.cn
 * @created 2010-12-9
 */

$import("sina/sina.js");
$import("sina/core/class/define.js");
$import("sina/core/events/addEvent.js");
$import("sina/utils/io/jsload.js");

$import("sina/core/dom/opacity.js");
$import("sina/core/dom/getStyle.js");

$import("sina/utils/cookie/setCookie.js");

$import("lib/component/platformTray/templates/msnTipsTemplate.js");
$import("lib/panel.js");

$import("lib/sendLog.js");


scope.msnTips = Core.Class.define(function() {
		Lib.Panel.prototype.initialize.apply(this, arguments);
		this.setTemplate(scope.msnTipsTemplate);
},
Lib.Panel, {
		initUserInfo: function(nick, uid) {
				var nodes = this.getNodes();
				
				this.setFixed($E("loginBarActivity"), -230, -2);
				var _this = this;
				nodes["close"].onclick = function() {
					//alert(1)
					_this.hidden();
				};
				nodes['noMoreShow'].onclick = function() {
					_this.hidden();
					Utils.Cookie.setCookie("noMoreMsnTips" + $UID, 1, 24 * 100, "/", ".blog.sina.com.cn");
				};
				nodes['setNow'].onclick = function() {
					v7sendLog("95_02_01",scope.$pageid,'');
				};
		},
		setFixed: function(dom, offsetLeft, offsetTop) {
				var _this = this;				
				setTimeout(function() {
						_this.showWithDom(dom, offsetLeft, offsetTop);
						_this.fadeIn();
				},
				2000)

				Core.Events.addEvent(window, function() {
						var x = Core.Dom.getLeft(dom) + dom.offsetWidth + offsetLeft;
						var y = Core.Dom.getTop(dom) + dom.offsetHeight + offsetTop;
						if ($IE6 && _this.isFixed) {
								x = x - document.documentElement.scrollLeft;
								y = y - document.documentElement.scrollTop;
						}
						_this.setPosition(x, y);
				},
				"resize");
		},
		fadeIn: function() {
				var entity = this.entity;
				Core.Dom.opacity(entity, 0);
				var i = 0;
				(function fn() {
						Core.Dom.opacity(entity, i += 5);

						if (Core.Dom.getStyle(entity, 'opacity') < 1) {
								setTimeout(fn, 20)
						}
				})();

		}
});