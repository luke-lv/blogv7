/**
 * @name SinaEditor.ui.GroupButton;
 * @class
 * 按钮组类
 * @example
 * <pre>
 *     ... ...
 * var groupOpts = {
 *     name: 'imgAlign',
 *     icon: 'btn',
 *     activeCls: 'actived',
 *     disableCls: 'disabled',
 *     html: '&lt;div id="#{entity}"&gt;&lt;div id="#{content}"&gt;&lt;/div&gt;&lt;/div&gt;'
 *     buttons: [{
 *         name: 'alignLeft',
 *         tooltip: '居左',
 *         html: '&lt;button id="#{entity}" class="left" value="left"&gt;&lt;/button&gt;'
 *     }, {
 *         name: 'alignCenter',
 *	       tooltip: '居中',
 *         html: '&lt;button id="#{entity}" class="center" value="left"&gt;&lt;/button&gt;'
 *     }, {
 *         name: 'alignRight',
 *         tooltip: '居右',
 *         html: '&lt;button id="#{entity}" class="right" value="left"&gt;&lt;/button&gt;'
 *     }]
 * }
 * // 初始化GroupButton
 * var groupBtn = new GroupButton(groupOpts);
 * // 添加到toolbar中
 * toolbar.addGroupButton(groupBtn);
 *     ... ...
 * </pre>
 * @param opts 按钮配置
 * @param opts.id 按钮的id
 * @param opts.name 按钮的名称
 * @param opts.html 按钮的html，如果只有一个节点则entity == content，格式为：
 *      <pre>&lt;div id="#{entity}"&gt;&lt;div id="#{content}"&gt;&lt;/div&gt;&lt;/div&gt; </pre>
 * @param opts.icon 按钮className
 * @param opts.activeCls 激活按钮的样式
 * @param opts.disableCls 按钮不可用的样式
 * @param opts.position 按钮的position
 * @param opts.pos 按钮的位置
 */
SinaEditor.regist('ui.GroupButton', function (SE) {
    var DOMUtil = SE.DOMUtil, Button = SE.ui.Button, Event = SE.Event, Util = SE.Util, HTMLTemplate = SE.ui.HTMLTemplate;

    function GroupButton(opts) {
        var self = this;

        opts = self.opts = Util.extend({
            name: '',
            icon: '',
            activeCls: 'active',
            disableCls: 'disable',
            tooltip: '',
            entityName: 'entity',
            contentName: 'content',
            buttons: []
        }, opts);
        var domUtil = self.domUtil = opts.domUtil || new DOMUtil();
        self.node = null;
        self.name = opts.name;
        self.id = opts.id;
        self.html = opts.html; // <div id="#{entity}"><div id="#{content}"></div></div>
        self.exec = opts.exec || opts.name;
        // 按钮绑定的函数
        self.__bindFunc = [];

        self.event = new Event();

        if (self.id) {
            self.node = domUtil.$('#' + self.id)[0];
        }

        var buttons = self.buttons = [];

        domUtil.each(opts.buttons, function (i, btnCfg) {
            var button = new Button(Util.merge(btnCfg, {
                icon: opts.icon,
                activeCls: opts.activeCls,
                disableCls: opts.disableCls
            }, false, true));
            buttons.push(button);
        });
    };

    GroupButton.prototype = {

        constructor: GroupButton,
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
        destoried: !1,
        /**
         * @property {HTMLElment} 按钮的DOMNode
         */
        node: null,
        /**
         * 根据html创建节点
         * @param html
         * @returns {DocumentFragment}
         */
        createNode: function (html) {
            var self = this, domUtil = self.domUtil, opts = self.opts, entity;
            if (html) {
                self.tmpl = new HTMLTemplate(html);
                domUtil.createElementByHTML(self.tmpl.getHtmlString());
                entity = self.tmpl.getNode(opts.entityName);
                self.id = entity;
            }
            return entity;
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
         * 销毁所有按钮
         */
        destroy: function () {
            var self = this, domUtil = self.domUtil;
            domUtil.each(self.buttons, function (i, btn) {
                btn.destroy();
            });
            self.buttons = null;
        },
        /**
         * 获取按钮组的HTMLElment节点
         * @returns {HTMLElemnt}
         */
        getNode: function () {
            var self = this;
            if (self.destoried) {
                throw new Error('按钮组已被销毁');
            }

            return (self.node || (self.node = self.createNode(self.html)));
        },
        /**
         * 设置按钮位置
         */
        setPos: function (x, y) {

        },
        /**
         * 激活按钮
         * @param {string} name 按钮名称
         */
        active: function (name) {
            var self = this;
            self.domUtil.each(self.buttons, function (p, btn) {
                if (name == btn.name) {
                    btn.active();
                } else {
                    btn.normal()
                }
            });
        },
        /**
         * 删除激活状态
         * @param [string] name 按钮名称，如果不传则全部取消
         */
        normal: function (name) {
            var self = this;
            if (!name) {
                self.domUtil.buttons[name].normal();

            } else {
                self.domUtil.each(self.buttons, function (p, btn) {
                    btn.normal();
                });
            }
        },
        /**
         * 将按钮置为不可用状态
         * @param [string] name 按钮名称，如果不传则全部置为不可用
         */
        disable: function (name) {
            var self = this;
            if (!name) {
                self.domUtil.buttons[name].disable();
            } else {
                self.domUtil.each(self.buttons, function (p, btn) {
                    btn.disable();
                });
            }
        }
    };
    return GroupButton;
});