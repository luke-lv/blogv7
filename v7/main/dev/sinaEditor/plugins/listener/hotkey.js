/**
 * 编辑器快捷键插件。
 * @author : luying1@staff
 */
;
(function (SE) {
    var Util = SE.Util, VK = SE.VK;

    var word2num = {};
    var word = 0;
    for (; word <= 9; word++) {
        word2num[word] = 48 + word;
    }
    word = 97;
    var end = 97 + 26
    for (; word < end; word++) {
        word2num[String.fromCharCode(65 + word - 97)] = 65 + word - 97;
        word2num[String.fromCharCode(word)] = 65 + word - 97;
    }
    /**
     * ''
     */
    function keySort(key) {

        var sort = {
            ctrl: 1,
            alt: 2,
            shift: 3
        };
        var keys = key.toLowerCase().split(/\s*\+\s*/g);
        keys.sort(function (a, b) {
            if (sort[a] && sort[b]) {
                if (sort[a] > sort[b]) {
                    return 1;
                } else if (sort[a] < sort[b]) {
                    return -1;
                } else {
                    return 0;
                }
            }
            return 0;
        });
        var keyCode = keys[keys.length - 1];
        if (word2num[keyCode]) {
            keys[keys.length - 1] = word2num[keyCode];
        }
        return keys.join('+');
    }

    function HotkeyManager(options, editor) {
        var me = this, keylist = [];
        me.hashKeys = {};
        me.options = Util.extend({
            keylist: [
                {
                    exec: 'bold',
                    params: null,
                    hotkeys: ['ctrl+alt+66', 'ctrl+66']
                }
            ]
        }, options);
        keylist = me.options.keylist;

        me.registerHotkey(keylist);
        editor.on('ready', function () {
            me.clickInit();
        })
    }

    HotkeyManager.prototype.getExecByEvent = function (e) {
        var me = this, hashKeys = me.hashKeys, key = '', keyCode = e.keyCode || e.which;
        if (e.ctrlKey || (SinaEditor.env.mac && e.metaKey)) { //mac的command键视为ctrl
            key += 'ctrl+';
        }

        if (e.altKey) {
            key += 'alt+';
        }

        if (e.shiftKey) {
            key += 'shift+';
        }

        key += word2num[keyCode] || keyCode;
        return hashKeys[key] || null;
    };

    HotkeyManager.prototype.clickInit = function () {
        var me = this;
        editor.on('keydown', function (evt, e) {
            if (VK.modifierPressed(e) || VK.metaKeyPressed(e)) {
                var execCommand = me.getExecByEvent(e);
                if (execCommand) {
                    e.preventDefault();
                    var exec = 'function' === typeof execCommand.exec ? execCommand.exec.call(editor) : execCommand.exec;
                    if (exec && typeof exec == 'string') {
                        var params = 'function' === typeof execCommand.params ? execCommand.params.call(editor) : execCommand.params;
                        editor.exec(exec, params);
                    }

                }
            }
        });
    };

    HotkeyManager.prototype.registerHotkey = function (keylist) {
        var me = this;
        if (!Util.isArray(keylist)) {
            keylist = [keylist];
        }
        for (var key = 0; key < keylist.length; key++) { //序列化热建
            var hotkey = keylist[key].hotkeys;
            if ('string' == typeof hotkey) { //TODO: 增加热键冲突判断
                me.hashKeys[keySort(hotkey)] = keylist[key];
            } else if (Util.isArray(hotkey)) {
                for (var k = 0; k < hotkey.length; k++) {
                    me.hashKeys[keySort(hotkey[k])] = keylist[key];
                }
            }
        }
    }
    SE.PluginManager.register('hotkey', HotkeyManager);
})(SinaEditor);
