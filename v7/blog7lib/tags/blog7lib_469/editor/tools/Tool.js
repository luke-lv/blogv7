/**
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 * @fileoverview 博客菜单类
 */
$import("lib/editor/tools/tools.js");
$import("sina/core/class/create.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/function/bind2.js");
$import("lib/editor/utils/ShutOut.js");
$import("sina/core/events/getEventTarget.js");

Editor.Tools.Tool = Core.Class.create();

Editor.Tools.Tool.prototype = {
	id:null,
    operate: null,
    container: null,
	shutOut:null,
    config: {},
    initialize: function(container, config){
		this.id=Core.Math.getUniqueId();
        this.container = $E(container);
        this.config = config;
		this.shutOut=new Editor.Utils.ShutOut();
    },
	/**
	 * 设置工具栏按钮执行的操作的类
	 * @param {Object} operate Operate对象
	 */
    setOperate: function(operate){
        this.operate = operate;
    },
	setShutOutProperty:function(contaienr){
		this.shutOut.setProperty(contaienr||this.container.parentNode);
	},
	/**
	 * 初始化工具栏元素
	 */
    initElements: function(){
        this.temp = new Ui.Template(this.config.classTemplate);
        var operates = this.config.tools;
        this.buildNods(operates, this.container);
    },
	/**
	 * 创建工具栏中节点，次函数为递归函数
	 * @param {Object} obj 创建节点所依赖的config对象
	 * @param {Object} container 父节点
	 */
	buildNods: function(obj, container){
        for (var name in obj) {
            if (/group_/.test(name)) {
                var b = $C("div");
                b.className = obj[name].cls;
                this.buildNods(obj[name].items, b);
                container.appendChild(b);
            }
            else {
                var b1 = this.createButton(this.temp.evaluate({
                    operate: name,
                    num: 1
                }), this.operate[name] || function(){});
				b1.id=name+"_"+this.id;
                b1.title = obj[name].title;
                if (obj[name].style) {
                    b1.style.cssText = obj[name].style;
                }
                if (obj[name].inner) {
                    b1.innerHTML = obj[name].inner;
                }
                container.appendChild(b1);
            }
        }
    },
	/**
	 * 创建工具栏元素
	 * @param {String} className 元素的className 
	 * @param {Function} handle  按钮元素的点击事件所调用的函数
	 */
    createButton: function(className, handle){
        var b = $C("div");
        b.className = className;
		b.unselectable="on";
        Core.Events.addEvent(b, handle.bind2(this.operate), "click");
        //鼠标效果
		Core.Events.addEvent(b, Core.Function.bind3(this.swapButtonState,this,["in"]), "mouseover");
		Core.Events.addEvent(b, Core.Function.bind3(this.swapButtonState,this,["out"]), "mouseout");
        return b;
    },
    /**
     * 通过更改className来切换按钮的鼠标移入和正常状态
     */
	swapButtonState:function(type){
		var ele=Core.Events.getEventTarget();
		if (ele._disabled) {
			return;
		}
		//trace(ele.id);
		var cn=ele.className;
		var cnArray=cn.split("_");
		var num=cnArray.pop();
		if(type=="in" && num=="1"){
			ele.className=cnArray.join("_")+"_2";
		}
		if (type=="out" && num=="2") {
			ele.className=cnArray.join("_")+"_1";
		}
		//trace("swapButtonState:"+ele.className);
	},
	/**
	 * 
	 * @param {Striing} item
	 * @param {Object} type
	 */
	setButtonState:function(item,type){
		var ele=$E(item+"_"+this.id);
		var cn=ele.className;
		var cnArray=cn.split("_");
		cnArray.pop();
		ele.className=cnArray.join("_")+"_"+type;
		ele._disabled=true;
	},
	/**
	 * 显示该工具栏
	 */
    show: function(){
        this.container.parentNode.style.display = "";
    },
	/**
	 * 隐藏该工具栏
	 */
    hidden: function(){
        this.container.parentNode.style.display = "none";
    }
};
