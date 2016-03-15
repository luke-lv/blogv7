/**
 * @fileoverview
 *	添加关注功能
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @history
 *
 */
$import("sina/sina.js");
$import("sina/core/function/bind3.js");

$import("lib/component/_component.js");
$import("lib/checkAuthor.js");
$import("lib/interface.js");
$import("lib/dialogConfig.js");
$import("lib/showError.js");
// 引入 $login 所在的 JS
$import("lib/msg/systemMSG.js");
$import("lib/msg/attentionMSG.js");
$import("lib/login/ui.js");

//为开通博客用户优化
$import("lib/openBlog.js");

(function () {
	/**
	 * 添加关注
	 * @param {Number|String} nVisitId	发出关注的人
	 * @param {Number|String} nUserId	被关注的人
	 */
	var addAttention = function (nVisitId, nUserId,addedCallBack){
		Lib.checkAuthor();
		var i_attention = new Interface("http://control.blog.sina.com.cn/riaapi/profile/attention_add.php", "ijax");
		i_attention.request({
			POST : {
				"uid"	: nVisitId || $UID
				,"aid"	: nUserId || scope.$uid
			}
			,onSuccess	: function(){}
			,onError	: function(oData){
				var msg = "";
				switch(oData.code) {
					case "A11007":
						msg = $SYSMSG["A11007"].replace("#{linkNewBlog}", "http://login.sina.com.cn/hd/reg_sec.php?entry=blog");
						winDialog.alert(msg,{funcOk: function(){
								window.open("http://login.sina.com.cn/hd/reg_sec.php?entry=blog", "_blank", "");
							}});
						break;
					case "A33003": // 超过最大关注数 
						
					msg = $SYSMSG.A33003.replace("#{UID}", $UID);
						winDialog.alert(msg);	
						break;
					case "A33004": // 关注成功
						var alertConf = {
							subText : ['<div class="CP_w_cnt SG_txtb">以后对方的动态（发博文，图片，投票等），都可以在<span style="color:red">个人中心</span>查看啦！</div>'
								, '<ul class="CP_w_part CP_w_aLine">'
									, '<li><a href="http://control.blog.sina.com.cn/blogprofile/index.php?type=3&from=attention" onclick="winDialog.getDialog(\'attention\').hidden();" target="_blank">到个人中心查看关注动态&gt;&gt;</a></li>'
									//, '<li><a href="http://sina.allyes.com/main/adfclick?db=sina&bid=118883,251213,256255&cid=0,0,0&sid=247096&advid=358&camid=19809&show=ignore&url=http://blog.2010.sina.com.cn/yunying/2010worldcup/" target="_blank">记录激动时刻，赢取超级大奖！</a></li>'
								, '</ul>'].join(""),
							icon:	"03",
							width:	300
						};
						try {
							var attentionButton = $E("module_901_attention");
							attentionButton.className = "SG_aBtn SG_aBtn_dis";
							attentionButton.innerHTML = '<cite onclick="Lib.Component.isAttentioned(\'' + $UID + '\', \'' + scope.$uid + '\');">已关注</cite>';
						}catch(e){}
						//msg = $SYSMSG.A33004.replace("#{UID}", $UID);
						msg = $SYSMSG["A33004"];
						alertConf["subText"] = alertConf["subText"].replace(/#{UID}/g, $UID);
						winDialog.alert(msg, alertConf, "attention");
						break;
					default:
					 	showError(oData.code);
				}
				addedCallBack(oData.code);
			}
			,onFail		: function () {
				showError($SYSMSG.A00001);
			}
		});
	};
	// 加关注
	Lib.Component.Attention = function (nVisitId, nUserId,addedCallBack){
		Lib.checkAuthor();
		var me = this;
		addedCallBack = addedCallBack || function(){};
		if(!$isLogin){
			var Login = new Lib.Login.Ui();
			Login.login(function(){
				scope.blogOpener.showDialog(function() {
					(Core.Function.bind3(addAttention, null, [nVisitId, nUserId,addedCallBack]))();
				});
			},false,"referer:"+location.hostname+location.pathname+",func:0004");	//添加统计点，加关注 0004
		}else{
			scope.blogOpener.showDialog(function() {
				addAttention(nVisitId, nUserId,addedCallBack);
			});
		}
	};
	// 取消关注确认
	Lib.Component.deleteAttention = function (sUid, sAid) {
		winDialog.getDialog("attention").close();
		winDialog.confirm("是否要取消关注？", {
			funcOk		: function () {
				new Interface("http://control.blog.sina.com.cn/riaapi/profile/attention_del.php", "jsload").request({
					GET : {
						"uid"	: $UID
						,"aid"	: scope.$uid
					}
					,onSuccess	: function () {
						var attentionButton = $E("module_901_attention");
						attentionButton.className = "SG_aBtn";
						attentionButton.innerHTML  = '<cite onclick="Lib.Component.Attention(\'' + $UID + '\', \'' + scope.$uid + '\');">加关注</cite>';
					}
					,onError	: function () {
						winDialog.alert("取消失败！请重试。");
					}
					,onFail		: function () {
						winDialog.alert("取消失败！请重试。");
					}
				});
			}
			,funcCancel	: function () {
				Lib.Component.isAttentioned();
			}
			,textOk		: "是"
			,textCancel	: "否"
		});
	};
	// 已关注浮层
	Lib.Component.isAttentioned = function (){
		winDialog.alert("已关注此人！", {
			subText : ['<ul class="CP_w_part CP_w_aLine">'
						, '<li><a href="http://control.blog.sina.com.cn/blogprofile/index.php?type=3&from=attention2" onclick="winDialog.getDialog(\'attention\').close();" target="_blank">到个人中心查看关注动态&gt;&gt;</a></li>'
					, '</ul>'].join("")
			,icon : "03"
		}, "attention");
	};
})();
