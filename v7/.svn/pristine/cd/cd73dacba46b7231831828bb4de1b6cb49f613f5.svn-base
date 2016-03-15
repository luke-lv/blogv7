/**
 * @fileoverview 发布博文页自动绑定微博
 * @author yifei2 yifei2@staff.sina.com.cn
 * @create 2012-08-31
 */
$import("sina/utils/io/ajax.js");
$import("sina/ui/panel.js");
$import("sina/core/dom/insertHTML.js");
$import("sina/core/dom/removeNode.js");
$import("sina/core/events/addEvent.js");

$registJob("bindWeibo_auto",function(){

	var url = "http://control.blog.sina.com.cn/t_sina_blog/bind_weibo_auto.php";
	var nowDate = new Date();
	var deadline = new Date("2012/12/07");
	var __addEvent = Core.Events.addEvent;
	var myPanel;

	
	Utils.Io.Ajax.request(url, {
		returnType : 'json',
		onComplete : function(data){
			if(data.code === "A00006"){
				console.log("bindweibo success");
				// if(Date.parse(nowDate) < Date.parse(deadline)){
				// 	var bindtot = $E("bindtot");
				// 	if(bindtot){
				// 		var cancelBind = '<input type="checkbox" checked="checked" value="" disabled="disabled" name="" id="input3">'
				// 						+ '<label title="取消微博绑定" id="tlabel" for="input3">同步到新浪微博</label>';
				// 		Core.Dom.insertHTML(bindtot.parentNode, cancelBind, "BeforeEnd");
				// 		Core.Dom.removeNode(bindtot);
				// 	}
				// 	renderPanel();
				// }
			}
			// else{
			// 	var tlabel = $E("tlabel");
			// 	if(tlabel && Date.parse(nowDate) < Date.parse(deadline)){
			// 		//renderPanel();
			// 		renderDiv();
			// 	}
			// }
		},
		onException: function(){}
	});
	
	function renderDiv(){
		var div = $C("div");
		div.setAttribute("id", "bindPanelDiv");
		div.setAttribute("class", "tb_layer_Y");
		div.setAttribute("style", "position: relative; cursor: pointer; width: 300px; line-height: 20px; top: -85px; left: 187px;");

		var inner = '<div class="tb_layer_Y_main tip_layer_main"><div class="tip_ps tip_miniblog"><a id="closeBindPanel" href="javascript:void(0);" class="tb_friend_inputDel" title="关闭"></a><p><strong>绑定微博成功：</strong></p><p id="bindPanel">您的博文将同步到微博，如需更改设置请<a href="javascript:void(0);"> 点击这里 </a></p></div></div><div style="margin-left: 20px;" class="tb_layer_arrow tip_arrow"></div>';
		div.innerHTML = inner;

		$E("tlabel").parentNode.appendChild(div);

		Core.Events.addEvent($E("bindPanel"),function(){
			$E("bindPanelDiv").style.display = "none";
			window.open("http://control.blog.sina.com.cn/blogprofile/bind_t_sina_blog.php");
		});
		Core.Events.addEvent($E("closeBindPanel"),function(){
			$E("bindPanelDiv").style.display = "none";
		});
	}


	//resize
	//__addEvent(window,updateLayerPos,"resize");

	function updateLayerPos(){
		var pos = Core.Dom.getXY($E("tlabel"));
		myPanel.entity.style.left = pos[0] + "px";
		if($IE){
			myPanel.entity.style.top = (pos[1] - 50) + "px";
		}else{
			myPanel.entity.style.top = (pos[1] - 55) + "px";
		}

	}

	function renderPanel(){
			myPanel = new Ui.Panel(),
			uniqueID = myPanel.uniqueID,
			template='<div id="bindPanelDiv" class="tb_layer_Y" style="cursor:pointer;">'
		+ '<div class="tb_layer_Y_main tip_layer_main">'
		+ '<div class="tip_ps tip_miniblog">'
		+ '<a id="closeBindPanel" href="javascript:void(0);" class="tb_friend_inputDel" title="关闭"></a>'
		+ '<p><strong>绑定微博成功：</strong></p>'
		+ '<p id="bindPanel">您的博文将同步到微博，如需更改设置请<a href="javascript:void(0);"> 点击这里 </a></p>'
		+ '</div>'
		+ '</div>'
		+ '<div class="tb_layer_arrow tip_arrow"></div>'
		+ '</div>';
		myPanel.setTemplate('<div id="#{panel}">'+template+'</div>');
		
		var posx = Core.Dom.getXY($E("tlabel"))[0];
		var posy = Core.Dom.getXY($E("tlabel"))[1];

		myPanel.entity.style.position = "absolute";
		myPanel.entity.style.left = posx + "px";
		if($IE){
			myPanel.entity.style.top = (posy - 50) + "px";
		}else{
			myPanel.entity.style.top = (posy - 55) + "px";
		}
		myPanel.entity.children[0].style.width = "300px";
		myPanel.entity.children[0].children[1].style.marginLeft = "20px";

		myPanel.entity.style.display = "block";
		

		Core.Events.addEvent($E("bindPanel"),function(){
			$E("_"+uniqueID+"_panel").style.display = "none";
			window.open("http://control.blog.sina.com.cn/blogprofile/bind_t_sina_blog.php");
		});
		Core.Events.addEvent($E("closeBindPanel"),function(){
			$E("_"+uniqueID+"_panel").style.display = "none";
		});
	}

	
	
	
});
 