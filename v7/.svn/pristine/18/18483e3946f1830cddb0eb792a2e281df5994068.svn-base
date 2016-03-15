/**	
 * @fileoverview
 *	创建 Debug 调试框
 *	Debug 包含五种状态的输出：log(白)、info(绿)、warning(黄)、error(红)、fatal(红底白字)
 *
 *    使用范例：
 *        Debug.fatal("严重错误");
 *        Debug.error("一般错误");  = traceError("一般错误");
 *        Debug.warning("警告");
 *        Debug.info("成功提示");
 *        Debug.log("普通日志");    = trace("普通日志");
 *
 *    快捷键：
 *        Alt+~ 控制显示隐藏                            (Opera 下是 Ctrl + 4)
 *        Ctrl+~（或 Debug 界面上双击） 激活命令行         (Opera 下是 Ctrl + 5)
 *    
 *    命令行：
 *        注 ——	带冒号(:)表示是命令，不带冒号表示是查找字符串
 *        		键盘上下键可以查找当前页历史命令
 *        :f/:fatal                切换到 fatal 过滤器
 *        :e/:error                切换到 error 过滤器
 *        :w/:warning              切换到 warning 过滤器
 *        :i/:info                 切换到 info 过滤器
 *        :l/:log                  切换到 log 过滤器
 *        :a/:all                  切换到 all 过滤器
 *        :k/:key Keyword          设置过滤器关键字，不带关键字表示清空关键字设置
 *        :o/:option               打开 Option 面板，事实上没什么用，就是用来从面板上查看当前是那种模式
 *        :1/:mode1                切换到开发模式 1(暂不可用)
 *        :2/:mode2                切换到开发模式 3(暂不可用)
 *        :3/:mode3                切换到开发模式 3(暂不可用)
 *        :4/:mode4                切换到开发模式 4(暂不可用)
 *        :5/:mode5                切换到开发模式 5(暂不可用)
 *        :m/:mode                 查看当前是哪种开发模式
 *        :c/:cls/:clear           清空控制台
 *        :on                      打开 JS 运行框
 *        :off                     关闭 JS 运行框
 *        Keyword                  查找字符串，如果要查找冒号开始的，请将冒号转义 \:
 *        ?/:h/:help               获取命令说明
 *
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @since 2009.07.09
 * @history
 *	20090721	针对 IE6 的垂直滚动条跟随
 * 	20090722	命令行增加各种命令操作；增加脚本运行框(:on)；Opera 的快捷键设定为 Ctrl+4、Ctrl+5
 * 	20090723	命令行增加键盘上下键查找当前页历史命令；增加 Debug.dir 用于打印 JSON 对象结构
 * 	20090724	开发模式切换功能启用
 */
// ■◆▲●★□◇△○☆★◎→←↑↓〓⊙⌒∠⊥∵∴∷∮√∽≌¤ΦΘ×
(function () {
	/**
	 * navigator
	 */
	var _ua = navigator.userAgent.toLowerCase();
	var $IE = /msie/.test(_ua);
	var $OPERA = /opera/.test(_ua);
	var $MOZ = /gecko/.test(_ua);
	var $IE5 = /msie 5/.test(_ua);
	var $IE55 = /msie 5.5/.test(_ua);
	var $IE6 = /msie 6/.test(_ua);
	var $IE7 = /msie 7/.test(_ua);
	var $SAFARI = /safari/.test(_ua);
	var $winXP=/windows nt 5.1/.test(_ua);
	var $winVista=/windows nt 6.0/.test(_ua);
	
	/**
	 * 取得节点
	 * @method $E
	 * @param {Object|String} o		节点ID
	 * @return {HTMLElement} 		查找到的节点
	 */ 
	var $E = function(o){
		return typeof o == "string" ? document.getElementById(o) : o;
	};
	/**
	 * 创建节点
	 * @method $C
	 * @param {Object} o			节点ID
	 * @return {HTMLElement} 		被创建的节点
	 */ 
	var $C = function(o){
		return typeof o == "string" ? document.createElement(o) : o;
	};

	/**
	 * get elements Array by tag name & class name
	 * 按照 tag name 和 classname 查找指定节点下的节点。
	 * prototype替代品
	 *
	 * @param {Element} el  root element from where to find elements
	 * @param {String}  tg  tagName
	 * @param {String}  clz class name to match elements
	 *
	 * @return {Array} of Element
	 */
	var getElementsByClass = function(el, tg, clz){
		el = el || document;
		var rs = [];
		clz = " " + clz +" ";
		var cldr = el.getElementsByTagName(tg), len = cldr.length;
		for (var i = 0; i < len; ++ i){
			var o = cldr[i];
			if (o.nodeType == 1){
				var ecl = " " + o.className + " ";
				if (ecl.indexOf(clz) != -1){
					rs[rs.length] = o;
				}
			}
		}
		return rs;
	};
	
	/**
	 * 绑定事件
	 * @metod addEvent
	 * @param {HTMLElement|String} elm	节点 ID 或者对象
	 * @param {Object} func				被绑定的函数
	 * @param {Object} evType			事件类型
	 * @param {Object} useCapture		
	 */
	var addEvent = function(elm, func, evType, useCapture) {
		var _el = $E(elm);
		if(_el == null){ return; }
		if(typeof useCapture == "undefined"){
			useCapture = false;
		}
		if(typeof evType == "undefined"){
			evType = "click";
		}
		if(_el.addEventListener){
			_el.addEventListener(evType, func, useCapture);
			return true;
		}else if(_el.attachEvent){
			var r = _el.attachEvent("on" + evType, func);
			return true;
		}else{
			_el['on' + evType] = func;
		}
	};
	
	/**
	 * 获取Event对象
	 * @method getEvent
	 * @return {Event} event对象
	 * @author FlashSoft | fangchao@staff.sina.com.cn
	 * @update 08.02.23
	 * @example
	 * 		getEvent();
	 */
	var getEvent = function () {
		return window.event;
	};
	if(!$IE) {
		getEvent = function () {
			// 这里是为了处理高级版本的Opera里直接支持event的处理 FlashSoft
			if (window.event) {
				return window.event;
			}
			var o = arguments.callee.caller;
			var e;
			var n = 0;
			while(o != null && n < 40){
				e = o.arguments[0];
				if (e && (e.constructor == Event || e.constructor == MouseEvent)) {
					return e;
				}
				n ++;
				o = o.caller;
			}
			return e;
		};
	}
	
	/**
	 * 停止事件冒泡
	 * @method stopEvent
	 */
	var stopEvent = function(el) {
		var ev = el? el: getEvent();
		ev.cancelBubble = true;
		ev.returnValue = false;
	};
	if(!$IE) {
		stopEvent = function(el) {
			var ev = el? el: getEvent();
			ev.preventDefault();
			ev.stopPropagation();
		};
	}

	/**
	 * 读取cookie,注意cookie名字中不得带奇怪的字符，在正则表达式的所有元字符中，目前 .[]$ 是安全的。
	 * @param {Object} cookie的名字
	 * @return {String} cookie的值
	 * @example
	 * var value = getCookie(name);
	 */
	var getCookie = function (name) {
		name = name.replace(/([\.\[\]\$])/g,'\\\$1');
		var rep = new RegExp(name + '=([^;]*)?;','i'); 
		var co = document.cookie + ';';
		var res = co.match(rep);
		if (res) {
			return res[1] || "";
		}
		else {
			return "";
		}
	};
	
	/**
	 * 设置cookie
	 * @param {String} name cookie名
	 * @param {String} value cookie值
	 * @param {Number} expire Cookie有效期，单位：小时
	 * @param {String} path 路径
	 * @param {String} domain 域
	 * @param {Boolean} secure 安全cookie
	 * @example
	 * setCookie('name','sina',null,"")
	 */
	var setCookie = function (name, value, expire, path, domain, secure) {
			var cstr = [];
			cstr.push(name + '=' + escape(value));
			if(expire){
				var dd = new Date();
				var expires = dd.getTime() + expire * 3600000;
				dd.setTime(expires);
				cstr.push('expires=' + dd.toGMTString());
			}
			if (path) {
				cstr.push('path=' + path);
			}
			if (domain) {
				cstr.push('domain=' + domain);
			}
			if (secure) {
				cstr.push(secure);
			}
			document.cookie = cstr.join(';');
	};
	
	/**
	 * 给指定对象增加HTML[不会破坏这个对象固有节点的事件]
	 * @method addHTML
	 * @param {HTMLElement | Document} oParentNode 节点对象
	 * @param {String} sHTML 代码字符串
	 * @author FlashSoft | fangchao@staff.sina.com.cn
	 * @update 07.12.26
	 * @example
	 * 			addHTML(document.body, "<input/>");
	 */
	var addHTML;
	if($IE) {
		addHTML = function(oParentNode, sHTML){
			oParentNode.insertAdjacentHTML("BeforeEnd", sHTML);
		};
	}else{
		addHTML = function(oParentNode, sHTML){
			var oRange = oParentNode.ownerDocument.createRange();
			oRange.setStartBefore(oParentNode);
			var oFrag = oRange.createContextualFragment(sHTML);
			oParentNode.appendChild(oFrag);
		};
	}
	
	/**
	 * 绑定对象
	 * @method bind
	 * @param {Function} fFunction	被绑定的函数
	 * @param {Object} object		被绑定的对象
	 */
	var bind = function(fFunction, object) { 
		var __method = fFunction; 
		return function() { 
			return __method.apply(object, arguments); 
		};
	};
	var bind3 = function(fFunc, object, args) { 
		args = args == null? []: args;
		var __method = fFunc; 
		return function() { 
		 return __method.apply(object, args); 
		};
	};
	
	// 创建 JS/CSS 资源
	var createResource = function(sUrl, sType, fCallback){
		if(sUrl == null){ return; }
		sType = (sType || "").toLowerCase();
		var oHTMLNode;
		switch (sType){
			case "js":
				oHTMLNode = $C("script");
				oHTMLNode.src = sUrl;
				oHTMLNode.type = "text/javascript";
				oHTMLNode.charset = "utf-8";
				if(fCallback != null){
					oHTMLNode.onload = oHTMLNode.onerror = oHTMLNode.onreadystatechange = function () {
						if (oHTMLNode && oHTMLNode.readyState && oHTMLNode.readyState != "loaded"
							 && oHTMLNode.readyState != "complete") {
							return;
						}
						//清理script标记
						oHTMLNode.onload = oHTMLNode.onreadystatechange = oHTMLNode.onerror = null;
						oHTMLNode.src = "";
						oHTMLNode.parentNode.removeChild(oHTMLNode);
						oHTMLNode = null; 
						fCallback();
					};
				}
				break;
			case "css":
				oHTMLNode = $C("link");
				oHTMLNode.rel = "stylesheet";
				oHTMLNode.type = "text/css";
				oHTMLNode.href = sUrl;
				break;
		}
		document.getElementsByTagName("head")[0].appendChild(oHTMLNode);
	};
	
	/**
	 * 全局的命名空间，被注册为 window 下的全局对象
	 */
	var namespace = "Debug";
	/**
	 * 保存全局对象的引用
	 */
	var debugNameSpace = window[namespace];
	/**
	 * 调试框节点 ID 前缀
	 */
	debugNameSpace.idPrefix = "debug";
	/**
	 * 调试框的样式
	 */
	debugNameSpace.css =  [
		'&#00;<style type="text/css">'
			,'#' + debugNameSpace.idPrefix + '_box {display : block; top : 5px;  right : 5px; z-index: 10000; width : 280px;'
				,'height : 400px; background : #000; border : 1px solid #000; font-size:9pt; font-family: Verdana; }'
			,'/* clear fix for ie6 */'
			,'#' + debugNameSpace.idPrefix + '_box .clearfix:after { content: "."; display: block; height: 0; clear: both; visibility: hidden; }'
			,'#' + debugNameSpace.idPrefix + '_box .clearfix { display: inline-block; }'
			,'#' + debugNameSpace.idPrefix + '_box * html .clearfix {height: 1%;}'
			,'#' + debugNameSpace.idPrefix + '_box .clearfix {display: block;}'
			,'#' + debugNameSpace.idPrefix + '_box .floatLeft { float : left; clear : none; }'
			,'.' + debugNameSpace.idPrefix + 'fixedbox { position: fixed; }'
			,'#' + debugNameSpace.idPrefix + '_box a { outline: none; }'
			,'#' + debugNameSpace.idPrefix + '_box a:link { color : #FFF; text-decoration : none; }'
			,'#' + debugNameSpace.idPrefix + '_box a:active { color : #FFF; text-decoration : none; }'
			,'#' + debugNameSpace.idPrefix + '_box a:visited { color : #FFF; text-decoration : none; }'
			,'#' + debugNameSpace.idPrefix + '_box a:hover { color : #FFF; text-decoration : underline; }'
			,'#' + debugNameSpace.idPrefix + '_box .debug_cnt { height : 398px;  border : 1px solid #FFF; padding : 0px; }'
			,'#' + debugNameSpace.idPrefix + '_box .toolbar { position : absolute; color : #CCC; top : 4px; right : 4px; '
				,'width : 123px; height : 20px; background : none; border : none; }'
			,'#' + debugNameSpace.idPrefix + '_box .toolbar .item { color : #666; width: 50px; margin-right : 5px; line-height : 20px; }'
			,'#' + debugNameSpace.idPrefix + '_box .item a { color : #FFF; }'
			,'#' + debugNameSpace.idPrefix + '_box .filters_menu { width: 100px; height: 180px; background:#333; border: 1px solid #666; }'
			,'#' + debugNameSpace.idPrefix + '_box .filters_menu ul{ margin: 0; padding: 0}'
			,'#' + debugNameSpace.idPrefix + '_box .filters_menu li{ line-height: 20px; padding: 0 5px; cursor: default; list-style-type: none;}'
			,'#' + debugNameSpace.idPrefix + '_box .filters_menu li .key{ padding-top: 5px;}'
			,'#' + debugNameSpace.idPrefix + '_box .filters_menu li .keyword{ line-height: 18px; width: 80px; height: 18px; color: #666;}'
			,'#' + debugNameSpace.idPrefix + '_box .filters_menu li em{ line-height: 16px; font-style: normal; padding: 0 3px 0 1px;}'
			,'#' + debugNameSpace.idPrefix + '_box .filters_menu .current{ background: #666;}'
			,'#' + debugNameSpace.idPrefix + '_box .close a{ line-height: 20px; font-weight: 600; text-decoration : none; }'
			,'#' + debugNameSpace.idPrefix + '_box .close a:hover{ color: #F00; text-decoration : none; }'
			,'#' + debugNameSpace.idPrefix + '_box .titlebar { color : #000; font-weight : 600; height : 25px; line-height : 22px;'
				,'background : url(' + debugNameSpace.base_url + '/debug/debug_title.jpg); padding : 0 5px; cursor : move; }'
			,'#' + debugNameSpace.idPrefix + '_box .content { width: 274px; height: 340px; overflow: auto; overflow-y: scroll; overflow-x : auto;'
				,'color: #FFF; background: #000; border: none; padding: 0;}'
			,'#' + debugNameSpace.idPrefix + '_box .content ul{ margin: 0; padding: 5px 0; }'
			,'#' + debugNameSpace.idPrefix + '_box .content li{ line-height: 26px; /*height: 26px;*/ padding-left: 5px; list-style-type: none;}'
			,'#' + debugNameSpace.idPrefix + '_box .search { height : 28px; margin : 0px auto; padding: 2px 4px; background: #000; border: none; }'
			,'#' + debugNameSpace.idPrefix + '_box .search_box { margin-top: 1px; width: 225px; height: 22px;'
				,'line-height : 22px; border : 1px solid #CCC; }'
			,'#' + debugNameSpace.idPrefix + '_box .search_button { color: #FFF; line-height: 28px; background: #000; margin: 0 4px;'
				,'padding : 0; border : none; }'
			,'#' + debugNameSpace.idPrefix + '_box .search_result { background: #FF0; color: #00F; padding: 0px 5px; '
				,'font-style: italic; font-weight: 600; }'
			,'#' + debugNameSpace.idPrefix + '_box .debug_setup { width: 268px; height: 360px; margin: 5px;/*background:#F00;*/ color:#FFF;}'
			,'#' + debugNameSpace.idPrefix + '_box .setup_title { line-height: 40px; padding-top: 10px; font-size: 14px; padding-left: 40px;}'
			,'#' + debugNameSpace.idPrefix + '_box .setup_option { height: 25px; line-height: 25px; background: #333; padding:0 0 2px 40px;}'
			,'#' + debugNameSpace.idPrefix + '_box .setup_option label { outline: none;}'
			,'#' + debugNameSpace.idPrefix + '_box .setup_current { background: #666; color: #0F0;}'
			,'#' + debugNameSpace.idPrefix + '_box .button_border { /*border: 1px solid #333;*/}'
			,'#' + debugNameSpace.idPrefix + '_box .btn{ height: 25px; color: #fff; font-size: 14px; background: #444;'
				,' padding: 3px 5px; border-left: 1px solid #999; border-top: 1px solid #999; border-right: 1px solid #000; '
				,'border-bottom: 1px solid #000; cursor: pointer; width: auto; overflow: visible;}'
			,'#' + debugNameSpace.idPrefix + '_box .command_area{position: absolute; left: -302px; top: -1px; background:#333; '
				,'width:300px; height:400px; border: 1px solid #000;}'
			,'#' + debugNameSpace.idPrefix + '_box .command_cnt{ padding: 8px 18px;}'
			,'#' + debugNameSpace.idPrefix + '_box .command_textarea{ width: 260px; height: 310px; }'
			,'#' + debugNameSpace.idPrefix + '_box .command_title{ line-height: 25px; color: #999; }'
			,'#' + debugNameSpace.idPrefix + '_box .right{ text-align: right; padding-top: 10px;}'
			,'#' + debugNameSpace.idPrefix + '_box .dir { margin:0 0 10px;}'
			,'#' + debugNameSpace.idPrefix + '_box .fold{ color: #0F0; cursor: default; }'
			,'#' + debugNameSpace.idPrefix + '_box .dir div{ line-height: 14px; margin: 0; padding: 0; zoom: 1; overflow: hidden;}'
		,'</style>'].join("");
	/**
	 * 调试框的 HTML 节点
	 */
	debugNameSpace.html = [
			'<div id="{prefix}_command_area" class="command_area" style="display: none;">'
				,'<div class="command_cnt">'
					,'<div class="command_title">输入 JS 脚本（Ctrl+Enter 执行）</div>'
					,'<textarea id="{prefix}_command_textarea" class="command_textarea"></textarea>'
					,'<div class="right">',
					'<span class="button_border"><input id="{prefix}_command_run" type="button" value="运行脚本" title="运行指定的JS" class="btn"/><',
					'/span> <span><input id="{prefix}_command_hide" type="button" value="隐藏 >>" title="暂未开启" class="btn"/></span></div>'
				,'</div>'
			,'</div>'
			,'<div class="debug_cnt">'
				,'<div class="toolbar clearfix ">'
					,'<div class="floatLeft item"><a id="{prefix}_filters" href="javascript:;" hidefocus="true" title="过滤">Filters↓</a></div>'
					,'<div class="floatLeft item"><a id="{prefix}_option" href="javascript:;" hidefocus="true" title="设置">Option</a></div>'
					,'<div class="floatLeft close"><a id="{prefix}_close" href="javascript:;" hidefocus="true"'
						,'onclick="return false;" title="关闭">×</a></div>'
					,'<div style="clear:both;"></div>'
					,'<div id="{prefix}_filters_menu" class="filters_menu" style="display: none;">'
						,'<ul>'
							,'<li id="{prefix}_filters_menu1" onmouseover="' + namespace + '.overFilter(this);" onclick="'
								+ namespace + '.changeFilter(1, this);">{filter_menu1} Fatal </li>'
							,'<li id="{prefix}_filters_menu2" onmouseover="' + namespace + '.overFilter(this);" onclick="'
								+ namespace + '.changeFilter(2, this);">{filter_menu2} Error </li>'
							,'<li id="{prefix}_filters_menu3" onmouseover="' + namespace + '.overFilter(this);" onclick="'
								+ namespace + '.changeFilter(3, this);">{filter_menu3} Warning </li>'
							,'<li id="{prefix}_filters_menu4" onmouseover="' + namespace + '.overFilter(this);" onclick="'
								+ namespace + '.changeFilter(4, this);">{filter_menu4} Info </li>'
							,'<li id="{prefix}_filters_menu5" onmouseover="' + namespace + '.overFilter(this);" onclick="'
								+ namespace + '.changeFilter(5, this);">{filter_menu5} log </li>'
							,'<li id="{prefix}_filters_menu0" onmouseover="' + namespace + '.overFilter(this);" onclick="'
								+ namespace + '.changeFilter(0, this);">{filter_menu0} All</li>'
							,'<li id="{prefix}_filters_key"><div class="key">关键字过滤：</div>'
								,'<input id="{prefix}_filters_keyword" type="text" title="输入完毕后回车确认" value="{filter_word}" class="keyword" />'
							,'</li>'
						,'</ul>'
					,'</div>'
				,'</div>'
				,'<div class="titlebar" title="快捷键 Alt+~">Debug Console</div>'
				,'<div id="{prefix}_list_cnt">'
					,'<div id="{prefix}_list_container" class="content">'
						,'<ul id="{prefix}_list"></ul>'
					,'</div>'
					,'<div class="search">'
						,'<input id="{prefix}_search_keyword" type="text" class="floatLeft search_box" />'
						,'<a id="{prefix}_clear" href="javascript:;" title="清空" hidefocus="true" class="floatLeft search_button">Clear</a>'
					,'</div>'
				,'</div>'
				,'<div id="{prefix}_setup" style="display:none;" class="debug_setup">'
					,'<div class="setup_title">请选择开发模式</div>'
					,'<div class="setup_option" onclick="' + namespace + '.changeMode(1);return false;">'
						,'<input id="{prefix}_mode1" type="radio" name="mode">'
						,'<label for="{prefix}_mode1" hidefocus="true"> 小文件、不压缩</label>'
					,'</div>'
					,'<div class="setup_option" onclick="' + namespace + '.changeMode(2);return false;">'
						,'<input id="{prefix}_mode2" type="radio" name="mode">'
						,'<label for="{prefix}_mode2" hidefocus="true"> 小文件、压缩</label>'
					,'</div>'
					,'<div class="setup_option" onclick="' + namespace + '.changeMode(3);return false;">'
						,'<input id="{prefix}_mode3" type="radio" name="mode">'
						,'<label for="{prefix}_mode3" hidefocus="true"> 大文件、不压缩</label>'
					,'</div>'
					,'<div class="setup_option" onclick="' + namespace + '.changeMode(4);return false;">'
						,'<input id="{prefix}_mode4" type="radio" name="mode">'
						,'<label for="{prefix}_mode4" hidefocus="true"> 大文件、压缩</label>'
					,'</div>'
					,'<div class="setup_option" onclick="' + namespace + '.changeMode(5);return false;">'
						,'<input id="{prefix}_mode5" type="radio" name="mode">'
						,'<label for="{prefix}_mode5" hidefocus="true"> 上线环境</label>'
					,'</div>'
					,'<div class="setup_title">',
					'<span class="button_border"><input id="{prefix}_back" type="button" value="返回" title="返回调试界面" class="btn"/></span> ',
					'<!--<span><input type="button" value="升级" disabled title="暂未开启" class="btn"/></span></div>-->'
				,'</div>'
			,'</div>'
		].join("");

	
	/**
	 * 创建调试框节点并绑定事件
	 */
	debugNameSpace.initNode = function (){
		var currentFilterMenu = getCookie("filtermenu") || "0";
		var currentFilterWord = getCookie("filterword");
		this.lastFilter = currentFilterMenu;
		this.filterKeyword = currentFilterWord.toLowerCase();
		var oDivNode = $C("div");
		oDivNode.id = debugNameSpace.idPrefix + "_box";
		oDivNode.className = debugNameSpace.idPrefix + "fixedbox";
		var templateData = {
			prefix : 		debugNameSpace.idPrefix
			,filter_word : 	currentFilterWord
			,filter_menu0 : 	"　"
			,filter_menu1 : 	"　"
			,filter_menu2 : 	"　"
			,filter_menu3 : 	"　"
			,filter_menu4 : 	"　"
			,filter_menu5 : 	"　"
		};
		templateData["filter_menu" + currentFilterMenu] = "<em>√<\/em>";
		oDivNode.innerHTML = debugNameSpace.html.replace(/({[^\{\}]+})/g, function(a, b){
							b = b.substr(1, b.length - 2);
							return templateData[b];
					});
		document.body.appendChild(oDivNode);

		this.debug_box = $E(debugNameSpace.idPrefix + "_box");
		this.debug_list = $E(debugNameSpace.idPrefix + "_list");
		this.debug_list_container = $E(debugNameSpace.idPrefix + "_list_container");
		this.debug_list_cnt = $E(debugNameSpace.idPrefix + "_list_cnt");
		this.debug_setup = $E(debugNameSpace.idPrefix + "_setup");
		this.debug_filters = $E(debugNameSpace.idPrefix + "_filters");
		this.debug_filters_menu = $E(debugNameSpace.idPrefix + "_filters_menu");
		this.debug_option = $E(debugNameSpace.idPrefix + "_option");
		this.debug_close = $E(debugNameSpace.idPrefix + "_close");
		this.debug_search_keyword = $E(debugNameSpace.idPrefix + "_search_keyword");
		this.debug_clear = $E(debugNameSpace.idPrefix + "_clear");
		this.debug_back = $E(debugNameSpace.idPrefix + "_back");
		this.debug_filters_key = $E(debugNameSpace.idPrefix + "_filters_key");
		this.debug_filters_keyword = $E(debugNameSpace.idPrefix + "_filters_keyword");
		this.debug_command_area = $E(debugNameSpace.idPrefix + "_command_area");
		this.debug_command_textarea = $E(debugNameSpace.idPrefix + "_command_textarea");
		this.debug_command_run = $E(debugNameSpace.idPrefix + "_command_run");
		this.debug_command_hide = $E(debugNameSpace.idPrefix + "_command_hide");
		// 过滤按钮绑定事件
		addEvent(this.debug_filters, bind(function () {
			this.showFilters();
			stopEvent(getEvent());
		}, this));
		// 选项按钮绑定事件
		addEvent(this.debug_option, bind(function () {
			this.showDebugOption();
		}, this));
		// 选项按钮绑定事件
		addEvent(this.debug_back, bind(function () {
			this.showDebugOption();
		}, this));
		// 关闭按钮绑定事件
		addEvent(this.debug_close, bind(function () {
			this.debug_box.style.display = "none";
		}, this));
		// 命令行绑定事件
		addEvent(this.debug_search_keyword, bind(function () {
			var theEvent = getEvent();
			var key = theEvent.keyCode || theEvent.which;
			this.debug_search_keyword = this.debug_search_keyword
										|| $E(debugNameSpace.idPrefix + "_search_keyword");
			var keyword = this.debug_search_keyword.value.replace(/^\s+|\s+$/, "");
			switch (key){
				case 13:
					if(/^[\:\?]/.test(keyword)){
						this.execCommand(keyword);
						this.debug_search_keyword.value = "";
					}else{
						this.searchKeyword(keyword);
					}
					break;
				case 38:
					this.debug_search_keyword.value = this.getCacheCommond(-1);
					break;
				case 40:
					this.debug_search_keyword.value = this.getCacheCommond(1);
					break;
			}
		}, debugNameSpace), "keyup");
		// 清理按钮绑定事件
		addEvent(this.debug_clear, bind(function () {
			this.clearConsole();
		}, this));
		// 在调试框上单击，关闭 Filter 菜单
		addEvent(this.debug_box, bind(function () {
			this.hideFilters();
		}, this));
		// 在调试框上双击，关闭 Filter 菜单
		addEvent(this.debug_box, bind(function () {
			try{this.debug_search_keyword.focus();}catch(e){}
		}, this), "dblclick");
		//
		addEvent(this.debug_filters_key, function () {
			stopEvent(getEvent());
		});
		// 监听过滤关键字输入框的回车事件
		addEvent(this.debug_filters_keyword, bind(function () {
			var theEvent = getEvent();
			var key = theEvent.keyCode || theEvent.which;
			var keyword = this.debug_filters_keyword.value;
			if(key == 13){
				this.hideFilters();
				this.setFilterKeywordAs(keyword);
			}			
		}, this), "keydown");
		//
		addEvent(this.debug_filters_keyword, bind(function () {
			this.debug_filters_keyword.select();
		}, this), "focus");
		
		// 检测脚本区域的 Ctrl+Enter 按键
		addEvent(this.debug_command_textarea, bind(function (){
			var evt = getEvent();
			var key = evt.keyCode || evt.which;
			if(key == 13 && evt.ctrlKey){
				this.execJsCode();
			}
		}, this), "keyup");
		//
		addEvent(this.debug_command_run, bind(function () {
			this.execJsCode();
		}, this));
		// 命令行的隐藏按钮执行的方法
		addEvent(this.debug_command_hide, bind(function(){
			this.commandArea();
		}, this));
		this.showCacheContent();
		this.initFinished = true;
		if($IE6){
			this.debug_box.style.position = "absolute";
			this.checkMenu();
		}
	};
	// IE6 的纵向滚动条跟随
	if($IE6){
		debugNameSpace.checkMenu = function () {
			var menuTopMargin = -5; 
			var menuSpeed = 15;
			var timerSpeed = 200;
			var timer;
			var heightLimit = 0;
			var eMenu = $E(debugNameSpace.idPrefix + "_box"); 
			if (document.body.offsetHeight > heightLimit) {
				var reTimer = timerSpeed;
				var startPoint = parseInt(eMenu.currentStyle.top, 10);
				var endPoint = document.documentElement.scrollTop;
				endPoint = (menuTopMargin <= endPoint) ? endPoint - menuTopMargin : 0;
				if (startPoint != endPoint) {
					moveAmount = Math.ceil(Math.abs(endPoint - startPoint) / 15);
					eMenu.style.top = (parseInt(eMenu.currentStyle.top, 10) || 0)
							+ ((endPoint < startPoint) ? -moveAmount : moveAmount);
					reTimer = menuSpeed;
				}
			}
			else {
				eMenu.style.top = 0;
			}
			timer = setTimeout(debugNameSpace.checkMenu, reTimer);
		};
	}
	/**
	 * 在控制台打印对象（JS对象及 HTML 节点）的数据结构
	 * @param {Object} oObject
	 */
	debugNameSpace.dirObject = function (oObject, sBgColor) {
		if(oObject == null){return;}
		var debugItem = $C("li");
		debugItem.className = "dir";
		debugItem.appendChild(document.createTextNode('Dir object : '));
//		debugItem.style.color = sBgColor || "#000000;";
		var type = typeof oObject;
		var itemNode = this.parseObject(oObject, 2);
		debugItem.appendChild(itemNode);
		this.debug_list.appendChild(debugItem);
		this.scrollToBottom();
	};
	
	/**
	 * 解析 object 对象，并声称相应节点
	 * @param {Object} oObject
	 * @param {String} sClassName
	 */
	debugNameSpace.parseObject = function (oObject, nIndex) {
		var sLine = new Array(nIndex).join("&nbsp;|&nbsp;") + '&nbsp;+-';
		var type = typeof oObject;
		var isArray = (Object.prototype.toString.call(oObject) === '[object Array]');
		var itemNode = $C("div");
		if(type == "string" || type == "number" || type == "boolean"){
			itemNode.innerHTML = sLine + oObject;
		}else{
			for(key in oObject){
				try{
				type = this.getObjectType(oObject[key]);
				var isFold = (oObject[key] && (type == "object" || type == "array")
							&& !(oObject[key] instanceof RegExp || oObject[key] instanceof Date)
							);
				if(isFold){
					tempNode = $C("div");
					tempNode.innerHTML = (sLine);
					var foldNode = $C("span");
					foldNode.className = "fold";
					foldNode.onclick = bind3(this.foldNode, this, [oObject[key], foldNode, nIndex]);
					foldNode.innerHTML = key;
					tempNode.appendChild(foldNode);
					type = (oObject[key].constructor == Array) ? 'array' : type;
					foldNode = document.createTextNode(' : [' + type + ']');
					tempNode.appendChild(foldNode);
					itemNode.appendChild(tempNode);
				}else{
					tempNode = $C("div");
//					switch (oObject[key].constructor){
//						case Array:
//							type = "array";
//							break;
//						case RegExp:
//							type = "regexp";
//							break;
//					}
					tempNode.innerHTML = sLine + key + " : " + (oObject[key]) + "";
					// && oObject[key] instanceof Function ? '[function]' : oObject[key]);
					itemNode.appendChild(tempNode);
				}
				}catch(e){ trace(e.message);}
			}
			tempNode = null;	
		}
		return itemNode;
	};
	
	debugNameSpace.getObjectType = function (oObject){
		var type = typeof oObject;
		if(type != "object"){
			return type;
		}else{
//			if(oObject instanceof Array){
//				return "array";
//			}
//			if(oObject instanceof RegExp){
//				return "regexp";
//			}
//			if(oObject instanceof Date){
//				return "date";
//			}
//			if(oObject instanceof Function){
//				return "function";
//			}
			return "object";
		}
	};
	
	/**
	 * 展开/收起 Debug.dir 中输出的可展开节点
	 * @param {Object} param
	 * @param {HTMLElement} node
	 */
	debugNameSpace.foldNode = function (param, node, nIndex) {
		var childNode = getElementsByClass(node.parentNode, "div", "");
		if(childNode == ""){
			node.parentNode.appendChild(this.parseObject(param, nIndex + 1));
		}else{
			childNode = childNode[0];
			childNode.style.display = (childNode.style.display == "none") ? "block" : "none";
		}
	};
	
	/**
	 * 显示指定类型的缓存数据
	 * @param {Number} nType Debug信息的类型
	 * 		null/0=all 1=fatal 2=error 3=warning 4=info 5=log
	 * @param {String} sKeyword		关键字
	 */	
	debugNameSpace.showCacheContent = function (nType, sKeyword){
		nType = nType || window.parseInt(getCookie("filtermenu")) || 0;
		sKeyword = sKeyword || getCookie("filterword");
		this.filterKeyword = sKeyword;
		var outputHTML = [];
		var count = 0;
		// 遍历所有缓存的数据
		for(var i = 0, len = this.cacheData.length; i < len; i++){
			// 判断缓存的数据类型
			if(this.cacheData[i][1].type == nType || nType == 0){
				if(typeof this.cacheData[i][0] != "string"){
					this.dirObject(this.cacheData[i][0], ( count % 2 ? '#333;' : '#000;'));
					count ++;
				}
				// 如果有过滤关键字
				else if(sKeyword != null){
					// 如果提供了关键字，就根据只显示匹配到的条目
					if(this.cacheData[i][0].toLowerCase().indexOf(sKeyword.toLowerCase()) != -1){
						addHTML(this.debug_list, '<li style="color:' + this.cacheData[i][1].color + ';'
							 +(this.cacheData[i][1].bgcolor != null
								? ('background:' + this.cacheData[i][1].bgcolor)
								: 'background:' + (count % 2 ? '#333;' : 'none;'))
							+ '">' + this.cacheData[i][0] + '</li>');
						this.scrollToBottom();
						count ++;
					}
				}
				// 如果没有过滤关键字
				else{
					addHTML(this.debug_list, '<li style="color:' + this.cacheData[i][1].color + ';'
						+ (this.cacheData[i][1].bgcolor != null
								? ('background:' + this.cacheData[i][1].bgcolor)
								: 'background:' + ( count % 2 ? '#333;' : 'none;'))
						+ '">' + this.cacheData[i][0] + '</li>');
					this.scrollToBottom();
					count ++;
				}
				
			}
		}
	};
	/**
	 * 显示当前产生的调试信息
	 * @param {Array} aData
	 */
	debugNameSpace.showCurrentData = function(aData){
		var listNode = this.debug_list.children || this.debug_list.childNodes;
		var len = listNode.length - 1;
		if(typeof aData[0] != "string"){
			this.dirObject(aData[0], (len - 1) % 2 ? '#333;' : '#000;');
		}else{
			this.lastFilter = this.lastFilter || "0";
			// 如果当前 Filter 是 All 或者当前信息符合选择的 Filter，就显示到控制台
			if(this.lastFilter == 0 || this.lastFilter == aData[1].type){
				// 检查当前的关键字设置
				if(this.filterKeyword != null && aData[0].toLowerCase().indexOf(this.filterKeyword) != -1){
					// 获取控制台显示的条目，用于设置控制台信息的钢琴线效果
					var html = '<li style="color:' + aData[1].color + ';'
									+ (aData[1].bgcolor != null
											? ('background:' + aData[1].bgcolor)
											: 'background:' + ( (len - 1) % 2 ? '#333;' : 'none;'))
									+ '">' + aData[0] + '</li>';
					addHTML(this.debug_list, html);
					this.scrollToBottom();
				}
			}			
		}
	};
	/**
	 * 调试窗滚动到最底部
	 */
	debugNameSpace.scrollToBottom = function () {
		this.debug_list_container.scrollTop = this.debug_list_container.scrollHeight;
	};

	/**
	 * 显示 Option 面板
	 */
	debugNameSpace.showDebugOption = function(){
		if(this.debug_option.innerHTML == "Option"){
			this.debug_list_cnt.style.display = "none";
			this.debug_setup.style.display = "block";
			this.debug_filters.style.visibility = "hidden";
			this.debug_option.innerHTML = "Debug";
			this.debug_back.focus();
			// 将当前用户选择的模式对应的 radio 选中
			this.getCurrentMode(function (nMode){
				var debug_mode = $E(debugNameSpace.idPrefix + "_mode" + nMode);
				debug_mode.parentNode.className = "setup_option setup_current";
				debug_mode.checked = true;
				debugNameSpace.lastMode = nMode;
			});	
		}else{
			this.debug_list_cnt.style.display = "block";
			this.debug_setup.style.display = "none";
			this.debug_filters.style.visibility = "visible";
			this.debug_option.innerHTML = "Option";
			this.active();
		}
	};
	/**
	 * 取得当前的开发模式
	 */
	debugNameSpace.getCurrentMode = function (fFunction){
		// 创建请求，获取当前的开发模式
		var setUrl = this.base_url + "mode.php?action=get&product=" + this.product + "&varname=getDevMode";
		createResource(setUrl, "js", bind(function (){
			fFunction(getDevMode.boot_mode);
		}, this));
	};
	/**
	 * 切换到指定的开发模式
	 * @param {Object} nMode
	 */
	debugNameSpace.changeMode = function(nMode){
		// 创建请求，改变当前的开发模式
		var setUrl = this.base_url + "mode.php?action=set&product="
					+ this.product + "&mode=" + nMode + "&varname=setDevMode";
		createResource(setUrl, "js", bind(function (){
			var debug_mode = $E(debugNameSpace.idPrefix + "_mode" + nMode);
			debug_mode.parentNode.className = "setup_option setup_current";
			debug_mode.checked = true;	
			this.info("Success to set mode " + nMode);
			if(debugNameSpace.lastMode != null && debugNameSpace.lastMode != nMode){
				$E(debugNameSpace.idPrefix + "_mode" + debugNameSpace.lastMode).parentNode.className = "setup_option";
			}
			debugNameSpace.lastMode = nMode;
		}, this));
	};

	/**
	 * 显示过滤器菜单
	 */ 
	debugNameSpace.showFilters = function(){
		// 先从 Cookie 获得当前的过滤器菜单是什么
		if(this.lastFilterMenu == null){
			var currentFilterMenu = getCookie("filtermenu") || "0";
			this.lastFilterMenu = $E(debugNameSpace.idPrefix + "_filters_menu" + currentFilterMenu);
		}
		if(this.debug_filters_menu.style.display == "none"){
			this.debug_filters_menu.style.display = "block";
			this.debug_filters_keyword.focus();
			this.lastFilterMenu.innerHTML = this.lastFilterMenu.innerHTML.replace(/　/ig, "<em>√<\/em>");
		}else{
			this.hideFilters();
		}
	};

	/**
	 * 隐藏过滤器菜单
	 */ 
	debugNameSpace.hideFilters = function(){
		// 隐藏 Filter 菜单
		this.debug_filters_menu.style.display = "none";
		
		// 去掉 Filter 菜单的鼠标滑过高亮效果
		if(this.lastFilter != null){
			$E(debugNameSpace.idPrefix + "_filters_menu" + this.lastFilter).className = "";
		}else if(debugNameSpace.lastOverFilter != null){
			debugNameSpace.lastOverFilter.className = "";
		}
	};
		
	/**
	 * 鼠标滑过过滤器选项的效果
	 * @param {HTMLElement} oElement
	 */
	debugNameSpace.overFilter = function (oElement){
		oElement.className = "current";
		if(debugNameSpace.lastOverFilter != null && debugNameSpace.lastOverFilter != oElement){
			debugNameSpace.lastOverFilter.className = "";
		}
		debugNameSpace.lastOverFilter = oElement;
	};
	
	/**
	 * 变更过滤器类型为指定类型
	 * @param {Number} oFilterType
	 */
	debugNameSpace.changeFilter = function(oFilterType){
		oFilterType = oFilterType.toString();
		this.clearConsole();
		// 显示缓存中指定类型的数据
		this.showCacheContent(oFilterType);

		// 取消当前 Filter 菜单前的对勾符号
		if(this.lastFilterMenu == null){
			var currentFilterMenu = getCookie("filtermenu") || "0";
			this.lastFilterMenu = $E(debugNameSpace.idPrefix + "_filters_menu" + currentFilterMenu);
		}
		this.lastFilterMenu.innerHTML = this.lastFilterMenu.innerHTML.replace(/<em>√<\/em>/ig, "　");
				
		setCookie("filtermenu", oFilterType);
		this.lastFilterMenu = $E(debugNameSpace.idPrefix + "_filters_menu" + oFilterType);
		this.lastFilter = oFilterType;
	};
	/**
	 * 设置过滤器关键字
	 * @param {String} sKeyword
	 */
	debugNameSpace.setFilterKeywordAs = function (sKeyword){
		sKeyword = sKeyword.toLowerCase();
		setCookie("filterword", sKeyword);
		this.showCacheContent(0, sKeyword);
		this.filterKeyword = sKeyword; // 保存过滤关键字以便后续调试信息使用
	};
	/**
	 * 执行输入的命令
	 * @param {String} sKeyword		命令关键字
	 */
	debugNameSpace.execCommand = function (sKeyword) {
		this.cacheCommand = this.cacheCommand || [];
		var command = sKeyword.replace(/^\:/, "");
		var keyword = "";
		var isCommandVisible = true;
		if(/^(k|key) /i.test(command)){
			keyword = command.match(/\S+$/);
			if(keyword != null){
				keyword = keyword[0];
			}
			command = "k";
		}
		// 根据不同的指令执行不同的操作
		switch (command){
			case "f":
			case "fatal":
				this.changeFilter(1); break;
			case "e":
			case "error":
				this.changeFilter(2); break;
			case "w":
			case "warning":
				this.changeFilter(3); break;
			case "i":
			case "info":
				this.changeFilter(4); break;
			case "l":
			case "log":
				this.changeFilter(5); break;
			case "a":
			case "all":
				this.changeFilter(0); break;
			case "k":
			case "key":
				this.setFilterKeywordAs(keyword); break;
			case "o":
			case "option":
				this.showDebugOption(); break;
			case "1":
			case "mode1":
				this.changeMode(1); break;
			case "2":
			case "mode2":
				this.changeMode(2); break;
			case "3":
			case "mode3":
				this.changeMode(3); break;
			case "4":
			case "mode4":
				this.changeMode(4); break;
			case "5":
			case "mode5":
				this.changeMode(5); break;
			case "m":
			case "mode":
				this.getCurrentMode(bind(function(nMode){
					this.log("Current develop mode is <b style='color:#F00;'>" + nMode + "</b>");
				}, this));
				break;
			case "c":
			case "cls":
			case "clear":
				this.clearConsole(); break;
			case "on":
				this.commandArea(1); break;
			case "off":
				this.commandArea(); break;
			case "?":
			case "h":
			case "help":
				this.info("help list:<br/>");break;
			default:
				this.error('Bad command.<br/>please type command <i style="color:#FFF;">?</i> or '
					+ '<i style="color:#FFF;">:h</i> or <i style="color:#FFF;">:help</i> for usage.');
				isCommandVisible = false; break;
		}
		if(isCommandVisible){
			this.cacheCommand.push(sKeyword);
			this.cacheCommandIndex = this.cacheCommand.length;
		}
	};
	/**
	 * 获得缓存的用户命令
	 * @param {Number} nIndex
	 */
	debugNameSpace.getCacheCommond = function(nIndex){
		this.cacheCommandIndex += nIndex;
		if(nIndex > 0){
			this.cacheCommandIndex = Math.min(this.cacheCommandIndex, this.cacheCommand.length);
		}else{
			this.cacheCommandIndex = Math.max(this.cacheCommandIndex, 0);
		}
		return this.cacheCommand[this.cacheCommandIndex] || "";
	};
	/**
	 * 显示/隐藏脚本输入框
	 * @param {Object} nSwitch
	 */
	debugNameSpace.commandArea = function (nSwitch) {
		this.debug_command_area.style.display = (nSwitch == 1) ? "block" : "none";
		if(nSwitch ==1){
			try{
				this.debug_command_textarea.focus();
			}catch(e){}
		}
	};
	
	debugNameSpace.execJsCode = function () {
		var scriptText = this.debug_command_textarea.value;
		try{
			eval(scriptText);
		}catch(e){this.error("Exec Js error :<br/>" + e.message);}
	};
	/**
	 * 在当前列表中搜索指定关键字
	 * @param {String} sKeyword		命令关键字
	 */ 
	debugNameSpace.searchKeyword = function(sKeyword){
		sKeyword = sKeyword.toLowerCase();
		// 取得当前显示的列表的 Dom 节点到数组 listInConsole
		var listInConsole = this.debug_list.children || this.debug_list.childNodes;
		var lengthOfList = listInConsole.length;
		// 遍历所有控制台显示的调试信息，匹配关键字
		for(var i = 0; i < lengthOfList; i ++){
			var node = listInConsole[i];
			var text = node.innerHTML;
			text = text.replace(/<span class="?search_result"?>([^<]+)<\/span>/ig, "$1");

			// 如果关键字不为空，就高亮关键字
			if(sKeyword != ""){
				var re = new RegExp('(' + sKeyword + ')', "ig");
				node.innerHTML = text.replace(re, function(a, b){
					return '<span class="search_result">'+ b + "</span>";
				});
			}else{ //如果关键字为空，去除所有高亮
				node.innerHTML = text;
			}
		}
		this.debug_search_keyword.select();
		this.debug_search_keyword.focus();
		this.debug_search_keyword = null;
		listInConsole = null;
	};
	
	/**
	 * 清空所有调试信息，仅是控制台的呈现，不包括缓存的 JS 数组
	 */ 
	debugNameSpace.clearConsole = function(){
//		if(window.confirm("您确认要清空所有调试信息吗？\n只是清空控制台，缓存数据仍然存在。")){
			this.debug_list.innerHTML = "";
//			debugNameSpace.cacheData = [];
//		}
	};
		
	/**
	 * 显示/隐藏调试框，如果不存在，就直接创建节点
	 */ 
	debugNameSpace.show = function () {
		// 如果节点不存在就创建，否则直接控制显示隐藏
		if(this.debug_box == null){
			debugNameSpace.initNode();
		}else{
			this.debug_box.style.display = (this.debug_box.style.display != "none") ? "none" : "block";
		}
	};

	/**
	 * 激活命令行
	 */ 
	debugNameSpace.active = function () {
		if(this.debug_box != null && this.debug_box.style.display != "none"){
			var cm = this.debug_search_keyword || $E(debugNameSpace.idPrefix + "_search_keyword");
			cm.focus();
		}
	};
	
	/**
	 * 主流程
	 */
	// 创建样式表到 head 中
	addHTML(document.getElementsByTagName("head")[0], debugNameSpace.css);
	
	// 给页面绑定调试快捷键 
	addEvent(document, function (evt){
		evt = $IE ? window.event : evt;
		var key = evt.keyCode || evt.which;
		// Alt+~ 控制显示隐藏(Opera 下是 Ctrl + 4)
		if(key == 192 && evt.altKey || $OPERA && key == 52 && evt.ctrlKey){
			debugNameSpace.show();
		}
		// Ctrl+~ 或在 Debug 界面上双击鼠标激活命令行(Opera 下是 Ctrl + 5)
		if(key == 192 && evt.ctrlKey || $OPERA && key == 53 && evt.ctrlKey){
			debugNameSpace.active();
		}
	}, "keydown");
	
	try{
		document.execCommand("BackgroundImageCache", false, true);
	}catch(e){}
})();