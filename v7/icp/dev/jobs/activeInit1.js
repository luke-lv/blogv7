/**
 * chengwei1@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/core/array/foreach.js");
$import("lib/interface.js");
$import("msg/regmsg.js");
$import("lib/dialogConfig.js");
$import("sina/core/system/br.js");

(function(){
	var eStyle = $E("eStyle");
	var lis = $T(eStyle, "li");						// current classname	img / input 的点击。li 变色。
	var radioes = $T(eStyle, "input");
	var imges = $T(eStyle, "img");
	
	var bigShow = $E("bigShow");					// 建议使用动画。
	var nextBtn = $E("nextBtn");
	
	var nextPhp = "http://control.blog.sina.com.cn/riaapi/reg/init_blog_module.php";
	var nextJump = "http://control.blog.sina.com.cn/reg/reg_blog_attention.php?src=";
	var remChange = 0;								// 默认选中，记住选中。
	var imchange = 0;

	DialogTemplate.alert = $SYSMSG["alert"];		// 模板覆盖，此次本页面的构建的样式与 blog7 冲突。
	
	function init(){
		// 事件注册
		var ieEvt = "onchange";
		if($IE){
			ieEvt = "onclick";
		}
		radioes[remChange].checked = true;
		Core.Array.foreach(radioes, function(aRadio, i){
			clickShift(aRadio, i, ieEvt);
		});
		Core.Array.foreach(imges, function(aImg, i){
			clickShift(aImg, i, "onclick");
		});
		function clickShift(elem, i, evtType){
			elem[evtType] = function(){
				if(this.tagName.toUpperCase() === "IMG"){ this.parentNode.blur(); }
				if(i>0){ imchange = 1; }			// 曾选过其他样式。
				lis[remChange].className = "";
				remChange = i;
				lis[i].className = "current";
				radioes[i].checked = true;
				bigShow.src = imges[i].src;
			};
		}
		nextBtn.onclick = function(){
			// 收集信息
			var chooseRadioVal = remChange;
			var moduleMsg = scope.$module;
			var backdefault = 0;
			
			// 如果曾变更过样式。但提交的时候，还返回到了第一个。那就是统计对象。
			if(imchange && (remChange == 0)){
				backdefault = 1;
			}
			(new Interface(nextPhp, "ajax")).request({
				POST : {
					module : moduleMsg,
					module_checked : chooseRadioVal,
					backdefault : backdefault,
					version : 7
				},
				onSuccess : function(res){
					window.location.href = nextJump + scope.$src + "&version=7";
				},
				onError : function(res){
					winDialog.alert($SYSMSG[res.code],{
						funcOk : function(){
							if(res.code == "A11003"){
								window.location.href = "http://blog.sina.com.cn/u/"+scope.$uid;
							}
						}
					});
				}
			});
			return false;
		}
	}
	init();
})();

