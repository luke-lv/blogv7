/**
 * @fileoverview 修改博客举报类
 * 支持  举报成功或失败后回调   
 * 			msg_report_callback(0)  参数1代表成功，
 * 			msg_report_callback(1)  参数1代表失败，
 * @author  changchuan@staff.sina.com.cn
 * @created 2010-10-29
 */

$import("sina/sina.js");
$import("sina/core/class/create.js");
$import("sina/core/events/addEvent.js");
$import("sina/utils/form/sinput.js");
$import("sina/core/string/byteLength.js");
$import("sina/core/string/shorten.js");
$import("sina/core/string/decodeHTML.js");

$import("lib/login/ui.js");
$import("lib/checkAuthor.js");
$import("lib/dialogConfig.js");
$import("lib/component/report/generalReport.js");
$import("lib/component/report/successedReport.js");
$import("lib/msg/report.js");

/**
 * 博客举报类
 */
Lib.BlogReport=Core.Class.create();
Lib.BlogReport.prototype = {
	
	/**
	 * 举报对话框
	 */
	generalReport:null,
	
	/**
	 * 举报成功后的对话框
	 */
	successedReport:null,
	
	/**
	 * 恶意举报的提示对话框
	 */
	badReport:null,
	
	/**
	 * 举报完成后的提示对话框
	 */
	finishedReport:null,
	
	/**
	 * 恶意举报对话框是否已经初始化
	 */
	isBRInit:false,
	
	/**
	 * 举报结束的对话框是否已经初始化
	 */
	isFRInit:false,
	
	initialize:function(){
		this.generalReport=new scope.GeneralReport();
		this.successedReport=new scope.SuccessedReport();
	},
	
	/**
	 * 开始举报
	 */
	start:function(type,nickName,bodyID,reportUID,userNameInfo1,userNameInfo2,titleInfo,contentInfo,tUID){
		var me=this,
			gr=this.generalReport;
		contentInfo=Core.String.decodeHTML(contentInfo);
		gr.nickName=nickName;
		gr.type=type;
		gr.reportUID=reportUID;
		gr.userNameInfo1=userNameInfo1;
		gr.userNameInfo2=userNameInfo2;
		gr.titleInfo=titleInfo;
		gr.contentInfo = Core.String.byteLength(contentInfo)>800 ? Core.String.shorten(contentInfo,800) : contentInfo;
		gr.bodyID=bodyID;
		gr.tUID=tUID?tUID:"";
		
		gr.onSuccessed=function(data){
			me.reportSuccess(nickName,bodyID,data["dataID"]);
			this.hidden();
		};
		
		gr.onError=function(err){
			if (err["code"] === "B04112") {
				me.showBad();
				this.hidden();
				
			}
			else {
				winDialog.alert($SYSMSG[err["code"]]);
			}
		};
		
		gr.show();
	},
	
	/**
	 * 恶意举报
	 */
	showBad:function(){
		var me=this;
		if(!this.isBRInit){
			this.badReport=winDialog.createCustomsDialog({
				tpl:scope.reportMainTpl,
				content:scope.reportBadTpl
			});
			
			Core.Events.addEvent(this.badReport.nodes["btnOk"],function(){
				me.badReport.hidden();
				try{
					msg_report_callback(1);
				}catch(e){}
			},"click");
		}
		this.badReport.setAreaLocked(true);
		this.badReport.setMiddle();
		this.badReport.show();
	},
	
	/**
	 * 举报成功
	 */
	reportSuccess:function(nickName,bodyID,dataID){
		var me=this,
			sr=this.successedReport;

		sr.bodyID=bodyID;
		sr.dataID=dataID;
		sr.userInfo.nickName=nickName;
		
		sr.onSuccessed=function(data){
			me.finished();
			this.hidden();
			try{
					msg_report_callback(0);
				}catch(e){}
		};
		sr.onError=function(err){
			winDialog.alert($SYSMSG[err["code"]]);
		};
		
		sr.show();
	},
	
	/**
	 * 举报结束
	 */
	finished:function(){
		var me=this;
		if(!this.isFRInit){
			this.finishedReport=winDialog.createCustomsDialog({
				tpl:scope.reportMainTpl,
				content:scope.reportFinishedTpl
			});
			
			Core.Events.addEvent(this.finishedReport.nodes["btnCancel"],function(){
				me.finishedReport.hidden();
			},"click");
		}
		this.finishedReport.setAreaLocked(true);
		this.finishedReport.setMiddle();
		this.finishedReport.show();
	}
};