/**
 * @author wujian@staff.sina.com.cn 2010-8-12
 * 魔法表情 播放
 */
$import("sina/utils/flash/swfObject.js");
$import("sina/ui/dialog/backShadow.js");
$import("sina/core/system/winSize.js");
$import("sina/core/events/stopEvent.js");
$import("sina/core/math/getUniqueId.js");
$import("lib/panel.js");
$import("sina/core/system/getScrollPos.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/removeEvent.js");
$import("lib/dialogConfig.js");

/**
 * 播放魔法表情
 */
/*
 * html 标签示例
 * <a href="#">
 * 		<img src="1.gif" alt=""/>
 * 		<span class="icon" title="播放表情" onclick="window.$magicFacePlay('1.swf');"></span>
 * 
 * </a>
 */
/**
 * 显示 升级提示
 */
var showUpTips = function () {
    winDialog.alert('您可以在<a href="http://get.adobe.com/flashplayer/" target="_blank">此处下载免费的Adobe flash player installer</a>。成功安装程序后，可返回此处查看。', {
        icon: "01"
        /*							funcOk: function(){window.location.reload(); }*/
    });

};
scope.magicCfg = {};
window.$magicFacePlay = function (swfName) {
    //检查flash版本
    var ver;
    if (!scope.flashVersion) {
        scope.flashVersion = deconcept.SWFObjectUtil.getPlayerVersion();
    }
    ver = scope.flashVersion;

    if (ver.major < 9) {
        showUpTips();
        return;
    }
    //阻止事件往上传播
    Core.Events.stopEvent();
    var cfg = {    "alphaNodeId": "alphaNode",//透明层
        "containerDiv": "magicFaceCon"//conDiv"//swf 文件容器 获取宽高用
    };
    //背景准备
    var layer = ['<div id="magicFaceCon" title="" alt="" style="height:360px; width:360px;">', '</div>'].join("");
    scope.magicCfg.layer = new Lib.Panel();
    scope.magicCfg.layer.setTemplate('<div style="position:absolute;z-index:2000;" id="#{panel}" title="" alt="">' + layer + '</div>');
    //trace("here 2");
    scope.magicCfg.layer.show();
    var swfId = "magicFace";
    /**
     * 添加swf节点
     */
    var addSwf = function () {

        scope.magicCfg.shadow = new BackShadow(0.4);
        scope.magicCfg.shadow.entity.setAttribute("title", "点击关闭动画");
        scope.magicCfg.shadow.entity.setAttribute("alt", "点击关闭动画");
        scope.magicCfg.shadow.entity.onclick = removeSwf;
        Core.Events.addEvent(document, escDown, "keydown");

        scope.magicCfg.shadow.show();
        var win = Core.System.winSize();
        var scroll = Core.System.getScrollPos(document);
        var _x = win.width / 2 - 360 / 2 + scroll[1];
        var _y = win.height / 2 - 360 / 2 + scroll[0];
        //con.style.cssText="width:"+_x+"px; height:"+_y+"px;";

        scope.magicCfg.layer.setPosition(_x, _y);

        //评论表情中的动漫表情上加链接
        var overlayDiv = document.createElement("div");
        overlayDiv.id = "___flashOverlay";
        overlayDiv.style.cssText = "cursor:pointer;visibility:hidden;background:white;;z-index:3000;position:absolute;width:360px;height:360px;top:" + _y + "px;left:" + _x + "px";
        document.body.appendChild(overlayDiv);
        if (document.all) {
            overlayDiv.style.filter = "Alpha(Opacity=0)";
        } else {
            overlayDiv.style.opacity = 0;
        }
        overlayDiv.style.visibility = "visible";

        Core.Events.addEvent(overlayDiv, function () {
            window.open("http://blog.sina.com.cn/myshow2010");
        });
        overlayDiv = null;

        //var swfId="article_comment_list";
        //在div 容器中 加载flash 节点
        var FlashPlayer = new Utils.Flash.swfObject("http://www.sinaimg.cn/uc/myshow/blog/misc/gif/" + swfName + "?t=" + Core.Math.getUniqueId(), swfId, 360, 360, 9, "#FFFFFF");

        FlashPlayer.addParam("quality", "high");
        FlashPlayer.addParam("wmode", "transparent");
        FlashPlayer.addParam("allowScriptAccess", "always");
        FlashPlayer.write(cfg.containerDiv);
        //	$E(cfg.alphaNode).class="";
        //if(!scope.magicCfg.shadow){

        //}

    };
    /**
     * 移除swf节点
     */
    var removeSwf = function () {
        trace("swf remove!!!");

        var con = $E(cfg.containerDiv);
        if (con) {
            con.innerHTML = "";
        }

        window.clearInterval(timer);

        Core.Events.removeEvent(document, escDown, "keydown");

        try {
            scope.magicCfg.shadow.close();
            scope.magicCfg.layer.close();
            Core.Events.stopEvent();
        } catch (e) {

        }

        if ($E("___flashOverlay")) {
            document.body.removeChild($E("___flashOverlay"));
        }
    };
    /**
     * esc 键 事件响应
     * @param {Object} e
     */
    var escDown = function (e) {
        var curKey = e.keyCode || e.which || e.charCode;
        if (curKey === 27) {
            removeSwf();
            Core.Events.removeEvent(document, escDown, "keydown");
            Core.Events.stopEvent();
            return false;
        }

    };
    //执行 添加swf
    addSwf();
    //循环检测加载进度
    var timer = window.setInterval(function () {
        trace("……追踪 进度……");
        var swf = $E(swfId);
        var snap = 0;
        if (swf && swf.PercentLoaded() == 100) {
            //swf节点绑事件
            swf.onclick = function () {
                Core.Events.stopEvent();
            };
            trace("swf 加载完毕了………………");
            //调整 swf位置
            var con = swf.parentNode;
            var scroll = Core.System.getScrollPos(document);
            var win = Core.System.winSize();
            var _x = win.width / 2 - con.offsetWidth / 2 + scroll[1];
            var _y = win.height / 2 - con.offsetHeight / 2 + scroll[0];
            //con.style.cssText="width:"+_x+"px; height:"+_y+"px;";

            scope.magicCfg.layer.setPosition(_x, _y);
            //trace("here 2");
            scope.magicCfg.layer.show();

            trace("flash size x=" + con.offsetWidth + "  y=" + con.offsetHeight)

            window.clearInterval(timer);
            //加载完毕 检测播放进度
            timer = window.setInterval(function () {
                //	trace("timer 更换！！！！！")
                var curr = swf.CurrentFrame();
                var total;
                try {
                    total = swf.TotalFrames();
                } catch (e) {
                    total = swf.TotalFrames;
                }
                if (curr < 0) {
                    return
                }
                if (curr < total && snap <= curr) {
                    snap = curr
                } else {
                    //删除swf
                    removeSwf();
                }
            }, 80);
        }
    }, 100);

};
