$import("sina/core/events/stopDefaultEvent.js");
$import("sina/ui/tween/transition.js");
$import("sina/ui/dialog/backShadow.js");
$import("sina/ui/tween/tweenStrategy.js");
$import("sina/utils/io/jsload.js");
$import("sina/core/dom/getElementsByClass.js");
$import("sina/core/system/parseParam.js");
$import("sina/core/system/winSize.js");
$import("sina/core/events/removeEvent.js");
$import("sina/core/array/isArray.js");
$import("sina/core/array/foreach.js");
$import("lib/checkAuthor.js");
$import("sina/ui/dialog/windowDialog.js");
$import("lib/login/ui.js");
$import("lib/sendLog.js");
/**
 * @fileoverview 博客7周年页面处理
 * @author guanghui@staff
 * @update wangqiang1@staff
 * @create 2012-08-20
 */
$registJob('blog7th', function() {

    var loginUI =  new Lib.Login.Ui();
    var __byClz = Core.Dom.getElementsByClass;

    //搬来的，让他支持FF鼠标滚轮
    var __addEvent = function(elm, func, evType, useCapture) {
        var _el = typeof elm == 'string' ? $E(elm) : elm;
        if(_el == null) {
            trace("addEvent 找不到对象：" + elm);
            return;
        }
        if (typeof useCapture == 'undefined') {
            useCapture = false;
        }
        if (typeof evType == 'undefined') {
            evType = 'click';
        }
        if (_el.addEventListener) {
            //添加鼠标滚动事件支持
            if(evType == 'mousewheel' && $FF) {
                evType = 'DOMMouseScroll';
            }
            _el.addEventListener(evType, func, useCapture);
            return true;
        } else if (_el.attachEvent) {
            var r = _el.attachEvent('on' + evType, func);
            return true;
        } else {
            _el['on' + evType] = func;
        }
    };
    //搬来的，让他支持鼠标悬停

    hoverJq = function(conf) {

        var _default = {
            'elm': document.body,
            'mouseenter': function() {
            },
            'mouseleave': function() {
            },
            'delay': 0
        }

        conf = Core.System.parseParam(_default, conf);

        var enterType = $IE ? 'mouseenter' : 'mouseover',
        leaveType = $IE ? 'mouseleave' : 'mouseout';

        if (!Core.Array.isArray(conf.elm)) { //如果不是 array, 组装成 arrray
            conf.elm = [conf.elm];
        }

        Core.Array.foreach(conf.elm, function(one) {
            //鼠标移入
            Core.Events.removeEvent(one, enterType);
            //鼠标移出
            Core.Events.removeEvent(one, leaveType);

            //鼠标移入
            Core.Events.addEvent(one, (function(el, func) {
                return function(event) {
                    if ($IE) {
                        func.apply(el, [event, el]);
                    } else {
                        withinElement(event, 'mouseenter', el);
                    }
                }
            })(one, conf[enterType]), enterType);
            //鼠标移出
            Core.Events.addEvent(one, (function(el, func) {
                return function(event) {
                    if ($IE) {
                        func.apply(el, [event, el]);
                    } else {
                        withinElement(event, 'mouseleave', el);
                    }
                }
            })(one, conf[leaveType]), leaveType);
        });
        // 下面这个函数用于检测事件是否发生在另一个元素的内部
        var withinElement = function(event, mouseType, elm) {
            // 检测 mouse(over|out) 是否还在相同的父元素内
            var parent = event.relatedTarget;

            // Firefox 有时候会把 relatedTarget 指定一个 XUL 元素
            // 对于这种元素，无法访问其 parentNode 属性
            try {

                // Chrome 也类似，虽然可以访问 parentNode 属性
                // 但结果却是 null
                if ( parent && parent !== document && !parent.parentNode ) {
                    return;
                }

                // 沿 DOM 树向上
                while ( parent && parent !== elm ) {
                    parent = parent.parentNode;
                }

                if ( parent !== elm ) {
                    // 如果实际正好位于一个非子元素上面，那好，就处理事件
                    conf[mouseType].apply(elm, [event, elm]);
                }

                // 假定已经离开了元素，因为很可能鼠标放在了一个XUL元素上
            } catch(e) {
            }

            return false;
        };
    };
    //滚动条缓动对象
    var tween =new Ui.TweenStrategy(0,0,0.8,Ui.Transition.regularEaseOut);
    tween.onTween= function(e) {
        scrollTo(0,e);
        //document.body.scrollTop = e;
    }
    //每次滚轮滚动时的距离
    var GAP = 200;
    //几种不同速率
    var FAST = 1.2;
    var SLOW = 0.2;
    var NORMAL = 0.6;
    //需要控制的一些元素DOM
    var bgstar1 = __byClz(document,"div","bgstar1")[0];
    var bgstar2 = __byClz(document,"div","bgstar2")[0];
    var bgcloud1 = __byClz(document,"div","bgcloud1")[0];
    var bgcloud2 = __byClz(document,"div","bgcloud2")[0];

    var actBanner1 = __byClz(document,"div","actBanner1")[0];
    var actBanner2 = __byClz(document,"div","actBanner2")[0];

    //__byClz(document,"div","stairPop")[0].style.display = 'none';
    //__byClz(document,"div","emPop")[0].style.display = 'none';
    //领取徽章按钮
    var getMedal = $E("getMedal");
    //领取徽章按钮2
    var getMedal2 = $E("getMedal2");
    //徽章本体
    var medalObj = $E("medalObj");
    //徽章说明的黄色按钮
    var medalDes = $E("medalDes");
    //徽章说明的浮层
    var stairPop = __byClz(document,"div","stairPop")[0];
    //撑起徽章说明的梯子
    var stairObj = __byClz(document,"div","stair")[0];
    //左侧浮动的导航
    var sideNav = __byClz(document,"div","sideNav")[0];
    //领取徽章后弹出浮层。领取成功
    var emPop = __byClz(document,"div","emPop")[0];
    //领取徽章后弹出浮层。已经领取状态
    var emPop2 = __byClz(document,"div","emPop")[1];
    //返回顶部的火箭
    var actGotop = __byClz(document,"div","actGotop")[0];
    //博客历史的数字
    var historyMap = document.getElementsByTagName("map")[0];
    //博客历史的主题图片
    var historyPic = $E("historyPic");
    //未登录时出现的登录按钮(历史记录)
    var loginBtn = $E("myLog").getElementsByTagName("a")[0];

    //遮罩
    var onlyshadow = new BackShadow();
    Lib.checkAuthor();
    var userLoginDiv = $E("userLoginDiv");
    var userLogin = $E("userLogin");
    if(userLoginDiv) {
        if($isLogin) {
            var html =   '你好，<a target="_blank" href="http://blog.sina.com.cn/u/'+$UID+'" class="nikename">'+$nick.substring(0,6)+'</a><a href="http://login.sina.com.cn/cgi/login/logout.php">退出</a>';
            userLoginDiv.innerHTML = html;
        };
        if(userLogin) {
            userLogin.onclick = function() {
                if (!scope.$isLogin) {
                    new Lib.Login.Ui().login( function() {
                        location.reload();
                    });
                    return;
                }
            }
        }
    };
    var actBanner = __byClz(document,"div","actBanner")[0];
    if(actBanner) {
        if(actBanner.children[0]) {

            //popBoom
            actBanner.children[0].onclick = function() {
                v7sendLog("50_01_08");
            }
        };
        //蛋糕
        if(actBanner.children[1]) {
            actBanner.children[1].onclick = function() {
                v7sendLog("50_01_09");
            }
        }
    };
    //历程模块登录
    if(loginBtn) {
        loginBtn.onclick = function() {
            if (!scope.$isLogin) {
                new Lib.Login.Ui().login( function() {
                    location.reload();
                });
                return;
            }
        }
    }

    //博客历史
    if(historyMap && historyPic) {

        var length = historyMap.children.length;
        var timer;
        var currentI = 0;

        function startLoop() {
            if(timer)
                clearInterval(timer);
            timer = setInterval( function() {
                if(currentI == length -2) {
                    currentI = 0;
                } else {
                    currentI++;
                }

                historyPic.className = "year"+historyMap.children[currentI].getAttribute("alt");
            },2000);
        }

        function tempFunction() {
            var scrollTop = document.body.scrollTop ||  document.documentElement.scrollTop;
            if(scrollTop >1700) {
                startLoop();
                Core.Events.removeEvent(window,tempFunction ,'scroll');
            }
        }

        tempFunction();
        __addEvent(window,tempFunction ,'scroll');

        for(var i = 0 ; i < length-1;i++) {
            historyMap.children[i].onclick = (function(i) {
                return function() {
                    historyPic.className = "year"+historyMap.children[i].getAttribute("alt");
                    currentI = i;

                    startLoop();
                }
            })(i);
        };
        historyMap.onfocus = function() {
            this.blur();
        };
        //IE不支持MAP的MOUSEENTER事件。
        if($IE) {
            historyMap.onmouseover = function() {
                if(timer)
                    clearInterval(timer);
            };
            historyMap.onmouseout = function() {
                startLoop();
            };
        }
        var innerArray = [];
        for (var i = 0; i < historyMap.children.length; i++) {
            innerArray.push(historyMap.children[i]);
        };

        hoverJq({
            elm : innerArray,
            mouseenter : function(evt) {

                if(timer)
                    clearInterval(timer);
            },
            mouseleave : function(evt) {
                startLoop();
            },
            delay : 10
        });
    }

    //++++++++++++++++++++++++++++++++++++++++分享按钮们++++++++++++++++++++++++++++++++++++++++++++++++++++++
    var _p_share_title ="新浪博客七周年活动-领取徽章，分享成长_新浪博客";
    var _p_share_pic = "http://www.sinaimg.cn/blog/qing/image/yimei/440-400.jpg";
    var _p_share_url = "http://control.blog.sina.com.cn/blog_7years/index.php";
    var _p_share_text = "#新浪博客七周年#七是一个神奇的数字，一周有七天，彩虹有七种颜色，音乐有七个音阶…伴着你的成长，新浪博客今年也七周岁了。特别推出七周年领取徽章活动：分享博客成长，即可领取博客七周年徽章。:http://control.blog.sina.com.cn/blog_7years/index.php";
    var _p_share_textWeibo = "#新浪博客七周年#七是一个神奇的数字，一周有七天，彩虹有七种颜色，音乐有七个音阶…伴着你的成长，新浪博客今年也七周岁了。特别推出七周年领取徽章活动：分享博客成长，即可领取博客七周年徽章。";

    
    if ($E('share_db')) {
        $E('share_db').href = "javascript:void((function(){var%20u='http://shuo.douban.com/!service/share?image=&href=" + encodeURIComponent(_p_share_url) + "&name=" + encodeURIComponent(_p_share_title) +"';window.open(u,'douban','toolbar=0,resizable=1,scrollbars=yes,status=1,width=450,height=330');return%200;})());";
    }
    if ($E('share_kx')) {
        $E('share_kx').href = "javascript:void(kaixin=window.open('http://www.kaixin001.com/~repaste/share.php?&rurl="+escape(_p_share_url)+"&rtitle="+escape(_p_share_title)+"&rcontent="+escape(_p_share_text)+"','kaixin'));kaixin.focus();";
    }
    // 根据不同的杂志社显示不同的文案
    var x = "javascript:void((function(s,d,e,r,l,p,t,z,c){var%20f='http://v.t.sina.com.cn/share/share.php?appkey=2264489285&ralateUid=2264489285"
    +(scope.$ralateUid?"&ralateUid="+scope.$ralateUid:"")+"',u=z||d.location,p=['&url=',e(u),'&title=',e(t||d.title),'&content=',c||'gb2312','&pic=',e(p||'')].join('');function%20a(){if(!window.open([f,p].join(''),'mb',['toolbar=0,status=0,resizable=1,width=440,height=430,left=',(s.width-440)/2,',top=',(s.height-430)/2].join('')))u.href=[f,p].join('');};if(/Firefox/.test(navigator.userAgent))setTimeout(a,0);else%20a();scope.weiboLog();})(screen,document,encodeURIComponent,'','','"+_p_share_pic+"','"+_p_share_textWeibo+"','"+_p_share_url+"','utf-8'));";
    //x = encodeURIComponent(x);
    if ($E('share_weibo')) {
        $E('share_weibo').href = x;

    }
    scope.weiboLog = function() {
        v7sendLog("50_01_07");
    }
    if ($E('share_rr')) {
        $E('share_rr').href = "javascript:void(function(){var renren=window.open('http://share.renren.com/share/buttonshare.do?link="+encodeURIComponent(_p_share_url)+"&title="+encodeURIComponent(_p_share_title)+"&content="+encodeURIComponent(_p_share_text)+"');}())";
    }
    //++++++++++++++++++++++++++++++++++++++++分享按钮们++++++++++++++++++++++++++++++++++++++++++++++++++++++

    //底部火箭
    if(actGotop) {
        var orgTop = 3100;
        var tweenWindow = new Ui.TweenStrategy(0,0,3,Ui.Transition.regularEaseOut);
        tweenWindow.onTween = function(e) {

            scrollTo(0,e);
        }
        var tweenRocket = new Ui.TweenStrategy(0,-200,3,Ui.Transition.regularEaseOut);
        var twCount = 0;
        tweenRocket.onTween = function(e) {

            actGotop.style.top = e + "px";

        };
        tweenRocket.onEnd = function() {
            actGotop.style.top = orgTop + "px";
            actGotop.style.position = "absolute";
            twCount = 0;
        }
        actGotop.children[0].style.border = "0px";

        //原来的是ABSOLUTE ，点击后变成FIXED
        actGotop.onclick = function() {

            scrollTop = document.body.scrollTop ||  document.documentElement.scrollTop;
            if(tweenRocket._isTweenning)
                return;
            if($IE6) {
                tweenRocket.startValue = orgTop;
                tweenRocket.start();

            } else {
                var fixedPos = orgTop - scrollTop;
                actGotop.style.position = "fixed";
                actGotop.style.top  = fixedPos+"px";
                tweenRocket.startValue = fixedPos;
                tweenRocket.start();
            }
            tweenWindow.startValue = scrollTop;
            tweenWindow.start();

        }
    }
    //导航相应的逻辑
    if(sideNav) {
        var setup = false,
            $winSize = Core.System.winSize;
        var winHeight = $winSize().height;
        sideNav.style.top = (winHeight-60)+"px";
        sideNav.style.zIndex = 200;

        var fixedNavPos = function(){

            var scrollTop = document.body.scrollTop +  document.documentElement.scrollTop;
            var currentHeight = $winSize().height;

            if (currentHeight < 600){
                !$IE6 && (sideNav.style.position = "absolute");
                sideNav.style.top = (currentHeight-60)+"px";
                setup = false;
                return;
            }
            
            
            var limitHeigth = currentHeight/2 + 240;


            if(scrollTop > limitHeigth && ($IE6 || !setup)) {

                if (!$IE6){
                    sideNav.style.position = "fixed";
                    var top = (currentHeight - 600)/2;
                    sideNav.style.top = (top > 0 ? top : 0) + "px";
                } else {
                    setTimeout(function(){
                        var cTop = document.documentElement.scrollTop;
                        if (scrollTop == cTop){
                            sideNav.style.position = "absolute";
                            var top = (currentHeight - 600)/2;
                            top = (top > 0 ? top : 0);
                            sideNav.style.top = (scrollTop + top) + "px";
                        }
                    }, 50);
                    
                }
                setup = true;
            } else if(scrollTop < limitHeigth && setup) {
                sideNav.style.position = "absolute";
                sideNav.style.top = (currentHeight-60)+"px";
                setup = false;
            }
        }

        __addEvent(window, fixedNavPos, 'scroll');
        __addEvent(window, fixedNavPos, 'resize');

    }
    //获取勋章，盒子的事件；
    if(getMedal && medalObj && emPop && emPop2 && getMedal2) {
        window.onerror =null;
        emPop.style.zIndex = "9999";
        emPop2.style.zIndex = "9999";
        //已分享的付出剧中临时修改
        var pEle = emPop2.getElementsByTagName("p")[2];
        pEle.style.paddingLeft ="0px";
        pEle.style.textAlign = "center";
        function showPop(obj) {
            obj.style.display = "";
            onlyshadow.show();
            document.body.style.overflow = "hidden";
            var win = Core.System.winSize();
            var _x=win.width / 2 - obj.offsetWidth / 2;
            var _y=win.height / 2 - obj.offsetHeight / 2;
            if($IE6) {
                obj.style.position = "absolute";
                var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
                var scrollLeft = document.body.scrollLeft || document.documentElement.scrollLeft;
                _x=_x + scrollLeft;
                _y=_y + scrollTop;
                obj.style.left = _x + "px";
                obj.style.top = _y + "px";
            } else {
                obj.style.position = "fixed";
                obj.style.left = _x + "px";
                obj.style.top = _y + "px";

            }
        }

        function hidePop(obj) {
            obj.style.display = "none";
            onlyshadow.hidden();
            document.body.style.overflow = "";
        }

        function attenThis() {

            if(!$E("attenUser").checked || !scope.$isLogin)
                return;
            Utils.Io.JsLoad.request("http://control.blog.sina.com.cn/riaapi/reg/attention_add_batch.php", {
                onComplete: function(result) {
                    var img = new Image();
                    img.src = "http://control.blog.sina.com.cn/blog_7years/attenWeibo.php?rnd="
                        + Math.random();
                    img.onload = img.onerror = function(){
                        window["___imgbatch"] = null;
                        img = null;
                    }
                    window["___imgbatch"] = img;
                },
                GET: {
                    uid:$UID ||0,
                    aids: "2264489285,1951657750,1259295385",
                    n:Math.random()
                }

            });
        };

        medalObj.style.top = "-5px";
        var tweenMedal = new Ui.TweenStrategy(0,0,0.5,Ui.Transition.regularEaseOut);
        tweenMedal.onTween = function(e) {
            medalObj.style.top = e + "px";
        }
        var closeButton1 = __byClz(emPop,"a","close")[0];
        var closeButton2 = __byClz(emPop2,"a","btn")[0];
        var closeButton3 = __byClz(emPop2,"a","close")[0];
        var goBlogButton = __byClz(emPop,"a","btn")[0]
        if(closeButton1) {

            closeButton1.onclick = function(e) {
                Core.Events.stopDefaultEvent(e);
                attenThis();
                hidePop(emPop);
            }
        }
        if(closeButton2) {
            closeButton2.onclick = function() {
                hidePop(emPop2);
            }
        }
        if(closeButton3) {
            closeButton3.onclick = function() {
                hidePop(emPop2);
            }
        }
        if(goBlogButton) {
            goBlogButton.onclick = function(e) {
                //Core.Events.stopDefaultEvent(e);
                setTimeout(attenThis,1000);
                hidePop(emPop);
            }
        }
        var upPos = -90;
        var downPos = -15;

        function callback(e) {
            Core.Events.stopDefaultEvent(e);
            if (!scope.$isLogin) {
                new Lib.Login.Ui().login( function() {
                    location.reload();
                });
                return;
            }
            v7sendLog("50_01_06");
            Utils.Io.JsLoad.request("http://control.blog.sina.com.cn/blog_7years/blogMedal.php", {
                onComplete: function(result) {

                    if(result.code == "A00006") {

                        if(emPop.style.display == "none") {

                            showPop(emPop);
                            goBlogButton.setAttribute("href","http://blog.sina.com.cn/s/blog_"+result.data.message+".html")
                            goBlogButton.setAttribute("target","_blank");
                        }
                    } else if(result.code == "A00001") {
                        var sucdlg = winDialog.alert(result.data.message, {
                            funcOk: function() {
                            },
                            textOk: "确定",
                            title: "提示",
                            icon: "01" // 可选值："01"、"02"、"03"、"04"、"05"
                        });

                    } else if(result.code == "A00008") {
                        showPop(emPop2);
                    }

                },
                GET: {
                    n:Math.random()
                }

            });
        }

        getMedal2.onclick = callback;
        getMedal.onclick = callback;

        hoverJq({
            elm : [getMedal,getMedal2],
            mouseenter : function(evt) {
                tweenMedal.stop();
                tweenMedal.startValue = parseInt(medalObj.style.top);
                tweenMedal.endValue = upPos;
                tweenMedal.start();
            },
            mouseleave : function(evt) {
                tweenMedal.stop();
                tweenMedal.startValue = parseInt(medalObj.style.top);
                tweenMedal.endValue = downPos;
                tweenMedal.start();
            },
            delay : 10
        });
    };
    //梯子，说明里头的逻辑
    //
    if(stairPop && stairObj) {
        var closeTimer;
        var tweenStair = new Ui.TweenStrategy(0,0,0.5,Ui.Transition.regularEaseOut);
        var upValue = 600;
        var downValue = 969;

        tweenStair.onTween = function(e) {

            stairObj.style.height = e + "px";
        }
        hoverJq({
            elm : [stairPop],
            mouseenter : function(evt) {
                if(closeTimer) {
                    clearTimeout(closeTimer);
                };
                if(stairPop.style.display =="none") {
                    stairPop.style.display = "";

                    tweenStair.startValue = parseInt(stairObj.style.height);
                    //console.log(tweenStair.startValue)
                    tweenStair.endValue = downValue;
                    tweenStair.start();
                };

            },
            mouseleave : function(evt) {
                closeTimer = setTimeout( function() {
                    if(stairPop.style.display =="") {
                        stairPop.style.display = "none";
                        tweenStair.startValue = parseInt(stairObj.style.height);
                        tweenStair.endValue = upValue;
                        tweenStair.start();
                    }
                },200);
            },
            delay : 10
        });
        hoverJq({
            elm : [medalDes],
            mouseenter : function(evt) {
                if(closeTimer) {
                    clearTimeout(closeTimer);
                };
                if(stairPop.style.display =="none") {
                    stairPop.style.display = "";
                    tweenStair.startValue = parseInt(stairObj.style.height);
                    tweenStair.endValue = downValue;
                    tweenStair.start();
                }
            },
            mouseleave : function(evt) {
                closeTimer = setTimeout( function() {
                    if(stairPop.style.display =="") {
                        stairPop.style.display = "none";
                        tweenStair.startValue = parseInt(stairObj.style.height);
                        tweenStair.endValue = upValue;
                        tweenStair.start();
                    }
                },200);
            },
            delay : 10
        });
    }
    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    __addEvent(window, function() {
        changePosition();
    },'scroll');
    changePosition();
    //图层的浮动
    function changePosition() {
        var scrollTop = document.body.scrollTop ||  document.documentElement.scrollTop;
        bgstar1.style.backgroundPosition  = '0px -'+(Math.round(scrollTop*NORMAL))+'px';
        bgstar2.style.backgroundPosition  = '0px -'+(Math.round(scrollTop*FAST))+'px';
        bgcloud1.style.backgroundPosition  = '0px -'+(Math.round(scrollTop))+'px';
        bgcloud2.style.backgroundPosition  = '0px -'+(Math.round(scrollTop*SLOW))+'px';
        actBanner1.style.left = -(scrollTop-1860)*NORMAL+'px';
        actBanner2.style.left = (scrollTop-1950)+'px';
    }

    //监听鼠标滚轮事件
    __addEvent($E('eemm'), function(e) {
        if(onlyshadow.isShow)
            return;
        tween.stop();
        var scrollTop = document.body.scrollTop ||  document.documentElement.scrollTop;
        var evt = e || window.event;
        var delta=evt.detail? evt.detail * -1: evt.wheelDelta;
        if(evt.preventDefault) {
            evt.preventDefault();
        } else {
            evt.returnValue=false;
        };
        tween.startValue = scrollTop;
        if(delta < 0) {
            tween.endValue = scrollTop+GAP;
            //往下
        } else {
            //往上滚
            tween.endValue = scrollTop-GAP;
        }
        tween.start();
    },'mousewheel');
    if(!$IE6) {
        var allATag = document.getElementsByTagName("a");
        for(var i = 0; i<allATag.length;i++) {
            allATag[i].onfocus = function() {
                this.blur();
            }
        }
    }
});