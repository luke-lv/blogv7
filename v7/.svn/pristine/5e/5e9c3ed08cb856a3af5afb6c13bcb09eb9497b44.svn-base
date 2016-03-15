/**
 * @fileoverview 好友页面 没有数据时 准备添加关注功能
 * @author wujian wujian@staff.sina.com.cn
 * @create 2011-1-10 
 */
$import("sina/sina.js");
$registJob("addFrd",function(){
	/**
	 * uid 列表 添加关注用
	 */
	scope.uidList=[];
	
	/**
	 * 初始化
	 */
	function init(){
		var list=$T($E("addList"),"li");
		for (var i=0,len=list.length; i<len; i++) {
			var a=$T(list[i],"a")[0];
			Core.Events.addEvent(a,function(){
				this.className=this.className=="xz"?"wxz":"xz";		
				return false;						
			},"click");
			a=null;		
		}
	}
	
	/**
	 * 绑定 添加关注事件
	 */
	function bindAddEvent(){
		Core.Events.addEvent($E("follow"),function(){
			
			var list=$T($E("addList"),"li");			
			for (var i=0,len=list.length; i<len; i++) {
				var a=$T(list[i],"a")[0];
				var uid=a.getAttribute("uid");
				if(uid&&a.className=="xz"){					
					scope.uidList.push(uid);
				}
				a=null;uid=null;
				//trace(scope.uidList);
			}	
			
			//调用接口添加关注
			follow();
			return false;
													
		},"click");
		
	}
	
	function follow(){
		var nextPhp = "http://control.blog.sina.com.cn/riaapi/reg/attention_add_batch.php";
		(new Interface(nextPhp, "jsload")).request({
			GET : {
				uid : scope.$uid,
				aids : scope.uidList.join(","),
				version : 7
			},
			onSuccess : function(res){
				$E("addList").parentNode.style.display="none";
				scope.getFilmList(1,1,"no");
			},
			onError : function(res){
				winDialog.alert($SYSMSG[res.code], {
					funcOk : function(){
						
					}
				});
			}
		});
	}
	
	
	init();
	bindAddEvent();
});




