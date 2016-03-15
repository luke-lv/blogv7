SinaEditor.regist('Timer', function (SE) {
    var Timer = function () {

    };

    Timer.prototype = {
        funcs: [],

        timer: null,

        push: function (fn) {
            this.funcs.push(fn);
        },

        init: function (delay) {
            var me = this;
            if (me.timer) {
                window.clearInterval(me.timer);
            }

            window.setInterval(function () {
                var i = me.funcs.length;
                for (; i > 0; i--) {
                    if (typeof me.funcs[i] != 'function') {
                        continue;
                    }
                    if (false === me.funcs[i].apply(me, arguments)) {
                        break;
                    }
                    ;
                }
            }, delay || 100);

        }

    }

    return Timer;
});

