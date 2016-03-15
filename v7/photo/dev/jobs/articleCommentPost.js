/*
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 */
/**
 * @fileoverview 评论发表
 * @author stan | chaoliang@staff.sina.com.cn
 * @modified xy xinyu@staff.sina.com.cn
 * @modified zhihan zhihan@staff.sina.com.cn
 */
$import("sina/core/events/addEvent.js");
$import("sina/core/events/fireEvent.js");
$import("sina/core/dom/getTop.js");
$import("sina/core/dom/getLeft.js");
$import("sina/Evter.js");

$import("lib/jobs.js");
$import("lib/login/info.js");
$import("lib/checkAuthor.js");
$import("lib/component/face/face.js");
$import("lib/showError.js");
$import("lib/uic.js");
$import("lib/insertSmiles/insertSmileFormInit.js");

$import("comment/post.js");
$import("comment/faceTemplate.js");
$import("comment/count.js");
$import("comment/insertSmile.js");
$import("comment/checkUserProduct.js");

$import("tempLib/insertSmiles/insertSmileFormInit.js");

$import("lib/checkManager.js");

$registJob('articleCommentPost', function() {
    //1代表不能评论，因此不执行，0代表可以评论，所以才执行以下代码
    if (scope['private'].cms != 1) {
        var checkBox_photo={
            id:'#checkCodeBox'
        }
        var checkManager = new Lib.checkManager(checkBox_photo);
        if ($E("login_remember")) {
            var cancelStatus = 1;
            $E("login_remember").checked = true;
            $E("login_remember").onclick = function() {
                if (cancelStatus) {
                    var url = "http://control.blog.sina.com.cn/blog_rebuild/riaapi/padblog/padInfo.php?ck_login=A00006&rnd=" + Math.random();
                    Utils.Io.JsLoad.request(url, {
                        onComplete: function() {},
                        onException: function() {}
                    });
                    cancelStatus = null;
                }
            }
        }
        var frameId = 'postCommentIframe';
        var frame = $E(frameId);
        if (!frame) {
            //console.log(1)
            $E('commentArea').style.display = 'none';
            var par = $E('commentArea').parentNode;
            var outter = $C('div');
            outter.style.cssText = 'float:left;';
            par.insertBefore(outter, $E('commentArea'));
            var test = document.createElement('iframe');
            test.id = 'postCommentIframe';
            test.setAttribute('frameborder', '0');
            test.style.cssText = 'border: 1px solid rgb(199, 199, 199); height: 158px; width: 448px; background-color: white;';
            outter.appendChild(test);
            test.src = 'http://blog.sina.com.cn/main_v5/ria/blank2.html';
        }
        frame = $E(frameId);

        if (frame) {

            var CommentPost = new Comment.Post();

            var showNickPlace = function() { //在昵称处应该显示的东西
                if (checkUserProduct.flag == true) { //说明用户开通了博客产品
                    scope.setNickTime = setInterval(function() {
                        var vHTML = Lib.blogv.getVHTML(scope.loginUserWtype);
                        if (typeof scope.$loginNick == 'undefined') {
                            Lib.Uic.getNickName([$UID], function(oResult) {
                                for (var key in oResult) {
                                    scope.$loginNick = oResult[key];
                                    $E("commentNick").innerHTML = scope.$loginNick + "&nbsp;" + vHTML + ':';
                                }
                            });
                            clearInterval(scope.setNickTime);
                        } else {
                            $E("commentNick").innerHTML = scope.$loginNick + "&nbsp;" + vHTML + ':';
                        }
                    }, 500);
                } else { //说明用户没有开通博客产品
                    $E("commentNick").innerHTML = '您还未<a href="http://login.sina.com.cn/hd/reg.php?entry=blog">开通</a>博客，只能匿名发表评论。</li>';
                    $E("anonymity").checked = true;
                    $E("quote_comment_p").style.display = "none";
                }
            };

            if ($isLogin) {
                if (checkUserProduct.isinit == false) {
                    window.checkuserinterval = setInterval(function() {
                        if (checkUserProduct.isinit == false) {
                            checkUserProduct.check("blog", showNickPlace);
                        } else {
                            clearInterval(window.checkuserinterval);
                        }
                    }, 500);

                } else {
                    showNickPlace();
                }
                if ($E("anonymity_cont")) {
                    $E("anonymity_cont").style.display = "none";
                }
            } else {
                $E("commentlogin").style.display = "block";
                var userInfo = Lib.Login.info();
                var defaultName = userInfo.ln;
                if (defaultName) {
                    $E("login_name").value = defaultName;

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

            if ($E("anonymity") && $E("anonymity").checked) { //判断匿名的checkbox是否选中，选中，则将登录框隐藏掉
                CommentPost.anonyous = true;
                $E("commentlogin").style.display = "none";
                $E("commentloginM").style.display = "";

            }
            //昵称处绑定事件-------------------------------------
            Core.Events.addEvent($E('comment_anonyous'), function() {
                if ($E("anonymity") && $E("anonymity").checked && Core.String.trim($E('comment_anonyous').value) == "新浪网友") {
                    $E('comment_anonyous').value = '';
                }
            }, 'focus');

            Core.Events.addEvent($E('comment_anonyous'), function() {
                if ($E("anonymity") && $E("anonymity").checked && Core.String.trim($E('comment_anonyous').value) == "") {
                    $E('comment_anonyous').value = '新浪网友';
                }
            }, 'blur');
            //-----------------------------------------------------

            CommentPost.articleid = picInfo.pic_id;

            CommentPost.onSuccess = function() {
                //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                $E("commentArea").value = "";
                if (scope.commEditor) {
                    scope.commEditor.clearHTML(frameId);
                }
                checkManager.refresh();
            };

            CommentPost.onError = function() {
                checkManager.refresh();
            };

            if ($E("anonymity")) {
                Core.Events.addEvent("anonymity", function() {
                    if ($E("anonymity").checked) {
                        CommentPost.anonyous = true;
                        $E("commentlogin").style.display = "none";
                        $E("commentloginM").style.display = "block";
                    } else {
                        CommentPost.anonyous = false;
                        $E("commentlogin").style.display = $isLogin ? "none" : "block";
                        $E("commentloginM").style.display = "none";
                    }
                    $E("quote_comment_p") && ($E("quote_comment_p").style.display = $E("anonymity").checked ? "none" : "");
                });
            }
            //~~~~~~~~~~~~~~~~~~~~~~~~~~~

            //提交事件---------------------------------------------------
            var savefunc = function() {

                if (Core.Events.getEvent()) {
                    var e = Core.Events.getEvent();
                    if (e.type == 'keydown' && e.keyCode != 13) {
                        return;
                    } else if (e.type == 'keydown' && e.keyCode == 13) {
                        if (scope.commEditor) {
                            scope.commEditor.handleChange(frameId);
                        }
                    }
                    Core.Events.stopEvent();
                }
                if (!$isLogin && $E("anonymity") && $E("anonymity").checked == false) {
                    //不是匿名评论
                    if (Core.String.trim($E('login_name').value) == "") {
                        // Core.Events.fireEvent("anonymity", 'click');
                        showError($SYSMSG['B36107']);
                        return;
                    } else
                    if (Core.String.trim($E('login_pass').value) == "") {
                        showError($SYSMSG['B36108']);
                        return
                    }
                }

                if ($E("anonymity") && $E("anonymity").checked == true && Core.String.trim($E('comment_anonyous').value) == "") {
                    //匿名但是没有输入昵称
                    showError($SYSMSG['B36003']);
                } else {
                    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                    if (Core.String.trim($E('commentArea').value) == "") {
                        //评论内容为空
                        showError($SYSMSG['B36105']);
                    } else if (!checkManager.validate()) {
                        //新版验证码无效，旧版验证码为空
                        showError(checkManager.getErrorCode());
                    } else {
                     //var data = checkManager.getPostData();
                         var parm_data=null;
                            parm_data={
                                comment: $E("commentArea").value,
                                login_name: $E("login_name").value,
                                login_pass: $E("login_pass").value,
                                comment_anonyous: $E("comment_anonyous").value,
                                is_t: 0, //默认不分享到微博
                                login_remember: $E("login_remember") ? $E("login_remember").checked : false
                            };
                    var data = checkManager.getPostData(parm_data);
                        if (CommentPost.anonyous == false && !$isLogin) {
                            data.need_refresh = true;
                        } else {
                            data.need_refresh = false;
                        }

                        /*
                         * Book | liming9@staff.sina.som.cn
                         * 添加博客-微博评论互通选项框
                         */
                        if ($E("bb")) {
                            if ($E("bb").checked) {
                                data.is_t = 1; //分享到微博

                                //为减少cookie大小，不分享到微博时不记录cookie，因为读不到cookie时则不选中选框
                                if (Utils.Cookie.getCookie("acp_bb") == "1") {
                                    Utils.Cookie.setCookie("acp_bb", "", -1, "/", ".blog.sina.com.cn");
                                }
                            } else {
                                if (Utils.Cookie.getCookie("acp_bb") != "1") {
                                    Utils.Cookie.setCookie("acp_bb", "1", 2400, "/", ".blog.sina.com.cn");
                                }
                            }
                        }

                        if (!CommentPost.locked) {
                            CommentPost.post(data);
                        }
                        if ($E("login_remember").checked) { //记住登录状态后就不用记住登录名了，减少cookie
                            //Utils.Cookie.setCookie("remberloginname", "", -1, "");
                            Utils.Cookie.setCookie("LiRe", true, 2400, "/", ".blog.sina.com.cn");
                        } else {
                            //Utils.Cookie.setCookie("remberloginname", escape($E("login_name").value), 2400, "/", ".blog.sina.com.cn");
                            Utils.Cookie.setCookie("LiRe", "", 2400, "/", ".blog.sina.com.cn");
                        }
                        CommentPost.locked = true;

                        checkManager.setFreshChk(false);
                    }
                }
            };
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
            }, 'keydown');

            Evter.add('img_check_post', function(eTarget, event, eSource){
                savefunc();
            });
            //初始化插入表情-----------------------------------
            if ($E("smilesSortShow") == null) {
                //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                $E("commentArea").style.width = "680px";
                var smile = new Comment.insertSmile();
                smile.show();
            } else {
                var arrPix = [-325, 40 + ($IE ? -2 : 0)];
                //使用iframe的情况下
                var events = {
                    'normal': {
                        'focus': function() {
                            checkManager.refresh();
                        }
                    }
                }
                App.formInsertSmile2("commentArea", "smilesSortShow", "smilesRecommended", null, "smilesSortShow", arrPix, 'postCommentIframe', events);
                //App.formInsertSmile("commentArea", "smilesSortShow", "smilesRecommended", null, "smilesSortShow", arrPix);
            }
            return;
        }
        console.log('下面执行')
            //var fresh_chk = false;
 //       $E("comment_check_img").style.display = "none";

        var CommentPost = new Comment.Post();

        var showNickPlace = function() { //在昵称处应该显示的东西
            if (checkUserProduct.flag == true) { //说明用户开通了博客产品
                scope.setNickTime = setInterval(function() {
                    if (typeof scope.$loginNick == 'undefined') {
                        Lib.Uic.getNickName([$UID], function(oResult) {
                            for (var key in oResult) {
                                scope.$loginNick = oResult[key];
                                $E("commentNick").innerHTML = scope.$loginNick + ':';
                            }
                        });
                        clearInterval(scope.setNickTime);
                    } else {
                        $E("commentNick").innerHTML = scope.$loginNick + ':';
                    }
                }, 500);
            } else { //说明用户没有开通博客产品
                $E("commentNick").innerHTML = '您还未<a href="http://login.sina.com.cn/hd/reg.php?entry=blog">开通</a>博客，只能匿名发表评论。</li>';
                $E("anonymity").checked = true;
                $E("quote_comment_p").style.display = "none";
            }
        };
        if ($isLogin) {
            if (checkUserProduct.isinit == false) {
                window.checkuserinterval = setInterval(function() {
                    if (checkUserProduct.isinit == false) {
                        checkUserProduct.check("blog", showNickPlace);
                    } else {
                        clearInterval(window.checkuserinterval);
                    }
                }, 500);

            } else {
                showNickPlace();
            }
            if ($E("anonymity_cont")) {
                $E("anonymity_cont").style.display = "none";
            }
        } else {
            $E("commentlogin").style.display = "block";
            var userInfo = Lib.Login.info();
            var defaultName = userInfo.ln;
            if (defaultName) {
                $E("login_name").value = defaultName;

            }
            var alf = Utils.Cookie.getCookie("ALF");
            if (alf != "" && $E("login_remember")) {
                $E("login_remember").checked = true;
            }
            // 隐藏匿名评论input  未登录时，不允许评论      Modified by gaolei2@staff 2013.11.4
            if ($E("anonymity_cont")) {
                $E("anonymity") && ($E("anonymity").checked = false);
                $E("anonymity_cont").style.display = "none";
            }
        }

        if ($E("anonymity") && $E("anonymity").checked) { //判断匿名的checkbox是否选中，选中，则将登录框隐藏掉
            CommentPost.anonyous = true;
            $E("commentlogin").style.display = "none";
            $E("commentloginM").style.display = "";

        }
        //昵称处绑定事件-------------------------------------
        Core.Events.addEvent($E('comment_anonyous'), function() {
            if ($E("anonymity") && $E("anonymity").checked && Core.String.trim($E('comment_anonyous').value) == "新浪网友") {
                $E('comment_anonyous').value = '';
            }
        }, 'focus');

        Core.Events.addEvent($E('comment_anonyous'), function() {
            if ($E("anonymity") && $E("anonymity").checked && Core.String.trim($E('comment_anonyous').value) == "") {
                $E('comment_anonyous').value = '新浪网友';
            }
        }, 'blur');
        //-----------------------------------------------------

        CommentPost.articleid = picInfo.pic_id;

        CommentPost.onSuccess = function() {
            $E("commentArea").value = "";
            console.log('下面成功提交刷新');
            checkManager.refresh();
        };

        CommentPost.onError = function() {
            console.log('下面失败提交刷新')
                // console.log('CommentPost.onError - refreshCheckImg 2');
                //refreshCheckImg();
            checkManager.refresh();
        };

        if ($E("anonymity")) {
            Core.Events.addEvent("anonymity", function() {
                if ($E("anonymity").checked) {
                    CommentPost.anonyous = true;
                    $E("commentlogin").style.display = "none";
                    $E("commentloginM").style.display = "block";
                } else {
                    CommentPost.anonyous = false;
                    $E("commentlogin").style.display = $isLogin ? "none" : "block";
                    $E("commentloginM").style.display = "none";
                }
                $E("quote_comment_p") && ($E("quote_comment_p").style.display = $E("anonymity").checked ? "none" : "");
            });
        }

        //提交事件---------------------------------------------------
        var savefunc = function() {

            if (Core.Events.getEvent()) {
                var e = Core.Events.getEvent();
                if (e.type == 'keydown' && e.keyCode != 13) {
                    return;
                }
                Core.Events.stopEvent();
            }
            if (!$isLogin && $E("anonymity") && $E("anonymity").checked == false) {
                //不是匿名评论
                if (Core.String.trim($E('login_name').value) == "") {
                    Core.Events.fireEvent("anonymity", 'click');
                    showError($SYSMSG['B36107']);
                    return;
                } else
                if (Core.String.trim($E('login_pass').value) == "") {
                    showError($SYSMSG['B36108']);
                    return
                }
            }

            if ($E("anonymity") && $E("anonymity").checked == true && Core.String.trim($E('comment_anonyous').value) == "") {
                //匿名但是没有输入昵称
                showError($SYSMSG['B36003']);
            } else {
                if (Core.String.trim($E('commentArea').value) == "") {
                    //评论内容为空
                    showError($SYSMSG['B36105']);
                } else if (!checkManager.validate()) {
                    //验证码为空
                    showError(checkManager.getErrorCode());
                } else {
                    console.log('下面验证码为非空刷新')
                    var parm_data=null;
                    parm_data={
                        comment: $E("commentArea").value,
                        login_name: $E("login_name").value,
                        login_pass: $E("login_pass").value,
                        comment_anonyous: $E("comment_anonyous").value,
                        is_t: 0, //默认不分享到微博
                        login_remember: $E("login_remember") ? $E("login_remember").checked : false
                    };
                    var data = checkManager.getPostData(parm_data);
                    if (CommentPost.anonyous == false && !$isLogin) {
                        data.need_refresh = true;
                    } else {
                        data.need_refresh = false;
                    }
                    /*
                     * Book | liming9@staff.sina.som.cn
                     * 添加博客-微博评论互通选项框
                     */
                    if ($E("bb")) {
                        if ($E("bb").checked) {
                            data.is_t = 1; //分享到微博

                            //为减少cookie大小，不分享到微博时不记录cookie，因为读不到cookie时则不选中选框
                            if (Utils.Cookie.getCookie("acp_bb") == "1") {
                                Utils.Cookie.setCookie("acp_bb", "", -1, "/", ".blog.sina.com.cn");
                            }
                        } else {
                            if (Utils.Cookie.getCookie("acp_bb") != "1") {
                                Utils.Cookie.setCookie("acp_bb", "1", 2400, "/", ".blog.sina.com.cn");
                            }
                        }
                    }

                    if (!CommentPost.locked) {
                        CommentPost.post(data);
                    }
                    //                        if($E("login_remember").checked){//记住登录状态后就不用记住登录名了，减少cookie
                    //                            Utils.Cookie.setCookie("remberloginname", "", -1, "");
                    //                        }else{
                    //                            Utils.Cookie.setCookie("remberloginname", escape($E("login_name").value), 2400, "/", ".blog.sina.com.cn");
                    //                        }
                    CommentPost.locked = true;

                    checkManager.setFreshChk(false);
                }
            }
        };
        Core.Events.addEvent("postcommentid", savefunc);
        Core.Events.addEvent($E("postcommentid").parentNode, savefunc, 'keydown');
        Evter.add('img_check_post', function(eTarget, event, eSource){
            savefunc();
        });
        //初始化插入表情-----------------------------------
        if ($E("smilesSortShow") == null) {
            $E("commentArea").style.width = "680px";
            var smile = new Comment.insertSmile();
            smile.show();
        } else {
            var arrPix = [-325, 40 + ($IE ? -2 : 0)];
            App.formInsertSmile("commentArea", "smilesSortShow", "smilesRecommended", null, "smilesSortShow", arrPix);
        }
    }
});