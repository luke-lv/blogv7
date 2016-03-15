SinaEditor.PluginManager.register('enterkey', function (options, editor) { //TODO : 只做了p的并不兼容ＩＥ

    var SE = SinaEditor, VK = SE.VK, Util = SE.Util;

    var tag = options.tagName || 'p', allowTags = ['br', 'p'];

    function replaceEnterTag(tag) {
        var dom = editor.domUtil, noDoList = ['ul', 'ol', 'dl', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
        if (!Util.inArray(allowTags, tag)) {
            return;
        }
        var range = editor.selection.getRange(true);
        //range.shrinkBoundary();
        var start = range.startContainer, offset = range.startOffset;
        //if (range.collapsed && start.nodeType !== 3) {
        //    var child;
        //    if ((child = start.childNodes[0]) && child.nodeType == 1 && child.tagName == 'BR') {
        //        child.parentNode.removeChild(child);
        //    }
        //}
        if (start.nodeType == 1) {
            start = start.childNodes[offset];
        }
        if (start && dom.isSpecificParent(start, noDoList)) {
            if (start.nodeType == 3 && offset === start.nodeValue.length) {
                var tmpTxt = editor.doc.createTextNode('\u200b');
                start.parentNode.appendChild(tmpTxt);
            }
            return;
        }
        if (start && start.nodeType == 1 && start.tagName == 'BR') {

        }
        editor.doc.execCommand('formatBlock', false, '<' + tag + '>');
        var node = range.startContainer;
        if (node.childNodes.length == 1 && node.childNodes[0].nodeType == 1 && node.childNodes[0].tagName == 'BR') {
            var space = editor.doc.createTextNode('\u200B');
            node.insertBefore(space, node.childNodes[0]);
            node.removeChild(node.childNodes[1]);
        }
    }

    editor.on('keydown', function (e, evt) {
        if (evt.keyCode == VK.ENTER) {
            evt = editor.domUtil.fixEvent(evt);
            if (false !== editor.fire('beforeenter', evt)) {
                replaceEnterTag(tag);
                window.setTimeout(function () {
                    var rng = editor.getRange(true).cloneRange();
                    rng.boundaryToBlock();
                    var block = rng.startContainer;
                    if (block && block != editor.domUtil.body) {
                        block.style.cssText = '';
                        if (/h\d/gi.test(block.tagName)) {
                            editor.doc.execCommand('formatBlock', false, '<p>');
                        }
                    }
                    editor.fire('afterenter', evt);
                    editor.fire('undosave', true, true);
                }, 0)

            } else {
                evt.preventDefault();
            }
        }
    });

});
