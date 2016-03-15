SinaEditor.PluginManager.register('justify', function (options, editor) {
    var justifyFormat = function (range, align) {
        var domUtil = editor.domUtil, bookmark = range.createBookMark(), filterFn = function (node) {
                return node.nodeType == 1 ? !node.getAttribute(editor.holder) && node.tagName.toLowerCase() != 'br' && !domUtil.isBookMarkTag(node) : !!SinaEditor.noSpaceReg.test(node.nodeValue);
            };

        range.boundaryToBlock();
        var bookmark2 = range.createBookMark(), current = domUtil.getFilterTreeDom(bookmark2.start, false, filterFn), tmpRange = range.cloneRange(), tmpNode;
        while (current && !(domUtil.getNodePosition(current, bookmark2.end) & 2)) {
            if (current.nodeType == 3 || !domUtil.isBlock(current)) {
                tmpRange.setStartBefore(current);
                while (current && current !== bookmark2.end && !domUtil.isBlock(current)) {
                    tmpNode = current;
                    current = domUtil.getFilterTreeDom(current, false, null, null, function (node) {
                        return !domUtil.isBlock(node);
                    });
                }
                tmpRange.setEndAfter(tmpNode);
                var common = tmpRange.getCommonAncestor();
                if (domUtil.body != common && domUtil.isBlock(common)) {
                    domUtil.setAttributes(common, {
                        style: 'text-align:' + align
                    });
                    current = common;
                } else {
                    var p = range.doc.createElement('p');
                    domUtil.setAttributes(p, {
                        style: 'text-align:' + align
                    });
                    var frag = tmpRange.extractContents();
                    p.appendChild(frag);
                    tmpRange.insertNode(p);
                    current = p;
                }
                current = domUtil.getFilterTreeDom(current, false, filterFn);
            } else {
                current = domUtil.getFilterTreeDom(current, false, filterFn, true);
            }
        }
        range.moveToBookMark(bookmark2)
        range.moveToBookMark(bookmark);
    };
    var queryState = function (cmdName, range) {
        var range = editor.getRange(true);
        if (options && typeof options.disabled == 'function' && options.disabled(range)) {
            return -1;
        }
        var start = range.getStart(), domUtil = range.domUtil, next, parents = domUtil.parents(start), value;
        while (next = parents.shift()) { //TODO:这里其实需要一个getComputedStyle方法。
            if (!next) {
                return 'left';
            }
            if (domUtil.isBlock(next)) {
                value = next.style.cssText.match(/text\-align\s*:\s*(left|right|center)/i);
                value = value ? value[1] ? value[1] : 'left' : 'left';
                break;
            }
        }
        range = null;
        return value || 'left';
    };
    editor.registerCmd('justify', {
        queryCommandState: queryState,
        exec: function (cmdName, align) {
            var state = queryState('justify');
            if (state !== -1 && state != align) {
                justifyFormat(editor.selection.getRange(), align);
            }
            ;
        }

    });

});
