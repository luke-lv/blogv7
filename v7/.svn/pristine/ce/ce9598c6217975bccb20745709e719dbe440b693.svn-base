$import("sina/core/function/bind2.js");
$import("sina/core/dom/byClass.js");
$import("sina/ui/tween/tweenStrategy.js");

$import("lib/component/class/registComp.js");
$import("lib/apply.js");
$import("lib/util/hoverJq.js");
/**
 * @fileoverview 夹页Qing组件
 * @author Qiangyee | wangqiang1@staff
 */
$registComp(910, {
    defaultCfg: {
        // 轮播初始位置
        slideIndex: 0,
        // 是否为图片轮播，主要设置轮播的透明属性
        isSlideImg: true,
        // 鼠标移出轮播定位按钮
        hoverOutClass: '',
        // hover元素鼠标hover上去时默认样式
        hoverClass: 'cur'
    },
    otherCfg: { //其他配置如hoverOutClass和hoverClass等
    },
    // 获取最外层组件id
    // @override 每个不同的组件必须覆盖此方法
    getContentEl: function () {
        return $E('module_910');
    },
    // 获取缓动元素
    getSlideEls: function (contentEl, $byClz) {
        var tmpEls, sildeEls = [];

        var tmpEls = $byClz('photo_tabfocus_main', 'div', contentEl);

        for (var i = 0, len = tmpEls.length; i < len; i++) {
            sildeEls.push(tmpEls[i]);
        }

        return sildeEls;
    },
    // 获取缓动主体
    getSlideBody: function (contentEl, $byClz) {

        return $byClz('photo_tabfocus', 'div', contentEl)[0];
    },
    // 获取hover元素
    getHoverEls: function (contentEl, $byClz) {
        var tmpEls, hoverEls = [];

        var tmpEl = $byClz('tab_scroll', 'div', contentEl)[0];

        tmpEls = $T(tmpEl, 'li');
        for (i = 0, len = tmpEls.length; i < len; i++) {
            hoverEls.push(tmpEls[i]);
        }

        return hoverEls;
    },
    /**
     * 组件初始化，设置幻灯片的参数
     */
    load: function () {

        var contentEl = this.getContentEl();
        var $byClz = Core.Dom.byClass;

        this.isSlideImg = true;

        cfg = this.otherCfg || {};

        var sildeEls = this.getSlideEls(contentEl, $byClz);
        var slideBody = this.getSlideBody(contentEl, $byClz);
        var hoverEls = this.getHoverEls(contentEl, $byClz);

        var _cfg = {
            // 需要轮播的元素
            slideEls: sildeEls,
            // 幻灯片主体
            slideBody: slideBody,
            // 鼠标移动上去停止轮播
            hoverEls: hoverEls
        }
        this.init(_cfg);
    },
    // 组件初始化开始
    init: function (cfg) {

        Lib.apply(this, cfg, this.defaultCfg);

        this.length = this.slideEls.length;

        this.initEvent();

        this.startSlide();
    },
    // 初始化组件事件，包括hover节点和内容节点
    initEvent: function () {
        var $each = Core.Array.foreach, __addEvent = Core.Events.addEvent, me = this;
        if (this.hoverEls) {
            Lib.util.hoverJq({
                elm: this.hoverEls,
                mouseenter: function (e, el, i) {
                    me.stopSlide();
                    var currentIndex = me.slideIndex;
                    if (i !== currentIndex) {
                        me.tween && me.tween.stop();
                        me._hideSlide(currentIndex);
                    }
                    me.showSlide(i);
                },
                mouseleave: function (e, el, i) {
                    clearTimeout(me.timer);
                    me.timer = 0;
                    me.startSlide();
                }
            });
        }

        Lib.util.hoverJq({
            elm: this.slideEls,
            mouseenter: function (e, el, i) {
                me.stopSlide();
            },
            mouseleave: function (e, el, i) {
                clearTimeout(me.timer);
                me.timer = 0;
                me.startSlide();
            }
        })

    },
    /**
     * 开始显示幻灯
     */
    startSlide: function () {
        if (this.timer === -1) {
            return;
        }
        var me = this, args = arguments;
        this.timer = setTimeout(function () {
            if (me.timer > 0) {
                me.showNextSlide(function () {
                    args.callee.call(me, args);
                });
            }

        }, 3000);
    },
    /**
     * 停止显示幻灯
     */
    stopSlide: function () {
        clearTimeout(this.timer);
        this.timer = -1;
    },
    /**
     * 显示下一篇幻灯内容
     * @param {HTMLElement} cb 渐入效果结束后的回调函数
     */
    showNextSlide: function (cb) {
        var index = this.slideIndex;
        this._hideSlide(index);
        index++;

        if (this.length <= index) {
            index = 0;
        }
        this.showSlide(index, cb);
    },
    /**
     * 显示幻灯内容
     * @param {Number}      i  显示幻灯的序号
     * @param {HTMLElement} cb 渐入效果结束后的回调函数
     */
    showSlide: function (i, cb) {
        if (i == this.slideIndex) {
            cb && cb();
            return true;
        }
        var slideEl = this.slideEls[i], hoverEl = this.hoverEls[i], $setStyle = Core.Dom.setStyle, fadeEl;

        slideEl.style.display = '';
        if (this.isSlideImg) {
            fadeEl = $T(slideEl, 'img')[0];
        } else {
            fadeEl = slideEl;
        }
        if (hoverEl) {
            hoverEl.className = this.hoverClass;
        }
        $setStyle(fadeEl, 'opacity', 0.4);
        this.slideIndex = i;
        this.fadeIn(fadeEl, hoverEl, cb);
        return true;
    },
    /**
     * 幻灯渐入效果, 设置图片透明效果
     * @param {HTMLElement} fadeEl  幻灯内容需要显示加入效果的节点
     * @param {HTMLElement} hoverEl 控制显示幻灯的hover节点
     * @param {HTMLElement} cb      渐入效果结束后的回调函数
     */
    fadeIn: function (fadeEl, hoverEl, cb) {

        var tween = new Ui.TweenStrategy(0.4, 1, 0.5), $setStyle = Core.Dom.setStyle;
        tween.onTween = function (v) {
            $setStyle(fadeEl, 'opacity', v);
        };
        tween.onEnd = function (v) {
            cb && cb();
        };
        tween.start();
        this.tween = tween;
    },
    // 隐藏幻灯片内容显示
    // @param {Number} index 需要隐藏幻灯片的序号
    _hideSlide: function (index) {
        var preEl = this.slideEls[index], preHoverEl = this.hoverEls[index];
        preEl.style.display = 'none';
        if (preHoverEl) {
            preHoverEl.className = this.hoverOutClass;
        }
    }
});
