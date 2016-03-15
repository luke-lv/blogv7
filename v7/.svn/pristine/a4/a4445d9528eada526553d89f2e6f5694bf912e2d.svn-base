/**
 * @fileoverview 编辑器页面 公用函数库 注册到scope中
 * @autor wujian|wujian@staff.sina.com.cn
 * @create 2010-11-22
 */
$import("sina/sina.js");
$import("sina/core/dom/removeNode.js");
$import("sina/core/dom/addHTML.js");
$import("sina/core/string/trim.js");
$import("lib/showError.js");
$registJob("publicFunc",function(){
	/**
	 * 创建iframe
	 * @param {Object} sFrameName
	 */
	scope.cIFM=function(sFrameName){		
        if ($E(sFrameName)){
			Core.Dom.removeNode($E(sFrameName));	
		} 		        
        Core.Dom.addHTML(document.body, "<iframe name='" + sFrameName + "' id='" + sFrameName + "' style='display: none;'></iframe>");
		
    };
	/**
	 * 获取frame 值
	 * @param {Object} FrameNode
	 */
	scope.getFrameValue = function(FrameNode){
        return Core.String.j2o(Core.String.trim(FrameNode.contentWindow.document.body.innerHTML));
    };
	/**
	 * 回调函数
	 * @param {Object} FrameNode
	 * @param {Object} oFunc
	 */
	scope.tagFunc=function(FrameNode, oFunc){
        try {
        
            var frmJosn = scope.getFrameValue(FrameNode);
            if (frmJosn == null) 
                frmJosn = {
                    code: "A00001",
                    data: []
                };
            
            if (frmJosn.code != null) {
                if (oFunc) {
                    oFunc(frmJosn);
                }
                else {
                    showError(frmJosn.code, {
                        close: false
                    });
                }
            }
        } 
        catch (e) {
			//alert(e.message)
            //traceError(e);
            //showError("00001");
           // $E("articlePostBtn").disabled = false;
           // $E("articlePosTempBtn").disabled = false;
           // $E("articleTagAutoSub").disabled = false;
           // $E("articleSaveBtn").disabled = false;
        }
    };
})
