/**
 * @fileoverview 影视搜索数据 专用js请求连接（其它地方也是可以用的）
 * @author wujian wujian@staff.sina.com.cn
 * @create 2010-12-27
 */
scope.filmDataLoad=Core.Class.create();

scope.filmDataLoad.prototype={
	rand:null,//校验随机数
	//url:null,//初始url
	//newUrl:null,//当前新的url
	succ:null,
	error:null,
	time:0,
	start:null,
	/**
	 * 初始化函数
	 * @param {Object} url
	 * @param {Object} succ
	 * @param {Object} error
	 */
	initialize: function(succ,error){
		//this.url=url;//这个就不用默认值了吧
		this.succ=succ||function(){};
		this.error=error||function(){};
	},
	/**
	 * 发出请求
	 * @param  url   不带任何其他东西
	 * @param {Object} param {class:"",dis:"",year:""}
	 * @param num time 超时
	 */
	load:function(url,param,time){		
		//遍历 拼凑参数 包括rand
		param.callback="scope.filmCallback";
		param.rand=this.rand=parseInt(Math.random()*100000,10);	
		var tArray=[];
		for(var key in param){
			tArray.push(key+"="+param[key]);
		}
		
		url+="?"+tArray.join("&");//trace(url)
		//encodeURI
		this.start=new Date();
		this.time=time||30*1000;
		
		this._createScript(url);
	},
	/**
	 * 创建脚本 发出请求
	 * @param {Object} url
	 * @param {Object} time
	 */
	_createScript:function(url){
		var _this=this;
		scope.backFuns["fun" + this.rand] = {
			"fun": _this._scriptBack,
			"obj": _this
		};//回调中 判断超时
		var script = document.createElement("script");
		script.type = "text/javascript";
		script.src = encodeURI(url);
		//trace(encodeURIComponent(url))
		//encodeURIComponent
		script.charset = "utf-8";
		document.body.appendChild(script);
	},
	_scriptBack:function(data){//回调中 判断超时
		//trace(data.result.rand)
		//trace(this)
		if(data.result.rand!=this.rand){
			trace("数据校验出错！无用数据丢弃");
			return;
		}
		
		var n=new Date();
		if(n-this.start>this.time){
			trace("相应超时……");
			this.error(data);
			return;
		}
		//trace(this.succ)
		this.succ(data);//成功回调		
	}
};
scope.backFuns={};//"fun12312":function(){}
scope.filmCallback=function(data){
	//根据rand的值 查找 回调函数 最后删除引用
	if(!data||!data.result||!data.result.rand){//保证数据格式正确
		return;
	}
	var funId="fun"+data.result.rand;
	if(scope.backFuns[funId]&&typeof scope.backFuns[funId]=='object'){
		//a=function(){}
		//trace(scope.backFuns[funId]);
		
		scope.backFuns[funId]['fun'].call(scope.backFuns[funId].obj,data);
		delete scope.backFuns[funId];
	}	
};
