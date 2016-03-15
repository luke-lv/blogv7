/**
 * @fileoverview 搜人项目的编辑
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2009-08-14
 */

$import("sina/sina.js");
$import("sina/utils/form/sinput.js");
$import("sina/core/events/addEvent.js");

$import("lib/interface.js");
$import("lib/dialogConfig.js");

$import("msg/personal.js");
$import("product/personal/common.js");

/**
 * 是否允许搜人的静态页
 */
scope.SearchPeople={
	
	/**
	 * 初始化
	 */
	initialize:function(){
		if(!$E('btnEditNosearchInfo')) {
			return;
		}
		$E('btnEditNosearchInfo').onclick = function() {
			loadingDate();
			
			//隐藏"编辑"按钮
			$E("btnEditNosearchInfo").parentNode.style.display="none";
			
			//显示Loading
			$E("btnEditResumeInfoLoading").style.display="";
			
			return false;
		}
		
		$E('btnNosearchSave').onclick = function() {
			var data = {};
			data.nosearch = $N('nosearch')[0].checked ? 1 : 0;
			(new Interface("http://control.blog.sina.com.cn/riaapi/profile/edit_nosearch.php", "ajax")).request({
				POST : {
					uid:scope.$uid
					,version:7
					,data: scope.personal.jsonToString(data)
				},
				onSuccess : function (iData) {
					if(iData == 0) {
						$E('nosearchPercent').innerHTML = "进入找朋友搜索";
					} else {
						$E('nosearchPercent').innerHTML = "不进入找朋友搜索";
					}
					cancleSave();
				},
				onError : function (iData) {
					winDialog.alert(
						$PERSONAL_MSG[iData.code],
						{ icon : "02" }
					);
				},
				onFail : function (iData){
					
				}
			});
		}
		
		$E('btnNosearchCancel').onclick = function() {
			cancleSave();
		}
		
		/**
		 * 点击取消按钮
		 */
		function cancleSave() {
			$E("btnEditNosearchInfo").style.display = '';
			$E("nosearchInfoTip").style.display = 'none';
			$E("btnEditNosearchInfo").parentNode.style.display="";
		}
		
		function loadingDate() {
			(new Interface("http://control.blog.sina.com.cn/riaapi/profile/show_base.php", "jsload")).request({
				GET : {
					uid:scope.$uid
					,version:7
				},
				onSuccess : function (iData) {
					
					if(iData["nosearch"] && iData["nosearch"]!=""){
						if(parseInt(iData["nosearch"])==1){
							$N("nosearch")[0].checked=true;
						}else{
							$N("nosearch")[1].checked=true;
						}
					}
					$E('nosearchInfoTip').style.display = '';
					$E('btnEditResumeInfoLoading').style.display = 'none';
					//隐藏Loading
					$E("basicInfoLoading").style.display="none";
				},
				onError : function (iData) {
					winDialog.alert(
						$PERSONAL_MSG[iData.code],
						{ icon : "02" }
					);
				},
				onFail : function (iData){
					
				}
			});
		}
	}
};
