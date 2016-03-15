$import("lib/interface.js");
$import("lib/login/ui.js");

$import("sina/sina.js");
$import("sina/ui/pagination.js");

$import("sina/core/string/shorten.js");
$import("sina/core/array/foreach.js");
$import("sina/core/events/getEvent.js");
$import("sina/core/events/getEventTarget.js");
$import("sina/core/events/fireEvent.js");
$import("sina/core/string/trim.js");
$import("sina/core/dom/addHTML.js");

$import("comps/_comps.js");
$import("comps/5years/stylishDialog.js");

// 完了，func 过多，时间怎么就这么 di 少捏？

Comps.myFriends = function(oParam){
	
	var _box = oParam.box || document.body;
	var _activityName = oParam.activityName || "festival";			// 应可由外部定义
	var _paginalHeads = oParam.paginalHeads || 36;					// 每页几个脑袋
	var _callback = oParam.callback || function(){					// 回调
		Comps.stylishDialog.alert("你成功邀请了 "+_len+" 个好友！", {
			icon:"ok",
			funcOk:function(){
				init();
			},
			funcCls:function(){
				init();
			}
		});
	};
	
	var _curPage = 1;
	var _arrHeads = [];
	// var _initHeadArr = {};
	
	var TPL = {};
	var _nodes = [];
	var _selected = {};				// 已选
	var _released = {};				// 未选
	var _len = 0;					// 已选头头数
	var _heads = [];
	var _compInterface = "http://interface.blog.sina.com.cn/blog_5years/interface.php";
	
	var _isProcessing = false;		// 是否正在处理
	
	// 
	init();
	
	
	
	
	// 获取数据并初始化
	function init(){
		
		_heads = [];
		_selected = {};
		_released = {};
		_len = 0;
		
		Lib.checkAuthor();
		if($isLogin){
			new Interface(_compInterface, "jsload").request({
				GET:{
					action: "get_friend_list",
					activityName: _activityName
				},
				onSuccess:function(res){
					initAppend(res);
					initHover();
					initShowAll();
					initShowSelected();
					initSelectAll();
					initSendMsg();
					initPagin(_heads);
				},
				onError:function(res){
					_box.innerHTML = "";
					// Core.Dom.addHTML(_box, '<p>'+res.data.msg+'</p>');
				},
				onFail:function(){
					Comps.stylishDialog.alert("系统繁忙，请稍候再试");
				}
			});
			
		}
		else{
			var userLogin = new Lib.Login.Ui();
			userLogin.login(function(){
				window.location.reload();
			});
			// ifm 广告隐藏，禁止关闭
			userLogin.dialog.nodes.btnClose.style.display = "none";
			$E("login_ad").style.display = "none";
			
		}
		
	}
	
	
	// 节点上屏
	function initAppend(res){
		_nodes = Lib.getTemplateNodes(TPL.shell_nod);
		var i;
		var len = res.length || 0;
		var tStr = "";
		var nickname;
		
		if(len == 0){
			tStr = "暂无可邀请的好友";
		}else{
			for(i=0; i<len; i++){
				nickname = Core.String.shorten(res[i].user_name || res[i].uid+"", 6);
				tStr += Lib.formatTemplate(TPL.head_fmt, {
					headImg:	"http://portrait"+(res[i].uid%8+1)+".sinaimg.cn/"+res[i].uid+"/blog/50",
					link:		"javascript:void(0);",
					nick:		nickname,
					title:		res[i].user_name || res[i].uid,
					seq:		i,
					uid:		res[i].uid
				});
			}
		}
		_nodes.friends.innerHTML = tStr;
		_box.innerHTML = "";
		_box.appendChild(_nodes.entity);
	}
	
	
	// 点击 toggle、hover 头像
	function initHover(){
		var people = _nodes.friends;
		_heads = $T(people, "li");
		
		Core.Array.foreach(_heads, function(li, i){
			
			// 顺便初始化未选中列表
			_released[i] = 1;
			
			// 头像 hover
			li.onmouseover = function(){
				var evt = Core.Events.getEvent();
				var evtTarg = Core.Events.getEventTarget(evt);
				
				if(Lib.hasClass(this, "current")){
					//if(evtTarg.tagName.toUpperCase() !== "A")
					Lib.addClass(this, "curhover");
				}else{
					//if(evtTarg.tagName.toUpperCase() !== "A")
					Lib.addClass(this, "hover");
				}
			};
			li.onmouseout = function(){
				Lib.delClass(this, "curhover");
				Lib.delClass(this, "hover");
			};
			
			// 头像多选
			li.onclick = function(){
				var _this = this;
				var evt = Core.Events.getEvent();
				var evtTarg = Core.Events.getEventTarget(evt);
				//if(evtTarg.tagName.toUpperCase() !== "A"){
					if(Lib.hasClass(this, "current")){
						Lib.delClass(this, "curhover");
						Lib.delClass(this, "current");
						
						delete _selected[_this.getAttribute("seq")];
						_released[_this.getAttribute("seq")] = 1;
						_len--;
						
						_nodes.showSelectedTxt.innerHTML = "已选("+_len+")";
					}else{
						Lib.addClass(this, "curhover");
						Lib.addClass(this, "current");
						
						_selected[_this.getAttribute("seq")] = 1;
						delete _released[_this.getAttribute("seq")];
						_len++;
						
						_nodes.showSelectedTxt.innerHTML = "已选("+_len+")";
					}
					
					// 任何点击都要检测当前页是否全选
					var isAll = isSelectedAll();
					_nodes.selectAll.checked = isAll?true:false;
				//}
			};
		});
	}
	
	
	// 显示全部头像
	function initShowAll(){
		_nodes.showAll.onclick = function(){
			Lib.addClass(_nodes.showAll, "current");
			Lib.delClass(_nodes.showSelected, "current");
			
			// 董艳！
			Lib.addClass(_nodes.showAllTxt, "cur");
			Lib.delClass(_nodes.showSelectedTxt, "cur");
			_nodes.showSelectedTxt.innerHTML = "已选("+_len+")";
			
			// for(var key in _released){
			// 	_heads[key].style.display = "";
			// }
			
			// 重置
			for(var key in _selected){
				_heads[key].style.display = "none";
			}
			// 再显示
			showPageHeads(_curPage);
			
			initPagin(_heads);
			// 分组完后，要检测当前页是否全选
			var isAll = isSelectedAll();
			_nodes.selectAll.checked = isAll?true:false;
			
		};
	}
	
	
	// 显示已选，current
	function initShowSelected(){
		_nodes.showSelected.onclick = function(){
			var selectHeads = [];
			
			Lib.addClass(_nodes.showSelected, "current");
			Lib.delClass(_nodes.showAll, "current");
			
			// 董艳！help……
			Lib.addClass(_nodes.showSelectedTxt, "cur");
			Lib.delClass(_nodes.showAllTxt, "cur");
			_nodes.showSelectedTxt.innerHTML = "已选("+_len+")";
			
			// 原则是，先 none，再 block
			for(var key in _released){
				_heads[key].style.display = "none";
			}
			for(var key in _selected){
				_heads[key].style.display = "";
				
				// 获取新的 _heads
				selectHeads.push(_heads[key]);
			}
			
			initPagin(selectHeads);			// 还要用 selected 的元素来分组。
			
			// 分组完后，要检测当前页是否全选
			var isAll = isSelectedAll();
			_nodes.selectAll.checked = isAll?true:false;
		};
	}
	
	
	// 当前页全选 checkbox
	function initSelectAll(){
		_nodes.selectAll.onclick = function(){
			
			var curArr = _arrHeads[_curPage-1];
			var len = curArr.length;
			var i;
			
			if(this.checked){				// 把未选中的选中
				for(i=0; i<len; i++){
					if(!Lib.hasClass(curArr[i], "current")){
						Core.Events.fireEvent(curArr[i], "click");
						Core.Events.fireEvent(curArr[i], "mouseout");
					}
				}
				// for(var key in _released){
				// 	Core.Events.fireEvent(_heads[key], "click");
				// 	Core.Events.fireEvent(_heads[key], "mouseout");
				// }
				
			}else{							// 把选中的取消
				for(i=0; i<len; i++){
					if(Lib.hasClass(curArr[i], "current")){
						Core.Events.fireEvent(curArr[i], "click");
						Core.Events.fireEvent(curArr[i], "mouseout");
					}
				}
				// for(var key in _selected){
					// Core.Events.fireEvent(_heads[key], "click");
					// Core.Events.fireEvent(_heads[key], "mouseout");
				// }
			}
		};
	}
	
	
	// 发送邀请
	function initSendMsg(){
		
		Core.Events.addEvent(_nodes.inviteBtn, function(){
			if(_len < 1){
				Comps.stylishDialog.alert("你还没有选择好友", {}, "noHeads");
				return;
			}
			
			if(loading()) return;
			
			var ids = [];
			for(var key in _selected){
				ids.push(_heads[key].getAttribute("uid"));
			}
			new Interface(_compInterface, "jsload").request({
				GET:{
					action: "set_invite_user",
					data: ids.join(),
					master: scope.$uid,
					activityName: _activityName
				},
				onSuccess:function(res){
					_callback(res);
					// console.log("suc");
					loaded();
				},
				onError:function(res){
					// console.log("err");
					Comps.stylishDialog.alert(res.data.msg);
					loaded();
				},
				onFail:function(){
					Comps.stylishDialog.alert("系统繁忙，请稍候再试");
					loaded();
				}
			});
		}, "click");
		
		
		// if(loading()) return;
		var dgInst;
		var cont = "<div style='margin:20px 0 0 100px;'><img src='http://simg.sinajs.cn/blog7style/images/common/loading.gif' /> 加载中…请稍候</div>";
		function loading(){
			if(!_isProcessing){				// 非处理中，则允许处理。并标识。
				_isProcessing = true;
				dgInst = Comps.stylishDialog.loading(cont);
				return false;
			}
			return true;					// 否则阻止运行。
		}
		function loaded(){
			_isProcessing = false;
			dgInst.hidden();
		}
		
	}
	
	
	
	// 当前页是否被全选，点击任何人脑袋都要这样一下，贼傻逼了。一定要优化。
	function isSelectedAll(){
		var curArr = _arrHeads[_curPage-1];
		
		if(!curArr) return false;
		
		var len = curArr.length;
		var i;
		
		for(i=0; i<len; i++){
			if(!Lib.hasClass(curArr[i], "current")){		// 发现没有 current 的，说明当前页没有被全选
				return false;
			}
		}
		return true;
	}
	
	
	// 重新初始化分页，传入头像数组作为分组依据
	function initPagin(newHeads){
		var i, z;
		var tempHeads = [];
		var totalPage = Math.ceil(newHeads.length / _paginalHeads);
		_arrHeads = [];
		
		// 将所有头像按页分组
		for(z=0; z<totalPage; z++){
			tempHeads = [];
			for(i=0; i<_paginalHeads; i++){
				var tempElem = newHeads[z*_paginalHeads+i];
				if(tempElem){
					tempHeads.push(tempElem);
				}else{
					break;
				}
			}
			_arrHeads.push(tempHeads);
		}
		
		_curPage = 1;
		
		// 显示第一组
		// 除了第一页全隐藏
		for(i=0; i<_arrHeads.length; i++){
			for(z=0; z<_arrHeads[i].length; z++){
				_arrHeads[i][z].style.display = "none";
			}
		}
		showPageHeads(_curPage);
		
		Ui.Pagination.init({
			nodeClassNamePrefix:	"SG",
			pageNode:				_nodes.pagination.id,		// 用于写入分页的节点,class="XX_page"的div，操，必须是 id
			maxPage:				totalPage,					// 最大页码数
			curPage:				_curPage,
			type:					2,
			pageTpl:				function(nextPage){			// 跳转的页面规则
				showPageHeads(nextPage);
				hidePageHeads(_curPage);
				_curPage = nextPage;
				
				// 翻页要检测当前页是否全选
				var isAll = isSelectedAll();
				_nodes.selectAll.checked = isAll?true:false;
			}
		}).show();
		
	}
	
	
	// 显示指定页的所有头像
	function showPageHeads(page){
		var curArr = _arrHeads[page-1];			// 页数-1
		
		if(!curArr) return;
		
		var len = curArr.length;
		for(i=0; i<len; i++){
			var img = $T(curArr[i], "img")[0];
			var _src = img.getAttribute("_src");
			curArr[i].style.display = "";
			if(_src){
				img.setAttribute("src", _src);
				img.removeAttribute("_src");
			}
			
			// 性能是一样的。
			//if(!_initHeadArr[page]){
				// img.setAttribute("src", img.getAttribute("_src"));
				// img.removeAttribute("_src");
			//}
		}
		//_initHeadArr[page] = 1;					// 第一页的头像组 src 已初始化
	}
	
	
	// 隐藏指定页的所有头像
	function hidePageHeads(page){
		var curArr = _arrHeads[page-1];			// 页数-1
		var len = curArr.length;
		for(i=0; i<len; i++){
			var img = $T(curArr[i], "img")[0];
			curArr[i].style.display = "none";
		}
	}
	
	
	
	
	// 命名规范：name_idn，name_nod，name_fmt，三种后缀区分模板。
	TPL.shell_nod = [
	'<div class="invite" id="#{entity}">',
		'<div class="SG_tag">',
			'<ul>',
				'<li id="#{showAll}" class="current"><span><a href="#" id="#{showAllTxt}" onclick="return false;">全部</a></span><span class="tagR"></span></li>',
				'<li id="#{showSelected}"><span><a href="#" id="#{showSelectedTxt}" onclick="return false;">已选(0)</a></span><span class="tagR"></span></li>',
			'</ul>',
		'</div>',
		'<div class="inviteList">',
			'<ul id="#{friends}"></ul>',
			'<div class="clearit"></div>',
		'</div>',
		'<div class="inviteBottom">',
			'<div class="inviteAll"><input type="checkbox" id="#{selectAll}"/><label for="#{selectAll}">本页全选</label></div>',
			'<div id="#{pagination}" class="SG_page"></div>',
			'<div class="clearit"></div>',
		'</div>',
		'<div class="inviteBtn"><a href="#" class="SG_aBtn SG_aBtnB" id="#{inviteBtn}" onclick="return false;"><cite>发送邀请</cite></a></div>',
	'</div>'].join("");
	
	TPL.head_fmt = '<li seq="#{seq}" uid="#{uid}" style="display:none;"><img _src="#{headImg}" alt="#{nick}" title="#{title}"/><a title="#{title}">#{nick}</a></li>';
	
	
	
	// 考虑是不是要返回一些获取组件状态的方法
	return {
		init: init,
		
		getSelectedNum:function(){
			return _len;
		}
		
		
	}
};







