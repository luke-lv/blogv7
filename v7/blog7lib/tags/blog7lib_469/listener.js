$import("lib/lib.js");
$import("lib/register.js");
/**
 * @fileoverview 
 * 全局通信消息，主要用于页面模块之间的信息传递
 * @create 2012-08-13
 * @author Qiangyee | wangqiang1@staff
 */
Lib.register("Listener", function(){
    var _this = {};
    _this.listeners = {};
    return {
        /**
         * 添加消息
         * @param name 消息名称
         */
        add : function(name){
            if (_this.listeners[name]) {
                throw new Error("listener '"+name+"' has registed!")
            }
            _this.listeners[name] = [];
        },
        /**
         * 移除消息
         * @param name 消息名称
         */
        remove : function(name){
            if (_this.listeners[name]) {
                _this.listeners[name] = null;
                return true;
            }
            return false;
            
        },
        /**
         * 通知对此消息感兴趣的各监听函数
         * @param name 消息名称
         * @param data 消息传人数据
         */
        notify : function(name, data){
            var listeners = _this.listeners[name],
                handle = null;
            if (!listeners) {
                //console.log("Lib.listener->notify: listener " + name + " does not define!");
                return;
            };
            
            for (var i = 0, len = listeners.length; i < len; i++) {
                handle = listeners[i];
                // try{
                    handle.callBack.call(handle.scope, data);
                // }catch(e){
                    // console.log("Lib.listener->notify: call listener callback function " 
                    // + handle.callBack + " failure!");
                    // console.log(e.message);
                // }
                
            };
        },
        /**
         * 为某一消息增加监听消息函数<br>
            <code>
                var like = function(count){
                    //TODO 显示有多少条喜欢数
                }
                var navUpdate = function(data){
                    //TODO 更新头部
                }
                var listener = Lib.Listener;

                listener.on({
                        name     : "nav-fancy",
                        callBack : function(data){
                            like(data.count);
                        },
                        scope    : this
                    }, {
                        name     : "global-login",
                        callBack : function(data){
                            navUpdate(data);
                        },
                        scope    : this
                    });
            </code>
         * @param {Object} ... {name:"xxx", callBack:func, scope:xxx}
         */
        on : function(o){
            var args = arguments,
                handle = null;
            for (var i = 0, len = args.length; i < len; i++) {
                handle = args[i];
                if (!this.isListen(handle)) {
                    if (!_this.listeners[handle.name]) {
                        _this.listeners[handle.name] = [];
                    }
                    _this.listeners[handle.name].push(handle);
                }
            }
        },
        /**
         * 为某一消息取消监听消息函数<br>
            <code>
                var like = function(count){
                    //TODO 显示有多少条喜欢数
                }
                var navUpdate = function(data){
                    //TODO 更新头部
                }
                var listener = Lib.listener;
                listener.add("nav-fancy");
                ...
                var func = function(data){
                            like(data.count);
                        };
                listener.on({
                        name     : "nav-fancy",
                        callBack : func,
                        scope    : this
                    });
                ...
                listener.notify("nav-fancy", data);
                ...
                listener.off({
                        name     : "nav-fancy",
                        callBack : func,
                        scope    : this
                    });
            </code>
         * @param {Object} ... {name:"xxx", callBack:func, scope:xxx}
         */
        off : function(o){
            var handlers = _this.listeners[o.name];
            if (!handlers) {
                return true;
            }

            var handle = null;
            for (var i = 0, len = handlers.length; i < len; i++) {
                handle = handlers[i];
                if (handle.callBack == o.callBack 
                    && handle.scope == o.scope) {
                    handlers.splice(i, 1);
                }
            }
        },
        /**
         * 查询是否监听某一消息
         * @param {JSON} listener  name消息名称， callBack回调函数， scope回调函数作用域
         * @return {Boolean} 
         */
        isListen : function(listener){
            var handlers = _this.listeners[listener.name];
            var handle = null;
            if (!handlers) {
                return false;
            }

            for (var i = 0, len = handlers.length; i < len; i++) {
                handle = handlers[i];
                if (handle.callBack == listener.callBack 
                    && handle.scope == listener.scope) {
                    return true;
                }
            }
            return false;
        }
    }
});

