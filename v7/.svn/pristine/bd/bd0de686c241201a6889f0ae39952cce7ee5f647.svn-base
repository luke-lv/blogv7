$import("sina/core/function/bind2.js");
$import("sina/core/class/create.js");
$import("sina/core/dom/setStyle2.js");
$import('sina/core/system/winSize.js');

$import("sina/utils/insertTemplate.js");
$import("sina/utils/cookie/getCookie.js");
$import("sina/utils/cookie/setCookie.js");
$import("sina/utils/flash/swfObject.js");

$import("sina/core/events/addEvent.js");
$import("sina/core/class/create.js");
$import("lib/sendLog.js");
$import("lib/sendSuda.js");
$import("lib/include.js");

/**
 * @fileoverview
 * 我买网广告
 * @create 2013-10-21
 * @author xiaoyue3 | Liu xiaoyue
 */

;
(function () {

    var $bind2 = Core.Function.bind2;
    var $addEvent = Core.Events.addEvent;
    var $winSize = Core.System.winSize;
    var $setStyle2 = Core.Dom.setStyle2;

    var $insertTemplate = Utils.insertTemplate;
    var $getCookie = Utils.Cookie.getCookie;
    var $setCookie = Utils.Cookie.setCookie;
    var $swfObject = Utils.Flash.swfObject;
    var $TweenStrategy = Ui.TweenStrategy;

    var TPL = {
        adCont: [
            '<div id="#{adCon}">', '<div id="#{adConBac}" style="z-index:1000; cursor:pointer;">',
            '<div id="#{swfcont}"></div>', '</div>', '</div>'
        ].join('')
    };

    var WoMaiAd = window.WoMaiAd = Core.Class.create();
    WoMaiAd.prototype = {
        option: {
            //广告swf的id
            swfId: 'swf-commercial-dyx-womai',
            //我买网广告swf地址
            swf: $_GLOBAL.flashBasicURL + "commercial_dyx_womai_20131230.swf",
            //广告swf的跳转地址
            redirectUrl: 'http://a1819.oadz.com/link/C/1819/2101829/2MlWkzKRNPE0vl-JLUc-swdoQ9E_/p027/0/http://www.womai.com/sale/2013/drl13121',
            //广告宽度 swf 原宽高 1264*125
            width: 990,
            //广告高度
            height: 100,
            css: {
                'z-index': '1020',
                'position': $IE6 ? 'absolute' : 'fixed',
                'bottom': '0',
                'left': '50%'
            }
        },
        initialize: function (dyxuid, dyxSort) {
            this.dyxuid = dyxuid;
            this.dyxSort = dyxSort;
            this.width = this.option.width;
            this.height = this.option.height;
            this.deploy();
        },
        deploy: function () {
            if (scope.$pageid === "article") {
                if (this.getTimeMark()) {
                    return;
                }
                this.build();
                this.addEvents();
                this.exposureTrack();
            } else {
                v7sendLog("33_01_11_" + this.dyxuid + "_" + window.location.href);
            }
        },
        //绑定事件
        addEvents: function () {
            $addEvent(window, $bind2(this.fixPos, this), 'resize');
            if ($IE6) {
                $addEvent(window, $bind2(this.fixPos, this), "scroll");
            }
        },
        build: function () {
            this.ad = $insertTemplate(document.body, TPL.adCont, 'BeforeEnd');
            this.fixPos();
            this.deploySwf();
        },
        //获取广告时间标记
        getTimeMark: function () {
            return $getCookie('dyxtime');
        },
        //在cookie中记录广告时间标记
        setTimeMark: function () {
            $setCookie('dyxtime', 1, 24, "/", "blog.sina.com.cn", false);
        },
        //部署flash文件
        deploySwf: function () {
            var ops = this.option;

            var swf = new $swfObject(//flash 的地址
                    ops.swf + '?' + [
                    ( ops.redirectUrl ? 'redirect_url=' + ops.redirectUrl : '' )
                ].join('&'), //写入到页面后的 object id。
                ops.swfId, //宽
                '100%', //高
                '100%', //flash 版本
                '9', //flash 背景色
                '#FFFFFF');
            swf.addParam('quality', 'high');
            swf.addParam('wmode', 'opaque');
            swf.addParam('allowScriptAccess', 'always');
            swf.addParam('allowNetworking', 'all');
            //写入容器的 id。
            swf.write(this.ad.swfcont.getAttribute('id'));
        },
        //flash会对外呼叫的事件
        dyxSwfTrigger: function (str) {
            if (str === 'stage') {
                this.onRedirect();
            } else if (str === 'close') {
                this.onCloseAd();
            }
        },
        getTrackInfo: function () {
            return [
                //缔元信用户ID
                this.dyxuid, //博客访问用户uid
                (window.$UID || ''), //博文id
                (scope.$articleid || '')
            ].join('_');
        },
        //曝光
        exposureTrack: function () {
            v7sendLog('33_01_15_' + this.getTrackInfo());
            Lib.sendSuda(function () {
                SUDA.uaTrack("blog_womaithree", "v_womaitr");
            });
        },
        //点击
        onRedirect: function () {
            v7sendLog('33_01_16_' + this.getTrackInfo());
            Lib.sendSuda(function () {
                SUDA.uaTrack("blog_womaithree", "h_womaitr");
            });
        },
        //关闭
        onCloseAd: function () {
            this.setTimeMark();
            v7sendLog('33_01_17_' + this.getTrackInfo());
            Lib.sendSuda(function () {
                SUDA.uaTrack('blog_womaithree', 'h_womaitr_close');
            });
            this.ad.adCon.style.display = 'none';
        },
        //修正组件样式
        fixPos: function () {
            var ops = this.option;
            var adConBac = this.ad.adConBac;
            var swfcont = this.ad.swfcont;
            var wSize = $winSize();
            if (adConBac) {
                if (wSize.width > 1264) {
                    this.width = 1264;
                    this.height = 125;
                } else {
                    this.width = 990;
                    this.height = 100;
                }
            }
            adConBac.style.width = this.width + 'px';
            adConBac.style.height = this.height + 'px';
            swfcont.style.width = this.width + 'px';
            swfcont.style.height = this.height + 'px';
            this.setPos(this.ad.adCon);
        },
        //设置缓动元素的样式
        setPos: function (node) {
            if (!node) {
                return;
            }
            var ops = this.option;
            var w = this.width, h = this.height;
            node.style.marginLeft = w / 2 * (-1) + 'px';
            if ($IE6) {
                node.style.bottom = document.documentElement.scrollTop + parseInt(Math.abs((document.documentElement.offsetHeight - h) / 2), 10);
            } else {
                node.style.marginTop = -h + 'px';
            }
            $setStyle2(node, ops.css);
        }
    };
})();





