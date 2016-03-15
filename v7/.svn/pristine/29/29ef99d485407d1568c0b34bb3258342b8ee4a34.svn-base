/**
 * @fileoverview | 模板克隆
 * @author Random | YangHao@staff.sina.com.cn
 * @modified dcw1123 | chengwei1@staff.sina.com.cn
 */

$import("sina/sina.js");
$import("sina/ui/template.js");
$import("sina/utils/io/jsload.js");
$import("lib/component/templateClone/templateClone.js");
$import("lib/dialogConfig.js");
$import('lib/getTplNum.js');
$import("lib/checkAuthor.js");
$import("lib/insertMoban.js");

$registJob("templateClone", function(){
	
	Lib.checkAuthor();
	
	if($isAdmin) {
		trace('博主。不执行代码');
		return;
	}
	
    Lib.getTplNum(function(){
		
		var tmpCloneFuc = function() {
			function formatPv(num){
				var tmp = new Ui.Template($_GLOBAL.cloneTemplateConfig[scope["tpl"]].count_text);
				var cnf={};
				cnf.template_pv = num;
				$E("template_clone_link").innerHTML = tmp.evaluate(cnf);
			}
			
	        if (scope["tpl"]){
				//克隆模版按钮----------------------------
				var tc;
				var	tcInfo = $_GLOBAL.cloneTemplateConfig[scope["tpl"]];
				
				if (tcInfo && tcInfo["template_clone_pic"].replace(/\s/g, "") != "") {
				
					if (scope["tpl"] == "8_52"){//365模版的位置与其他的不一样，需要把clone按钮放在顶部
						$E("template_clone_pic").parentNode.parentNode.style.top = "0px";
						if (window.screen.width < 1280){//小屏幕的，按钮偏左一点，防止影响到随便逛逛按钮
							$E("template_clone_pic").parentNode.parentNode.style.right = "88px";
						}
						$E("template_clone_pic").parentNode.parentNode.style.zIndex = 201;
					}
				
					$E("template_clone_pic").innerHTML = tcInfo["template_clone_pic"];
					$E("template_clone_link").innerHTML = tcInfo["template_clone_link"];
					$E("template_clone_other").innerHTML = tcInfo["template_clone_other"];
					
					if(tcInfo["count_id"]){
						// var url = "http://hits.blog.sina.com.cn/hits?act=3&uid="+tcInfo["count_id"]+"&varname=templatecc";
						var url = "http://comet.blog.sina.com.cn/api?maintype=hits&act=3&uid="+tcInfo["count_id"]+"&varname=templatecc";
						Utils.Io.JsLoad.request(url, {
							onComplete: function(){
								if(typeof templatecc != "undefined"){
									formatPv(templatecc.pv);			//注意 是 pv
								}else{
									$E("template_clone_link").style.display = "none";			//接口返回错误的话。
								}
							}
						});
					}
					
					tc = new Lib.TemplateClone($E("template_clone_pic"), function(){
						winDialog.alert("克隆模板成功!", {
							icon:"03"
							,funcOk: function(){
								Lib.checkAuthor();
								window.location.href = "http://blog.sina.com.cn/u/" + $UID;
							}
						});
					});
				}
			
				//官网---------------------------------------------------------------------------
				var gwinfo=$_GLOBAL.GUANWANG[scope["tpl"]];
				if (gwinfo && gwinfo["template_clone_pic"].replace(/\s/g, "") != "") {
					$E("template_clone_pic").innerHTML = gwinfo["template_clone_pic"];
	                $E("template_clone_other").innerHTML = gwinfo["template_clone_other"];
					
					if ($E('template_clone_pic')) {
	                    if ($E('template_clone_pic').parentNode.tagName.toLowerCase() == 'a') {
	                        $E('template_clone_pic').parentNode.href = gwinfo["template_clone_link"];
							$E('template_clone_pic').parentNode.target="_blank";
	                    }
	                }
				}
				
	            //广告投放链接 ，链吧 ，让他们链吧 ，给钱 吧 
	            var fmInfo = $_GLOBAL.famous_conf[scope["tpl"]];
	            if (fmInfo && fmInfo["template_clone_pic"].replace(/\s/g, "") != "") {
	                $E("template_clone_pic").innerHTML = fmInfo["template_clone_pic"];
	                $E("template_clone_link").innerHTML = fmInfo["template_clone_link"];
	                $E("template_clone_other").innerHTML = fmInfo["template_clone_other"];
	                
	                if ($E('template_clone_pic')) {
	                    if ($E('template_clone_pic').parentNode.tagName.toLowerCase() == 'a') {
	                        $E('template_clone_pic').parentNode.href = "http://ba.sass.sina.com.cn/front/tp/deliver?blogId=" + scope.$uid + "&tp=" + scope.tpl;
	                    }
	                }
	            }
	        }
	        //Lib.insertMoban();//插入动感模板
		};
		
		if($_GLOBAL.cloneTemplateConfig) {
			tmpCloneFuc();
		} else {
			Utils.Io.JsLoad.request("http://sjs.sinajs.cn/blog7common/conf/tmp_clone.js", {
				onComplete : function () {
					tmpCloneFuc();
				}
				,noreturn : true
                ,isRemove : false
			});
		}
		
    });
	
});


