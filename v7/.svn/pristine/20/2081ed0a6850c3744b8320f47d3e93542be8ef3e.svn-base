function get(_sXml, _sXsl, _sFunc){
	var sHtml = '';
	var sSrc = TRANSFORM + "?xsl=" + escape(_sXsl) + "&xml=" + escape(_sXml);
	var oHttp = document.createElement('iframe');
	oHttp.id = "aaa";
	document.body.appendChild(oHttp);

	var oHttp = document.createElement('iframe');
	oHttp.onload = function (){
		alert(2);
	};
	getIframe("aaa").document.getElementsByTagName('html')[0].appendChild(oHttp);
	alert(getIframe("aaa").document.getElementsByTagName('html')[0].innerHTML);
return;
	
	getIframe("aaa").document.body.innerHTML += "<iframe id='js_module_other_sina_rss'></iframe>";
	getIframe("aaa").document.body.onload = function(){alert(3)};
	getIframe("aaa").document.getElementById("js_module_other_sina_rss").src = _sXml;
	alert(getIframe("aaa").document.getElementsByTagName('html')[0].innerHTML);

	

	function iframeLoad (){
		if (document.frames) {
			oIframe = getIframe['js_module_other_sina_rss'];
			sHtml = oIframe.document.body.innerHTML;
		} else {
			oIframe = document.getElementById('js_module_other_sina_rss');
			sHtml = oIframe.contentWindow.document.getElementsByTagName('html')[0].innerHTML;
		}
		eval(_sFunc + "(sHtml);");
		oHttp.parentNode.removeChild(oHttp);
	}

	function getIframe(_sId){
		if (document.frames) {
			return document.frames[_sId];
		} else {
			return document.getElementById(_sId);
		}
	}

	function getContent(_sId){
		
	}
}
