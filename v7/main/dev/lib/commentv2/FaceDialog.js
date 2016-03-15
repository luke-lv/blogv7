/**
 * @fileInfo   表情浮层
 * @author     yongsheng4@staff.sina.com.cn
 * @update     2013-08-22
 */
$import("lib/commentv2/_comment.js");
$import("lib/commentv2/TextAreaUtils.js");
$import("lib/commentv2/faceData.js");
$import("sina/core/dom/insertHTML.js");
$import("sina/core/class/create.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/function/bind3.js");
$import("sina/core/events/removeEvent.js");
$import("sina/core/dom/getXY.js");
$import("sina/core/dom/contains.js");
$import("sina/ui/tab/tabs.js");
$import("sina/ui/dialog/dialog.js");
$import("lib/util/json.js");

CommentV2.FaceDialog = Core.Class.create();
CommentV2.FaceDialog.prototype = {
  initialize: function(srcEl, tarea) {
    this._src = srcEl;
    this._tarea = tarea;
	this._json = Lib.util.JSON;
    this.dialog = new Dialog(this._tpl);
    this.dialogNodes = this.dialog.getNodes();
    var pos = this.getSrcPos(srcEl);
    this.faceDatas = {}; //表情数据;
    this.generaFaces = []; //常用表情分类
    this.hotFaces = []; //热门表情
    this.dialog.setPosition(pos);
    this.dialog.show();
    this.initTab();
    this._bindEvents();
  },
  _tpl: ['<table class="CP_w" id="#{entity}">',
    '<thead>',
    '<tr>',
    '<th class="tLeft"><span></span></th>',
    '<th class="tMid"><div class="bLyTop"><strong>插入表情</strong><cite><a href="#" id="#{close}"class="CP_w_shut" title="关闭">关闭</a></cite></div></th>',
    '<th class="tRight"><span></span></th>',
    '</tr>',
    '</thead>',
    '<tfoot>',
    '<tr>',
    '<td class="tLeft"><span></span></td>',
    '<td class="tMid"><span></span></td>',
    '<td class="tRight"><span></span></td>',
    '</tr>',
    '</tfoot>',
    '<tbody>',
    '<tr>',
    '<td class="tLeft"><span></span></td>',
    '<td class="tMid" id="#{content}">',
    '<div class="faceItemList" id="#{facelistbox}">',
    '<div class="CP_w_tag" id="#{facetabs}" style="display:none"></div>',//只保留默认表情，其他表情tab暂时隐藏
    '<div id="#{general}">',
    '<div class="tab_subsort" id="#{generaltabs}" style="display:none"></div>',//只保留默认表情，其他表情tab暂时隐藏
    '<div class="details">',
    '<ul class="face_tp face_lt" id="#{hotFace}"></ul>',
    '<ul class="face_tp" id="#{inner}"></ul>',
    '<div class="SG_page" id="#{page}"><ul id="#{pagelist}" class="SG_pages"></ul></div>',
    '</div>',
    '</div>',
    '</div>',
    '</td>',
    '<td class="tRight"><span></span></td>',
    '</tr>',
    '</tbody>',
    '</table>'
  ].join(""),
  //绑定事件
  _bindEvents: function() {
    var _this = this;
    Core.Events.addEvent(this.dialogNodes.close, function(e) { //提交
      var e = Core.Events.getEvent();
      Core.Events.stopEvent(e);
      _this.dialog.hidden();
    }, "click");
    Core.Events.addEvent(document.body, function(e) { //提交
      var e = Core.Events.getEvent();
      var target = e.target || e.srcElement;
      if (!Core.Dom.contains(_this.dialogNodes.entity, target) && (target != _this._src)) {
        _this.dialog.hidden();
      }
    }, "click");
    this.bindDelegateAction();
  },
  //获取表情按钮位置
  getSrcPos: function() {
    var srcEl = this._src;
    var spos = Core.Dom.getXY(srcEl);
    var height = srcEl.offsetHeight;
    var pos = {};
    pos.x = spos[0];
    pos.y = spos[1] + height + 5;
    return pos;
  },
  //显示
  show: function() {
    this.dialog.show();
  },
  //生成tab
  initTab: function() {
    this.tab = new Tabs(this.dialogNodes.facetabs, {});
    highTab = new Tab('<div><em>常用表情</em></div>', {
      isFocus: true,
      className: "cur"
    });
    // inTab = new Tab('<div><em><a href="#">魔法表情</a></em></div>', {
    //       isFocus: false,
    //       className: "cur"
    // });
    highTab.addOnFocus(Core.Function.bind3(this.initGeneralFace, this));
    this.tab.add(highTab);
    this.initGeneralFace();
    //this.tab.add(inTab);
  },
  //初始化常用表情
  getFaceData: function(fun) {
    if (this.faceDatas.face) {
      return;
    }
    var _this = this;
    //var url = 'https://api.weibo.com/2/emotions.json?access_token=2.00XI9F6Beu4YqB9ed739ff735qxdwD&type=face&language=cnname&callback=jsonpfacedata';
    if(!window.WEIBOFACEDATA){
      var url = 'http://i2.api.weibo.com/2/emotions.json?source=1617465124&type=face&language=cnname&callback=jsonpfacedata';
      window.jsonpfacedata = function(result) {
        if (result.code == 1 && result.data){
           window.WEIBOFACEDATA = result.data;
          _this.faceDatas.face = _this.formartFaceData(result.data);
          fun()
          //alert(_this.generaFaces)
        }
      }
      Utils.Io.JsLoad.request(url, {
        onComplete: function(result) {

        }.bind2(this),
        charset: "UTF-8"
      });
    }else{
      this.faceDatas.face = _this.formartFaceData(window.WEIBOFACEDATA);
      fun();
    }
  },
  //格式化常用表情数据
  formartFaceData: function(data) {
    var _data = {};
    for (var i = 0, len = data.length; i < len; i++) {
      var item = data[i];
      if (!item.category) {
        item.category = "默认";
      }
      if (item.hot) {
        this.hotFaces.push(item);
      } else { //热门表情不放入表情组
        if (_data[item.category]) {
          _data[item.category].push(item);
        } else {
          _data[item.category] = [];
          this.generaFaces.push(item.category);
          _data[item.category].push(item);
        }
      }
    }
    return _data;
  },
  //初始化常用表情
  initGeneralFace: function() {
    this.getFaceData(this.initGeneralTab.bind2(this));
  },
  //初始化常用下的表情页签列表和分页
  initGeneralTab: function() {
    var tabs = this.initGeneralTabList();
    this.initGeneralTabPage(tabs);
  },
  //初始化常用下的表情页签列表
  initGeneralTabList: function() {
    var tabs = new Tabs(this.dialogNodes.generaltabs, {});
    //覆盖父类的add方法为了屏蔽点击默认事件
    tabs.add = function(tab) {
      this.tabsArr.push(tab);
      //trace(tab.element)
      this.htmlEle.appendChild(tab.element);
      var _this = this;
      Core.Events.addEvent(tab.element, function(e) {
        var e = Core.Events.getEvent();
        Core.Events.stopEvent(e);
        _this.swapTags(tab);
      });
    }.bind2(tabs);
    for (var i = 0, len = this.generaFaces.length; i < len; i++) {
      var itme = this.generaFaces[i];
      var isFocus = false;
      if (i == 0) {
        isFocus = true;
      }
      var tabitem = new Tab('<a href="#">' + itme + '</a>', {
        isFocus: isFocus,
        className: "cur"
      });
      tabitem.addOnFocus(Core.Function.bind3(this.showGeneralFaces, this, [itme]));
      if (i > 4) { //第一页只显示前5个
        tabitem.hidden();
      }
      tabs.add(tabitem);
      if (i == 0) { //默认显示第一个tab下的表情
        this.showGeneralFaces(itme);
        //this.showTheHotFace();去掉热门表情
      }
    }
    return tabs;
  },

  //初始化常用下的表情页签分页
  initGeneralTabPage: function(tabs) { //tabs.tabsArr
    var _html = '<div class="btn_func" ><a href="#" node-type="generalTabPagePre" class="arrow_preview"></a><a href="#" node-type="generalTabPageNext" class="arrow_next"></a></div>';
    Core.Dom.insertHTML(this.dialogNodes.generaltabs, _html, "BeforeEnd");
    var pre = Core.Dom.getElementsByAttr(this.dialogNodes.generaltabs, "node-type", "generalTabPagePre")[0]; //前一页
    var next = Core.Dom.getElementsByAttr(this.dialogNodes.generaltabs, "node-type", "generalTabPageNext")[0];; //后一页
    var focuspage = 1; //当前页
    var step = 5; //步长
    var preTabArr = []; //前一组显示的tab
    var focusTabArr = tabs.tabsArr.slice(focuspage - 1, step); //当前显示的tab
    var total = this.generaFaces.length; //总数
    var remainder = total % step //余数
    var totalpage = remainder > 0 ? ((total - remainder) / step + 1) : total / step; //总页数
    //上一页
    Core.Events.addEvent(pre, function(e) {
      var e = Core.Events.getEvent();
      Core.Events.stopEvent(e);
      if (focuspage <= 1) {
        focuspage = 1;
        return;
      } else {
        focuspage--;
      }
      setpage();
    });
    //下一页
    Core.Events.addEvent(next, function(e) {
      var e = Core.Events.getEvent();
      Core.Events.stopEvent(e);
      if (focuspage >= totalpage) {
        focuspage = totalpage;
        return;
      } else {
        focuspage++;
      }
      setpage();
    })
    //处理分页

    function setpage() {
      preTabArr = focusTabArr;
      focusTabArr = tabs.tabsArr.length >= focuspage * step - 1 ? tabs.tabsArr.slice((focuspage - 1) * step, focuspage * step) : tabs.tabsArr.slice((focuspage - 1) * step);
      for (var prelen = preTabArr.length - 1; prelen >= 0; --prelen) {
        var preitem = preTabArr[prelen];
        preitem.hidden();
      }
      for (var focuslen = focusTabArr.length - 1; focuslen >= 0; --focuslen) {
        var focusitem = focusTabArr[focuslen];
        focusitem.show();
      }
    }
  },
  //显示热门表情
  showTheHotFace: function() {
    if (this.hotFaces) {
      var data = this.hotFaces.slice(0, 12);
      var list = this.setHotFaceList(data);
    }
  },
  //记忆当前聚焦tab
  memoryFocusTab: function(tabname) {
    this.dialogNodes.generaltabs.setAttribute("data-focustab", tabname);
  },
  //显示tab下的表情
  showGeneralFaces: function(tabname) {
    this.memoryFocusTab(tabname);
    if (this.faceDatas.face && this.faceDatas.face[tabname]) {
      if (tabname == "默认") { //只有默认tab下才有热门表情
        this.dialogNodes.hotFace.style.display = "block";
      } else {
        this.dialogNodes.hotFace.style.display = "none";
      }
      var data = this.faceDatas.face[tabname];
      this.setGeneralFaceList(data);
    }
  },
  //设置热门表情
  setHotFaceList: function(data) {
    var tpl = this.getFaceItemsTpl(data);
    this.dialogNodes.hotFace.innerHTML = tpl;
  },
  //设置常用表情
  setGeneralFaceList: function(data) {
    var page = this.getFaceListPageData(data);
    this.initFaceListPage(page);
    this.updateGeneralFaceList(data, page);
  },
  //更新常用表情列表
  updateGeneralFaceList: function(data, page) {
    var data = this.getFaceListData(data, page);
    var tpl = this.getFaceItemsTpl(data);
    this.dialogNodes.inner.innerHTML = tpl;
  },
  //获取表情列表模版
  getFaceItemsTpl: function(data) {
    var list = [];
    for (var i = 0, len = data.length; i < len; i++) {
      var item = data[i];
      list.push('<li action-type="insert" action-data="' + item.phrase + '"><img src="' + item.icon + '" alt="' + item.phrase + '" title="' + item.phrase + '"></li>')
    }
    return list.join("");
  },
  //格式化单个表情列表的分页
  getFaceListPageData: function(data) {
    var page = {};
    page.step = 72; //步长
    page.focus = 1; //当前页码
    page.total = data.length; //总数
    page.totalpage = page.total > page.step ? (page.total % page.step > 0 ? ((page.total - page.total % page.step) / page.step + 1) : page.total / page.step) : 1;
    this.dialogNodes.page.setAttribute("data-page", this._json.stringify(page));
    return page;
  },
  //初始化分页
  initFaceListPage: function(page) {
    var pgtpl = [];
    if (page.totalpage > 1) { //总数大于1显示分页
      //显示分页
      this.dialogNodes.page.style.display = "block";
      for (var i = 1; i <= page.totalpage; i++) {
        if (i == page.focus) {
          pgtpl.push('<li class="SG_pgon">' + i + '</li>');
        } else {
          pgtpl.push('<li><a href="#" action-type="facePageNums">' + i + '</a></li>');
        }
      }
      this.dialogNodes.pagelist.innerHTML = pgtpl.join("");
    } else {
      //隐藏分页
      this.dialogNodes.page.style.display = "none";
    }
  },
  //获取固定分页的表情数据
  getFaceListData: function(data, page) {
    var step = page.step;
    var total = page.total;
    var totalpage = page.totalpage;
    var focus = page.focus;
    if (focus < 1) {
      focus = 1;
    }
    if (focus > totalpage) {
      focus = totalpage;
    }
    var _data = step < total ? data.slice((focus - 1) * step, focus * step) : data;
    return _data;
  },
  //事件代理
  bindDelegateAction: function() {
    Core.Events.addEvent(this.dialogNodes.facelistbox, function(e) {
      insert(e); //插入表情
      bindPageEvent(e); //表情分页
    });

    var _this = this;
    //var datas = Lib.util.getActionData(e, "insert");

    function bindPageEvent(e) { //表情分页
      var datas = Lib.util.getActionData(e, "facePageNums");
      if (datas) {
        Core.Events.stopEvent(e);
        var focus = datas.targetEl.innerHTML;
        var page = _this._json.parse(_this.dialogNodes.page.getAttribute("data-page"));
        page.focus = focus - 0;
        _this.dialogNodes.page.setAttribute("data-page", _this._json.stringify(page));
        _this.initFaceListPage(page);
        var tabname = _this.dialogNodes.generaltabs.getAttribute("data-focustab");
        var data = _this.faceDatas.face[tabname];
        _this.updateGeneralFaceList(data, page);
      }
    }

    function insert(e) { //插入表情
      var datas = Lib.util.getActionData(e, "insert");
      if (datas) {
        var text = datas.data;
        var index = CommentV2.TextAreaUtils.selectionStart(_this._tarea);
        CommentV2.TextAreaUtils.insertText(_this._tarea, text, index);
        _this.dialog.hidden();
      }
    }
    Core.Events.addEvent(this.dialogNodes.facelistbox, function(e) {
      hover(e); //表情hover效果
    }, "mouseover");

    function hover(e) {
      var datas = Lib.util.getActionData(e, "insert");
      if (datas) {
        datas.targetEl.className = "hover";
      }
    }
    Core.Events.addEvent(this.dialogNodes.facelistbox, function(e) {
      out(e); //表情out效果
    }, "mouseout");

    function out(e) {
      var datas = Lib.util.getActionData(e, "insert");
      if (datas) {
        datas.targetEl.className = "";
      }
    }
  }
}