/**
 * 修改头像
 * @author dg.liu 2008.10.29
 * @modified dcw1123 2010.03.12
 */
$import("sina/utils/form/sinput.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/function/bind2.js");
//$import("interface/interface_save_nick.js");

$import("lib/dialogConfig.js");
$import("lib/msg/systemMSG.js");
$import("lib/ticket.js");

$import("head4platform.js");
$import("msg/modifyNick.js");

$registJob("modifyNick", function(){
	//IE6页面load后，立即执行这段程序，会清除原先存在的flash，然后重新加载。
	//期间如果选择了图片进行上传，会导致IE6崩溃。
	//目前考虑最简易方案是将这个任务提前到第一位去执行，让用户来不及在flash再次加载之前操作。
	//edited by liangdong2@staff.sina.com.cn 2011.01.19 18:55
	initTicket();
});

function callBackWhenHeadBeenUpLoaded() {
	(new Interface('http://control.blog.sina.com.cn/riaapi/profile/edit_headpic.php', "jsload")).request({
		GET:{
			uid:scope.$uid
		},
		onSuccess : function(){}
	});
}
function initTicket(){
    scope.$canModifyNick = parseInt(scope.$canModifyNick, 10);
	Lib.Ticket.get(function(data){
		App.head4platform.show(scope.$uid, {
			flash: $_GLOBAL.flashBasicURL + "head4platform_blog7icp.swf",
			nick: uname,
			echo: "update_showError",
			cancel: "update_cancle",
			ticket: data.ticket[0],
			//用户微博验证等级，0为普通用户，1为黄V，2为蓝V
			vlevel: parseInt(scope.$vlevel, 10) || 0,
			//黄V和普通用户可以在博客修改昵称，蓝V强制用户到微博修改昵称
            canModifyHead: parseInt(scope.$vlevel, 10) <= 1 ? 1 : 0
		});
	},1);
}

function update_showError(code){
	//firefox为了解决无法输入中文的bug
//	if($MOZ){
//		if(code == "A00006"){
//			alert("修改成功！如有延迟，请刷新后查看。");
//			back();
//		}else{
//			initTicket();
//			alert("保存失败！");
//		}
//		return;
//	}
	if (code == "A00006"){
		winDialog.alert("修改成功！<br>如有延迟，请刷新后查看。", {
			funcOk : back,
			textOk : "确定",
			title : "提示",
			icon : "03"
		});
	} else if ("A00501" === code) {
        var dlg = winDialog.create({
            width   : 400,
            content : ['<div class="CP_layercon2 pop_v">',
                    '<div class="v_prompt">',
                        '<div class="v_cnt SG_txtb">您目前为微博机构认证用户，修改昵称会同步至微博，影响认证状态,请进入微博进行昵称修改。</div>',
                        '<p class="v_modify"><a href="http://account.weibo.com/set/index?topnav=1">进入微博进行昵称修改&gt;&gt;</a></p>',
                    '</div>',
                '</div>'].join("")
            }, "__modifiedNick");
        dlg.show();
    } else {
		initTicket();
		winDialog.alert($SYSMSG[code], {
			textOk : "确定",
			title : "保存失败！",
			icon : "02"
		});
	}
}

function debug_alert(msg) {
	
}

function update_cancle(){
	window.location.reload();
}

function back(){
	window.location.href="http://blog.sina.com.cn/u/"+scope.$uid;
	return false;
}

//微博V用户验证函数，如果验证成功继续保存，则调用uData函数进行保存步骤
function uploadCommond(nick){
	if(uname === nick){
		App.head4platform.getSwf().uData();
	}else if(parseInt(scope.$vlevel, 10) === 1){
		//黄V用户要求用户确认信息
		winDialog.confirm('昵称修改将影响微博认证状态，点击"确定"提交修改。', {
			funcOk : function() {
				App.head4platform.getSwf().uData();
			}
		});
	}
}
