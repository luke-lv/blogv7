$import("sina/core/class/create.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/function/bind2.js");
$import("sina/ui/tween/transition.js");
$import("component/tween/TweenStrategyEx.js");
/**
 * @fileoverview 图片幻灯滑动封装类
 * @author Qiangyee | wangqiang1@staff
 * @version 0.01 | 2012-02-17
 */
slideBox = Core.Class.create();
slideBox.prototype = {
    /**
     * 判断对象是否为null并抛出异常，主要为了检查是否传入了必要参数
     */
    assertNull: function (obj, msg) {
        if (null == obj) {
            throw Error(msg);
        }
    },
    /**
     * 初始化幻灯片滑动封装类的组件
     * @param {HTMLElement} boxBody 滑动外层
     * @param {HTMLElement} slideBody 滑动层
     * @param {HTMLElement} previousBtn 上一页按钮
     * @param {HTMLElement} nextBtn 下一页按钮
     * @param {Object}  cfg  动画滑块配置，参数查看defaultCfg
     */
    initialize: function (boxBody, slideBody, previousBtn, nextBtn, cfg) {
        this.assertNull(boxBody, "boxBody不能为null");
        this.assertNull(slideBody, "slideBody不能为null");
        this.assertNull(previousBtn, "previousBtn不能为null");
        this.assertNull(nextBtn, "nextBtn不能为null");
        this.boxBody = boxBody;
        this.slideBody = slideBody;
        this.previousBtn = previousBtn;
        this.nextBtn = nextBtn;
        this.isFirst = true;
        this.isLast = false;
        this.currentPage = 1;
        this.cfg = cfg;
        var __bind2 = Core.Function.bind2, //默认配置
            defaultCfg = {
                direction: "leftToRight", // 方向leftToRight, bottomToTop, topToBottom
                motion: Ui.Transition.simple, // 动画缓动公式
                duration: 0.5, // 缓动时间
                slideChildCount: 1, //一次缓动的子元素个数
                onTweenBegin: function () {
                },
                onTweenEnd: function () {
                } // 每次缓动后的回调函数
            };
        // 绑定上一页和下一页按钮
        Core.Events.addEvent(previousBtn, __bind2(function () {
            this.cfg.onTweenBegin("", this.currentPage, "previous");
            this.previousPage();
        }, this));
        Core.Events.addEvent(nextBtn, __bind2(function () {
            this.cfg.onTweenBegin("", this.currentPage, "next");
            this.nextPage();
        }, this));

        // 确认幻灯片的定位
        //boxBody.style.position = "relative";
        //slideBody.style.position = "absolute";
        var apply = function (thisObj, cfg) {
            var p;
            for (p in cfg) {
                thisObj[p] = cfg[p];
            }
            return thisObj;
        };

        this.cfg = apply(defaultCfg, cfg || {});

        this.startTweenStyle = parseInt(this._getSlideBeginValue() || 0);

        slideBody.style[this._getTweenStyle()] = this.startTweenStyle + "px";

    },
    /**
     * 获取移动块当前移动的距离(px)
     *
     */
    getCurrentSlideLength: function () {
        var currentSlideLength = 0, slideBodyStyle = this.slideBody.style;

        switch (this.cfg.direction) {
            case "leftToRight" :
                currentSlideLength = slideBodyStyle.left;
                break;
            case "bottomToTop" :
                currentSlideLength = slideBodyStyle.bottom;
                break;
            case "topToBottom" :
                currentSlideLength = slideBodyStyle.left;
                break;
        }
        return parseInt(currentSlideLength || 0);
    },

    /**
     * 是否还有下一页
     */
    hasNextPage: function () {
        return this.slideBody.children.length > this.currentPage * this.cfg.slideChildCount;
    },

    /**
     * 是否还有上一页
     */
    hasPreviousePage: function () {
        return this.currentPage > 1;
    },
    /**
     * 获取一次移动的距离
     */
    getSlideLegnth: function () {
        var slideLength = this.cfg.slideLength || 0;
        if (slideLength) {
            return slideLength;
        }
        var slideBody = this.slideBody, children = slideBody.children, childCounts = children.length;
        if (childCounts < 1) {
            return 0;
        }
        var el = children[0], computeStyle = computeStyle || (window.getComputedStyle ? window.getComputedStyle(el, '') : el.currentStyle);

        var rectLength = 0, marginRight, marginLeft, marginTop, marginBottom;

        switch (this.cfg.direction) {
            case "leftToRight" :
                var offsetWidth = el.offsetWidth;
                marginRight = this._getCurrentStyle(el, "margin-right", computeStyle) || 0;
                marginLeft = this._getCurrentStyle(el, "margin-left", computeStyle) || 0;
                rectLength = offsetWidth + parseInt(marginRight) + parseInt(marginLeft);
                break;
            case "bottomToTop" :
            case "topToBottom" :
                var offsetHeight = el.offsetHeight, collapsedHeight = 0;
                marginTop = parseInt(this._getCurrentStyle(el, "margin-top", computeStyle) || 0, 10);
                marginBottom = parseInt(this._getCurrentStyle(el, "margin-bottom", computeStyle) || 0, 10);
                // box model collapsed margin
                collapsedHeight = Math.max(marginTop, marginBottom);
                rectLength = offsetHeight + (childCounts - 1) * collapsedHeight + marginTop + marginBottom;
                break;
        }

        var totalLength = rectLength * this.cfg.slideChildCount
        this.cfg.slideLength = totalLength;

        return totalLength;
    },

    /**
     * 执行页面滑动到上一页
     */
    previousPage: function () {
        var isFirstPage = !this.hasPreviousePage();
        if (isFirstPage || this.onTweening) {
            isFirstPage && this.cfg.onTweenEnd("begin", this.currentPage, "previous");
            return;
        }
        var _boxBody = this.boxBody, _slideBody = this.slideBody, computeStyle = window.getComputedStyle ? window.getComputedStyle(_slideBody, '') : _slideBody.currentStyle, beginValue = this.getCurrentSlideLength(computeStyle), endValue, slideLength = this.getSlideLegnth();

        this.currentPage--;
        endValue = beginValue + slideLength;
        this._tween(beginValue, endValue);

    },

    /**
     * 执行页面滑动到下一页
     */
    nextPage: function () {
        var isLastPage = !this.hasNextPage();
        if (isLastPage || this.onTweening) {
            isLastPage && this.cfg.onTweenEnd("end", this.currentPage, "next");
            return;
        }
        var _boxBody = this.boxBody, _slideBody = this.slideBody, computeStyle = window.getComputedStyle ? window.getComputedStyle(_slideBody, '') : _slideBody.currentStyle, beginValue = this.getCurrentSlideLength(computeStyle), endValue, slideLength = this.getSlideLegnth();

        this.currentPage++;
        endValue = beginValue - slideLength;
        this._tween(beginValue, endValue);

    },

    // 获取元素当前样式
    _getCurrentStyle: function (el, property, computedStyle) {
        var style, computedStyle = computedStyle || (window.getComputedStyle ? window.getComputedStyle(el, '') : el.currentStyle);
        try {
            style = computedStyle.getPropertyValue(property);
        } catch (e) {
            property = property.replace(/^(-)/, "").replace(/-(\S)/g, function (a, b) {
                    return b.toUpperCase();
                });
            style = computedStyle[property];
        }
        return style;
    },

    // 获取缓动框缓动样式的初始值
    _getSlideBeginValue: function (computeStyle) {

        var el = this.slideBody, beginValue = 0;
        switch (this.cfg.direction) {
            case "leftToRight" :
                beginValue = this._getCurrentStyle(el, "left", computeStyle) || 0;
                break;
            case "bottomToTop" :
                beginValue = this._getCurrentStyle(el, "top", computeStyle) || 0;
                break;
            case "topToBottom" :
                beginValue = this._getCurrentStyle(el, "bottom", computeStyle) || 0;
                break;
        }
        return parseInt(beginValue);
    },

    // 获取缓动元素的样式
    _getTweenStyle: function () {
        switch (this.cfg.direction) {
            case "leftToRight" :
                return "left";
            case "bottomToTop" :
                return "bottom";
            case "topToBottom" :
                return "top";
        }
        return "left";
    },

    // 缓动函数
    _tween: function (start, end) {
        var style = this.slideBody.style, tweenStyle = this._getTweenStyle();
        tween = new TweenStrategyEx([start], [end], this.cfg.duration, this.cfg.motion);

        this.onTweening = true;
        tween.onTween = function (v) {
            style[tweenStyle] = parseInt(v[0], 10) + "px";
        }

        var _this = this;
        tween.onEnd = function () {
            var isEnd = !_this.hasNextPage(), isBegin = !_this.hasPreviousePage(), status = "";
            if (isEnd) {
                _this.isLast = true;
                _this.isFirst = false;
                status = "end";
            } else if (isBegin) {
                _this.isFirst = true;
                _this.isLast = false;
                status = "begin";
                ;
            } else {
                _this.isFirst = false;
                _this.isLast = false;
            }

            _this.onTweening = false;
            _this.cfg.onTweenEnd(status, _this.currentPage);

        };
        tween.start();
    }
};
