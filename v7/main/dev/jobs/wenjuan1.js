$import("lib/panel.js");
$import("sina/core/system/winSize.js");
$import("sina/core/dom/getXY.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/dom/getStyle.js");
$registJob('wenjuan1', function() {
    time = new Date('Thu Aug 26 2015 14:00:00 GMT+0800 (CST)').getTime();
    var now = +new Date();
    if (now <= time) {
        drawBtn();
    }

    function drawBtn() {
        var panel = new Lib.Panel();
        root = $E('sinablogbody');
        var html = '<a id="#{panel}" onclick="window.v7sendLog(\'15_05_03\')" href="http://www.wenjuan.com/s/mEZNNb/" target="_blank" style="display: block; padding: 5px 0; background:#ff3030; color: #ffe400; width: 58px; text-align: center; font-weight: bold; font-size: 22px; text-decoration: none; line-height:24px;">有奖调查</a>'
        panel.noIframe = true;
        panel.setTemplate(html);
        var tWidth = parseInt(Core.Dom.getStyle(panel.entity, 'width'));
        panel.setFixed(true);
        panel.show();
        var lt = getLT();
        panel.setPosition(lt.left, lt.top);
        var addEvent = Core.Events.addEvent;
        addEvent(window, resize, 'resize');
        addEvent(window, resize, 'scroll');

        var resizeT;

        function resize() {
            if (resizeT) clearTimeout(resizeT);
            resizeT = setTimeout(function() {
                    var lt = getLT();
                    panel.setPosition(lt.left, lt.top);
                },
                300);
        }

        function getLT() {
            var btnWidth = 58,
                btnHeight = 58
            var ws = Core.System.winSize();
            var rootOffset = Core.Dom.getXY(root);
            var rootWidth = parseInt(Core.Dom.getStyle(root, 'width'));
            var left = Math.min(ws.width - btnWidth - 20, rootOffset[0] + rootWidth + 5);
            var top = Math.max(ws.height - 260 - btnHeight, 80);
            if(top > 80) {
                top -= 68;
            } else {
                top += 68;
            }
            return {
                left: left,
                top: top
            }
        }

    }

});
