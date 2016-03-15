
/**
 * 加载单条数据
 */
if ($IE6 && typeof Utils.Io.Ijax !='undefined') {
    Utils.Io.Ijax.loadData= function(url, option, loader){
        var _url = new Utils.Url(url);
        if (option.GET) {
            for (var key in option.GET) {
                _url.setParam(key, Core.String.encodeDoubleByte(option.GET[key]));
            }
        }

		if(!/\bdomain\b/.test(url)){
			_url.setParam("domain", "1");
		}
        // 接口设置 Domain
        // 接口增加随机数
        //modified by stan | chaoliang@staff.sina.com.cn
        //减少不必要的强制更新数据
        //_url.setParam("rnd", Math.random());
        _url = _url.toString();
        //		trace("Ijax url : " + _url);
        //		trace("Ijax id : " + loader.container.id);
        // 当前用于加载数据的 iframe 对象
        var ifm = loader.container;
        ifm.listener = Core.Function.bind2(function(){
            try {
                var iframeObject = ifm.contentWindow.document, sResult;
                // 临时函数
                var tArea = Core.Dom.byClz(iframeObject, 'textarea', '')[0];
                //				trace("有 TEXTAREA 对象么？" + (typeof tArea != "undefined"));
                if (typeof tArea != "undefined") {
                    sResult = tArea.value;
                }
                else {
                    sResult = iframeObject.body.innerHTML;
                }
                //				trace("Ijax data : " + sResult);
                if (option.onComplete) {
                    option.onComplete(sResult);
                }
                else {
                    option.onException();
                }
            } 
            catch (e) {
                traceError(e);
                if (option.onException) {
                    option.onException(e.message, _url.toString());
                }
            }
            loader.isBusy = false;
            Core.Events.removeEvent(ifm, ifm.listener, "load");
            //			loader.src = ""; 重新建立 iframe
            this.loadByList();
        }, this);
        Core.Events.addEvent(ifm, ifm.listener, "load");
        // 如果需要 post 数据
        if (option.POST) {
            //			trace("Ijax->post");
            var oIjaxForm = $C("form");
            oIjaxForm.id = "IjaxForm";
            oIjaxForm.action = _url;
            oIjaxForm.method = "post";
            oIjaxForm.target = ifm.id;
            
            for (var oItem in option.POST) {
                var value;
                if (option.noEncode) {
                    value = Core.String.encodeDoubleByte(option.POST[oItem])
                }
                else {
                    value = option.POST[oItem]
                }
                var oInput = $C("input");
                oInput.type = "hidden";
                oInput.name = oItem;
                oInput.value = value;
                oIjaxForm.appendChild(oInput);
            };
            document.body.appendChild(oIjaxForm);            
			
			var timenum = 100;
			function innerfun ()
			{				
				if(timenum>0)
				{
					try{
						oIjaxForm.submit();
					}catch(e)
					{
						setTimeout(innerfun,10);
					}
				}
				timenum--;
			}
			innerfun ();				
        }
        else {
            try {
                window.frames(ifm.id).location.href = _url;
            } 
            catch (e) {
                ifm.src = _url;
            };
                    }
    }
}
