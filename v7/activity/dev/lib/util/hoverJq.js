$import("sina/core/events/getEventTarget.js");
$import("lib/util/_util.js");
$import("lib/apply.js");
/**
 * @fileoverview 元素支持鼠标悬停
 * 当鼠标hove到子元素后不会执行hover或out函数
 * @author  langye3@staff
 * @create  2012-03-06
 * @update  Qingyee | wangqiang1@staff 
 */
Lib.util.hoverJq = function(conf) {

        var _default = {
            'elm': document.body,
            // 鼠标移进元素回调
            // @param {MouseEvent}  evt 鼠标事件对象
            // @param {HEMLElement} el 鼠标移出的元素
            // @param {Number} index 当前元素所处位置
            'mouseenter': function(evt, el, index) {
            },
            // 鼠标移出元素回调
            // @param {MouseEvent}  evt 鼠标事件对象
            // @param {HEMLElement} el 鼠标移出的元素
            // @param {Number} index 当前元素所处位置
            'mouseleave': function(evt, el, index) {
            },
            'delay': 0
        }

        conf = Lib.apply(_default, conf);

        var enterType = $IE ? 'mouseenter' : 'mouseover',
        leaveType = $IE ? 'mouseleave' : 'mouseout';

        if (!('length' in conf.elm)) { //如果不是 array, 组装成 arrray
            conf.elm = [conf.elm];
        } else {
            try{
                // IE报错，奶奶的
                conf.elm = Array.prototype.slice.call(conf.elm, 0);
            } catch(e) { 
                var tmpArr = [];
                for (var i=0, len = conf.elm.length; i < len; i++) {
                    tmpArr.push(conf.elm[i]);
                }
                conf.elm = tmpArr;
            }
            
        }

        Core.Array.foreach(conf.elm, function(one, index) {
            //鼠标移入
            Core.Events.removeEvent(one, enterType);
            //鼠标移出
            Core.Events.removeEvent(one, leaveType);

            //鼠标移入
            Core.Events.addEvent(one, (function(el, func, i) {
                return function(evt) {
                    evt = evt || window.event;
                    if ($IE) {
                        func.apply(el, [evt, el, i]);
                    } else {
                        withinElement(evt, 'mouseenter', el, i);
                    }
                }
            })(one, conf[enterType], index), enterType);
            //鼠标移出
            Core.Events.addEvent(one, (function(el, func, i) {
                return function(event) {
                    if ($IE) {
                        func.apply(el, [event, el, i]);
                    } else {
                        withinElement(event, 'mouseleave', el, i);
                    }
                }
            })(one, conf[leaveType], index), leaveType);
        });
        // 下面这个函数用于检测事件是否发生在另一个元素的内部
        var withinElement = function(event, mouseType, elm, i) {
            // 检测 mouse(over|out) 是否还在相同的父元素内
            var parent = event.relatedTarget;

            // Firefox 有时候会把 relatedTarget 指定一个 XUL 元素
            // 对于这种元素，无法访问其 parentNode 属性
            try {

                // Chrome 也类似，虽然可以访问 parentNode 属性
                // 但结果却是 null
                if ( parent && parent !== document && !parent.parentNode ) {
                    return;
                }

                // 沿 DOM 树向上
                while ( parent && parent !== elm ) {
                    parent = parent.parentNode;
                }

                if ( parent !== elm ) {
                    // 如果实际正好位于一个非子元素上面，那好，就处理事件
                    // 传入参数为事件，元素，所处位置
                    conf[mouseType].apply(elm, [event, elm, i]);
                }

                // 假定已经离开了元素，因为很可能鼠标放在了一个XUL元素上
            } catch(e) {
            }

            return false;
        };
    };