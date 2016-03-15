/**
 * @fileoverview msn搬家用户引导组件模板
 * @author zhangkai2@staff.sina.com.cn
 * @created 2010-12-29
 */
scope.msnGuideDivTemplateHTML='<div class="tbar">'+
							    '<a href="" id="msnGuide_AddToMyFavorite" title="请拖拽到浏览器收藏夹栏收藏该博客" class="fav">拖拽收藏本博客</a>'+
							    '<a href="javascript:void(0)" onclick="scope.msnGuide.playHideEffect($E(\'msnGuide_MSNGuideDiv\'));return false;" title="关闭" class="shut"></a>'+
							  '</div>'+
							  //'<!-- connect用户tab选项-->'+
							  '<div class="xnav" style="display:none" id="msnGuide_ConnectTab">'+
							    '<a href="javascript:void(0)" onclick="scope.msnGuide&&scope.msnGuide.switchTab(this,true);return false;" title="邀请MSN老友" class="lft lftact">邀请MSN老友</a><a href="javascript:void(0)" onclick="scope.msnGuide&&scope.msnGuide.switchTab(this,true);return false;" title="新浪朋友在等你" class="rgt">新浪朋友在等你</a>'+
							  '</div>'+
							  //'<!-- 非connect用户tab选项-->'+
							  '<div class="mnav" style="display:none" id="msnGuide_NotConnectTab">'+
							    '<a href="javascript:void(0)" onclick="scope.msnGuide&&scope.msnGuide.switchTab(this,false);return false;" title="新浪朋友在等你" class="lft lftact">新浪朋友在等你</a><a href="javascript:void(0)" onclick="scope.msnGuide&&scope.msnGuide.switchTab(this,false);return false;" title="邀请MSN老友" class="rgt">邀请MSN老友</a>'+
							  '</div>'+
							  '<div class="con">'+
								//'<!-- 问候老友 -->'+
								'<div id="msnGuide_MSNRegardArea" style="display:block">'+
							    '<div class="invite"><p><em>发送邀请，送朋友徽章</em>徽章可悬挂3个月，<br />将替换现有徽章。</p></div>'+
							    '<div class="letter">'+
										  //'<!-- msn问候 -->'+
										  '<div id="msnGuide_MSNRegard">'+
											  '<p><em>向你的MSN老友发送问候邀请：</em>'+
												'<span class="txt"></span>'+
												'</p>'+
											  '<p class="choice"><input type="checkbox"  id="menGuide_ChangeBadgeCheckbox" /><label for="c1">不更换已有徽章</label></p>'+
											  '<div class="send"><a onclick="scope.msnGuide.displayModuleById(\'msnGuide_MSNForm\',$E(\'msnGuide_ConnectTab\').style.display===\'none\'?false:true);" href="javascript:void(0)">向MSN好友发送问候</a></div>'+
										  '</div>'+
										  //'<!-- msn问候loading-->'+
										  '<div id="msnGuide_RegardLoading" style="display:none">'+
											'<p class="waiting">正在与您的MSN好友取得联系，请耐心等待一会…</p>'+
											'<div class="cancel"><a id="msnGuide_CancelSendRegardsButton" href="javascript:void(0)">取消</a></div>'+
										  '</div>'+
										  //'<!-- msn问候错误-->'+
										  '<div id="msnGuide_RegardError" style="display:none">'+
											 '<p class="false">对不起，网络原因导致发送失败，请再来一次吧。</p>'+
											 '<div class="return"><a onclick="scope.msnGuide.displayModuleById(\'msnGuide_MSNRegard\',$E(\'msnGuide_ConnectTab\').style.display===\'none\'?false:true);return false;" href="javascript:void(0)">返回</a></div>'+
										  '</div>'+
										  //'<!-- msn问候成功-->'+
										  '<div id="msnGuide_RegardSuccess" style="display:none">'+
											 '<p class="status">已发送问候邀请！<span id="msnGuide_ChangeBadgeInfo">恭喜获得朋友徽章。</span></p>'+
											 '<div class="step"><a onclick="scope.msnGuide.switchModuleBetweenMSNRegardsAndFriendList(\'friend\');return false;" href="javascript:void(0)">新浪朋友在等你</a></div>'+
										  '</div>'+
										  //'<!-- 非connct用户连接-->	'+
										  '<div id="msnGuide_Connect" style="display:none">'+
											'<p class="psr">亲爱的MSN用户：<br><br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;使用MSN账号连接新浪博客，就可以立刻找到全部在新浪活<br>动的MSN好友啦！向MSN好友发送问候邀请，还能获得精美朋友<br>徽章。<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;连接MSN账号后，可用MSN账号登陆新浪博客。</p>'+
											 '<div class="connect"><a href="javascript:void(0)" onclick="window.open(\'https://login.live.com/oauth20_authorize.srf?client_id=0000000040046F08&redirect_uri=http%3A%2F%2Fcontrol.blog.sina.com.cn%2Fblog_rebuild%2Fmsn%2FmsnLoginCallBack.php&response_type=code&scope=wl.basic%20wl.signin%20wl.offline_access%20wl.share%20wl.emails\',\'neww\',\'height=400,width=500\');scope.msnGuide&&scope.msnGuide.msnrefreshWindow();return false;">连接</a></div>'+
										  '</div>'+
										  //'<!-- msn form-->'+
										  '<div id="msnGuide_MSNForm" style="display:none" class="login">'+
									        '<p>请先输入MSN密码，我们会自动向您的好友发送问候邀请</p>'+
									        '<ul>'+
									          '<li><p><label>MSN用户名：</label><input id="menGuide_MSNUserName" type="text" class="ipt" /></p></li>'+
									          '<li><p><label>MSN密码：</label><input id="menGuide_MSNPassword" type="password" class="ipt" /></p></li>'+
									          '<li class="tip"><p><span id="msnGuide_UsernameOrPasswordError" style="display:none">密码不正确，请您重新输入</span>请放心，我们不会保留您的信息！</p></li>'+
									          '<li class="btn"><a onclick="scope.msnGuide.sendRegards();this.blur();return false;" href="javascript:void(0)">确定</a></li>'+
									        '</ul>'+
									      '</div>'+
							    '</div>'+
							    '</div>'+
								//'<!-- msn form-->'+
								'<div class="login" style="display:none">'+
							      '<p>请先输入MSN密码，我们会帮你找到已在新浪安家的MSN朋友</p>'+
							      '<ul>'+
							        '<li><p><label>MSN用户名：</label><input id="menGuide_MSNUserName" type="text" class="ipt" /></p></li>'+
							        '<li><p><label>MSN密码：</label><input id="menGuide_MSNPassword" type="password" class="ipt" /></p></li>'+
							        '<li class="tip"><p><span style="display:none">密码不正确，请您重新输入</span>请放心，我们不会保留您的信息！</p></li>'+
							        '<li class="btn"><a onclick="scope.msnGuide.sendRegards();this.blur();return false;" href="javascript:void(0)">确定</a></li>'+
							      '</ul>'+
							    '</div>'+
								//'<!-- 加关注成功-->'+
								'<div class="sysok" id="msnGuide_ConcernSuccess" style="display:none">'+
							      '<p><strong>恭喜！已成功关注好友！</strong></p>'+
							      '<div class="btn"><a class="b1" onclick="scope.msnGuide.switchModuleBetweenMSNRegardsAndFriendList(\'friend\');return false;" href="javascript:void(0)">返回</a><a class="b2" onclick="scope.msnGuide.switchModuleBetweenMSNRegardsAndFriendList(\'regards\');return false;" href="javascript:void(0)">问候MSN老友</a></div>'+
							    '</div>'+
								//'<!-- 加关注失败-->'+
								'<div class="sysbusy" id="msnGuide_ConcernFailure" style="display:none">'+
							      '<p><strong>对不起，系统繁忙。</strong></p>'+
							      '<div class="btn"><a onclick="scope.msnGuide.switchModuleBetweenMSNRegardsAndFriendList(\'friend\');return false;" href="javascript:void(0)">返回</a></div>'+
							    '</div>'+
								//'<!--建立关系页面-->'+
								'<div class="friendLs" id="msnGuide_FriendList" style="display:none;">'+
							      '<div class="top"><em id="msnGuide_TotalMSNFriendNumber"></em>'+
							        '<span id="msnGuide_SelectAllAndGetFriendListArea"><input onclick="scope.msnGuide.selectAll(this);" type="checkbox" id="msnGuide_SelectAll" /><label for="slall">全选</label><a id="msnGuide_GetFriendListButton" onclick="scope.msnGuide.updateFriendListArea(scope.msnGuide.currentPage+1);this.blur();return false;" href="javascript:void(0)">换一组</a></span>'+
							      '</div>'+
							      '<ul id="msnGuide_FriendListContainer" class="fls">'+
							      '</ul>'+
							      '<div class="btn"><div id="msnGuide_ConcernArea" style="display:none"><a href="javascript:void(0)" onclick="scope.msnGuide.concernCurrentFriend();return false;" class="b1">关注</a><a href="javascript:void(0)" onclick="scope.msnGuide.concernAllFriends();return false;" class="b2">关注全部MSN好友</a></div><div id="msnGuide_TimeoutArea" style="display:none"><a class="b3" href="javascript:void(0)" onclick="scope.msnGuide.getUserFriendList();return false;"></a></div></div>'+
							    '</div>'+
							  '</div>'+
							  '<div id="msnGuide_Loading" style="display:none;width:16px;height:16px;position:absolute;top:51%;left:334px"><img src="http://simg.sinajs.cn/blog7style/images/common/loading.gif" /></div>';

