/**
 * 初始化DIV作为容器的编辑器
 *
 */
SinaEditor.PluginManager.register('initDivContent', function (opt, editor) {
    var SE = SinaEditor, Util = SE.Util, DOMUtil = SE.DOMUtil, Selection = SE.Selection, self = this, time = +new Date;
    opt = Util.extend({
        id: 'SinaEditor_' + time,
        formId: 'SinaEditor_form_' + time,
        clz: '' // 样式
    }, opt, editor.options);

    var domUtil = new DOMUtil();
    var box = editor.opts.root;
    if ('string' === typeof(box)) {
        box = domUtil.$(box)[0];
    }
    if (!box) {
        // console.log('没有根节点');
        return;
    }
    domUtil.attr(box, 'contentEditable', 'true');
    domUtil.addClass(opt.clz);
    editor.win = window;
    editor.doc = document;
    editor.body = box;
    editor.domUtil = new DOMUtil(editor.doc, editor.win, box);
    editor.selection = new Selection(editor.doc, editor);
    //加载插件
    editor.fire('contentOnLoaded');
});
