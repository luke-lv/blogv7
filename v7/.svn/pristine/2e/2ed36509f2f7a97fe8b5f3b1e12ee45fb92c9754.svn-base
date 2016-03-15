/**
 * @fileoverview 影视博客 影评发表页面 高级选项初始化
 * @author wujian|wujian@staff.sina.com.cn
 * @created 2010-11-17
 */
$import("lib/sendLog.js");
$import("lib/showError.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/function/bind3.js");

$registJob("editor_initOptions", function(){
	//高级选项事件  点击展开或者关闭高级选项
	Core.Events.addEvent($E("moreOptions"),function(){
		var dom=$E("optionPanel");
		//var sendBtnCon=$E("sendBtnCon");
		//dom.style.display=="none"?dom.style.display="block":dom.style.display="none";
		if(dom.style.display=="none"){
			dom.style.display="block";
			$E("moreOptions").lastChild.className="SG_icon SG_icon84";
		}else{
			dom.style.display="none";
			$E("moreOptions").lastChild.className="SG_icon SG_icon82";
		}
				
	},"click");
	
	//创建分类  链接事件
	$E("cateManageLink").onclick = function(){
        window.CateDialog.show();
		return false;
    };	   
	 // 自动匹配标签-- 按钮事件--- 文章Tag自动提取
    $E("articleTagAutoSub").onclick = function(){
		
        $E("articleTagAutoSub").disabled = true;
        scope.cIFM("tagDataIframe");
       // editor.setSourceValue();
        $E("editorForm").target = "tagDataIframe";
        $E("editorForm").action = articleEditorCFG.tagPostURL;
        Core.Events.addEvent($E("tagDataIframe"), Core.Function.bind3(scope.tagFunc, this, [$E("tagDataIframe"), function(frmJson){
            trace("提取Tag,返回状态码: " + frmJson.code);
            //trace("提取Tag,返回内容: " + frmJson.data);
            $E("articleTagAutoSub").disabled = false;
            switch (frmJson.code) {
                case "B00000":
                    break;
                case "B00006":
                    $E("articleTagInput").style.color = "#000";
                    $E("articleTagInput").value = frmJson.data;
                    break;
				case "00001":
                   // showError($SYSMSG['A00001']);
                    break;
				case "00006":
                    $E("articleTagInput").style.color = "#000";
					//alert(frmJson.data)
                    $E("articleTagInput").value = frmJson.data;
                    break;
                default:
				  if(frmJson.code.charAt(0) == '0') {
					showError('B'+frmJson.code);
				  } else {
					showError(frmJson.code);
				  }
//                    showError(frmJson.code, {
//                        close: false
//                    });
                    break;
            }
            v7sendLog('48_01_01_'+frmJson.code); //liming9@2012年10月29日
        }]), "load");
        $E("editorForm").submit();
		return false;
        //		v5SendLog('v5_one','rela_matchingtag');
    };
});