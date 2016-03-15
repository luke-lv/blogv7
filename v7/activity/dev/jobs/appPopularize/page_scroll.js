/*
* @fileoverview page scroll 
* @author jiangwei5
*/
$import('sina/core/system/winSize.js');
$import('sina/core/dom/getTop.js');
$import('sina/core/events/addEvent.js');
$import('sina/core/events/getEvent.js');
$import('sina/core/events/stopDefaultEvent.js');
$import('sina/core/dom/addClass.js');
$import('sina/core/dom/removeClass.js');
$import("sina/core/array/findit.js");

$registJob('pageScroll', function(){
    var winSize = Core.System.winSize();
    var getTop = Core.Dom.getTop;
    var addEvent = Core.Events.addEvent;
    var rmClass = Core.Dom.removeClass;
    var addClass = Core.Dom.addClass;
    var stopDefaultEvent = Core.Events.stopDefaultEvent;
    var getEvent = Core.Events.getEvent;
    
    var ids = ["download","subscibe","special","guess-you-like","offline-reading","huge-periodical","foot"];
    var pageScroll = {
        rootDom: $E("wrap"),
        tabs: $E("dot"),
        current: null,
        timer: null,
        showTimer: null,
        scrollStatus: 0,
        cTop: 0,
        speed: 4,//1、2、3
        init: function (){
            var self = this;
            var curr = location.hash.substr(1) || ids[0];
            
            self.initDom();
            self.initEvent();
            self.start(curr);
        },
        initDom: function (){
            if($IE6){
                var el = this.tabs;
                el.style.position = "absolute";
                var dotHeight = el.clientHeight;
                var dotWidth = el.offsetWidth;
                var top = this.getScrollTop();
                var left = document.documentElement.scrollLeft || document.body.scrollLeft;
                var cw = winSize.width;
                var ch = winSize.height;
                el.style.top = top + ch - dotHeight - 40 + "px";
                el.style.left = (cw - dotWidth)/2+"px";
            }
        },
        initEvent: function (){
            var self = this;

            var scrollFunc = function (e) {
                e = e || window.event;
                if (e.wheelDelta) {  //判断浏览器IE，谷歌滑轮事件             
                    if (e.wheelDelta > 0) { //当滑轮向上滚动时
                        self.start(self.getPage(null, -1));
                    }
                    if (e.wheelDelta < 0) { //当滑轮向下滚动时
                        self.start(self.getPage(null, 1));
                    }
                } else if (e.detail) {  //Firefox滑轮事件
                    if (e.detail> 0) { //当滑轮向下滚动时
                        self.start(self.getPage(null, 1));
                    }
                    if (e.detail< 0) { //当滑轮向上滚动时
                        self.start(self.getPage(null, -1));
                    }
                }
                stopDefaultEvent(e);
            };
            
            var lis = self.tabs.getElementsByTagName("li");
            for(var i = 0; i < lis.length; i++){
                addEvent(lis[i], (function (el){
                    return function (){
                        addClass(el, "am");
                    };
                })(lis[i]), "mouseover");
                addEvent(lis[i], (function (el){
                    return function (){
                        rmClass(el, "am");
                    };
                })(lis[i]), "mouseout");
                addEvent(lis[i], (function (n){
                    return function (){
                        var e = getEvent()
                        stopDefaultEvent(e);
                        self.start(ids[n]);
                    };
                })(i));
            }
            
            addEvent(document, function (){
                var e = getEvent();
                if(e.keyCode == 38 || e.keyCode == 40){
                    self.start(self.getPage(self.getScrollTop(), e.keyCode > 39 ? 1 : -1));
                }
            }, "keyup");

            if(document.addEventListener){
                document.addEventListener('DOMMouseScroll',scrollFunc,false);
            }
            window.onmousewheel = document.onmousewheel =scrollFunc;//IE/Opera/Chrome/Safari
        },
        showTab: function (el){
            var self = this;
            var index = Core.Array.findit(ids, el);
            var lis = self.tabs.getElementsByTagName("li");
            if(self.showTimer){
                clearTimeout(self.showTimer);
                self.showTimer = null;
            }
            if(index > -1 && index < lis.length){
                self.showTab.prev ? rmClass(self.showTab.prev, "am") :'';
                self.showTab.prev = lis[index];
                addClass(lis[index], "am");
            }
            self.showTimer = setTimeout(function (){
                rmClass(lis[index], "am");
            }, 1000);
        },
        getPage: function (top, type){
            var self = this;
            var index = 0;
            for(var i = 0; i < ids.length; i++){
                if(top != null){
                    var iTop = getTop(ids[i]);
                    if(top == iTop){
                        return ids[i];
                    }else if(top < iTop){
                        index = type > 0 ? i : i - 1;
                        return ids[index];
                    }
                }else if(self.current == ids[i]){
                    index = i + type > ids.length ? ids.length - 1 : (i + type < 0 ? 0 : i + type);
                    return ids[index];
                }
            }
            return ids[index];
        },
        start: function (el){
            var self = this;
            if(self.scrollStatus || el == self.current) return;
            var to = getTop(el);
            this.current = el;
            this.showTab(el);
            this._scroll(to);
        },
        _scroll: function (to){
            var self = this;
            if(self.timer){
                clearTimeout(self.timer);
                self.timer = null;
            }
            self.scrollStatus = 1;
            self.initDom();
            var currTop = self.getScrollTop();
            var sh = 0;
            var step = parseInt(Math.abs(to - currTop)/50);
            step = step < 10 ? 10 : step;
            if(currTop == self._scroll.prev || currTop == to){
                location.hash = self.current;
                clearTimeout(self.timer);
                self.scrollStatus = 0;
                self.timer = null;
                self.cTop = self.getScrollTop();
                return;
            }else if(currTop < to){
                sh = currTop + step;
                self.setScrollTop(sh > to ? to : sh);
            }else if(currTop > to){
                sh = currTop - step;
                self.setScrollTop(sh < to ? to : sh);
            }
            self._scroll.prev = currTop;
            self.timer = setTimeout(function (){
                self._scroll(to);
            },self.speed);
        },
        getScrollTop: function (){
            return document.body.scrollTop || document.documentElement.scrollTop || 0;
        },
        setScrollTop: function (top){
            document.body.scrollTop = top;
            document.documentElement.scrollTop = top;
        }
    };
    pageScroll.init();
});