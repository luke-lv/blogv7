/**
 * Quirks.js
 *
 * Copyright, Moxiecode Systems AB
 * Released under LGPL License.
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 *
 * @ignore-file
 */
SinaEditor.regist('Quirks', function (SE) {
    var env = SE.env, VK = SE.VK;

    /**
     *
     * 处理浏览器兼容性问题, 在插件与输入文字区域初始化完成后初始化
     * @class SinaEditor.utile.Quirks
     */
    function Quirks(editor) {

        var domUtil = editor.domUtil;
        var body = editor.body;

        // 阻止control range被选中
        function controlselectHandler(evt) {
            evt = domUtil.fixEvent(evt)
            evt.preventDefault();
        }

        domUtil.on(body, 'mscontrolselect', controlselectHandler);

        function indicateSpan(e, nativeEvent) {
            var spans = domUtil.$('span', editor.body);
            domUtil.each(spans, function (i, span) {
                domUtil.attr(span, 'se-mark', '1')
            });
            var keyCode = nativeEvent.keyCode || nativeEvent.which;

            var isDelete = keyCode == VK.DELETE;

            // Do the backspace/delete action
            editor.getDoc().execCommand(isDelete ? 'ForwardDelete' : 'Delete', false, null);

            return false;
        }

        function removeSpan(e, nativeEvent) {

            var spans = domUtil.$('span', editor.body);
            domUtil.each(spans, function (i, span) {
                if (!domUtil.attr(span, 'se-mark')) {
                    domUtil.each(span.childNodes, function (i, node) {
                        domUtil.insertBefore(node, span);
                    });
                    span.parentNode.normalize();
                    domUtil.remove(span);
                }

            });
            domUtil.removeAttr(spans, 'se-mark');
        }



        // 处理chrome删除后多出的span标签
        // https://github.com/tinymce/tinymce/commit/8e6422aefa9b6cc526a218559eaf036f1d2868cf
        if (env.$webkit) {
            editor.on('beforedelete', indicateSpan);
            editor.on('afterdelete', removeSpan);
        }

        if (env.$msie || env.$firefox) {
            // 处理选中widget后按backspace键，页面回退的问题
            domUtil.on(editor.body, 'keydown', function(evt){
                var keyCode = evt.keyCode || evt.which;
                var activeElement = document.activeElement;
                if (keyCode == VK.BACKSPACE && domUtil.contains(editor.body, activeElement)) {
                    var pns = domUtil.parents(activeElement, true);
                    domUtil.each(pns, function(i, node){
                        if (domUtil.attr(node, 'se-widget')) {
                            evt.preventDefault();
                            return false;
                        }
                    });

                }
            });
        }



    }

    return Quirks;
});
