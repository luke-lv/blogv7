;
(function (win) {
    var TestTools = function () {
    };
    TestTools.prototype = {
        setSelection: function (o) {
            var sel = editor.selection;
            if ('string' == typeof o) {
                o = editor.domUtil.$(o, editor.body)[0];
            }
            var rng = sel.createRange();
            rng.selectNode(o);
        },
        setContent: function (html) {
            editor.setContent(html);
        }
    }

    win.TestTools = new TestTools();
})(window);
