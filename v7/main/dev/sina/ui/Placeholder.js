/**
 *  @fileoverview   模拟placeholder html5 渐进增强组件
 *  @author         gaolei2@
 *  @url            http://aralejs.org/select/examples/
 *  @import         $import("sina/ui/Placeholder.js");
 *  @example
 *  可以用JS直接设置文字
 *  <input id="input_id" type="text"/>
    STK.kit.dom.placeholder(STK.E('input_id')).set('占位文字', {opacity : 1, color : '#eee'});
    //也可以读取元素的属性
    <input id="input_auto" type="text" placeholder="占位文字"/>
    STK.kit.dom.placeholder(STK.E('input_auto')).set();
 *  @other
    如果想要chrome浏览器显示效果与IE一致，使用下面这个样式：
    input:focus::-webkit-input-placeholder { color: transparent; }
    如果想要FF浏览器显示效果与IE和老版本FF浏览器一致，使用下面这个样式：
    input:focus::-moz-placeholder {color: transparent;}
 */

$import("sina/sina.js");

$import("sina/core/events/addEvent.js");
$import("sina/core/events/fixEvent.js");
$import("sina/core/events/removeEvent.js");
$import("sina/core/events/stopDefaultEvent.js");

$import("sina/core/function/bind2.js");

$import("sina/core/dom/getStyle.js");
$import("sina/core/dom/setStyle2.js");

(function () {
    
    var Placeholder = function (node, config) {
        this.node = node;
        this.textColor = config.color || '#ccc';
        this.text = config.text || node.getAttribute('placeholder') || '';
        this.phTag = config.phTag || 'span';
        this.useHTML5 = config.useHTML5 || false;   // 默认不使用html方法
        this.checkCanShowFn = config.checkCanShowFn;

        this.__addEvent = Core.Events.addEvent;
        this.__removeEvent = Core.Events.removeEvent;
        this.__getStyle = Core.Dom.getStyle;
        this.__setStyles = Core.Dom.setStyle2;

        this.init();
    }

    Placeholder.prototype = {

        construct: Placeholder,

        init: function(){
            if (this.supportPlaceholder() && this.useHTML5){
                this.node.setAttribute('placeholder', this.text);
            }else{
                this.buildPlaceholder();
                this.check();
            }
        },

        buildPlaceholder: function(){
            if (!this.label){
                this.label = $C(this.phTag);
                this.hide();
                this.node.parentNode.insertBefore(this.label, this.node);
                this.bindEvents();
            }

            this.label.innerHTML = this.text;
            var styles = this.getStyles();

            var offset = this.computeOffset();
            styles.marginLeft = offset.x + 'px';
            styles.marginTop = offset.y + 'px';
            styles.zIndex = -1;

            this.__setStyles(this.label, styles);
            
        },

        bindEvents: function(){
            this.__addEvent(this.node, this.checkInput.bind2(this), 'input');
            this.__addEvent(this.node, this.checkInput.bind2(this), 'propertychange');
            this.__addEvent(this.node, this.check.bind2(this), 'blur');
            this.__addEvent(this.node, this.hide.bind2(this), 'mousedown');
            this.__addEvent(this.label, this.focus.bind2(this), 'mousedown');    
            this.__addEvent(this.node, this.hide.bind2(this), 'focus');
        },

        checkInput: function(){
            if (!this.checkCanShow()){
                this.hide();
            }
        },

        check: function(){
            if (this.checkCanShow()){
                this.show();
            }else{
                this.hide();
            }
        },

        checkCanShow: function(){
            if (typeof this.checkCanShowFn !== 'function'){// 没有checkCanShowFn，调用默认
                // 没有value，可以显示label
                return (this.node && !this.node.value);
            }else{
                return this.checkCanShowFn();
            }
        },

        focus: function(){
            var that = this;
            this.hide();
            setTimeout(function(){
                that.node.focus();
            });
        },

        show: function(){
            if (this.label && this.checkCanShow()){
                this.label.style.display = '';
            }
        },

        hide: function(){
            if (this.label){
                this.label.style.display = 'none';
            }
        },

        getStyles: function(){
            var styles = {};

            styles['fontSize'] = this.__getStyle(this.node, 'fontSize');
            styles['lineHeight'] = this.__getStyle(this.node, 'lineHeight');
            styles['position'] = 'absolute';
            styles['color'] = this.textColor;

            return styles;
        },

        supportPlaceholder: function(){
            var tempInput = $C('input');
            //ie10下的ie7模式 无法用getAttribute('placeholder')取到placeholder值
            return 'placeholder' in tempInput;
        },

        computeOffset: function(){
            var pos = {};
            var attrs = ['marginTop','paddingTop','borderTopWidth','marginLeft','paddingLeft','borderLeftWidth'];

            for (var i=0; i<attrs.length; i++){
                var prop = attrs[i];
                pos[prop] = this.__getStyle(this.node, prop);
                if (pos[prop] == 'auto'){
                    pos[prop] = '1px';
                }
                pos[prop] = parseInt(pos[prop], 10) || 0;
            }

            pos.x = pos.marginLeft + pos.paddingLeft + pos.borderLeftWidth;
            pos.y = pos.marginTop + pos.paddingTop + pos.borderTopWidth + ($IE6 ? 1 : 0);

            return pos;
        },

        destory: function(){
            this.__removeEvent(this.node, this.hide.bind2(this), 'focus');
            this.__removeEvent(this.label, this.focus.bind2(this), 'mousedown');
            this.__removeEvent(this.node, this.check.bind2(this), 'blur');
            if(this.label && this.label.parentNode){
                this.label.parentNode.removeChild(this.label);
            }
            this.label = null;
        }
    }

    Sina.Ui.Placeholder = Placeholder;
})();
