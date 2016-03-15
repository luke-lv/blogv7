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
    
	var checkcache = 0 ;
 
	if (arguments.length == 6 )
	{ 
        if (arguments[5] == "del")
        {
			 checkcache = 1 ;
        }

	}


	CACHE ? function(){} : CACHE = {};
	CACHE[_sSort] ? function(){} : CACHE[_sSort] = [];
	var sCacheLen = CACHE[_sSort].length;
	
	// 函数参数
	for (i = 4; i < arguments.length; i++) {
		sFuncValue[sFuncValue.length] = arguments[i];
	}

	// 合并参数
	for (i = 0; i < sFuncValue.length; i++) {
		sFuncArg += ",sFuncValue[" + i + "]";
	}
	
	// 进度显示
	function show(_sTxt, _sMark){
		if(_sXsl == "/xsl/callboard.xsl"){
			return;
		}
		if(_sTxt == "xml"){
			_sTxt = _sMark == "begin" ? "正在读取数据...<br/>" : "数据读取完毕...<br/>";
		}else if(_sTxt == "xsl"){
			_sTxt = _sMark == "begin" ? "正在读取模板...<br/>" : "模板读取完毕...<br/>";
			$('HOME').focus();
		}else{
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
	
	// 数据读取
	function getHtml(_sMark, _sSort, _sUrl) {
		var aLoding = {};
		try{
			try{
				CACHE[_sSort][sCacheLen][_sMark] = new ActiveXObject('Msxml2.DOMDocument.4.0');
			}catch(e){
				CACHE[_sSort][sCacheLen][_sMark] = new ActiveXObject('Msxml2.DOMDocument.3.0');
			}
		}catch(e){
			CACHE[_sSort][sCacheLen][_sMark] = new ActiveXObject("Microsoft.XMLDOM");
		}
		CACHE[_sSort][sCacheLen][_sMark].async = true;

		CACHE[_sSort][sCacheLen][_sMark].onreadystatechange = function () {
			if (CACHE[_sSort][sCacheLen][_sMark].readyState == 4 && CACHE[_sSort][sCacheLen][_sMark].parseError == 0) {
				sMark++;
				show(_sMark, 'end');
				if (sMark == 2) {
					done(CACHE[_sSort][sCacheLen]['xml'], CACHE[_sSort][sCacheLen]['xsl'], _sSort, true);
				}
			}
		};
		
		show(_sMark, 'begin');
		CACHE[_sSort][sCacheLen][_sMark + '_url'] = CONFIG['readfile'] + _sUrl;
		CACHE[_sSort][sCacheLen][_sMark].load(CONFIG['readfile'] + _sUrl);
	}
 


	// 合并数据
	function done(_oCacheXml, _oCacheXsl, _sSort, _bMark) {
		try{
			show("down");
			if(_bMark && (_oCacheXml && true) && (_oCacheXsl && true)) {
				sHtml = _oCacheXml.transformNode(_oCacheXsl);
			} else {
				sHtml = CACHE[_sSort][sXmlState]['html'];
			}
			loadLibList(_sSort);
			CACHE[_sSort][sCacheLen]['html'] = sHtml;
			eval(_sFunc + "(sHtml" + sFuncArg + ");");
			var ac=getAnchor(); 
		    
			var location_bool = false ;
			var _sSort_location =  _sSort ;
 
			if ( _sSort_location == "feeds_1")
			{
				location_bool = true ;
			}
			else if ( _sSort_location.substring(0, 11) == "feeds_FEEDS" )
			{
				 location_bool = true ;
			}
 

			if (ac=="comment" )  
			{ 
				location.href=location.href; 
 			}   
			else if ( location_bool == true )
			{ 
				document.body.scrollTop = 0 ;
				//location.href=  getfeedspo(location.href) ;
			}

		}catch(e){}
	}

	// 查找CACHE
	function seek(_sMark, _sSort, _sUrl) {
		if (checkcache == 1)
		{  
			return false ;
		}
		for(var i = 0; i < CACHE[_sSort].length; i++) {
			if (CACHE[_sSort][i][_sMark + "_url"] == _sUrl) {
				return i;
			}
		}
		return false;
	}

	var sXmlState = seek('xml', _sSort, _sXml);
	var sXslState = seek('xsl', _sSort, _sXsl);

	// 本次CACHE初始化
	CACHE[_sSort][sCacheLen] = {};

	// 调整处理次序
	if (sXmlState === false && sXslState === false) {
		getHtml('xml', _sSort, _sXml);
		getHtml('xsl', _sSort, _sXsl);
	} else if (sXmlState !== false && sXslState !== false) {
		if(sXmlState === sXslState){
			done(CACHE[_sSort][sXmlState]['xml'], CACHE[_sSort][sXslState]['xsl'], _sSort, false);
		} else {
			done(CACHE[_sSort][sXmlState]['xml'], CACHE[_sSort][sXslState]['xsl'], _sSort, true);
		}
		
	} else if (sXmlState === false) {
		sMark++;
		CACHE[_sSort][sCacheLen]['xsl'] = CACHE[_sSort][sXslState]['xsl'];
		getHtml('xml', _sSort, _sXml);
	} else {
		sMark++;
		CACHE[_sSort][sCacheLen]['xml'] = CACHE[_sSort][sXmlState]['xml'];
		getHtml('xsl', _sSort, _sXsl);
	}
}
