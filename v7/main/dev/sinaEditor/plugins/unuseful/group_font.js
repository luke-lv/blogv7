PluginManager.register('group_font', function (options, editor) {

    var toolBar = editor.toolBar, event = toolBar.event, domUtil = new DOMUtil();

    options = Util.extend({
        html: '<button role="" class="">加粗</button>'
    }, options);
    var btn = new Button(options);
    toolBar.add(btn);

    function setState(data) {
        var state = editor.queryCommandState('bold', data);
        if (state === 1) {
            btn.active();
        } else if (state === 0) {
            btn.normal();
        } else if (state === -1) {
            btn.disable();
        }
    };

    function onClick(e) {

    };

    event.bind('toolbar.selectionchange', function (e, data) {
        setState(data);
    });

    event.bind('toolbar.click', function (e, data) {
        setState(data);
        onClick();
    });

});
