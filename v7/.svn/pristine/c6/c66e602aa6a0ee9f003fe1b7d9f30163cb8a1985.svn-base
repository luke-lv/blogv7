/**
 * @fileoverview 博文页右侧推荐浮层,出现位置：普通博文页，tj1，tj2页面
 * @create 2013-11-28
 * @author yifei2
 */

$import("lib/jobs.js");
$import("article/getSearchReferrer.js");
$import("lib/lazyload.js");
$import("sina/utils/cookie/getCookie.js");
$import("sina/utils/cookie/setCookie.js");
$import("sina/core/dom/getElementsByAttr.js");
$import("sina/core/dom/getStyle.js");
$import("sina/core/dom/setStyle.js");
$import("sina/core/array/isArray.js");


$registJob("rightAD", function() {

    // 搜索引擎过来的页面不出现浮层
    var searchData = scope.isFromSearchEngine || Article.getSearchReferrer();
    if (searchData) {
        return;
    }

    var adTpl = '<div id="rightADWrap" style="display:none;z-index:98;position:fixed;right:0;bottom:0;width:398px;height:160px;overflow:hidden;">' +
        '<div id="rightAD" class="blog-layer-see blog-layer-seeclose" style="position:absolute;right:0;bottom:15px;z-index:99;">' +
        '<div data-role="arrow" class="boxarrow">' +
        '<a class="arrow" href="javascript:void(0);"></a>' +
        '</div>' +
        '<div class="con">' +
        '<span data-role="close" class="close" title="关闭">×</span>' +
        '<h1 class="title">大家在看：</h1>' +
        '<div id="SLOT_98_dajiakan" class="pic"></div>' +
        '<ul class="txtul">' +
        '<li id="SLOT_99_dajiakan"></li>' +
        '<li id="SLOT_100_dajiakan"></li>' +
        '<li id="SLOT_101_dajiakan"></li>' +
        '<li id="SLOT_102_dajiakan"></li>' +
        '</ul>' +
        '</div>' +
        '</div>' +
        '</div>';

    // 在body插入广告模板结构
    Core.Dom.insertHTML('body', adTpl, 'BeforeEnd');

    var elLayer = $E('rightAD');
    var elWrap = $E('rightADWrap');
    var elClose = Core.Dom.getElementsByAttr(elLayer, 'data-role', 'close')[0];
    var elArrow = Core.Dom.getElementsByAttr(elLayer, 'data-role', 'arrow')[0];
    // 浮层全部宽度
    var allWidth = 380;
    // 浮层收起需要隐藏的宽度
    var hideWidth = 333;
    var _cookie = Utils.Cookie;
    var isClick = false;
    if ($IE6) {
        elWrap.style.position = "absolute";
    }
    var slotArr = ['SLOT_98_dajiakan', 'SLOT_99_dajiakan', 'SLOT_100_dajiakan', 'SLOT_101_dajiakan', 'SLOT_102_dajiakan'];
    var sourceArr = ['SLOT_58', 'SLOT_59', 'SLOT_98', 'SLOT_99', 'SLOT_100', 'SLOT_101', 'SLOT_102'];
    // var slotURL = 'http://interface.blog.sina.com.cn/riaapi/pageslot/pageslot.php';
    var slotURL = 'http://comet.blog.sina.com.cn/api?maintype=pageslot';
    
    if (elLayer) {
        allWidth = parseInt(Core.Dom.getStyle(elLayer, 'width'), 10) + 20;
        hideWidth = allWidth - 48;
        // 开始
        init();
    }


    /*** funciton ***/
    // 入口
    function init() {
        Core.Dom.setStyle(elLayer, 'right', '-' + allWidth + 'px');
        loadData(slotArr, sourceArr);
    }

    // 调用广告接口获取数据
    function loadData(slotArr, sourceArr) {

        //这是为了兼容lib/tray/blogNotice.js中的update方法。将两个js的请求统一以减少请求次数，
        //但同时又不能让两个js之间产生任何依赖关系，所以只能每个页面都写两套
        //
        if(!elLayer) {
            return;
        }
        var reqdata = {
            id: sourceArr
        };
        if (typeof scope != 'undefined') {
            reqdata.blogeruid = scope.$uid;
        }
        if ($UID) {
            reqdata.loginuid = $UID;
        }

        var complete = function(res) {
            //把相关博文的前两条换过来。
            var timer;
            sourceArr.splice(0, 2); //剃除SLOT_58和SLOT_59
            function fnForListenerSlot(res2) {
                if (res2 && res2.length >= 2) {
                    res2[0].words = res2[0].a_title;
                    res2[1].words = res2[1].a_title;
                    if (res[sourceArr[1]] && res2[0].a_title) {
                        res[sourceArr[1]].res = [res2[0]];
                    }
                    if (res[sourceArr[3]] && res2[1].a_title) {
                        res[sourceArr[3]].res = [res2[1]];
                    }
                }
                renderHTML(slotArr, sourceArr, res);
                window.clearTimeout(timer);
            }
            if (window.scope.___fnForListenerSlot) {
                fnForListenerSlot(window.scope.___fnForListenerSlot);
            } else {
                window.scope.___fnForListenerSlot = fnForListenerSlot;
            }

            timer = window.setTimeout(function() { //如果相关博文接口请求失败。或超时直接忽略。
                renderHTML(slotArr, sourceArr, res);
            }, 5000)
        }
        if (scope.__subscribeSlot === 'waitting') {
            scope.__subscribeSlotFunc = complete;
        } else if (typeof scope.__subscribeSlot === 'object') {
            complete(scope.__subscribeSlot);
        } else {
            scope.__subscribeSlot = 'waitting';
            Utils.Io.JsLoad.request(slotURL, {
                GET: reqdata,
                onComplete: function(res) {
                    complete(res);
                    scope.__subscribeSlot = res;
                    if('function' == typeof scope.__subscribeSlotFunc) {
                        scope.__subscribeSlotFunc(res); 
                    }
                },
                onException: function() {}
            });
        }


    }

    // 渲染广告
    function renderHTML(slotArr, sourceArr, data) {
        for (var i = 0; i < slotArr.length; i++) {
            var sourceData = data[sourceArr[i]];
            var slotNode = $E(slotArr[i]);

            if (slotNode && sourceData) {
                var type = sourceData.materialtype;
                var params = null;
                var html = '';
                var sendlog = '';
                if (Core.Array.isArray(sourceData.res)) {
                    params = {
                        a_c_suda: sourceData.res[0].a_c_suda || '',
                        a_h_suda_key: sourceData.res[0].a_h_suda_key || '',
                        a_h_suda_value: sourceData.res[0].a_h_suda_value || '',
                        a_v_suda_key: sourceData.res[0].a_v_suda_key || '',
                        a_v_suda_value: sourceData.res[0].a_v_suda_value || '',
                        a_href: sourceData.res[0].a_href || '',
                        a_title: sourceData.res[0].a_title || '',
                        imgurl: sourceData.res[0].imgurl || '',
                        words: sourceData.res[0].words || '',
                        author: sourceData.res[0].author || ''
                    };
                }

                // 图片
                if (type === 1 && params) {
                    sendlog = "v7sendLog('30_01_02')";
                    html = '<a ' + params.a_c_suda + ' onmousedown="' + sendlog + '" target="_blank" href="' + params.a_href + '">' + '<img titlelink="' + params.a_href + '" destxt="' + (params.words || '') + '" title="' + params.a_title + '" src="' + params.imgurl + '" />' + '</a>';
                    slotNode.innerHTML = html;
                }
                // 文字链
                if (type === 2 && params) {

                    switch (sourceArr[i]) {
                        case 'SLOT_99':
                            var soltType = sourceData.res ? sourceData.res[0].type : ''; //兼容从相关博文中取的数据发的pingback
                            if (soltType == 'relative_0') {
                                sendlog = "v7sendLog('30_01_03')";
                            } else if (soltType == 'relative_1') {
                                sendlog = "v7sendLog('30_01_07')";
                            } else if (soltType == 'topic') {
                                sendlog = "v7sendLog('30_01_09')";
                            } else {
                                sendlog = "v7sendLog('30_01_03')";
                            }
                            break;
                        case 'SLOT_100':
                            sendlog = "v7sendLog('30_01_04')";
                            break;
                        case 'SLOT_101':
                            var soltType = sourceData.res ? sourceData.res[0].type : ''; //兼容从相关博文中取的数据发的pingback
                            if (soltType == 'relative_0') {
                                sendlog = "v7sendLog('30_01_05')";
                            } else if (soltType == 'relative_1') {
                                sendlog = "v7sendLog('30_01_08')";
                            } else if (soltType == 'topic') {
                                sendlog = "v7sendLog('30_01_10')";
                            } else {
                                sendlog = "v7sendLog('30_01_05')";
                            }
                            break;
                        case 'SLOT_102':
                            sendlog = "v7sendLog('30_01_06')";
                            break;
                    }

                    html = '<span class="SG_dot"></span>' +
                        '<a onmousedown="' + sendlog + '" title="' + params.a_title + '" href="' + params.a_href + '" ' + params.a_c_suda + ' target="_blank">' + params.words + '</a>';
                    slotNode.innerHTML = html;
                }

                if (typeof SUDA != 'undefined' && params.a_v_suda_key && params.a_v_suda_value) {
                    SUDA.uaTrack(params.a_v_suda_key, params.a_v_suda_value);
                }
            }
        }
    }


    // 滚动检查
    function checkScroll() {
        if (isClick) {
            return;
        }

        var articleNode = $E('sina_keyword_ad_area2');
        var shareNode = Core.Dom.getElementsByClass($E('articlebody'), 'div', 'shareUp')[0];

        var pos = Core.System.getScrollPos();
        var win = Core.System.winSize();
        var articleTop = Core.Dom.getTop(articleNode);
        var shareTop = Core.Dom.getTop(shareNode);

        // 关闭cookie，关闭为true
        var closeCookie = _cookie.getCookie("dajiakan_layer_close");

        // 广告内容为空的时候，不出现浮层
        if (!$E('SLOT_98_dajiakan').innerHTML && !$E('SLOT_99_dajiakan').innerHTML && !$E('SLOT_100_dajiakan').innerHTML && !$E('SLOT_101_dajiakan').innerHTML && !$E('SLOT_102_dajiakan').innerHTML) {
            return;
        }

        // 判断滚动位置
        if (pos[0] + win.height >= shareTop) {
            // 滚动到底部show
            Core.Dom.setStyle(elWrap, 'display', '');

            // 关闭cookie
            if (closeCookie) {
                checkStyle(2);
            } else {
                if (parseInt(Core.Dom.getStyle(elLayer, 'right'), 10) !== 18) {
                    checkStyle(0);
                }
            }
        } else {
            checkStyle(1);
        }
    }


    // 样式检查
    // state, 0, 全显示
    // state, 1, 全缩进
    // state, 2, 半缩进
    function checkStyle(state) {
        var width = 0;
        switch (state) {
            case 0:
                Core.Dom.removeClass(elLayer, 'blog-layer-seeclose');
                width = -18;
                break;
            case 1:
                width = allWidth;
                break;
            case 2:
                width = hideWidth;
                break;
        }
        Ui.tween(elLayer, 'right', -width, 0.5, 'simple', {
            end: function() {
                if (state === 0) {
                    Core.Dom.removeClass(elLayer, 'blog-layer-seeclose');
                    // 全部展开曝光,suda和sendlog对比
                    if (typeof SUDA != 'undefined') {
                        SUDA.uaTrack('blog_slide_g', 'v_slide_g');
                    }
                    if (typeof v7sendLog != 'undefined') {
                        v7sendLog('30_01_01');
                    }
                }
                if (state === 1) {
                    Core.Dom.setStyle(elWrap, 'display', 'none');
                }
                if (state === 2) {
                    Core.Dom.addClass(elLayer, 'blog-layer-seeclose');
                }
            }
        });
    }
    // 关闭
    function clickClose() {
        isClick = true;
        Core.Dom.setStyle(elWrap, 'display', 'none');
        _cookie.setCookie("dajiakan_layer_close", true, 8, "/", ".blog.sina.com.cn");
    }
    // 箭头展开收缩
    function clickArrow() {
        var state = parseInt(Core.Dom.getStyle(elLayer, 'right'), 10);
        isClick = true;
        if (state === 18) {
            checkStyle(2);
        } else {
            checkStyle(0);
        }
    }
    /*** funciton ***/


    Core.Events.addEvent(window, checkScroll, "scroll");
    if (elClose) {
        Core.Events.addEvent(elClose, clickClose, "click");
    }
    if (elArrow) {
        Core.Events.addEvent(elArrow, clickArrow, "click");
    }

});
