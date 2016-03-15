/**
 * @fileoverview 给组件注册拖动的方法
 * @author xinyu@stff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/core/class/create.js");
$import("sina/core/dom/getElementsByClass.js");
$import("sina/core/dom/getLeft.js");
$import("sina/core/dom/getTop.js");
$import("sina/core/system/getScrollPos.js");
$import("sina/ui/drag2.js");
$import("sina/core/system/pageSize.js");
$import("sina/core/dom/setStyle.js");
$import("sina/core/dom/opacity.js");
$import("sina/core/dom/insertAfter.js");
$import("sina/core/dom/removeNode.js");
$import("sina/core/dom/getTop.js");
$import("sina/core/events/fixEvent.js");
$import("sina/core/events/getEvent.js");
$import("sina/core/events/removeEvent.js");
$import("sina/core/system/winSize.js");
$import("sina/core/system/pageSize.js");

var dragComponent = Core.Class.create();

dragComponent.prototype = {
    initialize: function (obj, id) {
        //        trace("初始化到dragCommponents中");
        this.obj = obj;
        this.id = id;
        this.t = Core.Dom.getElementsByClass(this.obj, "div", "SG_connHead")[0];
        this.t.style.cursor = "move";
        Ui.Drag2.init(this.obj, this.t);
        this.obj.onDragStart = this.onDragStart.bind2(this);
        this.obj.onDrag = this.onDrag.bind2(this);
        this.obj.onDragEnd = this.onDragEnd.bind2(this);
        //this.obj.onDragLeave
    },
    onDragStart: function () {
        //将select先隐藏，否则ie下只要改变了select元素的节点位置，就要刷新，刷刷的，不好看----------
        var selects = $T($E('module_' + this.id), 'select');
        for (var i = 0; i < selects.length; i++) {
            trace('select ' + i);
            selects[i].style.display = 'none';
        }
        //-----------------------------------------------------------------------------

        //开始拖动的时候绑定ondrag,ondragend事件，以及在document上绑定监听keydown的事件，用来在按下esc时退出
        Core.Events.addEvent(document, dragBase.cancelDrag, 'keydown');

        dragBase.setDragObj(this.obj);//拖动开始前告诉dragBase是哪个元素在拖动
        dragBase.setDragObjSiblings();
        this.siblings = dragBase.getDragObjSiblings();//得到拖拽元素前后两个元素
        this.obj.onDrag = this.onDrag.bind2(this);
        this.obj.onDragEnd = this.onDragEnd.bind2(this);

        //----------------------------------------------------------------------------

        this.orginalscroll = Core.System.getScrollPos(document);
        this.pagesize = Core.System.pageSize();
        //拖动开始前计算一次每一个column的坐标，每一个module的坐标---------------------
        dragBase.setColumnInfo();
        dragBase.setColumnCompInfo();
        this.columnInfo = dragBase.getColumnInfo();
        this.columnCompInfo = dragBase.getColumnCompInfo();
        //---------------------------------------------------------------------

        //拖动的那个div--------------------------------------
        var div = $E('move_div_p');
        if (!div) {
            div = $C('div');
            div.id = 'move_div_p';
            div.className = 'SG_dragBlk_wrap';
            div2 = $C('div');
            div2.id = 'move_div';
            div2.className = "SG_dragBlk";
            div2.innerHTML = '<div class="SG_conn"><div class="SG_connHead"><span class="title" id="move_title"></span></div><div class="SG_connBody"></div><div class="SG_connFoot"></div></div>';
            div.appendChild(div2);
        }
        div.style.cssText = "cursor:move;position:absolute;z-index:1901;";
        document.body.appendChild(div);
        $E('move_title').innerHTML = $T(this.obj, 'span')[0].innerHTML;

        this.objColumn = dragBase.getWhichColumn();//拖拽对象原来属于哪列
        this.leaveColumn = this.toColumn = this.objColumn;//拖拽推向将要离开的列，到达的列，初始都等于自己那列
        var cursorPos = this.cursorPosition();

        this.orignalCursor = cursorPos;
        var scrollPos = Core.System.getScrollPos(document);
        div.style.left = cursorPos.x + scrollPos[1] - $E('move_div_p').offsetWidth / 2 + 'px';
        div.style.top = cursorPos.y + scrollPos[0] - $E('move_div_p').offsetHeight / 2 + 'px';

        this.originalPos = {
            left: parseInt(div.style.left),
            top: parseInt(div.style.top)
        };

        Core.Dom.opacity(this.obj, 60);

    },
    onDrag: function (left, top) {
//       trace("document.doby.clientWidth="+document.body.clientWidth);
        //拖动的那个div的位置随着拖动移动----------------------------------------------
        var div = $E('move_div_p');

        var cursorPos = this.cursorPosition();
//		var screenPos =this.screenPosition();
//		trace("cursorPos.y="+cursorPos.x+";s$E('move_div').offsetHeight="+$E('move_div').offsetHeight+";"+this.winsize.height);
//     	trace("cursorPos.y="+cursorPos.y+";x="+cursorPos.x);
//		trace("screenPos.y="+screenPos.y+";x="+screenPos.x);
        //先取得一次滚动条位置，用来判断是否将滚动条滚动-------------------------------------------------------
        var origscrollPos = Core.System.getScrollPos(document);
        //		trace("pagesize.height="+this.pagesize[1]+";"+this.pagesize[2]+";");

        var vpix = 100;//垂直移动需要的变量,原来相当于move_div的实际的height
        var hpix = 100;//水平移动需要的变量，原来相当于move_div的实际width
        //垂直方向的滚动---------------------------------------------------------------------------------

        if (cursorPos.y + vpix > this.pagesize[3] && origscrollPos[0] + cursorPos.y + vpix < this.pagesize[1] - $E('move_div_p').offsetHeight / 2) {
            window.scrollTo(origscrollPos[1], origscrollPos[0] + cursorPos.y + vpix - this.pagesize[3]);
        } else if (cursorPos.y - vpix < 0) {
            window.scrollTo(origscrollPos[1], origscrollPos[0] + cursorPos.y - vpix);
        }

        var origscrollPos = Core.System.getScrollPos(document);
        //水平方向的滚动
        if (cursorPos.x + hpix > this.pagesize[2] && origscrollPos[1] + cursorPos.x + hpix < this.pagesize[0]) {
            window.scrollTo(origscrollPos[1] + cursorPos.x + hpix - this.pagesize[2], origscrollPos[0]);
        } else if (cursorPos.x - hpix < 0) {
            window.scrollTo(origscrollPos[1] + cursorPos.x - hpix, origscrollPos[0]);
        }
        //--------------------------------------------------------------------------------------------------------------
        var scrollPos = Core.System.getScrollPos(document);//不管滚动与否，再次取得滚动条位置，用来计算新的move_div位置。

        div.style.left = this.originalPos.left + cursorPos.x - this.orignalCursor.x + scrollPos[1] - this.orginalscroll[1] + 'px';

        if (scrollPos[0] + cursorPos.y + vpix > this.pagesize[1] - $E('move_div_p').offsetHeight / 2 + hpix) {

            div.style.top = (this.pagesize[1] - $E('move_div_p').offsetHeight) + 'px';
        } else {
            div.style.top = this.originalPos.top + cursorPos.y - this.orignalCursor.y + scrollPos[0] - this.orginalscroll[0] + 'px';
        }

        //------------------------------------------------------------------------
        //		trace("cursorPos.x="+cursorPos.x);
        this.columnInfo = dragBase.getColumnInfo();
        this.columnCompInfo = dragBase.getColumnCompInfo();
        var columnIn = 0;//被拖拽到某列
        for (var i = 1; i < 4; i++) {

            var result = dragBase.isInArea({
                x: cursorPos.x + scrollPos[1],
                y: cursorPos.y + scrollPos[0]
            }, this.columnInfo["column_" + i]);

            if (result.inOne) {//拖拽到了某列中或上面
                this.toColumn = columnIn = i;
                //产生占位框或消失占位框------------------------------------
//				trace("toColumn="+this.toColumn+";leaveColumn="+this.leaveColumn);
                if (this.toColumn != this.leaveColumn) {
                    if (Core.Dom.getChildrenByClass($E("column_" + this.leaveColumn), "SG_conn").length == 0) {
                        var div = Core.Dom.getChildrenByClass($E("column_" + this.leaveColumn), "SG_conn2");
                        if (div.length == 0) {
                            var div = $C('div');

                            div.className = 'SG_conn2';
                            div.innerHTML = '<div class="noWidget_box"><div class="noWidget_txt">您可将模块放置在此！</div>';
                            $E("column_" + this.leaveColumn).appendChild(div);
                        }

                    }

                    if (Core.Dom.getChildrenByClass($E("column_" + this.toColumn), "SG_conn").length == 0) {

                        var div = Core.Dom.getChildrenByClass($E("column_" + this.toColumn), "SG_conn2");
//                        trace("div.length=" + div.length);
                        if (div.length > 0) {
                            for (var j = div.length - 1; j >= 0; j--)
                                div[j].parentNode.removeChild(div[j]);
                        }
                    }

                }
                //------------------------------------------
                this.leaveColumn = this.toColumn;
                break;
//                trace("拖拽到第" + columnIn + "列中")
            }
        }
        if (columnIn == 0) {//说明没有拖到任何一列里或上面
//            trace("没有拖拽到任何一列");
            dragBase.hiddenBorder();

            //拖动到两栏中间的margin时，会隐藏border,但是在ff下，如果某列没有元素切没有占位框，则那列会变成0，因此需要迅速加上占位框
            if (Core.Dom.getChildrenByClass($E("column_" + this.leaveColumn), "SG_conn").length == 0) {

                var div = Core.Dom.getChildrenByClass($E("column_" + this.leaveColumn), "SG_conn2");
                if (div.length == 0) {
                    var div = $C('div');

                    div.className = 'SG_conn2';
                    div.innerHTML = '<div class="noWidget_box"><div class="noWidget_txt">您可将模块放置在此！</div>';
                    $E("column_" + this.leaveColumn).appendChild(div);
                }

            }
            this.leaveColumn = this.objColumn;
            //---------------------------------------
        } else {
            var resultb = dragBase.isInArea({
                x: cursorPos.x + scrollPos[1],
                y: cursorPos.y + scrollPos[0]
            }, this.columnInfo["column_" + columnIn]);
//			trace("拖拽到了"+columnIn+"列");
//			trace("离开的列是："+this.leaveColumn);
//			for(var k in resultb){
//				trace(k+"="+resultb[k]);
//			}
            if (resultb.up || resultb.down) {//说明拖拽到了某列里面
                for (var j = 0; j < this.columnCompInfo["column_" + columnIn].length; j++) {
                    var o = this.columnCompInfo["column_" + i][j]
                    var result = dragBase.isInArea({
                        x: cursorPos.x + scrollPos[1],
                        y: cursorPos.y + scrollPos[0]
                    }, o);
                    if (result.up) {//拖拽到了该元素的上半部分，应该将border添加到该元素上面
                        if (o.isself == true) {
                            dragBase.hiddenBorder();
                        } else if (o.id == "module_901" && (scope.isAdshare == "true" || scope.isCompany == "true") || (this.objColumn == columnIn && this.siblings.next == j)) {
                            dragBase.resignBorder(o.id, "down");
                        } else {
                            dragBase.resignBorder(o.id, "up");
                        }
                    } else if (result.down) {
                        if (o.isself == true) {
                            dragBase.hiddenBorder();
                        } else if (!(o.id == "module_901" && (scope.isAdshare == "true" || scope.isCompany == "true")) && this.objColumn == columnIn && this.siblings.prev == j) {
                            dragBase.resignBorder(o.id, "up")
                        } else
                            dragBase.resignBorder(o.id, "down")
                    }
                }
            } else if (resultb.above) {//说明到了某列上面
                var childs = Core.Dom.getChildrenByClass($E("column_" + columnIn), "SG_conn");
                dragBase.resignBorder("column_" + columnIn, "above");
            } else if (resultb.below) {//说明到了某列下面
                dragBase.resignBorder("column_" + columnIn, "below");
            }
        }
    },
    onDragEnd: function (type) {

        var div = $E('move_div_p');
        div.style.left = "-550px";

        if ($E('border_div') && $E('border_div').parentNode != $E('hiddendiv')) {
            //trace('将该组件插入到某列中啦。。。。');
            $E('border_div').parentNode.insertBefore(this.obj, $E('border_div'));
        } else {
            //否则说明拖动到了所有列的外面，拖动对象实际不动，因此toColumn应该等于objColumn
            this.toColumn = this.objColumn;
        }

        var childs = Core.Dom.getChildrenByClass($E("column_" + this.objColumn), "SG_conn");
        var childs2 = Core.Dom.getChildrenByClass($E("column_" + this.toColumn), "SG_conn2");
        if (childs.length == 0) {
            //			$E("column_" + this.objColumn).innerHTML = '<div style="width:' + width + 'px;height:0.1px;margin:0px;">&nbsp;&nbsp;</div>';
            var div = $C('div');
            div.className = 'SG_conn2';
            div.innerHTML = '<div class="noWidget_box"><div class="noWidget_txt">您可将模块放置在此！</div>';
            $E("column_" + this.objColumn).appendChild(div);

        }
        if (childs2.length > 0) {
            childs[0].parentNode.removeChild(childs[0]);
        }

        Ui.tween(this.obj, ['opacity'], [1], 0.5, 'simple', {end: function () {
            this.obj.style.cssText = "";
            //将select在显示出来
            var selects = $T($E('module_' + this.id), 'select');
            for (i = 0; i < selects.length; i++) {
                selects[i].style.display = '';
            }
        }.bind2(this)});

        Core.Events.removeEvent(document, dragBase.cancelDrag, 'keydown');

        Lib.Component.refresh(this.id, {

            width: $E('column_' + this.toColumn).offsetWidth
        });

        trace('宽度是：' + $E('column_' + this.toColumn).offsetWidth);
        dragBase.hiddenBorder();//隐藏虚线框
    },
    cursorPosition: function () {
        e = Core.Events.fixEvent(Core.Events.getEvent());

        return {
            x: e.clientX,
            y: e.clientY
        };
    }
};
