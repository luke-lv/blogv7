
$import("sina/utils/io/_io.js");
$import("sina/core/function/bind2.js");
$import("sina/core/dom/getElementsByClass.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/removeEvent.js");
$import("sina/core/string/encodeDoubleByte.js");
$import("sina/core/string/j2o.js");
$import("sina/utils/url.js");


// 改版的 ijax，添加延时处理，timeout 参数
/*
Utils.Io.Ijax_2.request(aUrl, {
	GET:{},								// GET 参数
	POST:{},							// POST 参数
	timeout: 15000,						// 15s 无返回就算延时
	onComplete:function(res){
		if(res.code == "A00006"){		// 接口返回成功
			
		}
		else{							// 接口返回失败
			
		}
	},
	onException:function(res){
		if(res == "timeout"){			// 接口延时
			
		}
		else{							// 其他接口访问异常
			
		}
	}
});
*/

Utils.Io.Ijax_2 = {
	
	arrTaskLists : [],				// 保存缓冲的任务列表
	loadFrames : null,				// 保存生成的 iframe 的 id
	loadingIframe : null,			// 保存生成的 iframe 节点和其对应加载状态
	
	
	// 处理请求参数接收
	request: function(url, option){
		var oTask = {};
		oTask.url = url;
		oTask.option = option || {};
		this.arrTaskLists.push(oTask);
		
		if(this.loadFrames == null){
			this.createLoadingIframe();			// to loadByList()
		}else{
			this.loadByList();
		}
	},
	
	
	// 创建 iframe 节点用于载入数据，因为支持双线程，同时建立两个，减少 DOM 操作次数
	createLoadingIframe: function(){
		if(this.loadFrames != null){
			return false;
		}
		
		// 生成随机 ID 来保证提交到当前页面的数据交互 iframe
		var rndId1 = "loadingIframe_thread" + Math.ceil(Math.random() * 10000);
		var rndId2 = "loadingIframe_thread" + Math.ceil((Math.random() + 1) * 10000);
		this.loadFrames = [rndId1, rndId2];
		
		// 创建 Ijax 需要的 iframe
	    var html = '<iframe id="' + rndId1 +'" name="' + rndId1 +'" class="invisible"\
	              scrolling="no" src=""\
	              allowTransparency="true" style="display:none;" frameborder="0"\
	              ><\/iframe>\
				  <iframe id="' + rndId2 +'" name="' + rndId2 +'" class="invisible"\
	              scrolling="no" src=""\
	              allowTransparency="true" style="display:none;" frameborder="0"\
	              ><\/iframe>';
		var oIjaxIframeCnt = $C("div");
		oIjaxIframeCnt.id = "ijax_iframes";
		oIjaxIframeCnt.innerHTML = html;
		document.body.appendChild(oIjaxIframeCnt);
		
		// 记录两个 iframe 加载器，默认是空闲状态
		var loadTimer = setInterval(Core.Function.bind2(function(){
			if($E(this.loadFrames[0]) != null && $E(this.loadFrames[1]) != null){		//两 iframe 节点创建必须成功
				clearInterval(loadTimer);
				loadTimer = null;
				this.loadingIframe = {
					"thread1" : {
						"container" : $E(this.loadFrames[0]),
						"isBusy" : false
					},
					"thread2" : {
						"container" : $E(this.loadFrames[1]),
						"isBusy" : false
					}
				};		
				this.loadByList();
			}
		}, this), 10);
	},
	
	
	// 缓冲列表管理
	loadByList: function(){
		if(this.arrTaskLists.length == 0){			// 如果等待列表为空，则终止
			return false;
		}
		
		// 取得两个加载器的状态，看是否有空闲的
		var loadStatus = this.isIjaxReady();
		if(loadStatus == false){
			return false;
		}
		
		// 加载开始
		var newTask = this.arrTaskLists[0];
		this.loadData(newTask.url, newTask.option, loadStatus);
		
		// 删除列表第一条
		this.arrTaskLists.shift();
	},
	
	
	// 判断是否可以开始加载数据
	isIjaxReady: function(){
		if(typeof this.loadingIframe == "undefined"){			// 肯定是两个 iframe 节点可用的情况下
			return false;
		}
		
		for(var oLoadCnt in this.loadingIframe){
			if(this.loadingIframe[oLoadCnt].isBusy == false){	// iframe 空闲
				this.loadingIframe[oLoadCnt].isBusy = true;
				return this.loadingIframe[oLoadCnt];
			}
		}
		return false;			// iframe 繁忙
	},
	
	
	// 加载单条数据
	loadData: function(url, option, loader){
		var _url = new Utils.Url(url);
		var timer = 0;
		option.isTimeout = false;				// 超时判定
		
		// 有 GET 数据，拼接
		if(option.GET){
			for(var key in option.GET){
				_url.setParam(key, Core.String.encodeDoubleByte(option.GET[key]));
			}
		}
		
		// 接口设置 Domain
		_url.setParam("domain", "1");
		
		// 接口成型
		_url = _url.toString();
		
		// 当前用于加载数据的 iframe 对象
		var ifm = loader.container;
		ifm.listener = Core.Function.bind2(function(){
			try{
				var iframeObject = ifm.contentWindow.document;
				var sResult;
				
				// 临时函数
				var tArea = Core.Dom.byClz(iframeObject, 'textarea', '')[0];
				
				// 有 TEXTAREA 对象
				if(typeof tArea != "undefined"){
					sResult = tArea.value;
				}else{
					sResult = iframeObject.body.innerHTML;
				}
				
				// 解析结果
				if(typeof sResult == "string"){
					sResult = sResult.replace(/;$/, "");
				}
				sResult = (typeof sResult == "string" && (/\s*{/.test(sResult))) ? Core.String.j2o(sResult) : sResult;
				if(sResult != null && typeof sResult.code == "undefined"){
					return;
				}
				
				// 有回调，未超时
				if(option.onComplete && !option.isTimeout){
					clearTimeout(timer);
					option.onComplete(sResult);
				}
			}catch(e){
				// 有回调，未超时
				if(option.onException && !option.isTimeout){
					clearTimeout(timer);
					option.onException(e.message, _url.toString());
				}
			}
			loader.isBusy = false;
			Core.Events.removeEvent(ifm, ifm.listener, "load");
			this.loadByList();				// Next or 任务结束。
			
		}, this);
		
		Core.Events.addEvent(ifm, ifm.listener, "load");
		
		// 如果需要 POST 数据
		if(option.POST){
			var oIjaxForm = $C("form");
			oIjaxForm.id = "IjaxForm";
			oIjaxForm.action = _url;			// GET 参数
			oIjaxForm.method = "post";
			oIjaxForm.target = ifm.id; 
			
			for(var oItem in option.POST){		// 生成 POST 参数
				var value;
				if(option.noEncode){
					value = Core.String.encodeDoubleByte(option.POST[oItem]);
				}else{
					value = option.POST[oItem];
				}
				var oInput = $C("input");
				oInput.type = "hidden";
				oInput.name = oItem;
				oInput.value = value;
				oIjaxForm.appendChild(oInput);
			};
			
			document.body.appendChild(oIjaxForm);
			oIjaxForm.submit();
		}else{
			try{
				window.frames(ifm.id).location.href = _url;
			}catch(e){
				ifm.src = _url;
			}
		}
		
		// 超时处理
		if(option.timeout > 0){
			timer = setTimeout(function(){
				option.isTimeout = true;
				if(option.onException){
					option.onException("timeout");		// 必须要重定向一次才能 abort，且非缓存！这样会执行回调！注意！
					ifm.src = "http://simg.sinajs.cn/blog7style/images/common/loading.gif?t="+(new Date().getTime());
				}
			}, option.timeout);
		}
	}
};

