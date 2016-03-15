/**
 * 个人中心下的菜单
 * @author zhihan | zhihan@staff.sina.com.cn
 */
$import("sina/core/events/stopEvent.js");
$import("sina/core/dom/getElementsByClass.js");
$import("sina/core/dom/opacity.js");
$import("lib/interface.js");
$import("lib/showError.js");
$import("jobs/resource.js");

$import("product/center/quote.js");
$import("product/center/article_addFavorite.js");
$import("lib/component/include/invite.js");
$import("lib/sendLog.js");
$import("sina/core/dom/getXY.js");
$import('sina/core/events/stopEvent.js');
$import("lib/panel.js");
$import("lib/interface.js");
$import("sina/core/events/fireEvent.js");

$registJob("feedMenu", function() {
	
	if(scope.$pageid != 'profile_index') {
		return;
	}
	
	//菜单元素
	var tipEle;
	var panel;
	//是否鼠标落在菜单内
	var alsoInTip = false;
	//是否鼠标在div内
	var alesoInDiv = false;
	
	var getEles = function(ele) {
		var eles = {};
		var divs = Core.Dom.getElementsByClass(ele,'div','btn');
		eles['btn'] = divs[0];
		return eles;
	}
	
	function hidden(ele) {
		return function() {
			ele.style.display = 'none';
			return;
			var val = 100;
			Core.Dom.opacity(ele,val);
			var timmer = setInterval(function(){
				val -= 10;
				if(val >= 0) {
					Core.Dom.opacity(ele,val);
				} else {
					clearInterval(timmer);
					//ele.style.display = 'none';
				}
			},10);
		}
	}
	
	function show(ele) {
		return function() {
			ele.style.display = '';
			return;
			var val = 0;
			Core.Dom.opacity(ele,val);
			//ele.style.display = '';
			var timmer = setInterval(function(){
				val += 1;
				if(val <= 100) {
					Core.Dom.opacity(ele,val);
				} else {
					clearInterval(timmer);
				}
			},10);
		}
	}
	
	var on = function(ele,func,event) {
		ele['on'+event] = func(getEles(ele));
	}
	
	var stmp = +new Date();
	//console.log(stmp);
	
	document.onclick = function(){
		scope.digger.hiddenLast10();
	}
	
	scope.initShow = function(){
		var tip = tipEle;
		if(!tip){
			initTipEle();
		}
		var divs = Core.Dom.getElementsByClass(document, 'div', 'feedList');
		for(var i=0; divs[i]; i++){
			//var eles = getEles(divs[i]);
			//eles['btn'].onmouseover = show(eles['list']);
			//divs[i].parentNode.parentNode.onmouseout = hidden(eles['list']);
			//eles['list'].onmouseover = show(eles['list']);
			//eles['list'].onmouseout = hidden(eles['list']);
			var currOpt = getEles(divs[i]);
			if(currOpt.btn && divs[i].getAttribute("qblog")!="y"){		// divs[i]，div.className = feedList，群博客 feed
				divs[i].onmouseover = (function(opt, i){
					return function(){
						// Core.Events.fireEvent(document.body, 'mouseover');
						// console.log(divs[i].innerHTML);
						Core.Events.stopEvent();
						if(opt.btn){
							opt.btn.style.display = '';
						}
					}
				})(currOpt, i);
				
				divs[i].onmouseout = (function(opt){
					return function() {
						Core.Events.stopEvent();
						if(opt.btn) {
							opt.btn.style.display = 'none';
						}
					}
				})(currOpt);
				
				currOpt.btn.onmouseover = (function(opt){
					return function() {
						// alert(2)
						Core.Events.stopEvent();
						opt.btn.style.display = '';
						showTipEle(opt.btn);
					}
				})(currOpt);
			}
		}
	}
	
	function showTipEle(element) {
		if(element) {
			var loc = Core.Dom.getXY(element);
			if($IE) {
				loc[1] -= 2;
				loc[0] -= 2;
			}
			var did = element.getAttribute('did');
			var sc = element.getAttribute('sc');
			var zz = element.getAttribute('zz');
			var dele = $E('delFriend_'+stmp);
			var scEle = $E('shouCang_'+stmp);
			var zzEle = $E('zhuanZai_'+stmp);
			if(did) {
				dele.onclick = (function(delId){
					return function() {
						hiddenTipEle();
						winDialog.confirm("您确定要取消与此人的关系么？", {
							funcOk: function(){
								cancelThePerson(delId);
							},
							textOk: "确定",
							textCancel: "取消",
							icon: "04"
						});
						return false;
					}
				})(did);
				dele.style.display = '';
				dele.className = 'SG_j_linedot1';
			}
			
			if(sc) {
				scEle.onclick = (function(scId){
					return function() {
						hiddenTipEle();
						scope.addFavoriteArticle(scId);
						return false;
					}
				})(sc);
				scEle.style.display = '';
				scEle.className = 'SG_j_linedot1';
			} else {
				dele.className = 'SG_j_linedot1 last';
			}
			
			if(zz) {
				zzEle.onclick = (function(zzId){
					return function() {
						hiddenTipEle();
						scope.quote(zzId);
						return false;
					}
				})(zz);
				zzEle.style.display = '';
				zzEle.className = 'SG_j_linedot1 last';
			} else {
				scEle.className = 'SG_j_linedot1 last';
			}
			panel.setPosition(loc[0], loc[1]);
			//tipEle.style.top = loc[1]+'px';
			//tipEle.style.left = loc[0]+'px';
		}
		panel.show();
		//tipEle.style.display = '';
	}
	
	function cancelThePerson(did) {
		new Interface("http://control.blog.sina.com.cn/riaapi/profile/delAllRelational.php", "jsload").request({
				GET: {
					'friend_uid' : did
				},
				onSuccess: function(res) {
					v7sendLog('96_01_03_'+scope.$uid,'profile_index','');
					scope.feedView('0','0',1);
				},
				onError: function(res) {
					winDialog.alert($SYSMSG[res.code], {
						funcOk: function() {}
					});
				}
		});
	}
	
	function hiddenTipEle() {
		//tipEle.style.display = 'none';
		panel.hidden();
		$E('delFriend_'+stmp).style.display = 'none';
		$E('zhuanZai_'+stmp).style.display = 'none';
		$E('shouCang_'+stmp).style.display = 'none';
	}
	
	function initTipEle() {
		//tipEle = new Lib.Panel();
		panel = new Lib.Panel();
		//document.createElement('div');
		//tipEle.id = 'menu_'+stmp;
		//tipEle.className = 'feed_addlist';
		//tipEle.style.display = 'none';
		//tipEle.innerHTML = '<div id="menu_"'+stmp' class="feed_addlist" style="display:none;z-index:2048;"><div class="list" style="cursor:pointer;"><ul>\
		panel.setTemplate('<div id="#{panel}" class="feed_addlist" style="display:none;z-index:2048;"><div class="list" style="cursor:pointer;"><ul>\
							<li id="delFriend_'+stmp+'" style="display:none;" class="SG_j_linedot1"><a href="#" onclick="return false;" title=""><img class="SG_icon SG_icon71" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" width="15" height="15" title="" align="absmiddle" /><span style="cursor:pointer;">取消关系</span></a></li>\
							<li id="shouCang_'+stmp+'" style="display:none;" class="SG_j_linedot1"><a href="#" onclick="return false;" title=""><img class="SG_icon SG_icon21" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" width="15" height="15" title="" align="absmiddle" /><span style="cursor:pointer;">收藏</span></a></li>\
							<li id="zhuanZai_'+stmp+'" style="display:none;" class="SG_j_linedot1 last"><a href="#" onclick="return false;" title=""><img class="SG_icon SG_icon20" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" width="15" height="15" title="" align="absmiddle" /><span style="cursor:pointer;">转载</span></a></li>\
						</ul></div></div>');
						
		tipEle = panel.entity;
		
		//document.body.appendChild(tipEle);
		/*
		if($IE) {
			tipEle.onmouseleave = function() {
				Core.Events.stopEvent();
				trace('leave....');
				//setTimeout(function(){
					//if(!alsoInTip) {
						hiddenTipEle();
					//}
				//},200);
				alsoInTip = false;
			}
			tipEle.onmousemove = function() {
				alsoInTip = true;
			}
		} else {
		*/
			tipEle.onmouseout = function(e) {
				Core.Events.stopEvent();
				e = e || window.event;
				//var src = e.target || e.srcElement;
				var src = e.relatedTarget || e.toElement;
				if($FF) {
					if(!isChildNodes(tipEle,src)) {
						hiddenTipEle();
					}
				} else {
					if(!tipEle.contains(src)) {
						hiddenTipEle();
					}
				}
			}
			//console.log(tipEle);
		//}
	}
	
	function isChildNodes(ele,src) {
		if(ele.hasChildNodes()) {
			var children = ele.childNodes;
			for(var i=0; children[i]; i++) {
				if(isChildNodes(children[i],src)) {
					return true;
				}
			}
		}
		return ele == src;
	}
	
	//onclick="$cancelAttention('1647885670','1735754442');return false;"  取消关注
	//onclick="Lib.invite2(1714559092,'testohtest');return false;" 添加好友
	//onclick="delfriend('1735754442','f');return false;" 删除好友
	//
	
	//收藏
	scope.addFavoriteArticle = function(articleid) {
		new App.addFavoriteArticle(articleid, {
			callback: function(){
				winDialog.alert($SYSMSG.B03020, {icon : "03"});
			}
		});
		v7sendLog('96_01_06_'+scope.$uid,scope.$pageid,'');
		return false;
	}
	
	//转载
	scope.quote = function(articleid) {
		var quote = new Quote();
		quote.check(articleid);
		v7sendLog('96_01_05_'+scope.$uid,scope.$pageid,'');
		return false;
	}
	
	//取消关注
	//$cancelAttention('1647885670','1609973985');v7sendLog('96_01_02_'+scope.$uid,scope.$pageid,'');return false;
	
	//添加好友
	//Lib.invite2(1714559092,"testohtest");return false;
	Lib.Invite2 = Core.Class.define(Lib.Invite_Base.prototype.initialize, Lib.Invite_Base, {
		dialogTitle	: "加好友"
		,contentLength	: 200
		,title			: function (){
								return '加"' + scope.currentChooseInviteName + '"为好友';
						}
		,successMSG		: function (){
								return ['邀请发送成功，请等待对方确认。'
										, '<div class="CP_w_cnt SG_txtb" style="font-size:12px;font-weight:normal;">以后对方的动态（发博文，图片，投票等），都可以在<span style="color: red;">个人中心</span>查看啦！</div>'
										, '<ul class="CP_w_part CP_w_aLine">'
										, '<li><a style="font-weight:normal;font-size:12px;" href="http://control.blog.sina.com.cn/blogprofile/index.php?type=3&from=addfiend" target="_blank">到个人中心查看其他好友动态&gt;&gt;</a></li>'
										, '</ul>'].join("");
						}
		,Interface		: new Interface("http://control.blog.sina.com.cn/riaapi/profile/invitesend.php", "jsload")

	});

	Lib.invite2 = function(sUid,name){
		scope.currentChooseInviteName = name;
		new Lib.Invite2(sUid);
		v7sendLog('96_01_04_'+scope.$uid,scope.$pageid,'');
	};
	
	//删除好友
	//delfriend('1735754442','f');v7sendLog('96_01_03_'+scope.$uid,scope.$pageid,'');return false;
	scope.initShow();
});