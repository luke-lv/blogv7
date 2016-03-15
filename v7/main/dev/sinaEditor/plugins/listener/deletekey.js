SinaEditor.PluginManager.register('deletekey', function (options, editor) {
    var SE = SinaEditor, VK = SE.VK, BACKSPACE = VK.BACKSPACE, DELETE = VK.DELETE, env = SE.env, spaceCharCode = SE.spaceChar.charCodeAt(0);

    function resoleDelete(isDelete) {
        var range = editor.getRange(true);
        var start = range.startContainer;
        var startOffset = range.startOffset;
        if (startOffset == 0 && start.parentNode == editor.domUtil.body && editor.domUtil.body.firstChild == start) {
            if (!range.collapsed) {
                range.deleteContents();
            }
            var tmpRange = range.cloneRange();
            tmpRange.boundaryToBlock();
            if (tmpRange.startContainer != editor.domUtil.body) {
                tmpRange.startContainer.style.cssText = '';
                if (tmpRange.startContainer.tagName != 'p') {
                    editor.doc.execCommand('formatBlock', false, '<p>');
                }
                var node = editor.doc.createTextNode(SinaEditor.spaceChar);
                tmpRange.setStart(editor.body.firstChild, 0);
                tmpRange.insertNode(node);
                tmpRange.collapse(true);
                tmpRange.select(true);
            }
            return true;
        } else {

            if (env.$belowIe9 ) {//哎!
                if (!range.collapsed) {
                    range.createBookMark('tmp_ie');
                    range.deleteContents();
                    range.removeBookMark('tmp_ie');
                    range.select(true);
                    return true;
                } else {
//                    debugger
                    range.createBookMark('tmp_ie');
                    range.removeBookMark('tmp_ie');
                    range.select(true);
//                    console.log('sdfasdfasdf');
                }
            }

        }
        return false;
    }

    editor.on('keydown', function (e, nativeEvent) {

        nativeEvent = editor.domUtil.fixEvent(nativeEvent);
        var keyCode = nativeEvent.keyCode || nativeEvent.which, result;
        var isDelete = keyCode == DELETE;
        if (keyCode == BACKSPACE || isDelete) {
            result = editor.fire('beforedelete', nativeEvent);
            if (false !== result) {

                if (resoleDelete(isDelete)) {
                    nativeEvent.preventDefault();
                }
                //editor.fire('afterdelete', nativeEvent);
            } else {
                nativeEvent.preventDefault();
            }
//            console.log('keydown:', nativeEvent.target.outerHTML);
//            console.log('keydown:', nativeEvent.target.nodeName, ' ', nativeEvent.target.id);
        }

    });

    editor.on('keyup', function (e, nativeEvent) {

        nativeEvent = editor.domUtil.fixEvent(nativeEvent);
        var keyCode = nativeEvent.keyCode || nativeEvent.which;
        var isDelete = keyCode == DELETE;
        if (keyCode == BACKSPACE || isDelete) {
//            trace('keyup:', nativeEvent.target.outerHTML);
//            trace('keyup:', nativeEvent.target.nodeName, ' ', nativeEvent.target.id);
        }
    });

});
