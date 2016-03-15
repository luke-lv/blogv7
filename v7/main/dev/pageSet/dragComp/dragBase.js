/**
 * @fileoverview 拖拽基础类
 * @author xinyu@staff.sina.com.cn
 *
 */
$import("sina/ui/drag2.js");
$import("sina/core/dom/insertAfter.js");
$import("sina/core/dom/getChildrenByClass.js");
$import("lib/builder.js");

$import("pageSet/dragComp/dragComponent.js");

(function () {
    var func = {
        list: {},
        columnInfo: [],
        columnCompInfo: {},
        siblings: {//兄弟节点在该列中的位置
            prev: -1,//前一个兄弟
            prevperv: -1,//前两个兄弟
            next: -1,//后一个兄弟
            nextnext: -1//后两个兄弟
        },
        whichisdrag: -1,//被拖拽对象
        add: function (id) {

            if (!this.list[id] && !dragBase.isFobiden(id)) {//如果原来不存在该对象，并且该对象可以被移动，则初始化
                this.list[id] = {
                    obj: $E('module_' + id),
                    noMove: dragBase.isFobiden(id)
                };
                this.init(this.list[id].obj, id);
            }
        },
        init: function (obj, id) {
            //            trace("初始化" + id + "号节点");
            new dragComponent(obj, id);
            //			this.getColumnInfo();
        },
        isFobiden: function (id) {
            if ((scope.isAdshare == "true" || scope.isCompany == "true") && id == "901")
                return true;
            return false;
        },
        /**
         * 设置列的坐标信息，宽高信息
         */
        setColumnInfo: function () {
            trace("设置列的坐标信息，宽高信息");
            for (var i = 1; i < 4; i++) {
                trace('column_' + i + ':' + typeof $E('column_' + i));
                var o = $E('column_' + i);
                var childs = Core.Dom.getChildrenByClass(o, "SG_conn");
                if (childs.length > 0) {
                    this["columnInfo"]["column_" + i] = {
                        id: 'column_' + i,
                        isNoDragIn: $E('column_' + i).offsetWidth == 0 ? true : false,
                        left: Core.Dom.getLeft($E('column_' + i)),
                        top: Core.Dom.getTop($E('column_' + i)),
                        right: $E('column_' + i).offsetWidth + Core.Dom.getLeft($E('column_' + i)),
                        bottom: Core.Dom.getTop($E('column_' + i)) + $E('column_' + i).offsetHeight,
                        height: $E('column_' + i).offsetHeight,
                        width: $E('column_' + i).offsetWidth
                    };
                } else {
                    this["columnInfo"]["column_" + i] = {
                        id: 'column_' + i,
                        isNoDragIn: $E('column_' + i).offsetWidth == 0 ? true : false,
                        left: Core.Dom.getLeft($E('column_' + i)),
                        top: Core.Dom.getTop($E('column_' + i)),
                        right: $E('column_' + i).offsetWidth + Core.Dom.getLeft($E('column_' + i)),
                        bottom: Core.Dom.getTop($E('column_' + i)),
                        height: 0,
                        width: $E('column_' + i).offsetWidth
                    };
                }
            }
        },
        /**
         * 得到列的坐标信息，宽高信息
         */
        getColumnInfo: function () {
            return this["columnInfo"];
        },
        /**
         * 拖动前设置每列中的各个组件的坐标、宽高信息
         */
        setColumnCompInfo: function () {
            //            trace("重新刷新了每列中的列表信息");
            for (var i = 1; i < 4; i++) {
                var o = $E('column_' + i);
                this["columnCompInfo"]["column_" + i] = [];
                var childs = Core.Dom.getChildrenByClass(o, "SG_conn");
                for (var j = 0; j < childs.length; j++) {
                    var oc = childs[j];
                    if (oc.nodeType != 1 || oc.id.indexOf("module") == -1)
                        continue;
                    this["columnCompInfo"]["column_" + i][this["columnCompInfo"]["column_" + i].length] = {
                        isself: oc == this.getDragObj() ? true : false,
                        id: oc.id,
                        isNoDragIn: false,
                        left: Core.Dom.getLeft(oc),
                        top: Core.Dom.getTop(oc),
                        right: oc.offsetWidth + Core.Dom.getLeft(oc),
                        bottom: Core.Dom.getTop(oc) + oc.offsetHeight,
                        height: oc.offsetHeight,
                        width: oc.offsetWidth
                    };
                }
            }
        },
        /**
         * 得到拖动前每列中的各个组件的坐标、宽高信息
         */
        getColumnCompInfo: function () {
            return this["columnCompInfo"];
        },
        /**
         * 根据传入的坐标，判断是否在该区域范围内
         * @param pos 坐标{x,y}
         * @param area 区域{left,top,right,bottom,height,width}
         */
        isInArea: function (pos, area) {
            var result = {
                inOne: false,
                up: false,
                down: false,
                above: false,
                below: false
            };
            if ((area.isNoDragIn == false) && area.left <= pos.x && pos.x <= area.right) {
                result.inOne = true;
                if ((area.top <= pos.y) && (pos.y <= (area.top + area.height / 2))) {//上半部分
                    result.up = true;
                } else if (((area.top + area.height / 2) < pos.y) && (pos.y <= area.bottom)) {//下半部分
                    result.down = true;
                } else if (pos.y < area.top) {//在该区域的上面，但不在内部
                    result.above = true;
                } else {//在该区域的下面，但不在内部
                    result.below = true;
                }
            }
            return result;
        },
        /**
         * 得到该拖拽对象是哪个列的
         * @param {Object} obj
         * @param {Object} cursorPos
         */
        getWhichColumn: function (obj, cursorPos) {
            var o = this.getDragObj();
            if (o.parentNode == $E('column_1')) {
                return 1;
            } else if (o.parentNode == $E('column_2')) {
                return 2;
            } else {
                return 3;
            }
        },
        /**
         * 在创建border
         * @param {Object} obj 在哪个节点周围创建border
         * @param position 上还是下
         */
        resignBorder: function (id, position) {
            var dragobj = this.getDragObj();
            var div = $E('border_div');
            if (!div) {
                div = $C('div');
                div.id = "border_div";
                div.innerHTML = "&nbsp;";
            }
            div.style.cssText = "border:1px dashed #AAAAAA; margin-bottom:10px;height:40px;width:" + ($E(id).offsetWidth - 2) + "px;";
            //            trace(dragobj.id + ";" + id);
            if (position == "up") {
                $E(id).parentNode.insertBefore(div, $E(id));
            } else if (position == "down") {
                Core.Dom.insertAfter(div, $E(id));
            } else if (position == "above") {//说明移动到了某列的上面，但不在列里面
                var childs = Core.Dom.getChildrenByClass($E(id), "SG_conn");
                if (childs.length == 0) {
                    $E(id).appendChild(div);
                } else if (dragBase.isFobiden(childs[0].id.split('_')[1])) {
                    Core.Dom.insertAfter(div, childs[0]);
                } else if (childs[0] == this.whichisdrag) {
                    this.hiddenBorder();
                } else {
                    $E(id).insertBefore(div, childs[0]);
                }
            } else if (position == "below") {//说明移动到了某列的下面，但不在列里面
                var childs = Core.Dom.getChildrenByClass($E(id), "SG_conn");
                if (childs[childs.length - 1] != this.whichisdrag) {
                    $E(id).appendChild(div);
                } else {
                    this.hiddenBorder();
                }
            }

            //只有在border_div的位置变化或者第一进入本方法的情况下才计算每列组件的信息

            if (__pageSetVar.borderleft && __pageSetVar.bordertop) {
                var left = Core.Dom.getLeft($E('border_div'));
                var top = Core.Dom.getTop($E('border_div'));
                if (left != __pageSetVar.borderleft || top != __pageSetVar.bordertop) {
                    __pageSetVar.borderleft = left;
                    __pageSetVar.bordertop = top;
                    dragBase.setColumnInfo();
                    dragBase.setColumnCompInfo();
                }
            } else {
                if ($E('border_div') && $E('border_div').parentNode != $E('hiddendiv')) {
                    __pageSetVar.borderleft = Core.Dom.getLeft($E('border_div'));
                    __pageSetVar.bordertop = Core.Dom.getTop($E('border_div'));
                    dragBase.setColumnInfo();
                    dragBase.setColumnCompInfo();
                }
            }
        },
        hiddenBorder: function () {
            var div = $E('border_div');
            if (!div) {
            } else {
                $E('hiddendiv').appendChild(div);
            }

        },
        /**
         * 设置拖拽对象前后两个节点
         */
        setDragObjSiblings: function () {
            this.siblings = {
                prev: -1,
                prevperv: -1,
                next: -1,
                nextnext: -1
            };
            var dargcolumn = "column_" + this.getWhichColumn();
            var childs = Core.Dom.getChildrenByClass($E(dargcolumn), "SG_conn");
            for (var i = 0; i < childs.length; i++) {
                if (childs[i] == this.whichisdrag) {
                    if (i > 0)
                        this.siblings.prev = i - 1;
                    if (i - 1 > 0)
                        this.siblings.prevprev = i - 2;
                    if (i < childs.length - 1)
                        this.siblings.next = i + 1;
                    if (i < childs.length - 2)
                        this.siblings.nextnext = i + 2;
                }

            }
        },
        /**
         * 得到拖拽对象前后两个节点
         */
        getDragObjSiblings: function () {
            return this.siblings;
        },
        //取消拖动的事件
        cancelDrag: function () {

            e = Core.Events.fixEvent(Core.Events.getEvent());
            trace('keycode=' + e.keyCode);
            if (e.keyCode == 27) {//如果是esc健，将ondrag,ondragend清空
                dragBase.getDragObj().onDrag = function () {
                };
                dragBase.getDragObj().onDragEnd = function () {
                };
                var div = $E('move_div_p');
                div.style.left = "-900px";
                $E('move_div_p').style.cursor = "";
                dragBase.hiddenBorder();//隐藏虚线框
                Core.Dom.opacity(dragBase.getDragObj(), 100);
                window.funcChangeFormat.addNoneDiv();
                //将绑定到document上的keydown事件去掉，否则每次绑定一个，到最后就会很多
                Core.Events.removeEvent(document, dragBase.cancelDrag, 'keydown');

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
    window.dragBase = func;
})();
