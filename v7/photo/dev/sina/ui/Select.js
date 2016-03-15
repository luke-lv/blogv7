/**
 *  @fileoverview   模拟select
 *  @author         gaolei2@
 *  @url            http://aralejs.org/select/examples/
 *  @import $import("sina/ui/Select.js");   // 理论上应该放到Sina.Ui文件夹下，等代码稳定后再般过去
 *  @example
 *  <div id="select_node"></div>
 *  var select = new Sina.Ui.Select($E('select_node'), {
                    'triggerTpl': '<span>#{text}</span><a href="javascript:void(0);" class="down"><i class="icon i18_down_arr"></i></a>',
                    'triggerClassName': 'menu',
                    'triggerText': '全部博文',
                    'optionTpl': '<li data-value="#{value}" data-defaultselected="#{defaultSelected}" data-selected="#{selected}" data-disabled="#{disabled}" data-text="#{text}">#{text}</li>',
                    'name': 'cate_select',
                    'model': [
                                {value: 'img', text: '图片'},
                                {value: 'txt', text: '文字'}
                            ];
                    });
    select.addEventListener('change', function(curNode, preNode){   // 可绑定事件有3个  change show hide
        console.log(curNode);   // 当前节点
        console.log(preNode);   // 上一次触发的节点
    });
 */

$import("sina/sina.js");

$import("sina/ui/template.js");

$import("sina/core/events/addEvent.js");
$import("sina/core/events/fixEvent.js");
$import("sina/core/events/removeEvent.js");
$import("sina/core/events/stopDefaultEvent.js");
$import("sina/core/events/eventDispatcher.js");

$import("sina/core/function/bind2.js");

$import("sina/core/dom/setStyle2.js");

(function (argument) {

    var Select = function (node, config) {
        
        // 需要渲染的select节点或者任意的dom节点（需要同时传递数据模型）
        this.node = typeof node === 'string' ? $E(node) : node;
        // 模拟select下拉列表节点
        this.list = '';
        // config示例
        // {
        //     triggerTpl: '<a href="">#{text}</a>',
        //     triggerClassName: '',
        //     triggerText: '',
        //     classPrefix: '',
        //     optionTpl: '<li data-value="#{value}" data-defaultselected="#{defaultSelected} data-selected="#{selected} data-disabled="#{disabled}">#{text}</li>',
        //     name: '',
        //     model: []
        // }  
        this.config = config;

        // 关于该select的属性值
        this.name = '';             
        this.value = '';
        this.length = '';
        this.selectedIndex = -1;
        this.disabled = false;
        this.originSelect = null;   // 原始的select

        // select数据模型
        this.model = [];

        // 常用方法

        this.addEvent = Core.Events.addEvent;
        this.removeEvent = Core.Events.removeEvent;
        this.fixEvent = Core.Events.fixEvent;
        this.rmvEvent = Core.Events.removeEvent;
        this.stopDefault = Core.Events.stopDefaultEvent;
        this.eventDispatcher = new Core.Events.EventDispatcher(this);
        this.setCss = Core.Dom.setStyle2;
        // this.getCss = Core.Dom

        this.init();
    };

    Select.prototype = {

        construct: Select,

        init: function(){

            if (this.node.tagName.toLowerCase() === 'select'){// 传递的是select节点

                this.name = node.getAttribute('name') || '';

                this.originSelect = this.node;

                var node = $C('div');
                if (this.config.triggerTpl){
                    var template = new Ui.Template(this.config.triggerTpl);
                    var result = template.evaluate({'text': this.config.triggerText});
                    node.innerHTML = result; 
                }

                this.node = node.children[0];
                this.originSelect.parentNode.appendChild(this.node);

                this.setCss(this.originSelect, {
                    position: 'absolute',
                    left: '-9999px',
                    zIndex: '-1111'
                });

                this.model = convertSelectToModel(this.originSelect);    

            }else{// 传递的是其他的dom节点

                if (!this.config.name || !this.config.model){
                    throw new Error('need name & model');
                }
                this.model = this.config.model;
                this.name = this.config.name;

                var input = $C('input');
                input.setAttribute('name', this.name);
                this.setCss(input, {
                    position: 'absolute',
                    left: '-9999px',
                    zIndex: '-1111'
                });
                this.node.parentNode.appendChild(input);
                
                if (this.config.triggerTpl){
                    var template = new Ui.Template(this.config.triggerTpl);
                    var result = template.evaluate({'text': this.config.triggerText});
                    this.node.innerHTML = result;
                }

                this.originSelect = input;

                this.model = completeModel(this.model);

            }

            for (var i=0; i<this.model.length; i++){
                if (this.model[i].selected == true){
                    this.originSelect.value = this.model[i].value;
                }
            }

            this.length = this.model.length;

            this.render(this.model);

            this.__bindEvent();

        },

        render: function(model){
            this.model = model;
            if(this.list){
              this.list.parentNode.removeChild(this.list);
            }
            this.list = this.__createSelectList();
            var val = this.getValue();
            this.setValue(val, false);
        },

        __createSelectList: function(){

            var li = $C('li');

            var ul = $C('ul');
            ul.className = this.config.triggerClassName || 'menu';
            ul.style.display = 'none';

            var template = new Ui.Template(this.config.optionTpl);
            var result = template.evaluateMulti(this.model);
            ul.innerHTML = result;

            li.appendChild(ul);

            this.node.parentNode.appendChild(li); //ie6 ul不能直接嵌套ul，需要外层加个li

            return ul;
        },

        __bindEvent: function(){

            this.addEvent(this.node, this.__onNodeClick.bind2(this));
            this.addEvent(this.list.parentNode, this.__delegateListClick.bind2(this));

            this.addEvent(document.body, this.__onBodyClick.bind2(this));
        },

        __onNodeClick: function(e) {
            var e = this.fixEvent(e);
            var tar = e.target;

            this.stopDefault(e);

            if (isContained(tar, this.node)){
                // console.log('contained:'+this.__isListShown())
                if (this.__isListShown()){
                    this.__hideList();
                }else{
                    this.__showList();
                }
            }
        },

        __onBodyClick: function(e){
            var e = this.fixEvent(e);
            var tar = e.target;

            if (!isContained(tar, this.node)){
                this.__hideList();
            }
        },

        addEventListener:function(type,handle){
            this.eventDispatcher.addEventListener(type,handle);
            return this;
        },

        removeEventListener:function(type,handle){
            this.eventDispatcher.removeEventListener(type,handle);
            return this;
        },

        __delegateListClick: function(e){

            e = this.fixEvent(e);
            var tar = e.target;

            if(isContained(tar,this.list)){

              if (tar.tagName.toLowerCase() == 'li'){
                  this.select(tar);
                  setTimeout(this.__hideList.bind2(this), 50);
                  return;
              }
              if (tar.tagName.toLowerCase() == 'span'){
                  this.select(tar.parentNode);
                  setTimeout(this.__hideList.bind2(this), 50);
                  return;
              }
            }
        },

        select: function(tar, index){
            var curNode, oldNode;

            var selectedIndex = getOpitonIndex((index||tar), this.list);
            var oldSelectedIndex = this.selectedIndex;
            
            this.selectedIndex = selectedIndex;

            if (oldSelectedIndex >= 0){
                this.model[oldSelectedIndex].selected = false;
                oldNode = this.list.children[oldSelectedIndex];
            }

            if (selectedIndex >= 0){
                this.model[selectedIndex].selected = true;
                curNode = this.list.children[selectedIndex];
            }

            if (oldSelectedIndex !== selectedIndex){
                this.eventDispatcher.dispatchEvent('change', curNode, oldNode);
            }
            this.__syncSelect(tar);
            // this.__syncModel();

        },

        __syncSelect: function(node){

            var li = getParent(node, this.list, 'li');

            var text = li.getAttribute('data-text'),
                value = li.getAttribute('data-value');
            this.originSelect.value = value;

            this.__setNodeText(text);
        },

        __setNodeText: function(text){
            var span;
            if (this.node && (span=this.node.children)){
                span[0].innerHTML = text;
            }
        },

        __syncModel: function(target){


        },

        getValue: function() {
            return this.originSelect.value;
        },

        setValue: function(value, isTriggerChange) {
            var i=0, children=this.list.children, len=children.length, node, v;
            if (typeof value != undefined){
                for (; i<len; i++){
                    node = children[i];
                    v = node.getAttribute('data-value');
                    if (v == value){
                        // this.select(node, i);
                        if (isTriggerChange){
                            this.select(node, i);
                        }else{
                            this.__syncSelect(node);
                        }
                        return value;
                    }
                }
            }
            return value;
        },

        getList: function(){
            return this.list;
        },

        __setPosition: function(){

        },

        __isListShown: function(){
            return (this.list.style.display !== 'none');
        },

        __showList: function(){
            this.list.style.display = '';
            this.eventDispatcher.dispatchEvent('show', this.list);
        },

        __hideList: function(){
            this.list.style.display = 'none';
            this.eventDispatcher.dispatchEvent('hide', this.list);
        }

    }

    function getOpitonIndex (option, options) {
        if (typeof option == 'number'){
            return option;
        }else{
            var i=0, children=options.children, len=children.length;
            for (; i<len; i++){
                if (isContained(option, children[i])){
                    return i;
                }
            }
        }
    }

    Select.convertSelectToModel = function convertSelectToModel(selectNode){
        var i, model = [], options = selectNode.options,
            l = options.length, hasDefaultSelect = false;
        for (i = 0; i < l; i++) {
            var j, o = {}, option = options[i];
            var fields = ['text', 'value', 'defaultSelected', 'selected', 'disabled'];
            for (j in fields) {
                var field = fields[j];
                o[field] = option[field];
            }
            if (option.selected) hasDefaultSelect = true;
            model.push(o);
        }
        // 当所有都没有设置 selected，默认设置第一个
        if (!hasDefaultSelect && model.length) {
            model[0].selected = 'true';
        }
        return model;
    }

    function completeModel(model) {
        var i, j, l, ll, newModel = [], selectIndexArray = [];
        for (i = 0, l = model.length; i < l; i++) {
            // var o = $.extend({}, model[i]);
            var o = {};
            for (var x in model[i]){
                o[x] = model[i][x];
            }
            if (o.selected) selectIndexArray.push(i);
            o.selected = o.defaultSelected = !!o.selected;
            o.disabled = !!o.disabled;
            newModel.push(o);
        }
        if (selectIndexArray.length > 0) {
            // 如果有多个 selected 则选中最后一个
            selectIndexArray.pop();
            for (j = 0, ll = selectIndexArray.length; j < ll; j++) {
                newModel[selectIndexArray[j]].selected = false;
            }
        } else { //当所有都没有设置 selected 则默认设置第一个
            newModel[0].selected = true;
        }
        return newModel;
    }

    /**
     * @targetNode    被比较的节点
     * @pNode      父容器节点
     * 如果比较的两个节点一样，也算是包含，返回true
     */
    function isContained(targetNode, pNode){
        var node = targetNode;

        if (node == pNode){
            return true;
        }

        if (pNode.compareDocumentPosition) {
            return (pNode.compareDocumentPosition(node) === 20);
        }

        while(node && node != document.body){
            if (node === pNode){
                return true;
            }
            node = node.parentNode;
        }

        return false;
    }

    function getParent (node, parent, tag) {
        if (node.tagName.toLowerCase() == tag){
            return node;
        }
        while ((node = node.parentNode) && node != parent){
            if (node.tagName.toLowerCase() == tag){
                return node;
            }
        }
        return null;
    }

    Sina.Ui.Select = Select;

})();
