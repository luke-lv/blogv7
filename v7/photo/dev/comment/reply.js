/*
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 */
/** 
 * @fileoverview 回复评论
 * @author stan | chaoliang@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/core/class/create.js");
$import("sina/core/string/trim.js");
$import("sina/core/dom/getChildrenByClass.js");
$import("sina/core/dom/getElementsByClass.js");
$import("sina/core/string/decodeHTML.js");
$import("sina/core/system/br.js");
$import("sina/ui/template.js");
$import("sina/ui/slide.js");

$import("lib/interface.js");
$import("lib/showError.js");
$import("tempLib/insertSmiles/insertSmileFormInit.js");

$import("comment/_comment.js");
$import("comment/formatTime.js");

Comment.Reply = Core.Class.create();
Comment.Reply.prototype = {
    /**
     * 文章号id
     */
    articleid: 0,
    /**
     * 评论id
     */
    comment_id: 0,
    initialize: function(){
        this.articleid = picInfo.pic_id;
    },
    /**
     * 显示恢复框
     * @param {Object} id 评论id
     */
    reply: function(id){
        if ($E("reply_form")) {
            return;
        }
        var _this = this;
        this.comment_id = id;
        var replyBody = $C("div");
        replyBody.className = "SG_revert_Answer";
        replyBody.id = "reply_form";
        replyBody.innerHTML = this.reply_struc;
        var comment = $E("cmt_" + this.comment_id);
        this.cont = Core.Dom.getChildrenByClass(comment, "SG_revert_Cont")[0];
        this.cont.appendChild(replyBody);
        this.reply_slide = new Ui.Slide("reply_form", {
            opacity: true
        });
        this.reply_slide.onSlideOut = function(){
            //移除事件
            Core.Events.removeEvent("reply_btn", reply_btn_click);
            Core.Events.removeEvent("reply_cancel", reply_cancel_click);
            Core.Dom.removeNode("reply_form");
        };
        //提示还可以输入几个字
		var inputTips = function(){
            var s = $E("reply_txt").value;
            var maxLength = 2000;
            if (Core.String.byteLength(s) > maxLength) {
                $E("words_num").innerHTML = "0";
            }
            else {
                $E("words_num").innerHTML = Math.floor((maxLength - Core.String.byteLength(s)) / 2);
            }
        };
		var arrPix = [($IE ? -321 : -319), 38 + ($IE ? -1 : 3)];
		var events = {
			'interval' : {
				'after' : function(frameId, area) {
					scope.commEditor.handleChange(frameId);
					var maxLength = 2000;
					var str = area.value;
					var len = 1000;
					if(str != '\n' && str != '\u000D\u000A') {
						len = Math.floor((maxLength - Core.String.byteLength(str)) / 2);;
					}
					if(len >= 0) {
						$E('words_num').innerHTML = len;
						$E('words_num2').parentNode.style.display = 'none';
						$E('words_num').parentNode.style.display = '';
					} else {
						$E('words_num2').innerHTML = (-1)*len;
						$E('words_num2').parentNode.style.display = '';
						$E('words_num').parentNode.style.display = 'none';
					}
				}
			}
		}
		App.formInsertSmile2("reply_txt", "reply_smile", null, inputTips, "reply_smile", arrPix,'replayIframe',events);
        this.reply_slide.hide();
        this.reply_slide.slideIn();
        Core.Events.addEvent("reply_btn", reply_btn_click);
        Core.Events.addEvent("reply_cancel", reply_cancel_click);
        this.reply_btn = this.getReplyButton(id);
        this.reply_btn.style.display = "none";
        
		function reply_btn_click(){
			_this.post.bind2(_this)();
		}
		
		function reply_cancel_click(){
			_this.reply_slide.slideOut();
			_this.reply_btn.style.display = "";
		}
		
        //做字数限制
        if ($IE) {
			Core.Events.addEvent($E("reply_txt"),function(){
				var nValue = $E("reply_txt").value;
                var strLen = Core.String.byteLength(nValue);
                if (strLen > 2000) {
                    $E("reply_txt").value = Core.String.leftB(nValue, 2000);
                }
			},'blur');
        }
        else {
            Utils.limitLength($E("reply_txt"), 2000);
        }

        //Core.Events.addEvent($E("reply_txt"), inputTips, 'keyup');
        //Core.Events.addEvent($E("reply_txt"), inputTips, 'propertychange');
        //Core.Events.addEvent($E("reply_txt"), inputTips, 'input');
    },
    /**
     * 发表回复
     * @param {Object} reply_id 评论id
     */
    post: function(){
        var inter = new Interface("http://control.blog.sina.com.cn/admin/comment/comment_reply_post.php", "ijax");
        var data = {};
        data.comment_id = this.comment_id;
        data.blogerid = scope.$uid;
        scope.commEditor.handleChange("replayIframe");
        data.reply_content = $E("reply_txt").value;
		data.is_photo = 1;
        if (Core.String.trim(data.reply_content) == "") {
            showError("B36041");
            return;
        }
//		alert(data.reply_content);
        data.article_id = this.articleid;
        inter.request({
            POST: data,
            onSuccess: function(result){
//              trace("回复成功了");
                this.reply_slide.slideOut();
                var vs = {
                    reply_time: Comment.formatTime(),
                    reply_id: this.comment_id,
                    reply_txt: Core.String.encodeHTML(data.reply_content)
                };
				var _userContent = data.reply_content.replace(/\r\n|\n/gi, "###line-return###");
				_userContent = Core.String.encodeHTML(_userContent);
				var _re = /\[emoticons=(E___\w*)\]([^[]*)\[\/emoticons\]/gi;
				var _html = '<img src="http://www.sinaimg.cn/uc/myshow/blog/misc/gif/$1T.gif" style="margin:1px;'
						+ 'cursor:pointer;" onclick="window.open(\'http://control.blog.sina.com.cn/admin/myshow/'
						+ 'myshow.php?code=$1\')" border="0" title="$2" />';
				_userContent = _userContent.replace(_re, _html);
				
				//处理魔法表情
		
				var _magicReg=/\[magicemoticons=([E|W]___\w*)\&nbsp\;swfname=(\w+\.swf)\]([^[]*)\[\/magicemoticons\]/gi;
				//var _magicReg=/\[magicemoticons=(E___\w*)\&nbsp;swfname=(\w*)\]([^[]*)\[\/magicemoticons\]/gi;
				var _magichtml =['<img src="http://www.sinaimg.cn/uc/myshow/blog/misc/gif/$1T.gif" style="margin:1px;',
				'cursor:pointer;" onclick="window.$magicFacePlay(\'$2\');return false;"',
				' border="0" title="$3" width="50" height="50"/>'].join("");
				_userContent = _userContent.replace(_magicReg, _magichtml);
				
				_userContent = _userContent.replace(/###line-return###/gi, "<br/>");
				vs.reply_txt = _userContent;
                var tmp = new Ui.Template(this.reply_display_struc);
                var c = $C("div");
                c.innerHTML = tmp.evaluate(vs);
                this.cont.appendChild(c);                
            }.bind2(this),
            onError: function(result){
//              trace("删除评论返回状态码：" + result.code);
				if(result.code == 'B00006') {
					//用户的重复点击
					return;
				}
                showError(result.code);
            }.bind2(this),
            onFail: function(){
//                trace("回复评论失败");
                windowDialog.alert("发评论失败！请重试。", {
                    "icon": "02"
                });
            }.bind2(this)
        });
    },
    /**
     * 删除恢复
     * @param {Object} reply_id 评论id
     */
    del: function(reply_id){
        var del_url = new Interface("http://control.blog.sina.com.cn/admin/comment/comment_del_reply_post.php", $IE6 ? "ijax" : "jsload");
        var _param = {
            "comment_id": this.articleid + "|" + reply_id,
            "page_id": scope.$comment_page,
            "blogerid": scope.$uid,
            "uid": $UID,
			"is_photo": 1,
			"version": 7
        };
        del_url.request({
            GET: _param,
            onSuccess: function(result){
//                trace("删除回复成功");
                var reply_btn = this.getReplyButton(reply_id);
                reply_btn.style.display = "";
                var node = $E("reply_" + reply_id);
                var slide = new Ui.Slide(node);
                slide.onSlideOut = function(){
                    Core.Dom.removeNode(node.parentNode);
                }
                slide.slideOut();
            }.bind2(this)            ,
            onError: function(result){
//                trace("删除评论返回状态码：" + result.code);
                showError(result.code);
            }.bind2(this)            ,
            onFail: function(){
//                trace("删除失败！请重试。");
                windowDialog.alert("删除失败！请重试。", {
                    "icon": "02"
                });
            }
        });
    },
    /**
     * 取得对应id的回复按钮
     * @param {Object} reply_id
     */
    getReplyButton: function(reply_id){
        var _manageBtn = Core.Dom.getElementsByClass($E("cmt_" + reply_id), "a", "CP_a_fuc");
        return Core.Array.foreach(_manageBtn, function(e){
            if (/回复/.test(e.innerHTML)) {
                return e;
            }
        })[0];
    },
    /**
     * 取得当前时间 格式 2009-08-24 17:06:04
     */
    getTime: function(){
    
    },
    reply_struc: '\
		<!--<div class="SG_revert_Answer" id="reply_form">-->\
			<div class="SG_revert_Answer_Top">\
				<span class="SG_floatL">回复：</span>\
				<div class="faceblk SG_floatR"><div id="reply_smile" class="faceline1"></div><div class="clearit"></div></div>\
			</div>\
			<div class="SG_revert_Answer_right">\
				<textarea style="display:none" class="SG_textarea" id="reply_txt"></textarea>\
				<iframe frameBorder="0" style="height: 74px; background-color: #FFFFFF; border: 1px solid #C7C7C7; width: 517px;*width: 519px;" src="http://blog.sina.com.cn/main_v5/ria/blank.html" id="replayIframe"></iframe>\
				<div class="SG_revert_Btn">\
				<div class="SG_revert_Btn_left">\
					<span><a href="#" onclick="return false;" id="reply_btn" class="SG_aBtn"><cite>回复</cite></a></span>\
					<span><a href="#" onclick="return false;" id="reply_cancel" class="SG_aBtn"><cite>取消</cite></a></span>\
					<span class="SG_txtb">还可以输入<b id="words_num" style="font-weight:400;">1000</b>个汉字</span>\
					<span style="display:none;color:red" class="SG_txtb">已超过<b id="words_num2" style="font-weight:400;">0</b>个汉字</span>\
				</div>\
				</div>\
			</div>\
		<!--</div>-->\
	',
    reply_display_struc: '\
		<div class="SG_revert_Re SG_j_linedot1" id="reply_#{reply_id}">\
			<p>\
				<span class="SG_floatL"><a href="#"class="SG_linka" >博主回复：</a></span>\
				<span class="SG_floatR">\
					<em class="SG_txtc">#{reply_time}</em>\
					<a class="CP_a_fuc" href="#" onclick="del_reply(#{reply_id});return false;">[<cite>删除</cite>]</a>\
				</span>\
			</p>\
			<p class="myReInfo wordwrap">#{reply_txt}</p>\
		</div>\
	'
};

