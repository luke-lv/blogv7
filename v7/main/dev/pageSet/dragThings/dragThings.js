/**
 * @fileoverview 可以对任何东西进行拖拽并限制其范围的类
 * @author xy xinyu@staff.sian.com.cn\
 * @modified Luo Rui luorui1@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/core/class/create.js");
$import("sina/core/dom/getElementsByClass.js");
$import("sina/core/dom/getLeft.js");
$import("sina/core/dom/getTop.js");
$import("sina/core/system/getScrollPos.js");
$import("sina/ui/drag2.js");
$import("sina/core/system/pageSize.js");
$import("sina/core/dom/getStyle.js");
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

var dragThings = Core.Class.create();

dragThings.prototype = {
    /**
     * 初始化被拖动的对象
     * @param {Object} obj   该对象
     * @param {String} id    该对象的id
     * @param {Object} area  该对象在哪个对象的范围内拖动，比如是body还是某个div
     * @param {Array} margin 拖动范围需要留出的距离，数组顺序是：[左右需要留出距离，上下需要留出的距离]
     */
    initialize: function (obj, id, areaobj, margin) {
        var tmpFc = new Function();
        this.obj = obj;
        this.id = id;
        this.areaObj = areaobj || document.body;
        this.margin = margin || [0, 0];
        Ui.Drag2.init(this.obj);
        this.obj.onDragStart = this.onDragStart.bind2(this);
        this.obj.onDrag = this.onDrag.bind2(this);
        this.obj.onDragEnd = this.onDragEnd.bind2(this);
        this.obj.onmouseover = function () {
            if (this.obj.getAttribute('dragable') == 'false') return false;
            this.obj.style.border = "2px dashed red";
            this.obj.style.cursor = "move";
        }.bind2(this);
        this.obj.onmouseout = function () {
            this.obj.style.border = "";
        }.bind2(this);

        // 劫持Drag化节点的mouseDown事件, 判断当前是否允许拖拽。
        tmpFc = this.obj.onmousedown;
        this.obj.onmousedown = function (e) {
            if (this.getAttribute('dragable') == 'false') return false;
            tmpFc.apply(this, [e]);
        }
    },
    onDragStart: function () {
        //开始拖动的时候绑定ondrag,ondragend事件，以及在document上绑定监听keydown的事件，用来在按下esc时退出
        //Core.Events.addEvent(document, dragSome.cancelDrag, 'keydown');

        dragSome.setDragObj(this.obj);//拖动开始前告诉dragBase是哪个元素在拖动
        var left = Core.Dom.getLeft(this.areaObj);
        var top = Core.Dom.getTop(this.areaObj);

        //该对象能够拖动的范围，是一个数组，如果没有，则可以在整个页面内拖动,数组的顺序是：[left,top,该范围对象的width,该范围对象的height]
        this.area = [left, top, this.areaObj.offsetWidth - this.margin[0], this.areaObj.offsetHeight - this.margin[1]];
        this.obj.onDrag = this.onDrag.bind2(this);
        this.obj.onDragEnd = this.onDragEnd.bind2(this);

        //----------------------------------------------------------------------------
        var cursorPos = this.cursorPosition();
        this.orignalCursor = cursorPos;

        this.originalPos = {
//            x: parseInt(Core.Dom.getStyle(this.obj, 'left')),
//            y: parseInt(Core.Dom.getStyle(this.obj, 'top'))
            x: this.obj.offsetLeft,
            y: this.obj.offsetTop
        };
        this.origSize = {
            x: this.obj.offsetWidth,
            y: this.obj.offsetHeight
        };
        this.orginalscroll = Core.System.getScrollPos(document);
        this.pagesize = Core.System.pageSize();
    },
    onDrag: function (left, top) {
        var origscrollPos = Core.System.getScrollPos(document);
        var cursorPos = this.cursorPosition();
//        trace("curs.y=" + cursorPos.y + ";curs.x=" + cursorPos.x);
        var vpix = this.obj.offsetHeight;//垂直移动需要的变量
        var hpix = this.obj.offsetWidth;//水平移动需要的变量

        //垂直方向的滚动------------------------------------------------------------------------------------
        if (cursorPos.y + vpix > this.pagesize[3] && origscrollPos[0] + cursorPos.y + vpix < this.pagesize[1]) {
            window.scrollTo(origscrollPos[1], origscrollPos[0] + cursorPos.y + vpix - this.pagesize[3]);
        } else if (cursorPos.y - vpix < 0) {
            window.scrollTo(origscrollPos[1], origscrollPos[0] + cursorPos.y - vpix);
        }

        var origscrollPos = Core.System.getScrollPos(document);
        //水平方向的滚动-------------------------------------------------------------------------------------
        if (cursorPos.x + hpix > this.pagesize[2] && origscrollPos[1] + cursorPos.x + hpix < this.pagesize[0]) {
            window.scrollTo(origscrollPos[1] + cursorPos.x + hpix - this.pagesize[2], origscrollPos[0]);
        } else if (cursorPos.x - hpix < 0) {
            window.scrollTo(origscrollPos[1] + cursorPos.x - hpix, origscrollPos[0]);
        }
        //--------------------------------------------------------------------------------------------------------------

        var scrollPos = Core.System.getScrollPos(document);//不管滚动与否，再次取得滚动条位置
        if (scrollPos[1] - this.orginalscroll[1] + cursorPos.x - this.orignalCursor.x + this.originalPos.x < 0) {
            this.obj.style.left = '0px';
        } else if (scrollPos[1] - this.orginalscroll[1] + cursorPos.x - this.orignalCursor.x + this.originalPos.x + this.origSize.x - this.area[2] >= 0) {
            this.obj.style.left = this.area[2] - this.origSize.x + "px";
        } else {
            this.obj.style.left = cursorPos.x - this.orignalCursor.x + this.originalPos.x + scrollPos[1] - this.orginalscroll[1] + 'px';
        }

        if (scrollPos[0] - this.orginalscroll[0] + cursorPos.y - this.orignalCursor.y + this.originalPos.y < 0) {
            this.obj.style.top = '0px';
        } else if (scrollPos[0] - this.orginalscroll[0] + cursorPos.y - this.orignalCursor.y + this.originalPos.y + this.origSize.y - this.area[3] >= 0) {
            this.obj.style.top = this.area[3] - this.origSize.y + "px";
        } else {
            this.obj.style.top = cursorPos.y - this.orignalCursor.y + this.originalPos.y + scrollPos[0] - this.orginalscroll[0] + 'px';
        }

    },
    onDragEnd: function (type) {
    },
    cursorPosition: function () {
        e = Core.Events.fixEvent(Core.Events.getEvent());

        return {
            x: e.clientX,
            y: e.clientY
        };
    }
};
