/**
 * @fileoverview 博客新浮层样式模板，统一管理 , 重写DialogTemplate
 * @author fuqiang3
 * @date 2014-07-30
 */

$import('lib/login/ui.js');
$import('lib/dialogConfig.js');

;
(function () {

  DialogTemplate.alert = DialogTemplate.newAlert = '<div id="#{panel}" class="e_layer_prompt" style="width:458px;">\
                            <div id="#{titleBar}" class="e_prompt_header">\
                              <div class="e_prompt_tit" id="#{titleName}"></div>\
                              <a href="javascript:void(0)" class="e_prompt_close" id="#{btnClose}">&times;</a>\
                             </div>\
                            <div id="#{content}" class="e_prompt_cont e_pro_align">\
                              <p id="#{text}" class="e_prompt_word"></p>\
                              <p id="#{subText}" style="margin-bottom:20px;"></p>\
                              <a id="#{btnOk}" class="e_prompt_btn" href="#" onclick="return false;">确定</a>\
                            </div>\
                          </div>';

  DialogTemplate.confirm = DialogTemplate.newConfirm = '<div id="#{panel}" class="e_layer_prompt" style="width:458px;">\
                            <div id="#{titleBar}" class="e_prompt_header">\
                              <div class="e_prompt_tit" id="#{titleName}"></div>\
                              <a href="javascript:void(0)" class="e_prompt_close" id="#{btnClose}">&times;</a>\
                             </div>\
                            <div id="#{content}" class="e_prompt_cont e_pro_align">\
                              <p id="#{text}" class="e_prompt_word"></p>\
                              <p id="#{subText}" style="margin-bottom:20px;"></p>\
                            </div>\
                            <div class="prompt_btn">\
                              <a id="#{btnOk}" class="btn_style" href="#" onclick="return false;">确定</a>\
                              <a id="#{btnCancel}" class="btn_style" href="#" onclick="return false;">取消</a>\
                            </div>\
                          </div>';

  DialogTemplate.customs = '<div id="#{panel}" class="BNE_e_layer">\
                              <div class="e_layer_header" id="#{titleBar}">\
                                  <div class="e_layer_tit" id="#{titleName}"></div>\
                                  <a href="javascript:void(0)" class="e_layer_close" id="#{btnClose}">&times;</a>\
                              </div>\
                              <div id="#{content}"></div>\
                          </div>';

  // 重写setSize方法，因为设置content的宽度，ie6下外层依然为全屏宽度
  if ($IE6 || $IE7) {
    Ui.Dialog.prototype.setSize = function (p) {
      !this.__isInited && this.__initEntity();
      if (this.nodes.panel) {
        typeof p.width !== "undefined" && (this.nodes.panel.style.width = p.width + "px");
        typeof p.height !== "undefined" && (this.nodes.panel.style.height = p.height + "px");
      } else {
        typeof p.width !== "undefined" && (this.__entity.panel.width = p.width + "px");
        typeof p.height !== "undefined" && (this.__entity.panel.height = p.height + "px");
      }
      return this;
    }
  }

  //重写登陆浮出层
  Lib.Login.Ui.prototype.tpl = DialogTemplate.custom;
  Lib.Login.Ui.prototype.struc = '<div class="e_layer_cont3">\
                                    <div class="login_input">\
                                      <label class="login_icon icon_a"></label>\
                                        <input disableautocomplete class="tag_input" autocomplete="off" type="text" tabIndex="201" name="login_name" id="login_name_d" tabIndex="1"/>\
                                    </div>\
                                    <div class="login_input input_top">\
                                      <label class="login_icon icon_b"></label>\
                                        <input class="tag_input" type="password" name="login_pass" maxlength="16" id="login_pass_d" tabIndex="202"/>\
                                    </div>\
                                    <div class="login_code" id="login_ckimg" style="display:none;">\
                                        <input type="text" id="login_vcode" name="login_vcode" class="code_input" size="10" maxlength="5" />\
                                        <img width="100" class="img_code" align="absmiddle" id="checkImg" src="http://login.sina.com.cn/cgi/pin.php?r=' + Core.Math.getUniqueId() + '&s=0" />\
                                        <a href="javascript:;" class="replace_a" onclick="return false;"><span id="reloadCode">换一换</span></a>\
                                    </div>\
                                    <div class="lp"><p class="l"><input value="" type="checkbox" id="login_save" checked="checked" tabIndex="203" class="l_box"/>记住登录状态</p><p id="login_save_tips" class="r"><a href="" title="">立即注册</a><a href="" title="">找回密码</a></p></div>\
                                    <div style="color:red;margin-top:5px;" id="login_div_error"></div>\
                                    <a href="javascript:;" id="login_button" class="login_btn btn_style">登录</a>\
                                    <div class="lp"><p class="msn">使用MSN账号登录博客</p>\
                                        <a href="http://blog.sina.com.cn/s/blog_4b0f52990100miil.html" target="_blank" class="how">如何登录？</a>\
                                        <a href="#" class="msn_btn" onclick="Lib.checkAuthor();v7sendLog(\'48_01_36\'); window.open(\'https://login.live.com/oauth20_authorize.srf?client_id=0000000040046F08&redirect_uri=http%3A%2F%2Fcontrol.blog.sina.com.cn%2Fblog_rebuild%2Fmsn%2FmsnLoginCallBack.php&response_type=code&scope=wl.basic%20wl.signin%20wl.offline_access%20wl.share%20wl.emails\',\'neww\',\'left=' + (screen.width - 440) / 2 + ',top=' + (screen.height - 400) / 2 + ',height=400,width=440\');msnrefreshWindow();">登录</a>\
                                    </div>\
                                  </div>\
                                  <div class="login_footer">\
                                      <iframe id="login_ad" src="http://blog.sina.com.cn/lm/iframe/71/2008/0731/21.html" frameborder="0" scrolling="no" height="25" width="auto"></iframe>\
                                  </div>';

  //重写开通博客
  if (scope.blogOpener) {

    function checkBlogName(inputEle, errEle, icon) {
      //此处去掉超时处理
      // if(typeof ttm != 'undefined') {
      //  clearTimeout(ttm);
      // }
      // ttm = setTimeout(function(){
      var val = inputEle.value;
      if (/^(?:\s|[　])+|(?:\s|[　])+$/.test(val)) {    //非字符键也响应赋值，光标会变。
        inputEle.value = Core.String.trim(val); //trim
        val = inputEle.value;
      }
      if (val) {
        var nameLen = Core.String.byteLength(val);
        if (nameLen > 24) {
          showError(errEle, '博客名称超长', icon);
        } else {
          hiddenError(errEle, icon);
          //activePass = true;
        }
      } else {
        //inputEle.value = getShotName();
        //hiddenError(errEle,icon);
        showError(errEle, '博客名称不能为空', icon);
        //activePass = true;
      }
      // }, 500);
    }

    function showError(ele, str, icon) {
      ele.innerHTML = str;
      ele.style.display = 'block';
      if (ele.id.indexOf("ErrTips") >= 0) {
        ele.style.visibility = "visible";
      }
      if (icon) {
        icon.className = "SG_icon SG_icon48 tips";
      }
    }

    function hiddenError(ele, icon) {
      ele.innerHTML = '';
      ele.style.display = 'none';
      if (icon) {
        icon.className = "SG_icon SG_icon49 tips";
      }
    }

    function getKeyName() {
      var key = decodeURIComponent(Utils.Cookie.getCookie('SUP'));
      key = key.split('&name=')[1];
      key = decodeURIComponent(key.split('&')[0]);
      return key;
    }

    scope.blogOpener._initDialog = function () {
      Lib.checkAuthor();
      this.key = getKeyName();
      this._dialog = winDialog.createCustomsDialog({
        content: this.getCon(),
        width  : 458
      }, "openblog");
      this.bindEvent();
      scope.openBlogNameEvent($E('blogNameInput_t'), $E('blogNameError_t'), [], $E('blogNameIcon_t'));
    };

    scope.blogOpener.getCon = function () {
      return [
        '<div class="e_layer_cont3">', '<p class="open_tit">您的博客尚未开通,仅一步操作就能开通您的个人博客</p>',
        '<dl class="e_layer_open">', '<dt class="md">博客名称：</dt>',
        '<dd><div class="open_input"><input id="blogNameInput_t" class="tag_input" type="text"></div></dd>',
        '<img style="display:none" id="blogNameIcon_t" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" width="15" height="15" class="SG_icon SG_icon49 tips">',
        '<dd id="blogNameError_t" style="color:red;margin:10px 0 0 80px;">博客名称不能为空</dd>', '</dl>',
        '<dl class="e_layer_open">', '<dt>隐私设置：</dt>', '<dd>',
        '<input type="radio" class="open_box" checked="checked" id="openAll1_t" name="isPrivate_t">',
        '<span class="open_word">对所有人开放</span>',
        '<input type="radio" class=""open_box name="isPrivate_t" id="openMe1_t">',
        '<span class="open_word">仅对自己开放，私密博客</span>', '</dd>',
        '<dd id="ErrTips_t"  style="color:red;margin-top:10px;">系统繁忙，请稍后再试</dd>', '</dl>',
        '<div class="open_btn">',
        '<a href="javascript:void(0)" class="btn_style" id="openBlogOkBtn_t">完成开通</a>',
        '<a href="javascript:void(0)" class="btn_style" id="openBlogCancel">取消</a>', '</div>', '</div>'
      ].join(' ');
    };

    scope.openBlogNameEvent = function (inputEle, errEle, optArr, icon) {
      inputEle.onblur = function () {
        checkBlogName(inputEle, errEle, icon);
      };
      inputEle.onkeyup = function () {
        checkBlogName(inputEle, errEle, icon);
      };
    };

  }

  Lib.Login.Ui.prototype.initDom = function () {
    var me = this;
    this.dialog = winDialog.createCustomsDialog({
      width: 458,
      tpl  : me.tpl
    });
    this.dialog.addEventListener("hidden", function () {
      this.destroy();
    });
    this.dialog.setContent(this.struc);
    this.dialog.setTitle("登录新浪博客");
    this.dialog.setMiddle();
  };

  //重写ModuleDIalog
  var oldAlert = Ui.ModuleDialog.prototype.alert;
  Ui.ModuleDialog.prototype.alert = function (text, cfg) {
    if (cfg) delete cfg.width;
    if (!cfg) cfg = {}; // 有时候cfg是空的
    cfg.zIndex = 100000;
    oldAlert.call(this, text, cfg);
  };
  var oldConfirm = Ui.ModuleDialog.prototype.confirm;
  Ui.ModuleDialog.prototype.confirm = function (text, cfg) {
    if (cfg) delete cfg.width;
    if (!cfg) cfg = {}; // 有时候cfg是空的
    cfg.zIndex = 100000;
    oldConfirm.call(this, text, cfg);
  };


  // 验证码浮层
  if (typeof scope.xssSafeCodeDiag == 'undefined') {
    Core.Events.addEvent(window, function(){
      var safeimgsrc = 'http://interface.blog.sina.com.cn/riaapi/checkwd_image.php';
      var tpl = '<div id="#{panel}" class="e_layer_prompt" style="width:458px;">' + '<div id="#{titleBar}" class="e_prompt_header">' + '<div class="e_prompt_tit" id="#{titleName}">提示</div>' + '<a href="javascript:void(0);" class="e_prompt_close" id="#{btnClose}">×</a>' + '</div>' + '<div id="#{content}">' + '</div>' + '</div>';

      var content = '<div class="e_prompt_cont">' + '<div class="prompt_input">' + '<label class="txt">请输入验证码</label>' + '<input class="code_input" type="text" name="checkword" id="xssSafeCodeDiag_checkword">' + '<a href="javascript:scope.xssSafeCodeDiag.changeSafeCode();void(0);"><img id="xssSafeCodeDiag_safeimg" src="http://simg.sinajs.cn/blog7style/images/common/yzm1.gif" class="img_code" alt="" width="58" height="20" align="absmiddle"></a>' + '<a class="replace_a" href="javascript:scope.xssSafeCodeDiag.changeSafeCode();void(0);">换一个</a>' + '</div>' + '<div class="prompt_btn">' + '<a id="xssSafeCodeDiag_okbtn" href="javascript:scope.xssSafeCodeDiag.ok();void(0);" class="btn_style">确定</a>' + '<a id="xssSafeCodeDiag_cancelbtn" href="javascript:scope.xssSafeCodeDiag.cancel();void(0);" class="btn_style">取消</a></div>' + '</div>';

      scope.xssSafeCodeDiag = winDialog.createCustomsDialog({
        tpl                : tpl,
        title              : "提示",
        content            : content,
        // width: 400,
        // height: 210,
        funcDisplayFinished: function () {
        }
      }, "note");
      scope.xssSafeCodeDiag.changeSafeCode = function () {
        $E('xssSafeCodeDiag_checkword').value = '';
        $E('xssSafeCodeDiag_safeimg').src = safeimgsrc + "?r=" + Math.random();
      }
      scope.xssSafeCodeDiag.ok = function () {
        var v = $E('xssSafeCodeDiag_checkword').value;
        if (v === '') {
          scope.xssSafeCodeDiag.hidden();
          //显示请输入验证码
          winDialog.alert("请输入验证码。", {
            textOk: '确定',
            icon  : '01',
            funcOk: function () {
              // needSafeCode();
              scope.xssSafeCodeDiag.showDiag();
            }
          });

          return;
        }
        if (typeof $E("editorForm").checkword == 'undefined' || $E("editorForm").checkword == null) {
          var input;

          if ($IE && $IE<9){// 默认$IE为0  所以只有后面的一个判断是不行的
                        input = document.createElement('<input value="' + v + '" type="hidden" name="checkword" />');
                    }else{
                        input = document.createElement('input');
                    }
                    $E("editorForm").appendChild(input);
          input.name = 'checkword';
          input.type = "hidden";
          input.value = v;
        }
        $E("editorForm").submit();
        scope.xssSafeCodeDiag.hidden();
        $E("editorForm").removeChild($E("editorForm").checkword);
        $E("editorForm").checkword = null;
      }
      scope.xssSafeCodeDiag.cancel = function () {
        scope.xssSafeCodeDiag.hidden()
      }
      scope.xssSafeCodeDiag.showDiag = function () {
        scope.xssSafeCodeDiag.show();
        scope.xssSafeCodeDiag.setMiddle();
        scope.xssSafeCodeDiag.changeSafeCode();
      }


      Core.Events.addEvent($E('xssSafeCodeDiag_checkword'), function () {
        if (typeof scope.xssSafeCodeDiag.keydownFn == 'undefined') {
          scope.xssSafeCodeDiag.keydownFn = function (e) {
            e = e || window.event;
            var kc = e.keyCode || e.charCode;
            if (kc == '13') {
              scope.xssSafeCodeDiag.ok();
            }
          }
          Core.Events.addEvent($E('xssSafeCodeDiag_checkword'), scope.xssSafeCodeDiag.keydownFn, 'keydown');
        }
      }, 'focus');

      Core.Events.addEvent($E('xssSafeCodeDiag_checkword'), function () {
        if (typeof scope.xssSafeCodeDiag.keydownFn != 'undefined') {
          Core.Events.removeEvent($E('xssSafeCodeDiag_checkword'), scope.xssSafeCodeDiag.keydownFn, 'keydown');
          scope.xssSafeCodeDiag.keydownFn = null;
        }
      }, 'blur');
    }, 'load');

  }

})();

