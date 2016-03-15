/**
 * @fileoverview
 *  转载
 * @author dg.liu | dongguang@staff.sina.com.cn
 *
 */
$import("sina/sina.js");
$import("lib/jobs.js");
$import("article/quote.js");
$import("sina/ui/Select.js");

$registJob("quote_new", function() {
  
  var Select = Sina.Ui.Select;

  QuoteSuccess.prototype._initSelect= function(model) {
    var me = this;
    if(this.select){
      this.select.render(model);
    }else{
      this.select = new Select($E('select_node'), {
        'triggerTpl': '<span>#{text}</span><a href="javascript:void(0);" class="down"><i class="icon i18_down_arr"></i></a>',
        'triggerClassName': 'menu',
        'triggerText': '默认文章分类',
        'optionTpl': '<li data-value="#{value}" data-defaultselected="#{defaultSelected}" data-selected="#{selected}" data-disabled="#{disabled}" data-text="#{text}"><a href="javascript:;" title="#{text}"><span>#{text}</span></a></li>',
        'name': 'cate_select',
        'model':model
      });
      this.select.addEventListener('change',function(curNode,preNode){
        me._dialog.nodes.selCate.value = me.select.getValue();
      });
    }
  };

  //重写转载成功浮出层
  QuoteSuccess.prototype._initCateList = function() {
    var nodes = this._dialog.nodes,
    me = this;
    nodes.selCate.length = 1;
    Lib.checkAuthor();
    App.getArticlesSort(function() {
      var list = x.data,
      i, len = list.length;
      for (i = 0; i < len; i++) {
        me.addCate(list[i].id, list[i].name);
      }
      me.addCate("0", "私密博文");
      me._initSelect(Select.convertSelectToModel(me._dialog.nodes.selCate));
    },
    $UID);
  };
  QuoteSuccess.prototype._initDialog = function() {
    var me = this;
    this._dialog = winDialog.createCustomsDialog({
      width: 458,
      content: ['<div class="e_layer_cont3">', '<p class="share_tit">', '<span class="share_icon"></span>转载成功！', '</p>', '<dl class="e_layer_share">', '<dt class="md">评论：</dt>', '<dd class="share_input"><textarea id="#{txtMemo}" cols="" rows="3">' + this.memoNullText + '</textarea></dd>', '</dl>', '<dl class="e_layer_share">', '<dt>分类：</dt>', '<select style="display:none;" id="#{selCate}" name=""><option value="00">默认文章分类</option></select>', '<dd class="share_select">', '<ul class="selected">', '<li class="s1" id="select_node"></li>', '<li style="display:none;"></li>', '</ul>', '</dd>', '</dl>', '<p class="share_p"><a href="#" id="#{btnShowCate}" onclick="return false;" class="share_sort">创建分类</a></p>', '<p class="share_btn">', '<a href="#" id="#{btnSave}" onclick="return false;" class="btn_style">保存</a>', '<a id="#{btnCancel}" onclick="return false;" href="#" class="btn_style">关闭</a>', '</p>', '</div>'].join("")
    });

    //事件绑定
    Core.Events.addEvent(this._dialog.nodes.btnSave, function() {
      if (me._dialog.nodes.txtMemo.value === me.memoNullText && me._dialog.nodes.selCate.selectedIndex === 0) {
        me.close();
      } else {
        me.verified() && me.save();
      }
    },
    "click");
    Core.Events.addEvent(this._dialog.nodes.btnCancel, function() {
      me.close();
    },
    "click");
    Core.Events.addEvent(this._dialog.nodes.btnShowCate, function() {

      window.CateDialog.onSuccess = function(res) {
        me._dialog.nodes.selCate.length = 1;
        var list = res || [],
        i,
        len = list.length;
        for (i = 0; i < len; i++) {
          me.addCate(list[i].value, list[i].label);
        }
        me.addCate("0", "私密博文");
        me._initSelect(Select.convertSelectToModel(me._dialog.nodes.selCate));
      };
      Lib.checkAuthor();
      window.CateDialog.show($UID);

    },
    "click");

    this._dialog.addEventListener("hidden", function() {
      me.clear();
      me.onClose();
    });

    //转载备注
    this._dialog.nodes.txtMemo.onblur = function() {
      if (this.value.replace(/\s/g, "") === "") {
        this.style.color = "#c8c8c8";
        this.value = me.memoNullText;
      }
    };
    this._dialog.nodes.txtMemo.onfocus = function() {
      if (this.value === me.memoNullText) {
        this.style.color = "#000000";
        this.value = "";
      }
    };

    this._initCateList();

    this._isDialogInit = true;
  };

  cateDialog.prototype.initDialog = function() {
    var me = this;
    var data = {
      width: 458,
      height: 0,
      url: "http://control.blog.sina.com.cn/admin/article/article_class_list.php?" + (this.action ? 'action=editor': '')
    };
    Lib.checkAuthor();
    this.url = "http://control.blog.sina.com.cn/admin/article/article_class_save2.php?uid=" + $UID + (this.action ? '&action=editor': '');

    this.id = Core.Math.getUniqueId();

    this.manage = null;
    this.manage = new cateMng(this.id, this.itemTpl, this.uid);
    this.manage.onSuccess = function(list) {
      me.onSuccess(list);
    };

    var temp = new Ui.Template("<div style='width: #{width}px; height: #{height}px;' id='category_" + this.id + "'></div>");
    var obj = {
      ad: false,
      drag: true,
      title: "分类管理",
      content: temp.evaluate(data),
      shadow: 1,
      width: data.width,
      height: data.height
    };

    var func = {};
    var dialog = winDialog.createCustomsDialog(obj, func);
    this.dialog = dialog;
    $E("category_" + this.id).innerHTML = this.tpl.join("");

    var _this = this;
    // 关闭对话框的操作
    this.dialog.nodes['btnClose'].href = "javascript:;";
    this.dialog.nodes['btnClose'].onclick = function() {
      if (_this.manage.getEdit()) {
        winDialog.confirm("是否保存此更改？", {
          funcOk: function() {
            _this.manage.saveHandler(_this.url);
          },
          funcCancel: function() {
            _this.close();
          },
          funcClose: function() {
            _this.dialog.show();
          },
          textOk: "是",
          textCancel: "否"
        });
      } else {
        _this.close();
      }
    };

    this.initEvent();

  };
  //重写创建分类浮层
  cateDialog.prototype.tpl = ['<div id="categoryBody" class="e_layer_cont3">', '<div id="categoryHead" class="manage_cont">', '<div class="manage_input"><input class="tag_input" type="text" maxlength="28" value="最多可输入14个中文字符" id="categoryName"/></div>', '<a id="categoryCreate" href="javascript:void(0);" class="manage_btn btn_style">创建分类</a>', '</div>', '<div style="margin:8px;color:red;" id="errTips"></div>', '<p class="bp">请用中文、英文或数字。</p>', '<form method="post" id="categoryForm" name="form">', '<div id="categoryList">', '<ul class="manage_ul" id="datalist">&nbsp;</ul>', '</div>', '<a id="categorySave" href="javascript:void(0);" class="manage_btn_a btn_style">保存设置</a>', '</form>', '</div>'];

  cateDialog.prototype.itemTpl = ['<li class="{class}">', '<a class="manage_l" href="javascript:void(0);" id="cate_{index}">{cate}</a>', '<input type="hidden" value="{cate}" name="typename[]" class="catName"/>', '<input type="hidden" value="{id}" name="number[]"/>', '<p id="ctrl_{index}" class="manage_r">', '<a class="m_word" id="edit_{index}" href="javascript:;" onclick="javascript:window.CateDialog.manage.editCate(this);">编辑</a>', '<a class="m_word" id="del_{index}" index="{index}" href="javascript:;" onclick="javascript:window.CateDialog.manage.delCate(this);">删除</a>', '<a id="up_{index}" class="m_icon m_up" href="javascript:;" onclick="javascript:window.CateDialog.manage.upHandler(this);"/>', '<a id="down_{index}" class="m_icon m_down" href="javascript:;" onclick="javascript:window.CateDialog.manage.downHandler(this);"/>', '</p>', '<p id="editctrl_{index}" class="manage_r" style="display:none">', '<input id="new_{index}" type="text" value=""/>', '<a class="m_word" href="javascript:;">确定</a>', '<a class="m_word" href="javascript:;">取消</a>', '<p/>', '</li>'];

  cateMng.prototype.dataProvider = function(){
    var _this = this;
    App.getArticlesSort(function(data) {
      //var cates = data;
      _this.list = data.data; //cates.c.cates; //flm
            _this.orilen = _this.list.length;
      $E("datalist").innerHTML = "";
      for(var i=0;i<_this.list.length;i++) {
        var tpl = _this.itemTpl.join("");
        var item = _this.list[i];
        tpl = tpl.replace(/\{cate\}/ig, item.name);
        tpl = tpl.replace(/\{class\}/ig, i%2==0?"":"m_a");
        tpl = tpl.replace(/\{id\}/ig, item.id);
        tpl = tpl.replace(/\{index\}/ig, i);
        tpl = tpl.replace(/\{up_class\}/, i==0?"up_disabled":"up");
        tpl = tpl.replace(/\{down_class\}/, i==_this.list.length-1?"down_disabled":"down");
        
        Core.Dom.addHTML($E("datalist"), tpl);
      }
      fixdataListHeight(_this.list.length);
    },this.uid);
  };

  function fixdataListHeight(len){
    if(len > 5){
      var liH = 40;
      $E('datalist').style.height = 40 * 5 + 'px';
      $E('datalist').style.overflowY = 'auto';
    }else{
      $E('datalist').style.height = '';
      $E('datalist').style.overflowY = '';
    }
    $E('datalist').scrollTop = 40 * 15; //max
  }

  cateMng.prototype.update = function(){
    $E("datalist").innerHTML = "";
    
    for(var i=0;i<this.list.length;i++) {
      var tpl = this.itemTpl.join("");
      var item = this.list[i];
      tpl = tpl.replace(/\{cate\}/ig, item.name);
      tpl = tpl.replace(/\{class\}/ig, i%2==0?"":"m_a");
      tpl = tpl.replace(/\{id\}/ig, item.id);
      tpl = tpl.replace(/\{index\}/ig, i);
      tpl = tpl.replace(/\{up_class\}/, i==0?"up_disabled":"up");
      tpl = tpl.replace(/\{down_class\}/, i==this.list.length-1?"down_disabled":"down");
      
      Core.Dom.addHTML($E("datalist"), tpl);
    }
    
    if(!this.edit) {
      this.edit = true;
    }

    fixdataListHeight(this.list.length);


  };

  cateMng.prototype.editCate = function(dom) {
    var _this = this;
    var index = dom.id.split("_")[1];
    var old = $E("cate_" + index).innerHTML;
    var li = $E("cate_" + index).parentNode;
    $E("ctrl_" + index).className = "control hide";
    li.className = index % 2 == 0 ? "editName": "m_a editName";

    var tpl = '<div id="editctrl_' + index + '"><span class="manage_l"><input id="new_' + index + '" type="text" value="' + old + '"></span><p class="manage_r"><a class="m_word" href="javascript:;">确定</a><a class="m_word" href="javascript:;">取消</a></p></div>';
    li.innerHTML = tpl;

    $E("new_" + index).onkeyup = function() {
      var re = /[ >&<\\\'\,\;\"`\|\t\r\n|\u3000]/ig;
      var value = Core.String.trim(this.value.replace(re, ""));
      if (value != this.value) {
        this.value = value;
      }

      if (value == "") {
        $E("editctrl_" + index).childNodes[1].disabled = true;
      }
      else {
        $E("editctrl_" + index).childNodes[1].disabled = false;
      }
    }
    $E("new_" + index).onblur = function() {
      if (Core.String.byteLength(this.value) >= 28) {
        this.value = Core.String.leftB(this.value, 28);
      }
    }

    $E("editctrl_" + index).childNodes[1].getElementsByTagName('a')[0].onclick = function() {
      if ($E("new_" + index).value == old) {
        setName(old, 2);
      }
      else {
        setName($E("new_" + index).value, 1);
      }
    };
    $E("editctrl_" + index).childNodes[1].getElementsByTagName('a')[1].onclick = function() {
      setName(old, 2);
    };

    function setName(nvl, type) {
      var value = nvl;
      var code = "";
      if (Core.String.byteLength(value) > 28) {
        value = Core.String.leftB(value, 28);
      }

      if (type == 1) {
        for (var i = 0; i < _this.list.length; i++) {
          if (_this.list[i].name == value) {
            code = "您已经添加过此分类";
            break;
          }
        }
      }

      if (code != "") {
        if (!$E("err_" + index)) {
          Core.Dom.addHTML($E("editctrl_" + index), '<div id="err_' + index + '" class="errTips">' + code + '</div>');
        } else {
          $E("err_" + index).value = code;
        }
      }
      else {
        _this.list[index].name = value;
        var tpl = _this.itemTpl.join("");
        tpl = tpl.replace('<li class="{class}">', '');
        tpl = tpl.replace('</li>');
        var item = _this.list[index];
        tpl = tpl.replace(/\{cate\}/ig, item.name);
        tpl = tpl.replace(/\{id\}/ig, item.id);
        tpl = tpl.replace(/\{index\}/ig, index);
        tpl = tpl.replace(/\{up_class\}/, index == 0 ? "up_disabled": "up");
        tpl = tpl.replace(/\{down_class\}/, index == _this.list.length - 1 ? "down_disabled": "down");
        li.innerHTML = tpl;
        li.className = index % 2 == 0 ? "": "m_a";
        if (type == 1) {
          _this.edit = true;
        }
      }

      code = "";
    }

  };

  $E("quote_set_sign") && (scope.article_quote = new Quote("quote_set_sign"));
  $E("quote_set_sign2") && (scope.article_quote = new Quote("quote_set_sign2"));

  if (!$E("quote_set_sign") && ! $E("quote_set_sign2")) { ! scope.article_quote && (scope.article_quote = new Quote());
    scope.articel_quote_alert = function(articleID) {
      scope.article_quote.check(articleID);
    };
  }
});

