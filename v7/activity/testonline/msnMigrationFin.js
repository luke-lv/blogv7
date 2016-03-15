if(typeof Sina=="undefined"){Sina={}}Sina.pkg=function(ns){if(!ns||!ns.length){return null}var levels=ns.split(".");var nsobj=Sina;for(var i=levels[0]=="Sina"?1:0;i<levels.length;++i){nsobj[levels[i]]=nsobj[levels[i]]||{};nsobj=nsobj[levels[i]]}return nsobj};function $E(oID){var node=typeof oID=="string"?document.getElementById(oID):oID;if(node!=null){return node}return null}function $C(tagName){return document.createElement(tagName)}function $N(name){return document.getElementsByName(name)}function $T(obj,tagName){return obj.getElementsByTagName(tagName)}try{document.execCommand("BackgroundImageCache",false,true)}catch(e){}(function(){var bind=function(fFunction,object){var __method=fFunction;return function(){return __method.apply(object,arguments)}};var debug_namespace="Debug";if(window[debug_namespace]==null||typeof window[debug_namespace].log=="undefined"){window[debug_namespace]={cacheData:[],base_url:"http://sjs.sinajs.cn/bind2/",product:scope.$PRODUCT_NAME,baseColor:{1:{color:"#FFF",bgcolor:"#E00"},2:{color:"#F00"},3:{color:"#FFF000"},4:{color:"#0F0"},5:{color:"#FFF"}},fatal:function(sInfo){this.addData(sInfo,1)},error:function(sInfo){this.addData(sInfo,2)},warning:function(sInfo){this.addData(sInfo,3)},info:function(sInfo){this.addData(sInfo,4)},log:function(sInfo){this.addData(sInfo,5)},dir:function(oInfo){this.addData(oInfo,5)},addData:function(sInfo,nType,sColor,sBgColor){if(sInfo==null){return}if(typeof sInfo!="object"){sInfo=sInfo.toString()}var oOption={type:nType||"5",color:sColor||this.baseColor[nType].color,bgcolor:sBgColor||this.baseColor[nType].bgcolor};this.cacheData.push([sInfo,oOption]);if(this.initFinished==true){this.showCurrentData([sInfo,oOption])}}};window.trace=bind(window[debug_namespace].log,window[debug_namespace]);window.traceError=bind(window[debug_namespace].error,window[debug_namespace])}})();Sina.pkg("Core");if(typeof Core=="undefined"){Core=Sina.Core}Sina.pkg("Core.Array");Core.Array.foreach=function(ar,insp){if(ar==null&&ar.constructor!=Array){return[]}var i=0,len=ar.length,r=[];while(i<len){var x=insp(ar[i],i);if(x!==null){r[r.length]=x}i++}return r};Sina.pkg("Core.Events");(function(_s){var _ua=navigator.userAgent.toLowerCase();var system={$winXP:/windows nt 5.1/.test(_ua),$winVista:/windows nt 6.0/.test(_ua),$win7:/windows nt 6.1/.test(_ua),$macOS:/mac/.test(_ua)};var browser={$OPERA:false,$IE6:false,$IE7:false,$IE8:false,$IE9:false,$SAFARI:false,$FF2:false,$FF3:false,$FF4:false,$FF:false,$CHROME:false,$TT:false,$360:false,$SOGO:false,$Maxthon:false};var engine={$IE:0,$MOZ:false,$WEBKIT:false,$KHTML:false};if(/opera/.test(_ua)||_s.opera){browser.$OPERA=true}else if(/chrome\/(\S+)/.test(_ua)){browser.$CHROME=true}else if(/safari\/(\S+)/.test(_ua)){browser.$SAFARI=true}else if(/msie/.test(_ua)){engine.$IE=true;if(/360se/.test(_ua)){browser.$360=true}else if(/tencenttraveler/.test(_ua)){browser.$TT=true}else if(/se\s\S+\smetasr\s\d+\.\d+/.test(_ua)){browser.$SOGO=true}var uaVersionArray=_ua.match(/msie (\d+)/);var version=parseInt(uaVersionArray[1]);engine.$IE=version;if(version===8){browser.$IE8=true}else if(version===6){browser.$IE6=true}else if(version===9){browser.$IE9=true}else if(version===7){browser.$IE7=true}else if(version===10){browser.$IE10=true}}else if(/firefox/.test(_ua)){var uaVersionArray=_ua.match(/firefox\/(\d+)/);browser.$FF=parseInt(uaVersionArray[1]);if(/firefox\/3/.test(_ua)){browser.$FF3=true}else if(/firefox\/4/.test(_ua)){browser.$FF4=true}else if(/firefox\/2/.test(_ua)){browser.$FF2=true}}else if(/trident\/7.0/.test(_ua)&&/rv:11.0/.test(_ua)){engine.$IE=11;browser.$IE11=true}try{var t=window.external;browser.$Maxthon=t.max_version?true:false}catch(e){}if(/applewebkit\/(\S+)/.test(_ua)){engine.$WEBKIT=true}else if(/khtml\/(\S+)/.test(_ua)){engine.$KHTML=true}else if(/rv:([^\)]+)\) gecko\/\d{8}/.test(_ua)){engine.$MOZ=true}browser.$MOBILE=/mobile/i.test(_ua);if(!browser.$MOBILE){browser.$MOBILE=/HTC/.test(_ua)}function apply(thisObj,cfg){var p;for(p in cfg){thisObj[p]=cfg[p]}}apply(_s,browser);apply(_s,engine);apply(_s,system)})(window);Core.Events.addEvent=function(elm,func,evType,useCapture){var _el=typeof elm=="string"?$E(elm):elm;if(_el==null){trace("addEvent 找不到对象："+elm);return}if(typeof useCapture=="undefined"){useCapture=false}if(typeof evType=="undefined"){evType="click"}if(_el.addEventListener){if(evType=="mousewheel"&&$FF){evType="DOMMouseScroll"}_el.addEventListener(evType,func,useCapture);return true}else if(_el.attachEvent){var r=_el.attachEvent("on"+evType,func);return true}else{_el["on"+evType]=func}};Core.Events.removeEvent=function(oElement,fHandler,sName){var _el=$E(oElement);if(_el==null){trace("removeEvent 找不到对象："+oElement);return}if(typeof fHandler!="function"){return}if(typeof sName=="undefined"){sName="click"}if(_el.addEventListener){_el.removeEventListener(sName,fHandler,false)}else if(_el.attachEvent){_el.detachEvent("on"+sName,fHandler)}fHandler[sName]=null};Sina.pkg("Core.Function");Core.Function.bind3=function(fFunc,object,args){args=args==null?[]:args;var __method=fFunc;return function(){return __method.apply(object,args)}};Core.Array.findit=function(arr,v){var k=-1;Core.Array.foreach(arr,function(value,index){if(v==value){k=index}});return k};window.onerror=function(err,file,line){trace("Error occured:"+err+"<br/>file:"+file+"<br/>line:"+line+"<br/>");return true};function Jobs(oOption){this.option=oOption||{};this._jobTable=[[],[],[],[]]}Jobs.prototype={_registedJobTable:{},errorMsg:[],_registJob:function(jobName,rel){this._registedJobTable[jobName]=rel},error:function(sMsg){Debug.error(sMsg);this.errorMsg.push(sMsg)},add:function(jobName,type){type=type||1;if(Core.Array.findit(this._jobTable[type],jobName)==-1){this._jobTable[type].push(jobName)}else{this.error("Error: Job <b>"+jobName+"</b> is existed now.")}},start:function(){if(this.option.onStart!=null){this.option.onStart()}var regJobs=this._registedJobTable;var jobs=this._jobTable[1].concat(this._jobTable[2]);var _this=this;this.fe=Core.Function.bind3(_this.focus,_this,[]);var addFocus=function(){if(_this._jobTable[3].length==0){if(_this.option.onEnd!=null){_this.option.onEnd()}return}Core.Events.addEvent(document.body,_this.fe,"focus");Core.Events.addEvent(window,_this.fe,"scroll");Core.Events.addEvent(document.body,_this.fe,"mousemove");Core.Events.addEvent(document.body,_this.fe,"mouseover")};this.queue(jobs,addFocus)},focus:function(){var _this=this;if(this.focusdown){Core.Events.removeEvent(document.body,_this.fe,"focus");Core.Events.removeEvent(window,_this.fe,"scroll");Core.Events.removeEvent(document.body,_this.fe,"mousemove");Core.Events.removeEvent(document.body,_this.fe,"mouseover");_this.fe=null;return}this.focusdown=true;var jobs=this._jobTable[3];this.queue(jobs,this.option.onEnd)},queue:function(jobs,callback){var _this=this;var getTime=function(){return(new Date).valueOf()};var regJobs=this._registedJobTable;var joblen=jobs.length;var i=0;var interNum=window.setInterval(function(){if(i>=joblen){clearInterval(interNum);interNum=null;if(callback!=null){callback()}return}var jobName=jobs[i];var job=regJobs[jobName];i++;if(typeof job=="undefined"){_this.error("<b>Job["+jobName+"] is undefiend!!!</b>");return}var _try=true;var _start=getTime();try{job.call()}catch(e){_this.error("<b>Job["+jobName+"] failed!!!</b>"+e.message+"");if(callback!=null){callback()}_try=false;throw e}finally{if(_try){var _end=getTime();Debug.info("<b>Job["+jobName+"] done in "+(_end-_start)+"ms.</b>")}}},10)},call:function(jobName,args){if(typeof this._registedJobTable[jobName]!="undefined"){this._registedJobTable[jobName].apply(this,args)}else{trace("<b>Job["+jobName+"] is undefined!!!</b>",{color:"#900",bgColor:"#FFF;"})}}};$registJob=function(name,rel){Jobs.prototype._registJob(name,rel)};$callJob=function(name){var args=[];if(arguments.length>1){Core.Array.foreach(arguments,function(v,i){args[i]=v});args.shift()}Jobs.prototype.call(name,args)};Sina.pkg("Utils");if(typeof Utils=="undefined"){Utils=Sina.Utils}Sina.pkg("Core.String");Utils.Url=function(url){url=url||"";this.url=url;this.query={};this.parse()};Utils.Url.prototype={parse:function(url){if(url){this.url=url}this.parseAnchor();this.parseParam()},parseAnchor:function(){var anchor=this.url.match(/\#(.*)/);anchor=anchor?anchor[1]:null;this._anchor=anchor;if(anchor!=null){this.anchor=this.getNameValuePair(anchor);this.url=this.url.replace(/\#.*/,"")}},parseParam:function(){var query=this.url.match(/\?([^\?]*)/);query=query?query[1]:null;if(query!=null){this.url=this.url.replace(/\?([^\?]*)/,"");this.query=this.getNameValuePair(query)}},getNameValuePair:function(str){var o={};str.replace(/([^&=]*)(?:\=([^&]*))?/gim,function(w,n,v){if(n==""){return}o[n]=v||""});return o},getParam:function(sPara){return this.query[sPara]||""},clearParam:function(){this.query={}},setParam:function(name,value){if(name==null||name==""||typeof name!="string"){throw new Error("no param name set")}this.query=this.query||{};this.query[name]=value},setParams:function(o){this.query=o},serialize:function(o){var ar=[];for(var i in o){if(o[i]==null||o[i]==""){ar.push(i+"=")}else{ar.push(i+"="+o[i])}}return ar.join("&")},toString:function(){var queryStr=this.serialize(this.query);return this.url+(queryStr.length>0?"?"+queryStr:"")+(this.anchor?"#"+this.serialize(this.anchor):"")},getHashStr:function(forceSharp){return this.anchor?"#"+this.serialize(this.anchor):forceSharp?"#":""}};Core.String.j2o=function(str){if(!str||str==""){return null}try{var o=window.eval("("+str+")");return o}catch(e){trace("j2o : 数据分析出错");traceError(e);return null}};Sina.pkg("Utils.Io");Sina.pkg("Core.System");(function(){var parseParam=function(oSource,oParams){var key;try{if(typeof oParams!="undefined"){for(key in oSource){if(oParams[key]!=null){oSource[key]=oParams[key]}}}}finally{key=null;return oSource}};Core.System.parseParam=parseParam})();Core.String.encodeDoubleByte=function(str){if(typeof str!="string"){return str}return encodeURIComponent(str)};Utils.Io.JsLoad={};(function(){function createScripts(oOpts,oCFG){processUrl(oOpts,oCFG);var urls=oOpts.urls;var i,len=urls.length;for(i=0;i<len;i++){var js=$C("script");js.src=urls[i].url;js.charset=urls[i].charset;js.onload=js.onerror=js.onreadystatechange=function(){if(js&&js.readyState&&js.readyState!="loaded"&&js.readyState!="complete"){return}oCFG.script_loaded_num++;js.onload=js.onreadystatechange=js.onerror=null;if(!1!==oOpts.isRemove){js.src="";js.parentNode.removeChild(js)}js=null};document.getElementsByTagName("head")[0].appendChild(js)}}function processUrl(oOpts,oCFG){var urls=oOpts.urls;var get_hash=oOpts.GET;var i,len=urls.length;var key,url_cls,varname,rnd;for(i=0;i<len;i++){rnd=window.parseInt(Math.random()*1e8);url_cls=new Utils.Url(urls[i].url);for(key in get_hash){if(oOpts.noencode==true){url_cls.setParam(key,get_hash[key])}else{url_cls.setParam(key,Core.String.encodeDoubleByte(get_hash[key]))}}varname=url_cls.getParam("varname")||"requestId_"+rnd;if(oOpts.noreturn!=true){url_cls.setParam("varname",varname)}if(oOpts.returnType=="jsonp"){var name=url_cls.getParam("callback")||"callback_"+rnd;var callback="script_callbackes."+name;url_cls.setParam("callback",callback);if(!window.script_callbackes){window.script_callbackes=[]}window.script_callbackes[name]=function(res){oCFG.is_loadcomplete=true;delete window.script_callbackes[name];if(oCFG.timeout_flag!=null){clearTimeout(oCFG.timeout_flag)}if(oCFG.is_timeout){return}if(oOpts.onComplete!=null){oOpts.onComplete(res)}}}oCFG.script_var_arr.push(varname);urls[i].url=url_cls.toString();urls[i].charset=urls[i].charset||oOpts.charset}}function ancestor(aUrls,oOpts){var _opts={isRemove:!0,urls:[],charset:"utf-8",noreturn:false,noencode:false,returnType:"",timeout:-1,POST:{},GET:{},onComplete:null,onException:null};var _cfg={script_loaded_num:0,is_timeout:false,is_loadcomplete:false,script_var_arr:[],timeout_flag:null};_opts.urls=typeof aUrls=="string"?[{url:aUrls}]:aUrls;Core.System.parseParam(_opts,oOpts);createScripts(_opts,_cfg);if(_opts.returnType!="jsonp"){(function(){if(_opts.noreturn==true&&_opts.onComplete==null){return}var i,data=[];if(_cfg.script_loaded_num==_opts.urls.length){_cfg.is_loadcomplete=true;if(_opts.onComplete!=null){for(i=0;i<_cfg.script_var_arr.length;i++){data.push(window[_cfg.script_var_arr[i]])}if(_cfg.script_var_arr.length<2){_opts.onComplete(data[0])}else{_opts.onComplete(data)}}return}if(_cfg.is_timeout==true){return}setTimeout(arguments.callee,50)})()}if(_opts.timeout>0){_cfg.timeout_flag=setTimeout(function(){if(_cfg.is_loadcomplete!=true){if(_opts.onException!=null){_opts.onException()}_cfg.is_timeout=true}},_opts.timeout)}}Utils.Io.JsLoad.request=function(aUrls,oOpts){new ancestor(aUrls,oOpts)}})();Core.Function.bind2=function(fFunc,object){var __method=fFunc;return function(){return __method.apply(object,arguments)}};Function.prototype.bind2=function(object){var __method=this;return function(){return __method.apply(object,arguments)}};Sina.pkg("Core.Dom");Core.Dom.getElementsByClass=function(el,tg,clz){el=el||document;var rs=[];clz=" "+clz+" ";var cldr=el.getElementsByTagName(tg),len=cldr.length;for(var i=0;i<len;++i){var o=cldr[i];if(o.nodeType==1){var ecl=" "+o.className+" ";if(ecl.indexOf(clz)!=-1){rs[rs.length]=o}}}return rs};Core.Dom.byClz=Core.Dom.getElementsByClass;Utils.Io.Ijax={arrTaskLists:[],createLoadingIframe:function(){if(this.loadFrames!=null){return false}var rndId1="loadingIframe_thread"+Math.ceil(Math.random()*1e4);var rndId2="loadingIframe_thread"+Math.ceil((Math.random()+1)*1e4);this.loadFrames=[rndId1,rndId2];var html='<iframe id="'+rndId1+'" name="'+rndId1+'" class="invisible"\r\n	              scrolling="no" src=""\r\n	              allowTransparency="true" style="display:none;" frameborder="0"\r\n	              ></iframe>\r\n				  <iframe id="'+rndId2+'" name="'+rndId2+'" class="invisible"\r\n	              scrolling="no" src=""\r\n	              allowTransparency="true" style="display:none;" frameborder="0"\r\n	              ></iframe>';var oIjaxIframeCnt=$C("div");oIjaxIframeCnt.id="ijax_iframes";oIjaxIframeCnt.innerHTML=html;trace("创建 Ijax 需要的 iframe");document.body.appendChild(oIjaxIframeCnt);var loadTimer=setInterval(Core.Function.bind2(function(){if($E(this.loadFrames[0])!=null&&$E(this.loadFrames[1])!=null){clearInterval(loadTimer);loadTimer=null;this.loadingIframe={thread1:{container:$E(this.loadFrames[0]),isBusy:false},thread2:{container:$E(this.loadFrames[1]),isBusy:false}};this.loadByList()}},this),10)},isIjaxReady:function(){if(typeof this.loadingIframe=="undefined"){return false}for(var oLoadCnt in this.loadingIframe){if(this.loadingIframe[oLoadCnt].isBusy==false){this.loadingIframe[oLoadCnt].isBusy=true;return this.loadingIframe[oLoadCnt]}}return false},request:function(url,option){var oTask={};oTask.url=url;oTask.option=option||{};this.arrTaskLists.push(oTask);if(this.loadFrames==null){this.createLoadingIframe()}else{this.loadByList()}},loadByList:function(){if(this.arrTaskLists.length==0){return false}var loadStatus=this.isIjaxReady();if(loadStatus==false){return false}var newData=this.arrTaskLists[0];this.loadData(newData.url,newData.option,loadStatus);this.arrTaskLists.shift()},loadData:function(url,option,loader){var _url=new Utils.Url(url);if(option.GET){for(var key in option.GET){_url.setParam(key,Core.String.encodeDoubleByte(option.GET[key]))}}if(!/\bdomain\b/.test(url)){_url.setParam("domain","1")}_url=_url.toString();var ifm=loader.container;ifm.listener=Core.Function.bind2(function(){try{var iframeObject=ifm.contentWindow.document,sResult;var tArea=Core.Dom.byClz(iframeObject,"textarea","")[0];if(typeof tArea!="undefined"){sResult=tArea.value}else{sResult=iframeObject.body.innerHTML}if(option.onComplete){option.onComplete(sResult)}else{option.onException()}}catch(e){traceError(e);if(option.onException){option.onException(e.message,_url.toString())}}loader.isBusy=false;Core.Events.removeEvent(ifm,ifm.listener,"load");this.loadByList()},this);Core.Events.addEvent(ifm,ifm.listener,"load");if(option.POST){var oIjaxForm=$C("form");oIjaxForm.id="IjaxForm";oIjaxForm.action=_url;oIjaxForm.method="post";oIjaxForm.target=ifm.id;for(var oItem in option.POST){var value;if(option.noEncode){value=Core.String.encodeDoubleByte(option.POST[oItem])}else{value=option.POST[oItem]}var oInput=$C("input");oInput.type="hidden";oInput.name=oItem;oInput.value=value;oIjaxForm.appendChild(oInput)}document.body.appendChild(oIjaxForm);oIjaxForm.submit()}else{try{window.frames(ifm.id).location.href=_url}catch(e){ifm.src=_url}}}};Utils.Io.Ajax={createRequest:function(){var request=null;try{request=new XMLHttpRequest}catch(trymicrosoft){try{request=new ActiveXObject("Msxml2.XMLHTTP")}catch(othermicrosoft){try{request=ActiveXObject("Microsoft.XMLHTTP")}catch(failed){}}}if(request==null){}else{return request}},request:function(url,option){option=option||{};option.onComplete=option.onComplete||function(){};option.onException=option.onException||function(){};option.returnType=option.returnType||"txt";option.method=option.method||"get";option.data=option.data||{};if(typeof option.GET!="undefined"&&typeof option.GET.url_random!="undefined"&&option.GET.url_random==0){this.rand=false;option.GET.url_random=null}return this.loadData(url,option)},loadData:function(url,option){var request=this.createRequest(),tmpArr=[];var _url=new Utils.Url(url);if(option.POST){for(var postkey in option.POST){var postvalue=option.POST[postkey];if(postvalue!=null){tmpArr.push(postkey+"="+Core.String.encodeDoubleByte(postvalue))}}}var sParameter=tmpArr.join("&")||"";if(option.GET){for(var key in option.GET){if(key!="url_random"){_url.setParam(key,Core.String.encodeDoubleByte(option.GET[key]))}}}if(this.rand!=false){}request.onreadystatechange=function(){if(request.readyState==4){var response,type=option.returnType;try{switch(type){case"txt":response=request.responseText;break;case"xml":if($IE){response=request.responseXML}else{var Dparser=new DOMParser;response=Dparser.parseFromString(request.responseText,"text/xml")}break;case"json":response=eval("("+request.responseText+")");break}option.onComplete(response)}catch(e){option.onException(e.message,_url);return false}}};try{if(option.POST){request.open("POST",_url,true);request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");request.send(sParameter)}else{request.open("GET",_url,true);request.send(null)}}catch(e){option.onException(e.message,_url);return false}return request}};Sina.pkg("Core.Class");Core.Class.AsPrototype={};Core.Class.create=function(){return function(t){if(t!=Core.Class.AsPrototype){this.initialize.apply(this,arguments)}}};if($IE6&&typeof Utils.Io.Ijax!="undefined"){Utils.Io.Ijax.loadData=function(url,option,loader){var _url=new Utils.Url(url);if(option.GET){for(var key in option.GET){_url.setParam(key,Core.String.encodeDoubleByte(option.GET[key]))}}if(!/\bdomain\b/.test(url)){_url.setParam("domain","1")}_url=_url.toString();var ifm=loader.container;ifm.listener=Core.Function.bind2(function(){try{var iframeObject=ifm.contentWindow.document,sResult;var tArea=Core.Dom.byClz(iframeObject,"textarea","")[0];if(typeof tArea!="undefined"){sResult=tArea.value}else{sResult=iframeObject.body.innerHTML}if(option.onComplete){option.onComplete(sResult)}else{option.onException()}}catch(e){traceError(e);if(option.onException){option.onException(e.message,_url.toString())}}loader.isBusy=false;Core.Events.removeEvent(ifm,ifm.listener,"load");this.loadByList()},this);Core.Events.addEvent(ifm,ifm.listener,"load");if(option.POST){var oIjaxForm=$C("form");oIjaxForm.id="IjaxForm";oIjaxForm.action=_url;oIjaxForm.method="post";oIjaxForm.target=ifm.id;for(var oItem in option.POST){var value;if(option.noEncode){value=Core.String.encodeDoubleByte(option.POST[oItem])}else{value=option.POST[oItem]}var oInput=$C("input");oInput.type="hidden";oInput.name=oItem;oInput.value=value;oIjaxForm.appendChild(oInput)}document.body.appendChild(oIjaxForm);var timenum=100;function innerfun(){if(timenum>0){try{oIjaxForm.submit()}catch(e){setTimeout(innerfun,10)}}timenum--}innerfun()}else{try{window.frames(ifm.id).location.href=_url}catch(e){ifm.src=_url}}}}var Interface=function(url,type){this.url=new Utils.Url(url);this.type=type.toLowerCase()};Interface.prototype={url:null,type:"",request:function(option){var err=option.onError;var suc=option.onSuccess;option.onComplete=option.onSuccess=function(result){try{if(typeof result=="string"){result=result.replace(/;$/,"")}result=typeof result=="string"&&/\s*{/.test(result)?Core.String.j2o(result):result;if(result!=null&&typeof result.code=="undefined"){trace("接口数据异常："+this.url,"#F00");return}if(result!=null){if(result.code=="A00006"){suc(result.data)}else{err(result)}}else{err(result)}}catch(e){traceError(e)}}.bind2(this);option.onException=option.onError=option.onFail||function(){trace("接口失败："+this.url,"#F00");if(arguments.length>0){for(var i=0,len=arguments.length;i<len;i++){if(arguments[i]&&typeof arguments[i]!="undefined"){trace("错误信息："+arguments[i].toString())}}}}.bind2(this);var requestURL=this.url.toString();switch(this.type){case"ijax":Utils.Io.Ijax.request(requestURL,option);break;case"ajax":Utils.Io.Ajax.request(requestURL,option);break;case"script":case"jsload":Utils.Io.JsLoad.request(requestURL,option);break;default:throw new Error("未指定有效的数据传输类型")}}};Core.String.trimHead=function(str){return str.replace(/^(\u3000|\s|\t)*/gi,"")};Core.String.trimTail=function(str){return str.replace(/(\u3000|\s|\t)*$/gi,"")};Core.String.trim=function(str){return Core.String.trimHead(Core.String.trimTail(str))};$registJob("msnTransInfo",function(){var msnNick_node=$E("msn_nick");var blogUid_node=$E("blog_uid");var msnNick=null;var blogUid=null;if(msnNick_node&&blogUid_node){msnNick=Core.String.trim(msnNick_node.value);blogUid=Core.String.trim(blogUid_node.value)}if(!msnNick&&!blogUid){return}new Interface("http://control.blog.sina.com.cn/riaapi/profile/modify_uname_post.php?change=yes","jsload").request({GET:{uname:msnNick,deff:blogUid,uid:blogUid},onSuccess:function(){},onError:function(){},onFail:function(){}})});function main(){var job=new Jobs;job.add("msnTransInfo");job.start()}