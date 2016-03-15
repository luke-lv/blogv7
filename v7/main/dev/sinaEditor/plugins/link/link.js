/*
 * 注册link插件
 */
SinaEditor.PluginManager.register('link', function (options, editor) {
    editor.registerCmd('link', {
        queryCommandState: function (cmd, rng, elementPath) {
            var state = !1;
            editor.domUtil.each(elementPath, function (i, item) {
                if ('A' === item.nodeName.toUpperCase()) {
                    state = !0;
                    return false;
                }
            });
            return state;
        },
        exec: function (cmd, opt) {
            // console.log('添加链接：',opt.url);
            var rng = editor.getRange();
            var ancestor = rng.getCommonAncestor();
            if (3 == ancestor.nodeType) {
                ancestor = ancestor.parentNode;
            }
            if (0 !== editor.domUtil.$('a', ancestor).length) {
                rng.removeInlineTag('a');
            }
            rng.insertInlineTag('a', {href: opt.url, target: '_blank'});
        }
    });

    editor.registerCmd('unlink', {
        exec: function (cmd) {
            var rng = editor.getRange();
            rng.removeInlineTag('a');
        }
    });

});
