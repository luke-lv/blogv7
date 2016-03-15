/**
 * 初始化内容插件
 *
 */
SinaEditor.PluginManager.register('initIframeContent', function (opt, editor) {
    var self = this;
    var time = +new Date;
    opt = Util.extend({
        iframeId: 'SinaEditor_iframe_' + time,
        formId: 'SinaEditor_form_' + time,
        doctype: '<!DOCTYPE html>',
        contentCSS: []
    }, opt, editor.options);

    editor.on('frameloaded', function (e) {
        editor.win = self.iframe[0].contentWindow;
        editor.doc = self.iframe[0].contentWindow.document;
        editor.domUtil = new DOMUtil(editor.doc, editor.win);
        editor.selection = new Selection(editor.doc, editor);
        editor.body = editor.doc.body;
        e.undo = true;
        //加载插件
        editor.fire('contentOnLoaded');
    });

    var DOM = new DOMUtil();
    var box = editor.opts.root;
    if ('string' === typeof(box)) {
        box = DOM.$(box)[0];
    }
    if (!box) {
        console.log('没有根节点');
        return;
    }
    var iframeId = opt.iframeId;
    var html = '<iframe';

    var iframeurl = 'javascript:""', url;
    if (document.domain != location.hostname) {
        iframeurl = url = ['javascript:(function(){', 'document.open();document.domain=\'' + document.domain + '\';',
                'var ed = parent.window.SinaEditor.get(\'' + editor.id + '\');', 'document.write(ed.iframeHtml);',
            'document.close();', '})();'].join('');
    }
    html += ' src="' + iframeurl + '" id="' + iframeId + '"' + 'width="100%" height="100%" scroll="no" frameborder="0"></iframe>';

    var iframeHtml = opt.doctype;
    iframeHtml += '<html><head>';
    var cssUrl;
    for (var i = 0, len = opt.contentCSS.length; i < len; i++) {
        cssUrl = opt.contentCSS[i];
        iframeHtml += '<link type="text/css" rel="stylesheet" href="' + cssUrl + '" />';
    }
    iframeHtml += '</head><body onload="setTimeout(function(){var ed=parent.window.SinaEditor.get(\'' + editor.id + '\');ed.fire(\'frameloaded\');},0);" designMode="on" contentEditable="true"></body></html>';
    self.iframeHtml = iframeHtml;

    // box.html(html);
    DOM.html(box, html);
    self.iframe = DOM.$('#' + iframeId);
    if (!url) {
        var doc = self.iframe[0].contentWindow.document;
        doc.open()
        doc.write(self.iframeHtml);
        doc.close();
    }

});
