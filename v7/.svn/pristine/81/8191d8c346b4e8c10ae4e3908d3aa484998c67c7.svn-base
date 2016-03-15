SinaEditor.PluginManager.register('titleBtn', function (options, editor) {

    // 初始化按钮事件
    var toolBars = [];
    ;
    var tags = ['h1', 'h2'];
    for (var i = 0; i < tags.length; i++) {
        var tag = tags[i];
        (function (al) {
            var tag = al;
            editor.on('toolbar.selectionchange', function (e, rng, path, toolbar) {
                var getBtn = function (tag) {
                    return toolbar.getButton('title_' + tag + '_btn');
                };
                var btn = getBtn(tag);
                var actived = !editor.queryCommandState('title', rng, tag);
                //var actived = btn.actived;
                if (actived) {
                    btn.normal();
                } else {
                    if (actived == -1) {
                        //btn.disable();    
                    } else {
                        btn.active();
                    }
                }
            })
            editor.on('toolbar.title_' + al + '_btn.click', function (e, toolbar) {
                var btn = toolbar.getButton('title_' + al + '_btn');
                editor.exec('title', al);
            });
        })(tag)

        toolBars.push({
            id: 'title_' + tag + '_btn',
            name: 'title_' + tag + '_btn',
            exec: 'title',
            tooltip: '',
            activeCls: 'hovered'
        })
    }
    return {
        toolBars: toolBars
    }
});
