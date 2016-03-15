
$import("comps/_comps.js");
$import("comps/5years/stylishDialog.js");
$import("comps/msgTips.js");


// 设想着把所有的交互逻辑放一块儿处理，addObserve()。
// 目的是同步页面各数据点，处理页面各数据接口的对话框。
// 每个活动都要重新实现这个枢纽点。（应只处理 success）
// 

Comps.gameLogic = function(logicName, res){
	
	switch(logicName){
		case "myFriends":
			handle_myFriends(res);
			break;
		case "attActivity":
			handle_attActivity(res);
			break;
		case "saveBlog":
			handle_saveBlog(res);
			break;
	}
	
	
	function handle_attActivity(res){
		var ttl;
		var txt;
		
		// 1：请求时是已关注，那么不用处理，
		// 0：处理！
		if((res.user_age == 0) && !res.status){
			
			// 只有第一次关注才提示种子
			if(+res.attention){
				
				// 如果超过种子数量，就不需要再提示了。
				if((+res.seed_num) < 5){
					ttl = "关注成功！恭喜您获得了一颗活动种子！";
					txt = '集齐5颗种子 便可激活纪念徽章<br/><div style="margin-top:10px; color: rgb(51, 51, 51);"><span style="float: left;">种子数：</span><div style="background: transparent url(http://simg.sinajs.cn/blog7actstyle/images/ico_heart_g.png) no-repeat scroll 0% 0%; float: left; width: 96px; height: 14px; margin-right: 20px; -moz-background-clip: border; -moz-background-origin: padding; -moz-background-inline-policy: continuous;"><span style="background: transparent url(http://simg.sinajs.cn/blog7actstyle/images/ico_heart_r.png) repeat-x scroll 0% 0%; float: left; height: 14px; -moz-background-clip: border; -moz-background-origin: padding; -moz-background-inline-policy: continuous; width: '+(res.seed_num*20)+'%;"></span></div>'+res.seed_num+'/5</div>';
				
				}else{
					if(res.medal == 1){
						ttl = "关注成功！ ";
						txt = "";
					}else{
						ttl = "关注成功！恭喜您已集满活动种子！<br/>立即保存博文，领取五周年勋章！";
						txt = "";
					}
				}
			}else{
				ttl = "关注成功！";
				txt = "";
			}
			
		}else{
			ttl = res.msg;
			txt = "";
			
		}
		
		var d = Comps.stylishDialog.alert(ttl, {
			icon: "ok",
			subText: txt,
			funcOk:function(){
				window.location.reload();
			},
			funcCls:function(){
				window.location.reload();
			}
		});
		
		d.content.style.cssText += "; background: transparent url( ) no-repeat scroll 260px 34px;";
	}
	
	
	function handle_saveBlog(){
		
		// 0-1 周年
		if(res.user_age == 0){
			if(res.seed_num == 5){
				Comps.stylishDialog.alert("恭喜您获得新浪博客纪念勋章！", {
					icon:"ok",
					subText: '您可以在个人博客的头像右下方看到<br/><img align="absmiddle" style="margin: 10px 0 0 60px;" src="http://simg.sinajs.cn/blog7actstyle/images/special/fiveyears/at/0y.gif" alt="">',
					funcOk:function(){
						window.location.reload();
					},
					funcCls:function(){
						window.location.reload();
					}
				});
				
			}
			
			else{
				var d = Comps.stylishDialog.noBtn("恭喜您获得了一颗活动种子！", {
					icon:"ok",
					subText:'集齐5颗种子便可点亮纪念勋章！<br/><div style="margin-top:10px; color: rgb(51, 51, 51);"><span style="float: left;">种子数：</span><div style="background: transparent url(http://simg.sinajs.cn/blog7actstyle/images/ico_heart_g.png) no-repeat scroll 0% 0%; float: left; width: 96px; height: 14px; margin-right: 20px; -moz-background-clip: border; -moz-background-origin: padding; -moz-background-inline-policy: continuous;"><span style="background: transparent url(http://simg.sinajs.cn/blog7actstyle/images/ico_heart_r.png) repeat-x scroll 0% 0%; float: left; height: 14px; -moz-background-clip: border; -moz-background-origin: padding; -moz-background-inline-policy: continuous; width: '+(res.seed_num*20)+'%;"></span></div>'+res.seed_num+'/5</div><p style="margin: 0pt; padding: 10px 10px 0 0pt; height:80px;"><span style="line-height: 22px;">您可以通过邀请好友来获取剩余种子哦！</span><a href="http://joy.blog.sina.com.cn/blog_5years/invite_friend.php"><img height="22" align="absmiddle" width="81" style="border: medium none;" alt="邀请好友" src="http://simg.sinajs.cn/blog7actstyle/images/btn_invitation.gif"></a></p>',
					funcCls:function(){
						window.location.reload();
					}
				});
				
				d.content.style.cssText += "; background: transparent url( ) no-repeat scroll 260px 34px;";
			
			}
		}
		
		// 1-5 周年
		else if(res.user_age > 0){
			Comps.stylishDialog.alert("恭喜您获得新浪博客 "+res.user_age+" 周年勋章！", {
				icon:"ok",
				subText: '您可以在个人博客的头像右下方看到<br/><img align="absmiddle" style="margin: 10px 0 0 60px;" src="http://simg.sinajs.cn/blog7actstyle/images/special/fiveyears/at/'+res.user_age+'y.png" alt="">',
				funcOk:function(){
					window.location.reload();
				},
				funcCls:function(){
					window.location.reload();
				}
			});
		}
	}
	
	
	function handle_myFriends(res){
		var mainTxt = "";
		var seedTxt = "";
		var _len = res.friends_qty;
		
		// 处理是否有被重复邀请的好友
		if(typeof res.ignore == "undefined"){
			res.ignore = 0;
		}else{
			res.ignore = (+res.ignore);
		}
		
		// 有效邀请的好友数
		_len -= res.ignore;
		
		
		// seedTxt
		// 处理 0 - 1 周年
		if(res.user_age == 0){
			if((+res.seed_num) >= 5){						// 返回的 seed_num 是已经计算过了的
				seedTxt += "获得的种子已集齐5个！";			// 还未发博文？则……
			}else{
				seedTxt += "获得了"+(_len>5?5:_len)+"颗种子！";
			}
			
			// 已领勋章则不再提示
			if(res.medal == 1){
				seedTxt = "";
			}
		}
		
		// 处理重复邀请（0 - 5 周年都有）
		if(res.ignore){
			seedTxt += "（有"+res.ignore+"名好友已被你邀请过）";
		}
		
		// mainTxt
		// 此处 _len 为零，肯定属于重复邀请
		if(_len <= 0){
			mainTxt = "已经邀请过该好友！";
		}else{
			mainTxt = "恭喜你成功邀请了"+_len+"名好友！" + seedTxt;
		}
		
		Comps.stylishDialog.alert(mainTxt, {
			icon: _len <=0 ? "sup" : "ok",
			funcOk:function(){
				//inst.init();
				window.location.reload();
			},
			funcCls:function(){
				//inst.init();
				window.location.reload();
			}
		});
	}
	
};

