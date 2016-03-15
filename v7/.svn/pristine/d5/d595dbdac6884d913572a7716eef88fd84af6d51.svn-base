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

$import("lib/commentv2/geetest.js");

$registJob('articleCommentPostV2', function(){

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
    
    var commentQuote = new CommentQuote();
    commentQuote.onSuccess = function(){
        $E("cbCommentQuote") && ($E("cbCommentQuote").checked = false);
    };
    //提示用户开通博客，匿名状态下去除此框
    function showAnonymityTip(){
        var nickEl = $E("commentNick");
        if(!nickEl)return;
        for (var child = nickEl.firstChild; child; child = child.nextSibling) {
            nickEl.removeChild(child);
        }
        nickEl.innerHTML = '<div id="openblog-li" style="cursor:pointer;"><a href="javascript:void(0);"><span id="openblog-nickname"></span>您还未开通博客，点击一秒开通。</a></div>';
        scope.addBlogOpenerEvent($E("openblog-li"));

        var nickNameTime = setInterval(function(){
            if (!scope.nickname) {
                return;
            }
            $E("openblog-nickname").innerHTML = scope.nickname + '：';
            clearInterval(nickNameTime);
        }, 100);
    }
    
    if (scope.$private.cms != 1 && scope.$isCommentAllow != 1) {//代表不能评论，因此不执行，0代表可以评论，所以才执行以下代码
        var fresh_chk = false;
        var geetest = null;

        if(!isGeetest) {
            $E("comment_check_img").style.display = "none";
        }else {
            // 引入geetest验证码
            geetest = new CommentV2.Geetest('#geetest-box');
        }
        
        var CommentPost = new CommentV2.Post();
        
        var showNickPlace = function(){//在昵称处应该显示的东西 
            $E("commentNick").style.display = "";
            if (checkUserProduct.flag == true) {//说明用户开通了博客产品
                scope.setNickTime = setInterval(function(){
                    var vHTML = Lib.blogv.getVHTML(scope.loginUserWtype);
                    if (typeof scope.$loginNick == 'undefined') {
                        Lib.Uic.getNickName([$UID], function(oResult){
                            for (var key in oResult) {
                                scope.$loginNick = oResult[key];
                                $E("commentNick").innerHTML = scope.$loginNick + "&nbsp;" + vHTML + ':';
                            }
                        });
                        clearInterval(scope.setNickTime);
                    }
                    else {
                        $E("commentNick").innerHTML = scope.$loginNick + "&nbsp;" + vHTML + ':';
                    }
                }, 500);
            }
            else {
                //说明用户没有开通博客产品 
                //$E("commentNick").innerHTML = '您还未<a href="http://login.sina.com.cn/hd/reg.php?entry=blog">开通</a>博客，只能匿名发表评论。</li>';
                //Modified by wangqiang/7314, 不跳转页面, 弹出开通博客的浮层
                showAnonymityTip();
            }
        };
        
        if ($isLogin) {
            if (checkUserProduct.isinit == false) {
                /*window.checkuserinterval = setInterval(function(){
                 
                 if (checkUserProduct.isinit == false) {
                 checkUserProduct.check("blog", showNickPlace);
                 } else {
                 clearInterval(window.checkuserinterval);
                 }
                 }, 500);*/
                setTimeout(function(){
                    checkUserProduct.check("blog", showNickPlace);
                }, 10);
                
            }
            else {
                showNickPlace();
            }
            /*---------登录后也可以匿名发表评论，Modified by wangqiang1@staff.sina.com.cn 2011-04-14
             if ($E("anonymity_cont")) {
             $E("anonymity_cont").style.display = "none";
             }
             */
        }
        else {
            $E("commentlogin").style.display = "block";
            
            var defaultName = Utils.Cookie.getCookie("remberloginname");
            if (defaultName != "" && defaultName != "") {
                $E("login_name").value = unescape(unescape(defaultName));
                
            }
            var alf = Utils.Cookie.getCookie("ALF");
            if (alf != "" && $E("login_remember")) {
                $E("login_remember").checked = true;
            }
            
            var alf = Utils.Cookie.getCookie("LiRe");
            if (alf != "" && $E("login_remember")) {
                $E("login_remember").checked = true;
            }
            
            // 隐藏匿名评论input  未登录时，不允许评论      Modified by gaolei2@staff 2013.11.4
            if ($E("anonymity_cont")) {
                $E("anonymity") && ($E("anonymity").checked = false);
                $E("anonymity_cont").style.display = "none";
            }
        }
        //分享到微博复选框
        //var acp_bb = Utils.Cookie.getCookie("acp_bb");
        if ($E("bb")) {
            $E("bb").checked = Utils.Cookie.getCookie("acp_bb") == "1" ? false : true;
        }
        
        //未登录时的网吧、公用电脑警示tip
        var initSaveCaution = function(){
            Lib.checkAuthor();
            var cautionCheck = $E("login_remember");
            //var cautionTip = $E("login_remember_caution");
            if (!cautionCheck) {
                return;
            }
            cautionCheck.checked = true;
            if (!$isLogin) {
                cautionCheck["onclick"] = validChecked;
            }
            var cancelStatus = 1;
            //validChecked();
            function validChecked(){
                if (cancelStatus) {
                    var url = "http://control.blog.sina.com.cn/blog_rebuild/riaapi/padblog/padInfo.php?ck_login=A00003&rnd="+Math.random();
                    Utils.Io.JsLoad.request(url,{
                        onComplete : function(){}
                        ,onException : function(){}
                    });
                    cancelStatus = null; 
                }
            }
        };
        initSaveCaution();
        
        if ($E("anonymity") && $E("anonymity").checked) {//判断匿名的checkbox是否选中，选中，则将登录框隐藏掉
            CommentPost.anonyous = true;
            $E("commentlogin").style.display = "none";
            $E("commentloginM").style.display = "";
            
        }
        //昵称处绑定事件-------------------------------------
        Core.Events.addEvent($E('comment_anonyous'), function(){
            if ($E("anonymity") && $E("anonymity").checked && Core.String.trim($E('comment_anonyous').value) == "新浪网友") {
                $E('comment_anonyous').value = '';
            }
        }, 'focus');
        
        Core.Events.addEvent($E('comment_anonyous'), function(){
            if ($E("anonymity") && $E("anonymity").checked && Core.String.trim($E('comment_anonyous').value) == "") {
                $E('comment_anonyous').value = '新浪网友';
            }
        }, 'blur');
        //-----------------------------------------------------
        
        //登录处绑定事件-------------------------------------
        var bindEmailPanel = new scope.bindEmailPanel();
        Core.Events.addEvent($E('login_name'), function(){
            bindEmailPanel.hidden();
        }, 'focus');
        
        Core.Events.addEvent($E('login_name'), function(){
            var name = $E('login_name').value;
            if (!name) 
                return;
            checkUserMail(name);
        }, 'blur');
        
        function checkUserMail(name){
            Utils.Io.JsLoad.request("http://login.sina.com.cn/bindmail/checkmailuser.php?entry=blog&name=" + encodeURIComponent(name) + "&utf82gbk=1&callback=scope.$bindEmailTip", {
                noreturn: true
            });
        }
        
        scope.$bindEmailTip = function(data){
            if (data.ret == 'y' || data.errcode == 'not_verify') {
                var node = $E('login_name');
                bindEmailPanel.showWithDom(node, -150, -55);
                $E('linkBindEmail').href = 'http://login.sina.com.cn/bindmail/signin.php?entry=blog&utf82gbk=1&username=' + encodeURIComponent(node.value);
            }
            else {
                bindEmailPanel.hidden();
            }
        };
        Core.Events.addEvent($E('closeBindEmail'), function(){
            bindEmailPanel.hidden();
        });
        Core.Events.addEvent("postcommentid", function(){
            //关闭绑定邮箱浮层
            try {
                bindEmailPanel.hidden();
            } 
            catch (e) {
            }
        });
        //-----------------------------------------------------
        
        var refreshCheckImg = function(){
            //         if (!fresh_chk) {
            if ($IE8) {
                $E("comment_check_img").src = "http://interface.blog.sina.com.cn/riaapi/checkwd_image_ie8.php?" + new Date().valueOf();
            }
            else {
                $E("comment_check_img").src = "http://interface.blog.sina.com.cn/riaapi/checkwd_image.php?" + new Date().valueOf();
            }
            swapView("img");
            //            fresh_chk = true;
            //         }
        };
        function swapView(type){
            var t = type || "check";
            if (t == "img") {
                $E("comment_check_img").style.display = "inline";
                $E("check_show").style.display = "none";
            }
            else {
                $E("comment_check_img").style.display = "none";
                $E("check_show").style.display = "";
            }
            
        }
        CommentPost.articleid = scope.$articleid;
        
        CommentPost.onSuccess = function(){
            if (scope.commEditor) {
                scope.commEditor.clearHTML('postCommentIframe');
            }
            
            var cbCommentQuote = $E("cbCommentQuote");
            
            if (cbCommentQuote && cbCommentQuote.checked) {
                //功能先屏蔽掉，领导说开放才能开放。。。耶。。。
                //领导说可以开放了。。。
                //winDialog.alert("系统维护，转载功能暂不可用12");                   
                commentQuote.check($r_quote_bligid, $E("commentArea").value);
                
            }
            $E("commentArea").value = "";
            if(!isGeetest) {
                $E("login_check").value = "";
            }
            if(is_mobile && mbCmtTa){
                mbCmtTa.value = "";
            }
            //            refreshCheckImg();
            if(!isGeetest) {
                swapView();
            }else {
                // 刷新geetest验证码
                geetest.geetestObj.refresh();
            }
        };
        
        CommentPost.onError = function(){
            //commentQuote.hideTip();
            if(!isGeetest) {
                refreshCheckImg();
            }else {
                // 刷新geetest验证码
                geetest.geetestObj.refresh();
            }
        };
        
        if ($E("anonymity")) {
            Core.Events.addEvent("anonymity", function(){
                var commentNick = $E("commentNick");
                //debugger;
                v7sendLog('32_01_17');
                var isOpenBlog = (checkUserProduct.flag && checkUserProduct.isinit) || false;
                isOpenBlog && $isLogin && commentNick && (commentNick.style.display = "");
                if ($E("anonymity").checked) {
                    CommentPost.anonyous = true;
                    $E("commentlogin").style.display = "none";
                    $E("commentloginM").style.display = "block";
                    $E("cbCommentQuote") && ($E("cbCommentQuote").checked = false);
                    commentNick && (commentNick.innerHTML = '你正以匿名身份发表评论:');
                }
                else {
                    var vHTML = Lib.blogv.getVHTML(scope.loginUserWtype);
                    CommentPost.anonyous = false;
                    $E("commentlogin").style.display = $isLogin ? "none" : "block";
                    $E("commentloginM").style.display = "none";
                    if(isOpenBlog){
                        commentNick && (commentNick.innerHTML = (scope.$loginNick || scope.nickname)
                            + "&nbsp;" + vHTML + ':');
                    }else {
                        showAnonymityTip();
                    }
                }
                $E("cbCommentQuote") && ($E("cbCommentQuote").disabled = $E("anonymity").checked);
                $E("quote_comment_p") && ($E("quote_comment_p").style.display = $E("anonymity").checked ? "none" : "");
            });
        }
        
        if ($E("bb")){
            Core.Events.addEvent($E("bb"), function(){
                v7sendLog('32_01_18');
            });
        }
        
        if (!$E('postCommentIframe')) {
            Core.Events.addEvent("commentArea", function(){
                if(!isGeetest) {
                    if (fresh_chk) {
                        return;
                    }
                    $E('check_show').style.display = 'none';
                    refreshCheckImg();
                    fresh_chk = true;
                }
            }, 'focus');
        }
        
        //ifrmame 的展开验证码事件
        /*
         Core.Events.addEvent($E("postCommentIframe").contentWindow.document.body, , 'focus');
         */
        if(!isGeetest) {
            Core.Events.addEvent("login_check", function(){
                if (fresh_chk) {
                    return;
                }
                $E('check_show').style.display = 'none';
                refreshCheckImg();
                fresh_chk = true;
            }, 'focus');
            
            Core.Events.addEvent("check_show", function(){
                if (fresh_chk) {
                    return;
                }
                $E('check_show').style.display = 'none';
                refreshCheckImg();
                fresh_chk = true;
            }, 'click');
            
            Core.Events.addEvent("comment_check_img", function(){
                refreshCheckImg();
            }, 'mousedown');
        }
        
        var is_mobile = /Mobile/i.test(navigator.userAgent),
            mbCmt = $E("mobileComment"),
            mbCmtTa = $E("mbCommentTa");
        if(is_mobile && mbCmt){
            $E("commonComment").style.display = "none";
            $E("faceWrap").style.display = "none";
            mbCmt.style.display = "";
            var anoc = $E("anonymity_cont");
            anoc && (anoc.style.cssFloat = "left");
        }
        
        //提交事件---------------------------------------------------
        var savefunc = function(){
            if (Core.Events.getEvent()) {
                var e = Core.Events.getEvent();
                if (e.type == 'keydown' && e.keyCode != 13) {
                    return;
                }
                else if (e.type == 'keydown' && e.keyCode == 13) {
                    if (scope.commEditor) {
                        scope.commEditor.handleChange("postCommentIframe");
                    }
                }
                Core.Events.stopEvent();
            }
            
            if (!$isLogin && $E("anonymity") && $E("anonymity").checked == false) {
                //不是匿名评论
                if (Core.String.trim($E('login_name').value) == "") {
                    // Core.Events.fireEvent("anonymity", 'click');
                    showError($SYSMSG.B36107);
                    return;
                }
                else if (Core.String.trim($E('login_pass').value) == "") {
                    showError($SYSMSG.B36108);
                    return;
                }
            }
            
            if(is_mobile&&mbCmtTa){
                $E("commentArea").value = mbCmtTa.value;
            }

            if ($E("anonymity") && $E("anonymity").checked == true && Core.String.trim($E('comment_anonyous').value) == "") {
                //匿名但是没有输入昵称---昵称线在不能输入，只能是新浪网友，因此不会走此代码！！！！
                showError($SYSMSG.B36003);
            }
            else {
                // geetest验证码结果
                var geetestValidate = false;
                if(isGeetest && geetest) {
                    if(geetest.geetestObj) {
                        geetestValidate = geetest.geetestObj.getValidate();
                    }
                }

                if (Core.String.trim($E('commentArea').value) == "") {
                    //评论内容为空
                    showError($SYSMSG.B36105);
                }
                else if (!isGeetest && Core.String.trim($E('login_check').value) == "") {
                    //旧版，验证码为空
                    winDialog.alert($SYSMSG.B36106, {
                        funcOk: function(){
                            $E("login_check").value = "";
                            $E("login_check").focus();
                        }
                    });
                }else if(isGeetest && !geetestValidate) {
                    // geetest，验证码为空
                    winDialog.alert('请拖动滑块完成验证。', {
                        funcOk: function(){
                        }
                    });
                }
                else {
                    var data = {
                        comment          : $E("commentArea").value,
                        login_name       : $E("login_name").value,
                        login_pass       : $E("login_pass").value,
                        comment_anonyous : $E("comment_anonyous").value,
                        anonymity        : ($E("anonymity") && $E("anonymity").checked),
                        is_mobile: +is_mobile,
                        is_t             : 0 //默认不分享到微博
                    };

                    // 判断是否使用geetest验证码，传相应的验证码参数
                    if(isGeetest) {
                        data.geetest_challenge = geetestValidate.geetest_challenge;
                        data.geetest_validate = geetestValidate.geetest_validate;
                        data.geetest_seccode = geetestValidate.geetest_seccode;
                    }else {
                        data.check = $E("login_check").value;
                    }

                    if ($E("login_remember")) {
                        data.login_remember = $E("login_remember").checked;
                        if (data.login_remember) {
                            Utils.Cookie.setCookie("LiRe", true, 2400, "/", ".blog.sina.com.cn");
                        }
                        else {
                            Utils.Cookie.setCookie("LiRe", "", 2400, "/", ".blog.sina.com.cn");
                        }
                        
                    }
                    /*
                     * Book | liming9@staff.sina.som.cn
                     * 添加博客-微博评论互通选项框
                     */
                    if ($E("bb")) {
                        //匿名评论时不需要分享到微薄，如果博主设置不能匿名评论，则登陆用户可以分享到微薄
                        if ((!CommentPost.anonyous || !$E("anonymity")) && $E("bb").checked) {
                            data.is_t = 1; //分享到微博
                            //为减少cookie大小，不分享到微博时不记录cookie，因为读不到cookie时则不选中选框
                            if (Utils.Cookie.getCookie("acp_bb") == "1") {
                                Utils.Cookie.setCookie("acp_bb", "", -1, "/", ".blog.sina.com.cn");
                            }
                        }
                        else {
                            data.is_t = 0;
                            if (Utils.Cookie.getCookie("acp_bb") != "1") {
                                Utils.Cookie.setCookie("acp_bb", "1", 2400, "/", ".blog.sina.com.cn");
                            }
                        }
                    }
                    /*
                     if (CommentPost.anonyous == false && !$isLogin) {
                         data.need_refresh = true;
                     } else {
                         data.need_refresh = false;
                     }
                     */
                    // Utils.Cookie.setCookie("remberloginname", escape($E("login_name").value), 2400, "/", ".blog.sina.com.cn");
                    
                    CommentPost.post(data);
                    fresh_chk = false;
                }
            }
        };
        
        Core.Events.addEvent($E("commentArea"), function(){
            var e = Core.Events.getEvent();
            if (e.ctrlKey && e.keyCode === 13) {
                savefunc();
            }
        }, "keydown");
        
        Core.Events.addEvent("postcommentid", function(){
            if (scope.commEditor) {
                scope.commEditor.handleChange("postCommentIframe");
            }
            savefunc();
        });
        Core.Events.addEvent($E("postcommentid").parentNode, function(){
            if (scope.commEditor) {
                scope.commEditor.handleChange("postCommentIframe");
            }
            savefunc();
        }, 'keydown');
        if(!isGeetest) {
            Core.Events.addEvent($E('login_check'), savefunc, 'keydown');
        }

        //初始化插入表情-----------------------------------
        // console.log("insert smile");
        // debugger;
        if ($E("smilesSortShow") == null) {
            $E("commentArea").style.width = "680px";
            var smile = new CommentV2.insertSmile();
            smile.show();
        } else {
            var arrPix = [-325, 40 + ($IE ? -2 : 0)],
                cfg;
            if (scope.$pageid.indexOf("articletj") !== -1){
                cfg = {
                    sortCount   : 4, //小表情
                    recommCount : 6 //大表情
                };
            }
            //直接绑定无效，只能以这种方式。。。不知道为什么
            if ($E('postCommentIframe')) {
                //使用iframe的情况下
                var events = {
                    'normal': {
                        'focus': function(){
                            if(!isGeetest) {
                                if (fresh_chk) {
                                    return;
                                }
                                $E('check_show').style.display = 'none';
                                refreshCheckImg();
                                fresh_chk = true;
                            }
                        }
                    }
                };
                App.formInsertSmile2("commentArea", "smilesSortShow", "smilesRecommended", null, "smilesSortShow", arrPix, 'postCommentIframe', events, cfg);
            }
            else {
                //在没有iframe的情况下
                App.formInsertSmile("commentArea", "smilesSortShow", "smilesRecommended", null, "smilesSortShow", arrPix, null, null, cfg);
            }
        }
    }
});