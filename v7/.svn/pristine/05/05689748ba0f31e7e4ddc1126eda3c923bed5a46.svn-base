/** 
 * @fileoverview 打印图片 页面 使用
 * @author wujian | wujian@sina.staff.com.cn
 * 2010-8-27
 * 修改于2010-10-21 以前写的有点乱
 */
$import("lib/jobs.js");
$import("sina/sina.js");

$import("sina/utils/io/jsload.js");


$import("lib/interface.js");

$import("sina/ui/pagination.js");
$import("sina/ui/tween.js");
$import("sina/ui/dialog/layer.js");
$import("sina/ui/dialog/backShadow.js");
//$import("sina/utils/io/ajax.js");

$import("sina/core/dom/next.js");
$import("sina/core/dom/getLeft.js");
$import("sina/core/dom/getTop.js");
$import("sina/core/dom/getElementsByClass.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/getEvent.js");
$import("sina/core/events/removeEvent.js");
$import("sina/core/events/fixEvent.js");

$import("sina/core/math/getUniqueId.js");

$import("sina/core/system/winSize.js");
$import("sina/core/system/getParam.js");

$import("lib/dialogConfig.js");
$import("lib/panel.js");
$import("lib/login/ui.js");
$import("lib/checkAuthor.js");


$import("printPhoto/template.js");


$import("printPhoto/showAlbumPic.js");
$import("printPhoto/addAnddelPic.js");
$import("printPhoto/bindEvent.js");
$import("printPhoto/getPicWidthHeight.js");
$import("printPhoto/delTip.js");
$import("printPhoto/sizeTips.js");

$registJob('printPhoto',function(){ 
		
		
		
					
		/**
		 * 初始化8个 空的框
		 */	
		function init_blank(){			
			var faCon=$E("chyPicCon");
			var ele=null;var picStr=null;
			for(var i=0;i<9;i++){
				ele=$C("li");	
				ele.className="pic_blank";			
				ele.innerHTML=PicTemplate.blank;
				faCon.appendChild(ele);
			}	
			ele=null;faCon=null;							
				//a.updateScroll();
				//a.moveScroll();						
		}
			
		/**
		 * 根据url 参数初始化页面执行
		 */
		function urlParam_init(){
			window.ctg_id=Core.System.getParam("ctg_id");//专辑id
			window.pic_id=Core.System.getParam("pic_id");	// 图片id		
			window.re=Core.System.getParam("re");
			if(pic_id){
			//传入 图片id
				scope.listData.request(
				{
					GET : {
						"uid":scope.$uid,
						"pic_id":pic_id								
					},
					onSuccess : function (data) {					
						window.getAlbumPicOk(data);					
						if(ctg_id){
							//传入专辑id
							//	trace("d.request  ok showAlbumPic== "+a.data.urlAlbumId);								
							window.showAlbumPic(ctg_id);
							//a.data.urlAlbumId=null;
						}
				
					},
					onError : function (data) {
					},
					onFail : function (){
					}
				});
			//window.addPic(a.data.urlPicId);			
			}
			
			if(ctg_id&&!pic_id){
					//传入专辑id
				window.showAlbumPic(ctg_id);
			} 
		}
		function init(){
			init_blank();
			urlParam_init();
			//window.bindEvent();
			setTimeout(function(){
	if(Lib.LocalDB.isFlashReady){
		DB.getFlashCookie();
	}else{
		Lib.LocalDB.registerFun(DB.getFlashCookie);
		trace("rrrrrrrrrrrr")
	}
},10)
		}
		
		
		//以下是公用函数
		/*a.data={};
		a.data.picNum=0;
		a.data.chyObj={};
		///a.data.album={};
		a.data.picObj={};
		a.data.currPage=1;
		//a.data.max=100;
		a.data.albumId=null;
		a.data.picWHObj=[];
		a.data.jsLoad=null;
		a.data.loginWin=null;
		//a.data.WHInterFaceErrorCount=3;//宽高接口失败三次 则不在重复尝试调用
		a.data.WHCache={};*/
		/**
		 * 在右侧显示 专辑中的图片
		 * @param {Object} albumId 专辑标识
		 */		
		 window.focusThis=function(){
			var ev=Core.Events.getEvent();
			ev=Core.Events.fixEvent(ev);
			var _this=ev.target;			
			if(_this){
				_this.blur();
				//trace("点击事件！！！");
				var pic_list=_this.parentNode.parentNode.parentNode.childNodes;
				_this.parentNode.parentNode.className="cur";
				for(var i=0,len=pic_list.length;i<len;i++){
					if(_this.parentNode.parentNode!=pic_list[i]){
						pic_list[i].className="";
					}				
				}
			}			
		};				
		/**
		 * 显示分页
		 * @param {Object} curr 当前页面
		 * @param {Object} all	总页数
		 */
		window.showPage=function(curr,all){
			Ui.Pagination.init({
				"pageNode" : "pageNode",
				"curPage" : curr,							// 用于写入分页的节点,class="XX_page"的div
				"maxPage" : all ,	
				"viewSize": 4,
				"nodeClassNamePrefix" :"SG",									// 最大页码数
				"pageTpl" : "javascript:showAlbumPic(window.state.albumId,@page@);void(0);",
				"showPrevNext"	: true,
				"type" : 1
			}).show();			
		};		
		
		
		


		init();
		window.updateScroll();
});


