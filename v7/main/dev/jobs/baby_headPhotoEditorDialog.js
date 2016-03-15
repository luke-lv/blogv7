/**
 * @fileoverview 相框照片Flash编辑器
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2010-08-13
 */

$import("sina/sina.js");
$import("sina/core/events/addEvent.js");

$import("lib/checkAuthor.js");
$import("lib/jobs.js");
$import("lib/dialogConfig.js");
$import("lib/ticket.js");
$import("lib/component/flashComponent/headPhotoEditorConfig.js");

$import("baby/flashComponent/headPhotoEditorDialog.js");
$import("jobs/baby_headPhoto.js");
$import("msg/babyHeadPhotoEditor.js");

$registJob("baby_headPhotoEditorDialog", function() {
	$callJob("baby_headPhoto");
	
	var hp=scope.headPhoto,
		hped=new scope.flashComponent.HeadPhotoEditorDialog(scope.tpl),
		btnHPEDialog=$E("btnHPEDialog"),
		data,
		cfg=Lib.flashComponent.HeadPhotoEditorConfig["t"+scope.tpl] || Lib.flashComponent.HeadPhotoEditorConfig["t3_34"],
		getParamObj=function(param){
			if(param.indexOf("&")==-1){
				return null;
			}
			
			var arr=param.split("&"),
				paramObj={};
				
			for(var i=0,l=arr.length;i<l;i++){
				if(arr[i].indexOf("=")==-1){
					return null;
				}
				
				var ps=arr[i].split("="),
					k=ps[0],
					v=ps[1];

				paramObj[k]=v;
			}
			
			return paramObj;
		},
		setHeadPhotoParam=function(paramObj){

			if(!paramObj){
				return;
			}

			//使用的是图片服务器的URL Key
			paramObj.photoURL.length>0 && paramObj.photoURL!=cfg.defaultPhoto && (paramObj.photoURL=getPhotoURLByKey(paramObj.photoURL));
			paramObj.photoURL.length>0 && scope.headPhoto.getPhotoURL()!=paramObj.photoURL && paramObj.photoURL!=cfg.defaultPhoto && scope.headPhoto.setPhotoURL(paramObj.photoURL);
			scope.headPhoto.setPhotoZoom(paramObj.zoom);
			scope.headPhoto.setPhotoAngle(paramObj.angle);
			scope.headPhoto.setPhotoPosition(paramObj.photoX, paramObj.photoY);
			
			if(scope.UserBabyPic){
				scope.UserBabyPic.photoURL=paramObj.photoURL;
				scope.UserBabyPic.angle=paramObj.angle;
				scope.UserBabyPic.zoom=paramObj.zoom;
				scope.UserBabyPic.photoX=paramObj.photoX;
				scope.UserBabyPic.photoY=paramObj.photoY;
			}
		};
	
	if (btnHPEDialog) {
		Core.Events.addEvent(btnHPEDialog, function(){
			hped.show();
//			scope.babyHeadPhotoEditor.setPhotoParam(scope.UserBabyPic.angle,
//								scope.UserBabyPic.zoom,
//								scope.UserBabyPic.photoX,
//								scope.UserBabyPic.photoY);

			
			
		});
		
		hped.onShow=function(){
			initTicket();
			
			//图片保存到图片服务器操作完成
			scope.babyHeadPhotoEditor.onSendCompleted=function(dataStr){
				var savedData,
					url,
					code;
				try{
					eval("savedData="+dataStr);
					url=savedData.data.pics.pic_1 && savedData.data.pics.pic_1.pid;
					code=savedData.code;
				}catch(ex){}
				
				if (code == "A00006") {
					//保存图片信息
					scope.babyHeadPhotoEditor.setSavedPhotoURL(url);
					scope.babyHeadPhotoEditor.save();
				}else{
					//图片保存失败
					switch(savedData.data.pics.pic_1.ret){
						case -11:	
							winDialog.alert("图片格式异常，请重新上传");
							break;
						default:
							winDialog.alert("图片存储服务暂不可用!");								
					}
					initTicket();
				}
			};
				
			//保存图片信息
			scope.babyHeadPhotoEditor.onSaved = function(dataStr, params){
				try {
					eval("data=" + dataStr);
				}catch(ex){}
				
				if (typeof(data) != "object") {
					return;
				}

				if (data.code == "A00006") {
					try {
						setHeadPhotoParam(getParamObj(params));
						hped.hidden();
					}catch(ex){alert(ex.message)}
				}else {
					winDialog.alert($SYSMSG[data.code]);
				}
			};
		};
		
	}
	
	
	//页面设置的时候切换模板时的操作
	var _c=10;

	if(typeof(__pageSetVar)=="object" && __pageSetVar.tabs && __pageSetVar.tabs[0]){
		__pageSetVar.tabs[0].addEventListener("BGChanged",function(tpl){
			if(checkedBabyTpl(tpl)){
				scope.renderHeadPhoto(tpl);
				hped.tpl=tpl;
			}
		});
	}
	
	
	//初始化票据
	function initTicket(){
		Lib.Ticket.get(function(data){
			var c=10;
			(function setSendToURL(){
				if (scope.babyHeadPhotoEditor._flashEntity.setSendToURL) {
					scope.babyHeadPhotoEditor.setSendToURL("http://upload.photo.sina.com.cn/interface/pic_upload.php" +
						"?s=json" +
						"&ticket=" +
						data.ticket[0] +
						"&app=photo" +
						"&t=" +
						(new Date()).getTime());
				}else{
					--c > 0 && setTimeout(function(){
						setSendToURL.call();
					},200);
				}
			})();
		},1);
	}
	
	//根据图片服务器返回的图片key获取图片的真实地址
	function getPhotoURLByKey(key){
		var s = key.substr(-2),
			g = parseInt(s,16)%16+1;

		//return "http://static"+g+".photo.sina.com.cn/orignal/"+key;
		//Modified by W.Qiang ,pictures's domain ,2011-03-15
		return "http://s"+g+".sinaimg.cn/orignal/"+key;
	}
	
	//检测指定模板是否为育儿模板
	function checkedBabyTpl(tpl){
		var babyTpls=scope.babyTpl_conf || ["3_34","3_35","3_36","3_37"],
			ret=false;
		
		for(var i=0,l=babyTpls.length;i<l;i++){
			if(babyTpls[i]==tpl){
				ret=true;
				break;
			}
		}
		return ret;
	}
});