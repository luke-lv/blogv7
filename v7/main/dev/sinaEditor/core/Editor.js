SinaEditor.regist('Editor', function (SE) {
    var Util = SE.Util, Event = SE.Event, PluginManager = SE.PluginManager, dtd = SE.dtd, Quirks = SE.Quirks;

    /**
     * 编辑器类，负责编辑器的初始化
     * @class
     * @param {Object} opts 编辑器配置
     * @param {String} opts.id  编辑器的id，设置后可通过<code>SinaEditor.get(id)</code>获取编辑器实例
     * @param {HTMLElement|String} opts.root 编辑器根节点或者是根节点的ID
     * @param {array} opts.plugins 编辑器插件配置
     */
    function Editor(opts) {
        var self = this, defaultId = Util.uniqueId();

        self.COMMANDS = {};
        self.event = new Event;
        self.plugins = {};
        self.opts = Util.extend({
            root: defaultId,
            id: defaultId,
            emptyContent: '',
            plugins: [],
            holder: 'se-holder'
        }, opts);
        self.id = self.opts.id;
        self.holder = self.opts.holder || '';
        self.init(self.opts);
        //this.timer = new Timer;
    };

    Editor.prototype = {

        constructor: Editor,
        /**
         * 编辑的ID
         * @type {String}
         */
        id: '',
        /**
         * 编辑器的toolbar
         * @type {Object}
         */
        toolbars: {},
        /**
         * 获取编辑器所在的document
         * @returns {HTMLDocument}
         */
        getDoc: function () {
            return this.doc;
        },
        /**
         * 注册指令
         * @param cmd
         * @param cmdQuery
         */
        registerCmd: function (cmd, cmdQuery) {
            cmd = cmd.toLowerCase();
            if (this.COMMANDS[cmd]) {
                throw Error('重复的命令:' + cmd);
            }
            var obj = {};
            for (var attr in cmdQuery) {
                if (cmdQuery.hasOwnProperty(attr) && cmdQuery[attr] !== undefined) {
                    obj[attr] = cmdQuery[attr]
                }
            }
            this.COMMANDS[cmd] = obj;
            obj = null;
            //this.COMMANDS[cmd] = {
            //    exec: cmdQuery.exec || function() {},
            //    queryCommandValue: cmdQuery.queryCommandValue || function() {},
            //    queryCommandState: cmdQuery.queryCommandState || function() {}
            //};
        },

        /**
         * 执行指令
         *
         * @param {string} cmdName 命令内容
         * @param {...object} data 执行命令的参数
         */
        exec: function (cmdName, data) {
            var self = this,
                sel = self.selection,
                args = arguments,
                rng = sel.getRange(),
                domUtil = self.domUtil,
                elementPath = domUtil.getElementPath(rng);

            cmdName = cmdName.toLowerCase();
            self.fire('beforeCommand', cmdName, rng);
            var time = +new Date;
            self._callCmdFn('exec', args);
            var time = +new Date - time;
            self.fire('execCommand', { //TODO:这里应该写到afterCommand里。但因之前参数不足问题。只好做这样的兼容。这里为了suda统计
                cmdName: cmdName,
                data: data,
                range: rng,
                time: time
            });
//            try {
//                //console.info(cmdName + ' execute time : ' + time + 'ms');
//            } catch (e) {
//            };
            // 查出当前Range的element path然后触发afterCommand
//            console.log('currentRange:', currentRange.startContainer.innerHTML);
            var currentRange = sel.getRange(true);
            var currentPath = domUtil.getElementPath(currentRange);
            self.fire('afterCommand', cmdName, currentRange, currentPath);
            currentRange = sel.getRange(true);
            var isEquals = rng.equals(currentRange);
            //console.log('afterCommand', isEquals, isSamePath);
            // 判断range是否改变，如果改变则触发selectionchange
            if (!isEquals || !domUtil.isSamePath(elementPath, currentPath)) {
                sel.saveNative();
                self.__selectionChange(currentRange, currentPath, 'command');
            }
        },
        /**
         * 查询令值
         * @param {String} cmdName 需要查询的命令
         */
        queryCommandValue: function (cmdName) {
            return this._callCmdFn('queryCommandValue', arguments);
        },
        /**
         * 查询命令状态
         * @param {String} cmdName
         */
        queryCommandState: function (cmdName) {
            return this._callCmdFn('queryCommandState', arguments);
        },
        /**
         * 编辑器获取焦点
         */
        focus: function () {
            var self = this, domUtil = self.domUtil, doc = self.doc, body = self.body, opts = self.opts;

            if (body.ownerDocument == doc) {
                domUtil.getWin(self.doc).focus();
            }

            //        self.setCursor({
            //            position: 'firstChild'
            //        });
            if (!domUtil.hasClass(body, opts.focusCls)) {
                domUtil.addClass(body, opts.focusCls);
            }
        },
        /**
         * 重新设置光标位置
         * @param {Object} opt
         * @param {string} opt.position 光标位置firstChild或lastChild
         */
        setCursor: function (opt) {
            var self = this, rng, node = self.body[opt.position];

            rng = self.getRange();

            if (node) {
                rng.setStart(node, 0);
            } else {
                rng.setStart(self.body, 0);
            }
            rng.collapse(true);
            rng.select(true);
            self.getRange(true);
        },
        /**
         * 编辑器初始化函数
         * @param opt
         */
        init: function (opt) {
            var self = this, pluginsLoaded, contentLoaded;

            var editor = self;

            self.on('pluginOnLoaded', function () {
                if (contentLoaded) {
                    editor.filter = new SinaEditor.FilterHTML(editor.domUtil);
                    self.__callReady();
                } else {
                    pluginsLoaded = !0;
                }
            });
            self.on('contentOnLoaded', function () {
                editor.__initEvent();
                if (pluginsLoaded) {
                    self.__callReady();
                    editor.fire('ready');
                } else {
                    contentLoaded = !0;
                }
            });
            PluginManager.initPlugins(opt.plugins, self);
        },
        /**
         * 编辑器初始化完毕后执行的函数
         * @param {Function} func
         */
        ready: function (func) {
            this.on('ready', function (e) {
                func.call(this, e);
                e.undo = true;
            });
        },
        /**
         * 监听编辑器事件
         * @param {String} name   事件名称
         * @param {Function} func 处理函数
         * @param {Boolean} isFirst  是否在最前处理
         * @returns {*}
         */
        on: function (name, func, isFirst) {
            var f = isFirst === undefined ? true : !!isFirst //默认设置成支持如果是已经fire过的事件，再绑定的话会直接执行一次
            return this.event.bind(name, func, f);
        },
        /**
         * 关闭监听编辑器事件
         * @param {String} name
         * @param {Function} func
         * @returns {Event|*}
         */
        off: function (name, func) {
            //TODO:event没有unbind方法。但支持设置e.undo=true，这样可以让事件只触发一次就自动注销
            return this.event;
        },
        /**
         * 触发编辑器事件
         * @returns {*}
         */
        fire: function () {
            Array.prototype.unshift.call(arguments, this);
            return this.event.fire.apply(this.event, arguments);
        },

        /**
         * 判断内容是否为空
         * @param {reg} 如果完全匹配。则返回true
         *
         */
        isEmptyContent: function (reg) {
            var self = this, node = self.domUtil.body;
            if (node.nodeType != 1)
                return false;

            if (node.childNodes.length > 1) {
                return false;
            }
            var text = self.domUtil.text(node);
            if (text.length > 0) {
                return false;
            }
            for (var n in dtd.$isNotEmpty) {
                if (node.getElementsByTagName(n).length) {
                    return false;
                }
            }
            return true;
        },
        /**
         * 设置编辑器内容
         * @param {String} html 需要设置的html片段
         * @param {Boolean} isGetInnerHtml 是否直接设置innerHTML
         */
        setContent: function (html, isSetInnerHtml) {
            var self = this;
            var content = {
                html: html
            };
            if (!isSetInnerHtml) {
                self.fire('beforeSetContent', content);
                //content = self.filter.filterHtml(content, ignoreBlank, false, !isPaste);
                self.body.innerHTML = content.html;
                self.fire('afterSetContent');
            } else {
                self.body.innerHTML = html;
            }
            //TODO 临时处理措施
            self.fire('tmpAfterSetContent');
            //self.focus();
            self.__selectionChange(null, null, 'setcontent');
        },

        /**
         * 获取编辑器输入内容html
         * @param {Function} formatter 自定义过滤函数
         * @param {Boolean} isGetInnerHtml 是否直接获取innerHTML
         * @returns {String} html 编辑器的html组件
         */
        getContent: function (formatter, isGetInnerHtml) {
            var html = this.body.innerHTML;
            var content = {
                html: html
            };
            if (!isGetInnerHtml) {

                this.fire('beforeGetContent', content);
                //content = this.filter.filterHtml(content, ignoreBlank, false, true);
                this.fire('afterGetContent', content);
            }
            var html = !formatter ? content.html : formatter(content.html);
            return html;
        },

        /**
         * 获取编辑器当前Range
         * @param {boolean} noCache 是否清空缓存的Range，获取最新的Range
         * @returns {Range}
         */
        getRange: function (noCache) {
            return this.selection.getRange(noCache);
        },
        // 执行插件命令注册的函数
        // @param {String} fnName 函数名称
        // @param {Array}  args  传入的参数
        _callCmdFn: function (fnName, args) {
            var self = this;
            var cmdName = args[0].toLowerCase();
            var cmd = self.COMMANDS[cmdName];
            if (!cmd) {
                throw new Error('命令' + cmdName + '的' + fnName + '方法未定义');
            }
            var fn = cmd[fnName];

            if (fn) {
                return fn.apply(self, args);
            } else {
                return false;
            }
        },
        // Range改变时调用
        // @param {Range} rng
        // @param {array} path
        // @param {String} cause
        __selectionChange: function (rng, path, cause) {
            var sel = this.selection;
            rng = rng || sel.getRange(true);
            path = path || this.domUtil.getElementPath(rng);
            this.fire('selectionchange', rng, path, cause);
        },
        // 初始化编辑器事件
        __initEvent: function () {
            var self = this, sel = self.selection,
                isInBody = false, body = self.body,
                checkInterval = 200, domUtil = self.domUtil,
                lastTime = +new Date, lastRng, isIME = false,
                listeners = 'keyup keydown mouseup mousedown touchstart touchend paste cut compositionstart compositionend';

            // 触发selectionchange事件
            function checkSelectionExec(e) {
                var currentRng = sel.getRange(true);
                if (!currentRng.equals(lastRng)) {
                    self.fire('selectionchange', currentRng, null, e && ('string' === typeof e ? e : e.type));
                    lastRng = currentRng;
                }
            }

            // 检查selectionchange

            function checkTimer(e) {
                var type = e.type;
                var timer = setTimeout(function () {
                    if (isIME) {
                        return;
                    }
                    var currentTime = +new Date;
                    var intervalTime = currentTime - lastTime;
                    if (timer && (intervalTime < checkInterval)) {
                        clearTimeout(timer);
                    } else {
                        lastTime = +new Date;
                        checkSelectionExec(type);
                    }
                }, checkInterval);

                // 获取当前Range
                sel.saveNative();
            }

            domUtil.on(body, listeners, function (e) { //在这里设一个全局的用户输入监听
                e = domUtil.fixEvent(e || window.event);
                self.fire(e.type, e);
            });

            //监听selectionChange
            self.domUtil.on(self.doc.body, 'compositionstart', function () {
                isIME = true;
            })
            self.domUtil.on(self.doc.body, 'compositionend', function () {
                isIME = false;
            })
            self.on('mousedown', function () {
                self.isInBody = true;
            });
            self.on('keyup touchend', function (editorEvent, nativeEvent) {
                checkTimer(nativeEvent);
            });
            self.domUtil.on(self.doc.body, 'mouseup keyup touchend', function (e) {
                if (self.isInBody) {
                    checkTimer(e);
                }
                self.isInBody = false
            }, false);
        },

        __render: function (opt) { //TODO DOM类目前还有问题。之后替换
        },
        /**
         * 向编辑器中添加toolbar
         * @param {ToolBar} toolbar
         */
        addToolbar: function (toolbar) {
            var name = toolbar.name;
            if (this.toolbars[name]) {
                throw new Error('工具条<' + name + '>已定义');
            }
            this.toolbars[name] = toolbar;
        },
        /**
         * 获取编辑器的toolbar
         * @param name
         * @returns {*}
         */
        getToolbar: function (name) {
            return this.toolbars[name];
        },

        __callReady: function () {
            var self = this;
            if (self.isEmptyContent()) {
                editor.setContent(self.opts.emptyContent, true);
            }
            self.opts.quirks = new Quirks(self);
            editor.fire('ready');
        }

    };
    return Editor;
});
