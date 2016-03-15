/** 
 * @fileoverview 处理事件的对象
 * @author Book | liming9@staff.sina.com.cn
 * @create 2012-08-11
 * @forcopy $import("sina/Evter.js");
 */
$import('sina/core/events/addEvent.js');

/**
 * 处理事件的对象
 * @Object
 * @example
        //定义事件‘funcName’
        //eTarget, event, eSource等参数根据需要可选
        Evter.add('funcName', function(eTarget, event, eSource){
            trace('funcName has been called.');
        });
        
        //手动触发事件‘otherFunc’
        Evter.fire('otherFunc', etar, esrc, event);
        //也可以最简单的方式触发
        Evter.fire('otherFunc');
 */
!function(window){
    if(window.Evter){
         //traceError('Evter has been defined!');
         return;
    }
    function toJson(str){
        try{
            return (new Function('return '+str))();
        }catch(e){return null}
    }
    var _handlers = {}, //事件池
        _needlock = {}, //需要锁定的事件池，这些事件只允许单进程执行
        _busy = {}, //繁忙的事件池，在此池中的事件不允许再执行
        _eid = 1; //为需要锁定的事件动态分配一个值，解决“单进程”事件对不同元素可以同时执行的问题

    window.Evter = {
        //ename 事件名，天然支持“伪”命名空间。例如：feed.reblog
        add: function(ename, handler){
            if(typeof ename==='string' && typeof handler==='function'){ //这里只进行简单的判断
                if(ename.charAt(0)==='-'){
                    ename = ename.substr(1);
                    _needlock[ename] = true;
                }
                if( _handlers[ename] ){
                    traceError('Evter handler "'+ename+'" has been defined!');
                    return;
                }
                _handlers[ename] = handler;
            }
        },
        click: function(elem, ename, handler){
            var curname = elem.getAttribute('e-name'),
                cdr = elem.getElementsByTagName('*'),
                i = cdr.length;
            while( i-- ){
                cdr[i].getAttribute('e-name') || cdr[i].setAttribute('e-name', 'b');
            }
            
            if(curname){
                if( (' '+curname+' ').indexOf(' '+ename+' ')===-1 ){
                    elem.setAttribute('e-name', curname+' '+ename);
                }
            }else{
                elem.setAttribute('e-name', ename);
            }
            if(handler){
                this.add(ename, handler);
            }
        },
        remove: function(ename){
            //_handlers[ename] = null;
            delete _handlers[ename];
            delete _needlock[ename];
        },
        //eTarget, event, eSource参数可选（当然也可以是其他意义的参数，JS形参类型不固定哦）
        fire: function(ename, eTarget, event, eSource){
            if( _needlock[ename] && eTarget){
                eTarget.$EID || (eTarget.$EID=' '+(_eid++));
                if( _busy[ename+eTarget.$EID] ){return}
                _busy[ename+eTarget.$EID] = true;
            }
            var handler = _handlers[ename];
            handler && handler(eTarget, event, eSource);
        },
        data: function(elem, data){
            var edata = elem.getAttribute('e-data'),
                type = typeof data;
            
            if (type === 'undefined' || data === null) {
                return edata ? toJson(edata) : null;
            } else if (type === 'object') {
                var k, v;
                if (edata) {
                    edata = toJson(edata);
                    if( typeof edata === 'object' ){
                        for (k in data) {
                            edata[k] = data[k];
                        }
                    }else{
                        edata = data;
                    }
                } else {
                    edata = data;
                }
                data = [];
                for (k in edata) {
                    v = edata[k];
                    data.push(k + ":" + (typeof v === 'string' ? "'" + v.replace(/'/g, "\\\'") + "'" : v));
                }
                data = "{" + data.join(",") + "}";
            } else if (type === 'string') {
                data = "'" + data.replace(/'/g, "\\\'") + "'";
            }
            elem.setAttribute('e-data', data);
        },
        //释放繁忙的事件（free 请翻译成“空闲的”。。）
        free: function(eTarget, ename){
            eTarget && delete _busy[ename+eTarget.$EID];
        }
    };
    
    //一切从这里开始。。。
    Core.Events.addEvent(document.body, function(event){
        event = event || window.event;
        var eSource = event.target || event.srcElement,
            eTarget = eSource,
            ename = eTarget.getAttribute('e-name');
        
        if(ename==='b'){
            do {
                eTarget = eTarget.parentNode;
                ename = eTarget.getAttribute('e-name');
            }while( ename==='b' );
        }
        if(ename){
            if( _needlock[ename] ){
                eTarget.$EID || (eTarget.$EID=' '+(_eid++));
                if( _busy[ename+eTarget.$EID] ){return}
                _busy[ename+eTarget.$EID] = true;
            }
            var handler = _handlers[ename];
            if (handler) {
                handler(eTarget, event, eSource);
            }else{
                var enames = ename.split(' '),
                    i = 0, len = enames.length;
                for(; i<len; i++){
                    ename = enames[i];
                    if( _needlock[ename] ){
                        eTarget.$EID || (eTarget.$EID=' '+(_eid++));
                        if( _busy[ename+eTarget.$EID] ){continue}
                        _busy[ename+eTarget.$EID] = true;
                    }
                    handler = _handlers[ename];
                    handler && handler(eTarget, event, eSource);
                }
            }
        }
    }, 'click');
    
    //window.$007 = _handlers; //方便测试的时候查看事件列表。。。。
}(window);
