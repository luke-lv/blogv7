var _UTL = {};
_UTL.htmlEnc = function(str) {
if (typeof(str)!="string") return "";
str = str.replace(/&/gm,"&amp;"); str = str.replace(/</gm,"&lt;");str = str.replace(/>/gm,"&gt;"); str = str.replace(/\"/gm,"&quot;");
return str;
}

_UTL.htmldeEnc = function(str) {
if (typeof(str)!="string") return "";
str = str.replace(/&lt;/gm,"<"); str = str.replace(/&gt;/gm,">");
str = str.replace(/&quot;/gm,'"'); str = str.replace(/&amp;/igm,"&");
return str;
}
_UTL.truebody = function (){return (document.compatMode!="BackCompat")? document.documentElement : document.body};

_UTL.getNodeJSONData = function(str){
	if(!str || typeof(str)!="string") return null;
	var rv = null;
//	try{
		eval("rv="+str.replace(/\n+/g,"").replace(/\r+/g,"") +";");
//	}catch(err){window.status = "Data ERROR: "+err.description}
	return rv;
};

_UTL.getJSONData = function(str){	
	var orv = null;
	if(typeof(str)=="string"){
		try{
			eval(" orv = "+str.replace(/[\r|\n]/gm,""));
		}catch(err){}
	}
	return orv;	
};


_UTL.formatObjectData = function(obj){
	if(!obj) return null;
	for(var dat in obj){
		switch(typeof(obj[dat])){
			case "string":
				if(obj[dat]=="true")
					obj[dat] = true;
				else if(obj[dat]=="false")
					obj[dat] = false;
				else if(obj[dat].match(/^\d+$/))
					obj[dat] = Number(obj[dat]);
				break;
			case "object":
				obj[dat] = _UTL.formatObjectData(obj[dat]);
				break;
		}
	}
	return obj;
};

_UTL.getAbsPosition = function(el){
	if(!el) return null;
	var tb = _UTL.truebody();
	var ofx = el.offsetLeft;
	var ofy = el.offsetTop;
	var pel = el.offsetParent;
	var ix = 0;
	var iy = 0;
	if(pel){
		ix = pel.offsetLeft;
		iy = pel.offsetTop;
		var osc = null;
		while( pel.tagName.toLowerCase() != "body" ){ 
			if(pel.clientHeight < pel.scrollHeight){
				osc = pel;
			}
			pel = pel.offsetParent;
			if(!pel) break;
			ix += pel.offsetLeft;
			iy += pel.offsetTop;
		}
	}

	if(osc && osc.tagName.toLowerCase() != "div")
		osc = null;
	ofx += ix;
	ofy += iy;
	return {x:ofx,y:ofy,w:el.clientWidth,h:el.clientHeight,spos:_UTL.getAbsPosition(osc)};
};

_UTL.getEventPosition = function(e){
	if(!e) return {x:0,y:0};
	var tb = _UTL.truebody();
	var ix,iy;
	var offx = 0;
	var offy = 0;
	var sy,sx;
	if(typeof(event) != "undefined"){
		offx += tb.scrollLeft;
		offy += tb.scrollTop;
		sy = tb.scrollTop;
		sx = tb.scrollLeft;
		ix = e.clientX;
		iy = e.clientY;
	}else{
		sy = window.pageYOffset;
		sx = window.pageXOffset;
		ix = e.pageX;
		iy = e.pageY;
	}
	ix = ix + offx;
	iy = iy + offy;
	return {x:ix,y:iy};
};

_UTL.getOffColor = function(clr,off){
clr = clr.toUpperCase().replace(/\s/g,"");
var r,g,b;
var m = clr.match(/#([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})/);
if(m){
	r = Number('0x'+m[1]);
	g = Number('0x'+m[2]);
	b = Number('0x'+m[3]);
}else{
	m = clr.match(/rgb\((\d+),(\d+),(\d+)\)/i);
	if(m){
		r = Number(m[1]);
		g = Number(m[2]);
		b = Number(m[3]);
	}else{
		r = 0x80;
		g = 0x80;
		b = 0x80;
	}
}

var sclr = "#F0F0F0";
if(!off) off = 1;
var cr = Math.floor( r*off);
var cg = Math.floor( g*off);
var cb = Math.floor( b*off);
cr = cr > 0xFF ? 0xFF : cr;
cg = cg > 0xFF ? 0xFF : cg;
cb = cb > 0xFF ? 0xFF : cb;
sclr = '#'+(cr<16?'0':'')+cr.toString(16)+(cg<16?'0':'')+cg.toString(16)+(cb<16?'0':'')+cb.toString(16);
return sclr;
};

_UTL.getTextColor = function(bgclr){
	bgclr = bgclr.toUpperCase();
	var r,g,b;
	var m = bgclr.match(/#([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})/);
	if(m){
		r = Number('0x'+m[1]);
		g = Number('0x'+m[2]);
		b = Number('0x'+m[3]);
	}else{
		bgclr = bgclr.replace(/\s+/g,"");
		m = bgclr.match(/rgb\((\d+),(\d+),(\d+)\)/i);
		if(m){
			r = Number(m[1]);
			g = Number(m[2]);
			b = Number(m[3]);
		}else{
			return "#000000";
		}
	}
	return ( r+g+b < 0xFF ? "#FFFFFF" : "#000000");
};

_UTL.getHostColorDefine = function(ocss,odef){
	if(!odef){
		odef = {
			base:{bg:"#A1DBFF",txt:"#000000"},
			tint:{bg:"#B1D8F5",txt:"#000000"},
			deep:{bg:"#97BEDE",txt:"#000000"},
			div:{bg:"transparent",txt:"#000000"}};
	}
	if(!ocss)
		ocss={style:odef};
	if(ocss.backgroundColor && ocss.backgroundColor != 'null')
		odef.div.bg = ocss.backgroundColor;
	if(ocss.color && ocss.color != 'null')
		odef.div.txt = ocss.color;

	var m,ts;
	ts = ocss.style["base"];
	if(typeof(ts)=="string"){
		m = ts.match(/(#[0-9A-F]{6});(#[0-9A-F]{6})/i);
		if(m && m[1]){
			odef.base.bg = m[1];
			odef.base.txt = m[2] ? m[2] : _UTL.getTextColor(odef.base.bg);
			if(!odef.tint) odef.tint = {};
			odef.tint.bg = _UTL.getOffColor(odef.base.bg,1.1);
			odef.tint.txt = _UTL.getTextColor(odef.tint.bg);
			if(!odef.deep) odef.deep = {};
			odef.deep.bg = _UTL.getOffColor(odef.base.bg,0.9);
			odef.deep.txt = _UTL.getTextColor(odef.deep.bg);
		}
	}
	
	for(var dat in ocss.style){
		if(dat=="base") continue;
		ts = ocss.style[dat];
		if(typeof(ts)=="string"){
			m = ts.match(/(#[0-9A-F]{6});(#[0-9A-F]{6})/i);
			if(m && m[1]){
				if(!odef[dat])
					odef[dat] = {bg:odef.base.bg,txt:odef.base.bg.txt};
				odef[dat].bg = m[1];
				if(m[2])
					odef[dat].txt = m[2];
			}
		}
	}
	
	return odef;
};

_UTL.applyMyStylesheet = function(myst,doc){
	if(!doc)
		doc = document;
	if(_COMM.IE){
		var sheet = doc.createStyleSheet();
		for(var dat in myst){
			sheet.addRule("."+dat,myst[dat]);
		}
	}else{
		var style = doc.createElement('style');
		style.type = 'text/css';
		var ts = "";
		for(var dat in myst){
			ts += "."+dat + "{" + myst[dat] +"}";
		}
		style.innerHTML = ts;
		doc.getElementsByTagName('HEAD').item(0).appendChild(style);
	}
};

_UTL.shadow = {};
_UTL.shadow.add = function(el,off,op){
	if(!el)
		return false;
	var z = el.style.zIndex;
	var eid = el.id;
	if(z < 1 || !el.id || el.id=="")
		return false;
	z = Number(z)-1;

	var sid = el.id + '_shadow'
	var osd = _ZWF.$(sid);
	if(!osd){
		osd = document.createElement("DIV");
		osd.id = sid;
		document.body.appendChild(osd);
	}
	osd.style.display = '';
	osd.style.position = "absolute";
	osd.style.zIndex  = z;
	var pos = _UTL.getAbsPosition(el);
	osd.style.left = (pos.x + off)+'px';
	osd.style.top = (pos.y + off)+'px';
	osd.style.width = el.offsetWidth + 'px';
	osd.style.height = el.offsetHeight + 'px';
	osd.style.background = "#000000";
	if(typeof(osd.style.filter) != "undefined")
		osd.style.filter = "progid:DXImageTransform.Microsoft.Alpha(opacity="+op+")";
	else
		osd.style.opacity = String(op/100);
	el.setAttribute('shadowID',sid);
	return true;
};

_UTL.shadow.remove = function(el){
	if(!el)
		return false;
	var sid = el.getAttribute("shadowID");
	var osd = _ZWF.$(sid);
	if(osd){
		document.body.removeChild(osd);
	}	
};


_UTL.isPass = function(tp,s){
	if(s.search(/[^\x00-\xff]/)!=-1)
		return false;
	switch(tp){
		case "1":
		case "sina":
			if(s.length < 1 ) return false; //|| s.length > 16
			break;
		case "2":
		case "say-on":
			if(s.length < 1 ) return false;
			break;
		default:
			return false;
	}
	return true;
};

_UTL.isUserName = function(tp,s){
	switch(tp){
		case "1":
		case "sina":
			var slen = s.replace(/[^\x00-\xff]/g,"aa").length;
			if(slen < 4 ) return false; //|| slen > 16
//			if(s.match(/^\d*$/)) return false;
			if(s.match(/_$/)) return false;
			break;
		case "2":
		case "say-on":
			if(s.length < 6 || !s.match(/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/))
				return false;
			break;
		default:
			return false;
	}
	return true;
};
_UTL.isNick = function(s){
	var slen = s.replace(/[^\x00-\xff]/g,"aa").length;
	if( slen < 2 || slen > 20) return false;
	if( s.search(/(\'|\"|\:|\\|\)|\(|\[|\]|\?|,|;|&|#|@)/g) != -1 ) return false;
	return true;
};


_UTL.open = function(surl,tg){
	if(!tg)
		tg = "_blank";
	if(typeof(surl)!="string" || surl == "") return;
	open(surl,tg);
	_STATS.add("open_url",encodeURIComponent(surl));
};

_UTL.getAbsPath = function(spath,sfile){
	spath = spath.replace(/\/$/,"");
	if(sfile.match(/^http/i))
		return sfile;
	while( sfile.search(/^\.\.\//) != -1 ){
		spath = spath.substr(0,spath.lastIndexOf("/"));
		sfile = sfile.replace(/^\.\.\//,"");
	}
	return spath+"/"+sfile;
};

_UTL.scrollIntoView = function(odiv,btop){
	if(!odiv) return null;
	var cnt = 0;
	var op = odiv;
	var y = op.offsetTop;
	while(cnt < 100 ){
		if(!op.offsetParent)
			break;
		op = op.offsetParent;
		if(op.clientHeight < op.scrollHeight){
			break;
		}else{
			y += op.offsetTop;
		}
		cnt ++;
	}
	var sc = (btop ? y : y - op.clientHeight + odiv.offsetHeight) ;
	if(op.scrollTop < sc)
		op.scrollTop = sc;
};

_UTL.importJS = function(jssrc,jsid,loadFun,chrset){
	var ojs =  document.getElementById(jsid);
	if(!chrset)
		chrset = "utf-8";
	if(ojs)
		document.body.removeChild(ojs);
	if(!document.body){
		document.write('<script type="text/javascript" id="'+jsid+'" src="'+jssrc+'"></scr'+'ipt>');
	} else {
		ojs = document.createElement("SCRIPT"); 
		ojs.charset = chrset;
		ojs.language = "javascript"; 
		ojs.type = "text/javascript";
		ojs.id = jsid;
		ojs.src = jssrc;
		if(typeof(loadFun) == "function"){
			if(typeof(ojs.onreadystatechange) == "undefined")
				ojs.onload = loadFun;
			else
				ojs.onreadystatechange = function(){
					if(this.readyState == "loaded" || this.readyState == "interactive" || this.readyState == "complete" ){
						loadFun();
					}
				};
		}
	
		ojs = document.body.appendChild(ojs);
	}
	return false;
};

_UTL.importCSS = function(css_file){

	var ocss;
	var el = document.getElementsByTagName('HEAD')[0];
	ocss = document.createElement('LINK');
	ocss.rel = 'stylesheet';
	ocss.type = 'text/css';
	ocss.href = css_file;
	el.appendChild(ocss);

};


_UTL.regModule = function(mname,module){
	var hid = _UTL.getUrlArg("hid");
	var pid = _UTL.getUrlArg("pid");
	if(!hid) return false;
	if(!pid) pid = hid;
	var wid = _UTL.getUrlArg("wid");
	var wgtid = _UTL.getUrlArg("wgtid");
	var modid = _UTL.getUrlArg("modid");
	if(!modid) modid = 0;
	module.oifo = {key:mname+"_"+_COMM.clientID,hid:hid,pid:pid,wid:wid,mname:mname,wgtid:wgtid,modid:modid,cid:_COMM.clientID,onHiddenNotify:pid,URL:document.URL.substr(0,document.URL.indexOf("?"))};
	_COMM.sendMessage( hid,{type:"registration",key:module.oifo.key,message:module.oifo } );
	return true;
};

_UTL.gotRegInfo = function(omsg,module){
	if(omsg.key=="settings"){
		module.oapp = omsg.message.oset;
		module.owner = module.oapp.owner;
		if(module.oapp.settings && module.oapp.settings.comm && module.oapp.settings.comm[module.oifo.mname])
			module.oset = module.oapp.settings.comm[module.oifo.mname];
		else
			module.oset = null;
		module.oifo.winInfo = omsg.message.winInfo;
		module.oifo.winInfo.SvrAddress.rssProxy += '?url=';//'?id='+module.oifo.wgtid+'&url=';
		module.oifo.args = omsg.message.args?omsg.message.args:null;
		if(omsg.message.auth){
			if(omsg.message.auth.cookies)
				omsg.message.auth.cookies = unescape(omsg.message.auth.cookies);
			if(document.location.host.match(/say\-on\.com/i)){
				omsg.message.auth.pkey = _UTL.getCookie("WDP");
			}
			module.oifo.auth = omsg.message.auth;
//			module.oifo.auth.loginAccList = _COMM.getLoginAccList();
		}else{
			module.oifo.auth = null;
		}
		module.skinDefine = null;
		var m = module.oifo.winInfo.skin.subPath.match(/\/(.*)\/$/);
		var odef = module.oifo.winInfo.skin.cfg.skinDefine;
		if(m && m[1] && odef){
			for(var dat in odef){
				if(odef[dat].attributes.path == m[1]){
					module.skinDefine = odef[dat];
					module.skinDefine.skinID = dat;
					break;
				}
			}
		}
		module.appData = module.oifo.winInfo.skin.cfg.appData;
		if(lanRes && typeof(lanRes.addLan)=="function")
			lanRes.addLan(_UTL.getNodeJSONData(module.oifo.winInfo.skin.cfg.lanRes));
	}
	
};

_UTL.formatTime = function(timeStr,fmtStr) {

var ads = fmtStr.split(",");
var hourStr = ads[0];
var minStr = ads[1];
var secStr = ads[2];
var dayStr = ads[3];
var monthStr = ads[4];
var todayStr = ads[5];
var yesterdayStr = ads[6];
var agoStr = ads[7];

var today = new Date();
var msgDate = new Date( Number(timeStr) );
var hour = msgDate.getHours();
var minute = msgDate.getMinutes();
if (hour < 10) {
hour = '0' + hour;
}
if (minute < 10) {
minute = '0' + minute;
}

var ONE_DAY = 1000 * 60 * 60 * 24;
var newDate1 = new Date(today.getYear(), today.getMonth(), today.getDate());
var newDate2 = new Date(msgDate.getYear(), msgDate.getMonth(), msgDate.getDate());
var diffInMs = Math.abs(newDate1.getTime() - newDate2.getTime());
var dateDiff =  Math.round(diffInMs / ONE_DAY);

var time = hour + ':' + minute;
if (dateDiff == 0) {
return todayStr + time;
} else 
if (dateDiff == 1) {
return yesterdayStr + time;
} else if (dateDiff <= 7) {
return dateDiff + agoStr ;//+ time;
} else {
return (msgDate.getMonth()+1)+monthStr+msgDate.getDate()+dayStr;
}
};

_UTL.getSinaUserPortrait = function(uid,product,size){
	var svr = (uid%8)+1;
	if(!size) size = 30;
	if(!product) product = 'default';
	return 'http://portrait'+svr+'.sinaimg.cn/'+uid+'/'+product+'/'+size;
};

_UTL.getSinaPengyouPortrait = function(uid,size){
	return 'http://webim.pengyou.sina.com.cn/webchat/icon/?uid='+uid+'&size='+size;
/*
	var svr = (uid%8)+1;
	if(!size) size = 50;
	return 'http://p'+svr+'.sinaimg.cn/'+uid+'/'+size;		
*/
};

_UTL.cancelClick = function(e){

	if(typeof(event)!="undefined"){
		window.event.cancelBubble = true;
	}else if(e)
		e.stopPropagation();

};
_UTL.getIEVersion = function(){
	var m = navigator.appVersion.match(/MSIE (\d\.\d);/);
	return (m && m[1] ?  Number(m[1]) : 0);
};
_UTL.setHTML = function(elid,str){
	var el = document.getElementById(elid)
	if(el) el.innerHTML = str;
};
_UTL.getHTML = function(elid){
	var el = document.getElementById(elid)
	return (el ? el.innerHTML : null);
};

_UTL.observe = function(el, eventName, funcName, useCapture){
	if(el.addEventListener) {
		el.addEventListener(eventName, funcName, useCapture)
	}else
		el.attachEvent("on" + eventName, funcName, useCapture);
};

_UTL.addEventListener = function(el, eventName, funcName, useCapture){
	if(typeof(useCapture)!='boolean')
		useCapture = false;
	if(el.addEventListener) {
		el.addEventListener(eventName, funcName, useCapture)
	}else if(el.attachEvent)
		el.attachEvent("on" + eventName, funcName);
};

_UTL.removeEventListener = function(el, eventName, funcName, useCapture){
	if(typeof(useCapture)!='boolean')
		useCapture = false;
	if(el.removeEventListener) {
		el.removeEventListener(eventName, funcName, useCapture)
	}else  if(el.attachEvent)
		el.detachEvent("on" + eventName, funcName);
};

_UTL.getEvent = function(){
	if(typeof(window.event)!="undefined")
		return window.event;
		
	var func = _UTL.getEvent.caller;
	while(func!=null){
		var arg0=func.arguments[0];
		if(arg0){
			if(arg0.constructor == Event || arg0.constructor == MouseEvent )
				return arg0;
		}
		func=func.caller;
	}
	return null;
};

_UTL.eventFollowShow = function(e,odiv,offx,offy){
	var tb = _UTL.truebody();
	var ix,iy;
	if(typeof(offx)=="undefined") offx = 0;
	if(typeof(offy)=="undefined") offy = 0;
	var sy,sx;
	if(typeof(event) != "undefined"){
		offx += tb.scrollLeft;
		offy += tb.scrollTop;
		sy = tb.scrollTop;
		sx = tb.scrollLeft;
		ix = event.clientX;
		iy = event.clientY;
	}else{
		sy = window.pageYOffset;
		sx = window.pageXOffset;
		ix = e.pageX;
		iy = e.pageY;
	}

	ix = ix + offx;
	iy = iy + offy;
	var h = odiv.clientHeight;
	var w = odiv.clientWidth;

	if(iy+h > sy+tb.clientHeight ){iy -= h ;}
	if(ix+w > sx+tb.clientWidth ){ix -= w ;}

	ix = (isNaN(ix) || ix < 0) ? 0 : ix;
	iy = (isNaN(iy) || iy < 0) ? 0 : iy;
	odiv.style.left = ix + 'px';
	odiv.style.top = iy + 'px';
};

_UTL.setFixedStyle = function(el,btop,bleft){
	if(_COMM.IE6 || ( navigator.appName.indexOf("Microsoft") != -1 && document.compatMode=="BackCompat" ) ){
		var es = "top:expression(eval( window.document.compatMode && window.document.compatMode=='CSS1Compat') ? "
			+ "window.document.documentElement.scrollTop " 
			+ (btop ? '' : '+ (window.document.documentElement.clientHeight - this.clientHeight)' ) 
			+ ' : ' 
			+ ' window.document.body.scrollTop '
			+ (btop ? '' : ' + (window.document.body.clientHeight - this.clientHeight) ' )
			+ ');';
		el.style.cssText = "position:absolute;"+es;
		try{document.body.scrollTop ++;document.body.scrollTop --;}catch(err){}
	}else{
		el.style.top = btop ? "0px" : "auto";
		el.style.bottom = btop ? "auto" : "0px";
		el.style.position = "fixed";
	}

	el.style.left = bleft ? "0px" : "auto";
	el.style.right = bleft ? "auto" : "0px";
};


_UTL.blind = {bid:"_widget_blind_div",obd:null};
_UTL.blind.show = function(z,clr,opt){
	var bid = _UTL.blind.bid;
	if(!_UTL.blind.obd){
		_UTL.blind.obd = document.createElement("DIV");
		_UTL.blind.obd.id = bid;
		document.body.appendChild(_UTL.blind.obd);
	};
	if(!z)
		z = 1000;
	if(!opt)
		opt = 15;
	if(!clr)
		clr = "#ffffff";
	var obd = _UTL.blind.obd;
	obd.style.display = '';
	var tb = _UTL.truebody();
	obd.style.position = 'absolute';
	obd.style.zIndex  = z;
	obd.style.width = tb.scrollWidth + 'px'
	obd.style.height = tb.scrollHeight + 'px'
	obd.style.left = '0px';
	obd.style.top = '0px';
	obd.style.background = clr;

	if(typeof(obd.style.filter) != "undefined")
		obd.style.filter = "progid:DXImageTransform.Microsoft.Alpha(opacity="+opt+")";
	else
		obd.style.opacity = opt/100;	
	return obd;
};
_UTL.blind.hide = function(){
	if(_UTL.blind.obd){
		document.body.removeChild(_UTL.blind.obd);
		_UTL.blind.obd = null;
	}
};

_UTL.setCookie = function(name, value, expires, path, domain, secure){ document.cookie= name + "=" + escape(value) + ((expires) ? "; expires=" + expires.toGMTString() : "") + ((path) ? "; path=" + path : "") + ((domain) ? "; domain=" + domain : "") + ((secure) ? "; secure" : "");};
_UTL.getCookie = function(name){var dc = document.cookie;var prefix = name + "="; var begin = dc.indexOf("; " + prefix); if (begin == -1){ begin = dc.indexOf(prefix); if (begin != 0) return null;} else{ begin += 2; }var end = document.cookie.indexOf(";", begin); if (end == -1){ end = dc.length; } return unescape(dc.substring(begin + prefix.length, end));};
_UTL.deleteCookie = function(name, path, domain){ if (_UTL.getCookie(name)){document.cookie = name + "=" + ((path) ? "; path=" + path : "") + ((domain) ? "; domain=" + domain : "") + "; expires=Thu, 01-Jan-70 00:00:01 GMT"; } };
_UTL.getUrlArg = function(akey,surl){ var re = new RegExp("[\\?|&]"+akey+"=([^&]*)(&|$)","i"); if(!surl) surl=document.URL; var m = surl.match(re);if( m && m[1]){return unescape(m[1]);}return null;}

var _ZXML = {cbFun:null,readyState:"uninitialized",req:null};

_ZXML.loadXMLStr = function(xmls){
	if(!xmls || typeof(xmls)!="string") return null;
	xmls = _ZXML.formatXMLstr(xmls);

	var xmlDom;
	if (window.ActiveXObject) {
		var arrSignatures = ["Microsoft.XmlDom","MSXML2.DOMDocument.4.0","MSXML2.DOMDocument.5.0", "MSXML2.DOMDocument.3.0", "MSXML2.DOMDocument"];
		for (var i=0; i < arrSignatures.length; i++) {
			try {
				var xmlDom = new ActiveXObject(arrSignatures[i]);
				break;
			} catch (oError) {}
		}
		xmlDom.preserveWhiteSpace = false;
		xmlDom.loadXML(xmls);
		if(xmlDom.parseError.errorCode != 0)
			return null;
	} else {
		var oParser = new DOMParser();
		xmlDom = oParser.parseFromString(xmls, "text/xml");
		if(xmlDom.documentElement.tagName == "parsererror")
			return null;
	}
	if(!xmlDom || !xmlDom.firstChild)
		return null;
	return xmlDom;
	
};

_ZXML.loadXMLDoc = function(surl,cbFun){
	if(_ZXML.readyState != "complete"){
		_ZXML.queue.push({URL:surl,fun:cbFun});
		return;
	}
	_ZXML.cbFun = ( typeof(cbFun)=="function" ? cbFun : function(){} ) ;
	if(_ZXML.req) {
	  _ZXML.req.open('GET', surl, true);
	  _ZXML.req.send('');
	  _ZXML.readyState = "loading";
	}
};

_ZXML.RSS2Obj = function(oxml){
	if(!oxml) return null;
	var otg = oxml.getElementsByTagName("rss");
	if(!otg || otg.length == 0)
		return null;
	var orss = _ZXML.XML2Obj(otg[0]);
	return orss;
};

_ZXML.XML2Obj = function(oxml){
	if(!oxml) return null;
	var obj = {};
	var ond,nn,nt,nv,np;
	if(oxml.attributes && oxml.attributes.length > 0){
			obj.attributes = {};
		for(var i=0;i<oxml.attributes.length;i++){
			obj.attributes[oxml.attributes[i].name] = oxml.attributes[i].value;
		}
	}
	for(var i=0;i<oxml.childNodes.length;i++){
		ond = oxml.childNodes[i];
		nn = ond.nodeName;
		switch(ond.nodeType){
			case 1:
				var orv = _ZXML._objAddNodeValue(obj,nn,_ZXML.XML2Obj(ond));
				if(orv && typeof(orv) != "function")
					obj[nn] = orv;
				break;
			case 3:
			case 4:
				if(ond.nodeValue.replace(/\s*/gm,"") == ""){
					break;
				}
				if(nn == "#text" || nn == "#cdata-section" || ( oxml.childNodes.length < 2 && oxml.attributes.length == 0 )){
					obj = ond.nodeValue;
				}else{
					nn = nn.replace(/^#/,"");
					var orv = _ZXML._objAddNodeValue(obj,nn,ond.nodeValue);
					if(orv && typeof(orv) != "function")
						obj[nn] = orv;
				}
				break;
			case 7:
				break;
			default:
				nn = nn.replace(/^#/,"");
				var orv = _ZXML._objAddNodeValue(obj,nn,ond.nodeValue);
				if(orv && typeof(orv) != "function")
					obj[nn] = orv;
				break;
		}
	}
	return obj;
};
_ZXML._objAddNodeValue = function(obj,nn,nv){
	var ot = obj[nn];
	var orv = new Array();

	if(typeof(ot)=="object" && typeof(ot.length)!="undefined"){
		orv = ot.concat(nv);
		return orv;
	}
	if(typeof(ot)!="undefined" && typeof(ot)!="function"){
		orv.push(ot);
		orv.push(nv);
		return orv;
	}
	return nv;
	
};

_ZXML.Obj2XML = function(obj,objName){
	if(typeof(obj)!="object")
		return null;
	
	var xmlstr = _ZXML._obj2xmlstr(obj,null);
	return _ZXML.loadXMLStr(xmlstr);
};
_ZXML._obj2xmlstr = function(obj,objName){
	if(!obj)
		return '<'+objName+'/>';
	var ts = "";
	var atts = "";
	for(var dat in obj){
		if(dat == "attributes"){
			for(var ad in obj[dat] ){
				atts += (ad+'="'+_UTL.htmlEnc(obj[dat][ad])+'" ');
			}
			continue;
		}
		switch(typeof(obj[dat])){
			case "object":
				if(!obj[dat] || typeof(obj[dat].length)=="undefined"){
					ts += _ZXML._obj2xmlstr(obj[dat],dat);
				}else{
					for(var j=0;j<obj[dat].length;j++){
						ts += _ZXML._obj2xmlstr(obj[dat][j],dat);
					}
				}
				break;
			case "function":
				break;
			default:
				if(dat == "comment"){
					ts += "<!--"+obj[dat]+"-->";
				}else{
					if(!obj[dat]){
						ts += '<'+dat+'/>';
					}else{
						ts += "<"+dat+">";
						if(obj[dat].length < 256 && obj[dat].search(/\n/)==-1 )
							ts += _UTL.htmlEnc(obj[dat]);
						else
							ts += "<![CDATA["+obj[dat]+"]]>";
						ts += "</"+dat+">";
					}
				}
				break;
		}
	}
	if(ts=="" && obj.toString().search(/object/) == -1)
		ts = obj.toString();
	if(objName)
		ts = "<"+objName+" "+atts+" >"+ts+"</"+objName+">";
		
	return ts;
};
_ZXML.getArray = function(obj){
	var ar = [];
	if(obj){
		if( typeof(obj.length)=="undefined")
			ar[0] = obj;
		else
			ar = obj;
	}
	return ar;
};

_ZXML.formatXMLstr = function(xmls){
	var es = '<?xml version="1.0" encoding="UTF-8"?>';
	var m = xmls.match(/<\?xml.*encoding="(.*)"\?>/);
	if(!m)
		xmls = es + xmls.replace(/<\?xml.*\?>/,"");
	return xmls;
};
_ZXML.init = function(){
	
	if(window.XMLHttpRequest) {
	  try { _ZXML.req = new XMLHttpRequest();
	  } catch(e) { _ZXML.req = false; }
	} else if(window.ActiveXObject) {
	  try { _ZXML.req = new ActiveXObject('Msxml2.XMLHTTP');
	  } catch(e) {
	  try { _ZXML.req = new ActiveXObject('Microsoft.XMLHTTP');
	  } catch(e) { _ZXML.req = false; }
	} }
	
	if(_ZXML.req) {
	  _ZXML.req.onreadystatechange = function(){
			if (_ZXML.req.readyState == 4 && _ZXML.req.status == 200 && _ZXML.req.responseXML ) {
				if(typeof(_ZXML.cbFun)=="function")
					_ZXML.cbFun(req.responseXML);
			  _ZXML.readyState = "complete";
				var oq = _ZXML.queue.shift();
				if(oq)
					_ZXML.loadXMLDoc(oq.URL,oq.fun);
			}
	  };
	}
	_ZXML.readyState = "complete";
};


_COMM = {IE:(navigator.appName.indexOf("Microsoft") != -1),
	IE6:(navigator.appVersion.match(/MSIE [1-6]\.\d/)),
	auth:{},
	staticServer:"",
	readyState:"uninitialized",
	onComLoad:null,
	onBroadcast:[],
	clientID:null,
	queue:new Array(),
//	reqQueue:new Array(),
	callback:{},
	reqCallback:{},
	logChkWaits:[],
	docLoadingCounter:1000,
	chkTimeout:null,
	chkInitFailed:false,
	ofl:null,chkInv:null};

_COMM.init = function(commid){
	if(!document.body){
		window.setTimeout("_COMM.init()",1000);
		return;
	}
	_STATS.init();
	var jss = document.getElementsByTagName("SCRIPT");
	var m;
	for(var i=0;i<jss.length;i++){
		m = jss[i].src.match( /(.*\/)comm\.js/ );
		if(m){
			_COMM.staticServer = m[1];
			break;
		}
	}
	var el = document.getElementById('_commFlashDiv');
	if(!el){
		el = document.createElement("DIV");
		el.id = '_commFlashDiv';
		el.style.width = "0px";
		el.style.height = "0px";
		document.body.appendChild(el);
		var TT = true;//(navigator.appVersion.search(/tencent/i) != -1);
		var ts;
		var fv = (typeof(commid)=="string"? "commid="+commid+"&" : "")
			+ 'setReadyState=_COMM.setReadyState&onLoad=_COMM.onLoadCallback&BC_JSCallback=_COMM.gotMessage&MP3_callBack=_MP3.onCallBack';
		if(_COMM.IE){
			ts = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" id="_commFlash_ob" style="width:0px;height:0px;">'
				+'<param name="allowScriptAccess" value="always" />'
				+'<param name="allowNetworking" value="all" />'
				+'<param name="wmode" value="Window"/>'
				+'<param name="FlashVars" value="'+fv+'" />'
				+'<param name="movie" value="'+_COMM.staticServer+'comm.swf'+(TT?"?"+Math.random():"")+'" /></object>';
			el.innerHTML = ts;
		}else{
	//		window.onerror = function(sMsg,sUrl,sLine){alert(sMsg) };
			var ver = [0,0,0];
			if(navigator.plugins&&navigator.mimeTypes.length){
				var x=navigator.plugins["Shockwave Flash"];
				if(x&&x.description){
					ver = x.description.replace(/([a-zA-Z]|\s)+/,"").replace(/(\s+r|\s+b[0-9]+)/,".").split(".");
					if(ver[0]=="9" && ver[1]=="0" && Number(ver[2]) < 115){
						_COMM.msgQueueNeedCallback = true;
					}
					//["9","0","115"]
				}
			}
			ts = '<embed src="'+_COMM.staticServer+'comm.swf?'+Math.random()+'" wmode="Window" FlashVars="'+fv+'" width="0" height="0"  name="_commFlash_em" allowScriptAccess="always" type="application/x-shockwave-flash" swLiveConnect="true" pluginspage="http://www.macromedia.com/go/getflashplayer" />';
			try{
				el.innerHTML = ts;
			}catch(err){}
		}
	}
	_COMM.chkTimeout = window.setTimeout("_COMM.checkFailed()",10000);
	_COMM.chkInv = window.setInterval(_COMM.checkFlash,100);
};

_COMM.checkFailed = function(){
	_COMM.chkInitFailed = true;
	var el = document.getElementById('_commFlashDiv');
	if(el)	el.innerHTML = "";
//	if( typeof(_ZWF)=="object" && typeof(_ZWF.commInited)=="function"){
//		_ZWF.commInited();
//	}
	_COMM.onLoadCallback(null);
};

_COMM.checkFlash = function(){
	try{
		if(_COMM.IE){
			_COMM.ofl = window["_commFlash_ob"];
		}else{
			_COMM.ofl = document["_commFlash_em"];
		}
		if(_COMM.ofl){
//			_COMM.ofl.SetVariable("isJSReady",true);
			if(typeof(_COMM.ofl.setFlashReady)=="function" ){ 
				_COMM.ofl.setFlashReady();
			}
		}
	}catch(err){}
};
_COMM.onLoadCallback = function(commid){
	if(_COMM.chkInv)
		window.clearInterval(_COMM.chkInv);
	if(_COMM.chkTimeout)
		window.clearTimeout(_COMM.chkTimeout);
	_COMM.clientID = commid;
	if(commid){
		_COMM.docLoadingCounter = 0;
		if(typeof(_ZWF)!="undefined")
			_COMM.checkLoginStatus();
		if(typeof(_COMM.onComLoad)=="function")
			window.setTimeout('_COMM.onComLoad()',200);
	}
};




_COMM.checkLoginStatus = function(cbFun,oau){
	if(typeof(cbFun)=="function"){
		_COMM.logChkWaits.push(cbFun);
	}
//	_COMM.getCookie("auth","loginInfo",_COMM.gotAuth);
	_COMM.gotAuth(oau);
};

_COMM.gotAuth = function(oau){
	var cks = _COMM.auth.cookies;
	if(oau ) { //&& oau.pkey &&  oau.expireDate && oau.expireDate > (new Date()).valueOf()
		_COMM.auth = oau;
	}
	_COMM.getSinaCookie(cks);
	if(document.location.host.match(/say\-on\.com/i)){
		var scks = _UTL.getCookie("WDP");
		if(scks)
			_COMM.auth.pkey = scks;
	}

	_COMM.auth.loginAccList = _COMM.getLoginAccList();
	if(_COMM.auth.bLogin && typeof(_ZWF)!="undefined" && _ZWF.hubServer ){
		_ZWF.mainServer = _ZWF.hubServer;
	}

	var afun;
	for(var i=0;i<_COMM.logChkWaits.length;i++){
		if(typeof(_COMM.logChkWaits[i])=="function")
			_COMM.logChkWaits[i](_COMM.auth);
	}
	_COMM.logChkWaits = [];
};

_COMM.deleteAuth = function(){
	_COMM.deleteCookie("auth");
};

_COMM.saveAuth = function(oau){
	if(!oau) oau = _COMM.auth;
	oau.loginAccList = {};
	_COMM.setCookie("auth","loginInfo",oau);
};

_COMM.getLoginAccList = function(){
	var alg = {};
	_COMM.auth.bLogin = 0;
	if(!_COMM.auth) return alg;
	var sui = _COMM.getSinaCookieInfo(_COMM.auth.cookies);
	if(sui.uid){
		_COMM.auth.sinaUserInfo = sui;
		alg["sina"] = {cookies:_COMM.auth.cookies};
		_COMM.auth.bLogin |= 0x1;
	}
	var d = new Date();
	if( _COMM.auth.pkey && _COMM.auth.pkey != 'null'  && _COMM.auth.expireDate &&( _COMM.auth.expireDate > d.valueOf()) ){
		alg["say-on"] = {pkey:_COMM.auth.pkey};
		_COMM.auth.bLogin |= 0x2;
	}
	
	return alg;
};

_COMM.getAuthShortcut = function(module,oau){
	module.auth = {isMine:false,isSinaUser:false,isSayOnUser:false,isLogin:false};
	if(document.location.host.match(/say\-on\.com/i)){
		_COMM.auth.pkey = _UTL.getCookie("WDP");
	}
	if(oau && oau.bLogin > 0 ){
		module.auth.isLogin = oau.bLogin;
		module.auth.isSinaUser = (oau.sinaUserInfo && oau.sinaUserInfo.uid && oau.sinaUserInfo.uid != "null" && oau.sinaUserInfo.uid!="");
		var d = new Date();
		module.auth.isSayOnUser = ( oau.pkey && oau.pkey != 'null'  && oau.expireDate &&( oau.expireDate > d.valueOf()) );
		if(module.oifo.winInfo.hostPage.search(/sina\.com\.cn/i)==-1)
			module.auth.isMine = (module.owner.uid == oau.uid && oau.bLogin);
		else
			module.auth.isMine = (module.auth.isSinaUser && module.owner && module.owner.sina.uid == oau.sinaUserInfo.uid && oau.bLogin);
	}
};

_COMM.getSinaCookieInfo = function(cks){
	var sui = {uid:null,username:null,nick:null};
	if(typeof(cks)!="string")
		cks = document.cookie;
	var mSUP = cks.match(/(^|\s)SUP=([^;]*)/);
	if( mSUP && mSUP[2]){
		var ssup = unescape(mSUP[2]);
		var asup = ssup.split("&");
		var def = {'uid':'uid','user':'username','nick':'nick'};
		var aitm,itm;
		for(var i=0;i<asup.length;i++){
			aitm = asup[i].split("=");
			itm = def[aitm[0]];
			if(itm){
				sui[itm] = aitm[1];
			}else{
				sui[aitm[0]] = aitm[1];
			}
		}
		if(sui.uid && !sui.nick)
			sui.nick = sui.username;
	}else if( cks.search(/SE=/)!=-1 && cks.search(/SU=/)!=-1){
		var mSE = cks.match(/SE=([0-9A-F]+)/m);
		var reSU = ( /SU=([^:]+):(\d+):(\d+):(.*):(\d+):(.*):(.*):(.*)/m );
		var mSU = cks.match(reSU);
		if(!mSU)
			mSU = unescape(cks).match(reSU);
		var renk = ( /nick=([^=|;]*)\((\d+)\)(;|$)/m );
		var mnick = cks.match(renk);
		if(!mnick ||!mnick[1] )
			mnick = unescape(cks).match(renk);
		if(mSE && mSE[1] && mSU && mSU[1] && mSU[3] ){ //&& mnick && mnick[2] && mnick[2]==mSU[3]
			var sui = {
				uid : mSU[3],
				username : unescape(mSU[1]),
				nick : (mnick && mnick[1]? mnick[1] : "" ) };
			if(sui.nick.search('%')!=-1)
				sui.nick = unescape(sui.nick);
		}
	}

	if(sui.uid){
		var m = cks.match(/blog_nickname_ria=([^;|$]*)(;|$)/m);
		if(m && m[1])
			sui.nick = unescape(m[1]);
	}

	return sui;
};

_COMM.formatSinaCookie = function(cks){
	if(!cks) return "";
	cks = cks.replace(/(\r|\n)+/gm,"");
	var ack = cks.split("Set-Cookie:");
	var m;
	var s = "";
	for(var i=0;i<ack.length;i++){
		if(!ack[i].match(/\w+=.*;/))
			continue;
		s += ack[i].substr(0,ack[i].indexOf(";")+1);
	}
	return (s != "" && ack.length > 1 ? s : cks);
};
_COMM.saveSinaCookie = function(cks){
	if(!cks) return;
	cks = cks.replace(/(\r|\n)+/gm,"");
	var ack = cks.split("Set-Cookie:");
	var m;
	for(var i=0;i<ack.length;i++){
		if(!ack[i].match(/\w+=.*;/))
			continue;
		document.cookie  = ack[i];
	}
	_COMM.auth.cookies = _COMM.formatSinaCookie(cks);
};

_COMM.getSinaCookie = function(cks){
	if(document.location.host.match(/sina\.com\.cn/i)){
		_COMM.auth.cookies = document.cookie;
		var sui = _COMM.getSinaCookieInfo(_COMM.auth.cookies);
		if(!sui.uid)
			_COMM.auth.pkey = "";
	}else{
		var sui = _COMM.getSinaCookieInfo(cks);
		var sui1 = _COMM.getSinaCookieInfo(_COMM.auth.cookies);
		if(!sui1.uid || ( sui.uid && sui.uid != sui1.uid) )
			_COMM.auth.cookies = cks;
	}
	_COMM.setCookie("auth","loginInfo",_COMM.auth);

};

_COMM.spam = {uic:'http://uic.sinajs.cn/spam?str=',
	buff:{}};
_COMM.spam.check = function(kw,cbFun){
	if( typeof(cbFun)!='function' || typeof(kw)!='string' || kw.replace(/\s/gm) == '')
		return false;
	var str = encodeURIComponent(kw.replace(/[\r|\n|\s]/gm,''));
	if(str.length > 1000)
		return false;
	var obuf = _COMM.spam.buff[str];
	if(obuf && typeof(obuf.fun) == 'function' ){
		obuf.fun(obuf.rv);
		return true;
	}
	_COMM.spam.buff[str] = {fun:cbFun,rv:null};
	_COMM.loadXMLDoc(_COMM.spam.uic+str,_COMM.spam.callback);
	return true;
};
_COMM.spam.callback = function(xmls,surl){
	var str = surl.replace(_COMM.spam.uic,"");
	var obuf = _COMM.spam.buff[str];
	if(obuf){
		obuf.rv = (xmls == '-1');
		if(typeof(obuf.fun) == 'function'){
			obuf.fun(obuf.rv);
		}
	}
};



_COMM.setReadyState = function(statStr){
	_COMM.readyState = statStr;
};
_COMM.getReadyState = function(){
	return _COMM.readyState;
};

_COMM.sendNotify = function(to,obj){
	if(_COMM.msgQueue.length > 0)
		return false;
	try{
		if(_COMM.IE){
			var afun = _COMM.ofl.sendMessage;
			afun("_R_"+to,obj,false);
		}else{
			_COMM.ofl.sendMessage("_R_"+to,obj,false);
		}
	}catch(err){return false;}
	return true;
};


_COMM.msgQueue = [];
_COMM.sendMessage = function(to,obj){
	_COMM.msgQueue.push({to:to,obj:obj});
	if(_COMM.msgQueue.length == 1){
		_COMM.execMsgQueue();
	}
};
_COMM.msgInProgress = 0;
_COMM.msgQueueRetryCounter = 0;
_COMM.msgQueueRevID = "";
_COMM.msgQueueNeedCallback = true;
_COMM.execMsgQueue = function(){
	var nextRun = false;
	var succ = true;
	if(_COMM.msgInProgress < 1 || !_COMM.msgQueueNeedCallback){
		if(_COMM.msgQueue.length > 0){
			try{
				if(_COMM.IE){
					var afun = _COMM.ofl.sendMessage;
					afun("_R_"+_COMM.msgQueue[0].to,_COMM.msgQueue[0].obj,_COMM.msgQueueNeedCallback);
				}else{
					_COMM.ofl.sendMessage("_R_"+_COMM.msgQueue[0].to,_COMM.msgQueue[0].obj,_COMM.msgQueueNeedCallback);
				}
			}catch(err){
				nextRun = true;
				succ = false;
				_COMM.msgQueueRetryCounter ++;
				//window.status = "msgQueueRetryCounter: "+_COMM.msgQueueRetryCounter;
				if(_COMM.msgQueueRetryCounter > 500)
					_COMM.onFlashGotMessage();
			}
			if(succ){
				_COMM.msgInProgress ++;
				_COMM.msgQueueRetryCounter = 0;
				if(!_COMM.msgQueueNeedCallback)
					window.setTimeout("_COMM.onFlashGotMessage()",100);
			}
			if(_COMM.msgQueue.length > 0)
				nextRun = true;
		}
	}else{
		nextRun = true;
	}
	if(nextRun){
		window.setTimeout("_COMM.execMsgQueue()",200);
	}
};

_COMM.onFlashGotMessage = function(){
	_COMM.msgQueue.shift();
	_COMM.msgInProgress --;
};

_COMM.gotMessage = function(sender,omsg){
	if(typeof(_COMM.onMessage)=="function"){
		_COMM.onMessage(sender,omsg);
	}
};

_COMM.docQueue = [];
_COMM.docQueueRetryCounter = 0;

_COMM.loadXMLDoc = function(surl,cbFun){
	_COMM.docQueue.push({surl:surl,cbFun:cbFun});
	if(_COMM.docQueue.length == 1){
		_COMM.execDocQueue();
	}
};

_COMM.execDocQueue = function(){
	var nextRun = false;
	var succ = true;
	if(	_COMM.docLoadingCounter < 2 && _COMM.readyState == "complete"){
		if(_COMM.docQueue.length > 0){
			var aq = _COMM.docQueue[0];
			try{
				if(_COMM.IE){
					var afun = _COMM.ofl.loadData;
					afun(aq.surl,"_COMM.gotXMLStr");
				}else{
					_COMM.ofl.loadData(aq.surl,"_COMM.gotXMLStr");
				}
			}catch(err){
				nextRun = true;
				succ = false;
				_COMM.docQueueRetryCounter ++;
			}
			if(succ){
			_COMM.docLoadingCounter ++;
			_COMM.readyState == "loading";
			_COMM.callback[aq.surl] = (typeof(aq.cbFun)=="function" ? aq.cbFun : function(){}) ;
			var oq = _COMM.docQueue.shift();
			_COMM.docQueueRetryCounter = 0;
			}
			if(_COMM.docQueueRetryCounter > 50)
				_COMM.docQueue.shift();
			if(_COMM.docQueue.length > 0)
				nextRun = true;
		}
	}else{
		nextRun = true;
	}
	if(nextRun){
		window.setTimeout("_COMM.execDocQueue()",100);
	}
};


_COMM.gotXMLStr = function(xmls,surl){
	_COMM.setReadyState("complete");
	_COMM.docLoadingCounter --;
	var afun = _COMM.callback[surl];
	if(typeof(afun)=="function"){
		afun(xmls,surl);
	}
};

_COMM.xmlQueue = [];
_COMM.xmlLoadingCounter = 0;
_COMM.xmlQueueRetryCounter = 0;
_COMM.sendXML = function(surl,xmls,cbFun){
	xmls = _ZXML.formatXMLstr(xmls);
	_COMM.xmlQueue.push({surl:surl,xmls:xmls,cbFun:cbFun});
	if(_COMM.xmlQueue.length == 1){
		_COMM.execXmlQueue();
	}
};

_COMM.execXmlQueue = function(){
	var nextRun = false;
	var succ = true;
	if(_COMM.xmlLoadingCounter < 3){
		if(_COMM.xmlQueue.length > 0){
			var aq = _COMM.xmlQueue[0];
			try{
				if(_COMM.IE){
					var afun = _COMM.ofl.reqXML;
					afun(aq.surl,aq.xmls,"_COMM.sendXMLCallback");
				}else{
					_COMM.ofl.reqXML(aq.surl,aq.xmls,"_COMM.sendXMLCallback");
				}
			}catch(err){
				nextRun = true;
				succ = false;
				_COMM.xmlQueueRetryCounter ++;
			}
			if(succ){
				_COMM.reqCallback[aq.surl] = (typeof(aq.cbFun)=="function" ? aq.cbFun : function(){}) ;
				_COMM.xmlLoadingCounter ++;
				var oq = _COMM.xmlQueue.shift();
				_COMM.xmlQueueRetryCounter = 0;
			}
			if(_COMM.xmlQueueRetryCounter > 50)
				_COMM.xmlQueue.shift();
			if(_COMM.xmlQueue.length > 0)
				nextRun = true;
		}
	}else{
		nextRun = true;
	}
	if(nextRun){
		window.setTimeout("_COMM.execXmlQueue()",100);
	}
};


_COMM.sendXMLCallback = function(xmls,surl){
	_COMM.setReadyState("complete");
	var fun = _COMM.reqCallback[surl];
	if(typeof(fun)=="function"){
		fun(xmls,surl);
	}
	_COMM.xmlLoadingCounter --;
};


_COMM.setCookie = function(type,key,obj){
	try{
	return _COMM.ofl.setCookie(type,key,obj);
	}catch(err){return false}
};
_COMM.getCookie = function(type,key,cbFun){
	var rv = "";
	try{
		_COMM.cbFun_Cookie = (typeof(cbFun)=="function" ? cbFun : function(){}) ;
		rv = _COMM.ofl.getCookie(type,key,"_COMM.gotCookie");
	}catch(err){}
	return rv;
};
_COMM.gotCookie = function(obj){
	if(typeof(_COMM.cbFun_Cookie)=="function")
		_COMM.cbFun_Cookie(obj);
};
_COMM.deleteCookie = function(type){
	return _COMM.ofl.deleteCookie(type);
};

_STATS = {svr:"http://widget.say-on.com/go/stats.do",
	queue:[],
	el:null};

_STATS.init = function(){
	var el = document.getElementById('_say-on_Stats_ImgElement');
	if(!el){
		el = document.createElement("IMG");
		el.id = '_say-on_Stats_ImgElement';
		el.style.width = "0px";
		el.style.height = "0px";
		document.body.appendChild(el);
	}
	_STATS.el = el;
};

_STATS.add = function(sid,desc,uid){
	if(!sid) return;
	if(!uid){
		if(_COMM && _COMM.auth ){
			if(_COMM.auth.uid)
				uid = _COMM.auth.uid;
			else if(_COMM.auth.sinaUserInfo && _COMM.auth.sinaUserInfo.uid)
				uid = _COMM.auth.sinaUserInfo.uid;
		}
		if(!uid)
			uid = "";
	}
	if(!desc)	desc = "";
	var s = '?d='+(new Date()).valueOf()+'&sid='+sid+'&uid='+uid+'&desc='+encodeURIComponent(desc);
	_STATS.queue.push(s);
	if(_STATS.queue.length == 1)
		_STATS.execQueue();
};

_STATS.execQueue = function(){
	if(!_STATS.el || _STATS.queue.length < 1)
		return;
	var s = _STATS.queue.shift();
	_STATS.el.src = _STATS.svr + s;
	if(_STATS.queue.length > 0)
		window.setTimeout("_STATS.execQueue()",1000);
};


_MP3 = {};
_MP3.info = {};
_MP3.event = {
onLoadStatusChange : null,
onPlayPositionChange : null,
onLoad : null,
onLoadFailed : null,
onID3 : null,
onSoundComplete : null,
onStart : null,
onPause : null,
onStop : null,
onMute : null};

_MP3.onCallBack = function(ev,oifo){
	this.info = oifo;
	if( typeof(this.event[ev])== "function" )
		this.event[ev](oifo);
};
_MP3.load = function(surl){
	if(!surl || surl =="")
		return;
	_COMM.ofl.Sound_load(surl);
};
_MP3.start = function(sec){
	if(!sec) sec = _MP3.info.pausePoint;
	_COMM.ofl.Sound_start(sec);
};
_MP3.stop = function(){
	_COMM.ofl.Sound_stop();
};
_MP3.pause = function(){
	_COMM.ofl.Sound_pause();
};
_MP3.mute = function(){
	_COMM.ofl.Sound_mute();
};
_MP3.play = function(surl){
	var curl = this.info.currURL;
	if(!curl)
		curl = "";
	if(!surl || surl=="")
		surl = curl;
	if(surl != "" && surl != this.info.currURL){
			this.load(surl);
			this.info.isPlaying = true;
	}else{
		if(this.info.isPlaying)
			this.pause();
		else
			this.start();
	}	
	
};

var _PNG = {};
_PNG.setBackground = function(itm,imgpath,mod){
	if(!itm) return;
	if(!mod)
		mod = 'scale';
	if(_COMM.IE6 && typeof(itm.style.filter)!="undefined" && imgpath.match(/\.png$/i) ){
		itm.style.backgroundImage = "none";
		itm.style.filter = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true, sizingMethod='+mod+', src="'+imgpath+'");';
	}else{
		itm.style.backgroundImage = (imgpath && imgpath!="" ? 'url("'+imgpath+'")' : 'none');
	}
};
_PNG.getBgStr = function(imgs){
	var s = '';
	if(_COMM.IE6 && imgs.match(/\.png$/i) ){
		s = "background-image:none;	filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true, sizingMethod=scale, src='"+imgs+"');"
	}else{
		s = "background-image:url('"+imgs+"') ;";
	}
	return s;
};

_PNG.correct = function(oimg){
if(!oimg || oimg.src.search(/.png$/ig)==-1 || typeof(document.body.style.filter)=="undefined")
	return;
var imgID = (oimg.id) ? "id='" + oimg.id + "' " : "";
var imgClass = (oimg.className) ? "class='" + oimg.className + "' " : "";
var imgTitle = (oimg.title) ? "title='" + oimg.title + "' " : "title='" + oimg.alt + "' ";
var imgStyle = "display:inline-block;" + oimg.style.cssText;
var iatts = oimg.attributes;
var imgEvents = '';
for (var j=0; j<iatts.length; j++){
var iatt = iatts[j];
if(!iatt.nodeName || iatt.nodeName.toLowerCase() == 'onload'  || !iatt.nodeValue)
continue;
if (iatt.nodeName == "align"){
if (iatt.nodeValue == "left") imgStyle = "float:left;" + imgStyle;
if (iatt.nodeValue == "right") imgStyle = "float:right;" + imgStyle;
}else{
	imgEvents += " "+iatt.nodeName+'="' + iatt.nodeValue + '"';
}	
}
var s = "<span " + imgID + imgClass + imgTitle + imgEvents;
s += " style=\"" + "width:" + oimg.width + "px; height:" + oimg.height + "px;" + imgStyle + ";";
s += "filter:progid:DXImageTransform.Microsoft.AlphaImageLoader";
s += "(src=\'" + oimg.src + "\', sizingMethod='scale');\"></span>";
oimg.outerHTML = s;
};


var _ZDrag = {

"dragObj" : null ,
"clickObj" : null,
"overObj" : null,
"event" : null ,
"cursor" : "default",
"offx" : 0,
"offy" : 0,
"sx" : 0,
"sy" : 0,
"dropfun" : null,
"movefun" : null,
"docmove" : null,
"docup" : null,
"oblind":null,
"obg":null,
"start" : function (e,el,dropfun,movefun){
_ZDrag.event = e ? e : (window.event ? window.event : null);
_ZDrag.dragObj = el;   
_ZDrag.clickObj = _ZDrag.event.target || _ZDrag.event.srcElement;

var ob = document.createElement("DIV");
ob.style.position = "absolute";
ob.style.zIndex  = _ZDrag.dragObj.style.zIndex + 1;
ob.style.top = _ZDrag.dragObj.style.top;
ob.style.left = _ZDrag.dragObj.style.left;
ob.style.width = _ZDrag.dragObj.style.width;
ob.style.height=_ZDrag.dragObj.style.height;  
document.body.appendChild(ob);
_ZDrag.oblind = ob;

var tb = _UTL.truebody();
ob = _UTL.blind.show(_ZDrag.dragObj.style.zIndex - 1,'#ffffff',5);

if(_ZDrag.oblind.setCapture)
_ZDrag.oblind.setCapture();
else if(window.captureEvents)
window.captureEvents(Event.MOUSEMOVE|Event.MOUSEUP);
_ZDrag.dragObj.style.position="absolute";
_ZDrag.cursor = _ZDrag.dragObj.style.cursor;
_ZDrag.dragObj.style.cursor="move";

if(typeof(window.pageYOffset) == "undefined"){
	_ZDrag.sy = tb.scrollTop;
	_ZDrag.sx = tb.scrollLeft;
}else{
	_ZDrag.sy = window.pageYOffset;
	_ZDrag.sx = window.pageXOffset;
}
_ZDrag.offx= _ZDrag.event.clientX -_ZDrag.oblind.offsetLeft+_ZDrag.sx;
_ZDrag.offy= _ZDrag.event.clientY -_ZDrag.oblind.offsetTop+_ZDrag.sy;

_ZDrag.dropfun = typeof(dropfun)=="function" ? dropfun : null;
_ZDrag.movefun = typeof(movefun)=="function" ? movefun : null;
_ZDrag.docmove = document.onmousemove;
document.onmousemove = _ZDrag.draging ;
_ZDrag.docup = document.onmouseup;
document.onmouseup = _ZDrag.stop ;
},

"draging" : function(e) {
if(_ZDrag.dragObj){
var tb = _UTL.truebody();
var i = (e? e.pageY : _ZDrag.event.clientY+_ZDrag.sy) -_ZDrag.offy;
if( i > 0 && i+_ZDrag.dragObj.clientHeight < tb.scrollHeight ){ 
	_ZDrag.dragObj.style.top = i+"px";
	_ZDrag.oblind.style.top = i+"px";
}

i = (e? e.pageX : _ZDrag.event.clientX+_ZDrag.sx) -_ZDrag.offx;
if( i > 0 && i+_ZDrag.dragObj.clientWidth < tb.scrollWidth ){ 
	_ZDrag.dragObj.style.left = i+"px";
	_ZDrag.oblind.style.left = i+"px";
}

_ZDrag.dragObj.style.bottom = "auto";
_ZDrag.dragObj.style.right = "auto";
_ZDrag.overObj = _ZDrag.event.target || _ZDrag.event.srcElement;
}
if(_ZDrag.movefun && _ZDrag.overObj){
_ZDrag.movefun(_ZDrag.overObj);
}
},
"stop" : function () {
if(_ZDrag.dragObj){
_ZDrag.dragObj.style.cursor = _ZDrag.cursor;
}
if(_ZDrag.dropfun){
_ZDrag.dropfun(_ZDrag.overObj);
}
_ZDrag.dropfun = null;
_ZDrag.movefun = null;
_ZDrag.event = null;
_ZDrag.dragObj = null;
_ZDrag.overObj = null;
document.onmousemove = _ZDrag.docmove ;
document.onmouseup = _ZDrag.docup ;
if(_ZDrag.oblind && _ZDrag.oblind.releaseCapture){
_ZDrag.oblind.releaseCapture();
}else if(window.captureEvents)
window.captureEvents(Event.MOUSEMOVE|Event.MOUSEUP);
_ZDrag.clickObj = null;
document.body.removeChild(_ZDrag.oblind);
_UTL.blind.hide();
}
}


/*
window.onerror=fnErrorTrap;
function fnErrorTrap(sMsg,sUrl,sLine){
var s="";
s+="Error: " + sMsg + "\n";
s+="Line: " + sLine + "\n";
s+="URL: " + sUrl + "\n";
alert(s);
return false;
}
*/



_WCHAT = {
	myChatID:"",
	myInfo:{p:'',nick:'',uid:'',istatus:0,sstatus:'',realname:''},
	hid:"",
	hasChatWin:false,
	msgSvr:null,
	msgBuff:[],
	msgBuffIdx:{},
	users:{},
	recentContacts:{},
	rooms:{},
	block:{list:{},been:{}},
	topicRooms:{},
	topics:{},
	currTopics:{},
	enc:"utf-8",
	queue:{},
	reqID:null,
	currQID:null,
	Timeout:35000,
	lastMsgID:100,
	pris:{send:10,check:0},
	offlineNum:0,
	fallCount:0,
	firstload:true,
	paused:false,
	bReady:false,
	iTimer:null,
	getstat:{buff:[],loading:false,iTimer:null},
	re : {revMessage:null},
	waits:[1000,2000,3000,4000,5000,6000,7000,8000,9000,10000,11000,12000],
	waitIndex:0,
	waitLocSvr:2000,
	server:{
		head:"http://chat.say-on.com/webchat/",
		start:"start.do",
		getchatid:"getroomid.do",
		getstatus:"status.do",
		joinRoom:"join.do",
		quitRoom:"quit.do",
		updatestatus:"stsupdate.do",
		offlinemsg:"offline.do",
		add2group:"invite.do",
		userInfo:"userinfo.do",
		cfgUpdate:"configupdate.do",
		preview:"preview.do",
		buddyHistory:"history.do",
		roomonline:"roomonline.do",
		getmsg:""}};

_WCHAT.server.sendmsg = _WCHAT.server.head + "chat.do";
_WCHAT.server.roominfo = _WCHAT.server.head + "roominfo.do";


_WCHAT.start = function(cks){
	if( !cks || cks =="" ){
		cks = document.cookie;
	}
	if(!cks) cks = "";
	_WCHAT.hid = _COMM.clientID;
	_WCHAT.firstload = true;
	_WCHAT.lastMsgID = ( _WCHAT.isChatWinHid(_WCHAT.hid) ? 0 : 100);
	var ost = {cookies:cks};
	var xmls = _ZXML._obj2xmlstr(ost,"request");
	var idstr = "id";
	if(!_WCHAT.reqID){
		_WCHAT.reqID = Math.random();
		if(_WCHAT.myInfo.uid != "")
			_WCHAT.reqID = _WCHAT.myInfo.uid;
		idstr = "uid";
	}
	_COMM.sendXML(_WCHAT.server.head + _WCHAT.server.start+"?"+idstr+"="+_WCHAT.reqID,xmls,_WCHAT.startCallback);
	
};

_WCHAT.startCallback = function(str){

	var orv = _UTL.getJSONData(str);
	
	if(!orv || !orv.myChatID || orv.myChatID==""){
		if(typeof(_WCHAT.onErr) == "function")
			_WCHAT.onErr('cannotStart',10);
		return;
	}

	_WCHAT.myChatID = orv.myChatID;
	_WCHAT.myRoomID = orv.myRoomID;

	_UTL.setCookie("chatid",_WCHAT.myChatID);

	if( orv.laststatus && typeof(orv.laststatus.istatus)!="undefined" ){
		_WCHAT.myInfo.istatus = Number(orv.laststatus.istatus);
		_WCHAT.myInfo.sstatus = orv.laststatus.sstatus;
		_WCHAT.myInfo.nick = orv.laststatus.nick;
		_WCHAT.myInfo.realname = orv.laststatus.realname;
		_WCHAT.myInfo.p = orv.laststatus.ptype;
		_WCHAT.myInfo.uid = orv.laststatus.puid;
		_WCHAT.myInfo.laststatus = orv.laststatus;
	}
	
	if(orv.waits)
		_WCHAT.waits = orv.waits;

	if(typeof(_WCHAT.onStart)=="function")
		_WCHAT.onStart();

	_WCHAT.waitIndex = (_WCHAT.isChatWinHid(_WCHAT.hid) ? 1:3);
	_WCHAT.iTimer = window.setTimeout("_WCHAT.timerEvent()", 1000);

	if(typeof(orv.offline)!="undefined" && orv.offline > 0 && typeof(_WCHAT.gotOfflineNum)=="function" ){
		_WCHAT.offlineNum = orv.offline;
		_WCHAT.gotOfflineNum(orv.offline);
	}

};

_WCHAT.getInfoFromRoomid = function(roomid){
	if(!roomid)
		roomid = "";
	var ar = roomid.split("_");
	var tp = (ar[1]?ar[1]:0);
	var lab = (tp == 3 ? ar[3] :ar[2]);
	var rv = {
		provider:(ar[0]?ar[0]:''),
		type:tp,
		group:(tp == 3 ? ar[2] : 0),
		label:(lab?lab:''),
		isMine:((tp == 4 || tp == 3) && lab == _WCHAT.myChatID ),
		roomid:roomid};
		
	return rv;
};

_WCHAT.isRoom = function(roomid){
	return (typeof(roomid) == "string" && roomid.indexOf('_')>=0 );
};

_WCHAT.isMyRoom = function(roomid){
	var ori = _WCHAT.getInfoFromRoomid(roomid);
	return ori.isMine;
};


_WCHAT.updateStatus = function(istatus){
	if(_WCHAT.myChatID == "" || typeof(_WCHAT.myInfo.istatus)=='undefined' ){
		window.setTimeout("_WCHAT.updateStatus("+istatus+")",1000);
		return;
	}
	if(!istatus)
		istatus = _WCHAT.myInfo.istatus;
	var fn = _WCHAT.server.head + _WCHAT.server.updatestatus + "?id="+_WCHAT.myChatID;

	var ost = {
		realname:(_WCHAT.myInfo.realname && _WCHAT.myInfo.realname!='null' ? _WCHAT.myInfo.realname : ""),
		nick:(_WCHAT.myInfo.nick ? _WCHAT.myInfo.nick : ""),
		sstatus:(_WCHAT.myInfo.sstatus ?  _WCHAT.myInfo.sstatus : ""),
		provider:(_WCHAT.myInfo.p && _WCHAT.myInfo.p != "" ? _WCHAT.myInfo.p : ""),
		puid:_WCHAT.myInfo.uid,
		istatus:String(istatus)};
		
	var xmls = _ZXML._obj2xmlstr(ost,"request");
	
	_COMM.sendXML(fn,xmls,_WCHAT.updateStatusCallback);

	
};

_WCHAT.updateStatusCallback = function(str,surl){
	
	return;
};

_WCHAT.getOfflineMessage = function(bclear){
	var fn = _WCHAT.server.head + _WCHAT.server.offlinemsg + "?id="+_WCHAT.myChatID
		+ (typeof(bclear)!="undefined" && bclear==false ? "&clear=false" : "");
	
	_COMM.loadXMLDoc(fn,_WCHAT.getOfflineMessageCallbakc);
};

_WCHAT.getOfflineMessageCallbakc = function(str,surl){
	var orv = _UTL.getJSONData(str);
	if(!orv)
		return;
	var msgs = [];
	var omsg;
	for(var i=0;i<orv.length;i++){
		omsg = orv[i];
		_WCHAT.offlineNum --;
		if(_WCHAT.msgBuffIdx[omsg.id])
			continue;
		omsg.isOffline = true;
		msgs.push(omsg);
	}
	if(_WCHAT.offlineNum < 0)
		_WCHAT.offlineNum = 0;

	if(msgs.length > 0){
		_WCHAT.msgPretreatment(msgs);
	}

}; 

_WCHAT.getOnlineBuddy = function(page,pageSize){
	
	var fn = _WCHAT.server.roominfo + "?id="+_WCHAT.myRoomID+'&g=-1&t=2';
	if(page)
		fn += ('&pg=' + page);
	if(pageSize)
		fn += ('&ps=' + pageSize);
		
	_COMM.loadXMLDoc(fn,_WCHAT.getOnlineBuddyCallback);

};

_WCHAT.getOnlineBuddyCallback = function(str,surl){

	var orv = _UTL.getJSONData(str);

	if(!orv)
		return;
	if(typeof(_WCHAT.gotOnlineBuddy)=="function"){
		_WCHAT.gotOnlineBuddy(orv);
	}
	
};


_WCHAT.getOnlineGroup = function(page,pageSize){
	if(_WCHAT.myInfo.p != 'sina')
		return false;
	var fn = _WCHAT.server.head + _WCHAT.server.roomonline + '?p='+_WCHAT.myInfo.p+'&uid='+_WCHAT.myInfo.uid+'&gn=true';
	if(page)
		fn += ('&pg=' + page);
	if(pageSize)
		fn += ('&ps=' + pageSize);
		
	_COMM.loadXMLDoc(fn,_WCHAT.getOnlineGroupCallback);

};

_WCHAT.getOnlineGroupCallback = function(str,surl){

	var orv = _UTL.getJSONData(str);

	if(!orv)
		return;
	if(typeof(_WCHAT.gotOnlineGroup)=="function"){
		_WCHAT.gotOnlineGroup(orv);
	}
	
};



_WCHAT.getUserInfo = function(){
	var fn = _WCHAT.server.head + _WCHAT.server.userInfo + "?id="+_WCHAT.myChatID+"&t=3";
	_COMM.loadXMLDoc(fn,_WCHAT.getUserInfoCallback);
};

_WCHAT.getUserInfoCallback = function(str,surl){
	
	var orv = _UTL.getJSONData(str);

	if(orv && orv.status == "succ"){
		var ou;
		if(orv.recentcontacts && orv.recentcontacts.length > 0){
			for(var i=0;i<orv.recentcontacts.length;i++){
				ou = orv.recentcontacts[i];
				_WCHAT.recentContacts[ou.uid] = orv.recentcontacts[i];
			}
		}

		var ts = orv.blocklist;
		var al;
		if(ts){
			_WCHAT.block.list = {};
			al = ts.split(",");
			for(var i=0;i<al.length;i++){
				if( al[i] != _WCHAT.myChatID )
					_WCHAT.block.list[al[i]] = true;
			}
		}
	
		ts = orv.beenblocklist;
		if(ts){
			_WCHAT.block.been = {};
			al = ts.split(",");
			for(var i=0;i<al.length;i++){
				if( al[i] != _WCHAT.myChatID )
					_WCHAT.block.been[al[i]] = true;
			}
		}

	}


	if(typeof(_WCHAT.gotUserInfo)=="function"){
		_WCHAT.gotUserInfo();
	}
	
};


_WCHAT.blockRoom = function(roomid,blk){
	
	var ori = _WCHAT.getInfoFromRoomid(roomid);
	var t = 1;
	var lv = (ori.type == 0 ? 101 : 1);
	if(blk == false)
		lv = -1;

	if(ori.type == 7)
		t = 2;
	else if(ori.type != 0)
		t = 3;

	var fn = _WCHAT.server.head + _WCHAT.server.cfgUpdate + "?id="+_WCHAT.myChatID + '&t='+t+"&level="+lv;
	fn += ('&target='+roomid);
	_COMM.loadXMLDoc(fn,_WCHAT.blockRoomCallback);
	
};

_WCHAT.blockRoomCallback = function(str,surl){
	var orv = _UTL.getJSONData(str);
	var succ = (orv && orv.status == "succ");
	var lv = _UTL.getUrlArg('level',surl);
	var roomid = _UTL.getUrlArg('target',surl);
	
	if(typeof(_WCHAT.onBlockRoom)=="function"){
		_WCHAT.onBlockRoom(roomid,lv,succ);
	}
	
};

_WCHAT.decodeSysMessage = function(omsg){

	switch(Number(omsg.type)){
		case -2:
			var m = omsg.text.match(/([^,]+),([^,]+),([^,]+)/);
			if(m && m[1] && m[2] && typeof(m[3])!="undefined" ){
				var lv = Number(m[3]);
				if(m[1]==_WCHAT.myChatID)
					_WCHAT.block.list[m[2]] = (lv > 0);
				else if(m[2]==_WCHAT.myChatID)
					_WCHAT.block.been[m[1]] = (lv > 0);
				if(typeof(_WCHAT.onBlockMessage) == "function")
					_WCHAT.onBlockMessage(m[1],m[2],lv);
				return true;
			}
			break;
		case -3:
			var am = omsg.text.split(',');
			var ist = Number(am[0]);
			if(!isNaN(ist))
				_WCHAT.myInfo.istatus = ist;
			if(typeof(am[1])=="string")
				_WCHAT.myInfo.sstatus = am[1];					
			if(typeof(_WCHAT.onStatusChange) == "function")
				_WCHAT.onStatusChange();
			return true;
			break;
		default:
			return false;
			break;
	}
	return false;
};

_WCHAT.getRoomUserList = function(roomid,tp){
	if(!tp)
		tp = 3;
	
	var fn = _WCHAT.server.roominfo + "?id="+roomid+'&t='+tp;
	
	_COMM.loadXMLDoc(fn,_WCHAT.getRoomUserListCallbakc);
};


_WCHAT.getRoomUserListCallbakc = function(str,surl){
	var roomid = _UTL.getUrlArg('id',surl);
	var orv = _UTL.getJSONData(str);

	if(!orv)
		return;
	if(typeof(_WCHAT.gotRoomUserList)=="function"){
		_WCHAT.gotRoomUserList(roomid,orv);
	}	
	
};
 
_WCHAT.getStatusName = function(stat,chatid){
	if(chatid){
		if(_WCHAT.block.list[chatid])
			return ((stat < 0 ? "off" : "on") + 'Block');
		if(_WCHAT.block.been[chatid])
			stat = -1;
	}
	var ols = (stat < 0 ? "off" : "on");
	if(stat >= 10 && stat < 20)
		ols = "away";
	else if(stat >= 20 && stat < 30)
		ols = "busy";
	else if(stat == -10)
		ols = "hidden";
	return ols;
};

_WCHAT.getStatusID = function(stat){
	var def = {'on':0,'off':-1,'away':10,'busy':20,'hidden':-10};
	var istat = def[stat];
	if(istat == "undefined")
		istat = 0;
	return istat;
};

_WCHAT.getUserStatus = function(uids,uidType,cbFun){
	if(uids.length < 1)
		return false;
	
	var au = [];
	var t ;
	for(var i=0;i<uids.length;i++){
		au.push(uids[i]);
		if(au.length >= 50){
			_WCHAT.getstat.buff.push( {uids:au,p:uidType,cbFun:cbFun} );
			au = [];
		}
	}
	
	if(au.length > 0 ){
		_WCHAT.getstat.buff.push( {uids:au,p:uidType,cbFun:cbFun} );
	}
	_WCHAT.execGetUserStatus();
};

_WCHAT.execGetUserStatus = function(){
	if(_WCHAT.getstat.loading){
		_WCHAT.getstat.iTimer = window.setTimeout("_WCHAT.execGetUserStatus()",500);
		return;
	}
	
	if(_WCHAT.getstat.iTimer)
		window.clearTimeout(_WCHAT.getstat.iTimer);
		
	if(_WCHAT.getstat.buff.length == 0 )
		return;
	
	var curr = _WCHAT.getstat.buff[0];
	_WCHAT.getstat.loading = true;
	var fn = _WCHAT.server.head + _WCHAT.server.getstatus;
	fn += '?p='+ (curr.p ? curr.p : '') ;
	fn += (_WCHAT.myChatID && _WCHAT.myChatID != "" ? '&id='+ _WCHAT.myChatID :'') ;
	fn += '&uids='+curr.uids.join(',');
	_COMM.loadXMLDoc(fn,_WCHAT.getUserStatusCallback);
	
};

_WCHAT.getUserStatusCallback = function(str,surl){
	var p = _UTL.getUrlArg('p',surl);
	var us = _UTL.getUrlArg('uids',surl);
	var uids = (us?us.split(","):null);

	if(!uids)
		uids = [];
	var orv = _UTL.getJSONData(str);

	var ob = _WCHAT.getstat.buff.shift();
	if(orv && ob && typeof(ob.cbFun)=="function")
		ob.cbFun(orv,p,uids);

	if(orv){
		var ou,oru;
		var sts = {};
		var oarg = [];
		for(var i=0;i<orv.length;i++){
			oru = orv[i];
			ou = _WCHAT.users[oru.uid];
			sts[oru.uid] = ou;
			if(!ou)
				continue;
			ou.istatus = oru.istatus;
			ou.sstatus = oru.sstatus;
			ou.lastactive = oru.lastactive;
			if(oru.nick != "")
				ou.nick = oru.nick;
			if(oru.realname != "")
				ou.realname = oru.realname;
			oarg.push(ou);
		};
		var uid;
		for(var i=0;i<uids.length;i++){
			uid = uids[i];
			if(sts[uid])
				continue;
			sts[uid] = {istats:-1,sstats:"",uid:uid};
			if(!_WCHAT.users[uid])
				continue;
			_WCHAT.users[uid].istatus = -1;
			_WCHAT.users[uid].sstatus = "";
			oarg.push(_WCHAT.users[uid]);
		}
		if(typeof(_WCHAT.gotUserStatus)=='function'){
			_WCHAT.gotUserStatus(oarg,p);
		}
	}

	_WCHAT.getstat.loading = false;
	if(_WCHAT.getstat.buff.length > 0){
		_WCHAT.getstat.iTimer = window.setTimeout("_WCHAT.execGetUserStatus()",100);
	}
};


_WCHAT.timerEvent = function(){
	if(_WCHAT.iTimer)
		window.clearTimeout(_WCHAT.iTimer);

//TODO:_WCHAT.fallCount

	var rv = _WCHAT.checkMsg();
	if(typeof(_WCHAT.onTimer)=="function"){
		_WCHAT.onTimer();
	}
	var it = (_WCHAT.msgSvr ? _WCHAT.waitLocSvr : _WCHAT.waits[_WCHAT.waitIndex]*(_WCHAT.isChatWinHid(_WCHAT.hid) ? 1:2) );
	
	_WCHAT.iTimer = window.setTimeout("_WCHAT.timerEvent()", it );
	if(rv != null ){
		_WCHAT.waitIndex ++;
		if(_WCHAT.waitIndex >= _WCHAT.waits.length)
			_WCHAT.waitIndex = Math.floor(_WCHAT.waits.length / 2);
	}
	
	var lst = _WCHAT.hasChatWin;
	_WCHAT.hasChatWin = (_WCHAT.msgSvr && _WCHAT.isChatWinHid(_WCHAT.msgSvr)) ;
	if(lst && lst != _WCHAT.hasChatWin){
		_WCHAT.msgSvr = null;
		if( typeof(_WCHAT.onLostChatWin)=="function")
			_WCHAT.onLostChatWin();
	}
	
};

_WCHAT.timing = function(idx){
	if(!idx || idx < 0)
		idx = 0;
	if(idx >= _WCHAT.waits.length)
		idx = _WCHAT.waits.length - 1;
	_WCHAT.waitIndex = idx;
	_WCHAT.timerEvent();
};

_WCHAT.pause = function(bpause){
	_WCHAT.paused = (bpause);
};

_WCHAT.bPaused = function(){
	return (_WCHAT.paused || _WCHAT.myChatID == "");
};

_WCHAT.checkMsg = function(){
	if(_WCHAT.msgSvr && _WCHAT.msgSvr != _WCHAT.hid ){
		_WCHAT.checkLocMsg();
		return -1;
	}
	if(_WCHAT.bPaused() || _WCHAT.currQID)
		return null;
	var fn = _WCHAT.server.head + _WCHAT.server.getmsg
		+ '?id='+ _WCHAT.myChatID
//		+ '&p=' + _WCHAT.myInfo.p
//		+ '&uid=' + _WCHAT.myInfo.uid
		+ "&a="+_WCHAT.lastMsgID
		+ "&var=__wchatMessages"
		+ "&hid="+_WCHAT.hid

	return _WCHAT.callSvr(fn,_WCHAT.gotMessage,_WCHAT.pris.check);
};

_WCHAT.isChatWinHid = function(hid){
	if(!hid)
		hid = _WCHAT.hid;
	return hid.search(/^commzoomsun/)!=-1;
};

_WCHAT.checkLocMsg = function(){
	if(_WCHAT.isChatWinHid(_WCHAT.hid)){
		_WCHAT.backToChatSvr();
		return;
	}
	if(!_WCHAT.msgSvr || _WCHAT.msgSvr == _WCHAT.hid){
		return _WCHAT.checkMsg();
	}
	if(_WCHAT.lastMsgID == 0)
		_WCHAT.lastMsgID = 100;
	
	if(_COMM.msgQueue.length > 0)
		return;
	
	_COMM.sendMessage( _WCHAT.msgSvr,{type:"command",key:"exec",message:{funName:"_WCHAT.reqLocMessage",args:{hid:_COMM.clientID,topics:_WCHAT.topics,blocked:_WCHAT.block}} } );
	_WCHAT.reqLocTimer = window.setTimeout("_WCHAT.backToChatSvr()",2000);
};


_WCHAT.reqLocMessage = function(oarg){
	var hid = oarg.hid;
	
	if(oarg.topics){
		for(var dat in oarg.topics){
			_WCHAT.currTopics[dat] = {args:oarg.topics[dat],atv:new Date()};
		}
	}
	if(oarg.blocked && _WCHAT.isChatWinHid(hid) ){
		_WCHAT.block = oarg.blocked;
	}
	_COMM.sendMessage( hid,{type:"command",key:"exec",message:{funName:"_WCHAT.gotLocMessage",
		args:{msg:_WCHAT.msgBuff,myInfo:_WCHAT.myInfo,hid:_COMM.clientID}} } );

};

_WCHAT.gotLocMessage = function(oarg){
	if(_WCHAT.reqLocTimer)
		window.clearTimeout(_WCHAT.reqLocTimer);
	try{
		if( _WCHAT.isChatWinHid(oarg.hid) )
			_WCHAT.myInfo = oarg.myInfo;
		_WCHAT.msgPretreatment(oarg.msg);
	}catch(err){}

	return;
};

_WCHAT.backToChatSvr = function(){
	_WCHAT.lastMsgID = 0;
	_WCHAT.msgSvr = null;
	_WCHAT.timing(0);
};

_WCHAT.getChatID = function(p,uid){
	var fn = _WCHAT.server.head + _WCHAT.server.getchatid + '?p='+p+'&uid='+uid;
	_COMM.loadXMLDoc(fn,_WCHAT.getChatIDCallback);
	
};

_WCHAT.getChatIDCallback = function(str,surl){
	var p = _UTL.getUrlArg("p",surl);
	var uid = _UTL.getUrlArg("uid",surl);
	var orv = _UTL.getJSONData(str);
	
	if(!orv || !orv.roomid)
		return;

	var chatid = orv.roomid;

	_WCHAT.users[chatid] = {uid:uid,p:p,nick:"",chatid:chatid};
	if(typeof(_WCHAT.gotChatID) == 'function'){
		_WCHAT.gotChatID(p,uid,chatid);
	}
};

_WCHAT.createRoom = function(sign,oarg){
	if(!sign || sign=="" )
		return;
	if(!oarg)
		oarg = {};
	if(!oarg.title)
		oarg.title = sign;

	if(!_WCHAT.topicRooms[sign]){
		_WCHAT.topicRooms[sign] = {sign:sign,args:oarg};
		_WCHAT.getRoomID(sign,oarg.title);
	}

};

_WCHAT.getRoomID = function(sign,title,users){
	var t = ((typeof(sign)=="string" && sign != "") ? 5 : 6);	
	var fn = _WCHAT.server.head + _WCHAT.server.getchatid + '?p='+_WCHAT.myInfo.p+'&uid='+_WCHAT.myInfo.uid + "&t="+t;

	var ost = {};
	if(t == 6){
		if(typeof(users)=="object" && users.length > 0){
			ost.users = {rec:users};
		}
	}else{
		ost.url = sign;
	}
	if(typeof(title)=="string" && title.length > 0)
		ost.title = title;
	var xmls = _ZXML._obj2xmlstr(ost,"request");
	_COMM.sendXML(fn,xmls,_WCHAT.getRoomIDCallback);
};

_WCHAT.getRoomIDCallback = function(str,surl){
	
	var orv = _UTL.getJSONData(str);
	
	if(!orv || !orv.roomid || orv.roomid=="")
		return;

	if(typeof(_WCHAT.gotRoomID)=="function")
		_WCHAT.gotRoomID(orv.roomid);

};

_WCHAT.getBuddyHistory = function(tuid){
	var fn = _WCHAT.server.head + _WCHAT.server.buddyHistory + '?tuid='+tuid;
	_COMM.loadXMLDoc(fn,_WCHAT.getBuddyHistoryCallback);
};

_WCHAT.getBuddyHistoryCallback = function(str,surl){
	var orv = _UTL.getJSONData(str);
	var tuid = _UTL.getUrlArg("tuid",surl);
	if(!orv || !orv.msgs)
		return;
	if(typeof(_WCHAT.onGotBuddyHistory) == "function")
		_WCHAT.onGotBuddyHistory(tuid,orv.msgs);
};


_WCHAT.getChatHistory = function(roomid,num){
	if(!num)
		num = 5;
	if(num > 50)
		num = 50;
	var fn = _WCHAT.server.head + _WCHAT.server.preview + '?mt=2&c='+num+'&id='+roomid;
	_COMM.loadXMLDoc(fn,_WCHAT.getChatHistoryCallback);
};

_WCHAT.getChatHistoryCallback = function(str,surl){
	var orv = _UTL.getJSONData(str);
	var roomid = _UTL.getUrlArg("id",surl);

	if(typeof(_WCHAT.onGotChatHistory) == "function")
		_WCHAT.onGotChatHistory(roomid,orv.msgs);


}

_WCHAT.joinRoom = function(roomid){
	var ori = _WCHAT.getInfoFromRoomid(roomid);
	if(ori.type != "5" && ori.type != "7")
		return false;

	var fn = _WCHAT.server.head + _WCHAT.server.joinRoom + '?id='+roomid;
	_COMM.loadXMLDoc(fn,_WCHAT.joinRoomCallback);
};

_WCHAT.joinRoomCallback = function(str,surl){
	var orv = _UTL.getJSONData(str);
	
	if(!orv || !orv.roominfo || orv.result != 0)
		return;

	var ori = _WCHAT.getInfoFromRoomid(orv.roominfo.roomid);
	if(ori.type == 5){
		var sign = orv.roominfo.url;
		if(_WCHAT.topicRooms[sign]){
			_WCHAT.topicRooms[sign].roominfo = orv.roominfo;
		}
	}

	if(typeof(_WCHAT.onJoinRoom) == "function")
		_WCHAT.onJoinRoom(orv);
	
};

_WCHAT.quitRoom = function(roomid){
	var ori = _WCHAT.getInfoFromRoomid(roomid);
	if(ori.type != "5")
		return false;

	var fn = _WCHAT.server.head + _WCHAT.server.quitRoom + '?id='+roomid;
	_COMM.loadXMLDoc(fn);

};

_WCHAT.joinGroupChat = function(groupid,p){
	if(!p)
		p = _WCHAT.myInfo.p;
	var fn = _WCHAT.server.head + _WCHAT.server.getchatid + '?p='+p+'&gid='+groupid + "&t=7";

	_COMM.loadXMLDoc(fn,_WCHAT.joinGroupChatCallback);
};

_WCHAT.joinGroupChatCallback = function(str,surl){
	
	var orv = _UTL.getJSONData(str);
	
	if(!orv || !orv.roomid || orv.roomid=="")
		return;

	if(typeof(_WCHAT.gotRoomID)=="function")
		_WCHAT.gotRoomID(orv.roomid,orv.authorized);

};

_WCHAT.addGroupChat = function(roomid,users){
	if(_WCHAT.getInfoFromRoomid(roomid).type!="6"){
		_WCHAT.getRoomID(null,null,users);
		return;
	}
	var ost = {};
	ost.users = {rec:users};
	var fn = _WCHAT.server.head + _WCHAT.server.add2group + '?id='+roomid;

	var xmls = _ZXML._obj2xmlstr(ost,"request");
	_COMM.sendXML(fn,xmls,_WCHAT.addGroupChatCallback);
	
};

_WCHAT.addGroupChatCallback = function(str,surl){
	
	var orv = _UTL.getJSONData(str);
	
	if(!orv || !orv.roomid || orv.roomid=="")
		return;
	if(typeof(_WCHAT.gotRoomID)=="function")
		_WCHAT.gotRoomID(orv.roomid);
	
	if(orv.members && typeof(_WCHAT.gotMembers)=="function")
		_WCHAT.gotMembers(orv.roomid,orv.members);
	
};

_WCHAT.callSvr = function(jssrc,cbfun,pri){
	if(!document.body) return null;

	var jsid = jssrc.replace(/.*\/\/(.*)\?.*/,"$1");
	var ojs = document.getElementById(jsid);
	if(ojs){
		var rqid = ojs.getAttribute("qid");
		if(rqid)
			_WCHAT.cleanUPQID(rqid,false);
		else
			document.body.removeChild(ojs);
	}
	if(_WCHAT.currQID)
		_WCHAT.cleanUPQID(rqid,false);

	var d = new Date();
	var qid = (d.valueOf()%1e8).toString(16);
	var ocall = new Object();
	ocall.time = d;
	ocall.bCalling = true;
	ocall.fun = cbfun;
	ocall.pri = pri;
	ocall.iTimer = window.setTimeout("_WCHAT.cleanUPQID('"+qid+"',true)",_WCHAT.Timeout);

	ojs = document.createElement("SCRIPT");
	ojs.language = "javascript";
	ojs.type = "text/javascript";
	ojs.charset = "utf-8";
	ojs.id = jsid;
	ojs.setAttribute("qid",qid);
	ojs.src = jssrc+"&qid="+qid;
	var cbfun = function(){}
	if(typeof(ojs.onreadystatechange) == "undefined")
		ojs.onload = function(){_WCHAT.onSvrBack(qid);};
	else
		ojs.onreadystatechange = function(){
			if(this.readyState == "loaded" || this.readyState == "interactive" || this.readyState == "complete" ){
				_WCHAT.onSvrBack(qid);
			}
		};

	ojs = document.body.appendChild(ojs); 

	ocall.ojs = ojs;
	_WCHAT.queue[qid] = ocall;
	_WCHAT.currQID = qid;
	return qid;
};

_WCHAT.onSvrBack = function(qid){
	if(!qid || qid=="") return;
	var ocall = _WCHAT.queue[qid];
	if(ocall && typeof(ocall.fun)=="function"){
	ocall.fun(qid);
	}
	_WCHAT.cleanUPQID(qid,false);


	return;
};

_WCHAT.cleanUPQID = function(qid,bfall){
	if(!qid || qid=="" || !_WCHAT.queue[qid]) return;
	var ocall = _WCHAT.queue[qid];
	if(ocall.iTimer) window.clearTimeout(ocall.iTimer);
	if(_WCHAT.currQID==qid) _WCHAT.currQID = null;
	document.body.removeChild(ocall.ojs)
	delete _WCHAT.queue[qid];
	if(bfall){
		_WCHAT.fallCount ++;
	}else{
		_WCHAT.lastGotTime = (new Date()).valueOf();
		_WCHAT.fallCount = 0;
	}
};

_WCHAT.gotMessage = function(qid){
	var orv = null;
	try{
		orv = __wchatMessages;
	}catch(err){}
	if(!orv || !orv.hid){
		_WCHAT.fallCount ++;
		return;
	}
	_WCHAT.fallCount = 0;

	if(orv.hid != _WCHAT.hid){
		_WCHAT.msgSvr = orv.hid;
		if(_WCHAT.isChatWinHid(_WCHAT.msgSvr) && typeof(_WCHAT.onGotChatWin)=="function")
			_WCHAT.onGotChatWin();
	}else{
		_WCHAT.msgSvr = null;
	}
	_WCHAT.lastMsgID = (_WCHAT.isChatWinHid(_WCHAT.hid) ? 0 : 100);
	
	_WCHAT.bReady = true;

	if(orv.msg.length > 0){
		_WCHAT.msgPretreatment(orv.msg);
		_WCHAT.timing(2);
	}
};

_WCHAT.isBuddyMsg = function(msgType){
	return (msgType >= 1000)
};
_WCHAT.isChatMsg = function(msgType){
	return (msgType >= 0)
};

_WCHAT.pushMsgBuff = function(omsg){
	_WCHAT.msgBuff.push(omsg);
	_WCHAT.msgBuffIdx[omsg.id] = true;
};

_WCHAT.msgPretreatment = function(ms,noUpdate){	
	var omsg,ou;
	var buffLen = 50;
	if( _WCHAT.msgBuff.length > buffLen){
		_WCHAT.msgBuff = _WCHAT.msgBuff.slice(_WCHAT.msgBuff.length-buffLen);
		for(var i=0;i<_WCHAT.msgBuff.length;i++){
			_WCHAT.msgBuffIdx[_WCHAT.msgBuff[i].id] = true;
		}
	}
	for(var i=0;i<ms.length;i++){
		omsg = ms[i];
		if(!omsg)
			continue;
		var needPush = true;
		if(omsg.type >= 0 ){
			omsg.text  = _WCHAT.siftMessage(omsg.text);
		}else{
			needPush = _WCHAT.decodeSysMessage(omsg);
		}
		if(needPush && !noUpdate && !_WCHAT.msgBuffIdx[omsg.id]){
			_WCHAT.pushMsgBuff(omsg);
		}
		if(_WCHAT.lastMsgID < omsg.id )
			_WCHAT.lastMsgID = omsg.id;
		if( _WCHAT.isRoom(omsg.roomid) ){
			continue;
		}else if(omsg.type >= 0){
			ou = _WCHAT.users[omsg.from]; 
			if(! ou ){
				_WCHAT.users[omsg.from] = {uid:omsg.uid,p:omsg.ut,nick:omsg.nk,chatid:omsg.from};
				if( omsg.from != _WCHAT.myChatID && typeof(_WCHAT.gotNewUser) == "function"  )
					_WCHAT.gotNewUser(_WCHAT.users[omsg.from]);
			}
			ou = _WCHAT.users[omsg.from];
			if(!ou.nick || ou.nick == "")
					ou.nick = omsg.nk;
		}
	}
	
	if(_WCHAT.firstload && ms.length > 0 )
		_WCHAT.firstload = false;

	if(typeof(_WCHAT.onMessage) == "function"){
		_WCHAT.onMessage(ms);
	}
	
};

_WCHAT.sortMsg = function(a,b){
	return a.id < b.id ? -1 : 1;
};

_WCHAT.getKeywordRegExp = function(kw){
if(!kw || kw=="")
return null;
kw = escape(kw);
return new RegExp("("+( kw.replace(/%20/g,"|").replace(/%/g,"\\") )+")","igm");
};

_WCHAT.siftMessage = function(msg){
	if(_WCHAT.re.revMessage)
		return msg.replace(_WCHAT.re.revMessage,"(feid)");
	else
		return msg;
};

_WCHAT.updateKeyWord = function(kw){
	_WCHAT.re.revMessage = _WCHAT.getKeywordRegExp(kw);
};

_WCHAT.getCmsgid = function(){
	return ((new Date()).valueOf()%1e8).toString(16);
};
_WCHAT.sendMessage = function(to,msgStr,cmsgID,type){
	if(typeof(to)!="string" || to == "" || typeof(msgStr)!="string" || msgStr == "")
		return false;
	msgStr = msgStr.replace(/\\+$/,"");
	msgStr = _WCHAT.siftMessage(msgStr);
	var ost = {
		nick:_WCHAT.myInfo.nick,
		msg:msgStr};
	var xmls = _ZXML._obj2xmlstr(ost,"request");
	
	_COMM.sendXML(_WCHAT.server.sendmsg
		+"?id="+to
		+'&c='+cmsgID+(type ? '&t='+type : "")
		+'&uid='+_WCHAT.myInfo.uid
		+'&ut='+_WCHAT.myInfo.p,xmls,_WCHAT.sendMessageCallback);

};

_WCHAT.sendMessageCallback = function(str){
	_WCHAT.timing(2);

	var orv = _UTL.getJSONData(str);
	
	if(!orv || !orv.msg )
		return;

	if(orv.msg.type >= 0 && !_WCHAT.isRoom(orv.msg.roomid) )
		_WCHAT.msgBuff.push(orv.msg);

	if(orv.msg.type < 0 && orv.msg.from != _WCHAT.myChatID && typeof(_WCHAT.onMessage) == "function" ){
		_WCHAT.onMessage([orv.msg]);
	}
				

	if(orv.offlinewarn && orv.offlinewarn!="false" && orv.msg.to && typeof(_WCHAT.onOfflineOverflow) == "function")
		_WCHAT.onOfflineOverflow(orv.msg.to);
		
};
