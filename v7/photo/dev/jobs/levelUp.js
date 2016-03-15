/**
 * @fileoverview 用户升级提示层
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2009-09-18
 */

$import("sina/sina.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/removeEvent.js");
$import("sina/utils/flash/swf.js");
$import("sina/core/system/winSize.js");
$import("sina/ui/dialog/backShadow.js");

$import("lib/panel.js");

$registJob("levelUp", function(){
	if (scope.$isLevelUp) {
		var bs=new BackShadow(0.4);
		var levelUpPanel = new Lib.Panel();
		var w = 647, h = 460;
		levelUpPanel.setTemplate('<div style="position:absolute;z-index:2000;" id="#{panel}"></div>');
		Utils.Flash.swfView.Add($_GLOBAL.flashBasicURL + "levelUp.swf", levelUpPanel.entity.id, "swfLevelUp", w, h, "8", "#ffffff", {}, {
			allowScriptAccess: "always",
			wmode: "transparent"
		});
		bs.show();

		function setLayerMiddle(){
			var win = Core.System.winSize();
			var _x = win.width / 2 - w / 2;
			var _y = win.height / 2 - h / 2 - 20;
			levelUpPanel.setPosition(_x, _y);
			levelUpPanel.show();
			levelUpPanel.setFixed(true);
		}
		
		setLayerMiddle();
		
		Core.Events.addEvent(window, setLayerMiddle, "resize");
		
		window.$closeLevelUpPanel = function(){
			levelUpPanel.close();
			bs.close();
			Core.Events.removeEvent(window, setLayerMiddle, "resize");
		};
	}
});