SinaEditor.PluginManager.register('basestyle', function (options, editor) {

    var SE = SinaEditor, PluginManager = SE.PluginManager, Util = SE.Util;

    var allowExec = {
        //toggleStyle: ['span'],//暂时用不到
        bold: ["strong", "b"],
        italic: ["em", "i"],
        //title1: ['h1', 'h2'],//逻辑有变，这里取消
        //title2: ['h2', 'h1'],
        underline: ["u"]
    };

    var __execCommands = [
        {
            name: 'bold',
            exec: 'bold',
            activeCls: 'hovered'
        },
        {
            name: 'italic',
            exec: 'italic',
            activeCls: 'hovered'
        },
        {
            name: 'underline',
            exec: 'underline',
            activeCls: 'hovered'
        }
    ];
    var hashCommands = {};
    options = Util.extend({}, options);
    var execCommands = Util.extend(__execCommands, options && options.execCommands);
    //    var Btn = function(options, editor) { //继承Button类
    //        var widget = this;
    //        this.options = Util.extend({}, this.options, options || {});
    //        var name = this.name = this.options.name;
    //        this.id = this.options.id || this.options.name;
    //        this.html = this.options.html;
    //        var exec = this.options.exec;
    //        this.exec = exec;
    //        var attrs = this.options.attrs;
    //        editor.on('toolbar.' + name + '.click', function() {
    //            editor.exec(exec, attrs);
    //            //editor.exec('toggleStyle', 'font-size:36px');
    //        });
    //        editor.on('toolbar.selectionchange', function(e, range, path, toolbar) {
    //            //debugger;
    //            var state = editor.queryCommandState(exec, range, hashCommands[name] && hashCommands[name].attrs, toolbar),
    //                func, btn = widget;
    //            if (func = {
    //                '-1': 'disable',
    //                '0': 'normal',
    //                '1': 'active'
    //            }[state]) {
    //                btn[func] && btn[func].call(btn);
    //            }
    //        });
    //    };
    //    Btn.prototype = new Button();
    //    Btn.prototype.constructor = Btn;

    for (var i = 0; i < execCommands.length; i++) { //注册插件
        var opt = execCommands[i];
        hashCommands[opt.name] = opt;
        (function (opt) {
            PluginManager.register(opt.name, function (opts) {
                //                console.log('注册插件：' + opts.name);
            });
            PluginManager.addPlugin.call(editor, {
                name: opt.name,
                params: opt
            });
            editor.on('toolbar.' + opt.name + '.click', function () {
                editor.exec(opt.exec, opt.attrs);
            });
            editor.on('toolbar.selectionchange', function (e, range, path, toolbar) {
                var state = editor.queryCommandState(opt.exec, range, hashCommands[name] && hashCommands[name].attrs, toolbar), func, btn = toolbar.getButton(opt.name);
                func = {
                    '-1': 'disable',
                    '0': 'normal',
                    '1': 'active'
                }[state];
                if (func) {
                    btn[func] && btn[func].call(btn);
                }
            });
        })(opt);
    }

    var queryState = function (cmdName, range, attrs) { //查询状态

        var tags = allowExec[cmdName] || [], i = 0, range = editor.selection.getRange(); //要最新range
        if (typeof options.disabled == 'function' && options.disabled(range)) {
            return -1;
        }
        range.shrinkBoundary();
        var start = range.getStart();
        //var end = (function(range) {
        //    var end = range.endContainer,
        //        offset = range.endOffset;
        //    if (end.nodeType == 1 && end.childNodes.length > 0) {
        //        end = end.childNodes[offset] || end.lastChild;
        //    }
        //    range = null;
        //    return end;
        //})(range);
        var domUtil = editor.domUtil;
        if (attrs) {
            var isEmptyAttr = true;
            for (var a in attrs) {
                isEmptyAttr = false;
                break;
            }
            var parents = domUtil.parents(start);
            if (!parents || parents.length == 0) {
                return 0;
            } else {
                var testDom = domUtil.doc.createElement(tags[0]);
                domUtil.setAttributes(testDom, attrs);
                for (var i = 0; i < parents.length; i++) {
                    var curr = parents[i];
                    if (attrs.style && domUtil.isSameStyle(parents[i], testDom) && domUtil.isSameElement(parents[i], testDom)) {
                        testDom = null;
                        return 1;
                    }
                    if (domUtil.isSameElement(parents[i], testDom)) {
                        testDom = null;
                        return 1;
                    }
                }
                testDom = null;
                return 0;
            }
        } else {
            var curr = start;
            while (curr && curr != domUtil.body) {
                if (domUtil.isSpecificParent(curr, tags, true)) {
                    return 1;
                }
                curr = curr.parentNode;
            }
            return 0;

        }
        //var isStart = domUtil.isSpecificParent(start, tags, true),
        //    isEnd = domUtil.isSpecificParent(end, tags, true);
        //return isStart || isEnd;

    };

    for (var cmdName in allowExec) { //注册命令 bold,italic,underline,title1,title2
        (function (cmdName) {
            var tags = allowExec[cmdName];
            editor.registerCmd(cmdName, {
                queryCommandState: function (tags, range, attrs, toolbar) {
                    return queryState(cmdName, range, attrs);
                },
                exec: function (cmd, attrs) {
                    var execName = allowExec[cmd];
                    if (!execName) {
                        return;
                    }
                    var tag = execName[0];
                    var range = this.selection.getRange();
                    var start = range.startContainer, end = range.endContainer;
                    var state = queryState(cmd, null, attrs);
                    if (range.collapsed) {
                        if (state == 1) {
                            var tmpText = editor.doc.createTextNode('');
                            range.insertNode(tmpText);
                            range.setStartBefore(tmpText);
                            range.setEndAfter(tmpText);
                            range.removeInlineTag(tags, attrs,true);
                            range.setStartBefore(tmpText);

                        } else if (state == 0) {
                            var tmpNode = editor.doc.createElement(tags[0]);
                            var tmpTxt = editor.doc.createTextNode(SinaEditor.spaceChar);
                            tmpNode.appendChild(tmpTxt);
                            range.insertNode(tmpNode);
                            range.setStart(tmpTxt, 1);

                        } else {
                            return;
                        }
                        range.collapse(true);
                        range.select();

                    } else {
                        if (state == 1) { //因为这里的range有缓存，所以不传
                            range.removeInlineTag(tags, attrs);
                        } else if (state == 0) {
                            range.insertInlineTag(tag, attrs);
                        } else {
                            return false;
                        }
                    }
                    return;
                },
                queryCommandValue: function () {
                }
            });
        })(cmdName);
    }
    return {
        toolBars: execCommands
    }
});
