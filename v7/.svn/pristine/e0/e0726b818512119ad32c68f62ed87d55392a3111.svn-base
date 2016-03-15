PluginManager.register('insertNode', function (options, editor) {
    var getNextNode = function (node) {
        if (!node) {
            return null;
        }
        var next = node.nextSibling;
        if (next && next.nodeType == 1) {
            return next;
        } else if (next && next.nodeType == 3 && next.nodeValue != '') {
            return next;
        } else {
            return getNextNode(node.nextSibling);
        }
    }
    var splitIsertNode = function (node) {
        var range = editor.selection.getRange();
        if (!range.collapsed) {
            range.deleteContents();
        }
        range.collapse(true);
        if (range.startContainer.nodeType === 3 && range.startContainer.parentNode == editor.body) {
            //editor.doc.execCommand('formatBlock', false, '<p>');
            //range = editor.selection.getRange();

        }
        var start = range.startContainer, offset = range.startOffset, parent = start.parentNode;
        if (start.nodeType == 3) {
            var len = start.nodeValue.length || 0;
            if (offset === 0 && editor.domUtil.isBlock(start.parentNode)) {
                if (parent != editor.body) {
                    parent.parentNode.insertBefore(node, parent);
                } else {
                    parent.insertBefore(node, start);
                }
                return;
            }
            if (offset >= len && parent != editor.body && editor.domUtil.isBlock(start.parentNode)) {
                if (start.nodeValue == '\u200B') {
                    parent.parentNode.insertBefore(node, parent);
                } else {
                    if (parent.nextSibling) {
                        parent.parentNode.insertBefore(node, parent.nextSibling);
                    } else {
                        parent.parentNode.appendChild(node);
                    }
                }

            } else {
                range.setStartBefore(start);
                range.select();
                var content = range.extractContents();
                for (var l = 0; l < content.childNodes.length; l++) {
                    var item = content.childNodes[l];
                    if (item.nodeType == 1 && item.innerHTML === '') {
                        content.removeChild(item);
                    }
                }
                content.appendChild(node);
                if (parent != editor.body) {
                    var grand = parent.parentNode;
                    grand.insertBefore(content, parent);
                    if (parent.innerHTML == '') {
                        grand.removeChild(parent);
                    }
                    parent = grand;
                    range.setStartBefore(node);
                } else {
                    parent.insertBefore(content, range.endContainer);
                }
            }

        } else if (start !== editor.body) {
            if (editor.domUtil.isBlock(start)) {
                start.parentNode.insertBefore(node, start);
            } else {
                range.insertNode(node);
            }
        } else {
            range.insertNode(node);
        }

        var space = document.createTextNode('\u200B');
        var p = document.createElement('p');
        p.appendChild(space);
        space = p;
        var _offset = 0;

        while (1) {
            var nextNode = getNextNode(node);
            if (nextNode && nextNode.nodeType === 1) {
                if (node.nextSibling.tagName == 'P') {
                    range.setStart(nextNode, 0);
                    break;
                }
            }
            if (nextNode && nextNode.nodeType === 3) {
                range.setStart(nextNode, 0);
                break;
            }

            if (!nextNode) {
                node.parentNode.appendChild(space);
                range.setStart(space, _offset);
                break;
            }

            node = getNextNode(node);
        }

        range.collapse(true);
        range.select();
    }
    editor.registerCmd('insertnode', {
        queryCommandState: function () {
            return true;
        },
        exec: function (cmd, node) {
            splitIsertNode(node);
        }
    });
});
