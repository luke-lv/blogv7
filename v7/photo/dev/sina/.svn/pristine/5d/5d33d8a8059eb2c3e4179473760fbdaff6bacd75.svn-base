
$import("sina/core/system/pageSize.js");
$import("sina/core/system/parseParam.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/removeEvent.js");
$import("sina/core/function/bind2.js");


Utils.scrollLoad = (function () {

    var __pageSize = Core.System.pageSize;
    var __parseParam = Core.System.parseParam;
    var __addEvent = Core.Events.addEvent;
    var __removeEvent = Core.Events.removeEvent;

    var scrollLoad = {

        __options: {

            pixelFromBottom: 450,

            action: null,

            maxLoadTime: 1 
        },

        __currentLoadTime: 0,

        __isListening: false,

        __handlerEvt: null,

        isReachMaxTime: false,

        init: function(options){
            if (!options || typeof options.action !== 'function'){
                return;
            }
            __parseParam(this.__options, options);
            
            var __this = this;
            this.__handlerEvt = function(){
                __this.scrollCheck();
            }
            this.startMonitoring();
        },

        startMonitoring: function(){
            if (this.__isListening){
                return;
            }
            if (this.__currentLoadTime <= this.__options.maxLoadTime){
                this.__isListening = true;
                __addEvent(window, this.__handlerEvt, 'scroll');
            }
        },

        scrollCheck: function(){
            var pageHeight = __pageSize()[1],
                winBottom = __pageSize()[3] + (document.body.scrollTop || document.documentElement.scrollTop);

            var cantAction = (pageHeight-winBottom) > this.__options.pixelFromBottom;

            if (cantAction){
                return;
            }

            this.__currentLoadTime++;

            if (this.__currentLoadTime === this.__options.maxLoadTime){
                this.isReachMaxTime = true;
            }

            this.__isListening = false;


            __removeEvent(window, this.__handlerEvt, 'scroll');

            // if (this.__currentLoadTime <= this.__options.maxLoadTime){
            this.__options.action(this);
            // }
        },

        clearLoadTime: function(){
            this.__currentLoadTime = 0;
            this.isReachMaxTime = false;
        }

    }

    return scrollLoad;
})();