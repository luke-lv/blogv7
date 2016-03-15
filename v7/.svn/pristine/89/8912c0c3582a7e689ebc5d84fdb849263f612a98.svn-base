/**
 * IE6-8的selection兼容性问题处理
 * @author wangqiang
 * @date 14/10/23
 */
if (SinaEditor.env.$msie && 9 > SinaEditor.env.version) {
    (function (SE) {

        var Util = SE.Util, $dtd = SE.dtd, Range = SE.Range;

        Util.mix(SE.Selection.prototype, {
            W3C: {},
            getNative: function () {
                //if (this.doc.getSelection) {
                //    return this.doc.getSelection();
                //}
                return this.doc.selection;
            },
            getNativeRange: function () {
                var selection = this.getNative(), rng;
                try {
                    rng = selection.createRange();
                } catch (e) {
                    this.editor.focus();
                    rng = selection.createRange();
                }

                if (!rng.duplicate) {
                    var self = this;
                    var dom1 = rng.item(0), dom2 = rng.item(rng.length - 1);
                    var rng1 = self.editor.doc.body.createTextRange(), rng2 = rng1.duplicate();
//          if (dom1 == dom2) {
//            rng1.moveToElementText(dom1);
//            rng1.moveStart('character', 1);
//            rng1.collapse(true);
//          } else {
                    var span = self.editor.doc.createElement('span');
                    self.domUtil.insertBefore(span, dom1);
                    span.appendChild(self.editor.doc.createTextNode(SinaEditor.spaceChar));
                    rng1.moveToElementText(dom1);
                    rng1.moveStart('character', 1);
                    rng2.moveToElementText(dom2);
                    rng2.collapse(false);
                    rng1.setEndPoint('EndToStart', rng2);
                    rng1.select();
                    self.domUtil.remove(span);
                    span = null;
//          }
                    return rng1;

                }
                //rng.moveToElementText(this.editor.body);
                return rng;
            },
            saveNative: function () {
                var self = this;
                self.__lastRange = self.getNativeRange();
                try {
                    self.__lastRange = self.__lastRange.duplicate();
                } catch(e) {
                
                }
                self.saveW3CInfo()
            },
            saveW3CInfo: function (rng) {
                //TODO:缓存目前存在bug
                return;
                // rng = rng || this.w3crng;
                // this.W3C = {};
                // this.W3C.startContainer = rng.startContainer;
                // this.W3C.endContainer = rng.endContainer;
                // this.W3C.startOffset = rng.startOffset;
                // this.W3C.endOffset = rng.endOffset;
                // this.w3crng.startContainer = rng.startContainer;
                // this.w3crng.endContainer = rng.endContainer;
                // this.w3crng.startOffset = rng.startOffset;
                // this.w3crng.endOffset = rng.endOffset;

            },
            getRange: function (noCache) {
                var self = this;
                var getW3CInfo = function (range, isStart) {
                    if (!range.duplicate) {
                        var dom = isStart ? range.item(0) : range.item(range.length - 1);
                        range = self.editor.doc.body.createTextRange();
                        range.moveToElementText(dom);
                    }
                    var rng1 = range.duplicate();
                    rng1.collapse(isStart);
                    var rng2 = range.duplicate(), parent = rng1.parentElement(), container = parent, offset = 0, childs = parent.childNodes, i = 0;
                    while (childs[i]) {
                        var curr = childs[i];
                        if (curr.nodeType != 3 && curr.nodeType != 9 && curr.nodeType != 11 && curr.nodeType != 8) { //非文本节点
                            rng2.moveToElementText(curr);
                            var compare = rng2.compareEndPoints('StartToStart', rng1);
                            if (compare == 0) {
                                offset = self.domUtil.getIndexByChild(curr);

                                break;
                            }
                        } else if (curr.nodeType == 3) {
                            var next = curr.nextSibling, ofst = 0;
                            while (next) { //找一下个非文本节点

                                if (next.nodeType == 1) {
                                    break;
                                }
                                next = next.nextSibling;
                            }

                            if (next) {
                                rng2.moveToElementText(next);
                                rng2.collapse(true);
                                var compare = rng2.compareEndPoints('StartToStart', rng1);
                                if (compare == 0) {
                                    offset = self.domUtil.getIndexByChild(next);
                                    break;
                                } else if (compare < 0) { //TODO:rng2的位置如果还在左边，直接从当前节点开始遍历就行了
                                    i++;
                                    continue;
                                } else { //从下一个非文本节点向前遍历
                                    container = next.previousSibling;
                                    offset = container.nodeValue.length;
                                    while (rng2.compareEndPoints('StartToStart', rng1) > 0) {
                                        if (offset <= 0) {
                                            container = container.previousSibling;
                                            offset = container.nodeValue.length;
                                        } else {
                                            rng2.moveStart('character', -1);
                                            offset--;
                                        }
                                    }
                                    break;
                                }
                            } else {
                                rng2 = rng1.duplicate();
                                rng2.moveToElementText(parent);
                                rng2.collapse(false);
                                rng2.moveStart('character', -1); //hack for rng2
                                if (rng2.htmlText != '') {
                                    rng2.moveStart('character', 1);
                                }

                                container = parent.lastChild;
                                offset = container.nodeValue.length;
                                while (rng2.compareEndPoints('StartToStart', rng1) > 0) {
                                    if (offset <= 0) {
                                        container = container.previousSibling;
                                        offset = container.nodeValue.length;
                                    } else {
                                        rng2.moveStart('character', -1);
                                        rng2.collapse(true);
                                        offset--;
                                    }
                                }
                                break;
                            }

                        }

                        i++;
                    }

                    return {
                        container: container,
                        offset: offset
                    }
                }

                function convertRange(nativeRange, range) {
                    var tmp = range || new Range(self.doc, self.editor);
                    var navRng = nativeRange || self.getNativeRange(),cloneNavRng = null;

                    var w3c = self.W3C, startContainer, startOffset, endContainer, endOffset;
                    if (!w3c.startContainer) {
                        if (nativeRange) {
                            try {
                                navRng.select();
                            } catch (e) {
                            }
                            ;
                        }
                        var startO = getW3CInfo(navRng, true);
                        var endO = getW3CInfo(navRng, false);
                        startContainer = startO.container;
                        endContainer = endO.container;
                        startOffset = startO.offset;
                        endOffset = endO.offset;

                    } else {
                        startContainer = w3c.startContainer;
                        endContainer = w3c.endContainer;

                        startOffset = w3c.startOffset;
                        endOffset = w3c.endOffset;
                    }
                    //var startContainer = w3c.startContainer || determineRangeNode(navRng.duplicate(), true);
                    //var endContainer = w3c.endContainer || determineRangeNode(navRng.duplicate(), false);

                    //var startOffset = w3c.startOffset || determineRangeOffset(navRng.duplicate(), startContainer, true);
                    //var endOffset = w3c.endOffset || determineRangeOffset(navRng.duplicate(), endContainer, false);
                    //
                    if (!self.domUtil.contains(self.domUtil.body, startContainer)) {
                        startContainer = self.domUtil.body;
                        startOffset = 0;
                    }
                    if (!self.domUtil.contains(self.domUtil.body, endContainer)) {
                        endContainer = self.domUtil.body;
                        endOffset = 0;
                    }
                    tmp.setStart(startContainer, startOffset);
                    tmp.setEnd(endContainer, endOffset);
                    if (tmp.startContainer.nodeType == 3) { //修正startContainer
                        if (tmp.startOffset >= tmp.startContainer.nodeValue.length) {
                            var e = tmp.getEnd(), tmpStart;
                            var filter = function (node) {
                                return node.nodeType == 3 && SinaEditor.noSpaceReg.test(node.nodeValue) && self.domUtil.getNodePosition(node, e) & 4 || e.nodeType == 3 && node == e;
                            };
                            tmpStart = self.domUtil.getFilterTreeDom(tmp.startContainer, null, filter, true);

                            if (tmpStart) {
                                tmp.setStart(tmpStart, 0);
                            } else {
                                tmp.collapse(true);
                            }
                        }
                    }
                    return tmp;
                }

                var rng;
                if (!self.__lastRange || noCache) {
                    self.w3crng = null;
                    self.W3C = {};
                    rng = convertRange();
                    self.w3crng = rng;
                } else {
                    self.W3C = rng = convertRange(self.__lastRange);
                }

                return rng.__fixRange();

            }
        });
    })(SinaEditor);

}
