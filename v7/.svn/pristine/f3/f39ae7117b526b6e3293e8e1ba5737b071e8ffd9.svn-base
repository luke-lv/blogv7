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

$import("lib/login/loginPost.js");
$import("lib/interface.js");
$import("lib/checkAuthor.js");
$import("lib/showError.js");
$import("lib/uic.js");
$import("lib/blogv/getVHTML.js");

$import("msg/blogComment.js");
$import("comment/comment2TSina.js");
$import("comment/checkUserProduct.js");
$import("comment/add.js");
$import("comment/formatTime.js");
$import("sina/utils/utils.js");
$import("sina/core/system/getScrollPos.js");
$import("sina/core/system/pageSize.js");
$import("sina/core/dom/opacity.js");
$import("lib/sendLog.js");

Comment.Post = Core.Class.create();

Comment.Post.prototype = {
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
            }
            else {
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
        } 
        catch (e) {
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

					scope.$totle_comment++;//评论总数加1
					$E('c_' + this.articleid).innerHTML = "(" + scope.$totle_comment + ")";

					if($isLogin)
					{
						this.renderLogin();
					}

					this.addNewComment(data,result);
					
					var c2s = new Comment2TSina(this.anonyous, result);

					c2s.writeCommTips();
					this.onSuccess();
                    
					if ($E('comment_get_vcode')) {
						//trace(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
						Lib.AudioCheck.render($E('comment_get_vcode').parentNode, Lib.AudioCheck.soundUrl + "?" + new Date().getTime());
					}else{
						//trace(',,,,,,,,,,,,,,,,,,,,,,,,,,,');
					}

				}else{
					recordHttpTime();
					this.refreshCKIMG();
					if(result.code == "B36113"){
						//不允许匿名评论时，隐藏匿名评论选项，显示登录表单
						winDialog.alert("博主已关闭匿名评论，请登录后再评论", {
							funcOk: function(){
								if ($E("anonymity_cont")) {
									$E("anonymity").checked = false;
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
				recordHttpTime(-1);
                //trace("post comment error");
                winDialog.alert($SYSMSG[code] ||"发评论失败！请重试。", {
                    "icon": "02"
                });
            }.bind2(this)
		};
		Utils.Io.Ijax.request("http://control.blog.sina.com.cn/admin/comment_new/cms_post.php?version=7", option);
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
        var pages = Comment.count(scope.$totle_comment); //增加发成功的一个
		var me = this;
        //trace("当前页" + scope.$comment_page);
        //trace("页总数" + pages);
        //trace("评论数" + scope.$totle_comment);
        
        //由于需要进行换行，不好匹配各种html标签，规则比较复杂，因此还是刷新评论处
		Lib.checkAuthor();
		var li = this.getPostTemplet(data,cId);
		var commentContent = $E('#comment'+scope.$comment_page);
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

        if ($E('article_comment_list') && $E('article_comment_list').style.display != 'none'){
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
        }


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
		var isworldcup = cId.isworldcup;			//是否是世界杯。
		var cId = cId.insertid || cId;				//作兼容。
		
		var container = $E('#comment'+scope.$comment_page);
		//最外层的LI
		var li = document.createElement('li');
		li.id = 'cmt_'+cId;
		li.innerHTML = '<table class="SG_revert_Left">\
							<tbody><tr>\
								<td></td>\
							</tr>\
						</tbody></table>';
		var noComm = this.isNoCotent();
        var isMid = (scope && scope.$pageid === 'articletj');
		if(!noComm) {
			//加上虚线
			!isMid && (li.className = 'SG_j_linedot1');
		} else {
			//移除掉暂无评论
			//setTimeout(function(){
				noComm.parentNode.removeChild(noComm);
			//},390);
		}
		//含内容和相关操作的DIV
		var div = document.createElement('div');
		div.className = 'SG_revert_Cont';
		li.appendChild(div);
		//包含操作的P
		var p = document.createElement('p');
		div.appendChild(p);
		//名字的span
		var nSpan = document.createElement('span');
		nSpan.className = 'SG_revert_Tit';
		nSpan.id = 'nick_cmt_'+cId;

		if(data.anonymity) {
			//匿名发表
			nSpan.innerHTML = data.comment_anonyous;
		} else {
			//正常发表
			var nA = document.createElement('a');
			nA.target = '_blank';
			nA.href = 'http://blog.sina.com.cn/u/'+(data.uid || $UID);
            var vHTML = Lib.blogv.getVHTML(scope.loginUserWtype);
            var ___nickName = (scope.nickname || data.login_name);
			nA.innerHTML = ___nickName
			nSpan.appendChild(nA);
            if (vHTML) {
                Core.Dom.addHTML(nSpan, '&nbsp;'+vHTML);
            }
			
			/*
			 世界杯的球下线
			if(isworldcup){
				var wcA = $C("div");
				var aTemp = 
'<a title="记录激动时刻，赢取超级大奖！快一起参加吧！" alt="记录激动时刻，赢取超级大奖！快一起参加吧！" target="_blank" href="http://blog.2010.sina.com.cn/yunying/2010worldcup/">\
<img height="15" align="absmiddle" width="15" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" class="SG_icon SG_icon59">\
</a>';
				wcA.innerHTML = aTemp;
				wcA = wcA.childNodes[0];
				nSpan.appendChild(wcA);
			}
			*/
		}
		p.appendChild(nSpan);
		//包含发表时间和相关操作的span
		var tSpan = document.createElement('span');
		tSpan.className = 'SG_revert_Time';
		p.appendChild(tSpan);
		//时间的EM
		var em = document.createElement('em');
		em.className = 'SG_txtc';
		em.innerHTML = Comment.formatTime();
		tSpan.appendChild(em);
		//判断是不是博主自己发的回复
		//永远不可能博主发的回复会出现[回复]
		/*
		if($isAdmin && $UID != data.uid) {
			//可以出现回复
			tSpan.innerHTML += '<a onclick="return false;" href="#" class="CP_a_fuc">[<cite onclick="reply_comment('
							+ cId
							+ ')">回复</cite>]</a>&nbsp;';
		}
		*/
		if($isAdmin) {
			//可以出现删除
			tSpan.innerHTML += '<a onclick="return false;" href="#" class="CP_a_fuc">[<cite onclick="del_comment(this,\''
							+ cId
							+ '\')">删除</cite>]</a>&nbsp;'
		}
		//随时都可以出现举报
		tSpan.innerHTML += '<a href="javascript:;" onclick="comment_report(\''
						+ data.article_id + '_' + cId
						+ '\')" id="'
						+ data.article_id + '_' + cId 
						+ '">[举报]</a>';
		//存放内容的DIV
		var comDiv = document.createElement('div');
		comDiv.id = 'body_cmt_' + cId;
		comDiv.className = 'SG_revert_Inner SG_txtb';
		comDiv.innerHTML = this.changeToContent(data.comment);
		div.appendChild(comDiv);
		return li;
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
	changeToContent : function(str) {
		var _userContent = str.replace(/\r\n|\n/gi, "###line-return###");
		_userContent = Core.String.encodeHTML(_userContent);
		var _re = /\[emoticons=(E___\w*)\]([^[]*)\[\/emoticons\]/gi;
		var _html = '<img src="http://www.sinaimg.cn/uc/myshow/blog/misc/gif/$1T.gif" style="margin:1px;'
				+ 'cursor:pointer;" onclick="window.open(\'http://blog.sina.com.cn/myshow2010'
				+ '\')" border="0" title="$2" />';
		_userContent = _userContent.replace(_re, _html);
		//处理魔法表情
		
		var _magicReg=/\[magicemoticons=([E|W]___\w*)\&nbsp\;swfname=(\w+\.swf)\]([^[]*)\[\/magicemoticons\]/gi;
		//var _magicReg=/\[magicemoticons=(E___\w*)\&nbsp;swfname=(\w*)\]([^[]*)\[\/magicemoticons\]/gi;
		var _magichtml =['<img src="http://www.sinaimg.cn/uc/myshow/blog/misc/gif/$1T.gif" style="margin:1px;',
				'cursor:pointer;" onclick="window.$magicFacePlay(\'$2\');return false;"',
				' border="0" title="$3" width="50" height="50"/>'].join("");				
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
window.$transitions = {
		simple: function(time, startValue, changeValue, duration){
			return changeValue * time / duration + startValue;

		},
		backEaseIn: function(t, b, c, d){
			var s = 1.70158;
			return c * (t /= d) * t * ((s + 1) * t - s) + b;

		},
		backEaseOut: function(t, b, c, d, a, p){
			var s = 1.70158;
			return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
		},
		backEaseInOut: function(t, b, c, d, a, p){
			var s = 1.70158;
			if ((t /= d / 2) < 1) {
				return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
			}
			return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
		},
		bounceEaseOut: function(t, b, c, d){
			if ((t /= d) < (1 / 2.75)) {
				return c * (7.5625 * t * t) + b;
			}
			else
				if (t < (2 / 2.75)) {
					return c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75) + b;
				}
				else
					if (t < (2.5 / 2.75)) {
						return c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375) + b;
					}
					else {
						return c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375) + b;
					}
		},
		bounceEaseIn: function(t, b, c, d){
			return c - transitions.bounceEaseOut(d - t, 0, c, d) + b;
		},
		bounceEaseInOut: function(t, b, c, d){
			if (t < d / 2) {
				return transitions.bounceEaseIn(t * 2, 0, c, d) * 0.5 + b;
			}
			else {
				return transitions.bounceEaseOut(t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;
			}

		},
		strongEaseInOut: function(t, b, c, d){
			return c * (t /= d) * t * t * t * t + b;
		},
		regularEaseIn: function(t, b, c, d){
			return c * (t /= d) * t + b;
		},
		regularEaseOut: function(t, b, c, d){
			return -c * (t /= d) * (t - 2) + b;
		},
		regularEaseInOut: function(t, b, c, d){
			if ((t /= d / 2) < 1) {
				return c / 2 * t * t + b;
			}
			return -c / 2 * ((--t) * (t - 2) - 1) + b;
		},
		strongEaseIn: function(t, b, c, d){
			return c * (t /= d) * t * t * t * t + b;
		},
		strongEaseOut: function(t, b, c, d){
			return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
		},
		strongEaseInOut: function(t, b, c, d){
			if ((t /= d / 2) < 1) {
				return c / 2 * t * t * t * t * t + b;
			}
			return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
		},
		elasticEaseIn: function(t, b, c, d, a, p){
			if (t == 0) {
				return b;
			}
			if ((t /= d) == 1) {
				return b + c;
			}
			if (!p) {
				p = d * 0.3;
			}
			if (!a || a < Math.abs(c)) {
				a = c;
				var s = p / 4;
			}
			else {
				var s = p / (2 * Math.PI) * Math.asin(c / a);
			}
			return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
		},
		elasticEaseOut: function(t, b, c, d, a, p){
			if (t == 0) {
				return b;
			}
			if ((t /= d) == 1) {
				return b + c;
			}
			if (!p) {
				p = d * 0.3;
			}
			if (!a || a < Math.abs(c)) {
				a = c;
				var s = p / 4;
			}
			else {
				var s = p / (2 * Math.PI) * Math.asin(c / a);
			}
			return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);

		},
		elasticEaseInOut: function(t, b, c, d, a, p){
			if (t == 0) {
				return b;
			}
			if ((t /= d / 2) == 2) {
				return b + c;
			}
			if (!p) {
				var p = d * (0.3 * 1.5);
			}
			if (!a || a < Math.abs(c)) {
				var a = c;
				var s = p / 4;
			}
			else {
				var s = p / (2 * Math.PI) * Math.asin(c / a);
			}
			if (t < 1) {
				return -0.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
			}
			return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * 0.5 + c + b;
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
		var transitions = window.$transitions;

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
	
	
Utils.isInViewPage=function(obj,useCenterPoint){
	var centerPoint=useCenterPoint||false;
	if(obj.style.display=="none")
		return false;
		
	var sizearr=Core.System.pageSize();
	var size={
		viewheight:sizearr[3],
		viewwidth:sizearr[2],
		totalheight:sizearr[1],
		totalwidth:sizearr[0]
	};
	
	var scrollarr=Core.System.getScrollPos();
	var scroll={
		top:scrollarr[0],
		left:scrollarr[1],
		width:scrollarr[2],
		height:scrollarr[3]
	};

	var objinfo={
		top:Core.Dom.getTop(obj),
		left:Core.Dom.getLeft(obj),
		bottom:Core.Dom.getTop(obj)+obj.offsetHeight,
		right:Core.Dom.getLeft(obj)+obj.offsetWidth
	};
	var flag=false;
	
	if (centerPoint) {//使用中心点计算
		var centerpos={
			x:Math.ceil((objinfo.left+objinfo.right)/2),
			y:Math.ceil((objinfo.top+objinfo.bottom)/2)
		};
		if(centerpos.x <= scroll.left ||
		centerpos.x >= (scroll.left + size.viewwidth) ||
		centerpos.y >= (scroll.top + size.viewheight) ||
		centerpos.y <= scroll.top){
			flag = false;
		}else{
			flag = true;
		}
	}
	else {
		if (objinfo.right <= scroll.left ||
		objinfo.left >= (scroll.left + size.viewwidth) ||
		objinfo.top >= (scroll.top + size.viewheight) ||
		objinfo.bottom <= scroll.top) {
			//说明不在屏幕显示范围内
			flag = false;
		}
		else {
			flag = true;
		}
	}
	return flag;
};
