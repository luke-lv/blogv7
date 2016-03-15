/**
 * 编辑器里的小控件
 * @author wangqiang
 * @date 2014-08-12
 */
SinaEditor.PluginManager.register('widget', function (options, editor) {
    var SE = SinaEditor,
        domUtil = editor.domUtil,
        spaceChar = SE.spaceChar,
        env = SE.env,
        VK = SE.VK,
        util = SE.Util;

    function findTargetNode(el) {
        var action = domUtil.attr(el, 'se-widget');
        if (action && !domUtil.contains(el, editor.body)) {
            return el;
        }
        return;
    }

    function createNewLine(refElement) {
        var newLine = domUtil.create('p', {}, env.$webkit ? '<br/>' : '');
        domUtil.insertAfter(newLine, refElement);
        var rng = editor.selection.createRange();
        rng.setStart(newLine, 0);
        rng.collapse(true);
        rng.select();
    }

    editor.on('beforeenter', function(e, evt){
        var nativeEvent = editor.domUtil.fixEvent(evt);
        var target = nativeEvent.target;
        var keyCode = nativeEvent.keyCode || nativeEvent.which, result;
        var isEnter = keyCode == VK.ENTER;
        var returnValue = true;
        if (isEnter) {
            var pns = domUtil.parents(target, true);
            util.each(pns, function(i, node){
                if (domUtil.attr(node, 'se-widget')) {
                    returnValue = false;
                    return false;
                }
            });
            if (false === returnValue) {
                createNewLine(pns[pns.length - 1]);
            }
        }

        return returnValue;
    });

    editor.on('beforedelete', function (e, evt) {
        var target,
            offset = -1,
            wrapper,
            walker,
            resetStart,
            end,
            next,
            prev;

        var rng = editor.getRange();
        var start = domUtil.getStart(rng);

        if (3 == start.nodeType) {
            start = start.parentNode;
        }
        offset = rng.startOffset;

        var findNode = function (start, dir, nodeType) {
            nodeType = nodeType || 3
            walker = domUtil.treeWalker(start, editor.body, function (node) {
                if (nodeType !== node.nodeType) {
                    return false;
                }
            });
            return walker[dir]();
        }

        // 是否在一段的最后
        var isAtLastPragh = function (rng) {
            if (!rng.collapsed) {
                return false;
            }
            var start = rng.startContainer;
            var offset = rng.startOffset;
            if (!domUtil.contains(editor.body, start)) {
                return false;
            }
            if (1 == start.nodeType && start === editor.body) {
                return offset === start.childNodes.length;
            } else if (3 === start.nodeType) {
                if (offset !== start.nodeValue.length) {
                    return false;
                } else {
                    start = start.parentNode;
                }
            }

            var isBody;
            while (start && start !== editor.body) {
                isBody = start.parentNode == editor.body;
                if (isBody) {
                    return true;
                } else if (!isBody && start.nextSibling) {
                    return false;
                } else {
                    start = start.parentNode;
                }
            }
            return false;
        }

        if (offset == 0 && VK.BACKSPACE == evt.keyCode) {
            prev = findNode(start, 'prev', 1);
            if (prev) {
                wrapper = findTargetNode(prev)
            }
        } else if (VK.DELETE == evt.keyCode) {
            // 判断光标是否在一段的结尾
            if (isAtLastPragh(rng)) {
                next = findNode(start, 'next', 1);
                if (next) {
                    wrapper = findTargetNode(next)
                }
            } else {
                return;
            }
        } else {
            wrapper = findTargetNode(start);
        }

        if (rng.collapsed && !wrapper) {
            return;
        }
        if (!wrapper) {
            end = domUtil.getEnd(rng);
            if (3 == end.nodeType) {
                end = end.parentNode;
            }
            wrapper = findTargetNode(end);
        }
        if (!wrapper) {
            return;
        }

        target = end || start;

        if (rng.collapsed && findTargetNode(target)) {
            if (!domUtil.text(target) || !offset) {
                return false;
            }
            return;
        }

        if (rng.collapsed) {
            editor.fire('saveUndo');
            domUtil.remove(wrapper);
            editor.fire('saveUndo');
            return false;
        } else if (end) {
            rng.setEndAfter(wrapper);
        } else {
            rng.setStartBefore(wrapper);
        }
    });

});
