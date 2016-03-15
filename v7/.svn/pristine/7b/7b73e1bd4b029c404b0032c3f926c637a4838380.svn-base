/*
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 */
/** 
 * @fileoverview 评论发表
 * @author stan | chaoliang@staff.sina.com.cn
 * @modified xy xinyu@staff.sina.com.cn
 */
$import("sina/core/events/addEvent.js");
$import("sina/core/events/fireEvent.js");
$import("sina/core/dom/getTop.js");
$import("sina/core/dom/getLeft.js");
$import("sina/core/system/br.js");
$import("sina/core/dom/getTop.js");
$import("lib/jobs.js");
$import("lib/checkAuthor.js");
$import("lib/component/face/face.js");
$import("lib/showError.js");
$import("lib/uic.js");
$import("lib/blogv/getVHTML.js");
$import("lib/sendLog.js");

$import("tempLib/insertSmiles/insertSmileFormInitV2.js");
$import("lib/insertSmiles/insertSmileFormInit.js");
$import("lib/dialogConfig.js");
$import("lib/commentv2/post.js");
$import("lib/commentv2/faceTemplate.js");
$import("lib/commentv2/count.js");
$import("lib/commentv2/insertSmile.js");
$import("lib/commentv2/checkUserProduct.js");
$import("lib/commentv2/commentQuote.js");
$import("lib/commentv2/bindEmailPanel.js");
$import("lib/login/ui.js");

$import('lib/commentv2/geetest.js');

$registJob('articleCommentPostV2_new', function() {

  // 判断是否使用geetest验证码，因为还要兼容老验证码！！！
  var isGeetest = false;
  if($E('geetest-box')) {
    isGeetest = true;
  }

  if(!isGeetest) {
    if (!$E("comment_check_img")) {
      return;
    }
  }

  //提示用户开通博客，匿名状态下去除此框
  if (scope.$private.cms != 1 && scope.$isCommentAllow != 1) { //代表不能评论，因此不执行，0代表可以评论，所以才执行以下代码

    var fresh_chk = false;
    var geetest = null;

    if(!isGeetest) {
      $E("comment_check_img").style.display = "none";
    }else {
      // 引入geetest验证码
      $E('geetest-box').style.padding = '5px 50px 0 0';
      geetest = new CommentV2.Geetest('#geetest-box');
    }

    var CommentPost = new CommentV2.Post();

    //登录处绑定事件-------------------------------------
    if(!isGeetest) {
      var refreshCheckImg = function() {
        if ($IE8) {
          $E("comment_check_img").src = "http://interface.blog.sina.com.cn/riaapi/checkwd_image_ie8.php?" + new Date().valueOf();
        } else {
          $E("comment_check_img").src = "http://interface.blog.sina.com.cn/riaapi/checkwd_image.php?" + new Date().valueOf();
        }
        swapView("img");
      };
      function swapView(type) {
        var t = type || "check";
        if (t == "img") {
          $E("comment_check_img").style.display = "inline";
          $E("check_img").style.display = "inline";
        }
        else {
          $E("comment_check_img").style.display = "none";
        }
      }
    }
    
    CommentPost.articleid = scope.$articleid;

    CommentPost.onSuccess = function() {
      if (scope.commEditor) {
        scope.commEditor.clearHTML('postCommentIframe');
      }
      $E("commentArea").value = "";
      if(!isGeetest) {
        $E("login_check").value = "";
      }
      if (is_mobile && mbCmtTa) {
        mbCmtTa.value = "";
      }
      // 新版 评论成功后+1
      var str = $E('blog_comments_num').innerHTML;
      var num = parseInt(str, 10);
      num = (num++) > 999 ? '999+' : num;
      $E('blog_comments_num').innerHTML = num;

      // 评论成功后也不显示评论内容 
      // if ($E('article_comment_list') && $E('article_comment_list').style.display == 'none'){
      //   $E('article_comment_list').style.display = '';
      //   $E('hide_blog_comments').style.display = '';
      //   $E('show_blog_comments').innerHTML = '收起<i class="com_btn_ico2"></i>';
      // }

      if(!isGeetest) {
        refreshCheckImg();
        swapView();
      }else {
        // 刷新geetest验证码
        geetest.geetestObj.refresh();
      }

      winDialog.alert("评论成功！");
      // 如果评论列表展开，定位到评论的位置
      var commentList = $E('article_comment_list'),
          comments = $E('article_comment_list').children,
          lastNode = comments[comments.length-1];
      if (commentList && (commentList.style.display != 'none')){
        var top = Core.Dom.getTop(lastNode);
        top -= 100;
        if (document.documentElement.scrollTop){
          document.documentElement.scrollTop = top;
        }else{
          document.body.scrollTop = top;
        }
      }
    };

    CommentPost.onError = function() {
      if(!isGeetest) {
        refreshCheckImg();
      }else {
        // 刷新geetest验证码
        geetest.geetestObj.refresh();
      }
    };

    var getIframeDocument = function(element) {
        return  element.contentDocument || element.contentWindow.document;
    };

    function hiddenScroll(postdoc){
      $E('postCommentIframe').setAttribute('scrolling','no');
      $E('postCommentIframe').setAttribute('seamless','seamless');
      $E('postCommentIframe').style.overflowY = 'hidden';
      postdoc.body.style.height = 'auto';
      postdoc.body.style.overflowY = 'hidden';
    }

    function showScroll(postdoc){
      $E('postCommentIframe').setAttribute('scrolling','yes');
      $E('postCommentIframe').setAttribute('seamless','');
      $E('postCommentIframe').style.overflowY = 'auto';
      postdoc.body.style.overflowY = 'auto';
    }

    if (!$E('postCommentIframe')) {
      Core.Events.addEvent("commentArea", function() {
        if(!isGeetest) {
          if (fresh_chk) {
            return;
          }
          refreshCheckImg();
          fresh_chk = true;
        }
      },
      'focus');
    }else{
      var postdoc = getIframeDocument($E('postCommentIframe'));
      setInterval(function(){
        var pageHeight = postdoc.body.scrollHeight - 20;
        var iframeHeight = 72;
        if(pageHeight > iframeHeight){
          showScroll(postdoc);
        }else{
          hiddenScroll(postdoc);
        }
      },200);
      $E('commonComment').parentNode.id = 'commentComment';
    }

    //给iframe禁用滚动条

    //ifrmame 的展开验证码事件
    /*
         Core.Events.addEvent($E("postCommentIframe").contentWindow.document.body, , 'focus');
         */
    if(!isGeetest) {
      Core.Events.addEvent("login_check", function() {
        if (fresh_chk) {
          return;
        }
        refreshCheckImg();
        fresh_chk = true;
      },
      'focus');

      Core.Events.addEvent("comment_check_img", function() {
        refreshCheckImg();
      },
      'mousedown');

      Core.Events.addEvent("check_img", function() {
        refreshCheckImg();
      },
      'mousedown');
    }

    var is_mobile = /Mobile/i.test(navigator.userAgent);

    //提交事件---------------------------------------------------
    var savefunc = function() {
      // geetest验证码结果
      var geetestValidate = false;
      if(isGeetest && geetest) {
        if(geetest.geetestObj) {
            geetestValidate = geetest.geetestObj.getValidate();
        }
      }

      if (Core.Events.getEvent()) {
        var e = Core.Events.getEvent();
        if (e.type == 'keydown' && e.keyCode != 13) {
          return;
        } else if (e.type == 'keydown' && e.keyCode == 13) {
          if (scope.commEditor) {
            scope.commEditor.handleChange("postCommentIframe");
          }
        }
        Core.Events.stopEvent();
      }

      if (!$isLogin) {
        //弹登陆浮层
        winDialog.alert('请先登陆');
        return;
      }

      if (is_mobile && mbCmtTa) {
        $E("commentArea").value = mbCmtTa.value;
      }

      if (Core.String.trim($E('commentArea').value) === "") {
        //评论内容为空
        showError($SYSMSG.B36105);
      }
      else if (!isGeetest && Core.String.trim($E('login_check').value) === "") {
        //验证码为空
        winDialog.alert($SYSMSG.B36106, {
          funcOk: function() {
            $E("login_check").value = "";
            $E("login_check").focus();
          }
        });
      }
      else if(isGeetest && !geetestValidate) {
          // 判断geetest验证码是否正确
          winDialog.alert('请拖动滑块完成验证。', {
            funcOk: function(){
            }
          });
      }else {
        var data = {
          comment: $E("commentArea").value,
          login_name: '',
          login_pass: '',
          comment_anonyous: '新浪网友',
          anonymity: false,
          is_mobile: + is_mobile,
          is_t: 0 //默认不分享到微博
        };

        // 判断是否使用geetest验证码，传相应的验证码参数
        if(isGeetest) {
          data.geetest_challenge = geetestValidate.geetest_challenge;
          data.geetest_validate = geetestValidate.geetest_validate;
          data.geetest_seccode = geetestValidate.geetest_seccode;
        }else {
          data.check = $E("login_check").value;
        }

        CommentPost.post(data);
        fresh_chk = false;
      }
    };

    Core.Events.addEvent($E("commentArea"), function() {
      var e = Core.Events.getEvent();
      if (e.ctrlKey && e.keyCode === 13) {
        savefunc();
      }
    },
    "keydown");

    Core.Events.addEvent("postcommentid", function() {
      if (scope.commEditor) {
        scope.commEditor.handleChange("postCommentIframe");
      }
      savefunc();
    });
    Core.Events.addEvent($E("postcommentid").parentNode, function() {
      if (scope.commEditor) {
        scope.commEditor.handleChange("postCommentIframe");
      }
      savefunc();
    },
    'keydown');
    if(!isGeetest) {
      Core.Events.addEvent($E('login_check'), savefunc, 'keydown');
    }
    function backPost() {
      var href = location.href;
      location.href = href.slice(0, href.indexOf('#')) + '#postCommentIframe';
      location.reload();
    }
    function openBack() {
      if (scope.___importV) {
        scope.___importV();
        scope.___openBlogFlag = 1;
      }
      backPost();
    }
    var cfg, arrPix = [0, 0],
    events = {
      'normal': {
        'focus': function() {
          if (!$isLogin) {
            var Login = new Lib.Login.Ui();
            Login.login(backPost);
            return;
          }
          if (!scope.unreadMsg.isbloguser) { //说明用户开通了博客产品
            scope.blogOpener.showDialog(function(res, blogInfo) {
              //清除flash cookie存储的unread缓存
              //Lib.LocalDB前边已经加载
              Lib.LocalDB.clearCache(1, "uid_" + $UID + "unread");
              Lib.util.LS.removeItem("uid" + $UID);
              winDialog.alert("开通博客成功", {
                funcOk: backPost,
                funcClose: backPost
              });
            },
            true);
            return;
          }
          if(!isGeetest) {
            if (fresh_chk) {
              return;
            }
            refreshCheckImg();
            fresh_chk = true;
          }
        }
      }
    };
    App.formInsertSmile2("commentArea", "smilesSortShow", "smilesRecommended", null, "smilesSortShow", arrPix, 'postCommentIframe', events, cfg);
  }
});
