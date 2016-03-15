/**
 * @class
 * 编辑器Toolbar类
 * @param {Object} opts toolbar的配置
 * @param {String} opts.id toolbar最外层节点的id
 * @param {String} opts.name toolbar的名称
 * @param {String|HTMLElemnt} opts.renderTo String类型时传入selector, toolbar渲染到该节点上
 * @param {String} opts.tpl toolbar的里层html
 * @param {String} opts.cls toolbar的className
 * @param {Object} opts.style toolbar的样式
 * @param {String} opts.buttons toolbar的按钮
 * @param {Editor} editor toolbar所属的编辑器
 * @author gaolei2@staff
 * @author wangqiang1@staff 重构toolbar，优化API与渲染过程  2014-08-21
 */
SinaEditor.regist('ui.ToolBar', function (SE) {
    var DOMUtil = SE.DOMUtil, Event = SE.Event, Util = SE.Util, GroupButton = SE.ui.GroupButton, Button = SE.ui.Button;

    function ToolBar(opts, editor) {
        var self = this;
        self.that = {};
        self.domUtil = new DOMUtil();
        self.__buttons = [];
        self.editor = editor;
        self.cmds = [];
        self.opts = Util.extend({
            id: 'toolbar',
            name: 'main',
            renderTo: '',
            tpl: '',
            cls: 'BNE_editor_color BNE_editor_color1',
            style: {
                zIndex: 300
            },
            showClass: 'BNE_editor_cur',
            buttons: []
        }, opts);
        self.name = self.opts.name;
        self.event = new Event();
        self.init();
        editor.addToolbar(self);
    }

    ToolBar.prototype = {

        constructor: ToolBar,

        init: function () {
            var self = this, opts = self.opts, renderTo = opts.renderTo, domUtil = self.domUtil;

            if (!self.opts.id) {
                return;
            }
            // 查找渲染节点
            if (renderTo && 'string' === typeof(renderTo)) {
                renderTo = domUtil.$(renderTo)[0];
            } else if (!renderTo) {
                renderTo = domUtil.doc.body;
            }

            if (!(self.toolBarCon = domUtil.$('#' + self.opts.id)[0])) {
                self.toolBarCon = domUtil.create('div', {
                    id: self.opts.id,
                    className: self.opts.cls
                });
                domUtil.setStyle(self.toolBarCon, this.opts.style);
                renderTo.appendChild(self.toolBarCon);
            }
            if (opts.tpl) {
                self.setTpl();
            }
            self.render(opts.buttons);
        },

        /**
         * 渲染buttons配置
         * @param {Array} buttons button的配置
         */
        render: function (buttons) {
            var self = this, btn, btnCfg;
            for (var i = 0, len = buttons.length; i < len; i++) {
                btnCfg = buttons[i];
                if ('group' == btnCfg.type) {
                    btn = new GroupButton(btnCfg);
                    self.addGroupButton(btn);

                } else {
                    btn = new Button(btnCfg);
                    self.addButton(btn);
                }
            }
        },
        /**
         * 将模板设置到toolbar中
         */
        setTpl: function () {
            var tpl = this.opts.tpl;
            this.toolBarCon.innerHTML = tpl;
        },

        /**
         * 向toolbar中添加一个Button
         * @param {Button} btn 按钮实例
         */
        addButton: function (btn) {
            var self = this, domUtil = self.domUtil, node = btn.getNode();
            //self.cmds
            if (!domUtil.contains(self.toolBarCon, node)) {
                self.toolBarCon.appendChild(node);
            }

            domUtil.on(node, 'click', function (e) {
                e.preventDefault();
                self.editor.fire('toolbar.' + btn.name + '.click', self);
            });
            domUtil.on(node, 'mouseover', function (e) {
                e.preventDefault();
                self.editor.fire('toolbar.' + btn.name + '.mouseover', self);
            });
            domUtil.on(node, 'mouseout', function (e) {
                e.preventDefault();
                self.editor.fire('toolbar.' + btn.name + '.mouseout', self);
            });

            if (btn.opts.exec) {
                var execs = btn.opts.exec.toLowerCase().split(' ');

                domUtil.each(execs, function (i, cmd) {
                    self.cmds.push(cmd);
                });
            } else {
                self.cmds.push(btn.name);
            }

            btn.toobar = self;
            self.__buttons.push(btn);

            return node;
        },

        /**
         *  添加按钮组
         * @param {GroupButton} groupBtn
         * @returns {HTMLElement|HTMLElemnt|*}
         */
        addGroupButton: function (groupBtn) {
            var self = this, domUtil = self.domUtil, opts = groupBtn.opts, content, //包含Button的子节点
                node = groupBtn.getNode();

            if (node) {
                content = groupBtn.getNode(opts.contentName) || node;
                domUtil.each(groupBtn.buttons, function (i, btn) {
                    var entity = btn.getNode();
                    content.appendChild(entity);
                    self.addButton(btn);
                });
                if (!domUtil.contains(self.toolBarCon, node)) {
                    self.toolBarCon.appendChild(node);
                }
            } else {
                domUtil.each(groupBtn.buttons, function (i, btn) {
                    self.addButton(btn);
                });
            }
            groupBtn.toolbar = self;
            self.__buttons.push(groupBtn);
            return node;
        },

        /**
         * 获取按钮
         * @param {string} name 按钮名称
         * @returns {Button}
         */
        getButton: function (name) {
            var btn = null;
            this.domUtil.each(this.__buttons, function (i, item) {
                if (name == item.name) {
                    btn = item
                    return !1;
                }
            });
            return btn;
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
         *
         * @param widget
         */
        remove: function (widget) {
            var node = widget.getNode();
            // TODO event 暂时没有off方法
            // this.dom.off(node, 'click', function(){
            //     _this.editor.event.off(_this, 'toolbar.'+widget.name+'.click');
            // });
            // this.dom.off(node, 'mouseover', function(){
            //     _this.editor.event.off(_this, 'toolbar.'+widget.name+'.mouseover');
            // });
            // this.dom.off(node, 'mouseout', function(){
            //     _this.editor.event.off(_this, 'toolbar.'+widget.name+'.mouseout');
            // });
            widget.destroy();
            node.parentNode.removeChild(node);
        },
        /**
         * 设置toolbar的位置
         * @param {number} x
         * @param {number} y
         */
        setPos: function (x, y) {
            var entity = this.toolBarCon;
            this.domUtil.setStyle(entity, {
                left: parseInt(x || 0, 10) + 'px',
                top: parseInt(y || 0, 10) + 'px',
                position: 'absolute'
            })
        },

        /**
         * 获取当前toolbar的位置
         * @returns {{top: number, left: number}}
         */
        getPos: function () {
            var top = this.toolBarCon.style.top, left = this.toolBarCon.style.left;
            return {
                top: top,
                left: left
            };
        },
        /**
         * 获取toolbar的尺寸与位置信息
         * @returns {ClientRect}
         */
        getRect: function () {
            return this.domUtil.getRect(this.toolBarCon);
        },
        /**
         * 显示toolbar
         * @param {Function|number} func 显示后的回调或left值
         * @parma {number} y  toolbar的top值
         */
        show: function (func, y, useAnimate) {
            var x, self = this;
            if (typeof func === 'number') {
                x = func;
                //this.setPos(x, y)
            } else if (typeof func === 'function') {
                x = func.call(this);
            } else {
                x = 0;
            }
            if (this.isHidden || !useAnimate || !SinaEditor.animate) {
                this.setPos(x, y)
                this.toolBarCon.style.display = 'inline-block';
                if (this.opts.showClass) {
                    editor.domUtil.addClass(this.toolBarCon, this.opts.showClass);
                }
                this.isHidden = false;
            } else {
                var old = this.getPos();
                var ofst = {
                    left: x - parseInt(old.left),
                    top: y - parseInt(old.top)
                }
                SinaEditor.animate({
                    duration: 150,
                    fps: 60,
                    func: function (args) {
                        var f = args.currFrame / args.frames;
                        self.toolBarCon.style.left = parseInt(old.left) + f * ofst.left + 'px';
                        self.toolBarCon.style.top = parseInt(old.top) + f * ofst.top + 'px';
                    }
                });
            }
            //if ('function' == typeof func) {
            //    func.call(this);
            //}
            this.fire('show', this);
        },
        /**
         * 隐藏toolbar
         */
        hide: function () {
            this.isHidden = true;
            this.toolBarCon.style.display = 'none';
            if (this.opts.showClass) {
                editor.domUtil.delClass(this.toolBarCon, this.opts.showClass);
            }
        },
        /**
         * 判断toolbar是否显示
         * @returns {boolean}
         */
        isShow: function () {
            return (this.toolBarCon.style.display != 'none');
        },

        /**
         * 销毁toolbar
         * TODO 还没有实现，删除所有buttons与绑定事件
         */
        destroy: function () {

        },
        /**
         * 设置toolbar显示时对应的节点或Range
         * @param {HTMLElement|Range} target
         */
        setTarget: function (target) {
            this.__target = target;
        },
        /**
         * 返回toolbar显示时对应的节点或Range
         * @returns {HTMLElement|Range}
         */
        getTarget: function () {
            return this.__target;
        }};
    return ToolBar;
});