/**
 * @fileoverview "安装游戏组件"提示
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2010-07-21
 */

$import("sina/sina.js");
$import("sina/core/dom/getLeft.js");
$import("sina/core/dom/getTop.js");
$import("sina/utils/io/jsload.js");

$import("lib/jobs.js");
$import("lib/panel.js");

$registJob("gameTip", function(){
	//判断是否已经安装了游戏组件
	var k,
		str="",
		isShow=false;
		
	for(k in scope.component_lists){
		if(scope.component_lists[k].size==210){
			str+=scope.component_lists[k].list.join(",")+",";
		}
	}
	if(str.indexOf("81")!=-1){
		return;
	}
	
	
	var tip=new Lib.Panel(),
		node=$E("blogtopoption").getElementsByTagName("a")[1],
		isSubmiting=false,
		
		//请求组件克隆接口
		installGameComp=function(){
			if (!isSubmiting) {
				isSubmiting=true;
				Utils.Io.JsLoad.request("http://control.blog.sina.com.cn/riaapi/conf/module_clone.php?productid=0x00000001&uid=1259295385&moduleid=81&cwidth=21&version=7", {
					onComplete: function(){
						location.reload();
					},
					onException:function(){
						isSubmiting=false;
					}
				});
			}
		},
		tipNodes,
		tpl=['<div id="#{panel}" class="tb_layer_Y tb_layer_w5">',
					'<div class="tb_layer_Y_main tip_layer_main">',
						'<div style="display: inline-block;">',
							'<div style="text-align: left; display: inline-block; float: right;width:150px;*padding-left:2px" class="tip_ps">',
								'<a id="#{btnClose}" title="删除" class="tb_friend_inputDel" href="#" onclick="return false"></a>',
								'<a style="color: red;margin-right:5px" id="#{installGameComp1}" href="#" onclick="return false">安装组件</a>玩玩小游戏<br>轻松一下   一起体验休闲乐趣',
							'</div>',
							'<a id="#{installGameComp2}" style="float: left; padding-left: 10px; padding-top: 2px;" title="点击添加组件" href="#" onclick="return false">',
								'<img width="40" src="http://simg.sinajs.cn/blog7style/images/common/gameTip.png">',
							'</a>',
						'</div>',
					'</div>',
					'<div class="tb_layer_arrow tip_arrow"></div>',
				'</div>'].join("");
	
	
	tip.setTemplate(tpl);
	tipNodes=tip.getNodes();
	tip.entity.style.zIndex="512";
	tip.show();
	tip.setPosition(Core.Dom.getLeft(node)-Math.abs(tip.entity.offsetWidth-node.offsetWidth)/2,
					Core.Dom.getTop(node)-tip.entity.offsetHeight);
	
	
	Core.Events.addEvent(tipNodes.btnClose,function(){
		tip.close();
	});
	
	Core.Events.addEvent(tipNodes.installGameComp1,function(){
		installGameComp();
	});
	
	Core.Events.addEvent(tipNodes.installGameComp2,function(){
		installGameComp();
	});
});