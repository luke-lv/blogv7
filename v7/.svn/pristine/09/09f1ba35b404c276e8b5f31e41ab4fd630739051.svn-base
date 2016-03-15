/**
 * @fileoverview 广州2010亚运会 提示消息
 * @author meichun1@staff.sina.com.cn
 * @created 13:33 2010/10/29
 */

$import("sina/sina.js");
$import("sina/core/class/define.js");
$import("sina/core/events/addEvent.js");
$import("sina/utils/io/jsload.js");

$import("sina/core/dom/opacity.js");
$import("sina/core/dom/getStyle.js");

$import("sina/utils/cookie/setCookie.js");

$import("lib/component/platformTray/templates/gz2010Template.js");
$import("lib/panel.js");

$import("lib/sendLog.js");


scope.gz2010Tip = Core.Class.define(function() {
		Lib.Panel.prototype.initialize.apply(this, arguments);
		this.setTemplate(scope.gz2010Template);
},
Lib.Panel, {
		initUserInfo: function(nick, uid) {

				if (Utils.Cookie.getCookie("gz2010" + uid) == 1 || Utils.Cookie.getCookie("hgz2010" + uid) == 1) {
						return;
				}

				var nodes = this.getNodes();
				var _this = this;
				nodes["nickname"].innerHTML = nick;

				nodes["linkimg"].href = nodes["linktext"].href = "http://blog.sina.com.cn/u/" + uid;
				nodes["linkimg"].target = nodes["linktext"].target = "_blank";

				nodes['headp'].src = "http://portrait" + (uid % 8 + 1) + ".sinaimg.cn/" + uid + "/blog/50";

				this.setFixed($E("loginBarActivity"), -218, 1);

				nodes["vote"].onclick = nodes["linkimg"].onclick = nodes["linktext"].onclick = nodes['close'].onclick = function() {

						_this.hidden();
						Utils.Cookie.setCookie("gz2010" + uid, 1, 24, "/", ".blog.sina.com.cn");
						v7sendLog("90_01_02",scope.$pageid,'');

				};
				nodes['setc'].onclick = function() {
						_this.hidden();
						Utils.Cookie.setCookie("hgz2010" + uid, 1, 24 * 100, "/", ".blog.sina.com.cn");
				};
				v7sendLog("90_01_01",scope.$pageid,'');

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