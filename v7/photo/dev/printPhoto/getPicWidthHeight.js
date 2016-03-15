$import("lib/dialogConfig.js");
/**
		 * 调用接口 查询图片宽高数据
		 * @param {Object} arr 图片id数组
		 */
		window.getWH=function(arr){
			if(scope.noWHArr.length==0){
				return;
			}
			//trace("c.request 2");
			window.state.request="loading";
			scope.picWHData.request(
			{
				GET : {
					uid:scope.$uid,
					pic_ids:scope.noWHArr.join(",")													
			},
			onSuccess : function (data) {
			
				window.getWHOK(data);
				
			},
			onError : function (data) {
				if(data.code=="A00001")
				{
					trace("系统繁忙，再试");
					var b=a;
					scope.cfg.repeat--;
					if(scope.cfg.repeat>0){
						setTimeout(function(){
							window.getWH();
						},10000);
					}else{
						window.state.request="ok";
					}
					
					
				}
				trace("调用宽高 数据接口 异常");
				
			},
			onFail : function (){
				trace("调用宽高 数据接口 异常");
				var b=a;
					scope.cfg.repeatt--;
					if(scope.cfg.repeat>0){
						setTimeout(function(){
							window.getWH();
						},10000);
					}else{
						window.state.request="ok";
					}
				}			
			});
		//arr.length=0;
		};
		window.getWHOK=function(data){
			if(data){
				window.state.request="ok";
				scope.noWHArr.length=0;
				//trace("c.request 2 ok ！！！");
			}		
			var arr=data;
			var len=arr.length;
			var id;
			var ele;//<span class="indefin_pic_ico" onmouseover="showTip()" onmouseout="hideTip()"></span>
			for(var i=0;i<len;i++){
				id=arr[i].pic_id;
				if(window.state.picCache["pic_"+id]){
					window.state.picCache["pic_"+id].w=arr[i].w;
					window.state.picCache["pic_"+id].h=arr[i].h;
					if(!arr[i].w){
						trace("！！！宽高接口调用失败！！！");
					}
				}/*else{
					a.data.picObj["pic_"+id]={
						"id":id,
						"w":arr[i].w,
						"h":arr[i].h,
						"middle":"kkk"
						
					}
				}*/				
				if(arr[i].w*arr[i].h<800*600){
					if($E("pic_"+id)){
						ele=$C("span");
						ele.className="indefin_pic_ico";
						ele.onmouseover=window.showTip;
						ele.onmouseout=window.hideTip;
						$E("pic_"+id).appendChild(ele);
					}
					if($E("del_"+id)){
						trace("存在 del——"+id);
						ele=$C("span");
						ele.className="indefin_pic_ico";
						ele.onmouseover=window.showTip;
						ele.onmouseout=window.hideTip;
						$E("del_"+id).appendChild(ele);
					}
				}				
			}
		};