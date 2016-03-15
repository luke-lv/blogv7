/**
 * @fileoverview 个人档案个人简介编辑
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
$import("sina/core/string/trim.js");
$import("sina/core/string/byteLength.js");
$import("sina/core/string/leftB.js");
$import("sina/utils/limitLength.js");

/**
 * 个人简介静态类
 */
scope.Resume={
	
	/**
	 * 初始化
	 */
	initialize:function(){
		//是否提交数据
		var isSubmit=true;
		
		Utils.Form.limitMaxLen($E("txtResume"),200);
		
		
		//绑定没有任何数据的添加按钮的事件
		Core.Events.addEvent($E("linkAddResume"),showResumeEditor,"click");
		
		//显示编辑区域
		Core.Events.addEvent($E("btnEditResumeInfo"),showResumeEditor,"click");
		
		
		//提交数据
		Core.Events.addEvent($E("btnResumeSave"),function(){
			if (isSubmit) {
				saveData();
				//return false;
			}
		},"click");
		//取消编辑
		Core.Events.addEvent($E("btnResumeCancel"),function(){
			if (isSubmit) {
				cancel();
			}
		},"click");
		
		//-------------------字数限制--------------------------------
		var inputTips = function(){
            var s = $E("txtResume").value;
            var maxLength = 200;
            if (Core.String.byteLength(s) > maxLength) {
                //$E("words_num").innerHTML = "0";
				trace('还可以输入'+0);
            }
            else {
                //$E("words_num").innerHTML = Math.floor((maxLength - Core.String.byteLength(s)) / 2);
				trace('还可以输入'+Math.floor((maxLength - Core.String.byteLength(s)) / 2));
            }
        };
		
		//做字数限制
        if ($IE) {
			Core.Events.addEvent($E("txtResume"),function(){
				var nValue = $E("txtResume").value;
                var strLen = Core.String.byteLength(nValue);
                if (strLen > 200) {
                    $E("txtResume").value = Core.String.leftB(nValue, 2000);
                }
			},'blur');
        }
        else {
            Utils.limitLength($E("txtResume"), 2000);
        }
		//Core.Events.addEvent($E("txtResume"), inputTips, 'keyup');
        //Core.Events.addEvent($E("txtResume"), inputTips, 'propertychange');
        //Core.Events.addEvent($E("txtResume"), inputTips, 'input');
		//-----------------------------------------------------------------
		
		Core.Events.addEvent($E("txtResume"),function(){
			$E("msgInputResume").style.display="none";
		},"focus");
		
		function showResumeEditor(){
			//隐藏"编辑"按钮
			$E("btnEditResumeInfo").parentNode.style.display="none";
			
			//显示Loading
			$E("resumeLoading").style.display="";
			
			getData();
			return false;
		}
		
		//保存数据
		function saveData(){
			if(isSubmit){
				isSubmit=false;
				var d={};
				d.resume=$E("txtResume").value;
				if (d.resume.replace(/\s/g, "") == "") {
					d.resume = "";
					$E("txtResume").value="";
				}
				else {
					d.resume = d.resume.replace(/\\/g,"\\\\");
				}
				submitData(scope.personal.jsonToString(d));
			}
		}
		
		//更新个人简介的数据
		function updateResumeData(resumeText){
			if (resumeText) {
				var chars={
					"&lt;":"<",
					"&gt;":">",
					"&amp;":"&",
					"&quot;":"\""
				};
				var c;
				for (c in chars) {
					resumeText=resumeText.replace(new RegExp(c,"g"),chars[c]);
				}
				$E("txtResume").value = resumeText.replace(/<br *\/*>/ig, "\n");
			}
			
			$E("resumeEditor").style.display="";
			$E("resumeInfoRes").style.display="none";
			//隐藏Loading
			$E("resumeLoading").style.display="none";
			
			//如果有历史数据，则显示提示信息
			//$E("resumeInfoTip").style.display=isHistory?"":"none";
		}
		
	
		//提交数据
		function submitData(jsonStr){
			if(!Core.String.trim($E('txtResume').value)) {
				$E('msgInputResume').style.display = '';
				isSubmit = true;
				return;
			}
			$E('msgInputResume').style.display = 'none';
			// Modified by L.Ming 接口地址变更 2009.11.26
//			(new Interface("http://icp.cws.api.sina.com.cn/profile/edit_resume.php", "jsload")).request({
			(new Interface("http://control.blog.sina.com.cn/riaapi/profile/edit_resume.php", "ajax")).request({
					POST : {
						uid:scope.$uid,
						data:jsonStr
						,version:7
					},
					onSuccess : function (iData) {
						updateShowData(iData["percent"]);
					},
					onError : function (iData) {
						isSubmit=true;
						winDialog.alert(
							$PERSONAL_MSG[iData.code],
							{ icon : "02" }
						);
					},
					onFail : function (iData){
						isSubmit=true;
					}
				});
		}
		
		//获取数据
		function getData(){
			// Modified by L.Ming 接口地址变更 2009.11.26
//			(new Interface("http://icp.cws.api.sina.com.cn/profile/show_resume.php", "jsload")).request({
			(new Interface("http://control.blog.sina.com.cn/riaapi/profile/show_resume.php", "jsload")).request({
					GET : {
						uid:scope.$uid
						,version:7
					},
					onSuccess : function (iData) {
						var text=(iData && iData["resume"])?iData["resume"]:"";
						updateResumeData(text);
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
		
		//取消
		function cancel(){
			$E("resumeEditor").style.display="none";
			$E("resumeEditor").value="";
			$E("resumeInfoRes").style.display="";
			$E("msgInputResume").style.display="none";
			//显示"编辑"按钮
			$E("btnEditResumeInfo").parentNode.style.display="";
			
			//隐藏有历史数据的提示信息
			//$E("resumeInfoTip").style.display="none";
		}
		
		//更新要显示的数据
		function updateShowData(percent){
			// Modified by L.Ming 接口地址变更 2009.11.26
//			(new Interface("http://icp.cws.api.sina.com.cn/profile/show_resume.php", "jsload")).request({
			(new Interface("http://control.blog.sina.com.cn/riaapi/profile/show_resume.php", "jsload")).request({
					GET : {
						uid:scope.$uid
						,version:7
					},
					onSuccess : function (iData) {
						$E("resumeInfoDisplay").innerHTML='<p class="personIntro CP_txta">'+iData["resume"]+'</p>';
						$E("resumeInfoRes").style.display="";
						$E("resumeEditor").style.display="none";
	
						//更新"完成度"
						$E("resumePercent").innerHTML="已完成"+(percent || "0%");
						
						//显示"编辑"按钮
						$E("btnEditResumeInfo").parentNode.style.display="";
						
						//隐藏有历史数据的提示信息
						//$E("resumeInfoTip").style.display="none";
						
						//"请添加"按钮行
						$E("resumeAddItem").style.display=iData["resume"]==""?"":"none";
						
						
						isSubmit=true;
					},
					onError : function (iData) {
						winDialog.alert(
							$PERSONAL_MSG[iData.code],
							{ icon : "02" }
						);
						isSubmit=true;
					},
					onFail : function (iData){
						isSubmit=true;
					}
				});
			
		}
	}
};
