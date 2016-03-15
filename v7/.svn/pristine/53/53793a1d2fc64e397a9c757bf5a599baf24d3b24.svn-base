/**
 * @name SinaEditor.ui.Button
 * @class 按钮类
 * @param opts 按钮配置
 * @param opts.id 按钮的id
 * @param opts.name 按钮的名称
 * @param opts.html 按钮的html
 * @param opts.icon 按钮className
 * @param opts.activeCls 激活按钮的样式
 * @param opts.disableCls 按钮不可用的样式
 * @param opts.position 按钮的position
 * @param opts.pos 按钮的位置
 * @constructor
 */
SinaEditor.regist('ui.Button', function (SE) {
    var DOMUtil = SE.DOMUtil, Event = SE.Event, Util = SE.Util, HTMLTemplate = SE.ui.HTMLTemplate;

    function Button(opts) {
        var self = this;

        opts = self.opts = Util.extend({
            id: '',
            name: '',
            html: '',
            icon: '',
            activeCls: 'active',
            disableCls: 'disable',
            position: 'relative',
            entityName: 'entity',
            tooltip: ''
        }, opts);
        var domUtil = self.domUtil = opts.domUtil || new DOMUtil();
        self.node = null;
        self.name = opts.name;
        self.id = opts.id || opts.name;
        self.html = opts.html;
        // 按钮绑定的函数
        self.__bindFunc = [];

        self.event = new Event();

        if (self.id) {
            self.node = domUtil.$('#' + self.id)[0];
        }
        if (self.node) {
            self.node.title = opts.tooltip;
        }
    };

    Button.prototype = {

        constructor: Button,
        /**
         * @property {Boolean} 按钮是否为激活状态
         */
        actived: !1,
        /**
         * @property {Boolean} 按钮是否不可用
         */
        disabled: !1,
        /**
         * @property {Boolean} 按钮是否被销毁
         */
        destroyed: !1,
        /**
         * @property {HTMLElment} 按钮的DOMNode
         */
        node: null,

        /**
         * 获取按钮的DOMNode
         * @param [string] name
         * @returns {HTMLElement} node 按钮的DOMNode(name == '' || name == undefined) , name != '' 获取html模板定义的按钮
         */
        getNode: function (name) {
            var self = this;
            if (self.destroyed) {
                throw new Error('按钮已被销毁');
            }
            if (!self.node) {
                self.node = self.createNode(self.html)
            }
            return name ? (this.tmpl ? this.tmpl.getNode(name) : null) : (this.node);
        },
        /**
         * 根据html创建节点
         * @param html
         * @returns {HTMLElement}
         */
        createNode: function (html) {

            var self = this, domUtil = self.domUtil, node, frag;
            if (html) {
                self.tmpl = new HTMLTemplate(html);
                frag = domUtil.createElementByHTML(self.tmpl.getHtmlString());
            } else {
                throw new Error('html 未定义');
            }
            self.id = self.tmpl.getNodeId(self.opts.entityName);
            if (!domUtil.hasClass(self.icon)) {
                domUtil.addClass(self.icon);
            }
            if (self.tooltip) {
                node.title = self.tooltip;
            }
            return this.node = node;
        },
        /**
         * 监听按钮事件
         * @param name
         * @param func
         */
        on: function (name, func) {
            this.event.on(this, name, func);
        },
        /**
         * 销毁按钮事件
         * @param name
         * @param func
         */
        off: function (name, func) {
            this.event.off(this, name, func);
        },

        /**
         * 触发按钮事件
         * @param name
         * @param data
         */
        fire: function (name, data) {
            var args = Util.toArray(arguments);
            args.unshift(this);
            this.event.fire.apply(this.event, args);
        },
        /**
         * 销毁按钮
         */
        destroy: function () {
            var self = this, domUtil = self.domUtil;
            domUtil.each(self.__bindFunc, function (i, item) {
                self.off(item.name, item.func);
            });
            domUtil.remove(self.node);
            self.destroyed = !0;
            self.node = null;
        },

        /**
         * 设置按钮位置
         */
        setPos: function (x, y) {

        },
        /**
         * 激活按钮
         */
        active: function () {
            var self = this;
            self.domUtil.addClass(self.node, self.opts.activeCls);
            self.actived = !0;
            self.disabled = !1;
        },
        /**
         * 删除激活状态
         */
        normal: function () {
            var self = this;
            self.domUtil.delClass(self.node, self.opts.activeCls);
            self.actived = !1;
            self.disabled = !1;
        },
        /**
         * 将按钮置为不可用状态
         */
        disable: function () {
            var self = this;
            self.domUtil.delClass(self.node, self.opts.activeCls);
            self.domUtil.addClass(self.node, self.opts.disableCls);
            self.actived = !1;
            self.disabled = !0;
        }
    };
    return Button;
});

