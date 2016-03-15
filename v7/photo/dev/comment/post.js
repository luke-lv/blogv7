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

$import("lib/login/loginPost.js");
$import("lib/interface.js");
$import("lib/checkAuthor.js");
$import("lib/showError.js");
$import("lib/uic.js");

$import("msg/blogComment.js");
$import("comment/comment2TSina.js");
$import("comment/checkUserProduct.js");
$import("comment/add.js");

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
            // 评论改造需要传入博主uid
            this.data.blogerid = scope.$uid || 0;
            this.data.uid = $isLogin ? $UID : "";
            this.data.fromtype = "commentadd";
			this.data.is_photo = "photo"; //是否为图片评论
            this.data.anonymity = this.anonyous;
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
                }
                else {
                    if($E("login_remember")){
                        if(this.data.login_remember){
                            v7sendLog('48_01_37_1');
                        }else{
                            v7sendLog('48_01_37_0');
                        }
                    }
                    new Lib.Login.LoginPost(function(){
                        Lib.checkAuthor();
						if ($isLogin) {
							//trace('登陆情况下发评论');
			            	this.data.login_name = $nick;
							this.postComment(this.data);
							this.renderLogin();
						}
						else {
							this.refreshCKIMG();
							//trace('未登陆下输入用户名密码发评论');
							winDialog.alert("登录名或密码错误！", {
								"icon": "02"
							});
							this.refreshCKIMG();
							$E('commentloginM').style.display = 'none';
							$E('commentlogin').style.display = "block";
							if ($E("anonymity_cont")) {
								$E("anonymity") && ($E("anonymity").checked = false);
								$E("anonymity_cont").style.display = "none";
							}
							// if (scope['private'].hidecms != 1) {
								// $E('anonymity_cont').style.display = 'block';
							// }
							$E('commentNick').innerHTML = "";
							this.locked = false;
						}
						//trace("----IS LOGIN----"+$isLogin);
                    }.bind2(this),false,"referer:"+location.hostname+location.pathname+",func:0008").login(data.login_name, data.login_pass,data.login_remember==true?15:0);	//添加统计点：相册评论 0008
                }
            }
        } 
        catch (e) {
            trace(e);
			CommentPost.locked = false;
        }
    },
	renderLogin:function(){
		//发评论前未登陆，输入用户名密码正确登陆后发评论，需要将登陆状态刷新到页面上
		$tray.renderLogin();
		$E('commentlogin').style.display = 'none';
		
		var showNickPlace = function(){//在昵称处应该显示的东西 
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
            else {//说明用户没有开通博客产品 
                $E("commentNick").innerHTML = '您还未<a href="http://login.sina.com.cn/hd/reg.php?entry=blog">开通</a>博客，只能匿名发表评论。</li>';
				$E("anonymity").checked = true;
				$E("quote_comment_p").style.display="none";
            }
        };
		
		if ($E('commentNick').innerHTML == '') {
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
		if ($E("anonymity_cont")) {
			$E('anonymity_cont').style.display = 'none';
		}
	},
    /**
     * 发起评论请求
     * @param {Object} data	参数
     */
    postComment: function(data){
        var inter = new Interface("http://control.blog.sina.com.cn/admin/comment_new/cms_post.php?domain=1", "ijax");
        inter.request({
            POST: data,
            onSuccess: function(result){
                v7sendLog('45_01_12_'+ scope.$uid);
				this.locked = false;
                Lib.checkAuthor();
                scope.$total_comment++;//评论总数加1
                
                $E('c_' + this.articleid).innerHTML = "(" + scope.$total_comment + ")";
                
				if($isLogin)
				{
					this.renderLogin();
				}
				
                this.addNewComment(data);
                this.onSuccess();
				if ($E('comment_get_vcode')) {
					//trace(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
					Lib.AudioCheck.render($E('comment_get_vcode').parentNode, Lib.AudioCheck.soundUrl + "?" + new Date().getTime());
				}else{
					//trace(',,,,,,,,,,,,,,,,,,,,,,,,,,,');
				}
				
				//评论同步到微博
				var c2s = new Comment2TSina(this.anonyous, result);
				c2s.writeCommTips();
            }.bind2(this)            ,
            onError: function(result){
				this.locked = false;
				this.refreshCKIMG();
				if (result.code == "B36113") {
					//不允许匿名评论时，隐藏匿名评论选项，显示登录表单
					winDialog.alert("博主已关闭匿名评论，请登录后再评论", {
						funcOk: function(){
							if ($E("anonymity_cont")) {
								$E("anonymity_cont").style.display = "none";
							}
							$E("anonymity").checked = false;
							$E("commentlogin").style.display = "";
							$E("commentloginM").style.display="none";
						}
					});
				}
				else {
					showError(result.code);
				}
                //trace("onError:" + result.code);
                if (result.code != null) {
                    //trace("##HH## I GET THE BREAKPOINT");
					Lib.checkAuthor();
					if ($isLogin) {
						return;
					}
					
					// 隐藏匿名评论input  未登录时，不允许评论		Modified by gaolei2@staff 2013.11.4
					if ($E("anonymity_cont")) {
						$E("anonymity") && ($E("anonymity").checked = false);
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
					// if (scope['private'].hidecms != 1) {
						// $E('anonymity_cont').style.display = 'block';
					// }
					$E('commentNick').innerHTML = "";
                    $isLogin = false;
                    this.anonyous = true;
                }
				
                this.onError(result);
            }.bind2(this)            ,
            onFail: function(){
 				this.locked = false;
                //trace("post comment error");
                winDialog.alert("发评论失败！请重试。", {
                    "icon": "02"
                });
           }.bind2(this)
        });
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
    addNewComment: function(data){
        //刷新评论区域
        var pages = Comment.count(scope.$total_comment); //增加发成功的一个
        //trace("当前页" + scope.$comment_page);
        //trace("页总数" + pages);
        //trace("评论数" + scope.$total_comment);
        
        //由于需要进行换行，不好匹配各种html标签，规则比较复杂，因此还是刷新评论处
        new Comment.List().load(pages);
		if(this.anonyous && $isLogin){
			$E("anonymity").checked = false;
			this.anonyous = false;
			$E("quote_comment_p").style.display="block";
		}
        if (pages > scope.$comment_page) {
			scope.$comment_page++;
            Comment.paging(scope.$total_comment, scope.$comment_page);
        }
        
    }
};
