SinaEditor.PluginManager.register('title', function (options, editor) {
    var SE = SinaEditor, Util = SE.Util;
    options = Util.extend({
        //default cfg
    }, options);
    var titleFormat = function (range, tag, attrs, isReset) {
        if (isReset === -1) {
            return false;
        }
        var domUtil = editor.domUtil;
        var bookmark = range.createBookMark(), filterFn = function (node) {
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
                    if (isReset) {
                        var testDom = domUtil.create(tag);
                        domUtil.setAttributes(testDom, attrs);
                        if (testDom.tagName == common.tagName) {
                            var p = domUtil.create('P');
                            domUtil.copyAttrs(common, p);
                            domUtil.each(attrs, function (i, n) {
                                if (i == 'style') {
                                    var props = n.match(/[\w\-]+(?=\s*\:\s*)/g);
                                    if (!props) {
                                        return;
                                    }
                                    domUtil.each(props, function (ii, nn) {
                                        var regExp = new RegExp("" + nn + "\\s*\\:\\s*\[^;\]+(;|$)", "igm");
                                        p.style.cssText = p.style.cssText.replace(regExp, '');
                                    });
                                }
                            });

                            domUtil.removeToAllChilds(common, p);
                            domUtil.insertBefore(p, common);
                            domUtil.remove(common);
                            current = p;
                            testDom = null;
                        }
                    } else {
                        if (common.tagName.toLowerCase() != tag.toLowerCase()) {
                            var dom = domUtil.create(tag);
                            domUtil.removeToAllChilds(common, dom);
                            domUtil.insertBefore(dom, common);
                            domUtil.copyAttrs(common, dom);
                            domUtil.remove(common);
                            common = dom;
                            dom = null;
                        }
                        domUtil.setAttributes(common, attrs);
                        current = common;
                    }

                } else {
                    if (isReset) {

                    } else {
                        var dom = range.doc.createElement(tag);
                        domUtil.setAttributes(dom, attrs);
                        var frag = tmpRange.extractContents();
                        dom.appendChild(frag);
                        tmpRange.insertNode(dom);
                        current = dom;
                    }

                }
                current = domUtil.getFilterTreeDom(current, false, filterFn);
            } else {
                current = domUtil.getFilterTreeDom(current, false, filterFn, true);
            }
        }
        range.moveToBookMark(bookmark2)
        range.moveToBookMark(bookmark);
    };

    function queryState(range, tag, attrs) {
        if (options && 'function' == typeof options.disabled && options.disabled(range)) {
            return -1;
        }
        var domUtil = range.domUtil, start = range.getStart(), result = false, attrs = attrs || {}, parents = domUtil.parents(start), testDom = domUtil.create(tag);
        domUtil.setAttributes(testDom, attrs);
        while (parents && parents.length > 0) {
            var curr = parents.shift();
            if (curr == domUtil.body) {
                break;
            }
            if (domUtil.isBlock(curr)) {
                if (curr.tagName.toLowerCase() == tag.toLowerCase()) {
                    if (testDom.tagName == curr.tagName) {
                        result = true;
                    }
                }
                break;
            }
        }
        testDom = null;
        return result;
    }

    var tags = {
        'h1': {
            //style: 'font-size:34px;line-height:50px;font-weight:normal'
        },
        'h2': {
            //style: 'font-size:24px;line-height:27px;font-weight:normal'
        }
    }

    editor.registerCmd('title', {
        queryCommandState: function (cmdName, range, tag) {
            var attrs = tags[tag];
            return queryState(range, tag, attrs)
        },
        exec: function (cmdName, tag) {
            var attrs = tags[tag];
            if (attrs === undefined) {
                return false;
            }
            var range = editor.selection.getRange();

            titleFormat(range, tag, attrs, queryState(range, tag, attrs));
        }
    });
})
