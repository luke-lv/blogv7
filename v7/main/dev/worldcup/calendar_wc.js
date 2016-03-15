/**
 * @fileoverview | 正文页日历
 * @author dcw1123 | chengwei1@staff.sina.com.cn
 */

$import('sina/sina.js');
$import("sina/ui/template.js");
$import("sina/ui/tween.js");
$import("sina/core/dom/setStyle.js");
$import("sina/core/dom/getLeft.js");
$import("sina/core/dom/getTop.js");
$import("sina/core/string/trim.js");
$import("sina/core/system/br.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/stopEvent.js");

var CalendarWc = function () {
    //show 做出放大透明特效。
    //show 做一个斜抛物线轨迹。
    //通过本地时间找到月和日，标上 cur。
    //通过变量找到月日，标上 new。
    //只有 new 才注册事件。
    //new 是有事件，cur 是当天。
    //过天了，日历更新么？自己刷，更个毛啊。

    //变量名
    //var attentionWorldCup = {"show_attentiongame":[1,2,3,4], "show_attentionteam":[], "show_attentiondate":[]};

    this.entity = $E("wdc_calender");
    this.closeBtn = $E("wcc_close");
    this.fakeImg = $C("div");
    this.switchOn = false;
    this.isTween = false;

    this.posRelDom = null;
    this.lockPosX;			//校正位置使用
    this.lockPosY;

    this.initialize();
};
CalendarWc.prototype = {

    initialize: function () {
        if (!this.entity) return;

        var _this = this;
        this.fakeImg.style.cssText = "z-index:612; position:absolute; border:2px solid #d2d9e6; background-color:white;";
        document.body.insertBefore(this.fakeImg, document.body.firstChild);

        this.renderNew();
        this.renderToday();

        //Core.Events.addEvent(document, function(){ _this.resetCalendar(); });
        Core.Events.addEvent(this.closeBtn, function () {
            _this.resetCalendar();
        });
        Core.Events.addEvent(window, function () {
            _this.justiPos();
        }, "resize");
        // Core.Events.addEvent(this.entity, function(){
        // 	Core.Events.stopEvent();
        // });
    },

    //重置日历状态
    resetCalendar: function () {
        try {
            Ui.tween.stop(this.fakeImg);
        } catch (e) {
        }		//阻止回调。
        Core.Dom.setStyle(this.entity, "display", "none");
        Core.Dom.setStyle(this.entity, "visibility", "hidden");
        Core.Dom.setStyle(this.fakeImg, "display", "none");
        this.switchOn = false;
        this.isTween = false;
    },

    //校正位置
    justiPos: function () {
        if (!this.switchOn) return;
        Core.Dom.setStyle(this.entity, "left", (Core.Dom.getLeft(this.posRelDom) - this.lockPosX) + "px");
        Core.Dom.setStyle(this.entity, "top", (Core.Dom.getTop(this.posRelDom) - this.lockPosY) + "px");
    },

    //渲染有赛事日期样式
    renderNew: function () {
        var _this = this;
        var attDate = attentionWorldCup.show_attentiondate;
        if (!attDate && !attDate.length) return;
        for (var i = 0; i < attDate.length; i++) {
            var curLi;
            var month_day = attDate[i].split("_");
            curLi = $E("wcc_" + month_day[0] + "_" + month_day[1]);
            if (!curLi) break;
            //alert(2)
            $T(curLi, "a")[0].title = "有关注的赛事";		//添加title。
            //$T(curLi, "a")[0].onclick = function(){ return true; };				//取消，否则跳不了。
            this.addClass(curLi, "new");
            Core.Events.addEvent(curLi, (function (i) {
                return function () {
                    _this.resetCalendar();
                    window.location.href = "#" + attDate[i];
                }
            })(i));
        }
    },

    //渲染今天样式
    renderToday: function () {
        var month = new Date().getMonth() + 1;
        var day = new Date().getDate();
        this.addClass($E("wcc_" + month + "_" + day), "cur");
    },

    //
    setPos: function (withDom, offsetLeft, offsetTop) {
        this.posRelDom = withDom;			//位置依赖。
        var left = Core.Dom.getLeft(withDom) + (offsetLeft ? offsetLeft : 0);
        var top = Core.Dom.getTop(withDom) + (offsetTop ? offsetTop : 0);
        if ($IE6 && $IE7) {
            left += document.documentElement.scrollLeft;
            top += document.documentElement.scrollTop;
        }
        this.fakeImg.style.left = left + "px";
        this.fakeImg.style.top = top + "px";
    },

    //抛物线补间，求对应y，y 值域 [-20, 30]
    //比较SB，回头写一个通用的。
    //再回头写个阿基米德螺线的。
    arcFunc: function (a, b, c) {
        return function (x) {
            return a * x * x + b * x + c;
        }
    },
    // getArcMotionY : function(startPoint, x){
    // 	return startPoint.y - this.arcFunc(-0.00118, 0.34365, 0)(Math.abs(startPoint.x - x));
    // },

    //tween 动画弹出
    tweenPlay: function () {
        this.resetCalendar();				//狂点事件源。

        var _this = this;
        Core.Dom.setStyle(this.entity, "display", "");
        Core.Dom.setStyle(this.fakeImg, "display", "");
        Core.Dom.setStyle(this.fakeImg, "opacity", 0.6);
        Core.Dom.setStyle(this.fakeImg, "width", "48px");
        Core.Dom.setStyle(this.fakeImg, "height", "15px");

        //改 tween 麻烦。
        //这个必须传入 x y 的初始值 作 原点 offset
        //必须依赖时间片，不能依赖上一个值。可以依赖别的值。
        //var dTime = 300;
        //var step = 10;
        //var arcTimer = 0;
        // var startPoint = {
        // 	x: Core.Dom.getLeft(_this.fakeImg),
        // 	y: Core.Dom.getTop(_this.fakeImg)
        // }
        // arcTimer = setInterval(function(){
        // 	var left = Core.Dom.getLeft(_this.fakeImg);
        // 	_this.fakeImg.style.top = _this.getArcMotionY(startPoint, left) + "px";
        // 	dTime -= step;
        // 	if(dTime <= 0) clearInterval(arcTimer);
        // }, step);

        this.isTween = true;
        new Ui.tween(this.fakeImg, ["opacity", "height", "width", "left"], [1, this.entity.offsetHeight - 4,
                    this.entity.offsetWidth - 4, Core.Dom.getLeft(this.posRelDom) - 217],		//-4 是 border。
            0.3, "strongEaseIn", {end: function () {		//播放完毕，显示节点，然后自己隐身。
                new Ui.tween(_this.fakeImg, ["opacity"], [1], 0.1, "simple", {
                    end: function () {
                        _this.entity.style.left = Core.Dom.getLeft(_this.fakeImg) + "px";
                        _this.entity.style.top = Core.Dom.getTop(_this.fakeImg) + "px";
                        _this.fakeImg.style.display = "none";
                        _this.entity.style.visibility = "visible";
                        _this.switchOn = true;
                        _this.lockPosX = Core.Dom.getLeft(_this.posRelDom) - Core.Dom.getLeft(_this.entity);
                        _this.lockPosY = Core.Dom.getTop(_this.posRelDom) - Core.Dom.getTop(_this.entity);
                    }
                });
            }});
    },

    addClass: function (dom, clz) {		//有则不加。class 唯一。
        if (!dom) return false;
        if (!this.hasClass(dom, clz)) {
            dom.className = Core.String.trim(dom.className.concat(" " + clz));
        }
    },
    delClass: function (dom, clz) {		//全删，再次保证 class 唯一。	//( +|^)clz(?=( |$))
        if (!dom) return false;
        var reg = new RegExp("(?: +|^)" + clz + "(?=( |$))", "ig");
        dom.className = Core.String.trim(dom.className.replace(reg, ""));
    },
    hasClass: function (dom, clz) {		//不能用 indexOf 判断。
        if (!dom) return false;
        var reg = new RegExp("(?: +|^)" + clz + "(?=( |$))", "ig");
        return reg.test(dom.className);
    }
};

$registJob('calendar_wc', function () {

    //世界杯变量不存在，不处理。
    if (typeof(attentionWorldCup) == "undefined") return;

    var wcc = new CalendarWc();
    $E("calendar_wc").onmouseover = function () {
        if (wcc.isTween) return;
        wcc.setPos(this, 0, 0);			//设定动画的初始位置和依赖节点。
        wcc.tweenPlay();
        return false;
    };
});


