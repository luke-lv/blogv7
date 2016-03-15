$import("sina/ui/ui.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/dom/getXY.js");
$import("sina/utils/io/timeoutJsLoad.js");
$import("sina/utils/io/ajax.js");
$import("sina/core/class/extend.js");
$import("sina/core/system/parseParam.js");
$import("sina/core/dom/getStyle.js");
$import("sina/utils/io/loadCss.js");
$import("sina/core/events/stopEvent.js");
$import("sina/core/system/br.js");
$import("sina/core/string/trim.js");
$import("sina/core/string/encodeHTML.js");

/**
 * @fileOverview 提示补全组件
 * 
 * @param {Object} options 配置选项
 * 
 * @param options.inputEle {HTMLElement}必添    			        要绑定suggest功能的input元素
 * @param options.dataSourceURL {String}必添	 			        数据源url
 * @param options.enableLocalCache {Boolean}    			    是否启用本地缓存  true启用(如启用会把每次从服务器端返回的数据保存到javascript变量中)  false不启用 默认:true
 * @param options.delayQueryTime {Number}       			    查询延迟时间 单位:毫秒 默认:0
 * @param options.requestType {String}			 			    请求类型 "blogScript"博客跨域请求方式  "jsonp"jsonp请求方式 "ajax"ajax请求方式 默认blogScript
 * @param options.paramObj {Object}             			    调用接口时所传入的参数,除了keyword其他参数值为静态
 * @param options.keywordParamName {String}     			    调用接口时keyword关键字对应的参数名  默认:q        
 * @param options.returnPropertyName {String}   			    服务器端根据关键字匹配到的结果为数组
 * 										 			            数组中的值可以为Object或String
 * 										 			            如果为Object 根据关键字匹配到的值的读取方法为	Object[options.returnPropertyName]
 * 													            默认为keyword
 * 																如果是String 此选项无效
 * @param options.suggestItemTagName {String}   			    suggest数据项所对应的html标签 默认:tr
 * @param options.highlightClassName {String}   			    高亮样式名 默认:highlight
 * @param options.normalClassName {String}      			    非高亮时样式名 默认:空
 * @param options.customerCreateSuggestListFun{Function}        自定义suggest html函数  该函数返回自定义html字符串 
 * @param options.customerSuggestContainer {HTMLElement}     	自定义suggest容器
 * @param options.hierarchyRelation {String}             	    如何访问到返回的数据数组 用.表示层级关系
 * 										 			            如:返回的数据为{code:"A00006",data:{
 *                                       				           list:[关键字1,关键字2,关键字3,...]
 * 										 			            }}
 *                                       			            则此处的值为data.list 
 *                                       			            默认为:data
 *
 * @param options.jsonpParamName {String}					    请求方式为jsonp方式时 与服务器端约定参数名												
 * @param options.keywordFormat {Function(itemValue,keyword)}	对服务器端返回的字符串格式化 自定义html时无效
 * 接收参数:
 * @param {String} itemValue 服务器端返回结果中的一项
 * @param {String} keyword	  当前关键字
 * 返回:
 * 该函数返回格式化后的字符串
 * 
 * @param options.beforeItemSelected {Function}			        选中某项时执行默认行为前的事件
 * 													            如该函数返回false 默认行为和afterItemSelected将不执行
 * 													             默认行为:将选中的值赋给input元素 并关闭suggest提示框
 * @param options.afterItemSelected  {Function}			        选中某项时执行默认行为后的事件
 * 
 * @param options.unselectedEnter  {Function}                   非选中状态时 按回车所执行自定义事件
 * 
 * @param options.offsetX  {Number}								suggest容器x轴偏移
 * @param options.offsetY  {Number}  							suggest容器y轴偏移
 * @param options.customSuggestContainerWidth  {Number}         自定义suggest容器宽度
 * 
 * @example
 * var suggestInstance=Ui.Suggest({
 *		//要绑定suggest功能的input元素
 *       inputEle: $E("weiboInviteInput"),
 *		//数据源url
 *		//ajax
 *        //dataSourceURL: $_GLOBAL.DOMAIN_CORE + "blog/api/autocompfriendlist.php",
 *		//blogScript
 *       //dataSourceURL: $_GLOBAL.DOMAIN_CORE + "blog/api/autocompfriendlist.php",
 *		//jsonp
 *		dataSourceURL: "http://suggestion.baidu.com/su",
 *		//是否启用本地缓存
 *		enableLocalCache:false,
 *		//查询延迟时间
 *		delayQueryTime: 0,
 *		//请求类型
 *       requestType: "jsonp",
 *		//调用接口时所传入的参数
 *		paramObj:{
 *			count:10,
 *			p:1
 *		},
 *		//调用接口时keyword关键字对应的参数名
 *		keywordParamName:"wd",
 *		//服务器端返回数组中值为对象时关键字对应属性名
 *       returnPropertyName: "nickname",
 *		//suggest数据项所对应的html标签
 *       suggestItemTagName:"li",
 *		//高亮样式名
 *		highlightClassName:"current",
 *		//非高亮时样式名
 *		normalClassName:"",
 *		//自定义suggest html函数
 *		customerCreateSuggestListFun:function(result){
 *			var html=[],i;
 *			for(i=0;i<result.length;i++){
 *				html[html.length]='<li id="s_'+i+'" key="'+result[i]+'"><a href="javascript:void(0)">'+result[i]+'</a></li>';
 *			}
 *			return  html.join("");
 *		},
 *		//自定义suggest容器
 *		customerSuggestContainer:$E("inviteSuggest"),
 *		//如何访问到返回的数据数组
 *		hierarchyRelation:"s",
 *		//jsonp请求方式 与服务器端约定的参数名
 *		jsonpParamName:"cb",
 *		//对服务器端返回的字符串格式化 自定义html时无效
 *		keywordFormat:function(itemValue,keyword){
 *			
 *		},
        //选中某项时执行默认行为前的事件
 *		beforeItemSelected:function(){
 *		
 *		},
		//选中某项时执行默认行为后的事件
 *		afterItemSelected:function(){
 *		}
 *   });
 *  
 * @author zhangkai2@staff.sina.com.cn
 */
Ui.Suggest = function (options) {
	
	//支持函数形式调用
	if (!(this instanceof Ui.Suggest)) {
        return new Ui.Suggest(options);
    }
		
    this.options = options || {};

    //必添项检测
    this.requirementValidate();

    /**
     * 默认配置
     */
    this.defaultConfig = {
        enableLocalCache: true,
        delayQueryTime: 0,
        requestType: "blogScript",
        dataSourceURL: "",
        keywordParamName: "q",
        returnPropertyName: "keyword",
        suggestItemTagName: "tr",
        highlightClassName: "highlight",
        normalClassName: "",
        hierarchyRelation: "data",
		jsonpParamName:"callback",
		offsetX:0,
		offsetY:0,
		customSuggestContainerWidth:0
    };

    /**
     * 要绑定suggest功能的input元素
     */
    this.inputEle = options.inputEle;

    /**
     * 存储按键事件的键值
     */
    this.eventKeycode = "";

    /**
     * 最后一次匹配的文本
     */
    this.lastText = this.inputEle.value;

    /**
     * 当前高亮选择的suggest数据项的索引值
     */
    this.selectedSuggestIndex = -1;

    /**
     * suggest容器
     */
    this.suggestContainer = options.customerSuggestContainer;

    /**
     * suggest data本地缓存对象
     */
    this.localCache = {};

    /**
     * 客户端与服务器端通信对象  jsLoad对象或xmlHTTPRequest对象 用来abort请求
     */
    this.communicationObj;
	
	/**
     * 创建一个位于屏幕外的div，为了实现下拉框宽度的动态增加
     */
	this.calculateSuggestWidth = options.calculateSuggestWidth;

	/**
     * 去除首尾空格
     */
	
	this.trim = Core.String.trim;
	/**
     * 编译<>等代码
     */
	this.encodeHtml = Core.String.encodeHTML;
	
    this.initialize();
}

Ui.Suggest.prototype = {
	
    constructor: Ui.Suggest,
    /**
     * 必填项验证
     */
    requirementValidate: function () {

        var opt = this.options;

        if (!opt.inputEle || opt.inputEle.nodeType !== 1) throw new Error("要绑定的suggest input元素不能为空!");

        if (!opt.dataSourceURL) throw new Error("数据源url不能为空!");
    },

    /**
     * 初始化函数
     */
    initialize: function () {

        var __this = this;

        //更新配置信息
        Core.System.parseParam(this.defaultConfig, this.options);

        this.inputEle.setAttribute("autocomplete", "off");
		
		//检测输入框内的输入字数
		Xblog.Utils.limitLength(this.inputEle, 20, function(left){
			__this.checkWordNum(left);
		});
		
		Core.Events.addEvent(this.inputEle, function () {
            __this.inputCheck();
        }, "focus");

        //注册input失去焦点事件
        Core.Events.addEvent(this.inputEle, function () {
            __this.onBlurHandler();
        }, "blur");

        //注册input按键抬起事件
        Core.Events.addEvent(this.inputEle, function (e) {
            __this.onKeyUpHandler(e);
        }, "keyup");

        Core.Events.addEvent(this.inputEle, function (e) {
            __this.onKeyDownHandler(e);
        }, "keydown");

        Core.Events.addEvent(this.inputEle, function () {
            setTimeout(function () {
                __this.inputCheck();
            }, 1);
        }, "paste");

		//opera不支持paste事件 采用interval捕捉paste事件
		$OPERA && setInterval(function(){
			__this.inputCheck();
		},50);
		
        //suggestContainer初始化
        this.initSuggestContainer();
    },

    /**
     * SuggestContainer初始化
     */
    initSuggestContainer: function () {

        var sContainer = this.suggestContainer,
            css = [],
            __this = this,
            isCuctomer = true;

        if (!sContainer) {
            sContainer = this.suggestContainer = $C("div");
            isCuctomer = false;
        }

        sContainer.id = sContainer.id || "suggest_" + new Date().getTime();
        sContainer.style.position="absolute";
		sContainer.style.display="none";

        !isCuctomer && document.body.appendChild(sContainer);

		var opt = this.options,
			defaultStyle = opt.dafaultSuggestStyle || {};
        //添加默认suggest css
        if (!isCuctomer) {
            //TODO: 支持自定义字体,字体大小,字体颜色 高亮颜色等样式
            var idSelector = "#" + sContainer.id;
            css.push(idSelector + "{border:1px solid #817F82;position:absolute;}");
            css.push(idSelector + " table{width:100%;background:#fff;cursor:default}");
            css.push(idSelector + " td{font-size:"+defaultStyle.fontSize+";font-family:"+defaultStyle.fontFamily+";line-height:20px;text-indent:6px;color:"+defaultStyle.fontColor+";padding:1px}");
            css.push(idSelector + " .highlight{background-color:"+(defaultStyle.highlightColor?defaultStyle.highlightColor:"#E2EAFF")+"}");
            css.push(idSelector + " .normal{background-color:"+(defaultStyle.normalColor?defaultStyle.normalColor:"#fff")+"}");

            Utils.Io.loadCss({text: css.join("")});
			
			sContainer.style.zIndex = defaultStyle.zIndex;
        }

        //计算suggestContainer 宽
        this.calculateContainerWidth();

        var pos = Core.Dom.getStyle(sContainer.parentNode, "position");
        //如果是自定义html  且container父元素不是body 且position为relative或absolute
        //则认为container位置已准备好  放弃默认计算位置和注册window resize
        if (isCuctomer && sContainer.parentNode.tagName !== "body" && (pos === "relative" || pos === "absolute")) {
            return;
        }

        //计算suggestContainer 位置 
        this.calculateContainerPos();

        //window resize
        Core.Events.addEvent(window, function () {
            __this.calculateContainerWidth();
            __this.calculateContainerPos();
        }, "resize");
    },

    /**
     * 根据suggest input计算suggest container位置
     */
    calculateContainerPos: function () {
        var input = this.inputEle,
            pos = Core.Dom.getXY(input),
            sContainer = this.suggestContainer,
			opt = this.defaultConfig;
        sContainer.style.top = pos[1] + (typeof opt.offsetY === "number" ? opt.offsetY : 0) + input.offsetHeight + "px";
        sContainer.style.left = pos[0] + (typeof opt.offsetX === "number" ? opt.offsetX : 0) + "px";
    },

    /**
     * 根据suggest input计算suggest container宽
     */
    calculateContainerWidth: function () {
		var opt = this.defaultConfig,
			sContainer = this.suggestContainer,
			opt = this.defaultConfig;
		if(typeof opt.customSuggestContainerWidth === "number" && opt.customSuggestContainerWidth>0){
			sContainer.style.width = opt.customSuggestContainerWidth + "px";
			return;
		}
		
        var input = this.inputEle,
            borderLeftWidth = parseInt(Core.Dom.getStyle(sContainer, "borderLeftWidth") || 0),
            borderRightWidth = parseInt(Core.Dom.getStyle(sContainer, "borderRightWidth") || 0),
            paddingLeftWidth = parseInt(Core.Dom.getStyle(sContainer, "paddingLeft") || 0),
            paddingRightWidth = parseInt(Core.Dom.getStyle(sContainer, "paddingRight") || 0);
        sContainer.style.width = input.offsetWidth - borderLeftWidth - borderRightWidth - paddingLeftWidth - paddingRightWidth + "px";
    },

    /**
     * input keydown事件处理函数
     * @param {Object} e 事件对象
     */
    onKeyDownHandler: function (e) {

        var keyCode = this.eventKeycode = e.keyCode || e.which;

        //处理上 下按键
        if (keyCode === 38 || keyCode === 40) {
            //防止chrome下 按上下键时光标左右移动
            Core.Events.stopEvent(e);
            this.handleKeyUpDown();
        }
    },

    /**
     * input 上下按键处理函数
     */
    handleKeyUpDown: function () {
        if (this.suggestContainer.style.display === "none") return;
        this.highlightItem(parseInt(this.selectedSuggestIndex) + (this.eventKeycode === 40 ? 1 : -1));
    },

    /**
     * 为选中suggest数据项添加高亮效果
     * @param {Number} suggestIndex 当前选中suggest数据项的索引值
     */
    highlightItem: function (suggestIndex) {

        var list = $T(this.suggestContainer, this.defaultConfig.suggestItemTagName),
            i, l = list.length;
        for (i = 0; i < l; i++) {
            this.delClass(list[i], this.defaultConfig.highlightClassName);
        }

        if (suggestIndex < 0) suggestIndex = l - 1;

        if (suggestIndex > l - 1) suggestIndex = 0;

        this.addClass(list[suggestIndex], this.defaultConfig.highlightClassName);
        this.selectedSuggestIndex = suggestIndex;
    },

    /**
     * input keyup事件处理函数
     * @param {Object} e 事件对象
     */
    onKeyUpHandler: function (e) {

        this.eventKeycode = e.keyCode || e.which;

        //处理回车按键
        if (this.eventKeycode === 13) {
			if(this.selectedSuggestIndex >= 0){
				this.selectItem($T(this.suggestContainer, this.defaultConfig.suggestItemTagName)[this.selectedSuggestIndex]);
            	return;
			}else{
				//没选中suggest数据 按了回车 执行自定义事件
				var opt= this.options;
				typeof opt.unselectedEnter === "function" && opt.unselectedEnter();
			}
        }
        this.inputCheck();
    },
	/**
	 * 鼠标或回车选中某项
	 * @param {HTMLElement} item 选中的dom元素
	 */
	selectItem:function(item){
		var opt=this.options,
			beforeFun=opt.beforeItemSelected,
			afterFun=opt.afterItemSelected,
			isContinue=true;
		var list = $T(this.suggestContainer, this.defaultConfig.suggestItemTagName),l = list.length;
		
		var value = this.inputEle.value;
		/*跳转的时候对于特殊符号都需要转义，但是/不可以转义*/
		value = this.trim(value)
		value = encodeURIComponent(value);
		value = value.replace(/%2F/g,"/");
		if (scope.$isEditor){
			if (this.selectedSuggestIndex == 0){
				isContinue = false;
				this.gotoTagPage($_GLOBAL.DOMAIN_CORE +"tag/"+ value);
				return;
			}
			if (this.selectedSuggestIndex == (l-1)){
				isContinue = false;
				this.gotoTagPage($_GLOBAL.DOMAIN_CORE +"search/"+ value)
				return;
			}
		}
		//如果定义了beforeItemSelected事件  执行改事件 如果改事件返回false return
		typeof beforeFun === "function" && (isContinue=beforeFun());
		
		if(isContinue===false){
			return;
		}
		
		//默认行为
		this.lastText = this.inputEle.value = item.getAttribute("key");
        this.hideSuggestContainer();
		this.selectedSuggestIndex=-1;
		
		typeof afterFun === "function" && afterFun();
	},
    /**
     * 检测input value是否已被更新
     * 如果更新 则按照input当前值 获得suggest数据
     */
    inputCheck: function () {
		//去掉首尾空格;编码keyword;
        var val = this.inputEle.value;
		val = this.trim(val);
        if (this.lastText !== val) {
            this.lastText = val;
            if (val){
				val = encodeURIComponent(val);
				this.getSuggestDataByKeyword(val);
			}else {
                this.setTimeoutObj && clearTimeout(this.setTimeoutObj);
                this.communicationAbort();
                this.hideSuggestContainer();
            }
        }else {
			if (val != ""){
				if (this.suggestContainer.innerHTML != ""){
					this.showSuggestContainer();
				}
			}else{
				this.setTimeoutObj && clearTimeout(this.setTimeoutObj);
                this.communicationAbort();
                this.hideSuggestContainer();
            }
        }
    },

    /**
     * 根据关键字搜索数据
     * @param {String} keyword
     * @return {Array} 符合条件的对象集合
     */
    getSuggestDataByKeyword: function (keyword) {
        this.setTimeoutObj && clearTimeout(this.setTimeoutObj);
        if (this.defaultConfig.enableLocalCache && this.localCache[keyword]) {
            this.getDataFromServerCallback(this.localCache[keyword],keyword);
        } else {
            var __this = this;
            this.setTimeoutObj = setTimeout(function () {
                __this.getDataFromServer(keyword);
            }, this.defaultConfig.delayQueryTime);
        }
    },

    /**
     * 从服务器端获得数据
     * @param {String} keyword
     */
    getDataFromServer: function (keyword) {
		
        var tempParamObj = this.options.paramObj && Core.Class.extend({}, this.options.paramObj) || {},
            __this = this,
            opt = this.defaultConfig;

        this.communicationAbort();

        tempParamObj[Math.random() + ""] = "nocache";
        tempParamObj[opt.keywordParamName] = keyword;
		if (scope.$isEditor){
			tempParamObj["fts"] = 1;	//小编要在列表中去掉查询词
		}

        if (opt.requestType === "blogScript" || opt.requestType === "jsonp") {
			var options={
                onComplete: function (result) {
                    __this.getDataFromServerCallback(result, keyword);
                },
                GET: tempParamObj,
                type: opt.requestType
            };
			
			opt.requestType === "jsonp" && (options.jsonpParamName=opt.jsonpParamName);
            this.communicationObj = new Utils.Io.TimeoutJsLoad(opt.dataSourceURL,options);
        } else {
            this.communicationObj = Utils.Io.Ajax.request(opt.dataSourceURL, {
                onComplete: function (result) {
                    __this.getDataFromServerCallback(result, keyword);
                },
                returnType: "json",
                GET: tempParamObj
            });
        }
    },

	/**
	 * 从服务器端获得数据 回调函数
	 * @param {Object} result	服务器端返回数据
	 * @param {String} keyword  当前关键字
	 */
    getDataFromServerCallback: function (result, keyword) {
		this.clearSuggestData();
        if (result) {
            //根据层级关系 取匹配到的数据数组
            var hierarchy = this.defaultConfig.hierarchyRelation.split("."),
                res, i;
            for (i = 0; i < hierarchy.length; i++) {
                res = (res && res[hierarchy[i]]) || result[hierarchy[i]];
            }
			var flag = scope.$isEditor || (res.length > 0);//小编和普通用户结构不一样，res.length == 0 ，也可以出现下拉框
            if (res && Object.prototype.toString.apply(res) === "[object Array]" && flag) {
                this.defaultConfig.enableLocalCache && (this.localCache[keyword] = result);
                this.createSuggestList(res,keyword);
            }
        } else {
            this.hideSuggestContainer();
        }
    },

    /**
     * 创建suggest list
     * @param {Array} suggestArr 数据对象数组
     * @param {String} keyword  当前关键字
     */
    createSuggestList: function (suggestArr, keyword) {

        var opt=this.options, 
			customerFun = opt.customerCreateSuggestListFun,
			formatFun=opt.keywordFormat,
            customerHTML = "",
            __this = this,
            i;
        //如果自定义了创建suggest列表函数 且执行返回不为空的字符串  则不执行默认行为
        if (typeof customerFun === "function" && (customerHTML = customerFun(suggestArr,keyword))) {
            this.suggestContainer.innerHTML = customerHTML;
        } else {
            var sTable = $C("table"),
                sTbody = $C("tbody");
            sTable.cellSpacing = 0;
            sTable.appendChild(sTbody);
            for (i = 0; i < suggestArr.length; i++) {
                var row = sTbody.insertRow(-1),
                    cell = row.insertCell(-1),
                    key = typeof suggestArr[i] === "string" ? suggestArr[i] : suggestArr[i][this.defaultConfig.returnPropertyName],
					formatValue = key;
                row.id = "suggestItem_" + i;
				
				//定义了关键格式化 格式化服务器端返回数据
				typeof formatFun === "function" && (formatValue=formatFun(key,keyword));
				
                row.setAttribute("key", key);
                cell.innerHTML = formatValue;
                sTbody.appendChild(row);
            }
            this.suggestContainer.appendChild(sTable);
        }
		setTimeout(function(){
			__this.attachEvents();
			__this.selectedSuggestIndex = 0;
			__this.showSuggestContainer();
			__this.highlightItem(0);
		}, 5);   
    },

    /**
     * 为suggest item添加相关事件
     */
    attachEvents: function () {
        var list = $T(this.suggestContainer, this.defaultConfig.suggestItemTagName),
            i, l = list.length,
            __this = this;
        for (i = 0; i < l; i++) {
            (function (item) {
                //为suggest数据所在行 注册鼠标滑过事件
                Core.Events.addEvent(item, function (e) {
                    __this.suggestItemMOverHandlder(e, item);
                }, "mouseover");

                //为suggest数据所在行 注册鼠标按下事件
                Core.Events.addEvent(item, function (e) {
                    __this.suggestItemMDownHandlder(e, item);
                }, "mousedown");

				//modified by gaolei 需求更改，当鼠标离开到suggest外面时，不修改class
                //为suggest数据所在行 注册鼠标滑出事件
                //Core.Events.addEvent(item, function (e) {
                //    __this.suggestItemMOutHandlder(e, item);
                //}, "mouseout");
            })(list[i]);
        }
    },
    /**
     * suggest数据项鼠标按下事件处理函数
     * @param {Object} e 事件对象
     */
    suggestItemMDownHandlder: function (e, item) {
        this.selectItem(item);
    },

    /**
     * suggest数据项鼠标浮上事件处理函数
     * @param {Object} e 事件对象
     */
    suggestItemMOverHandlder: function (e, item) {
        this.highlightItem(parseInt(item.id.split("_")[1]));
    },

    /**
     * suggest数据项鼠标离开事件处理函数
     * @param {Object} e 事件对象
     */
    suggestItemMOutHandlder: function (e, item) {
		this.delClass(item, "current");
        this.selectedSuggestIndex = -1;
    },

    /**
     * input 失去焦点事件函数
     */
    onBlurHandler: function () {
        this.hideSuggestContainer();
    },

    /**
     * 显示suggest列表
     */
    showSuggestContainer: function () {
        this.suggestContainer.style.display = "";
    },

    /**
     * 隐藏suggest列表
     */
    hideSuggestContainer: function () {
        this.suggestContainer.style.display = "none";
    },

    /**
     * abort请求
     */
    communicationAbort: function () {
        var communicationObj = this.communicationObj;
		//ie6下 直接读取communicationObj.abort报错 所以改用typeof
        communicationObj && (typeof communicationObj.abort !== "undefined" ? communicationObj.abort() : communicationObj.abortRequest());
    },
	/**
	 * 清除suggest数据
	 */
	clearSuggestData:function(){
		var container=this.suggestContainer;
		container.style.display="none";
		container.innerHTML = "";
	},
	/**
	 * 检测数据长度
	 */
	checkWordNum:function(left){
		//去掉首尾空格
		var div = this.calculateSuggestWidth;
		var val = this.inputEle.value;
		val = this.trim(val);
		var len = val.length;
		if (len > 10){
			var val = val.slice(0,10);
			val += "...";
		}
		div.innerHTML = this.encodeHtml(val);
		var width = div.offsetWidth + 108 + 30;
		if (width > 147){
			this.suggestContainer.style.width = width + "px";
		}
	},
	/**
	 * 为节点添加 class，若有就不加，class 不重复。
	 */
	addClass: function(dom, clz){
		if(!dom){ return false; }
		if(!this.hasClass(dom, clz)){
			dom.className = this.trim(dom.className.concat(" " + clz));
		}
	},
	/**
	 * 被指定的 class 将全部删除，保证该 class 不会存在。
	 */
	delClass: function(dom, clz){
		if(!dom){ return false; }
		var reg = new RegExp("( +|^)" + clz + "(?=( |$))", "ig");
		dom.className = this.trim(dom.className.replace(reg, ""));
	},
	/**
	 * 该节点是否有指定的 class
	 */
	hasClass: function(dom, clz){
		if(!dom){ return false; }
		var reg = new RegExp("( +|^)" + clz + "(?=( |$))", "ig");
		return reg.test(dom.className);
	},
	/**
	 * 模拟a标签新开页面
	 */
	gotoTagPage: function(url){
		var referLink = document.createElement('a');
		referLink.href = url;
		referLink.target = "_blank";
		document.body.appendChild(referLink);
		
		if ($IE){
			referLink.click();  
		} else {
			var evt;
			if(/Mobile/i.test(navigator.userAgent)){
				evt = document.createEvent('HTMLEvents');
			}else{
				evt = document.createEvent('MouseEvents');
			}
			evt.initEvent("click",true,true);
			referLink.dispatchEvent(evt);  
		}

		setTimeout(function(){
			document.body.removeChild(referLink);
		}, 30);
	}
};