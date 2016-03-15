var LOADING = {};
LOADING['js'] = 'base.js';
LOADING['css'] = '1.css,callboard.css';
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
	
	// 函数参数
	for (i = 4; i < arguments.length; i++) {
		sFuncValue[sFuncValue.length] = arguments[i];
	}

	// 合并参数
	for (i = 0; i < sFuncValue.length; i++) {
		sFuncArg += ",sFuncValue[" + i + "]";
	}

	// 数据读取
	function getHtml(_sMark, _sSort, _sUrl) {
		var aLoding = {};
		CACHE[_sSort][sCacheLen][_sMark] = new ActiveXObject("Microsoft.XMLDOM");
		CACHE[_sSort][sCacheLen][_sMark].async = true;

		CACHE[_sSort][sCacheLen][_sMark].onreadystatechange = function () {
			if (CACHE[_sSort][sCacheLen][_sMark].readyState == 4 && CACHE[_sSort][sCacheLen][_sMark].parseError == 0) {
				sMark++;
				if (sMark == 2) {
					done(CACHE[_sSort][sCacheLen]['xml'], CACHE[_sSort][sCacheLen]['xsl'], _sSort, true);
				}
			}
		};
		CACHE[_sSort][sCacheLen][_sMark + '_url'] = CONFIG['readfile'] + escape(_sUrl);
		CACHE[_sSort][sCacheLen][_sMark].load(CONFIG['readfile'] + escape(_sUrl));
	}

	// 合并数据
	function done(_oCacheXml, _oCacheXsl, _sSort, _bMark) {
		try{
			if(_bMark && (_oCacheXml && true) && (_oCacheXsl && true)) {
				sHtml = _oCacheXml.transformNode(_oCacheXsl);
			} else {
				sHtml = CACHE[_sSort][sXmlState]['html'];
			}
			loadLibList(_sSort);
			CACHE[_sSort][sCacheLen]['html'] = sHtml;
			eval(_sFunc + "(sHtml" + sFuncArg + ");");
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