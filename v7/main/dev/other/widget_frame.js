function __dosZWFCall(){return true;}
function __ZWFloadJS(){return true;}
if(typeof(_ZWF) == "undefined")
	var _ZWF = {};
_ZWF.$ = function(id){return document.getElementById(id)};

function __dosZWFReady(){
	return (_ZWF && _ZWF.readyState == "Ready");
}
_ZWF.showStatus = function(s){
	if(_ZWF.bShowStatus)
		window.status = s;
};
_ZWF.importJS = function(jssrc,jsid,loadFun){
	if(!jsid) jsid = escape(jssrc);
	var ojs = _ZWF.$(jsid);
	if(ojs)
		return true;
	if(!document.body){
		document.write('<script type="text/javascript" id="'+jsid+'" src="'+jssrc+'"></scr'+'ipt>');
	} else {
		ojs = document.createElement("SCRIPT"); 
		ojs.charset = "utf-8";
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


_ZWF.init = function(){
//	var ojs = _ZWF.$(_ZWF.scriptID);
//	_ZWF.staticServer = ojs.src.replace(/(.*\/)widget_frame\.js/,"$1");
//	if(typeof(_COMM) == "undefined" )
//		_ZWF.importJS(_ZWF.staticServer+"comm.js","zoomsun_widget_comm",_ZWF.commLoaded);
//	else
	_ZWF.commLoaded();

	_ZWF.commLoadBegin = (new Date()).valueOf();
	_ZWF.readyState = "Loading COMM";
	_ZWF.showStatus(_ZWF.readyState);
};
_ZWF.commLoaded = function(){
	_ZWF.readyState = "Initialize COMM";
	_ZWF.showStatus(_ZWF.readyState);
	_COMM.onMessage = _ZWF.gotMessage;
	_COMM.onComLoad = _ZWF.commInited;
	if(!_COMM.clientID)
		_COMM.init();
	else
		_ZWF.commInited();
};
_ZWF.commInited = function(){
	_ZWF.readyState = "Ready";
	_ZWF.showStatus("");
	var d = new Date();
	var m = navigator.appVersion.match(/MSIE (\d\.\d);/);
	var fixIE = (m && m[1] && Number(m[1])<=6);
	var fixLinux = (navigator.platform.toLowerCase().search("linux") != -1);
	if(d.valueOf()-_ZWF.commLoadBegin > 1000  || fixIE || fixLinux)
		_ZWF.inSlowNet = true;
	_ZWF.findEmbeds();
	_ZWF.desk.tb = _UTL.truebody();

	window.setTimeout('_ZWF.startChat()',200);
};


_ZWF.utl = {};

_ZWF.utl.evalStr = function(str){
	try{
		eval(str);
	}catch(err){};
};
_ZWF.utl.resize = function(elid,w,h){
	var el = _ZWF.$(elid);
	if(!el)
		return false;
	if(w && w != el.offsetWidth)
		el.style.width = w+'px';
	if(h && h != el.offsetHeight)
		el.style.height = h+'px';
};

window.setTimeout("_ZWF.init()",200+Math.floor(100*Math.random()));
