/*
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 * @fileoverview slide 类
 * @author stan | chaoliang@sina.staff.com.cn
 * @version 1.0 | 2009-08-23
 */
$import("sina/core/class/create.js");
$import("sina/core/dom/opacity.js");
$import("sina/core/dom/wrap.js");

$import("sina/ui/ui.js");
$import("sina/ui/tween.js");


Ui.Slide = Core.Class.create();

Ui.Slide.prototype = {
    //内容
    node: null,
    //容器
    container: null,
    status: "show",//hide
    offset: 0,
    onSlideIn: new Function(),
    onSlideOut: new Function(),
    /**
     * 初始化函数
     * @param {Object} node	节点
     * @param {Object} options 参数
     * - useParentNode 是否使用父级容器进行动画
     * - offset 指定偏移量
     * - opacity 是否改变透明度
     * - animation 动画类型
     * - duration 周期
     */
    initialize: function(node, options){
        var options = options || {};
        this.node = $E(node);
        this.container = Core.Dom.wrap(this.node, "div");
        //必须设定的属性
        this.container.style.overflow = "hidden";
        this.offset = this.node.offsetHeight;
        this.opacity = true;//options.opacity || false;
        this.animation = options.animation || "strongEaseOut";
        this.duration = options.duration || 1;
		//init height&marginTop
		this.container.style.height = this.offset + "px";
		this.node.style.marginTop = "0px";
    },
	//添加回调参数
    slideIn: function(opt){
		opt = opt || {};
        if (this.opacity) {
            new Ui.tween(this.node, "opacity", 1, this.duration, this.animation, {});
        }
        new Ui.tween(this.container, "height", this.offset, this.duration, this.animation, opt);
        new Ui.tween(this.node, "marginTop", 0, this.duration, this.animation, {
            tween: function(x){
                //trace(this.node.style.marginTop);
            }
.bind2(this)            ,
            end: this.onSlideIn
        });
    },
	//添加回调参数
    slideOut: function(opt){
		opt = opt || {};
        if (this.opacity) {
            new Ui.tween(this.node, "opacity", 0, this.duration, this.animation, {});
        }
        new Ui.tween(this.container, "height", 0, this.duration, this.animation, opt);
        new Ui.tween(this.node, "marginTop", -this.offset, this.duration, this.animation, {
            end: this.onSlideOut
        });
    },
    show: function(){
        if (this.opacity) {
            //Core.Dom.opacity(this.node, 100);
        }
        this.container.style.height = this.offset + "px";
        this.node.style.marginTop = 0 + "px";
    },
    hide: function(){
        if (this.opacity) {
            //Core.Dom.opacity(this.node, 0);
        }
        this.container.style.height = 0 + "px";
        this.node.style.marginTop = -this.offset + "px";
    }
};
