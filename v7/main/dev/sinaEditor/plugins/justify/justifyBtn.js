SinaEditor.PluginManager.register('justifyBtn', function (options, editor) {
    // 初始化按钮事件
    var toolBars = [
        {
            type: 'group',
            name: 'justify',
            activeCls: 'hovered',
            buttons: []
        }
    ];

    var aligns = ['left', 'center', 'right'];
    for (var i = 0; i < aligns.length; i++) {
        var align = aligns[i];
        (function (align) {
            editor.on('toolbar.justify_' + align + '_btn.click', function (e, toolbar) {
                var btn = toolbar.getButton('justify_' + align + '_btn');
                if (!btn.actived) {
                    editor.exec('justify', align);
                }
            });
        })(align)
        toolBars[0].buttons.push({
            id: 'justify_' + align + '_btn',
            name: 'justify_' + align + '_btn',
            exec: 'justify',
            tooltip: '',
            activeCls: 'hovered'
        });
    }

    editor.on('toolbar.selectionchange', function (e, rng, path, toolbar) {
        //TODO:这里是分组，互斥关系。其实只需queryCommandState一次就可以了。后期优化.
        var btn = toolbar.getButton('justify');
        var align = editor.queryCommandState('justify', rng);
        if (align !== -1) {
            btn.active('justify_' + align + '_btn');
        }
    });

    return {
        toolBars: toolBars
    }
});
