/**
 * @fileoverview 影视博客app 页签右边搜索 简单效果而已 不当真
 * @author wujian wujian@staff.sina.com.cn
 * @create 2010-12-27
 */
$registJob("search", function(){
	//简单的交互效果
	var defaultWord="电影名、电视剧名",domID="";
	var input=$E("searchInput"),searchBtn=$E("searchBtn"),form=$E("searchForm");
	
	//
	
	function init(){
		//绑定事件	输入框focus 、搜索btn click		
		Core.Events.addEvent(input, function (){
			onFocus();
		},'focus');
		Core.Events.addEvent(input, function (){
			onFocus();
		},'click');
		
		Core.Events.addEvent(input, function (){
			onBlur();
		},'blur');
		
		Core.Events.addEvent(searchBtn, function (){
			submit();
		},'click');
		if(input.value==""){
			input.value=defaultWord;
		}
	}
	
	
	function onFocus(){//focus 删除默认值
		if(input.value==defaultWord){
			input.value="";
		}
	}
	
	function onBlur(){//失去焦点 重置为默认值
		if(input.value==""){
			input.value=defaultWord;
		}
	}	
	
	function submit(){//提交验证
		var v=input.value;
		if(v==defaultWord || v==""){//未输入 或者 是默认值
			winDialog.alert("请输入要搜索的影视剧名称", {
       			 icon: "01"//ico  "01":叹号；"02":错误；"03":正确；"04":问号；
       			 ,funcOk:function(){
				 	input.focus();
				 }
    		});
			
			return false;
		}
		setTimeout(function(){
			form.submit();
		},10);
		
	}
	
	init();	
});