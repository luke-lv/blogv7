/**
 * @date 20140717
 * @fileoverview 颜色拾取器插件
 */
SinaEditor.PluginManager.register('colorPicker', function (options, editor) {
    var SE = SinaEditor, Util = SE.Util, dtd = SE.dtd;

    options = Util.extend({
        fixTagA: '' //skip为跳过处理a标签， boundary为调整range边界到a标签上，不传则不做任何特殊处理
    }, options);

    editor.on('beforeCommand', function (e, cmd, range) {
        if (options.fixTagA == 'skip' && cmd == 'link') {
            resetColor();
        }
    });

    function rgb2hex(rgbColor) {
        function apply0(hex) {
            return hex.length == 1 ? '0' + hex : hex;
        }

        var rgbColor = rgbColor.toLowerCase();
        if (rgbColor.indexOf('rgb') != 0) {
            return rgbColor;
        }
        var r, g, b, match;
        match = rgbColor.match(/^rgb\((\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\)\s*/);
        if (match.length != 4) {
            return rgbColor;
        }
        r = parseInt(match[1]);
        g = parseInt(match[2]);
        b = parseInt(match[3]);
        return '#' + apply0(r.toString(16)) + apply0(g.toString(16)) + apply0(b.toString(16));
    }

    function resetColor() {
        var tagReg = new RegExp('^(?:' + 'SPAN)$', 'i'), removeFormatAttributes = [], style = 'color', range = editor.getRange(), bookmark, node, parent, domUtil = editor.domUtil, filter = function (node) {
                return node.nodeType == 1;
            };

        function isRedundantSpan(node) {
            if (node.nodeType == 3 || node.tagName.toLowerCase() != 'span') {
                return 0;
            }
            if (SinaEditor.env.$msie) {

                var attrs = node.attributes;
                if (attrs.length) {
                    for (var i = 0, l = attrs.length; i < l; i++) {
                        if (attrs[i].specified) {
                            return 0;
                        }
                    }
                    return 1;
                }
                if (SinaEditor.env.version < 9) {
                    //IE下length的长度为131，每定义一个属性就减1.。哎
                    attrs = [];
                    var html = node.outerHTML;
                    html.replace(/\s+([a-z0-9]+)(=['"]?([^='"\s>]+)['"]?(?=>|\s+?))?/i, function (a, b, c, d) { //只要存在就退出不需要匹配“g”
                        if (b != 'bookmarkTag' && b != 'style') {
                            attrs.push({
                                nodeType: 2,
                                value: d,
                                nodeName: b
                            });
                        }

                    });
                }
            }
            return !node.attributes.length;
        }

        function doRemove(range) {

            var bookmark1 = range.createBookMark();
            if (range.collapsed) {
                //range.boundaryToBlock();
            }
            var aNode = domUtil.isSpecificParent(range.startContainer, 'a', true);
            if (aNode) {
                range.setStartBefore(aNode);
            }

            aNode = domUtil.isSpecificParent(range.endContainer, 'a', true);
            if (aNode) {
                range.setEndAfter(aNode);
            }
            bookmark = range.createBookMark();
            node = bookmark.start;

            //切开始
            while ((parent = node.parentNode) && !domUtil.isBlock(parent)) {
                domUtil.breakParent(node, parent);

                domUtil.clearSpecialNode(node);
            }
            if (bookmark.end) {
                //切结束
                node = bookmark.end;
                while ((parent = node.parentNode) && !domUtil.isBlock(parent)) {
                    domUtil.breakParent(node, parent);
                    domUtil.clearSpecialNode(node);
                }

                //开始去除样式
                var current = domUtil.getFilterTreeDom(bookmark.start, null, filter, false), next, reg = new RegExp(style + '\\s*:[^;]*(?=;|$)', 'gi');
                while (current) {
                    if (current == bookmark.end) {
                        break;
                    }

                    next = domUtil.getFilterTreeDom(current, null, filter, true);

                    if (!dtd.$empty[current.tagName.toLowerCase()] && !domUtil.isBookMarkTag(current)) {
                        if (tagReg.test(current.tagName)) {
                            if (style) {
                                domUtil.setCSSText(current, current.style.cssText.replace(reg, ''));
                                if (isRedundantSpan(current) && style.toLowerCase() != 'text-decoration') {
                                    domUtil.remove(current, true);
                                }
                            } else {
                                domUtil.remove(current, true);
                            }
                        } else {
                            if (!dtd.$tableContent[current.tagName] && !dtd.$list[current.tagName]) {
                                if (isRedundantSpan(current)) {
                                    domUtil.remove(current, true);
                                }
                            }

                        }
                    }
                    current = next;
                }
            }
            range.moveToBookMark(bookmark)
            range.moveToBookMark(bookmark1);
            //清除冗余的代码 <b><bookmark></b>
            var node = range.startContainer, tmp, collapsed = range.collapsed;
            while (node.nodeType == 1 && isEmptyNode(node) && dtd.$removeEmpty[node.tagName]) {
                tmp = node.parentNode;
                range.setStartBefore(node);
                //更新结束边界
                if (range.startContainer === range.endContainer) {
                    range.endOffset--;
                }
                domUtil.remove(node);
                node = tmp;
            }

            if (!collapsed) {
                node = range.endContainer;
                while (node.nodeType == 1 && isEmptyNode(node) && dtd.$removeEmpty[node.tagName]) {
                    tmp = node.parentNode;
                    range.setEndBefore(node);
                    domUtil.remove(node);

                    node = tmp;
                }
            }

        }

        function isEmptyNode(node) {
            if (node.nodeType != 1) {
                return false;
            }
            var childs = 0, child, i = 0;
            while (child = node.childNodes[i]) {
                if (child.nodeType == 3 && SinaEditor.noSpaceReg.test(child.nodeValue)) {
                    childs++;
                    break;
                }

                if (child.nodeType == 1) {
                    if ((child.tagName == 'BR' && node.childNodes.length == 1)) {
                        childs++;
                        break;
                    } else {
                        if (!isEmptyNode(child)) {
                            childs++;
                            break;
                        }
                    }
                }
                i++;
            }
            return childs === 0;
        }

        doRemove(range);
        range.moveToTxtNode();
    }

    editor.registerCmd('color', {
        queryCommandState: function (cmdName, range) {
            var range = (range || editor.getRange());
            var start = range.getStart(), domUtil = range.domUtil, next, parents = domUtil.parents(start), color;
            while (next = parents.shift()) { //TODO:这里其实需要一个getComputedStyle方法。
                if (!next) {
                    return '';
                }
                if (next.tagName == 'SPAN') {
                    color = domUtil.getStyle(next, 'color');
                    if (color) {
                        return rgb2hex(color);
                    }
                }
            }
            return '';
        },
        exec: function (cmdName, color, isSave) {
            //var time = +new Date;
            if (this.queryCommandState('color', range)) {
                resetColor();
            }
            var range = editor.getRange(), domUtil = editor.domUtil;
            //处理a标签 
            if (options.fixTagA === 'boundary') {
                var aNode = domUtil.isSpecificParent(range.startContainer, 'a', true);
                if (aNode) {
                    range.setStart(aNode, 0);
                }

                aNode = domUtil.isSpecificParent(range.endContainer, 'a', true);
                if (aNode) {
                    range.setEnd(aNode, 1);
                }
            }

            range.insertInlineTag('span', {
                style: 'color:' + color + ';'
            }, function (node) {
                if (options.fixTagA == 'skip') {
                    if (node.nodeType == 1 && node.tagName == 'A' || node.parentNode.tagName == 'A') {
                        return false;
                    }
                    var nodes = domUtil.isSpecificParent(node, 'a', true);
                    return !nodes
                }
                return true;
            });

            //console.info(+new Date - time)
        }


    });

    editor.registerCmd('resetColor', {
        exec: function (cmdName) {
            resetColor();
        }

    })

});
