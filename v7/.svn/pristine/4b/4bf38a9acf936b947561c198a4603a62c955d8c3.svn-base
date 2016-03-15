/**
 * 编辑器入口对象定义，包括创建、获取、注册编辑器
 */
;
(function (global, undef) {
    if (![].indexOf) {
        /**
         * 兼容Array的indexOf方法
         * @param arr
         * @param val
         * @returns {*}
         */
        Array.prototype.indexOf = function (val) {

            var obj, arr = this;
            for (var i = 0, len = arr.length; i < len; i++) {
                obj = arr[i];
                if (obj === val) {
                    return i;
                }
            }
            return -1;
        }
    }

    var __instance = [];

    var SinaEditor = {
        noSpaceReg: /[^ \t\n\r\u200B\uFEFF]/,
        spaceChar: '\uFEFF',
        editorId: 0,
        create: function (opts) {
            var self = this;
            var editor = new self.Editor(opts);
            self.add(editor);
            return editor;
        },
        get: function (id) {
            if ('string' === typeof id) {
                for (var i = 0, len = __instance.length; i < len; i++) {
                    if (id === __instance[i].id) {
                        return __instance[i];
                    }
                }
            } else {
                return __instance[id];
            }
        },
        add: function (editor) {
            __instance.push(editor);
        },
        regist: function (name, func) {
            var pkgs = name.split('.')
                , self = this
                , pkg
                , namespace = this;
            for (var i = 0, len = pkgs.length; i < len - 1; i++) {
                pkg = pkgs[i];
                if (namespace[pkg] === undef) {
                    namespace[pkg] = {};
                }
                namespace = namespace[pkg];
            }
            if (namespace[pkgs[i]] !== undef) {
                throw Error(name + ' is defined!')
            } else {
                namespace[pkgs[i]] = func.call(self, self);
            }
        }
    };

    global.SinaEditor = SinaEditor;
})(window);

