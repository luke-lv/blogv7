/** 
 * @fileoverview 拖拽标签
 * @author Book | liming9@staff.sina.com.cn
 * @date 2012-08-22
 */
$import('lib/jobs.js');
$import('sina/core/events/addEvent.js');
$import('sina/core/events/removeEvent.js');
$import('sina/core/events/stopEvent.js');
$import("sina/ui/tween/tweenStrategy.js");

$registJob('dragTag', function(){
    var _addEvent = Core.Events.addEvent,
        _removeEvent = Core.Events.removeEvent,
        _stopEvent = Core.Events.stopEvent;
        
    var MAX_WIDTH = 145; //最大标签宽度
    var lastLeft, startX, thisW, el, elA, bindA = true,
        ontween = false;
    
    var mouseMove = function(evt){
        evt = evt || window.event;
        _stopEvent(evt);
        if(bindA){
            bindA = false;
            if(elA){
                elA.onclick = function(){
                    return false
                };
                elA.style.cursor = 'col-resize';
            }
        }
        //var eventX = evt.clientX || evt.pageX || evt.x || 0;
        //trace(evt.clientX+'===evt.clientX');
        //lastLeft += eventX-startX;
        //trace(lastLeft+', '+eventX+', '+startX);
        //el.style.left = lastLeft+'px';
        el.style.left = (lastLeft+(evt.clientX || evt.pageX || evt.x || 0)-startX)+'px';
        
        //var offsetX = (evt.pageX || evt.x || 0) - startX,
        //    newLeft = lastLeft+offsetX;
        //trace(newLeft);
        //if( newLeft>thisW && newLeft<2 ){
        //    el.style.left = newLeft+'px';
        //}
    };
    
    var mouseUp = function(evt){
        evt = evt || window.event;
        _stopEvent(evt);
        if(!bindA){
            bindA = true;
            if(elA){
                setTimeout(function(){
                    elA.onclick = null;
                    elA.style.cursor = 'pointer';
                    elA = null;
                },10);
            }
        }
        var left = parseInt(el.style.left)||0;
        if(left>2){
            tweenBack(left, 0);
        }else if(left<thisW){
            tweenBack(left, thisW);
        }else{
            el = null;
        }
        _removeEvent(document, mouseMove, 'mousemove');
        _removeEvent(document, mouseUp, 'mouseup');
    };
    
    _addEvent($E('feedWrap'), function(evt){
        if(ontween){return}
        evt = evt || window.event;
        el = evt.target || evt.srcElement;
        var dragable = false;
        if(el.parentNode.className==='tagList'){
            dragable = true;
            elA = el;
            el = el.parentNode;
        }
        if(dragable || el.className==='tagList'){
            _stopEvent(evt);
            thisW = getWidth(el).w;
            if( thisW<MAX_WIDTH ){return}
            thisW = MAX_WIDTH-thisW;
            startX = evt.clientX || evt.pageX || evt.x || 0;
            lastLeft = parseInt(el.style.left)||0;
            _addEvent(document, mouseMove, 'mousemove');
            _addEvent(document, mouseUp, 'mouseup');
        }
    }, 'mousedown');
    
    function getWidth(el){
        var rect, _size;
        if (el.getBoundingClientRect) {
            rect = el.getBoundingClientRect();
            _size = {
                w: rect.right - rect.left
            };
        }
        return _size || {
            w: el.offsetWidth
        };
    }
    
    function tweenBack(startv, endv){
        var tween = new Ui.TweenStrategy(startv, endv, 0.8);
        tween.onTween = function(v){
            el.style.left = v+'px';
        };
        tween.onEnd = function(){
            el = null;
            ontween = false;
        };
        ontween = true;
        tween.start();
    }
    
});
