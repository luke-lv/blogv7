(function (SE) {
    var Util = SE.Util;
    var VK = SE.VK;

    function UndoManager(options, editor) {
        var segments = [], index = 0, me = this, prevTime, hotKey, timer, isSaveRange = false, isInputting = false;

        me.editor = editor;
        me.options = Util.extend({}, me.DEFAULT, options);
        me.editor = editor;

        me.getSegment = function (index) {
            return segments[index] || null;
        };

        me.getIndex = function () {
            return index;
        };

        me.setSegment = function (index, object) {
            if (segments[index]) {
                Util.extend(segments[index], object);
            }
            return segments[index];
        };
        me.pushSegment = function (range, content, contentWithRange) {
            segments = segments.slice(0, index + 1);
            if (segments.length > me.options.maxRange) {
                segments.shift();
            }
            index = segments.push({
                range: range,
                content: content,
                contentWithRange: contentWithRange
            }) - 1;
            if (segments.length > me.options.maxRange) {
                segments.shift();
                index--;
            }
        };

        me.getCurrentSegment = function () {
            return me.getSegment(index);
        };

        hotKey = me.options.hotKey;

        function isHotKey(evt) {
            var hotKey = UndoManager.hotKey;
            if (!hotKey) {
                return false;
            }
            var execCommand = hotKey.getExecByEvent(evt);
            return execCommand && execCommand.exec == 'todo';
        }

        editor.on('saveUndo', function (e, saveRange, saveContent) {
            me.save(saveRange, saveContent);
        });

        editor.on('ready', function () {
            var domUtil = editor.domUtil;
            editor.on('keydown', function (e, evt) {

                if (VK.modifierPressed(evt) || VK.metaKeyPressed(evt)) {
                    return;
                }
                var rng = editor.selection.getRange(true);
                if (!isHotKey(evt)) {
                    if (timer) {
                        clearTimeout(timer);
                    }
                    timer = window.setTimeout(function () {
                        if (isInputting) {
                            return;
                        }
                        me.save();
                        timer = null;
                    }, me.options.saveTimer);

                    if (!rng.collapsed) {
                        me.save(true, false);
                        isSaveRange = true;
                        if (timer) {
                            clearTimeout(timer);
                        }
                    }

                }
            });

            editor.on('keyup', function (e, evt) {
                if (isInputting) {
                    return;
                }
                if (isSaveRange) {
                    me.save();
                    isSaveRange = false;
                }
            });

            editor.on('beforeCommand', function (e, cmdName, range) {
                if (!editor._callCmdFn('queryNoUndoState', [cmdName, range])) {
                    me.save(true, false);
                }
                ;
            });
            editor.on('afterCommand', function (e, cmdName, range) {
                if (!editor._callCmdFn('queryNoUndoState', [cmdName, range])) {
                    //window.setTimeout(function() {//这里如果加了记时器会出现选区不正确的问题。暂时不好解决
                    me.save(false, true, range);
                    //}, 15);
                }

            }, false);
            editor.on('compositionstart', function (e, evt) {
                isInputting = true;
            });
            editor.on('compositionend', function () {
                isInputting = false;
            });

        });

        function checkAction(action) {
            return action == 'undo' ? index > 0 && segments.length > 0 : index < segments.length - 1;
        }

        editor.registerCmd('todo', {
            queryCommandState: function (cmdName) {
                return checkAction(cmdName);
            },
            exec: function (cmdName, action) {
                if (checkAction(action)) {
                    if (action == 'undo' && (!segments[index] || segments.length == 1)) {
                        segments = [];
                        index = 0;
                        return;
                    }
                    if (action == 'redo' && !segments[index]) {
                        index = segments.length - 1;
                        return;
                    }
                    me.todo(action == 'undo' ? --index : ++index);

                }
            },
            queryNoUndoState: function (cmdName) {
                return true;
            }
        });

        if (hotKey) {
            editor.on('plugin.hotkey', function (e, hotkey) {
                UndoManager.hotKey = hotkey;
                hotkey.registerHotkey([
                    {
                        exec: 'todo',
                        params: 'undo',
                        hotkeys: hotKey.undo
                    },
                    {
                        exec: 'todo',
                        params: 'redo',
                        hotkeys: hotKey.redo
                    }
                ])
            })
        }
    }

    UndoManager.prototype = {
        constructor: UndoManager,
        DEFAULT: {
            maxRange: 10,
            hotKey: {
                undo: ['ctrl+90'],
                redo: ['ctrl+89']
            },
            saveTimer: 500
        },
        save: function (saveRange, saveContent, range) {
            var me = this,
                editor = me.editor,
                range = range || editor.getRange(true);
            try{
                if (!range) {
                    return;
                }
                saveContent = saveContent === false ? false : true; //default is true;
                var content = editor.getContent(null, true), currentSegment = me.getCurrentSegment(), contentWithRange = '';

                if (saveRange && currentSegment && currentSegment.content == content && !range.collapsed) {

                    var cBook = range.createBookMarkByClone('undo_range');
                    contentWithRange = cBook.content;
                    range.moveToBookMarkByClone(cBook);
                    if (contentWithRange !== currentSegment.contentWithRange) {
                        var index = me.getIndex();
                        me.setSegment(index, {
                            range: range,
                            contentWithRange: contentWithRange
                        });
                    }

                }
                if (saveContent) {
                    if (!currentSegment || currentSegment.content != content) {
                        var cBook = range.createBookMarkByClone('undo_range');
                        contentWithRange = cBook.content;
                        range.moveToBookMarkByClone(cBook);
                        me.pushSegment(range, content, contentWithRange);
                    }
                }
            }catch(e){
                console.log(e.message, '  ', e.stack);
            }

        },
        todo: function (idx) {
            var segment = this.getSegment(idx), editor = this.editor;
            if (segment) {
                editor.setContent(segment.contentWithRange, true);
                segment.range.moveToBookMark('undo_range');
            } else {
            }
        }
    }
    SE.PluginManager.register('undo', UndoManager);
})(SinaEditor)
