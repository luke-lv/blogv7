$import("sina/core/events/addEvent.js");
$import("sina/core/dom/getElementsByClass.js");
$import("lib/dialogConfig.js");

$import("printPhoto/domToxml.js");



Core.Events.addEvent("clearAll",function(){
			var len = $E("chyPicCon").childNodes.length;
			var blankLen=Core.Dom.byClz($E("chyPicCon"),"li","pic_blank").length;
			//trace("len-blankLen=="+(len-blankLen));
			if(len-blankLen>0){
				winDialog.confirm("您确定要清空已经选择的图片", {
					    icon:"04",
						funcOk: function(){
							//var b=a;
							setTimeout(function(){
								window.clearAll();	
							},10);
					      	  						
				  		  }
					});				
			}
			return false;
			
		},"click");
	/**
		 * 清空所有 冲印篮
		 */
		window.clearAll=function(){
			var child = $E("chyPicCon").childNodes;				
			var id="";
			for (var i in window.state.chyObj) {					
				id=i.split("_")[1];				
				window.delEle(id);				
			}
			//$E("chyPicCon").innerHTML="";
			window.state.picNum=0;
			window.state.chyObj={};
			window.countPay();
		};
		Core.Events.addEvent("selectAll",function(){
			window.selectAll();return false;
		},"click");
		Core.Events.addEvent("printNow",function(){
			//trace("冲印 提交 照片");
			var child = $E("chyPicCon").childNodes;	
			var blankLen=Core.Dom.byClz($E("chyPicCon"),"li","pic_blank").length;		
			if(child.length-blankLen==0){
				winDialog.alert("您尚未选择图片", {
					icon: "01",
					funcOk: function(){}
				});
				return false;
			}else{
				winDialog.confirm("立即提交已经选择的图片去冲印？", {
					    icon:"04",
						funcOk: function(){
							//var b=a;
							//setTimeout(function(){
								submitXMl();
							//},10);
					      	 							
				  		  }
					});	
			}
						
		},"click");
		/**
		 * 发送 xml
		 */
		submitXMl=function(){						
			if(window.state.request=="loading"){
					winDialog.alert("系统正在判断照片宽高是否符合冲印要求，请稍后再提交", {
						icon: "01",
						funcOk: function(){}
				});
			}else{
				scope.domToXml();
				//Core.Events.addEvent("recoverNode",a.confirmRecovery,"click");
			}
			
		};
		
	window.selectAll=function(){			
				var childAll = $E("albumPicCon").childNodes;
				var childSe=Core.Dom.byClz($E("albumPicCon"),"span","ok_pic_ico");
				var chLen=childAll.length-childSe.length;
				//trace("len"+ child .length);
				var id="";
				var Max=scope.cfg.max;
				var max=Max-window.state.picNum;
				var len=max>chLen?chLen:max;
				var count=0;
				//trace("len=="+len)
				if(childAll.length==0){
					//专辑为空
					return false;
				}
				if (max==0) {
					winDialog.alert('冲印篮已满，一次最多可选择100张照片，请点击"立即冲印"后再试。', {
						icon: "01",
						funcOk: function(){
					
						}
					});
					return false;
				}
				if(chLen==0){
					winDialog.alert('已将本页照片添加到冲印篮中，无须重复添加', {
						icon: "01",
						funcOk: function(){
					
						}
					});
					return false;
				}
				if (chLen>max) {
					winDialog.alert('冲印篮已满，部分图片无法被添加，请点击"立即冲印"后再试', {
						icon: "01",
						funcOk: function(){
					
						}
					});
				}
				
				
			trace("selectAll=="+chLen);
				for (var i = 0; i < childAll.length; i++) {
					
					
					if(count>=len||window.state.picNum>Max){
							break;
						}	
					//trace("count1=="+count+"|len1=="+len+"|max=="+Max+"|a.data.picNum=="+a.data.picNum);					
					//id=$T(child[i], "div")[0].id.split("_")[1];
					//alert(childSe[i].className);
					id=$T(childAll[i], "div")[0].id.split("_")[1];
					//id=childSe[i].parentNode.id.split("_")[1];
					if(!window.state.chyObj["pic_"+id]){
						trace("select all addpic id"+id);
						window.addPic(id);
						count++;						
					}					
				}
				
			
		};