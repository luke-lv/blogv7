/**
 * @fileoverview 拖拽除了组件外的其它东西
 * @author xy xinyu@staff.sina.com.cn
 */

$import("sina/ui/drag2.js");
$import("sina/core/dom/insertAfter.js");
$import("sina/core/dom/getChildrenByClass.js");
$import("lib/builder.js");

$import("pageSet/dragThings/dragThings.js");

(function () {
    var func = {
        list: {},
        whichisdrag: -1,//被拖拽对象
        add: function (id, areaobj, margin) {
            if (!this.list[id]) {//如果原来不存在该对象，并且该对象可以被移动，则初始化
                this.list[id] = {
                    obj: $E(id)
                };
                this.init(this.list[id].obj, id, areaobj, margin);
            }
        },
        init: function (obj, id, areaobj, margin) {
            new dragThings(obj, id, areaobj, margin);
        },
        //取消拖动的事件
        cancelDrag: function () {

            e = Core.Events.fixEvent(Core.Events.getEvent());
//            trace('keycode=' + e.keyCode);
            if (e.keyCode == 27) {//如果是esc健，将ondrag,ondragend清空

                dragSome.getDragObj().onDrag = function () {
                };
                dragSome.getDragObj().onDragEnd = function () {
                };
                //将绑定到document上的keydown事件去掉，否则每次绑定一个，到最后就会很多
                Core.Events.removeEvent(document, dragSome.cancelDrag, 'keydown');

            }
        },
        //设置哪个元素被拖动
        setDragObj: function (obj) {
            this.whichisdrag = obj;

        },
        //得到哪个元素被拖动
        getDragObj: function () {
            return this.whichisdrag;
        }

    };
    window.dragSome = func;
})();
