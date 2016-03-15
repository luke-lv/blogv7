/*
 *
 * 用户行为suda统计插件
 * @author luying1@staff
 * @依赖新浪包的sendLog
 */

SinaEditor.PluginManager.register('suda', function (options, editor) {
    var cmds = options.cmds || {
        bold: '16_01_01',
        italic: '16_01_02',
        underline: '16_01_03',
        title: {
            'h1': '16_01_04',
            'h2': '16_01_05'
        },
        justify: {
            'left': '16_01_06',
            'center': '16_01_07',
            'right': '16_01_08'
        },
        link: '16_01_09',
        unlink: '16_01_09',
        color: '16_01_10',
        resetcolor: '16_01_10'

    };
    editor.ready(function () {
        editor.on('execcommand', function (e, data) {
            var sudaid = cmds[data.cmdName];
            if (!sudaid) {
                return;
            }
            if ('string' != typeof sudaid) {
                sudaid = sudaid[data.data];
            }
            if (!sudaid) {
                return;
            }
            if (window.v7sendLog) {
                v7sendLog(sudaid);
            }

          
        });
    });

})
