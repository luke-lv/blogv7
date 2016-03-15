;(function (SE) {
    /**
     * IE6-8的range兼容性问题处理
     * @author wangqiang luying1
     * @date 14/10/23
     */
    if (!SinaEditor.env.$belowIe9) {
        return;
    }
    var Util = SE.Util;
    Util.mix(SE.Range.prototype, {
        select: function (nofillChar) {
            var nativeRange, collapsed = this.collapsed, startContainer = this.startContainer, fillChar = SE.spaceChar;
            if (!collapsed) {
                this.shrinkBoundary();
            }
            var bookmark = this.createBookMark(), start = bookmark.start, tmpText, end;
            nativeRange = this.editor.selection.getNativeRange();
            // controlrange的情况
            if (!nativeRange.duplicate) {
                nativeRange = this.doc.body.createTextRange();
            }
            nativeRange.moveToElementText(start);
            if (!collapsed) {
                var nativeRangeEnd = this.doc.body.createTextRange();
                end = bookmark.end;
                nativeRangeEnd.moveToElementText(end);
                nativeRange.setEndPoint('EndToEnd', nativeRangeEnd);
            } else {
                var isElementNode = startContainer.nodeType !== 3;
                if (!nofillChar && isElementNode) {
                    //使用<span>|x<span>固定住光标
                    var tmp = this.doc.createElement('span');
                    tmp.appendChild(this.doc.createTextNode(fillChar));
                    start.parentNode.insertBefore(tmp, start);
                    nativeRange.moveToElementText(tmp);
                    //mergeSibling(tmp, 'previousSibling');
                    //mergeSibling(start, 'nextSibling');
                    nativeRange.moveStart('character', 1);
                    nativeRange.collapse(true);
                    // 处理ie空标签不能被选中的问题
                } else if (isElementNode && startContainer.hasChildNodes() && startContainer.childNodes.length == 1 && startContainer.childNodes[0] == start) {
                    tmpText = this.doc.createTextNode(fillChar);
                    startContainer.appendChild(tmpText);
                    nativeRange.moveToElementText(startContainer);
                    nativeRange.moveStart('character', 1);
                    nativeRange.collapse(true);
                }
            }
            this.removeBookMark(bookmark);
            try {
                nativeRange.select();
                if (nofillChar && tmpText) {
                    startContainer.removeChild(tmpText);
                }
            } catch (e) {
            }
            this.editor.selection.saveNative();
            return this;
        }
    });
})(SinaEditor);
