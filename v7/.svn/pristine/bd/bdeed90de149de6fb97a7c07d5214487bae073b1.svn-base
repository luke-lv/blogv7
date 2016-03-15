/**
 * @fileoverview 预览的按钮点击
 * @author zhihan|zhihan@staff.sina.com.cn
 */

$import("jobs/nineGrid/postArticleCall.js");
$import("lib/showError.js");
$import("sina/core/events/addEvent.js");
$import("lib/dialogConfig.js");
$import("msg/nineGrid.js");

$registJob("previewPost",function(){
	
	scope.previewSubmiting = false;
	
	document.domain = 'sina.com.cn';
	
	Core.Events.addEvent($E('grid_post'),function(e){
		if(scope.previewSubmiting) {
			return false;
		}
		scope.previewSubmiting = true;
		//form->iframe
		$E('editorForm').submit();
		
		return false;
	},'click');
	
});