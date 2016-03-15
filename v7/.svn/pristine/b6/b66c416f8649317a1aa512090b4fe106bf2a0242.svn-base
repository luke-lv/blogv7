/*
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 */
/** 
 * @fileoverview 用户本地缓存数据类
 * @author 武建 | zouwujian@gmail.com
 * 保存形式：{key:key,data:"something",time:时间戳} 
 * 保存在用户电脑 C:\Documents and Settings\Administrator\Application Data\Macromedia\Flash Player\#SharedObjects\
 * 注意问题：flash加载较慢的时候 可能无法使用 set、get 返回false
 *          最好在使用前判断Lib.LocalDB.isFlashReady是否为真,且最好有获取数据的备选方式
 *          
 * 使用方法示例, "name" 为key ,100为过期时间毫秒,"wujian"为数据
 * 
 *    获取数据->		 if (Lib.LocalDB.isFlashReady) {  var  t = Lib.LocalDB.get("name", 100);  }
 *            或者添加强制升级为主机的true值 注意, 在数据未过期的时候 强制升级为主机无效,且强制升级不将原来的主机取消
 *             		 if (Lib.LocalDB.isFlashReady) {  var  t = Lib.LocalDB.get("name", 100, true);  } 
 *    获取数据返回值, 1 无数据 返回"0"
 *    				 2 数据过期，升级为主机 返回"0"
 *    				 3 数据过期，已存在主机 返回缓存数据
 *                   此外，返回缓存数据
 *    存储数据->  if (Lib.LocalDB.isFlashReady) {   Lib.LocalDB.set("name", "wujian");} //存储时空间不足会自动删除已有的数据，可能会是不久前保存的
 *        注意, 存储数据时 最好不要存 name=“0” 这样的 会 与缓存返回值 冲突  建议存成 name=“n0”
 *        经变态测试, 存储 "data"+i="数据"+i 大约2681条
 *    清除过期数据->  Lib.LocalDB.clearCache(10) 差不多清除所有保存超过10毫秒的数据  慎用！！！
 *                  Lib.LocalDB.clearCache(10,"key") 如果 "key"="something"的数据保存超过10毫秒 则删除
 *      Arthropod调试密码: CDC309AF
 *     
 *      注册函数-> Lib.LocalDB.registerFun(function(a,b){alert(a);alert(b);},[1,2]);函数参数为可选
*					Lib.LocalDB.registerFun(function(a,b){alert(a);alert(b);},[3,4]);
*					当flash加载好后立即执行，需要使用this，请在参数中当作变量传入,
 *      
 */
$import("sina/sina.js");
$import("sina/utils/flash/swfObject.js");
$import("sina/core/math/getUniqueId.js");
$import("sina/core/system/br.js");

Lib.LocalDB = {  
	_this:null,  
    isFlashReady: false,
	FlaDom:null,
	updataFun:null,//更新数据函数
	loadedFun:null,//可以设置flash加载之后 要执行的函数，目前专用于 本地通讯
	regiFun:[], //注册的函数
	regiFunArgs:[],//对应注册函数的参数
    scacheReady: function(){   
		var me=Lib.LocalDB;   
        me.isFlashReady = true;  
		if(me.loadedFun){//如果存在 设置的flash 加载后要执行的函数 则执行呗
			me.loadedFun(me._this);
		}  
		
		var f=me.regiFun;
		var a=me.regiFunArgs;
		for(var i=0;i<f.length;i++){
			f[i].apply(null,a[i]);
		}
    },
	registerFun:function(fun,args){
		
		this.regiFun.push(fun);	
		var a=args||[];
		this.regiFunArgs.push(a);	
	},
    set: function(key, data){ 
        if (this.isFlashReady) {
			try{
				this.FlaDom.setLazyInterface(key, data);
				return true;	
			}catch(e){
				trace("set函数出错");
			}
            	
        }
        return false;       
    },
    get: function(key, escapeMsecond, ignore){
        if (this.isFlashReady) {
			try{
				return this.FlaDom.getLazyInterface(key, escapeMsecond,ignore);       
			}catch(e){
				trace("get函数出错");
			}  
        }
        return false;       
    },
	clearCache:function(escapeMsecond,key){
		if (this.isFlashReady) {   
			try{
				$E("scache").clearCache( escapeMsecond,key);
			}catch(e){
				trace("gclearCache函数出错");
			}		       
  		}
        return false;   
	},
    loadFlash: function(containerDiv){
      
       /* if (!$E("scacheBox")) {
            var newDiv = document.createElement("div");
            newDiv.id = "scacheBox";			
			newDiv.style.cssText="position:absolute;left:0px;top:0px;width:0px"
            document.body.insertBefore(newDiv, document.body.firstChild);
        }      */
		var random="";
		
		if(window.$Maxthon||window.$360||window.$TT){
			random="?t="+Core.Math.getUniqueId();
		}
		if (!this.FlaDom) {// flash已经加载 使用同一个flash
			var FlashPlayer = new Utils.Flash.swfObject($_GLOBAL.flashBasicURL + "scache.swf"+random, "scache", "1", "1", "9", "#00ff00");
			
			FlashPlayer.addParam("quality", "high");
			FlashPlayer.addParam("wmode", "transparent");
			FlashPlayer.addParam("allowScriptAccess", "always");
			//FlashPlayer.addVariable("readyFun", readyFun);
			FlashPlayer.write(containerDiv);
			
			this.FlaDom = $E("scache");
			
		}
		
    },
	getServer:function(){
		try{
			return this.FlaDom.isServer();//判断是否是 通信主机
		}catch(e){
			trace("判断是否是通信主机发生错误");
			return false;
		}
	},
	login:function(uid){
		try{
			this.FlaDom.login(uid);
		}catch(e){
			trace("login函数出错");
			trace(uid);
		}
	},
	sendToClient:function(data){
		try{
			if (this.getServer()) {
				this.FlaDom.sendToClient(data);
			}else{
				//trace("非主机不可以发送数据");
			}
		}catch(e){
			trace("sendToClient函数出错");
		}
	},
	setClientJsFun:function(jsFun){
		try{
			if (this.getServer()) {
				this.FlaDom.setClientJsFun(jsFun);
			}else{
				trace("非主机不可以设置接收函数");
			}
		}catch(e){
			trace("setClientJsFun函数出错");
		}
	},
	receive:function(data){
		this.updataFun(data);
		
	}
    
    
};
//Lib.LocalDB.loadFlash(); 取消导入LocalDB.js 则自动加载 flash，需要手动加载 
