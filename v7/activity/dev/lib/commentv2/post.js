/*
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 */
/** 
 * @fileoverview 评论发表
 * @author stan | chaoliang@staff.sina.com.cn
 */
$import("sina/core/class/create.js");
$import("sina/core/function/bind2.js");
$import("sina/ui/slide.js");
$import("sina/core/dom/removeParentNode.js");
$import("sina/core/string/encodeHTML.js");
$import("sina/core/dom/getXY.js");
$import("sina/core/dom/addHTML.js");
$import("sina/utils/json.js");
$import("sina/utils/utils.js");
$import("sina/core/system/getScrollPos.js");
$import("sina/core/system/pageSize.js");
$import("sina/core/dom/opacity.js");
$import("sina/ui/tween/tweenStrategy.js");
$import("sina/ui/tween/transition.js");
$import("component/tween/TweenStrategyEx.js");

$import("lib/login/loginPost.js");
$import("lib/interface.js");
$import("lib/checkAuthor.js");
$import("lib/showError.js");
$import("lib/uic.js");
$import("lib/blogv/getVHTML.js");
$import("lib/sendLog.js");

$import("msg/blogComment.js");
$import("lib/commentv2/comment2TSina.js");
$import("lib/commentv2/checkUserProduct.js");
$import("lib/commentv2/formatTime.js");
$import("lib/commentv2/add.js");

CommentV2.Post = Core.Class.create();

CommentV2.Post.prototype = {
    /**
     * 文章号id
     */
    articleid: 0,
    /**
     * 评论总量
     */
    totle: 0,
    /**
     * 是否匿名评论
     */
    anonyous: false,
    /**
     * 成功事件
     */
    onSuccess: new Function(),
    /**
     * 失败事件
     */
    onError: new Function(),
    initialize: function(){
    
    },
    /**
     * 发表评论
     */
    post: function(data){
        try {
            this.data = data;
            this.data.article_id = this.articleid;
            this.data.uid = $isLogin ? $UID : "";
            this.data.fromtype = "commentadd";
            this.data.anonymity = this.data.anonymity || this.anonyous || false;//this.anonyous; 不管是否登录都可以匿名发表--Modifed by wangqiang1
            //this.data.v = 1;		//统计参数。
            if (this.data.anonymity) {
        		this.data.login_name = this.data.comment_anonyous;
            }
            //delete this.data.comment_anonyous;
            //delete this.data.login_name;
            //delete this.data.login_pass;
            Lib.checkAuthor();
            if ($isLogin) {
				//trace('is login post');
				//trace('登陆发布');
            	this.data.login_name = $nick;
                this.postComment(this.data);
            }else {
                //trace("I GET THE SECONDS:"+this.anonyous);
                if (this.anonyous) {
                    this.postComment(this.data);
                } else {
                	if($E("login_remember")){
                		if(this.data.login_remember){
	                		v7sendLog('48_01_37_1');
	                	}else{
	                		v7sendLog('48_01_37_0');
	                	}
                	}
                    new Lib.Login.LoginPost(function(res){
                        Lib.checkAuthor();
						if ($isLogin) {
							//trace('登陆情况下发评论');
			            	this.data.login_name = $nick;
							this.postComment(this.data);
							this.renderLogin();
						}
						else {
							// console.log(res);
							// this.refreshCKIMG();
							if (res && res.errno && (res.errno === "4049" || res.errno === "2070")){//需输入验证码或验证码错误
								this.loginNeedSafeCode(res);
								return;
							}else{
								winDialog.alert((res && res.reason) || "登录名或密码错误！", {
								"icon": "02"
								});
							}
							
							this.refreshCKIMG();
							$E('commentloginM').style.display = 'none';
							$E('commentlogin').style.display = "block";
							$E('commentNick').style.display = "";
							$E('commentNick').innerHTML = "";
							// 隐藏匿名评论input  未登录时，不允许评论		Modified by gaolei2@staff 2013.11.4
							if ($E("anonymity_cont")) {
								$E("anonymity").checked = false;
								$E("anonymity_cont").style.display = "none";
							}
						}
						//trace("----IS LOGIN----"+$isLogin);
                    }.bind2(this),false,"referer:"+location.hostname+location.pathname+",func:0001").login(data.login_name, data.login_pass,data.login_remember==true?15:0);	//添加统计点。
                }
            }
        }catch (e) {
            trace(e);
        }
    },
	renderLogin:function(){
		//发评论前未登陆，输入用户名密码正确登陆后发评论，需要将登陆状态刷新到页面上
		$tray.renderLogin();
		$E('commentlogin').style.display = 'none';
		var _this = this;
		var commentNick = $E("commentNick");
		var showNickPlace = function(){//在昵称处应该显示的东西 
            if (checkUserProduct.flag == true) {//说明用户开通了博客产品
                scope.setNickTime = setInterval(function(){
                    var vHTML = Lib.blogv.getVHTML(scope.loginUserWtype);
                    if (typeof scope.$loginNick == 'undefined') {
                        
                        Lib.Uic.getNickName([$UID], function(oResult){
                            for (var key in oResult) {
                                scope.$loginNick = oResult[key];
                                commentNick.innerHTML = scope.$loginNick + "&nbsp;" + vHTML + ':';
                                //未登录下发表评论之后昵称不显示 @modified xiaoyue3
                                commentNick.style.display="";
                            }
                        });
                        clearInterval(scope.setNickTime);
                    } else {
                        commentNick.innerHTML = scope.$loginNick + "&nbsp;" + vHTML + ':';
                    }
                }, 500);
            }
            else {//说明用户没有开通博客产品 
				_this._showOpenBlogInfo();
            }
        };
		
		if (commentNick.innerHTML == '') {
			if (checkUserProduct.isinit == false) {
                window.checkuserinterval = setInterval(function(){
                    if (checkUserProduct.isinit == false) {
                        checkUserProduct.check("blog", showNickPlace);
                    }
                    else {
                        clearInterval(window.checkuserinterval);
                    }
                }, 500);
                
            }
            else {
                showNickPlace();
            }
		}
		// /*---------登录后也可以匿名发表评论，Modified by wangqiang1@staff.sina.com.cn 2011-04-14
		// 显示匿名评论input 登录后可以匿名发表评论		Modified by gaolei2@staff 2013.11.4
		if ($E("anonymity_cont")) {
			$E('anonymity_cont').style.display = '';
		}
		// */
	},
    /*
     * 显示开通博客浮层
     * 
     */
	_showOpenBlogInfo : function(){
		for(var child = $E("commentNick").firstChild; child; child = child.nextSibling){
    		$E("commentNick").removeChild(child);
    	}
		$E("commentNick").style.display = "";
		$E("commentNick").innerHTML = '<div id="openblog-li" style="cursor:pointer;"><a href="javascript:void(0);"><span id="openblog-nickname"></span>您还未开通博客，点击一秒开通。</a></div>';
		scope.addBlogOpenerEvent($E("openblog-li"));
		if($E("anonymity")){
			$E("commentloginM").style.display = "";
			$E("anonymity").checked = true;
			$E("quote_comment_p").style.display = "none";
		}
		var nickNameTime = setInterval(function(){
			if(!scope.nickname){
				return;
			}
            
			$E("openblog-nickname").innerHTML = scope.nickname+'：';
			clearInterval(nickNameTime);
		}, 500);
	},
	
	/**
     * 发起评论请求
     * @param {Object} data	参数
     */
    postComment: function(data){
		// 发评论布码
		v7sendLog('32_01_19');
		var startTime = new Date().getTime();
		function recordHttpTime (nTime) {
			if (!nTime){
				var endTime = new Date().getTime();
				nTime = endTime - startTime;
			}
			Utils.Io.JsLoad.request("http://control.blog.sina.com.cn/admin/article/ria_debug.php", {
				GET :{
					type	: "addBlogComment",
					usetime	: nTime
				},
				noreturn : true
			});
		}
        // var inter = new Interface("http://control.blog.sina.com.cn/admin/comment/comment_post.php?version=7", "ijax");
		var option = {
			POST: data,
            onComplete: function(result){
				if(typeof result == "string"){
					result = result.replace(/;$/, "");
				}

				result = (typeof result == "string" && (/\s*{/.test(result))) ? Core.String.j2o(result) : result;
				// 如果接口返回对象没有 code 属性，视为接口异常
				if(result != null && typeof result.code == "undefined"){
					trace("接口数据异常：" + this.url, "#F00");
					return;
				}
				if (result.code == "A00006"){
					v7sendLog('45_01_12_'+ scope.$uid); 
					result = result.data;
					if(data.is_mobile){
						if(result.insertid.charAt(0)==="N"){
							result.insertid = result.insertid.slice(1);
						}
						var tsina = result.t_sina;
						if(tsina && tsina.charAt(0)==="N"){
							result.t_sina = tsina.slice(1);
						}
					}

					recordHttpTime();
					Lib.checkAuthor();

					// scope.$totle_comment++;//评论总数加1
					// $E('c_' + this.articleid).innerHTML = "(" + scope.$totle_comment + ")";
					
					// 评论数量的变化全部已文章底部显示为准，返回值可能和他不同，加减评论时全部加减页面上的数字
					var str = $E('c_' + scope.$articleid).innerHTML;
					var num = parseInt(/(\d+)/.exec(str)[0], 10);
					num++;
					$E('c_' + this.articleid).innerHTML = "(" + num + ")";
					
					if($isLogin)
					{
						this.renderLogin();
					}

					this.addNewComment(data,result);
					
					var c2s = new Comment2TSina(this.anonyous, result);
					
					// 分享到微博布码
					if ($E("bb") && $E("bb").checked){
						v7sendLog('32_01_18');
					}
					c2s.writeCommTips();
					this.onSuccess();
                    
					if ($E('comment_get_vcode')) {
						//trace(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
						Lib.AudioCheck.render($E('comment_get_vcode').parentNode, Lib.AudioCheck.soundUrl + "?" + new Date().getTime());
					}else{
						//trace(',,,,,,,,,,,,,,,,,,,,,,,,,,,');
					}

				}else{
					v7sendLog('32_01_21'); 
					recordHttpTime();
					this.refreshCKIMG();
					if(result.code == "B36113"){
						//不允许匿名评论时，隐藏匿名评论选项，显示登录表单
						winDialog.alert("博主已关闭匿名评论，请登录后再评论", {
							funcOk: function(){
								if ($E("anonymity_cont")) {
									$E("anonymity_cont").checked = false;
									$E("anonymity_cont").style.display = "none";
								}
								//$E("anonymity").checked = false;
								$E("commentlogin").style.display = "";
								$E("commentloginM").style.display="none";
							}
						});
					}else if(result.code == "B36002"){					//added by dcw1123，验证码错误则清空邀请码。
						winDialog.alert($SYSMSG["B36002"],{
							funcOk : function(){
								$E("login_check").value = "";
								$E("login_check").focus();
							}
						});
					}else{
						showError(result.code);
					}
					//trace("onError:" + result.code);
					if(result.code != null){
						//trace("##HH## I GET THE BREAKPOINT");
						Lib.checkAuthor();
						if ($isLogin) {
							return;
						}
						// 隐藏匿名评论input  未登录时，不允许评论		Modified by gaolei2@staff 2013.11.4
						if ($E("anonymity_cont")) {
							$E("anonymity").checked = false;
							$E("anonymity_cont").style.display = "none";
						}
						
						if ($E('anonymity').checked == true) {
							$E('commentloginM').style.display = 'block';
							$E('anonymity').checked = 'checked';
						}
						else {
							$E('commentloginM').style.display = 'none';
							$E('commentlogin').style.display="block";
						}
						$E('commentNick').innerHTML = "";
						$isLogin = false;
						this.anonyous = true;
					}
				}
            }.bind2(this),
            onException: function(result){
				v7sendLog('32_01_21'); 
				recordHttpTime(-1);
                trace("post comment error");
                winDialog.alert($SYSMSG[result.code] ||"发评论失败！请重试。", {
                    "icon": "02"
                });
            }.bind2(this)
		};
		// 评论系统  暂时改成新接口
		Utils.Io.Ijax.request("http://control.blog.sina.com.cn/admin/comment_new/cms_post.php", option);
		// Utils.Io.Ijax.request("http://control.blog.sina.com.cn/admin/comment/comment_post.php?version=7", option);
		var timer = setTimeout(function (){
			recordHttpTime(-1);
			clearTimeout(timer);timer = null;
		}, 30000);
    },
	refreshCKIMG:function(){
		if ($E("comment_check_img")) {
			$E("comment_check_img").src = "http://interface.blog.sina.com.cn/riaapi/checkwd_image.php?" + new Date().valueOf();
		}
		if ($E('comment_get_vcode')) {
			Lib.AudioCheck.render($E('comment_get_vcode').parentNode, Lib.AudioCheck.soundUrl+"?"+new Date().getTime());
		}
	},
    /**
     * 增加发表成功的评论
     */
    addNewComment: function(data,cId){

        //原因可能是http://blognum.sinajs.cn/num接口挂掉了，默认评论页数是第一页，先让假评论显示出来--Qiangyee | wangqiang1  2011-06-07
        if(isNaN(scope.$comment_page) || ("undefined" == typeof(scope.$comment_page)) ){
            scope.$comment_page = 1;
        }
        //刷新评论区域
        var pages = CommentV2.count(scope.$totle_comment); //增加发成功的一个
		
        //trace("当前页" + scope.$comment_page);
        //trace("页总数" + pages);
        //trace("评论数" + scope.$totle_comment);
        
        //由于需要进行换行，不好匹配各种html标签，规则比较复杂，因此还是刷新评论处
		Lib.checkAuthor();
		
		this.getPostTemplet(data,cId);
		// var commentContent = $E('#comment'+scope.$comment_page);

    },
	
	commentTween: function(li){
		var me = this;
		var commentContent = $E('article_comment_list');
        var beginEl;
        if (scope.$pageid.indexOf("articletj") === -1){
            commentContent.appendChild(li);
            beginEl = $E('postCommentIframe');
        } else {
            var firstLi = $T(commentContent, 'li')[0];
            if (firstLi){
                firstLi.className = 'SG_j_linedot1';
                commentContent.insertBefore(li, firstLi);
            } else {
                commentContent.appendChild(li);
            }
            beginEl = $E('postcommentid');
        }
        var endPos = Core.Dom.getXY(li);
        //endPos[1] += $E('article_comment_list').offsetHeight;
        var beginPos = Core.Dom.getXY(beginEl);

        new rockIt(li, beginPos, endPos, 0, 300, "elasticEaseInOut", {'end':function(o){
            o.clear();
            Core.Dom.opacity(li, 0);
            // debugger;
            if (scope.$pageid.indexOf("articletj") === -1){
                commentContent.appendChild(li);
                beginEl = $E('postCommentIframe');
            } else {
                commentContent.insertBefore(li, commentContent.firstChild);
                beginEl = $E('postcommentid');
            }
            var opacVal = 0;
            var opac = function() {
                Core.Dom.opacity(li, opacVal);
                if(opacVal == 100) {
                    clearInterval(opTimer);
                    opacVal = 0;
                }
                opacVal += 20;
            }
            var opTimer = setInterval(opac,10);
            
            //li.removeAttribute('style');
            //debugger;
            var real = me.getScollTop();
            //var posY = me.getMatchClientY(li);
            var posY = Core.Dom.getXY(li)[1];
            
            if(posY > real) {
                return;
            }
            
            //real = posY-real;
            var sReal = Math.abs(real);
            var step = 0;
            var start = 100;
            if(sReal <= 100) {
                step = sReal == real ? 1 : -1;
                start = sReal;
            } else {
                step = real/100;
            }
            //if(sReal != 0) {
                var _start = +new Date();
                var _duration = 500;
                
                var timer = setInterval(function(){
                    var func = window.$transitions['regularEaseOut'];
                    var now = +new Date();
                    if (now - _start < _duration){
                        var pass = now - _start;
                    }else{
                        var pass = _duration;
                        clearInterval(timer);
                    };
                    me.setScollTop(func(pass, real, posY-real, _duration));
                }, 15)

        }});
	},
	
	getScollTop : function(){
		var scrOfX = 0;
		var scrOfY = 0;
		if( document.body && ( document.body.scrollLeft || document.body.scrollTop ) ) {
			//DOM compliant
			scrOfY = document.body.scrollTop;
			scrOfX = document.body.scrollLeft;
		  } else if( document.documentElement && ( document.documentElement.scrollLeft || document.documentElement.scrollTop ) ) {
			//IE6 standards compliant mode
			scrOfY = document.documentElement.scrollTop;
			scrOfX = document.documentElement.scrollLeft;
		  }
		return scrOfY;
	},
	
	setScollTop : function(val) {
		if( document.body && ( document.body.scrollLeft || document.body.scrollTop ) ) {
			//DOM compliant
			document.body.scrollTop = val;
		  } else if( document.documentElement && ( document.documentElement.scrollLeft || document.documentElement.scrollTop ) ) {
			//IE6 standards compliant mode
			document.documentElement.scrollTop = val;
		  }
	},
	
	/**
	 * 生成一个回复的模板,由于有些信息不会显示，所以不使用模板
	 * @param {Object} data
	 * @param {Object} cId
	 */
	getPostTemplet : function(data,cId) {
		var __this = this;
		var isworldcup = cId.isworldcup;			//是否是世界杯。
		var res = cId;
		var cId = res.insertid || cId;				//作兼容。
		
		var item = {};
		item.id = cId;
		item.user_image = res.user_img;
		item.src_uid = scope.$uid;
		// debugger;
		if (data.anonymity){
			item.uname = data.comment_anonyous;
			item.comm_uid = 0;
		}else{
			item.ulink = 'http://blog.sina.com.cn/u/'+(data.uid || $UID);
			item.ria_index_url = item.ulink;
			var vHTML = Lib.blogv.getVHTML(scope.loginUserWtype);
			item.uname = (scope.nickname || data.login_name);
			if (vHTML){
				item.vimg = vHTML;
			}
			item.comm_uid = $UID;	// 判断是否显示回复及删除功能
		}
        //神回复添加
        if(data.god == 1){
            item.god = 1;
            item.cms_body = this.changeToContent(data.comment, "god");
        }else{
            item.cms_body = this.changeToContent(data.comment);
        }
		item.cms_pubdate = CommentV2.formatTime();
		item.fromProduct = res.from_product;	// 判断是否显示举报功能
		item.cms_reply_num = "0";
		
		item.action_data = encodeURIComponent(Utils.Json.flatten({
			commentid: item.id,
			articleid: res.blog_id,
			// cms_body: item.cms_body,
			fromProduct: res.from_product,
			comm_uid: item.comm_uid,
			uname: item.uname,
			ulink: item.ulink,
			src_uid: scope.$uid,
            cms_reply_num:item.cms_reply_num//二级评论数
		}));
		
		var lisData = {};
		lisData.item = item;
		lisData.fun = function(li){
			__this.commentTween(li);
		}
		Lib.Listener.notify("commentlist-commentadd", lisData);
		
		var noComm = this.isNoCotent();
        var isMid = (scope && scope.$pageid === 'articletj');
		if(noComm) {
			//移除掉暂无评论
			//setTimeout(function(){
				noComm.parentNode.removeChild(noComm);
			//},390);
		}
		// return li;
		
		//从这里结束修改成新版本的评论列表   added by gaolei2@staff
	},
	
	/**
	 * 检测是否有评论。当评论存在，被删除出现'暂无评论。'和直接显示'暂无评论。'的位置不一样
	 * @return {Element} 返回'暂无评论。'的节点
	 */
	isNoCotent : function() {
		var outContainer = $E('article_comment_list');
		var li = outContainer.getElementsByTagName('li');
		for(var i=0; li[i]; i++) {
			var div = li[i].getElementsByTagName('div');
			for(var j=0; div[j]; j++) {
				if(div[j].className.toUpperCase().indexOf('NOCOMMDATE')!= -1) {
					return li[i];
				}
			}
		}
		return null;
	},
	
	/**
	 * 把发表的内容转成HTML代码,显示在页面上
	 * @param {String} str 要转换的内容
	 * @return String 转换好的HTML
	 */
	changeToContent : function(str, type) {
        //因为原表情图找不到是哪里上传和管理的，因此将神回复表情图放在了blog7style下，这里修改下路径。
        var imgPath = 'http://www.sinaimg.cn/uc/myshow/blog/misc/gif/';
        if(type == 'god'){
            imgPath = 'http://simg.sinajs.cn/blog7style/images/common/godreply/';
        }
		var _userContent = str.replace(/\r\n|\n/gi, "###line-return###");
		_userContent = Core.String.encodeHTML(_userContent);
		var _re = /\[emoticons=(E___\w*)\]([^[]*)\[\/emoticons\]/gi;
		/*
        var _html = '<img src="'+imgPath+'$1T.gif" style="margin:1px;'
				+ 'cursor:pointer;" onclick="window.open(\'http://blog.sina.com.cn/myshow2010'
				+ '\')" border="0" title="$2" />';
        *///删除跳转onclick 2014-09-01 jiangwei
        var _html = '<img src="'+imgPath+'$1T.gif" style="margin:1px;" border="0" title="$2" />';
		_userContent = _userContent.replace(_re, _html);
		//处理魔法表情
		
		var _magicReg=/\[magicemoticons=([E|W]___\w*)\&nbsp\;swfname=(\w+\.swf)\]([^[]*)\[\/magicemoticons\]/gi;
		//var _magicReg=/\[magicemoticons=(E___\w*)\&nbsp;swfname=(\w*)\]([^[]*)\[\/magicemoticons\]/gi;
		/*
        var _magichtml =['<img src="'+imgPath+'$1T.gif" style="margin:1px;',
				'cursor:pointer;" onclick="window.$magicFacePlay(\'$2\');return false;"',
				' border="0" title="$3" width="50" height="50"/>'].join("");				
		*///删除跳转onclick 2014-09-01 jiangwei
        var _magichtml = '<img src="'+imgPath+'$1T.gif" style="margin:1px;" border="0" title="$3" width="50" height="50"/>';
                
        _userContent = _userContent.replace(_magicReg, _magichtml);
		
		_userContent = _userContent.replace(/###line-return###/gi, "<br/>");
		return _userContent;
	},
	/**
	 * 登录需要验证码，弹出浮层
	 */
	loginNeedSafeCode: function(res){
		var that = this;
		var safeimgsrc = "http://login.sina.com.cn/cgi/pin.php";
		var tpl = ['<table id="#{entity}" class="CP_w">', '<thead id="#{titleBar}">', '<tr>', '<th class="tLeft"><span></span></th>', '<th class="tMid">', '<div class="bLyTop">', '<strong id="#{titleName}"></strong>', '<cite><a title="关闭" class="CP_w_shut"  id="#{btnClose}" href="javascript:;">关闭</a></cite>', '</div>', '</th>', '<th class="tRight"><span></span></th>', '</tr>', '</thead>', '<tfoot>', '<tr>', '<td class="tLeft"><span></span></td>', '<td class="tMid"><span></span></td>', '<td class="tRight"><span></span></td>', '</tr>', '</tfoot>', '<tbody>', '<tr>', '<td class="tLeft"><span></span></td>', '<td class="tMid">', '<div class="" style="width:auto;" id="#{content}">', '</div>', '</td>', '<td class="tRight"><span></span></td>', '</tr>', '</tbody>', '</table>'].join("");
		
		var content = '<div class="CP_layercon1">'+
								'<div class="verifyPrompt"><p>为了保护你的账号安全，请输入验证码进行登录</p>'+
									'<div class="row1"><strong>验证码：</strong>'+
										'<input type="text" maxlength="5" id="xssSafeCodeDiag_checkword" class="fm1">'+
										'<img width="100" align="absmiddle" src="http://login.sina.com.cn/cgi/pin.php?r=11681364785467546&amp;s=0" maxlength="5" id="xssSafeCodeDiag_safeimg">'+
										'<a id="" href="javascript:void(0); return false;" onclick="scope.xssSafeCodeDiag.changeSafeCode();">换一换</a>'+
									'</div>'+
									'<p class="CP_w_btns">'+
										'<a id="" href="javascript:void(0); return false;" class="CP_a_btn2" onclick="scope.xssSafeCodeDiag.ok();"><cite><span>登录</span></cite></a>'+
										'<span style="display:none" id="xssSafeCodeDiag_ErrTips" class="ErrTips"></span>'+
									'</p>'+
								'</div>'+
							'</div>';
		
		if (typeof scope.xssSafeCodeDiag == 'undefined') {
			scope.xssSafeCodeDiag =  winDialog.createCustomsDialog({
				tpl: tpl,
				title: "提示",
				content: content,
				width: 282,
				height: 180,
				funcDisplayFinished: function(){
				}
			}, "note");
			
			scope.xssSafeCodeDiag.changeSafeCode = function()
			{
				$E('xssSafeCodeDiag_checkword').value = '';
				$E('xssSafeCodeDiag_safeimg').src = 'http://login.sina.com.cn/cgi/pin.php?r='+ Core.Math.getUniqueId() +'&s=0';
			}
			scope.xssSafeCodeDiag.ok= function()
			{
				var v = $E('xssSafeCodeDiag_checkword').value;
				if(v===''){
					$E("xssSafeCodeDiag_ErrTips").innerHTML = "请输入验证码";
					$E("xssSafeCodeDiag_ErrTips").style.display = "";
					return;
				}

				if (typeof sinaSSOController != 'undefined' && typeof sinaSSOController.loginExtraQuery != 'undefined'){
					if (typeof sinaSSOController.loginExtraQuery.door != 'undefined'){
						sinaSSOController.loginExtraQuery.door = v || 1;
					}
				}
				sinaSSOController.loginExtraQuery.door = v || 1;
				that.post(that.data);
				scope.xssSafeCodeDiag.hidden();
			}
			scope.xssSafeCodeDiag.displayError = function(res){
				if (res.errno !== "4049"){
					$E("xssSafeCodeDiag_ErrTips").innerHTML = res.reason;
					$E("xssSafeCodeDiag_ErrTips").style.display = "";
				}else{
					$E("xssSafeCodeDiag_ErrTips").style.display = "none";
				}
			}
		}
		
		scope.xssSafeCodeDiag.show();
		scope.xssSafeCodeDiag.setMiddle();
		scope.xssSafeCodeDiag.changeSafeCode();
		scope.xssSafeCodeDiag.displayError(res);
	}
};

function rockIt(node, startPos, endPos, rounds, duration, mode, func){
	if (!node) return;
	var uid = _getNodeUid(node);
	if (!uid) {
		node.setAttribute('rotationId', uid = _getNodeUid());
	}
	var inst = rockIt.instances || (rockIt.instances = {});
	if (inst[uid]) {
		_destroy(uid);
	}
	var transitions = Ui.Transition;
	window.$transitions = transitions;
	if (typeof func.begin == 'function'){
		func.begin();
	}

	node.style.position = 'absolute';
	document.body.appendChild(node);
	inst[uid] = {
		'node':node,
		'startPos':startPos,
		'endPos':endPos,
		'round':rounds,
		'func':func,
		'sTime':+new Date(),
		'duration': duration,
		'mode': mode || 'simple',
		'degree': 0,
		timer: 0
	};

	inst[uid].timer = setInterval(function(){
		var dt = +new Date();
		if (inst[uid]['sTime']+inst[uid]['duration'] < dt){
			_renderNode(uid, inst[uid]['duration']);
			if (typeof func.end == 'function'){
				func.end({'clear':_clearStyle});
			}
			_destroy(uid);
		}else{
			_renderNode(uid, dt - inst[uid]['sTime']);
		}
	}, 15);

	function _getNodeUid(node){
		if (node) {
			return node.getAttribute('rotationId');
		}else{
			return parseInt(Math.random()*10000) + +new Date();
		}
	}

	function _destroy(uid){
		clearInterval(inst[uid].timer);
		for (var key in inst[uid]){
			delete inst[uid][key];
		}
		delete inst[uid];
	}

	function _renderNode(uid, t){
		var trans = transitions[inst[uid]['mode']];
		var obj = inst[uid];
		var nodeStyle = obj.node.style;
		var d = obj['duration'];
		var b = obj['startPos'][0];
		var c = obj['endPos'][0] - obj['startPos'][0];
		nodeStyle.left = trans(t,b,c,d) + 'px';
		b = obj['startPos'][1];
		c = obj['endPos'][1] - obj['startPos'][1];
		nodeStyle.top = trans(t,b,c,d) + 'px';
		b = 0;
		c = (obj['round'] == 0 || t == d) ? 0 : Math.PI * 2 * obj['round'];
		_rotation(obj.node, trans(t,b,c,d));
	}

	function _rotation(node, deg){
		costheta = Math.cos(deg);
		sintheta = Math.sin(deg);
		if ($IE) {
			node.style.filter = 'progid:DXImageTransform.Microsoft.Matrix(M11=' + costheta + ',M12=' + ( - sintheta) + ',M21=' + sintheta + ',M22=' + costheta + ',SizingMethod="auto expand")';
		} else if ($FF) {
			node.style['MozTransform'] = 'matrix(' + (costheta) + ', ' + (sintheta) + ', ' + (-sintheta) + ', ' + (costheta) + ', 0, 0)';
		} else if (/WebKit/i.test(navigator.userAgent)) {
			node.style['WebkitTransform'] = 'matrix(' + (costheta) + ', ' + (sintheta) + ', ' + (-sintheta) + ', ' + (costheta) + ', 0, 0)';
		}
	}

	function _clearStyle(){
		var style = inst[uid].node.style; 
		style.position = '';
		style.left = '';
		style.top = '';
	}

}
