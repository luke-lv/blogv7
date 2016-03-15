/**
 * 编辑器 range 工具类库
 * @class
 * @param {Dom} doc - document对象
 */
SinaEditor.regist('Range', function () {
    var SE = SinaEditor, $dtd = SE.dtd, env = SE.env, Util = SE.Util;

    function Range(doc, editor) {
        var range = this;
        range.domUtil = editor.domUtil;
        range.editor = editor;
        range.doc = doc;
        range.collapsed = true;
        range.bookmarkList = [];
        range.skipSign = editor.holder;
    }

    Range.prototype = {

        constructor: Range,
        /**
         * dom操作工具类库
         * @type {DOMUtil}
         */
        domUtil: null,
        /**
         * 开始节点Range所属的document对象
         * @type {HTMLDocument}
         */
        doc: null,
        /**
         * 开始节点
         * @type {Node}
         */
        startContainer: null,
        /**
         * 开始节点偏移量
         * @type {number}
         */
        startOffset: null,
        /**
         * 结束节点
         * @type {Node}
         */
        endContainer: null,
        /**
         * 结束节点偏移量
         * @type {number}
         */
        endOffset: null,

        bookmarkList: [],

        collapsed: true,

        /**
         * 折叠选区
         * @param {boolean} toStart 是否已折叠到开始节点的位置
         * @returns {Range}
         */
        collapse: function (toStart) {
            var range = this;
            if (toStart) {
                range.endContainer = range.startContainer;
                range.endOffset = range.startOffset;
            } else {
                range.startContainer = range.endContainer;
                range.startOffset = range.endOffset;
            }

            range.collapsed = true;
            return range;
        },
        /**
         * 克隆rang选中内容
         * @return {DocumentFragment} contents 选区克隆内容
         */
        cloneContents: function () {
            return this.__proccessContents(0);
        },
        /**
         * 删除rang选中内容
         */
        deleteContents: function () {
            var self = this;
            self.__proccessContents(1);
            self.select(true);
            return self;
        },
        /**
         * 剪切当前Range内容
         * @return {DocumentFragment} contents 剪切后返回的内容
         */
        extractContents: function () {
            return this.__proccessContents(2);
        },
        /**
         * 克隆当前Range选项
         * @returns {Range}
         *
         */
        cloneRange: function (noCache) {
            var range = new Range(this.doc, this.editor);
            range.setStart(this.startContainer, this.startOffset);
            range.setEnd(this.endContainer, this.endOffset);
            return range;
        },
        /**
         * 判断Range是否相等
         * @param rng
         * @returns {*|boolean}
         */
        equals: function (rng) {
            if (!rng) {
                return false;
            }
            var start = rng.startContainer == this.startContainer && rng.startOffset == this.startOffset, end = rng.endContainer == this.endContainer && rng.endOffset == this.endOffset;

            return start && end;
        },
        /**
         * 将Range的开始与结束选区到最小的位置<br>
         * @example
         * <p>xxxx[<em>xxxx</em>xxx</p>
         * <p>]xxxxxxxxxx</p>
         * //to
         * <p>xxxx<em>[xxxx</em>xxx]</p>
         * <p>xxxxxxxxxx</p>
         *
         * @param {Boolean} ignoreEnd 是否忽略缩小结束节点
         */
        shrinkBoundary: function (ignoreEnd) {
            var self = this, child;

            function check(node) {
                return node.nodeType == 1 && !self.domUtil.isBookMarkTag(node) && !$dtd.$empty[node.tagName] && !$dtd.$nonChild[node.tagName];
            }

            while (self.startContainer.nodeType == 1 && (child = self.startContainer.childNodes[self.startOffset]) && check(child)) {
                self.setStart(child, 0);
            }
            if (self.collapsed) {
                self.collapse(true);
            }
            if (!ignoreEnd) {
                while (self.endContainer.nodeType == 1 && self.endOffset > 0 && (child = self.endContainer.childNodes[self.endOffset - 1]) && check(child)) {
                    self.setEnd(child, child.childNodes.length);
                }
            }
        },
        /**
         * 删除一个节点并更新range
         * @param node
         * @returns {Range}
         */
        removeNode: function (node) {
            var domUtil = this.domUtil, parent = node.parentNode;
            if (!parent) {
                return;
            }
            if (!parent || node == domUtil.body) {
                return this;
            }
            var start = this.startContainer, sOffset = this.startOffset, end = this.endContainer, eOffset = this.endOffset, index = domUtil.getIndexByChild(node), currNode;

            if (parent == start) {
                if (index < Math.min(sOffset, start.childNodes.length - 1)) {
                    this.startOffset -= 1;
                    if (start == end) {
                        this.endOffset -= 1;
                    }
                }
            }

            if (parent == end && end != start) {
                if (index < Math.min(eOffset, end.childNodes.length - 1)) {
                    this.endOffset -= 1;
                }
            }
            parent.removeChild(node);
            node = parent = null;
            return this;
        },

        /**
         * 调整边界到非文本节点
         * @param isEnd
         * @returns {Range}
         */
        boundaryTxt: function (isEnd) {
            var self = this;
            ///self.shrinkBoundary();
            var flagName = isEnd ? 'end' : 'start', node = self[flagName + 'Container'], offset = self[flagName + 'Offset'], setAfter = 'set' + flagName.replace(/^(\w)/, function (a) {
                    return a.toUpperCase()
                }) + 'After', setBefore = 'set' + flagName.replace(/^(\w)/, function (a) {
                    return a.toUpperCase()
                }) + 'Before';

            if (node.nodeType != 3) {
                return self;
            }

            if (offset === 0) {
                self[setBefore](node);
            } else {
                if (offset >= node.nodeValue.length) {
                    self[setAfter](node);
                } else {
                    // http://stackoverflow.com/questions/7378186/ie9-childnodes-not-updated-after-splittext
                    var tNode = self.domUtil.splitText(node, offset);
                    //node.splitText(offset);
                    if (!isEnd) {
                        if (node === self.endContainer) {
                            self.setEnd(tNode, self.endOffset - offset);

                        } else if (node.parentNode === self.endContainer) {
                            self.endOffset++;
                        }
                    } else {
                        self.setEndAfter(node);
                    }
                    self[setBefore](tNode);
                }
            }

            return self;

        },
        /**
         * 插入节点
         * @param {Node} node
         * @returns {Range}
         */
        insertNode: function (node) {
            var self = this;
            var start = self.startContainer, offset = self.startOffset, end = self.endContainer, eOffset = self.endOffset, len = 1, cNode = node;
            self.boundaryTxt();
            start = self.startContainer, offset = self.startOffset;

            if (node.nodeType == 11) { //frag
                len = node.childNodes.length;
                if (len == 0) {
                    return;
                }
                cNode = node.firstChild;
            }
            var child = start.childNodes[offset];

            if (child) {
                start.insertBefore(node, child);
            } else {
                start.appendChild(node);
            }

            if (cNode.parentNode == self.endContainer) {
                self.endOffset += len;
            }
            self.setStartAfter(cNode);
            return self;
        },
        /**
         *调整边界到一个block节点
         *
         */
        boundaryToBlock: function () {
            var domUtil = this.domUtil, pre, node, tmp = this.doc.createTextNode(''), node = this.startContainer;
            if (node.nodeType == 1) {
                if (node.childNodes[this.startOffset]) {
                    pre = node = node.childNodes[this.startOffset]
                } else {
                    node.appendChild(tmp);
                    pre = node = tmp;
                }
            } else {
                pre = node;
            }
            while (1) {
                if (domUtil.isBlock(node)) {
                    node = pre;
                    while ((pre = node.previousSibling) && !domUtil.isBlock(pre)) {
                        node = pre;
                    }
                    this.setStartBefore(node);
                    break;
                }
                pre = node;
                node = node.parentNode;
            }
            node = this.endContainer;
            if (node.nodeType == 1) {
                if (pre = node.childNodes[this.endOffset]) {
                    node.insertBefore(tmp, pre);
                } else {
                    node.appendChild(tmp);
                }
                pre = node = tmp;
            } else {
                pre = node;
            }
            while (1) {
                if (domUtil.isBlock(node)) {
                    node = pre;
                    while ((pre = node.nextSibling) && !domUtil.isBlock(pre)) {
                        node = pre;
                    }
                    this.setEndAfter(node);
                    break;
                }
                pre = node;
                node = node.parentNode;
            }
            if (tmp.parentNode === this.endContainer) {
                this.endOffset--;
            }
            domUtil.remove(tmp);
            this.fixBoundary();

        },
        getStart: function () {
            var range = this;
            var start = range.startContainer, offset = range.startOffset;
            if (start.nodeType == 3 && start.nodeValue.length <= offset) {
                start = start.nextSibling || start.parentNode.nextSibling || start;
                offset = 0;
            }
            if (start.nodeType == 1 && start.childNodes.length > 0) {
                start = start.childNodes[offset] || start.lastChild;
            }

            return start;
        },
        getEnd: function () {
            var range = this;
            var end = range.endContainer, offset = range.endOffset;
            if (end.nodeType == 1) {
                if (offset != 0) {
                    end = end.childNodes[offset] || end.lastChild;
                }
            }
            return end;
        },

        fixBoundary: function () {
            var self = this;
            if (!self.collapsed) {
                while ((self.startContainer != self.domUtil.body) && self.startOffset == self.startContainer[self.startContainer.nodeType == 3 ? 'nodeValue' : 'childNodes'].length && self.startContainer[self.startContainer.nodeType == 3 ? 'nodeValue' : 'childNodes'].length) {

                    self.setStartAfter(self.startContainer);
                }
                while ((self.endContainer != self.domUtil.body) && !self.endOffset && self.endContainer[self.endContainer.nodeType == 3 ? 'nodeValue' : 'childNodes'].length) {
                    self.setEndBefore(self.endContainer);
                }
            }
        },

        /**
         * 插入inline标签
         * @param {String} tag 标签名称
         * @param {JSON} attributes 标签的属性
         * @param {Function} customFilter 该参数在查询标签时用来过滤掉一些指定的node节点
         */
        insertInlineTag: function (tag, attributes, customFilter) {
            var self = this;
            if (self.collapsed) {
                return;
            }
            self.shrinkBoundary();
            self.boundaryTxt();
            self.boundaryTxt(true);
            var self = this;
            while (self.startOffset == 0) {
                var start = self.startContainer;
                if (start.nodeType == 1 && self.domUtil.isBlock(start)) {
                    break;
                }
                if (start == self.domUtil.body) {
                    break;
                }
                self.setStartBefore(start);
            }
            while (self.endOffset == (self.endContainer.nodeType == 3 ? self.endContainer.nodeValue.length : self.endContainer.childNodes.length)) {
                var end = self.endContainer;
                if (end.nodeType == 1 && self.domUtil.isBlock(end)) {
                    break;
                }
                if (end == self.domUtil.body) {
                    break;
                }
                self.setEndAfter(end);
            }

            self.fixBoundary();

            var filter = function (node) {
                if ('function' == typeof customFilter && !customFilter(node)) {
                    return false;
                }
                var txt = node.textContent || node.innerText || '';
                return node.nodeType == 1 ? !node.getAttribute(self.skipSign) && (node.tagName.toLowerCase() != 'br' && txt.length > 0) : !!SinaEditor.noSpaceReg.test(node.nodeValue) && !node.parentNode.getAttribute(self.skipSign);
            };
            var bookmark = self.createBookMark();
            var range = self.cloneRange();
            var start = bookmark.start, end = bookmark.end, next = self.domUtil.getFilterTreeDom(start, null, filter, false), endNode, domList = [];

            while (next && self.domUtil.getNodePosition(next, end) & 4) {
                if (next.nodeType == 3 || $dtd[tag][next.tagName]) {
                    range.setStartBefore(next);
                    var tNode = next;
                    while (tNode && (tNode.nodeType == 3 || $dtd[tag][tNode.tagName]) && tNode !== end) {
                        endNode = tNode;
                        tNode = self.domUtil.getFilterTreeDom(tNode, null, null, tNode.nodeType == 1, function (node) {
                            return $dtd[tag][node.tagName];
                        });
                    }
                    range.setEndAfter(endNode);
                    var dom = range.doc.createElement(tag);
                    self.domUtil.setAttributes(dom, attributes);
                    //TODO BUG1、2
                    // 1、先加粗，重新选择加粗一部分，endContainer选择正常内容一部分后加下划线，剪切的endContainer不太对
                    // 2、先加粗，重新选择加粗一部分，startContainer选择正常内容的一部分，再去加粗
                    //        console.log('before:', range.startContainer.outerHTML, range.startOffset);
                    //        console.log('after:', range.endContainer.outerHTML, range.startOffset);
                    // console.log(range.startContainer.nodeType, '|', range.startContainer.nodeName, '|', range.startContainer.innerHTML, '|', range.startContainer.childNodes.length);
                    var fragment = range.extractContents();
                    // console.log(range.startContainer.nodeType, '|', range.startContainer.nodeName, '|', range.startContainer.innerHTML, '|', range.startContainer.childNodes.length);
                    //        console.log('start:', range.startContainer.outerHTML, range.startOffset);
                    //        console.log('end:', range.endContainer.outerHTML, range.startOffset);
                    dom.appendChild(fragment);
                    domList.push(dom);
                    range.insertNode(dom);
                    self.domUtil.mergeSibling(dom);
                    self.domUtil.clearSpecialNode(dom);
                    self.domUtil.mergeChild(dom, tag, attributes);
                    next = self.domUtil.getFilterTreeDom(dom, null, filter, false);
                    self.domUtil.mergeToParent(dom);
                    if (tNode === end) {
                        break;
                    }
                } else {
                    next = self.domUtil.getFilterTreeDom(next, null, filter, true);
                }
            }
            range = null;

            for (var d = 0; d < domList.length; d++) {
                self.domUtil.mergeSibling(domList[d]);
            }
            self.removeBookMark(bookmark);
            self.moveToTxtNode();

        },

        /**
         * 移除inline标签
         * @param tags
         * @param attrs
         */
        removeInlineTag: function (tags, filter,noMergeTxt) {
            if ('string' == typeof tags) {
                tags = [tags];
            }
            var self = this;
            if (self.collapsed) {
                return;
            }
            self.fixBoundary();
            var start = self.startContainer, end = self.endContainer;
            while (1) {
                if (start.nodeType == 1) {
                    if (Util.inArray(tags, start.tagName.toLowerCase())) {
                        break;
                    }
                    if (start == self.domUtil.body) {
                        start = null;
                        break;
                    }
                }
                start = start.parentNode;
            }
            while (1) {
                if (end.nodeType == 1) {
                    if (Util.inArray(tags, end.tagName.toLowerCase())) {
                        break;
                    }
                    if (end == self.domUtil.body) {
                        end = null;
                        break;
                    }
                }
                end = end.parentNode;
            }
            var bookmark = self.createBookMark(), frag, tmpRange;

            if (start) {
                tmpRange = self.cloneRange();
                tmpRange.setEndBefore(bookmark.start);
                tmpRange.setStartBefore(start);
                frag = tmpRange.extractContents();
                tmpRange.insertNode(frag);
                self.domUtil.clearSpecialNode(start, true);
                start.parentNode.insertBefore(bookmark.start, start);
            }
            if (end) {
                tmpRange = self.cloneRange();
                tmpRange.setStartAfter(bookmark.end);
                tmpRange.setEndAfter(end);
                frag = tmpRange.extractContents();
                tmpRange.insertNode(frag);
                self.domUtil.clearSpecialNode(end, false, true);

                end.parentNode.insertBefore(bookmark.end, end.nextSibling);
            }
            var current = self.domUtil.getFilterTreeDom(bookmark.start, null, filter || function (node) {
                    return node.nodeType == 1 && !node.getAttribute(self.skipSign);
                }), next;
            while (current && current !== bookmark.end) {
                next = self.domUtil.getFilterTreeDom(current, null, function (node) {
                    return node.nodeType == 1;
                }, true);
                if (Util.inArray(tags, current.tagName.toLowerCase())) {
                    if (current.parentNode) {
                        while (current && current.firstChild) {
                            current.parentNode.insertBefore(current.firstChild, current);
                        }
                        self.domUtil.remove(current);
                    }
                }
                current = next;
            }
            self.removeBookMark(bookmark);
            if(!noMergeTxt) {
              self.moveToTxtNode();
            } else {
              self.select();
            }
        },

        /**
         * 选中指定的node节点
         * @param {Node} node
         * @returns {Range}
         */
        selectNode: function (node) {
            var self = this;
            self.setStartBefore(node);
            self.setEndAfter(node);

            self.select();
            return self;
        },

        /**
         * 设置选中选区
         * @returns {Range}
         */
        select: function (nofillChar) {
            var self = this, editor = self.editor,
                domUtil = self.domUtil,
                doc = self.doc, w = self.domUtil.getWin(self.doc);
            //SinaEditor.env.$firefox ? domUtil.body.focus() : w.focus(); //ff蛋疼
            var activeElement = doc.activeElement
            try{
                var scrollTop = domUtil.scrollTop();
                if (env.$firefox && editor.body.focus) {
                    editor.body.focus();
                    domUtil.scrollTop(scrollTop);
                } else if (!activeElement || !domUtil.contains(editor.body, activeElement)) {
                    w.focus();
                    var afterTop = domUtil.scrollTop();
                    if (scrollTop !== afterTop) {
                        domUtil.scrollTop(scrollTop);
                    }
                }

            }catch(e){

            }

            var selection = w.getSelection();
            if (selection) {
                selection.removeAllRanges();
                var nativeRange = self.doc.createRange();
                if (self.collapsed && self.startContainer.nodeType !== 3) {
                    //TODO 
                }

                fixRange(this, nofillChar);
                try {
                    nativeRange.setStart(self.startContainer, self.startOffset);
                    nativeRange.setEnd(self.endContainer, self.endOffset);
                    selection.addRange(nativeRange);
                } catch (e) {
                }

            }

            function fixRange(range, nofillChar) {
                if (range.collapsed && !nofillChar) { //TODO:应处理光标落在特殊节点上时的情况
                    var start = range.startContainer, child = start;
                    if (start.nodeType == 1) {
                        child = start.childNodes[range.startOffset];

                    }
                    if (!(start.nodeType == 3 && range.startOffset) && (child ? (!child.previousSibling || child.previousSibling.nodeType != 3) : (!start.lastChild || start.lastChild.nodeType != 3)
                        )) {
                        var txtNode = range.doc.createTextNode(SinaEditor.spaceChar);
                        range.insertNode(txtNode);
                        range.setStart(txtNode, SinaEditor.env.$webkit ? 1 : 0);
                        range.collapse(true);
                    }
                }
                if (range.startContainer.nodeType == 1 && range.startContainer.childNodes.length < range.startOffset) {
                    range.startOffset = range.startContainer.childNodes.length;
                }
                if (range.endContainer.nodeType == 1 && range.endContainer.childNodes.length < range.endOffset) {
                    range.endOffset = range.endContainer.childNodes.length;
                }
                if (range.startContainer.nodeType == 3 && range.startContainer.nodeValue.length < range.startOffset) {
                    range.startOffset = range.startContainer.nodeValue.length;
                }

                if (range.endContainer.nodeType == 3 && range.endContainer.nodeValue.length < range.endOffset) {
                    range.endOffset = range.endContainer.nodeValue.length;
                }
                return range;
            }

            this.editor.selection.saveNative();
            return self;
        },
        /**
         *
         * @param node
         * @param offset
         * @returns {*}
         */
        setEnd: function (node, offset) {
            return this.relovseRange(node, offset);
        },
        /**
         *
         * @param node
         * @returns {*}
         */
        setEndAfter: function (node) {
            return this.setEnd(node.parentNode, this.domUtil.getIndexByChild(node) + 1);
        },
        /**
         *
         * @param node
         * @returns {*}
         */
        setEndBefore: function (node) {
            return this.setEnd(node.parentNode, this.domUtil.getIndexByChild(node));
        },
        /**
         *
         * @param node
         * @param offset
         */
        setStart: function (node, offset) {
            this.relovseRange(node, offset, true);
        },

        setStartAfter: function (node) {
            return this.setStart(node.parentNode, this.domUtil.getIndexByChild(node) + 1);
        },

        setStartBefore: function (node) {
            var index = this.domUtil.getIndexByChild(node);
            return this.setStart(node.parentNode, index);
        },

        getCommonAncestor: function () {
            var start = this.startContainer, end = this.endContainer;
            if (start == end) {
                return start;
            } else {
                return this.domUtil.getCommonAncestor(start, end)
            }
        },
        /**
         *
         * @param id
         * @returns {{start: HTMLElement, end: *}}
         */
        createBookMark: function (id) {
            var rng = this;
            var start, end = null;
            var endContainer = rng.endContainer;
            var endOffset = rng.endOffset;
            start = rng.doc.createElement('span');
            start.style.display = 'none';
            start.setAttribute('bookmarkTag', 'range_bookmark_start_sign');
            if (id) {
                start.id = 'start_' + id;
            }
            if (!rng.collapsed) {
                end = rng.doc.createElement('span');
                end.style.display = 'none';
                end.setAttribute('bookmarkTag', 'range_bookmark_end_sign');
                if (id) {
                    end.id = 'end_' + id;
                }
            }
            if ($dtd.$empty[rng.startContainer.nodeName.toLocaleLowerCase()]) {
            }
            rng.insertNode(start);

            if (end) {
                rng.collapse(false);
                rng.insertNode(end);
                rng.setStartAfter(start);
                rng.setEndBefore(end);
            } else {
                rng.collapse(true);
            }
            var bookmark = {
                start: start,
                end: end
            };
            this.bookmarkList.push(bookmark)
            return bookmark;
        },

        createBookMarkByClone: function (bid) {
            //创建不会破坏dom结构的bookmark,为某些不需要dom操作而创建的bookmark，如undo或只为了拿到bookmark节点的坐标等.
            if (!this.editor.body.parentNode || this.editor.body.parentNode.nodeType != 1) {
                return this;
            }
            if (env.$msie && 9 > env.version) { //IE下各种bug
                return {
                    content: this.editor.body.innerHTML,
                    body: this.editor.body,
                    bookmark: this.createBookMark(bid),
                    range: this,
                    cloneRange: this
                }
                //this.moveToTxtNode(false, false, true);
            }

            var rng = this,
                startContainer = rng.startContainer,
                startOffset = rng.startOffset,
                endContainer = rng.endContainer,
                endOffset = rng.endOffset,
                domUtil = rng.domUtil,
                tmpStartId,
                tmpEndId,
                tmpBody,
                sParent,
                eParent,
                sIndex,
                eIndex,
                id;

            if (startContainer.nodeType == 3) {
                sParent = startContainer.parentNode;
                tmpStartId = sParent.getAttribute('id');
                sParent.setAttribute('id', 'bookmark_for_clone_start');
                sIndex = domUtil.getIndexByChild(startContainer);
            } else {
                id = startContainer.getAttribute('id');
                if (id) {
                    tmpStartId = id;
                }
                startContainer.setAttribute('id', 'bookmark_for_clone_start');
            }

            if (!rng.collapsed) {
                if (endContainer.nodeType == 3) {
                    eParent = endContainer.parentNode;
                    id = eParent.getAttribute('id');
                    tmpEndId = id == 'bookmark_for_clone_start' ? '' : id;
                    eParent.setAttribute('id', 'bookmark_for_clone_end');
                    eIndex = domUtil.getIndexByChild(endContainer);
                } else {
                    id = endContainer.getAttribute('id');
                    if (id != 'bookmark_for_clone_start') {
                        tmpEndId = id;
                    }
                    endContainer.setAttribute('id', 'bookmark_for_clone_end');
                }
            }
            tmpBody = this.editor.body.cloneNode(true);

            this.editor.body.parentNode.insertBefore(tmpBody, this.editor.body);

            domUtil.remove(this.editor.body);

            var tmpRng = rng.cloneRange();

            var tmpId = sParent || startContainer;

            if (tmpStartId) {
                tmpId.id = tmpStartId;
            } else {
                tmpId.removeAttribute('id');
            }
            if (!this.collapsed) {
                tmpId = eParent || endContainer;

                if (tmpEndId) {
                    tmpId.id = tmpEndId;
                } else {
                    tmpId.removeAttribute('id');
                }
            }

            tmpId = null;
            var startClone = this.doc.getElementById('bookmark_for_clone_start');

            if (!this.collapsed) {
                var endClone = this.doc.getElementById('bookmark_for_clone_end');
            }
            if (!startClone && !this.collapsed) {
                startClone = endClone;
            }

            if (tmpStartId) {
                startClone.setAttribute('id', tmpStartId);
            } else {
                startClone.removeAttribute('id');
            }
            if (!this.collapsed) {
                if (tmpEndId) {
                    endClone.setAttribute('id', tmpEndId);
                } else {
                    endClone.removeAttribute('id');
                }
            }
            if (sParent) {
                startClone = startClone.childNodes[sIndex];
            }

            if (eParent) {
                endClone = endClone.childNodes[eIndex];
            }

            tmpRng.setStart(startClone, startOffset);

            if (endClone && !this.collapsed) {
                tmpRng.setEnd(endClone, endOffset);
            } else {
                tmpRng.collapse(true);
            }
            var tmpBookmark = tmpRng.createBookMark(bid);
            var content;
            try{
                content = tmpBody.innerHTML;
            } catch (e) {

            }
//
            eParent = sParent = null;
            return {
                content: content,
                body: tmpBody,
                bookmark: tmpBookmark,
                range: rng,
                cloneRange: rng.cloneRange()
            }
        },

        /**
         *
         * @param bookmark
         * @returns {Range}
         */
        removeBookMark: function (bookmark) {
            var id, range = this;
            if (typeof bookmark == 'string') {
                id = bookmark;
                bookmark = {
                    start: this.doc.getElementById('start_' + id),
                    end: this.doc.getElementById('end_' + id)
                }
                if (!bookmark.start) { //防止有些情况下在记时器里多次调用时bookmark已经被移除
                    return this;
                }

            } else if (bookmark === undefined && this.bookmarkList.length > 0) {
                bookmark = this.bookmarkList.pop();
            } else if (!bookmark) {
                return this;
            }
            range.setStartAfter(bookmark.start);
            if (bookmark.end) {
                range.setEndBefore(bookmark.end)
            } else {
                range.collapse(true);
            }
            range.removeNode(bookmark.start);
            if (bookmark.end) {
                range.removeNode(bookmark.end);
            }
            bookmark.start = bookmark.end = null;
            return this;
        },

        moveToBookMarkByClone: function (bookmark) {
            var range = bookmark.range, cloneRange = bookmark.cloneRange;
            if (env.$msie && 9 > env.version) { //TODO: 先不处理IE
                this.moveToBookMark(bookmark.bookmark);
                return this;
            }
            bookmark.body.parentNode.insertBefore(range.editor.body, bookmark.body);
            range.domUtil.remove(bookmark.body);
            bookmark.body = null;
            bookmark = null;
            range.setStart(cloneRange.startContainer, cloneRange.startOffset);
            range.setEnd(cloneRange.endContainer, cloneRange.endOffset);
            range.select(true);
        },
        moveToBookMark: function (bookmark) {
            this.removeBookMark(bookmark).select(true);
        },
        /**
         *
         * 将边界调整到文本节点（如果有）,并合并所有能合并的文本节点
         * @params isFixBoundary 如果为true,将会尝试修正选区至最外围且nodeType == 3的节点(如果不存在这样的节点。将选区折叠)
         * @params noMerge 如果为true则不会合并文本节点
         */
        moveToTxtNode: function (isFixBoundary, noMerge, noSelect) {
            var collapsed = this.collapsed;
            var domUtil = this.domUtil, start = this.startContainer, end = this.endContainer, sOfst = this.startOffset, eOfst = this.endOffset, prev, next;
            var curr = start;
            var rng = this;

            if (isFixBoundary) {
                var _end, e = this.getEnd();
                var filter = function (node) {
                    return node.nodeType == 3 && SinaEditor.noSpaceReg.test(node.nodeValue) && domUtil.getNodePosition(node, e) & 4 || e.nodeType == 3 && node == e;
                };

                var _start = this.getStart();
                if (_start.nodeType == 1 && _start == start && sOfst == _start.nodeValue.length) { //修正start
                    var tmpStart = domUtil.getFilterTreeDom(_start, null, filter, true);
                    if (tmpStart) {
                        start = _start = tmpStart;
                        sOfst = 0;
                    }
                }
                if (!filter(_start) || !filter(e)) {
                    if (!filter(_start)) {
                        start = _start;
                        sOfst = 0;
                        start = domUtil.getFilterTreeDom(start, null, filter, true);
                        if (start) {
                            sOfst = 0;
                            _end = start;
                        } else {
                            this.collapse(true);
                            if (!noSelect) {
                                this.select(true);
                            }
                            return this.__fixRange();
                        }
                    }
                    if (this.collapsed) {
                        this.collapse(true);
                    } else {
                        _end = start;
                        var tmpEnd = null;
                        while (_end) {
                            tmpEnd = _end;
                            _end = domUtil.getFilterTreeDom(_end, null, filter, true);
                        }
                        _end = tmpEnd;
                        tmpEnd = null;
                        if (_end && e != _end) {
                            end = _end;
                            eOfst = end.nodeValue.length;
                        }
                    }
                }
                _end = _start = null;
            }
            while (start.nodeType != 3 && start.childNodes.length > 0) {
                if (start.childNodes[sOfst]) {
                    start = start.childNodes[sOfst];
                    sOfst = 0;
                } else {
                    if (start.childNodes[sOfst - 1]) {
                        start = start.childNodes[sOfst - 1];
                        sOfst = start.nodeType == 1 ? start.childNodes.length : start.nodeValue.length;
                    } else {
                        if (start.nextSibling) {
                            start = start.nextSibling;
                            sOfst = 0;
                        } else {
                            start = start.lastChild;
                            if (start && start.nodeType == 3) {
                                sOfst = start.nodeValue.length;
                            } else {
                                sOfst = start.childNodes.length;
                            }
                        }
                    }
                }
            }
            if (collapsed) {
                if (start.nodeType == 3 && !noMerge) {
                    while ((prev = start.previousSibling) && start.previousSibling.nodeType == 3) {
                        sOfst += prev.nodeValue.length;
                        start.insertData(0, prev.nodeValue);
                        domUtil.remove(prev);
                    }
                    while ((next = start.nextSibling) && start.nextSibling.nodeType == 3) {
                        start.appendData(next.nodeValue);
                        domUtil.remove(next);
                    }
                }
                this.setStart(start, sOfst);
                start = null;
                this.collapse(true);
                if (!noSelect) {
                    this.select(true);
                }
                return this.__fixRange();
            } else {
                while (end.nodeType != 3 && end.childNodes.length) {
                    if (end.childNodes[eOfst]) {
                        end = end.childNodes[eOfst];
                        eOfst = 0;
                        //if (!end.previousSibling) {
                        //    var ancestor = this.getCommonAncestor();
                        //    while (!end.previousSibling && end != this.getCommonAncestor()) {
                        //        end = end.parentNode;
                        //    }
                        //}

                    } else {
                        end = end.lastChild;
                        if (end.nodeType == 3) {
                            eOfst = end.nodeValue.length;
                        } else {
                            eOfst = end.childNodes.length;
                        }
                    }
                    if (end.previousSibling && eOfst == 0) {
                        end = end.previousSibling;
                        if (end.nodeType == 3) {
                            eOfst = end.nodeValue.length;
                        } else {
                            eOfst = end.childNodes.length;
                        }
                    }

                }

                if (start.nodeType == 3 && !noMerge) {
                    var hasSame = false;
                    while ((prev = start.previousSibling) && start.previousSibling.nodeType == 3) {
                        sOfst += prev.nodeValue.length;
                        if (start == end) {
                            eOfst += prev.nodeValue.length;
                        }
                        start.insertData(0, prev.nodeValue);
                        domUtil.remove(prev);
                    }

                    while ((next = start.nextSibling) && start.nextSibling.nodeType == 3) {
                        if (next == end && !hasSame) {
                            end = start;
                            eOfst += start.nodeValue.length;
                            hasSame = true;
                        }
                        start.appendData(next.nodeValue);

                        domUtil.remove(next);

                    }
                }

                if (end.nodeType == 3 && end != start) {
                    while ((prev = end.previousSibling) && end.previousSibling.nodeType == 3) {
                        eOfst += prev.nodeValue.length;
                        end.insertData(0, prev.nodeValue);
                        domUtil.remove(prev);
                    }

                    while ((next = end.nextSibling) && end.nextSibling.nodeType == 3) {
                        end.appendData(next.nodeValue);
                        domUtil.remove(next);
                    }
                }
                this.setStart(start, sOfst);
                this.setEnd(end, eOfst);
                if (!noSelect) {
                    this.select();
                } else {
                    if (this.editor.selection.saveW3CInfo) {
                        this.editor.selection.saveW3CInfo(this);
                    }
                }
            }
            start = end = prev = next = null;

            return this.__fixRange();
        },

        /**
         *
         */
        surroundContents: function () {

        },

        /**
         *
         */
        collapseUpdate: function () {
            var self = this;
            self.collapsed = self.startContainer && self.endContainer && self.startContainer === self.endContainer && self.startOffset == self.endOffset;
        },

        /**、
         * 调整Range的start或end节点及offset
         * @param node
         * @param offset
         * @param toStart
         * @returns {Range}
         */
        relovseRange: function (node, offset, toStart) {
            var _tmpName = toStart ? 'start' : 'end', _otherName = toStart ? 'end' : 'start', self = this;

            self[_tmpName + 'Container'] = node;
            self[_tmpName + 'Offset'] = offset;
            if (!self[_otherName + 'Container']) {
                self.collapse(toStart);
            }
            self.collapseUpdate();
            return self;
        },
        //处理clone、delete、extra选区
        __proccessContents: function (action) {
            // 变量定义区
            var self = this, fragment = createFragment(), start = self.startContainer, end = self.endContainer, startOffset = self.startOffset, endOffset = self.endOffset, domUtil = self.domUtil, tmpStart, tmpEnd, resetAfterStart, txt, tmpNode;

            // 如果为折叠选区，直接返回
            if (this.collapsed) {
                return fragment;
            }

            function createFragment() {
                return self.doc.createDocumentFragment();
            }

            function getEndOffset(node) {
                return (3 === node.nodeType) ? node.nodeValue.length : node.childNodes.length
            }

            //console.log('start', start);
            if (start.nodeType === 1) {
                tmpNode = start.childNodes[startOffset];
                // <b>xxxx[</b>xdrer<i>xdr]</i> 
                // startContaner: b
                // startOffset: 1
                // 处理这种情况
                if (!tmpNode) {
                    tmpStart = domUtil.createText('[start]');
                    start.appendChild(tmpStart);
                }
                // 修正startContainer的offset
                startOffset = 0;
                start = tmpNode || tmpStart;
            }
            if (end.nodeType === 1) {
                tmpNode = end.childNodes[endOffset - 1];
                if (!tmpNode) {
                    // <b>xxxx[</b>xdrer<i>]xdr</i> 
                    // endContainer: i
                    // endOffset: 0
                    // 处理这种情况
                    tmpEnd = domUtil.createText('[end]');

                    if (end.firstChild) {
                        end.insertBefore(tmpEnd, end.firstChild);
                    } else {
                        end.appendChild(tmpEnd);
                    }
                }
                end = tmpNode || tmpEnd;
                // 修正endContainer的offset;
                endOffset = getEndOffset(end);

            }
            tmpNode = null;

            if (start == end) {
                // 开始节点与结束节点相同，并且为textnode节点时直接剪切
                if (start.nodeType == 3) {
                    txt = start.nodeValue;
                    // 不克隆node，如果<i>[abcd]</i>是这种情况，直接将TextNode节点插入
                    if (action && 0 == startOffset && txt.length == endOffset) {
                        tmpNode = start;
                        self.setStartBefore(start);
                    } else {
                        txt = txt.slice(startOffset, endOffset);
                        tmpNode = domUtil.createText(txt);
                        if (action) {
                            start.deleteData(startOffset, endOffset - startOffset);
                            self.setStart(start, startOffset);
                        }
                    }
                    if (action) {
                        self.collapse(true);
                        //self.select();
                    }
                    fragment.appendChild(tmpNode);
                    return fragment;
                } else {
                    tmpNode = !action ? start.cloneNode(true) : start;
                    if (action) {
                        self.setStartBefore(start);
                        self.collapse(true);
                        //self.select();
                    }
                    fragment.appendChild(tmpNode);
                    return fragment;
                }
            }

            // start == end 节点情况处理结束
            // ----------------------------------------------

            var startParents = domUtil.parents(start, !0).reverse(), endParents = domUtil.parents(end, !0).reverse(), current, len, clone = fragment, rootNode;

            for (var i = 0; startParents[i] == endParents[i];) {
                i++;
            }

            for (var j = i, si; si = startParents[j]; j++) {
                current = si.nextSibling;
                if (si == start) {
                    // 如果tmpStart存在则start == tmpStart 不用处理
                    if (!tmpStart) {
                        if (self.startContainer.nodeType == 3) {
                            txt = start.nodeValue;
                            // 不克隆node，如果<i>[abcd]</i>是这种情况，直接将TextNode节点插入
                            if (action && 0 == startOffset) {
                                self.setStartBefore(start);
                                clone.appendChild(start);
                            } else {
                                len = txt.length;
                                txt = txt.slice(startOffset, len);
                                clone.appendChild(domUtil.createText(txt));
                                if (action) {
                                    start.deleteData(startOffset, len - startOffset);
                                    self.setStart(start, startOffset);
                                }
                            }
                        } else {
                            self.setStartBefore(start);
                            clone.appendChild(action ? start : start.cloneNode(true));
                        }

                    }
                } else {
                    rootNode = si.cloneNode(false);
                    clone.appendChild(rootNode);
                }

                while (current) {
                    // 判断是否在同级
                    if (current === end || current === endParents[j]) {
                        break;
                    }
                    si = current.nextSibling;
                    clone.appendChild(action ? current : current.cloneNode(true));
                    current = si;
                }

                clone = rootNode;
            }

            // 重置clone节点将之重置到顶层
            clone = fragment;
            if (!startParents[i]) {
                clone.appendChild(startParents[i - 1].cloneNode(false));
                clone = clone.firstChild;
            }

            var resetEndBefore = end.nextSibling;
            var resetEndBeforePn = end.parentNode;

            for (var j = i, ei; ei = endParents[j]; j++) {
                current = ei.previousSibling;
                if (ei == end) {
                    // 如果tmpStart存在则start == tmpStart 不用处理
                    if (!tmpEnd) {
                        if (self.endContainer.nodeType == 3) {
                            txt = end.nodeValue;
                            len = txt.length;
                            // 不克隆node，如果<i>[abcd]</i>是这种情况，直接将TextNode节点插入
                            if (action && len == endOffset) {
                                clone.appendChild(end);
                            } else {
                                txt = txt.slice(0, endOffset);
                                clone.appendChild(domUtil.createText(txt));
                                if (action) {
                                    end.deleteData(0, endOffset);
                                }
                            }
                        } else {
                            clone.appendChild(action ? end : end.cloneNode(true));
                        }

                    }
                } else {
                    rootNode = ei.cloneNode(false);
                    clone.appendChild(rootNode);
                }
                if (j != i || !startParents[i]) {
                    while (current) {
                        // 判断是否在同级
                        if (current === start) {
                            break;
                        }
                        ei = current.previousSibling;
                        clone.insertBefore(action ? current : current.cloneNode(true), clone.firstChild);
                        current = ei;
                    }
                }
                clone = rootNode;
            }

            if (!endParents[i]) {
                tmpNode = endParents[i - 1].cloneNode(false)
                tmpNode.appendChild(clone);
                fragment = createFragment();
                fragment.appendChild(tmpNode);
            }

            if (action) {
                // 重置Range算法
                // 1、endContainer包含startContainer，则设置为endContainer之后
                // 2、startContainer包含endContainer，则设置为startContainer之前
                // 3、endContainer与startContainer无关，则设置为endContainer的父节点
                if (!endParents[i]) {
                    self.setEndAfter(endParents[i - 1]);
                    self.collapse();
                } else if (!startParents[i]) {
                    self.setStartBefore(startParents[i - 1]);
                    self.collapse(true);
                } else if (resetEndBefore) {
                    self.setEndBefore(resetEndBefore);
                    self.collapse();
                } else {
                    if (resetEndBeforePn === self.editor.body || (3 == end.nodeType)) {
                        self.setEnd(resetEndBeforePn, resetEndBeforePn.childNodes.length);
                    } else {
                        self.setEndAfter(resetEndBeforePn);
                    }
                    self.collapse();
                }

            }
            tmpStart && domUtil.remove(tmpStart);
            tmpEnd && domUtil.remove(tmpEnd);
            // console.log('剪切：', fragment);
            return fragment;
        },

        /**
         * 将编辑器的scrollTop移到距离光标的合适位置
         * scrollToCursor
         * @{return CursorY}
         */
        scrollToCursor: function (offset) {
            var bk = this.createBookMark('getY');
            bk.start.style.display = 'inline-block';
            var y = this.domUtil.getPos(bk.start).top + (offset || -300);
            this.moveToBookMark('getY');
            if (y < this.doc.body.scrollTop) {
                this.doc.body.scrollTop = y;
            }
            return y;
        },

        clearFillChar: function () {
            var curr = this.startContainer;
            while (curr = this.domUtil.getFilterTreeDom(curr, null, function (node) {
                return node.nodeType == 3 && !SinaEditor.noSpaceReg.test(node.nodeValue)
            }) && curr != this.endContainer) {
                range.removeNode(curr);
            }
            ;

        },

        __fixRange: function (rng) {
            rng = rng || this;
            if ($dtd.$empty[rng.startContainer.nodeName.toLowerCase()]) {
                rng.setStartBefore(rng.startContainer)
            }

            if ($dtd.$empty[rng.endContainer.nodeName.toLowerCase()]) {
                rng.setEndAfter(rng.startContainer)
            }

            return rng;
        }
    };
    return Range;
});
