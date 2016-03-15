//合并文件
;(function(wnd, undefined){
// 博客广告推广工具前端投放JS
/**
 * 博客广告推广工具
 */
SinaBlog680 = {
    ver : '0.0.1'
}
/**
 * @fileoverview 通用方法
 * @authors yifei2 <yifei2@staff.sina.com.cn>
 */

SinaBlog680.utils = {};
SinaBlog680.cookie = {};


//html转dom
SinaBlog680.utils.htmlToDom = function(html) {
	var div = document.createElement('div');
    div.innerHTML = html;
    return div.childNodes;
};
//判断是否为空对象
SinaBlog680.utils.isEmptyObject = function(O){
  for (var x in O){
    return false;
  }
  return true;
};
//获取一定范围内随机整数
SinaBlog680.utils.getRandomInt = function(min, max) {
	return Math.floor((max-min+1)*Math.random()) + min;
};

/**
 * 读取cookie
 * @param {Object} cookie的名字
 * @return {String} cookie的值
 * @example
 * var value = Utils.Cookie.getCookie(name);
 */
SinaBlog680.cookie.getCookie = function (name) {
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
 * Utils.Cookie.setCookie('name','sina',null,"")
 */
SinaBlog680.cookie.setCookie = function (name, value, expire, path, domain, secure) {
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
 * 删除cookie
 * @param {String} name cookie名
 */
SinaBlog680.cookie.deleteCookie = function(name) {
	document.cookie = name + '=;' + 'expires=Fri, 31 Dec 1999 23:59:59 GMT;'; 
};
/**
 * @fileoverview 跨域调用接口读取数据
 * @authors yifei2 <yifei2@staff.sina.com.cn>
 */

SinaBlog680.jsload = {};

SinaBlog680.Url = function (url){
    url = url || "";
    this.url = url;
	this.query = {};
	this.parse();
};

SinaBlog680.Url.prototype = {
	/**
	 * 解析URL，注意解析锚点必须在解析GET参数之前，以免锚点影响GET参数的解析
	 * @param{String} url? 如果传入参数，则将会覆盖初始化时的传入的url 串
	 */
	parse : function (url){
		if (url) {
			this.url = url;
		}
	    this.parseAnchor();
	    this.parseParam();
	},
	/**
	 * 解析锚点 #anchor
	 */
	parseAnchor : function (){
	    var anchor = this.url.match(/\#(.*)/);
	    anchor = anchor ? anchor[1] : null;
	    this._anchor = anchor;
	    if (anchor != null){
	      this.anchor = this.getNameValuePair(anchor);
	      this.url = this.url.replace(/\#.*/,"");
	    }
	},
	
	/**
	 * 解析GET参数 ?name=value;
	 */
	parseParam : function (){
	    var query = this.url.match(/\?([^\?]*)/);
	    query = query ? query[1] : null;
	    if (query != null){
	      this.url = this.url.replace(/\?([^\?]*)/,"");
	      this.query = this.getNameValuePair(query);
	    }
	 },
	/**
	 * 目前对json格式的value 不支持
	 * @param {String} str 为值对形式,其中value支持 '1,2,3'逗号分割
	 * @return 返回str的分析结果对象
	 */
	getNameValuePair : function (str){
	    var o = {};
	    str.replace(/([^&=]*)(?:\=([^&]*))?/gim, function (w, n, v) {
	     	if(n == ""){return;}
	      	//v = v || "";//alert(v)
	     	//o[n] = ((/[a-z\d]+(,[a-z\d]+)*/.test(v)) || (/^[\u00ff-\ufffe,]+$/.test(v)) || v=="") ? v : (v.j2o() ? v.j2o() : v);
	    	o[n] = v || "";
		});
	    return o;
	 },
	 /**
	  * 从 URL 中获取指定参数的值
	  * @param {Object} sPara
	  */
	 getParam : function (sPara) {
	 	return this.query[sPara] || "";
	 },
	/**
	 * 清除URL实例的GET请求参数
	 */
	clearParam : function (){
	    this.query = {};
	},
	
	/**
	 * 设置GET请求的参数，当个设置
	 * @param {String} name 参数名
	 * @param {String} value 参数值
	 */
	setParam : function (name, value) {
	    if (name == null || name == "" || typeof(name) != "string") {
			throw new Error("no param name set");
		}
	    this.query = this.query || {};
	    this.query[name]=value;
	},
	
	/**
	 * 设置多个参数，注意这个设置是覆盖式的，将清空设置之前的所有参数。设置之后，URL.query将指向o，而不是duplicate了o对象
	 * @param {Object} o 参数对象，其属性都将成为URL实例的GET参数
	 */
	setParams : function (o){
	    this.query = o;
	},
	
	/**
	 * 序列化一个对象为值对的形式
	 * @param {Object} o 待序列化的对象，注意，只支持一级深度，多维的对象请绕过，重新实现
	 * @return {String} 序列化之后的标准的值对形式的String
	 */
	serialize : function (o){
		var ar = [];
		for (var i in o){
		    if (o[i] == null || o[i] == "") {
				ar.push(i + "=");
			}
			else {
				ar.push(i + "=" + o[i]);
			}
		}
		return ar.join("&");
	},
	/**
	 * 将URL对象转化成为标准的URL地址
	 * @return {String} URL地址
	 */
	toString : function (){
	    var queryStr = this.serialize(this.query);
	    return this.url + (queryStr.length > 0 ? "?" + queryStr : "") 
	                    + (this.anchor ? "#" + this.serialize(this.anchor) : "");
	},
	
	/**
	 * 得到anchor的串
	 * @param {Boolean} forceSharp 强制带#符号
	 * @return {String} 锚anchor的串
	 */
	getHashStr : function (forceSharp){
	    return this.anchor ? "#" + this.serialize(this.anchor) : (forceSharp ? "#" : "");
	}
};

function parseParam(oSource, oParams) {
	var key;
	try {
		if (typeof oParams != "undefined") {
			for (key in oSource) {
				if (oParams[key] != null) {
					oSource[key] = oParams[key];
				}
			}
		}
	}
	finally {
		key = null;
		return oSource;
	}
}

function encodeDoubleByte(str) {
	if(typeof str != "string") {
		return str;
	}
	return encodeURIComponent(str);
}

function processUrl(oOpts, oCFG) {
	var urls = oOpts.urls;
	var get_hash = oOpts.GET;
	
	var i, len = urls.length;
	var key, url_cls, varname, rnd;
	for (i = 0; i < len; i++) {
		rnd =  window.parseInt(Math.random() * 100000000);
		url_cls = new SinaBlog680.Url(urls[i].url);
		
		for(key in get_hash) {
			if(oOpts.noencode == true) {
				url_cls.setParam(key, get_hash[key]);
			}
			else {
				url_cls.setParam(key, encodeDoubleByte(get_hash[key]));
			}
		}
		
		varname = url_cls.getParam("varname") || "requestId_" + rnd;
		
		if (oOpts.noreturn != true) {
			url_cls.setParam("varname", varname);
		}
		
		oCFG.script_var_arr.push(varname);
		urls[i].url = url_cls.toString();
		urls[i].charset = urls[i].charset || oOpts.charset; 
	}
}

function createScripts(oOpts, oCFG) {
	processUrl(oOpts, oCFG);
		
	var urls = oOpts.urls;
	var i, len = urls.length;
	
	for(i = 0; i < len; i ++ ) {
		
		var js = document.createElement('script');

		js.src = urls[i].url;
		js.charset = urls[i].charset;
		js.onload = js.onerror = js.onreadystatechange = function () {
			if (js && js.readyState && js.readyState != "loaded" && js.readyState != "complete") {
				return;
			}
			oCFG.script_loaded_num ++;
			//清理script标记
			js.onload = js.onreadystatechange = js.onerror = null;
			js.src = "";
			js.parentNode.removeChild(js);
			js = null; 
		};
		document.getElementsByTagName("head")[0].appendChild(js);
	}
}

//跨域调用接口获取数据
function jsload(aUrls, oOpts) {
	var _opts = {
		urls: [],
		charset: "utf-8",
		noreturn: false,
		noencode: false,
		timeout: -1,
		POST: {},
		GET: {},
		onComplete: null,
		onException: null
	};
	
	var _cfg = {
		script_loaded_num: 0,
		is_timeout: false,
		is_loadcomplete: false,
		script_var_arr: []
	};
	
	_opts.urls = typeof aUrls == "string"? [{url: aUrls}]: aUrls;
	

	parseParam(_opts, oOpts);

	createScripts(_opts, _cfg);

	// 定时检查完成情况
	(function () {
		if (_opts.noreturn == true && _opts.onComplete == null) {
			return;
		}
		var i, data = [];
		// 全部完成
		if (_cfg.script_loaded_num == _opts.urls.length) {
			_cfg.is_loadcomplete = true;
			if (_opts.onComplete != null) {
				for(i = 0; i < _cfg.script_var_arr.length; i ++ ) {
					data.push(window[_cfg.script_var_arr[i]]);
				}
				if(_cfg.script_var_arr.length < 2) {
					_opts.onComplete(data[0]);
				}
				else {
					_opts.onComplete(data);
				}
			}
			return;
		}
		// 达到超时
		if(_cfg.is_timeout == true) {
			return;
		}
		setTimeout(arguments.callee, 50);
	})();
	
	// 超时处理
	if(_opts.timeout > 0) {
		setTimeout(function () {
			if (_cfg.is_loadcomplete != true) {
//					console.log("load is timeout");
				if (_opts.onException != null) {
					_opts.onException();
				}
				_cfg.is_timeout = true;
			}
		}, _opts.timeout);
	}
}

SinaBlog680.jsload.request = function(aUrls, oOpts) {
	new jsload(aUrls, oOpts);
};
/*
 * @fileoverview 固定广告box组件
 * @authors yifei2 <yifei2@staff.sina.com.cn>
 */

/*** 固定广告box组件 ***/
SinaBlog680.PPTBoxHelper = {
    count: 0,
    instance: {},
    getId: function() { return '_ppt_box-' + (this.count++); }
}

SinaBlog680.moveElement = function(elementID,final_x,interval) {
    if (!document.getElementById) return false;
    if (!document.getElementById(elementID)) return false;
        var elem = document.getElementById(elementID);
        if (elem.movement) {
        clearTimeout(elem.movement);
    }
    if (!elem.style.left) {
        elem.style.left = "0px";
    }
    var xpos = parseInt(elem.style.left);
        if (xpos == final_x ) {
        return true;
    }
    if (xpos < final_x) {
        var dist = Math.ceil((final_x - xpos)/5);
        xpos = xpos + dist;
    }
    if (xpos > final_x) {
        var dist = Math.ceil((xpos - final_x)/5);
        xpos = xpos - dist;
    }
    elem.style.left = xpos + "px";
    var repeat = "SinaBlog680.moveElement('"+elementID+"',"+final_x+","+interval+")";
    elem.movement = setTimeout(repeat,interval);
}

//PPT盒子
function PPTBox() {
    this.uid = SinaBlog680.PPTBoxHelper.getId();
    SinaBlog680.PPTBoxHelper.instance[this.uid] = this;
    this._$ = function(id){return document.getElementById(id);};
    this.width = 400;       //宽度
    this.height = 300;      //高度
    this.picWidth = 15;     //小图宽度
    this.picHeight = 12;    //小图高度
    this.autoplayer = 0;    //自动播放间隔（秒）
    this.target = "_blank"; 
    this._box = [];
    this._curIndex = 0;
    this.materialtype = 1;  //物料类型
    this.slot = null;       //资源位dom元素
    this.slottype = 1;      //资源位类型，1固定，2漂浮，3弹窗
    this.sourceid = null;
    this.sudakey = null;
    this.sudavalue = null;  
}
PPTBox.prototype = {
    _createMainBox : function (){
        var flashBoxWidth = this.width * this._box.length;
        var html="<div id='"+this.sourceid+"_mainbox' class='mainbox'  style='overflow:hidden;position:relative;width:"+(this.width)+"px;height:"+(this.height)+"px;'>";
        html += "<div id='"+this.sourceid+"_contentbox' class='flashbox' style='overflow:hidden;position:relative;width:"+flashBoxWidth+"px;height:"+(this.height)+"px;'></div>";
        // html += "<div id='"+this.sourceid+"_imagebox' class='imagebox' style='display: none;width:"+this.width+"px;height:"+(this.picHeight+2)+"px;top:-"+(this.picHeight+20)+"px;'></div>";
        html += "</div>";
        var el = SinaBlog680.utils.htmlToDom(html);
        this.slot.appendChild(el[0]);
        // this.slot.innerHTML = html;        
    },
    _init : function (){
        var picstyle= "";
        var eventstr = "SinaBlog680.PPTBoxHelper.instance['"+this.uid+"']";
        var imageHTML="";
        var flashbox = "";
        var flashboxel;
        var slotid = this.sourceid+"_contentbox";
        var sudakey = this.sudakey;
        var sudavalue = this.sudavalue;
        for(var i=0;i<this._box.length;i++){
            var parame = this._box[i];
            flashbox += this.renderHTML(parame,this.width,this.height,i);
            // imageHTML ="<div class='bitdiv "+((i==0)?"curimg":"defimg")+"' title ="+parame.title+" src='bit01.gif' "+picstyle+" onclick = \""+eventstr+".clickPic("+i+")\"  onmouseover=\""+eventstr+".mouseoverPic("+i+")\"></div>" + imageHTML;
        }
        //有广告数据
        if(flashbox != '') {
            // this._createMainBox();
            if(this.slot.style.display == 'none') {
                this.slot.style.display = '';
            }
            flashboxel = SinaBlog680.utils.htmlToDom(flashbox);
            // if(this._$(slotid)) {
            //     this._$(slotid).appendChild(flashboxel[0]);
            // }
            if(this.slot) {
                this.slot.appendChild(flashboxel[0]);
                // 曝光布码
                window.setTimeout(function() {
                    if(typeof SUDA != 'undefined' && sudakey && sudavalue) {
                        SUDA.uaTrack(sudakey, sudavalue);
                    }
                }, 3000);
            }
        }
        
        // this._$(this.sourceid+"_contentbox").innerHTML = flashbox;
        // this._$(this.sourceid+"_imagebox").innerHTML = imageHTML;

    },
    _play : function(){
        clearInterval(this._autoplay);
        var idx = this._curIndex+1;
        if(idx>=this._box.length){idx=0;}
        this.changeIndex(idx);
        var eventstr = "SinaBlog680.PPTBoxHelper.instance['"+this.uid+"']._play()";
        this._autoplay = setInterval(eventstr,this.autoplayer*1000);

    },
    renderHTML : function(parame,width,height,idx) {
        // var isFlash = url.substring(url.lastIndexOf('.')+1).toLowerCase()=="swf";
        var html = "";
        //materialtype 物料类型
        //1,图片 2,文字
        if(this.materialtype === 1) {
            var eventstr = "SinaBlog680.PPTBoxHelper.instance['"+this.uid+"']";
            var style = "";
            if(parame.a_href) {
                style = "cursor:pointer"
            }
            console.log(parame);
            // html="<img "+parame.a_c_suda+" title='"+parame.a_title+"' src='"+parame.imgurl+"' style='width:"+width+"px;height:"+height+"px;"+style+"' onclick = \""+eventstr+".clickPic("+idx+")\"/>";
            // html="<a href="+parame.a_href+" target='_blank'><img "+parame.a_c_suda+" title="+parame.a_title+" src="+parame.imgurl+" style='width:"+width+"px;height:"+height+"px;"+style+"' /></a>";
            html = '<a target="_blank" href="'+parame.a_href+'">'+ '<img '+ parame.a_c_suda + ' title="'+ parame.a_title +'" src="'+ parame.imgurl +'" style="width:'+width+'px;height:'+height+'px;">' + '</a>';
        }else if(this.materialtype === 2) {
            var style = "";
            if(parame.a_style) {
                style = parame.a_style;
            }
            html = '<a style="'+style+'" title="'+parame.a_title+'" href="'+parame.a_href+'" '+parame.a_c_suda+' target="_blank">'+parame.words+'</a>';
        }

        // else if(this.materialtype === 3) {
        //     html = "<object classid='clsid:D27CDB6E-AE6D-11cf-96B8-444553540000' "
        //     + "codebase='http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=7,0,19,0' width='"+width+"' height='"+height+"'>"
        //     + "<param name=\"movie\" value=\""+url+"\" />"
        //     + "<param name='quality' value='high' />"
        //     + "<param name='wmode' value='transparent'>"
        //     + "<embed src='"+url+"' quality='high' wmode='opaque' pluginspage='http://www.macromedia.com/go/getflashplayer'"
        //     +"  type='application/x-shockwave-flash' width="+width+" height='"+height+"'></embed>"
        //     +"  </object>";
        // }

        return html;
    },
    changeIndex : function(idx){
        var parame = this._box[idx];
        SinaBlog680.moveElement(this.sourceid+"_contentbox",-(idx*this.width),1);
        // var imgs = this._$(this.sourceid+"_imagebox").getElementsByTagName("div");
        // imgs[this._box.length-1-this._curIndex].className = "bitdiv defimg";
        // imgs[this._box.length-1-idx].className = "bitdiv curimg";
        this._curIndex = idx;
    },
    mouseoverPic : function(idx){
        this.changeIndex(idx);
        if(this.autoplayer>0){
           clearInterval(this._autoplay);
           var eventstr = "SinaBlog680.PPTBoxHelper.instance['"+this.uid+"']._play()";
           this._autoplay = setInterval(eventstr,this.autoplayer*1000);
        }
    },
    clickPic : function(idx){
        var parame = this._box[idx];
        if(parame.a_href&&parame.a_href!=""){
            window.open(parame.a_href,this.target);
        }
    },
    add : function (imgParam){
        this._box[this._box.length] = imgParam;
    },
    show : function () {
        if(!this.slot) {
            return;
        }
        this._init();
        if(this.autoplayer>0){
           var eventstr = "SinaBlog680.PPTBoxHelper.instance['"+this.uid+"']._play()";
           this._autoplay = setInterval(eventstr,this.autoplayer*1000);
        }
    }
}
/*** 固定广告box组件 **
﻿/*
 * @fileoverview 生成固定广告位
 * @authors yifei2 <yifei2@staff.sina.com.cn>
 */

//广告资源接口返回数据
var resdata = {};

//广告资源id缓存
SinaBlog680.sourceArrCache = [];
//广告获取接口
SinaBlog680.sourceurl = 'http://interface.blog.sina.com.cn/riaapi/pageslot/pageslot.php';

var requesting = 0;


/*** 固定广告，底部调用模式 ***/
/*  调用方法
    //广告位id
    var slotArr = ['div1', 'div2', 'div3'];
    //广告资源id，一个广告位可以对应多个资源
    var sourceArr = ['SLOT_40', 'SLOT_42,SLOT_44', 'SLOT_49'];
    SinaBlog680.staticBox(slotArr, sourceArr);
*/
SinaBlog680.staticBox = function(slotArr, sourceArr) {
    //一个广告位有多个资源
    var sourceLen = sourceArr.length;
    var reqSourceArr = [];
    var cookieUtil = SinaBlog680.cookie;
    var reqdata = {
        id : reqSourceArr
    };
    var articleclass = '';
    if(typeof scope != 'undefined') {
        articleclass = scope.$private.articleclass;
    }

    for(var i=0;i<sourceLen;i++) {
        var subSourceArr = sourceArr[i].split(',');
        var subSourceLen = subSourceArr.length;
        if(subSourceLen > 1) {
            var index = parseInt(cookieUtil.getCookie(slotArr[i] + '_' + 'adindex') || 0);
            if (subSourceLen <= index) {
                index = 0;
            }
            cookieUtil.setCookie(slotArr[i] + '_' + 'adindex', 1+index, 24, "/", ".blog.sina.com.cn");
            reqSourceArr.push(subSourceArr[index]);
        }else if(subSourceLen == 1) {
            reqSourceArr.push(subSourceArr[0]);
        }
    }

    if(sourceArr.join().indexOf('SLOT_41') != -1 || sourceArr.join().indexOf('SLOT_42') != -1) {
        reqdata = {
            id : reqSourceArr,
            articleclass : articleclass
        }
    }else {
        reqdata = {
            id : reqSourceArr
        }
    }

	var domInterval = window.setInterval(function() {
        if(document.readyState === 'complete' || document.readyState === 'interactive' || document.readyState === 'loaded') {
            clearInterval(domInterval);
            domInterval = null;
            SinaBlog680.jsload.request(SinaBlog680.sourceurl, {
                GET : reqdata,
                onComplete: function(res) {
                    if(res) {
                    	SinaBlog680.renderBox(slotArr, reqSourceArr, res);
                    }
                },
                onException: function(res) {
                }
            });
        }else {
            console.log(document.readyState);
        }
    }, 500);

    // 超时
    window.setTimeout(function() {
        if(domInterval) {
            clearInterval(domInterval);
            domInterval = null;
        }
    }, 1000*10);

};
SinaBlog680.renderBox = function(slotArr, sourceArr, adData) {
    var len = slotArr.length;
    var cookieUtil = SinaBlog680.cookie;

    for(var i=0;i<len;i++) {
        var sourceid = sourceArr[i];
        //固定类型
        if(adData[sourceid].slottype == 1) {
            var slotdom = document.getElementById(slotArr[i]);

            //判断tips广告，顶托位置
            if (typeof BLOG_AD_TIPS != 'undefined' && BLOG_AD_TIPS != null && slotArr[i] === 'loginBarActivity') {
                continue;
            }

            if(slotdom) {
                var resarr = adData[sourceid].res;
                
                if(resarr.length) {
                    var box = new PPTBox();
                    box.width = adData[sourceid].width;
                    box.height = adData[sourceid].height;
                    box.sourceid = sourceid;
                    box.materialtype = adData[sourceid].materialtype;
                    box.autoplayer = 0;
                    box.slot = slotdom;
                    //一个广告资源多个物料信息
                    if(resarr.length === 1) {
                        box.add(resarr[0]);
                        box.sudakey = resarr[0].a_v_suda_key;
                        box.sudavalue = resarr[0].a_v_suda_value;
                        box.show();
                        
                    }else if(resarr.length > 1) {
                        var randomIndex = SinaBlog680.utils.getRandomInt(0, resarr.length-1);
                        box.add(resarr[randomIndex]);
                        box.sudakey = resarr[randomIndex].a_v_suda_key;
                        box.sudavalue = resarr[randomIndex].a_v_suda_value;
                        box.show();
                    }

                    // 对相关博文的两个广告做特殊处理
                    if(sourceid === 'SLOT_41' || sourceid === 'SLOT_42') {
                        if(slotdom.parentNode.style.display == 'none') {
                            slotdom.parentNode.style.display = '';
                        }
                    }
                    if(slotdom.style.display == 'none') {
                        slotdom.style.display = '';
                    }
                }
                
                // if(adData[sourceid].res.length) {
                //     for(var j=0;j<adData[sourceid].res.length;j++) {
                //         box.add(adData[sourceid].res[j]);
                //         box.show();

                //         var viewKey = adData[sourceid].res[j].a_v_suda_key;
                //         var viewValue = adData[sourceid].res[j].a_v_suda_value;
                //         SinaBlog680.sudaView(sourceid, viewKey, viewValue);
                //     }
                //     //对相关博文的两个广告做特殊处理
                //     if(sourceid === 'SLOT_41' || sourceid === 'SLOT_42') {
                //         if(slotdom.parentNode.style.display == 'none') {
                //             slotdom.parentNode.style.display = 'block';
                //         }
                //     }
                //     if(slotdom.style.display == 'none') {
                //         slotdom.style.display = 'block';
                //     }
                // }
            }
        }else {
            console.log('slottype error');
        }
    }
};

/*** 顶部调用，埋点方式 start ***/
SinaBlog680.preloadSlots = function(sourceArr) {
	for(var i=0;i<sourceArr.length;i++) {
		SinaBlog680.sourceArrCache.push(sourceArr[i]);
	}
};
SinaBlog680.reqAD = function() {
	requesting = 1;
	SinaBlog680.jsload.request(SinaBlog680.sourceurl, {
    	GET : {
            id : SinaBlog680.sourceArrCache
		},
        onComplete: function(res) {
        	for(var key in res) {
        		resdata[key] = res[key];
        	}
            requesting = 0;
        },
        onException: function(res) {
        }
    });
};
SinaBlog680.fillSlot = function(sourceid, slotid) {	
    var placeEle = '<a id="placeEle_'+sourceid+'"></a>';
    if(!slotid) {
        document.write(placeEle);
    }

    var checkdata = window.setInterval(function() {
    	//domready后执行
    	if(document.readyState ==="complete") {
	        if(!SinaBlog680.utils.isEmptyObject(resdata)) {
	            clearInterval(checkdata);
	            var adData = resdata;
	            //没有数据的情况
	            if(!adData || !adData[sourceid]) {            	
	                return;
	            }
	            var box = new PPTBox();
	            box.width = adData[sourceid].width;
	            box.height = adData[sourceid].height;
	            box.sourceid = sourceid;
	            box.materialtype = adData[sourceid].materialtype;
	            box.autoplayer = 0;
	            if(slotid) {
	                box.slot = document.getElementById(slotid);
	            }else {
	                box.slot = document.getElementById('placeEle_'+sourceid).parentNode;
	            }
	            
	            for(var j=0;j<adData[sourceid].res.length;j++) {
	                box.add(adData[sourceid].res[j]);
	                box.show();

	                var viewKey = adData[sourceid].res[j].a_v_suda_key;
	                var viewValue = adData[sourceid].res[j].a_v_suda_value;
	                SinaBlog680.sudaView(sourceid, viewKey, viewValue);
	            }

	        }else {
	        	if(requesting === 0) {
	        		SinaBlog680.reqAD();
	        	}
	        }
    	}
    }, 500);
    
    // 超时
    window.setTimeout(function() {
        if(checkdata) {
            clearInterval(checkdata);
        }
    }, 1000*10);
};

//针对顶托延迟加载
SinaBlog680.fillTopBar = function(sourceid) {
	
    var topBarInterval = window.setInterval(function() {
        var topbar_login = document.getElementById('loginBarActivity');
        var topbar_nologin = document.getElementById('divPopularize');
        if(document.readyState === "complete") {
        	if(topbar_login) {
	            //判断是否是tips广告
	            if (typeof BLOG_AD_TIPS==="undefined" || !BLOG_AD_TIPS ){
	                SinaBlog680.fillSlot(sourceid, 'loginBarActivity');
	            }
	            clearInterval(topBarInterval);
	        }
	        if(topbar_nologin) {
	            //判断是否是tips广告
	            if (typeof BLOG_AD_TIPS==="undefined" || !BLOG_AD_TIPS ){
	                SinaBlog680.fillSlot(sourceid, 'divPopularize');
	            }
	            clearInterval(topBarInterval);
	        }
        }
    }, 3000);

    //超时
    window.setTimeout(function() {
    	if(topBarInterval) {
    		clearInterval(topBarInterval);
    	}
    }, 3000*10);
};
/*** 顶部调用，埋点方式 end ***/

/*** 曝光布码 ***/
SinaBlog680.sudaView = function(sourceid, key, value) {
    window.setTimeout(function() {
        var el = document.getElementById(sourceid+'_mainbox');
        if(typeof SUDA !== 'undefined' && el) {
            SUDA.uaTrack(key, value);
        }
    }, 3000);
};
// 底部工具
})(window);

