$import('lib/checkAuthor.js');
$import('lib/interface.js');
$import('lib/login/ui.js');
$import('lib/showError.js');
$import('sina/core/events/addEvent.js');
$import('sina/utils/form/inputListen.js');
$import('sina/core/events/fireEvent.js');
$import('sina/core/function/bind3.js');

/**
 * @author darkty2009 | darkty2009@gmail.com
 * 邀请升级
 * 2009-10-28 11:47
 */

$registJob("invite", function () {
	
	/**
	 * JOB作用域变量
	 */
	
	var selectList 		= [];
	var list 			= $N('fcb');
	var iptList			= [$E('url_1'), $E('url_2'), $E('url_3'), $E('url_4'), $E('url_5')];
	initEvent();
	
	/**
	 * 加监听
	 */
	function initEvent()
	{	
		$E('allfriend').checked = true;	
	
		for(var i=0;i<list.length;i++)
		{
			list[i].checked = true;
			
			$E('photo'+i).onclick = Core.Function.bind3(function(param) {
				$E('fcb'+param).checked = !$E('fcb'+param).checked;
				Core.Events.fireEvent($E('fcb'+param), 'click');
			}, null, [i]);
			
			$E('fcb'+i).onclick = function() {
				if ($E('allfriend').checked) {
					var flag = true;
					for (var i = 0; i < list.length; i++) {
						if(list[i].checked) {
							flag = false;
							break;
						}
					}
					
					if(flag) {
						$E('allfriend').checked = false;
					}
				}
			};
		}
		
		for(var j=1;j<=5;j++)
		{
			var inp = $E('url_'+j);
			Utils.Form.inputListen(inp, 50);
			inp.value = "";
			
			inp.onblur = function() {
				this.value = this.value.replace(/[\u4E00-\u9FA5]/g, '');
				this.value = this.value.replace(/[^(a-zA-Z0-9:\/._)]/g, '');
				this.value = Core.String.trim(this.value);
				checkSame(this);
				
			}
		}
		
		$E('inviteBtn').onclick = function(){

			var face = new Interface("http://control.blog.sina.com.cn/riaapi/upgrade/invite.php?version=7", "ajax");
			var selList = [];
			
			for(var i=0;i<list.length;i++) {
				if(list[i].checked) {
					selList[selList.length] = 'http://blog.sina.com.cn/u/'+list[i].value.split(",")[0];
				}
			}
			for(var i=0;i<iptList.length;i++) {
				if(iptList[i].value != "" && iptList[i].value.toLowerCase() != "http://") {
					selList[selList.length] = iptList[i].value;
				}
			}
			
			face.request({
				POST: {
					url: selList.join(",")
				},
				onSuccess: function(result) {
					winDialog.alert("邀请已成功", {
					    funcOk: function(){
							trace("funcOk");
							window.location = "http://control.blog.sina.com.cn/upgrade/upgrade_invite.php";
					    }.bind2(this),
					    textOk: "确定",
					    defaultButton: 1, // 默认是1，表示确定按钮默认聚焦，0 表示取消按钮默认聚焦
					    title: "提示",
					    icon: "03" // 可选值："01"、"02"、"03"、"04"、"05"
					},"levepUpPost");
				}.bind2(this),
				onError: function(result) {
					switch(result.code) {
						case "A00010":showError("邀请名额已满");break;
						case "A00011":showError("本次邀请超过剩余邀请名额");break;
						case "A00012":showError("请正确填写内容");break;
						case "A00015":showError("抱歉，新版博客测试名额暂时发放完毕，稍后会再次开放。请耐心等待");break;
						default:showError($SYSMSG[result.code]);
					}
				}.bind2(this)
			});
			
		}
	}
	
	/**
	 * 是否勾选和输入一致
	 */
	function checkSame(dom)
	{
		
	}
	
	$E("shoucang").onclick = function() {
		var title=document.title
		var url=document.location.href
		if (window.sidebar) {
			window.sidebar.addPanel(title, url, "");
		}
		else 
			if (window.opera && window.print) {
				var mbm = document.createElement('a');
				mbm.setAttribute('rel', 'sidebar');
				mbm.setAttribute('href', url);
				mbm.setAttribute('title', title);
				mbm.click();
			}
			else 
				if (document.all) {
					window.external.AddFavorite(url, title);
				}
	}
	
	if($E('allfriend')) {
		$E('allfriend').onclick = function() {
			if (this.checked) {
				for (var i = 0; i < list.length; i++) {
					list[i].checked = true;
				}
			}
			if (!this.checked) {
				for (var i = 0; i < list.length; i++) {
					list[i].checked = false;
				}
			}
			
		};
	}
});
