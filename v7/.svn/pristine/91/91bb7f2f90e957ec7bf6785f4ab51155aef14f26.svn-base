var LOADING = {};
LOADING['js'] = 'base.js';
LOADING['css'] = 'callboard,feeds';
function loadLib(_sUrl, _sMode, _sName, _sFunc){
	var sFileName = _sUrl.substr(_sUrl.lastIndexOf('/')+1);
	if(_sName && LOADING[_sMode].indexOf(sFileName) == -1){
		var oObj = document.createElement("link");
		oObj.rel = "Stylesheet";
		oObj.type = "text/css";
		oObj.media = "all";
		oObj.href = _sUrl;
		document.documentElement.childNodes[0].appendChild(oObj);
		LOADING[_sMode] += "#" + sFileName;
		if(_sFunc){
			eval(_sFunc + "();");
		}
	}
}
function loadLibList(_sLoad){
	var _sCss = _sLoad.substr(0, _sLoad.indexOf('_'));
	_sCss = _sCss == '' ? _sLoad : _sCss;
	if(LOADING['css'].indexOf(_sCss) == -1){
		loadLib('http://image2.sina.com.cn/blog/tmpl/v3/theme/' + THEME + '/css/' + _sCss + '.css', 'css', _sCss);
	}
}
function get(_sXml, _sXsl, _sSort, _sFunc){
	var i;
	var sMark = 0;
	var sHtml = '';
	var sFuncArg = '';
	var sFuncValue = [];
	CACHE ? function(){} : CACHE = {};
	CACHE[_sSort] ? function(){} : CACHE[_sSort] = [];
	var sCacheLen = CACHE[_sSort].length;
	
	// 本次CACHE初始化
	CACHE[_sSort][sCacheLen] = {};
	
	// 函数参数
	for (i = 4; i < arguments.length; i++){
		sFuncValue[sFuncValue.length] = arguments[i];
	}

	// 合并参数
	for (i = 0; i < sFuncValue.length; i++){
		sFuncArg += ",sFuncValue[" + i + "]";
	}
	
	// 数据读取
	function getHtml(_sMark, _sSort, _sUrl) {
		var oHttp = new ActiveXObject("Microsoft.XMLHTTP");
		oHttp.onreadystatechange = function () {
			if (oHttp.readyState == 4){
				show(_sMark, "end");
				sHtml = oHttp.responseText;
				//CACHE[_sSort][sCacheLen]['html'] = sHtml;
				//CACHE[_sSort][sCacheLen][_sMark + '_url'] = escape(_sUrl);
				done(sHtml, _sSort);
			}
		};
		show(_sMark, "begin");
		oHttp.open("GET", "/sns/transform.php?xsl=" + escape(_sXsl) + "&xml=" + escape(_sXml), true);
		oHttp.send(null);
	}
	
	// 进度显示
	function show(_sTxt, _sMark){
		if(_sXsl == "/xsl/callboard.xsl"){
			return;
		}
		if(_sTxt == "xml"){
			_sTxt = _sMark == "begin" ? "正在读取数据...<br/>" : "数据读取完毕...<br/>";
		}else{
			$('HOME').focus();
			_sTxt = "正在生成页面...";
		}
		if(typeof(sFuncValue[0]) == "object"){
			if(sFuncValue[0].innerHTML.length > 100){
				sFuncValue[0].innerHTML = _sTxt;
			}else{
				sFuncValue[0].innerHTML += _sTxt;
			}
		}else{
			if($(sFuncValue[0]).innerHTML.length > 100){
				$(sFuncValue[0]).innerHTML = _sTxt;
			}else{
				$(sFuncValue[0]).innerHTML += _sTxt;
			}
		}
	}
	
	// 合并数据
	function done(_sHtml, _sSort) {
		try{
			show("done", "begin");
			eval(_sFunc + "(_sHtml" + sFuncArg + ");");
			setTimeout("loadLibList('" + _sSort + "')", 500);
		}catch(e){}
	}

	// 查找CACHE
	function seek(_sMark, _sSort, _sUrl) {
		for(var i = 0; i < CACHE[_sSort].length; i++) {
			if (CACHE[_sSort][i][_sMark + "_url"] == _sUrl) {
				return i;
			}
		}
		return false;
	}

	getHtml('xml', _sSort, _sXml);

	/*
	var sXmlState = seek('xml', _sSort, _sXml);
		
	if (sCacheLen == false){
		getHtml('xml', _sSort, _sXml);
	}else{
		done(CACHE[_sSort][sXmlState]['html']);
	}
	*/
}