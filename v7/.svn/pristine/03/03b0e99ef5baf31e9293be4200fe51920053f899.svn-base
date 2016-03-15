/**
 * 自定义事件
 * @author luying
 * @author wangqiang 2014-12-05 添加取消事件绑定功能
 */
SinaEditor.regist('Event', function (SE) {
    var util = SE.Util;
    /**
     * 自定义事件
     * @module Event
     * @constructor
     */
    var Event = function () {
        this.__Events = {};
        this.__hasFire = {};
    }
    Event.prototype = {
        constructor: Event,
        /**
         * 触发事件
         * @param {Object} object 事件处理函数的作用域
         * @param {String} evtName   事件名称
         * @param {Object} data   传入的数据
         */
        fire: function (object, evtName, data) {
            evtName = evtName.toLowerCase();
            var funcs = this.__Events[evtName] || [];
            var datas = Array.prototype.slice.apply(arguments, [2]);
            var returnValue;
            for (var a = 0; a < funcs.length; a++) {
                var item = funcs[a], e = {};
                if (typeof item != 'function') {
                    continue;
                }
                e.returnValue = true;
                e.event = evtName;
                e.undo = false;
                var params = datas.concat([]);
                params.unshift(e);
                if (returnValue === false) {
                    item.apply(object || this, params);
                } else {
                    returnValue = item.apply(object || this, params);
                }

//				returnValue = item.apply(object || this, params);
//				if (false === returnValue) {
//					return returnValue;
//				}
                if (e.undo === true) {
                    this.__Events[evtName][a] = undefined;
                    this.__Events[evtName].splice(a, 1);
                    a--;
                }
                if (e.returnValue === false) {
                    break;
                }
            }
            this.__hasFire[evtName] = arguments;
            return returnValue;
        },
        /**
         * 绑定事件
         * @param {String} evtName  事件名称
         * @param {Function} func    事件处理函数
         * @param {Boolean} isFirst  处理函数是否添加在最前面
         * @returns {*}
         */
        bind: function (evtName, func, isFirst) {
            evtName = evtName.toLowerCase();
            var names = evtName.split(' ');
            for (var i = 0; i < names.length; i++) {
                var name = names[i];
                if (!this.__Events[name]) {
                    this.__Events[name] = [];
                }

                if (isFirst && this.__hasFire[name]) {
                    if (typeof func === 'function') {
                        var e = {};
                        e.returnValue = true;
                        e.event = name;
                        e.undo = false;
                        var object = this.__hasFire[name][0] || this;
                        var data = this.__hasFire[name], datas = [];
                        if (data) {
                            datas = Array.prototype.slice.apply(data, [2, data.length]);
                        }
                        datas.unshift(e);
                        func.apply(object, datas);
                        if (e.undo !== true) {
                            this.__Events[name].unshift(func);
                        }
                    }
                } else {
                    this.__Events[name].unshift(func);
                }
            }

        },
        unbind: function (evtName, func) {
            var funcs = this.__Events[evtName] || [];
            var i = util.arrayIndexOf(funcs, func);
            if (i > -1) {
                funcs.splice(i, 1);
            }
        },
        /**
         * 绑定事件
         * @param {String} name  事件名称
         * @param {Function} func    事件处理函数
         * @param {Boolean} isFirst  处理函数是否添加在最前面
         * @returns {*}
         */
        on: function (evtName, func, isFirst) {
            return this.bind(evtName, func, isFirst);
        },
        /**
         *
         * @param naevtNameme
         * @param func
         * @returns {*}
         */
        off: function (naevtNameme, func) {
            return this.unbind(evtName, func);
        }
    }

    return Event;
});
