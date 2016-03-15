/**
 * 定义键盘keycode
 * @type SinaEditor.VK
 */
SinaEditor.regist('VK', function (SE) {
    var VK = {
        BACKSPACE: 8,
        DELETE: 46,
        DOWN: 40,
        ENTER: 13,
        LEFT: 37,
        RIGHT: 39,
        SPACEBAR: 32,
        TAB: 9,
        UP: 38,
        COMMOND: 91,
        modifierPressed: function (e) {
            return e.shiftKey || e.ctrlKey || e.altKey;
        },

        metaKeyPressed: function (e) {
            // Check if ctrl or meta key is pressed also check if alt is false for Polish users
            return (SE.env.mac ? e.ctrlKey || e.metaKey : e.ctrlKey) && !e.altKey;
        }
    };
    return VK;
});
