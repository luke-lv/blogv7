/**
 * 编辑器 selection 工具类库
 * @class
 * @param {Dom} doc - document对象
 */
SinaEditor.regist('Selection', function (SE) {
    var Range = SE.Range, Util = SE.Util, DOMUtil = SE.DOMUtil;

    function Selection(doc, editor) {
        var sel = this;
        sel.doc = doc;
        sel.editor = editor;
        sel.domUtil = editor.domUtil;
        sel.__cachedRange = sel.__cachedStart = null;
        sel.__lastRange = null;
    }

    Selection.prototype = {
        createRange: function () {
            var newRange = new Range(this.doc, this.editor);
            return newRange;
        },
        getTrueRange: function (nativeRange, range) {
            var self = this;
            var nativeRng;
            var _tmpSel = self.getNative();
            if (_tmpSel && _tmpSel.rangeCount > 0) {
                nativeRng = nativeRange || _tmpSel.getRangeAt(0);
            } else {
                nativeRng = nativeRange;
            }

            if (!nativeRng || !nativeRng.startContainer) {
                return null;
            }
            var range = range || new Range(self.doc, self.editor);
            if (nativeRng.startContainer.parentNode == nativeRng.endContainer && !nativeRng.startOffset) {
                nativeRng.setStart(nativeRng.endContainer, nativeRng.endoffset - 1);
            }
            var commonAncestor = nativeRng.commonAncestorContainer;
            if (!commonAncestor && nativeRng.getCommonAncestor) {
                commonAncestor = nativeRng.getCommonAncestor();
            }
            var editorBody = self.editor.body;
            if (!commonAncestor
                || (!self.domUtil.contains(editorBody, commonAncestor) && commonAncestor != editorBody)) {
                return null;
            }

            range.setStart(nativeRng.startContainer, nativeRng.startOffset);
            range.setEnd(nativeRng.endContainer, nativeRng.endOffset);
            //this.__cachedRange = range;
            return range;
        }, //获取没有缓存的range而不会更新缓存

        getRange: function (noCache) {
            var self = this;

            function convertRange(nativeRange, range) {
                var tmp = range || new Range(self.doc, self.editor);
                var range = self.getTrueRange(nativeRange, range);
                //range.startContainer
                if (!range) {
                    tmp.setStart(self.editor.body, 0);
                    tmp.collapse(true);
                    return tmp;
                } else {
                    return range;
                }
            }

            if (!self.__lastRange || noCache) {
                return convertRange();
            } else {
                return convertRange(self.__lastRange);
            }

        },
        addRange: function (range) {
            range.select();
            this.__historyRange = range;
        },
        getNative: function () {
            var win = this.doc.defaultView || this.doc.parentWindow;
            return win.getSelection();
        },
        getNativeRange: function () {
            var sel = this.getNative();
            return sel.rangeCount > 0 ? sel.getRangeAt(0) : null;
        },
        getSelection: function () {
            return this.getNative();
        },

        getText: function () {
            return this.getSelection().toString();
        },

        getContent: function () {

        },

        reset: function () {
            this.__cachedRange = null;
            this.__cachedStart = null;
            return this;
        },

        cache: function () {
            var sel = this;
            this.__cachedRange = this.getRange(true);
            if (this.__cachedRange) {
                this.__cachedStart = sel.__cachedRange.startContainer;
            }
        },

        setCursor: function (toEnd) {
            var range = this.getRange(true);
            if (!range) {
                return false;
            }
            range.collapse(!toEnd);
            var start = range.startContainer, offset = range.startOffset;
            if (start.nodeType == 3) {
                range['setStart' + (offset ? 'After' : 'Before')](start);
                range['setEnd' + (offset ? 'Before' : 'After')](start);
            }
            var currNode = range.startContainer.childNodes[range.startOffset] || range.startContainer.lastChild, spaceNode;
            if (currNode) {
                if (currNode.nodeType == 1) {
                    if (!(currNode.tagName == 'BR' && start.tagName == 'P' && start.childNodes.length === 1)) { //回车换行时会给空p标签自动添加br，这时不需要处理
                        spaceNode = this.doc.createTextNode(SinaEditor.spaceChar);
                        range.setStartAfter(currNode);
                        range.insertNode(spaceNode);
                        range.setEnd(spaceNode, 0);
                    }
                } else if (currNode.nodeType == 3) {
                    range.setEnd(currNode, 0);
                }
            }
            range.collapse();
            range.select();
            return true;
        },

        saveNative: function () {
            var self = this;
            self.__lastRange = self.getNativeRange();
        },
        getStartElem: function () {
            var range = this.getRange(true).cloneRange();
            range.shrinkBoundary();
            start = range.startContainer;
            if (start.nodeType == 1 && start.hasChildNodes()) {
                start = start.childNodes[Math.min(start.childNodes.length - 1, range.startOffset)];
            }
            if (start.nodeType == 3) {
                return start.parentNode;
            }

            return start;

        }
    }

    return Selection;
});
