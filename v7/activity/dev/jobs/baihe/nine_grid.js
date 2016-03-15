$import("comps/baihe/addNotes.js");
$import("comps/baihe/slideFaces.js");
$import("comps/msgTips.js");
$import("comps/baihe/luckyTimes.js");

$import("lib/dialogConfig.js");
$import("lib/interface.js");
$import("sina/core/string/trim.js");
$import("sina/core/string/byteLength.js");


$registJob("nineGrid", function(){
	
	var temp = {};
	var form = document.forms[0];
	var parent = $E("slideparent");
	var leftArrow = $E("larrow");
	var rightArrow = $E("rarrow");
	var pic = $E("faces").getElementsByTagName("ul");	//头像列表
	var faces = $E("faces").getElementsByTagName("img");	//每一个头像
	
	var talkLittleMore = $E("blog_txt");
	var titleLimit = 50;
	
	var arr = $E("grid").getElementsByTagName("li");
	
	var inputArr = $E("grid").getElementsByTagName("input");
	var preview = $E("grid_preview");
	var title = $E("diary_title");
	var noteNum = 0;
	var __inProgress = false;
	var __defaultTxt = "再写点其它的";
	
	var unitWidth = parseInt(Core.Dom.getStyle(pic[0], "width"), 10) + parseInt(Core.Dom.getStyle(pic[0], "marginLeft"), 10);
	trace("dcw  "+unitWidth);
	
	new Baihe.slideFaces({
		parent:	parent,
		leftArrow: leftArrow,
		rightArrow: rightArrow,
		pic: pic,
		faces: faces,
		disPlayWidth: unitWidth,
		disPlayNum: 1
	});
	
	var grids = new Baihe.addNotes({
		inputArr: inputArr,
		arr: arr,
		faces: faces
	});
		
	Core.Events.addEvent(talkLittleMore, function(){
		if(talkLittleMore.value == __defaultTxt){
			talkLittleMore.value = "";
		}
	}, "focus");
	
	Core.Events.addEvent(talkLittleMore, function(){
		if(Core.String.trim(talkLittleMore.value) == ""){
			talkLittleMore.value = __defaultTxt;
		}
	}, "blur");
	
	Core.Events.addEvent($E("grid_post"), function(){
		if(Baihe.userChangeDetected()) return;			// 登录组件已引本类
		if(Core.String.byteLength(title.value)>titleLimit){
			grids.toNullInput(title, function(){
				new Comps.msgTips("呃 #-_-，标题限制 50 个字符", title);
			}, true);
			return;
		}
		if(__inProgress) return;
		__inProgress = true;
		
		temp = {};
		for (var i=0; i<inputArr.length; i++){
			var name = inputArr[i].getAttribute("paramid");
			
			s = Core.String.trim(inputArr[i].value);
			
			if (s){
				inputArr[i].setAttribute("nullInput", "0");
				temp[name] = s;
				noteNum++;
				trace(noteNum);	
			}else{
				inputArr[i].setAttribute("nullInput", "1");
			}
			
		}
		if(noteNum < 3){
			for (var i=0; i<inputArr.length; i++){
				if (+inputArr[i].getAttribute("nullInput")){
					grids.toNullInput(inputArr[i], function(){
						new Comps.msgTips("至少填三格才能发表日志", inputArr[i]);
					});
					__inProgress = false;
					noteNum = 0;
					form.innerHTML = "";
					return;
				}
			}
		}
		for (var i=0; i<faces.length; i++){
			if (+faces[i].getAttribute("imgover")){
				var __face = faces[i].getAttribute("name");
				break;
			}
		}
		temp.tmp_num = $E("nine_g_sk09").className.split(" ")[1].slice(-1);
		temp.blog_txt = (talkLittleMore.value==__defaultTxt) ? "" : talkLittleMore.value;
		temp.face = __face || 1;
		temp.title = title.value;
		
		new Interface("http://control.blog.sina.com.cn/baihe/process.php", "ijax").request({
			POST: temp,
			onSuccess:function(res){
				// updateLuckyTimes();
				winDialog.alert("发布成功！", {
					textOk:		"去博客看看",
					icon:		"03",
					funcOk:		function(){
						window.location.href = res;
					},
					funcClose:	function(){
						window.location.href = res;
					}
				});
				__inProgress = false;
			},
			onError:function(res){
				if (res.code == "A20005"){
					winDialog.alert(res.data, {
						funcOk:		function(){
							window.location.href = "http://control.blog.sina.com.cn/baihe/lottery.php";
						},
						funcClose: function(){
							window.location.href = "http://control.blog.sina.com.cn/baihe/lottery.php";
						}
					});
				}else if(res.code == "A80005"){
					winDialog.alert(res.data);
				}
				__inProgress = false;
			},
			onFail:function(){
				__inProgress = false;
			}
		});
	}, "click");
	
	Core.Events.addEvent(preview, function(){
		if(Baihe.userChangeDetected()) return;			// 登录组件已引本类
		if(Core.String.byteLength(title.value)>titleLimit){
			grids.toNullInput(title, function(){
				new Comps.msgTips("#-_- 呃，标题限制 50 个字符", title);
			}, true);
			return;
		}
		if(__inProgress) return;
		__inProgress = true;
		
		for (var i=0; i<inputArr.length; i++){
			var name = inputArr[i].getAttribute("paramid");
			s = Core.String.trim(inputArr[i].value);
			if (s){
				inputArr[i].setAttribute("nullInput", "0");
				temp[name] = s;
				noteNum++;
			}else{
				inputArr[i].setAttribute("nullInput", "1");
			}
			form.appendChild(getInputParam(name, s));
		}
		if(noteNum < 3){
			for (var i=0; i<inputArr.length; i++){
				if (+inputArr[i].getAttribute("nullInput")){
					grids.toNullInput(inputArr[i], function(){
						new Comps.msgTips("至少填三格才能发表日志", inputArr[i]);
					});
					__inProgress = false;
					noteNum = 0;
					form.innerHTML = "";
					return;
				}
			}
		}
		for (var i=0; i<faces.length; i++){
			if (+faces[i].getAttribute("imgover")){
				var __face = faces[i].getAttribute("name");
				break;
			}
		}
		form.appendChild(getInputParam("tmp_num", $E("nine_g_sk09").className.split(" ")[1].slice(-1)));
		form.appendChild(getInputParam("blog_txt", (talkLittleMore.value==__defaultTxt) ? "" : talkLittleMore.value));
		form.appendChild(getInputParam("face", __face || 1));	// 默认 1
		form.appendChild(getInputParam("title", title.value));
		form.appendChild(getInputParam("preview", 1));
		form.submit();
		
		__inProgress = false;
	}, "click");
	
	function getInputParam(name, val){
		var __input = $C("input");
		__input.setAttribute("type", "hidden");
		__input.setAttribute("name", name);
		__input.setAttribute("value", val);
		return __input;
	}
	
	function updateLuckyTimes(){
		new Interface("http://control.blog.sina.com.cn/baihe/interface.php?action=get_lot_num1", "ijax").request({
			GET:{
				t:	new Date().getTime()
			},
			onSuccess:function(res){
				Baihe.luckyTimes.init().update(res);
			}
		});
	}
});



