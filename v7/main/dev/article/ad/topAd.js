/**
 * @fileoverview	托盘顶部通栏广告
 * @author			dcw1123 | chengwei1@staff.sina.com.cn
 */
$import("lib/680/_blogAd.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/removeEvent.js");
$import("sina/core/system/br.js");
$import("sina/ui/tween/tweenStrategy.js");
$import("lib/templateUtils.js");
$import("lib/oop2.js");
$import("lib/checkAuthor.js");
$import("lib/commonLog.js");
$import("sina/utils/cookie/setCookie.js");
$import("sina/utils/cookie/getCookie.js");
$import("other/sinaflash.js");

blogAd.TopAd = function(oParam){				// flash 和 img 两种
	Lib.checkAuthor();
	if($isAdmin || !blogAd.getInitPermission(oParam)) return;
	this.oParam = oParam = oParam.ads[0];
	this.AD_HEIGHT = oParam.height || 45;
	this.MARK_ID = 0;
	this.LIMITED = 24;
	var __this = this;
	var __relNode = $E("trayFlashConnetion").parentNode;
	var __template = [
	'<div style="position:absolute;width:100%; height:'+this.AD_HEIGHT+'px;" id="#{entity}">',
		'<div style="width:950px; z-index:1000; margin:0 auto; position:relative;" id="#{content}">',
//			'<a style="z-index:1021; position:absolute; right:0; bottom:0; display:block; cursor:pointer;" herf="#" onclick="return false;" id="#{btnCls}">',
//				'<img src="http://d1.sina.com.cn/shh/tianyi/bg/audi_zty_cls1.jpg" style="width:40px; height:18px;" alt="" />',
			'</a>',
		'</div>',
	'</div>'].join("");
	
	this.placeholder = this.createNode("<div style='font-size:0; height:0; width:100%; background-color:#F7F7F7;'> </div>");
	this.nodes = this.getTemplateNodes(__template);
	document.body.insertBefore(this.nodes.entity, __relNode);
	document.body.insertBefore(this.placeholder, __relNode);
	
	if (oParam.type == "swf"){
		var cd = document.createElement("DIV");
		cd.id="adcontent32333329";
		this.nodes.content.appendChild(cd);
		this.appendSwf(oParam.ref, "", oParam.width, oParam.height, cd.id);
	} else if (oParam.type == "iframe"){
        this.nodes.content.appendChild(
			this.createNode('<iframe frameborder="0" scrolling="no" allowtransparency="yes"  src="'
                + (oParam.ref || "newzhaitong.jpg")
                + '" style="width:950px; height:'
                + this.AD_HEIGHT + 'px;" alt="" />')
		);
    } else {
		this.nodes.content.appendChild(
			this.createNode('<img src="'+(oParam.ref||"newzhaitong.jpg")+'" style="width:950px; height:'+this.AD_HEIGHT+'px;" alt="" />')
		);
	}
	if(oParam.click){
		this.nodes.content.style.position = "relative";
		this.nodes.cantSeeMe = this.createNode('<a href="#" target="_blank"></a>');
		this.nodes.cantSeeMe.href = oParam.click;
		this.nodes.cantSeeMe.style.cssText
		= ($IE?"filter:alpha(opacity=0);":"opacity:0")
		+ "; height:"+this.AD_HEIGHT+"px; width:950px; background:#F00; display:block;"
		+ "z-index:1020; position:absolute; left:0; top:0;";
		this.nodes.content.appendChild(this.nodes.cantSeeMe);
	}

	if(!this.isMarked()){
		__this.show();
		// 统计展现
		if(oParam.status && oParam.status.adstart){
		    new Image().src = oParam.status.adstart;
        }
        //liming9-2012年7月18日 添加好耶代码统计 88888
        commonLog('http://1093.adsina.allyes.com/main/adfshow?user=AFP6_for_SINA|2012_add|2012_blog_tjbw_dbsxtl&db=sina&border=0&local=yes&js=ie');
	}
	
}.$defineProto({
	
	appendSwf:function(url, id, width, height, targetId){
		// V_movie, x_id, X_width, Z_height, v_version, z_bgColor, i_useExpressInstall, c_quality, I_xir, l_redirectUrl, o_detectKey
		if(typeof sinaFlash == "undefined") return;
		var sinaFlash2 = new sinaFlash(
			url,							//flash 的地址
			id,								//写入到页面后的 object id。
			width+"",						//宽
			height+"",						//高
			"9",							//flash 版本
			"#FFFFFF",						//flash 背景色
			false,							//是否使用 flash 快速升级
			"High",							//清晰度
			"http://www.sina.com.cn/",		//快速升级 url
			"http://www.sina.com.cn/",		//快速升级重定向 url
			false							//是否检测flash
		);
		sinaFlash2.addParam("allowScriptAccess", "always");		//是否允许脚本互访
		sinaFlash2.addParam("wmode", "transparent");			//透明度，FF 下使用 window 模式。解决输入法问题。
		// 现在改回transparent，因为window模式的flash，会遮盖js对话框，如果用原生alert，win7下的FF会停止响应
		sinaFlash2.write(targetId);			//写入容器的 id。
	},
	
	isMarked:function(){
		var __coo = decodeURIComponent(Utils.Cookie.getCookie("blogAdRecord"));
		if(__coo){
			var __arr = __coo.split(",");
			//trace("topAd: "+__arr.join(","));
			return this.getCurHours()-__arr[this.MARK_ID] < this.LIMITED;		// 小于就是在限制内，标记 true。
		}else{
			return false;
		}
	},
	
	setMark:function(){			// top,left,comment
		var __arr;
		var __coo = decodeURIComponent(Utils.Cookie.getCookie("blogAdRecord"));
		if(__coo){
			__arr = __coo.split(",");
		}else{
			__arr = [0,0,0,0,0,0,0];
		}
		__arr[this.MARK_ID] = this.getCurHours();
		//trace("topAd: "+__arr.join(","));
		Utils.Cookie.setCookie("blogAdRecord", __arr.join(","), 2400, "/", ".blog.sina.com.cn");
	},
	
	getCurHours:function(){
		var ms = new Date().getTime();
		return parseInt(ms/3600000, 10);
	},
	
	createNode:function(txt){
		var _box = $C("div");
		_box.innerHTML = txt;
		return _box.childNodes[0];
	},

	show:function(){
		var tweenNum;
		var __this = this;
		var __entity = this.nodes.entity;
		var __placeholder = this.placeholder;
        Lib.Listener.notify('topad680-show-start', {}); //广告出来前先对外发广播便于浮动层关闭   
		tweenNum = new Ui.TweenStrategy(this.AD_HEIGHT, 0, 0.7, function(t, b, c, d){
            // 不能玩负数。嚓。
			// return c*((t=t/d-1)*t*t*t*t+1)+b;
			return -c*(t/=d)*(t-2)+b;
		});
		tweenNum.onTween = function(val){
			__entity.style.top = -val+"px";
            var height = __this.AD_HEIGHT-val;
			__placeholder.style.height = height+"px";
            
            if(blogAd.trayAdHandle && blogAd.trayAdHandle.nodes){
                blogAd.trayAdHandle.setPos();
            }
            __this._updateRandomPos(__this.AD_HEIGHT-val+30);
            __this._updateNewTipsPos(height+23);
            __this._updateErrorTipsPos(height+27);
		};
		tweenNum.onEnd = function(){
            __this._updateRandomPos(__this.AD_HEIGHT+30);
            __this._updateNewTipsPos(__this.AD_HEIGHT+23);
            __this._updateErrorTipsPos(__this.AD_HEIGHT+27);
            Lib.Listener.notify('topad680-show-end', {}); 
		};
		
		tweenNum.start();
	},
	
	hide:function(){
		var tweenNum;
		var __this = this;
		var __entity = this.nodes.entity;
		var __placeholder = this.placeholder;
		tweenNum = new Ui.TweenStrategy(0, this.AD_HEIGHT, 0.7, function(t, b, c, d){
			// return c*((t=t/d-1)*t*t*t*t+1)+b;
			return -c*(t/=d)*(t-2)+b;
		});
		tweenNum.onTween = function(val){
			__entity.style.top = -val+"px";
            var height = __this.AD_HEIGHT-val;
			__placeholder.style.height = __this.AD_HEIGHT-val+"px";
            if(blogAd.trayAdHandle && blogAd.trayAdHandle.nodes){
                blogAd.trayAdHandle.setPos();
            }
            __this._updateRandomPos(__this.AD_HEIGHT-val+30);
            __this._updateNewTipsPos(height+23);
            __this._updateErrorTipsPos(height+27);
		};
		tweenNum.onEnd = function(){
			__entity.style.display = "none";
			$IE6 && Core.Events.removeEvent(window, __this.handleScroll, "scroll");
            __this._updateRandomPos(30);
            __this._updateNewTipsPos(23);
            __this._updateErrorTipsPos(27);
		};
		if($IE6){
			tweenNum.onTween = function(val){
				__entity.style.top = -val+document.documentElement.scrollTop+"px";
				__placeholder.style.height = __this.AD_HEIGHT-val+"px";
			};
		}
		tweenNum.start();
	},
    // 同步更新随便逛逛的位置
	_updateRandomPos : function(height){
        var rndv = $E('ramdomVisitDiv');
        if(rndv){
            rndv.style.top = height+'px'; //随便逛逛已经加载
        }else{
            scope._AD_HEIGHT = height; //随便逛逛后加载，则放这个高度让随便逛逛加高
        }
    },

    _updateNewTipsPos : function(height){
        
        var tipsEl = $E('newStatusTip');
        if (tipsEl){
            tipsEl.style.top = height + 'px';
        }
        
    },

    _updateErrorTipsPos : function(height){
        var tipsEl = $E('err_i8t9c');
        if (tipsEl){
            tipsEl.style.top = height + 'px';
        }
    }


	
}).$mixProto(Lib.templateUtils);

