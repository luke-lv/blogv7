/*
 * Copyright (c) 2007, Sina Inc. All rights reserved.
 * @fileoverview 许愿瓶组件弹出对话框
 */
$import("sina/utils/flash/swf.js");
$import("sina/core/dom/setStyle.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/getEvent.js");
$import("sina/core/events/stopEvent.js");
$import("sina/core/system/pageSize.js");
$import("sina/core/system/getScrollPos.js");
$import("sina/core/dom/getXY.js");
$import("sina/utils/form/sinput.js");
//$import("sina/utils/cookie/cookie.js");
$import("sina/core/function/bind2.js");
$import("sina/core/function/bind3.js");
$import("lib/login/loginPost.js");
$import("lib/interface.js");
$import("lib/checkAuthor.js");
$import("msg/olympic_bottle_dialog.js");
/**
 * @author FlashSoft | fangchao@staff.sina.com.cn
 * @lastmodified L.Ming | liming1@staff.sina.com.cn
 * @since 2008-0-10-07
 */
if (typeof BlogBottleMsg == "undefined") {
    BlogBottleMsg = (function () {
        /** 覆盖定义trace调试方法 */
        if (trace == null) {
            trace = function () {
            };
        }
        /**
         * 通过JavaScript标签载入数据
         * @private
         * @author FlashSoft | fangchao@staff.sina.com.cn
         */
        function JsLoader() {
            this.load = function (url, charset) {
                var head = document.getElementsByTagName("head")[0];
                var ss = document.getElementsByTagName("script");
                for (var i = 0; i < ss.length; i++) {
                    if (ss[i].src && ss[i].src.indexOf(url) != -1) {
                        head.removeChild(ss[i]);
                    }
                }
                var s = document.createElement("script");
                s.type = "text/javascript";
                s.src = url;
                s.charset = charset ? charset : "utf-8";
                head.appendChild(s);
                var self = this;
                s.onload = s.onreadystatechange = function () {
                    if (this.readyState && this.readyState == "loading") {
                        return;
                    }
                    self.onsuccess();
                };
                s.onerror = function () {
                    head.removeChild(s);
                    self.onfailure();
                };
            };
            this.onsuccess = function () {
            };
            this.onfailure = function () {
            };
        }

        /**
         * 随机ID
         * @private
         */
        var rndID = 1024; //parseInt(Math.random() * 10000);
        /**
         * 是否已经初始化名片
         */
        var isCreate = false;

        /**
         * 用户点击显示要显示的UID
         * @private
         */
        var viewUID = -1;

        /**
         * 用来缓存uid的各种信息
         * @private
         */
        var userCardHash = {};
        /**
         * 名片的所有节点
         * @private
         */
        var cardNodes = {};

        /**
         * 名片页面的各种参数
         * @private
         */
        var cardPosHash = {
            cardWidth: 0,
            cardHeight: 0,
            bodyWidth: 0,
            bodyHeight: 0,
            viewWidth: 0,
            viewHeight: 0,
            scrollTop: 0,
            scrollLeft: 0,
            frameLeft: 0,
            frameTop: 0
        };

        /**
         * 是否允许点击页面其他地方可以关闭名片
         * @private
         */
        var clickOtherClose = false;

        /** 名片显示的窗口 */
        var targetWindow = window;

        /** 是否在父窗体里初始化 */
        var isParentInit = false;

        /** 名片默认所在的深度 */
        var userCardIndex = 0;

        /** 是否开始写留言 */
        var isTypeing = false;

        /** 是否已登陆 */
        Lib.checkAuthor();
        var isLogin = $isLogin;

        var activeBID = "";
        var activeUID = "";
        window.idList = [];
        var msgHash = {};

        var actionStatus = -1;

        function joinSWF() {
            var option = {
                historyBlogList: window.idList
            };
            //<embed width="100%" height="100%" wmode="transparent" allowscriptaccess="always" _scale="noscale" quality="high" src="http://simg.sinajs.cn/common/js/bottle_dialog_map.swf" type="application/x-shockwave-flash"/>
            var swf_url = $_GLOBAL.flashBasicURL + "bottle_dialog_map.swf";//alert(cardNodes.swf.id)
            Utils.Flash.swfView.Add(swf_url, cardNodes.swf.id, "map_ditu", "100%", "100%", "8.0.0.0", "#000", option, {
                scale: "noscale",
                allowScriptAccess: "always",
                wmode: "transparent"
            });

//            Utils.Flash.swfView.Init();
        }

        var defaultCacheIMG = new Image();
        defaultCacheIMG.src = "http://simg.sinajs.cn/blog/v5images/olympic/bottle/default_30.gif";
        var bgIMGPath = "http://simg.sinajs.cn/blog/v5images/olympic/bottle/dialog_bg.gif";
        var cardStyle = '<div style="display: none;">&nbsp;\
			<style>\
				/* 公用 */\
				.blog_bottle_msg {position:absolute;top:0;left:0;display:blcok;visibility:hidden;width:260px;overflow:hidden;z-index:200;}\
				.blog_bottle_msg_iframe, .blog_bottle_msg_bg_top, .blog_bottle_msg_bg_middle, .blog_bottle_msg_bg_bottom, .blog_bottle_msg_content {position:absolute;top:0;left:0; width:100%;height:100%;display:block;}\
				.blog_bottle_msg_iframe {filter:alpha(opacity=0);-moz-opacity:0;opacity:0;}\
				.blog_bottle_msg_bg_middle {background:url(' + bgIMGPath + ') no-repeat -823px 0;}\
				.blog_bottle_msg_bg_bottom {height:23px;bottom:0;top:auto;background:url(' + bgIMGPath + ') no-repeat -1091px 0;}\
				.blog_bottle_msg_content {position:relative;color:#ccc;}\
				.blog_bottle_msg_close {position:absolute;right:6px;top:6px;width:14px;height:14px;background:url(' + bgIMGPath + ') no-repeat -1089px -39px;cursor:pointer;}\
				.blog_bottle_reply_ok, .blog_bottle_send_ok{display:none;}\
				.blog_bottle_blank_dotted{height:0;}\
				.blog_bottle_alpha{position:absolute;left:0;top:0;width:100px;height:100px;display:none;}\
				.blog_bottle_shadow{width:100%;height:100%;top:0;left:0;position:absolute;background:#fff;filter:alpha(opacity=80);-moz-opacity:.8;opacity:.8;}\
				.blog_bottle_load_label{position:absolute;left:90px;}\
				/* 回复纸条 */\
				.blog_bottle_msg_info_box {position:relative;margin-top:30px;margin-left:15px;}\
				.blog_bottle_msg_info_img {border:1px #cbc9ca solid;display:block;width:32px;background:#fff;}\
				.blog_bottle_msg_info_img img{width:30px;height:30px;display:block;margin:1px;}\
				.blog_bottle_msg_info_nick {position:absolute;color:#000;left:45px;top:2px;font-size:12px;}\
				.blog_bottle_msg_info_nick a{color:#c96f27;}\
				.blog_bottle_msg_info_nick span {color:#c96f27;margin-right:5px;font-weight:bold;}\
				.blog_bottle_msg_info_time {position:absolute;color:#000;left:45px;top:22px;font-family:Arial;color:#666;font-size:10px;}\
				.blog_bottle_msg_content_box {position:relative;width:228px;margin-left:15px;margin-top:8px;font-size:12px;color:#666;line-height:1.5;word-wrap:break-word; overflow:hidden;}\
				.blog_bottle_msg_swf {width:228px;height:107px;background:#ccc;margin-left:15px;margin-top:10px;}\
				.blog_bottle_msg_dotted, .blog_bottle_msg_dotted2 {width:230px;height:1px;margin-left:15px;margin-top:10px;border-bottom:1px #ccc dashed;margin-bottom:10px;}\
				.blog_bottle_msg_reply_title,\
				.blog_bottle_login_box,\
				.blog_bottle_msg_box,\
				.blog_bottle_check_box,\
				.blog_bottle_ad_box {width:230px;margin-left:15px;font-size:12px;color:#666;}\
				.blog_bottle_ad_box {position:absolute;bottom:10px;height:16px;}\
				.blog_bottle_msg_reply_title {margin-top:6px;font-weight:bold;}\
				.blog_bottle_login_box {height:22px;margin:4px auto;}\
				.blog_bottle_login_box input {width:70px;border:1px solid #666;}\
				.blog_bottle_login_left {float:left;}\
				.blog_bottle_login_right {float:right;}\
				.blog_bottle_msg_box {margin-top:4px;height:92px;width:222px;padding:4px;border:1px solid #666;}\
				.blog_bottle_check_box {height:22px;margin:4px auto;color:#666;}\
				.blog_bottle_check_box input {width:40px;border:1px solid #666;}\
				.blog_bottle_check_box img {margin-left:4px;}\
				.blog_bottle_btn_box {text-align:center;}\
				.blog_bottle_btn_box .blog_bottle_reply_btn, .blog_bottle_btn_box .blog_bottle_send_btn, .blog_bottle_btn_box .blog_bottle_cancel_btn, .blog_bottle_btn_box .blog_bottle_close_btn {margin-right:10px;display:none;}\
				.blog_bottle_send_btn {width:60px;height:22px;background:url(' + bgIMGPath + ') no-repeat -1233px -76px;cursor:pointer;border:0;}\
				.blog_bottle_reply_btn {width:60px;height:22px;background:url(' + bgIMGPath + ') no-repeat -1091px -76px;cursor:pointer;border:0;}\
				.blog_bottle_cancel_btn {width:60px;height:22px;background:url(' + bgIMGPath + ') no-repeat -1160px -76px;cursor:pointer;border:0;}\
				.blog_bottle_close_btn {width:60px;height:22px;background:url(' + bgIMGPath + ') no-repeat -1305px -76px;cursor:pointer;border:0;}\
				.blog_bottle_ad_box .blog_bottle_add_msg {float:left;font-size:14px;color:#fd7a23;font-weight:bold;display:block;}\
				.blog_bottle_ad_box .blog_bottle_hot_msg {float:right;display:block;color:#5c90c1;font-size:12px;}\
				/*完整回复*/\
				.blog_bottle_status_reply .blog_bottle_reply_btn, .blog_bottle_status_reply .blog_bottle_cancel_btn{display:inline;}\
				.blog_bottle_status_reply .blog_bottle_msg_content {margin-bottom:34px;}\
				/*最简单的回复许愿瓶*/\
				.blog_bottle_status_reply_mini .blog_bottle_msg_info_box,\
				.blog_bottle_status_reply_mini .blog_bottle_msg_content_box,\
				.blog_bottle_status_reply_mini .blog_bottle_msg_swf,\
				.blog_bottle_status_reply_mini .blog_bottle_msg_dotted2\
				{display:none;}\
				.blog_bottle_status_reply_mini .blog_bottle_msg_bg_middle {background:url(' + bgIMGPath + ') no-repeat -554px 0;}\
				.blog_bottle_status_reply_mini .blog_bottle_msg_content {margin-bottom:34px;}\
				.blog_bottle_status_reply_mini .blog_bottle_cancel_btn,\
				.blog_bottle_status_reply_mini .blog_bottle_reply_btn\
				{display:inline;}\
				/*回复许愿瓶完成*/\
				.blog_bottle_status_reply_ok .blog_bottle_msg_bg_top {background:url(' + bgIMGPath + ') no-repeat -283px -508px;}\
				.blog_bottle_status_reply_ok .blog_bottle_msg_bg_middle {background:url(' + bgIMGPath + ') no-repeat -12px 0;}\
				.blog_bottle_status_reply_ok .blog_bottle_msg_info_box,\
				.blog_bottle_status_reply_ok .blog_bottle_msg_content_box,\
				.blog_bottle_status_reply_ok .blog_bottle_msg_swf,\
				.blog_bottle_status_reply_ok .blog_bottle_msg_dotted2,\
				.blog_bottle_status_reply_ok .blog_bottle_msg_reply_title,\
				.blog_bottle_status_reply_ok .blog_bottle_login_box *,\
				.blog_bottle_status_reply_ok .blog_bottle_msg_box,\
				.blog_bottle_status_reply_ok .blog_bottle_check_box,\
				.blog_bottle_status_reply_ok .blog_bottle_msg_dotted,\
				.blog_bottle_status_reply_ok .blog_bottle_add_msg\
				{display:none;}\
				.blog_bottle_status_reply_ok .blog_bottle_close_btn {display:inline;}\
				.blog_bottle_status_reply_ok .blog_bottle_btn_box {margin-bottom:34px;margin-top:220px;}\
				/*新发许愿瓶完成*/\
				.blog_bottle_status_send_ok .blog_bottle_msg_bg_top {background:;}\
				.blog_bottle_status_send_ok .blog_bottle_msg_bg_middle {background:url(' + bgIMGPath + ') no-repeat -12px 0;}\
				.blog_bottle_status_send_ok .blog_bottle_msg_info_box,\
				.blog_bottle_status_send_ok .blog_bottle_msg_content_box,\
				.blog_bottle_status_send_ok .blog_bottle_msg_swf,\
				.blog_bottle_status_send_ok .blog_bottle_msg_dotted2,\
				.blog_bottle_status_send_ok .blog_bottle_msg_reply_title,\
				.blog_bottle_status_send_ok .blog_bottle_login_box *,\
				.blog_bottle_status_send_ok .blog_bottle_msg_box,\
				.blog_bottle_status_send_ok .blog_bottle_check_box,\
				.blog_bottle_status_send_ok .blog_bottle_msg_dotted,\
				.blog_bottle_status_send_ok .blog_bottle_add_msg\
				{display:none;}\
				.blog_bottle_status_send_ok .blog_bottle_close_btn {display:inline;}\
				.blog_bottle_status_send_ok .blog_bottle_btn_box {margin-bottom:34px;margin-top:220px;}\
				/*新发许愿瓶*/\
				.blog_bottle_status_send .blog_bottle_msg_info_box,\
				.blog_bottle_status_send .blog_bottle_msg_content_box,\
				.blog_bottle_status_send .blog_bottle_msg_swf,\
				.blog_bottle_status_send .blog_bottle_msg_dotted2,\
				.blog_bottle_status_send .blog_bottle_msg_reply_title,\
				.blog_bottle_status_send .blog_bottle_add_msg\
				{display:none;}\
				.blog_bottle_status_send .blog_bottle_msg_bg_top {background:url(' + bgIMGPath + ') no-repeat -283px 0;}\
				.blog_bottle_status_send .blog_bottle_msg_bg_middle {background:url(' + bgIMGPath + ') no-repeat -823px 0;}\
				.blog_bottle_status_send .blog_bottle_send_btn, .blog_bottle_status_send .blog_bottle_cancel_btn{display:inline;}\
				.blog_bottle_status_send .blog_bottle_msg_content {margin-bottom:34px;padding-top:68px;}\
				/*查看许愿瓶*/\
				.blog_bottle_status_view {}\
				.blog_bottle_status_view .blog_bottle_login_box{height:0;margin:0;}\
				.blog_bottle_status_view .blog_bottle_blank_dotted{height:10px;}\
				.blog_bottle_status_view .blog_bottle_msg_dotted2,\
				.blog_bottle_status_view .blog_bottle_msg_reply_title,\
				.blog_bottle_status_view .blog_bottle_login_left,\
				.blog_bottle_status_view .blog_bottle_login_right,\
				.blog_bottle_status_view .blog_bottle_msg_box,\
				.blog_bottle_status_view .blog_bottle_check_box,\
				.blog_bottle_status_view .blog_bottle_btn_box,\
				.blog_bottle_status_view .blog_bottle_ad_box,\
				.blog_bottle_status_view .blog_bottle_msg_dotted{\
					display:none;\
				}\
			</style>\
			</div>\
		';
        /**
         * 发纸条用到的HTML
         * @private
         */
        var cardHTML = '\
		<div class="blog_bottle_msg" id="{Card}card">\
			<iframe class="blog_bottle_msg_iframe" id="{Card}iframe"></iframe>\
			<div class="blog_bottle_msg_bg_middle" id="{Card}bg_middle"></div>\
			<div class="blog_bottle_msg_bg_top" id="{Card}bg_top"></div>\
			<div class="blog_bottle_msg_bg_bottom"></div>\
			<div class="blog_bottle_msg_content">\
				<div class="blog_bottle_msg_info_box">\
					<a class="blog_bottle_msg_info_img"><img id="{Card}info_img"></a>\
					<div class="blog_bottle_msg_info_nick"><span id="{Card}info_nick"></span>的许愿瓶</div>\
					<div class="blog_bottle_msg_info_time" id="{Card}info_time"></div>\
				</div>\
				<div class="blog_bottle_msg_content_box" id="{Card}content_box"></div>\
				<div class="blog_bottle_msg_swf" id="{Card}swf"></div>\
				<div class="blog_bottle_msg_dotted2"></div>\
				<div class="blog_bottle_msg_reply_title">回复“<span id="{Card}reply_title"></span>”的许愿：</div>\
				<div class="blog_bottle_login_box" id="{Card}login_box"><span class="blog_bottle_login_left">登录名&nbsp;<input autocomplete="off" id="{Card}username" type="text" /></span><span class="blog_bottle_login_right">密码&nbsp;<input autocomplete="off" id="{Card}password" type="password" /></span></div>\
				<textarea class="blog_bottle_msg_box" autocomplete="off" id="{Card}textarea"></textarea>\
				<div class="blog_bottle_check_box">验证码：<input maxlength="4" autocomplete="off" id="{Card}check_input" /><img src="http://interface.blog.sina.com.cn/riaapi/checkwd_image.php" align="absmiddle" id="{Card}check_img" /></div>\
				<div class="blog_bottle_btn_box"><input type="button" value="&nbsp;" class="blog_bottle_send_btn" id="{Card}send_btn" /><input type="button" value="&nbsp;" class="blog_bottle_reply_btn" id="{Card}reply_btn" /><input type="button" value="&nbsp;" class="blog_bottle_cancel_btn" id="{Card}cancel_btn" /><input type="button" value="&nbsp;" class="blog_bottle_close_btn"  id="{Card}close_btn" /></div>\
				<div class="blog_bottle_msg_dotted"></div>\
				<div class="blog_bottle_blank_dotted"></div>\
			</div>\
			<a class="blog_bottle_msg_close" id="{Card}closeBtn"></a>\
			<div class="blog_bottle_ad_box" id="{Card}ad_box"><a class="blog_bottle_add_msg" href="#" onclick="return false;" id="{Card}send_btn_link">我要许愿</a></div>\
			<div class="blog_bottle_alpha" id="{Card}alpha"><div class="blog_bottle_shadow"></div><span class="blog_bottle_load_label" id="{Card}load_label">发送中,请稍候...</span></div>\
		</div>\
		';

        /**
         * 返回指定节点
         * @private
         * @return {HTMLElement} 返回的对象
         */
        function getNode(sName) {
            return $E("Blog_Bottle_Msg_" + rndID + "_" + sName);
        }

        /**
         * 名片初始化
         * @private
         */
        function initCard(isWrite) {
            /** 如果当前窗口是名片显示窗 */
            if (isCreate == false && isParentInit == false) {

                cardNodes.card = getNode("card");
                cardNodes.iframe = getNode("iframe");
                cardNodes.bg_top = getNode("bg_top");
                cardNodes.bg_middle = getNode("bg_middle");
                cardNodes.closeBtn = getNode("closeBtn");

                cardNodes.username = getNode("username");
                cardNodes.password = getNode("password");

                cardNodes.info_nick = getNode("info_nick");
                cardNodes.info_img = getNode("info_img");
                cardNodes.info_time = getNode("info_time");

                cardNodes.reply_title = getNode("reply_title");

                cardNodes.content_box = getNode("content_box");

                cardNodes.login_box = getNode("login_box");

                cardNodes.check_input = getNode("check_input");
                cardNodes.check_img = getNode("check_img");

                cardNodes.textarea = getNode("textarea");

                cardNodes.send_btn = getNode("send_btn");
                cardNodes.reply_btn = getNode("reply_btn");
                cardNodes.cancel_btn = getNode("cancel_btn");
                cardNodes.close_btn = getNode("close_btn");

                cardNodes.send_btn_link = getNode("send_btn_link");

                cardNodes.swf = getNode("swf");
                cardNodes.ad_box = getNode("ad_box");
//                alert("cardNodes.ad_box.innerHTML="+cardNodes.ad_box.innerHTML);
                cardNodes.alpha = getNode("alpha");
                cardNodes.load_label = getNode("load_label");

                /** 设置名片深度 */
//                Core.Dom.setStyle(cardNodes.card, "zIndex", userCardIndex);

                /** 名片关闭按钮 */
                Core.Events.addEvent(cardNodes.closeBtn, targetWindow.BlogBottleMsg.hidden, "click");
                Core.Events.addEvent(cardNodes.cancel_btn, targetWindow.BlogBottleMsg.hidden, "click");
                Core.Events.addEvent(cardNodes.close_btn, targetWindow.BlogBottleMsg.hidden, "click");

                Core.Events.addEvent(cardNodes.send_btn_link, function () {
                    targetWindow.BlogBottleMsg.show(0, null, 2);
                }, "click");

                /** 刷新验证码 */
                Core.Events.addEvent(cardNodes.check_img, reloadCheckIMG, "click");
                /** 防止名片上任意节点的事件冒泡 */
                /** 此处有问题,因为会导致里面的链接也点击不出去了,结果做了这么一大堆 */
                Core.Events.addEvent(cardNodes.card, function () {
                    return;
//                    var el = Core.Events.getEvent();
//                    var esrc = el.srcElement || el.target;
//                    if (esrc.id != cardNodes.sendBtn.id && esrc.id != cardNodes.mofunBtn.id) {
//                    
//                    }
//                    else {
//                        Core.Events.stopEvent();
//                    }
                }, "click");
                initPos();
            }
            /** 点击页面空白区域,判断并隐藏名片 */
            Core.Events.addEvent(document, function () {
                // L.Ming | liming1@staff. 修复 IE 下个首 targetWindow.BlogBottleMsg 不存在报错的 BUG
                try {
                    if (targetWindow.BlogBottleMsg.getOtherClose()) {
                        targetWindow.BlogBottleMsg.hidden();
                    }
                } catch (e) {
                }
            }, "click");

            Core.Events.addEvent(cardNodes.reply_btn, postContent, "click");
            Core.Events.addEvent(cardNodes.send_btn, Core.Function.bind3(postContent, this, [true]), "click");

            /**
             * get as obj by io
             * @param {Object} name : the  as obj's id
             * @added by xy xinyu@staff.sina.com.cn
             */
            function getFlashObject(name) {

                if (navigator.appName.indexOf("Microsoft Internet") == -1) {
                    if (document.embeds && document.embeds[name]) {
                        return document.embeds[name];
                    }
                } else {
                    return document.getElementById(name);
                }

                if (window.document[name]) {
                    return window.document[name];
                }
            }

            function getNickTop20(sUID) {
                var varName = "nickList";
                var bottleScriptLoader = new JsLoader();
                bottleScriptLoader.onsuccess = function () {
                    var arr = [];
                    for (var key in nickList) {
                        arr[arr.length] = key + "|" + nickList[key];
                    }

                    window.idList = arr.join(",");

                };
                bottleScriptLoader.onfailure = function () {
                    window.idList = [];
                };
                bottleScriptLoader.load("http://uic.sinajs.cn/uic?type=nick&uids=" + sUID + "&varname=" + varName, "utf-8");
            }

            /**
             * invoke the as's function when data is ok
             * @changed by xy xinyu@staff.sina.com.cn
             */
            getRndUID = function () {
                var id = Math.floor(Math.random() * 992);
                var randomTime = new Date().getTime();
                var url = "http://blog.sina.com.cn/myblog/rankuidview.php?time=" + randomTime;
                var bottleScriptLoader = new JsLoader();
                bottleScriptLoader.onsuccess = function () {
                    var arr = [];
                    for (var i = 0; i < 10; i++) {
                        var tm = Math.floor(Math.random() * uidlist.length);
                        var uid = uidlist[tm];
                        arr[arr.length] = uid;
                    }

                    getNickTop20(arr.join(","));
                    swfObjectforMap = getFlashObject("map_ditu");

                    try {
                        swfObjectforMap.getHistoryList();

                    } catch (e) {
                        trace(e);
                    }

                };

                bottleScriptLoader.onfailure = function () {
                    trace("昵称ID获取失败");
                };
                bottleScriptLoader.load(url, "utf-8");
            };

            /** 标示初始化完成 */
            isCreate = true;
        }

        /**
         * 初始化名片窗口的各种信息
         * @private
         */
        function initPos() {
            cardPosHash.cardWidth = cardNodes.card.offsetWidth;
            cardPosHash.cardHeight = cardNodes.card.offsetHeight;

            //trace("名片的宽度: " + cardPosHash.cardWidth);
            //trace("名片的高度: " + cardPosHash.cardHeight);
            var pageSize = Core.System.pageSize();

            //trace("getPageSize方法: " + pageSize);

            if (pageSize[1] > pageSize[3] && !$IE) {
                cardPosHash.bodyWidth = pageSize[0] - 18;
            } else {
                cardPosHash.bodyWidth = pageSize[0];
            }
            cardPosHash.bodyHeight = pageSize[1];

            //trace("Body的宽度: " + cardPosHash.bodyWidth);
            //trace("Body的高度: " + cardPosHash.bodyHeight);

            cardPosHash.viewWidth = pageSize[2];
            cardPosHash.viewHeight = pageSize[3];

            //trace("显示区域的宽度: " + cardPosHash.viewWidth);
            //trace("显示区域的高度: " + cardPosHash.viewHeight);

        }

        /**
         * 保存相应信息到相应的userCardHash中
         * @private
         * @param {String} sType 缓存数据标示
         * @param {String | Object} oData 需要被缓存的数据
         */
        function saveCacheData(sType, oData, nTimeOut) {
            var dataContent = userCardHash[sType][viewUID];
            var theTime = new Date();

            /** 如果到达了最大缓存时间,则更新缓存中的内容 */
            if (theTime - dataContent.time > nTimeOut) {
                dataContent.data = oData;
                dataContent.time = new Date();
            }

        }

        /**
         * 返回缓存中的数据
         * @private
         * @param {String} sType 标示返回缓存的类型
         */
        function getCacheData(sType) {
            //alert(sType + "|" + viewUID);
            return userCardHash[sType][viewUID].data;
        }

        /**
         * 检查缓存中的数据是否需要更新
         * @private
         * @param {String} sType 检查的缓存类型
         * @return
         */
        function checkCacheData(sType, nTimeOut) {
            var theTime = new Date();
            if (userCardHash[sType] == null) {
                userCardHash[sType] = {};
            }
            if (userCardHash[sType][viewUID] == null) {
                userCardHash[sType][viewUID] = {
                    time: 0,
                    data: null
                };
            }
            var cacheData = userCardHash[sType][viewUID];
            //console.log((theTime - cacheData.time) + ":" + nTimeOut);
            if (theTime - cacheData.time > nTimeOut) {
                return false;
            }
            return true;
        }

        function loadBottleInfo(sUID) {
            var varName = "_BlogbidInfo";
            var timeOut = 1000 * 60;
            // 通过瓶子ID拿到UID以及基本信息
            if (checkCacheData(varName, timeOut) == false) {
                var bottleScriptLoader = new JsLoader();
                bottleScriptLoader.onsuccess = Core.Function.bind3(ScriptLoaderFunc, this, [sUID, {
                    varname: varName,
                    func: viewBottle,
                    callback: viewNickName,
                    timeout: timeOut
                }]);
                bottleScriptLoader.onfailure = Core.Function.bind3(ScriptLoaderFunc, this, [sUID, {
                    error: true,
                    func: viewBottle
                }]);
                bottleScriptLoader.load("http://blogutil.sinajs.cn/bottle?bid=" + sUID + "&var=" + varName, "utf-8");
                resetDialog("载入中...");
            } else {
                var o = getCacheData(varName);
                viewBottle(o[0], o[1]);
            }
        }

        function loadNickName(sUID) {
            var varName = "_BlogbidNickName";
            var timeOut = 1000 * 60 * 60;
            // 通过瓶子ID拿到UID以及基本信息
            if (checkCacheData(varName, timeOut) == false) {
                var bottleScriptLoader = new JsLoader();
                bottleScriptLoader.onsuccess = Core.Function.bind3(ScriptLoaderFunc, this, [sUID, {
                    varname: varName,
                    func: viewNickName,
                    timeout: timeOut
                }]);
                bottleScriptLoader.onfailure = Core.Function.bind3(ScriptLoaderFunc, this, [sUID, {
                    error: true,
                    func: viewNickName
                }]);
                bottleScriptLoader.load("http://uic.sinajs.cn/uic?type=nick&uids=" + sUID + "&varname=" + varName, "utf-8");
            } else {
                var o = getCacheData(varName);
                viewNickName(o[0], o[1]);
            }
        }

        function ScriptLoaderFunc(sUID, oOption) {
            oOption = oOption || {};
            var error;
            if (oOption.error == null) {
                error = false;
            } else {
                error = oOption.error;
            }
            var varname = oOption.varname || "";
            var func = oOption.func || function () {
            };
            var callback = oOption.callback || function () {
            };
            var timeout = oOption.timeout || 0;
            func(null, {
                uid: sUID,
                error: error,
                varname: varname,
                callback: callback,
                timeout: timeout
            });
        }

        function viewBottle(oVar, oData) {
            var o = oVar ? oVar : window[oData.varname];
            var error = oData.error == true || o == null ? true : false;
            if (error == false) {
                o.msg = o.msg == "" ? "......" : o.msg;
                cardNodes.content_box.innerHTML = o.msg.replace(/\n/g, "<br />");
                cardNodes.info_time.innerHTML = formatTime(o.time * 1000);
                cardNodes.info_img.src = "http://portrait" + (o.uid % 8 + 1) + ".sinaimg.cn/" + o.uid + "/blog/30";
                saveCacheData(oData.varname, [o, oData], oData.timeout);
                loadNickName(o.uid);
                activeUID = o.uid;

                Core.Dom.setStyle(cardNodes.iframe, "height", cardNodes.card.offsetHeight + "px");
                Core.Dom.setStyle(cardNodes.bg_middle, "height", cardNodes.card.offsetHeight + "px");
                Core.Dom.setStyle(cardNodes.bg_top, "height", cardNodes.card.offsetHeight + "px");
                if ($IE) {
//					alert("1cardNodes.ad_box.innerHTML="+cardNodes.ad_box.innerHTML);
//					alert("1cardNodes.card.innerHTML="+cardNodes.card.innerHTML);
//					alert(typeof cardNodes.card.offsetHeight);
//					alert(typeof cardNodes.ad_box.offsetHeight)
                    Core.Dom.setStyle(cardNodes.ad_box, "top", (cardNodes.card.offsetHeight - cardNodes.ad_box.offsetHeight - 10) + "px");
//                	alert("1 end");
                }
                try {
                    delete window[oData.varname];
                } catch (e) {
                    window[oData.varname] = null;
                }
            } else {
                resetDialog("载入失败...");
            }
        }

        function viewNickName(oVar, oData) {
            var o = oVar ? oVar : window[oData.varname];
            var error = oData.error || window[oData.varname] == null && oVar == null ? true : false;
            if (error == false) {
                cardNodes.reply_title.innerHTML = cardNodes.info_nick.innerHTML = "<a href='http://blog.sina.com.cn/u/" + oData.uid + "' target='_blank'>" + o[oData.uid] + "</a>";
                saveCacheData(oData.varname, [o, oData], oData.timeout);
                try {
                    delete window[oData.varname];
                } catch (e) {
                    window[oData.varname] = null;
                }
            } else {
                resetDialog("载入失败...");
            }
        }

        function fixZero(n) {
            if (n < 10) {
                return "0" + n;
            }
            return n;
        }

        function formatTime(nTime) {
            var d = new Date(nTime);
            return d.getFullYear() + "-" + fixZero((d.getMonth() + 1)) + "-" + fixZero(d.getDate()) + " " + fixZero(d.getHours()) + ":" + fixZero(d.getMinutes()) + ":" + fixZero(d.getSeconds());
        }

        ////鼠标焦点在文本后
        function setCursor(o) {
            var rng;
            if (document.all) {
                rng = o.createTextRange();
                rng.move("textedit");
                rng.select();
            } else {
                rng = document.createRange();
                o.focus();
                rng.setStartAfter(o);
            }
        }

        /** 提交数据 */
        function postContent(_new) {

            cardNodes.alpha.style.display = "block";
            cardNodes.alpha.style.width = cardNodes.card.offsetWidth + "px";
            cardNodes.alpha.style.height = cardNodes.card.offsetHeight + "px";
            cardNodes.load_label.style.top = (cardNodes.card.offsetHeight / 2 - 10) + "px";

            if ($isLogin != true) {
                if (cardNodes.username.value == "") {
                    showError("001");
                    cardNodes.alpha.style.display = "none";
                    cardNodes.username.focus();
                    cardNodes.username.select();
                    return;
                }
                if (cardNodes.password.value == "") {
                    showError("002");
                    cardNodes.alpha.style.display = "none";
                    cardNodes.password.focus();
                    cardNodes.password.select();
                    return;
                }

                var _info = {
                    loginname: cardNodes.username.value,
                    loginpwd: cardNodes.password.value,
                    check_word: cardNodes.check_input.value,
                    productid: "0x00000001"
                };

                var request = new Lib.Login.LoginPost(function (loginStatus) {
                    if (loginStatus.result) {
                        //登陆成功
                        Lib.checkAuthor();
                        postContent(_new);
                        // 刷新托盘
                        $tray.renderLogin();
                    } else {
                        //登陆失败
                        trace("登陆失败 ：" + loginStatus.reason);
                        showError(loginStatus.reason);
                    }
                });
                request.login(_info.loginname, _info.loginpwd);
                return;
            } else {
                if (cardNodes.check_input.value == "") {
                    showError("003");
                    cardNodes.alpha.style.display = "none";
                    cardNodes.check_input.focus();
                    cardNodes.check_input.select();
                    return;
                }
                if (cardNodes.textarea.value == "") {
                    showError("B20006");
                    cardNodes.alpha.style.display = "none";
                    cardNodes.textarea.focus();
                    cardNodes.textarea.select();
                    return;
                }
                var _postData = new Interface("http://control.blog.sina.com.cn/admin/olympic/bottle_" + (_new == true ? "send" : "reply") + "_post.php", "jsload");
                var _data = {
                    msg: cardNodes.textarea.value,
                    login_check: cardNodes.check_input.value,
                    bid: activeBID || "0",
                    version: 7
                };
                if (actionStatus == 3 || actionStatus == 4) {
                    _data.is_reply = 1;
                    // 发瓶子者的UID
                    _data.uid = activeUID;
                }
                if (actionStatus == 2) {

                    _data.is_reply = 2;

                }
                _postData.request({
                    GET: _data,
                    onSuccess: function () {
                        cardNodes.alpha.style.display = "none";
                        var cls = "blog_bottle_msg";
                        if (actionStatus == 2) {
                            cls = "blog_bottle_msg blog_bottle_status_send_ok";
                        } else if (actionStatus == 3 || actionStatus == 4) {
                            cls = "blog_bottle_msg blog_bottle_status_reply_ok";
                        }
                        cardNodes.card.className = cls;

                        Core.Dom.setStyle(cardNodes.iframe, "height", cardNodes.card.offsetHeight + "px");
                        Core.Dom.setStyle(cardNodes.bg_middle, "height", cardNodes.card.offsetHeight + "px");
                        Core.Dom.setStyle(cardNodes.bg_top, "height", cardNodes.card.offsetHeight + "px");
                        if ($IE) {
//							alert("2cardNodes.ad_box.innerHTML="+cardNodes.ad_box.innerHTML);
//							alert("2cardNodes.card.innerHTML="+cardNodes.card.innerHTML);
                            Core.Dom.setStyle(cardNodes.ad_box, "top", (cardNodes.card.offsetHeight - cardNodes.ad_box.offsetHeight - 10) + "px");
//							alert("2 end");
                        }
                        refreshComp(38);
                    },
                    onError: function (_data) {
                        try {
//		                    if (targetWindow.BlogBottleMsg.getOtherClose()) {
                            window.BlogBottleMsg.hidden();
//		                    }
                        } catch (e) {
                        }
                        cardNodes.alpha.style.display = "none";
                        showError(_data.code);
                        reloadCheckIMG();
                    },
                    onFail: function () {
                        trace("许愿瓶接口异常");
                    }
                });
            }

        }

        /** 重载验证码 */
        function reloadCheckIMG() {
            cardNodes.check_img.src = "http://interface.blog.sina.com.cn/riaapi/checkwd_image.php?" + new Date().valueOf();
        }

        function resetDialog(sText) {
            //alert(getCookie("SU"));
            // 如果没有登陆
            Lib.checkAuthor();
            if (!$isLogin) {
                isLogin = false;
                Core.Dom.setStyle(cardNodes.login_box, "display", "block");
            } else {
                isLogin = true;
                Core.Dom.setStyle(cardNodes.login_box, "display", "none");
            }
            cardNodes.textarea.value = cardNodes.check_input.value = "";

            cardNodes.content_box.innerHTML = cardNodes.info_time.innerHTML = cardNodes.reply_title.innerHTML = cardNodes.info_nick.innerHTML = sText;

            cardNodes.info_img.src = defaultCacheIMG.src;
        }

        /**
         * 名片类
         * @author FlashSoft | fangchao@staff.sina.com.cn
         */
        function card() {
        }

        /**
         * 显示名片
         * @method
         * @param {String} sUID 用户UID
         * @param {Object} oPos 直接指定鼠标坐标
         * @author FlashSoft | fangchao@staff.sina.com.cn
         */
        card.show = function (sUID, oPos, nViewType, oTarget) {
            oTarget = oTarget || window;
            targetWindow.BlogBottleMsg.setViewUID(sUID);
            viewUID = targetWindow.BlogBottleMsg.getViewUID();
            // 如果HTML还未写到页面中
            if (isCreate == false) {
                return;
            }
            /** 基本信息初始化 */
            cardNodes = targetWindow.BlogBottleMsg.getNodes();

            cardPosHash = targetWindow.BlogBottleMsg.getPosHash();

            Core.Dom.setStyle(cardNodes.card, "visibility", "visible");

            var cls = "blog_bottle_msg";
            actionStatus = nViewType;
            if (nViewType == 1) {
                cls = "blog_bottle_msg blog_bottle_status_view";
            } else if (nViewType == 2) {
                cls = "blog_bottle_msg blog_bottle_status_send";
            } else if (nViewType == 3) {
                cls = "blog_bottle_msg blog_bottle_status_reply_mini";
            } else if (nViewType == 4) {
                cls = "blog_bottle_msg blog_bottle_status_reply";
            }
            cardNodes.card.className = cls;

            activeBID = sUID;
            var cardX = 0;
            var cardY = 0;
            var events = Core.Events.getEvent(), scrollPos;
            oPos = oPos == null ? {} : oPos;
            if (oPos.x && oPos.y) {
                cardX = oPos.x;
                cardY = oPos.y;
            } else {
                scrollPos = Core.System.getScrollPos();
                var pageSize = Core.System.pageSize();
                var dialogTop = (pageSize[3] - cardNodes.card.offsetHeight) / 2 + scrollPos[0];
                cardX = (pageSize[2] - cardNodes.card.offsetWidth) / 2;
                cardY = dialogTop < 0 ? 0 : dialogTop;
            }
            Core.Dom.setStyle(cardNodes.card, "left", cardX + "px");
            Core.Dom.setStyle(cardNodes.card, "top", cardY + "px");

            Core.Dom.setStyle(cardNodes.iframe, "height", cardNodes.card.offsetHeight + "px");
            Core.Dom.setStyle(cardNodes.bg_middle, "height", cardNodes.card.offsetHeight + "px");
            Core.Dom.setStyle(cardNodes.bg_top, "height", cardNodes.card.offsetHeight + "px");
            if ($IE) {
//				alert("3cardNodes.ad_box.innerHTML="+cardNodes.ad_box.innerHTML);
//				alert("3cardNodes.card.innerHTML="+cardNodes.card.innerHTML);
                Core.Dom.setStyle(cardNodes.ad_box, "top", (cardNodes.card.offsetHeight - cardNodes.ad_box.offsetHeight - 10) + "px");
//           		alert("3 end");
            }

            cardNodes.alpha.style.display = "none";

            resetDialog("");
            if (sUID != -1) {
                loadBottleInfo(sUID);
            }
            reloadCheckIMG();
            targetWindow.BlogBottleMsg.onView();
            joinSWF();

            Utils.Form.limitMaxLen(cardNodes.textarea, 200);

            try {
                Core.Events.stopEvent();
            } catch (e) {
            }

        };

        /**
         * 返回是否可以点击其他地方可以关闭名片
         * @method
         */
        card.getOtherClose = function () {
            return clickOtherClose;
        };

        /**
         * 返回名片所有节点
         * @method
         */
        card.getNodes = function () {
            return cardNodes;
        };
        /**
         * 返回名片所在窗口的各种信息
         * @method
         */
        card.getPosHash = function () {
            initPos();
            return cardPosHash;
        };
        /**
         * 设置当前显示名片的用户UID
         * @method
         * @param {Number} nUID
         */
        card.setViewUID = function (nUID) {
            viewUID = nUID;
        };
        /**
         * 返回当前显示名片的用户UID
         * @method
         * @param {Number} nUID
         */
        card.getViewUID = function () {
            return viewUID;
        };
        /**
         * 设置名片所在窗口
         * @method
         * @param {Window} oTarget 如果是子窗口调用,这个参数设定为parent
         */
        card.setViewTarget = function (oTarget) {
            targetWindow = oTarget;
            isParentInit = true;
        };
        /**
         * 关闭名片
         * @method
         */
        card.hidden = function () {
            Core.Dom.setStyle(cardNodes.card, "visibility", "hidden");
            targetWindow.BlogBottleMsg.onHidden();
        };

        /**
         * 设置名片的zIndex
         * @method
         * @param {Number} nZIndex
         */
        card.setZIndex = function (nZIndex) {
            userCardIndex = nZIndex;
        };

        card.traceInfo = function (sInfo) {
            trace(sInfo);
        };

        card.onView = function () {
        };
        card.onHidden = function () {
        };

        card.init = function (isWrite) {
            initCard(isWrite);
        };
        card.createContent = function () {
            return cardStyle + cardHTML.replace(/{Card}/g, "Blog_Bottle_Msg_" + rndID + "_");
        };
        return card;
    })();
}
