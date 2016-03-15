/**
 * @fileoverview 弹出转载浮层
 * @author Qiangyee | wangqiang@staff
 * @date   2011-11-21
 */
$import("lib/jobs.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/getEventTarget.js");
$import("sina/core/dom/getXY.js");
$import("article/reblogToQing.js");
$import("article/quote.js");
$import("sina/utils/io/ajax.js");
$import("sina/core/string/j2o.js");
$import("other/SinaEx.js");
$registJob("renderReblogDiv", function() {
  var _addEvent = Core.Events.addEvent,
  _getEventTarget = Core.Events.getEventTarget,
  _getXY = Core.Dom.getXY,
  delegateEl, delegateElId, cls = '',
  isNew = (scope.$pageid == 'article_new' || scope.$pageid == 'articleM_new'),
  reblogDivId = "reblog_" + ( + new Date);
  //新模版样式
  if (isNew) {
    cls = 'oper_list';
  }
  // 以前的顺序 0转载到qing 1转载到博客 2转载原文 3采编 4发布长微博
  // qing下线后 0转载到博客 1转载原文 2长微博
  var reblogDivInnerHTML = '<ul class="' + cls + '">'+ '<li>' + '<a suda-uatrack="key=blog_article&value=h_article17" action-type="click_reblog" action-data="{action:\'toBlog\'}" href="javascript:void(0);" title="转载到博客">' + (isNew ? '': '<img width="18" height="18" align="absmiddle" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" class="SG_icon SG_icon141"/>') + '博客' + '</a>' + '</li>' + '<li style="display:none;">' + '<a suda-uatrack="key=blog_article&value=h_article17" action-type="click_reblog" action-data="{action:\'toBlog\'}" href="javascript:void(0);" title="转载原文">' + (isNew ? '': '<img width="18" height="18" align="absmiddle" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" class="SG_icon SG_icon141"/>') + '转载原文' + '</a>' + '</li>' + '<li>' + '<a suda-uatrack="key=blog_article&value=h_article17" action-type="click_reblog" action-data="{action:\'cwb\'}" href="javascript:;" title="发布长微博">' + (isNew ? '': '<img width="18" height="18" align="absmiddle" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" class="SG_icon SG_icon143"/>') + '长微博' + '</a>' + '</li>' + '</ul>';

  //    var reblogDiv = $C("DIV");
  //    reblogDiv.className = "turnList";
  //    reblogDiv.style.display = "none";
  //    reblogDiv.style.position = "absolute";
  //    reblogDiv.style.zIndex = 20;
  //    reblogDiv.innerHTML = reblogDivInnerHTML;
  //    reblogDiv.id = reblogDivId;
  var reblogDiv = SinaEx.createNode('<div id="' + reblogDivId + '" class="turnList" style="display:none;position:absolute;z-index:20;">' + reblogDivInnerHTML + '</div>');
  document.body.appendChild(reblogDiv);

  // 获取事件代理的节点
  var getActionData = Lib.util.getActionData;

  var sinablogbody = $E("sinablogbody");

  var idCard, reblogBtn;
  var isIdCard = false; // 是否为小编
  var isValidateIdentity = 0;
  var onMouseOverReblogBtn = function(e) {
    var srcEl = $E(this.id),
    tEl = _getEventTarget(e);

    var eventData = getActionData(e, "reblog");
    if (!eventData) {
      return;
    }

    $E("sinablogbody").setAttribute("ismouseover", "1");
    var data = eval('(' + eventData.data + ')');

    reblogBtn = eventData.targetEl.parentNode.parentNode;
    setTimeout(function() {
      var isMouseHover = $E("sinablogbody").getAttribute("ismouseover") || 0;
      isMouseHover = parseInt(isMouseHover) || parseInt($E(reblogDivId).getAttribute("ismouseover") || 0);

      if (!isMouseHover) {
        return;
      }
      if(isNew){
        eventData.targetEl.className = 'lk_a lka_last lka_hover';
      }
      var reblogDiv = $E(reblogDivId),
      pos = _getXY(eventData.targetEl);
      reblogDiv.style.display = "";
      reblogDiv.style.top = (pos[1] + 23) + 'px';
      if ($IE6 || $IE7) {
        reblogDiv.style.left = (pos[0] - 2) + 'px';
      } else {
        reblogDiv.style.left = pos[0] + 'px';
      }

      reblogDiv.setAttribute("blogId", data.blogId);
      // 多次切换转载按钮式，IE7和IE6博文两个字会消失，
      // 因此加上timeout让js执行完后再显示转载到博客的按钮
      Lib.checkAuthor();
      // var editorState = reblogDiv.children[0].children[3].children[0];
      // if (!reblogBtn.getAttribute("isreblog")) {
      //   editorState.innerHTML = isNew ? '采编' : '<img width="18" height="18" align="absmiddle" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" class="SG_icon SG_icon142"/>采编';
      // } else {
      //   editorState.innerHTML = isNew ? '已采编' : '<img width="18" height="18" align="absmiddle" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" class="SG_icon SG_icon142"/>已采编';
      // }
      var sameVariable = reblogDiv.children[0];
      setTimeout(function() {
        // debugger
          // 以前的顺序 0转载到qing 1转载到博客 2转载原文 3采编 4发布长微博
          // qing下线后 0转载到博客 1转载原文 2长微博


        // if (data.srcBlog) {
        //   reblogDiv.children[0].children[2].style.display = "none";
        //   if ($isAdmin) { //博主看自己的文章，只显示转载到qing
        //     sameVariable.children[1].style.display = "none";
        //   } else {
        //     sameVariable.children[1].style.display = "";
        //   }
        // } else {
        //   sameVariable.children[1].style.display = "none";
        //   if ($isAdmin) {
        //     sameVariable.children[2].style.display = "none";
        //   } else {
        //     sameVariable.children[2].style.display = "";
        //   }

        // }
        if (data.srcBlog) {
          sameVariable.children[1].style.display = "none";
        } else {
          sameVariable.children[0].style.display = "none";
          if ($isAdmin) {
            sameVariable.children[1].style.display = "none";
          } else {
            sameVariable.children[1].style.display = "";
          }

        }

        // if (data.srcBlog == "0") { //转载
        //   sameVariable.children[3].style.display = "none";
        // }

        //请求接口，点击采编时，获取是哪个标签下的小编
        if (isIdCard && reblogBtn.getAttribute("isshow")) {
          return;
        }

        if (data.srcBlog == "1" && $isLogin) {
          if (isValidateIdentity) {
            return;
          }
          Utils.Io.Ijax.request("http://control.blog.sina.com.cn/blog_rebuild/riaapi/blog/qingEditing.php", {
            onComplete: function(data) {
              var result = Core.String.j2o(data);
              if (result.code === "A00006") {
                idCard = result.data.message;
                if (idCard) {
                  sameVariable.children[3].style.display = "";

                }
              }
              isIdCard = true;
              reblogBtn.setAttribute("isshow", "1");
            }
          });
        }
        // } else {
        //   sameVariable.children[3].style.display = "none";
        // }

      },
      2);
    },
    400);
  }

  var onMouseOutReblogBtn = function(e) {
    var srcEl = $E(this.id),
    tEl = _getEventTarget(e);

    var eventData = getActionData(e, "reblog");
    if (!eventData) {
      return;
    }
    $E("sinablogbody").setAttribute("ismouseover", "0");

    var timer = $E("sinablogbody").getAttribute("timer");
    if (timer) {
      return;
    }
    var timer = setInterval(function() {
      var isMouseHover = $E("sinablogbody").getAttribute("ismouseover") || 0;
      var isReblogDivMouseHover = $E(reblogDivId).getAttribute("ismouseover") || 0;
      isMouseHover = parseInt(isMouseHover) || parseInt(isReblogDivMouseHover);
      if (!isMouseHover) {
        $E(reblogDivId).style.display = "none";
        $E("sinablogbody").removeAttribute("timer");
        if(isNew){
          eventData.targetEl.className = 'lk_a lka_last';
        }
        clearInterval(timer);
      }
    },
    1000);
  }
  var MOUSEOVER = "mouseover";
  var MOUSEOUT = "mouseout";
  // 博客个人首页博文组件有很多个
  var addModuleMouseEvent = function(moduleId) {
    if (!$E(moduleId)) {
      trace("没有组件：" + moduleId);
      return;
    }

    try {
      if (scope.$pageid === "articletjTech" || scope.$pageid == 'article_new' || scope.$pageid == 'articleM_new') {
        moduleBody = $E(moduleId);
        _addEvent(moduleBody, Core.Function.bind2(onMouseOverReblogBtn, moduleBody), MOUSEOVER);
        _addEvent(moduleBody, Core.Function.bind2(onMouseOutReblogBtn, moduleBody), MOUSEOUT);
      }

      var moduleBody = $E(moduleId).children[1];
      if (moduleBody && "SG_connBody" == moduleBody.className) {
        moduleBody.id = moduleId + "_SG_connBody";
        _addEvent(moduleBody, Core.Function.bind2(onMouseOverReblogBtn, moduleBody), MOUSEOVER);
        _addEvent(moduleBody, Core.Function.bind2(onMouseOutReblogBtn, moduleBody), MOUSEOUT);
      }

    } catch(e) {
      trace("注册转载博问按钮事件代理出错，组件ID：" + moduleId);
    }
  }

  addModuleMouseEvent("module_10001");
  addModuleMouseEvent("module_10002");
  addModuleMouseEvent("module_10003");
  // 博文正文页
  addModuleMouseEvent("module_920");
  // 夹页正文页
  addModuleMouseEvent("module_921");
  //tj=tech页 转载浮层
  addModuleMouseEvent("module_3001_SG_connBody");
  //新模版
  addModuleMouseEvent("module_920_SG_connBody");

  //用户在弹出浮层的鼠标滑动处理
  var onMouseOverReblogDiv = function(e) {
    $E(reblogDivId).setAttribute("ismouseover", 1);
  }

  var onMouseOutReblogDiv = function(e) {
    $E(reblogDivId).setAttribute("ismouseover", 0);
  }

  _addEvent(reblogDiv, onMouseOverReblogDiv, MOUSEOVER);

  _addEvent(reblogDiv, onMouseOutReblogDiv, MOUSEOUT);

  ! scope.article_quote && (scope.article_quote = new Quote());
  scope.articel_quote_alert = function(articleID) {
    scope.article_quote.check(articleID);
  };
  function showError(icon, ico) {
    if (icon.message) {
      var msg = icon.message;
    }
    winDialog.alert(msg, {
      icon: ico || "01"
    });
  }
  var reblogToQing = new ReblogToQing();
  // 用户点击转载按钮呢处理
  var reblog = function(e) {
    //console.dir(this.prototype.constructor);
    var srcEl = $E(reblogDivId),
    tEl = _getEventTarget(e);

    var eventData = getActionData(e, "click_reblog");
    if (!eventData) {
      return;
    }
    if (reblogBtn.getAttribute("isreblog") === "1") {
      return;
    }
    var blogId = $E(reblogDivId).getAttribute("blogId"),
    data = eval('(' + eventData.data + ')');
    // if ("toQing" === data.action) {
      // reblogToQing.reblog(blogId);
    // else 
    if ("cwb" === data.action) {
      window.open('http://control.blog.sina.com.cn/admin/article/changWeiBo.php?url=' + encodeURIComponent("http://blog.sina.com.cn/s/blog_" + blogId + ".html"));
    // } 
    // else if ("editor" === data.action) {
    //   winDialog.confirm("确定采编至 #" + idCard + " 标签下", {
    //     icon: "04",
    //     funcOk: function() {
    //       var url = "http://control.blog.sina.com.cn/blog_rebuild/riaapi/blog/editing2qing.php?rnd=" + ( + new Date);
    //       Utils.Io.Ijax.request(url, {
    //         POST: {
    //           blogId: blogId
    //         },
    //         returnType: 'json',
    //         onComplete: function(data) {
    //           var result = Core.String.j2o(data);
    //           if (result && result.code === "B00015") {
    //             winDialog.alert("采编 #" + idCard + " 成功", {
    //               icon: "03"
    //             });
    //             tEl.innerHTML = '<img width="18" height="18" align="absmiddle" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" class="SG_icon SG_icon142"/>已采编';
    //             reblogBtn.setAttribute("isReblog", "1");
    //           } else if (result && result.code) {
    //             showError(result.data, "01");
    //           } else {
    //             winDialog.alert("系统繁忙，请稍后在试！", {
    //               icon: "01"
    //             });
    //           }
    //         }
    //       });
    //     },
    //     funcClose: function() {},
    //     textOk: '确定',
    //     isAdamant: $IE
    //   });
    } else {
      scope.articel_quote_alert(blogId);
    }
    v7sendLog && v7sendLog('79_01_22', scope.$pageid, 'qingLink');
  }
  _addEvent(reblogDiv, reblog, "click");
  reblogDiv = null;
  delegateEl = null;

});

