/**
 * @fileoverview | 世界杯关注队
 * @author dcw1123 | chengwei1@staff.sina.com.cn
 */

$import('sina/sina.js');
$import("sina/ui/tween.js");
$import("sina/core/system/br.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/stopEvent.js");
$import("sina/core/system/br.js")

$registJob('teams_wc', function () {

    //世界杯变量不存在，不处理。
    if (typeof(attentionWorldCup) == "undefined") return;

    new FavTeamsInfo();

    //统计世界杯博文 PV：00000 300
    // var url = "http://hits.blog.sina.com.cn/hits?act=3&uid=00000300&tm"+new Date().getTime();
    var url = "http://comet.blog.sina.com.cn/api?maintype=hits&act=3&uid=00000300&tm" + new Date().getTime();
    Utils.Io.JsLoad.request(url, {
        onComplete: function () {

        }
    });
});

var FavTeamsInfo = function () {
    //鼠标 hover 的半透放大缩小 animation。
    //不用渲染，直接找到节点注册事件。
    //hover class 后显示就能凑效。

    this.entity = $E("favTeams");
    if (!this.entity) return;

    this.allTeams = $T(this.entity, "li");
    this.isTweenIn = [];
    this.isTweenOut = [];

    this.initialize();
};
FavTeamsInfo.prototype = {

    initialize: function () {
        if (!this.entity) return;

        var _this = this;
        var zIndex = 64;			//解決 IE6 7 的遮擋。
        Core.Array.foreach(this.allTeams, function (team, i) {
            var tar = $T(team, "p")[1];
            tar.style.zIndex = 512;
            team.style.zIndex = zIndex--;
            Core.Events.addEvent(team, function () {
                if (!$IE)
                    if (!_this.justIn(Core.Events.getEvent(), team)) return;
                _this.tweenIn(team, tar, i);		//弄完置 false
            }, $IE ? "mouseenter" : "mouseover");

            Core.Events.addEvent(team, function () {
                if (!$IE)
                    if (!_this.justIn(Core.Events.getEvent(), team)) return;
                _this.tweenOut(team, tar, i);
            }, $IE ? "mouseleave" : "mouseout");

        });
    },

    //mouseover		evt.target 是被 over 的		evt.relatedTarget 是被 out 的
    //mouseout		evt.target 是被 out 的		evt.relatedTarget 是被 over 的
    //主要目的是让响应的 in 和 out 事件都无效。判断是否是子节点。
    //就是边界可能离 body 远而慢，要真是内部节点，很快就能得到结果。
    //必须使用 relatedTarget。
    //over out 可以通用。
    justIn: function (evt, bNode) {		//bNode 边界节点
        var reltarg = evt.relatedTarget;
        while (reltarg && (reltarg != bNode)) reltarg = reltarg.parentNode;
        return (reltarg != bNode);		//意思是……if(justIn()){  } 或者 if(!justIn()) return;
    },

    //tween 动画弹出
    tweenIn: function (team, tar, i) {
        try {
            Ui.tween.stop(tar);
        } catch (e) {
        }
        var _this = this;
        team.className = "hover";
        Core.Dom.setStyle(tar, "opacity", 1);
        tar.style.display = "";

        //new Ui.tween(tar, ["opacity"], [1], 0.3, "simple");
    },

    //tween 动画回退
    tweenOut: function (team, tar, i) {
        var _this = this;

        //是否要看 opacity 的比例，来决定时间长度？
        new Ui.tween(tar, ["opacity"], [0], 0.3, "simple", {
            end: function () {
                tar.style.display = "none";
                team.className = "";
            }
        });
    }
};




