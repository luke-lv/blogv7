/**
 * @fileInfo   消息系统tab页签
 * @author     yongsheng4@staff.sina.com.cn
 * @update     2013-04-07
 * @tpl
 * <ul id="j-msgpanel-tabhead">
 *  <li j-tab="t1" class="focus">tab1</li>
 *  <li j-tab="t2">tab2</li>
 *  <li j-tab="t3">tab3</li>
 * </ul>
 * <div id="j-msgpanel-tabbody">
 *  <div j-tab-cnt="t1" style="">t1</div>
 *  <div j-tab-cnt="t2" style="display:none">t2</div>
 *  <div j-tab-cnt="t3" style="display:none">t3</div>
 * </div>
 * @eg
 *   var tab = new Lib.sysmsg.TabManager($E("j-msgpanel-tabhead"),$E("j-msgpanel-tabbody"));
 *   tab.on("select",function(target) {
 *      alert(target.getAttribute("j-tab"));
 *   });
 *   tab.select("t1");
 */
$import("sina/core/class/create.js");
$import("sina/core/events/addEvent.js");
Lib.sysmsg = Lib.sysmsg || {};
Lib.sysmsg.TabManager = Core.Class.create();
Lib.sysmsg.TabManager.prototype = {
    //初始化tab
    initialize: function(head, body) {
        this._head = head;
        this._body = body;
        this._index = 0; //当前tab状态标志
        this._hash = {}; //用来保存j-tab的值与tab头和tab内容节点的对于关系
        this._evList = []; //事件列表
        this.headlist = this._getHeads();
        this.bodylist = this._getBodys();
        this._bindEvent();
    },
    //选中某一个页签
    select: function(tabsign) {
        var target = this._hash[tabsign];
        var index = target[0].getAttribute("_index");
        this._setHeads(index);
        this._setBodys(index);
        this._index = index;
        this._fireEvent("select", target);
    },
    //获取当前选中tab的节点
    getFocus: function() {
        var index = this._index;
        return {
            "hd": this.headlist[index],
            "bd": this.bodylist[index]
        };
    },
    //查找节点
    _findNodes: function(node, attname) {
        var nodes = [];
        for (var i = 0, l = node.childNodes.length; i < l; i++) {
            if (node.childNodes[i].nodeType == 1) {
                if (node.childNodes[i].getAttribute(attname)) {
                    nodes.push(node.childNodes[i]);
                }
                if (node.childNodes[i].childNodes.length > 0) {
                    nodes = nodes.concat(arguments.callee.call(null, node.childNodes[i], attname));
                }
            }
        }
        return nodes;
    },
    //获取页签头
    _getHeads: function() {
        var headlist = this._findNodes(this._head, "j-tab");
        return headlist;
    },
    //获取页签body
    _getBodys: function() {
        var headlist = this._findNodes(this._body, "j-tab-cnt");
        return headlist;
    },
    //事件绑定
    _bindEvent: function() {
        var headlist = this.headlist;
        var _this = this;
        for (var i = 0, len = headlist.length; i < len; i++) {
            var item = headlist[i];
            this._hash[item.getAttribute("j-tab")] = [item];
            this._hash[item.getAttribute("j-tab")].push(this.bodylist[i]);
            item.setAttribute("_index", i);
            Core.Events.addEvent(item, function(e, i) {
                Core.Events.stopEvent(e);
                var target = e.target || e.srcElement;
                while(!target.getAttribute("j-tab")){ //解决点击不生效问题
                    target = target.parentNode;
                };
                var index = target.getAttribute("_index");
                var tabsign = target.getAttribute("j-tab");
                var preindex = _this._index;
                if (preindex != index) { //点的是不同页签才执行操作
                    _this.select(tabsign);
                }
            }, "click");
        }
    },
    //设置tab头
    _setHeads: function(index) {
        var preindex = this._index;
        var headlist = this.headlist;
        headlist[preindex].className = "";
        headlist[index].className = "current";
    },
    //设置tab内容
    _setBodys: function(index) {
        var preindex = this._index;
        var bodylist = this.bodylist;
        bodylist[preindex].style.display = "none";
        bodylist[index].style.display = "";
    },
    //触发事件列表
    _fireEvent: function(type, e) {
        if (this._evList[type]) {
            for (var i = 0, l = this._evList[type].length; i < l; i++) {
                this._evList[type][i].call(null, e);
            }
        }
    },
    //绑定事件目前只触发select事件
    on: function(type, fn) {
        if (!this._evList[type]) {
            this._evList[type] = [];
        }
        this._evList[type].push(fn);
    }
};