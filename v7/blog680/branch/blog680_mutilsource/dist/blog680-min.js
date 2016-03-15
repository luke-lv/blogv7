(function(e,c){SinaBlog680={ver:"0.0.1"};SinaBlog680.utils={};SinaBlog680.cookie={};SinaBlog680.utils.htmlToDom=function(k){var l=document.createElement("div");l.innerHTML=k;return l.childNodes};SinaBlog680.utils.isEmptyObject=function(l){for(var k in l){return false}return true};SinaBlog680.utils.getRandomInt=function(l,k){return Math.floor((k-l+1)*Math.random())+l};SinaBlog680.cookie.getCookie=function(k){k=k.replace(/([\.\[\]\$])/g,"\\$1");var m=new RegExp(k+"=([^;]*)?;","i");var n=document.cookie+";";var l=n.match(m);if(l){return l[1]||""}else{return""}};SinaBlog680.cookie.setCookie=function(l,p,m,s,o,k){var q=[];q.push(l+"="+escape(p));if(m){var r=new Date();var n=r.getTime()+m*3600000;r.setTime(n);q.push("expires="+r.toGMTString())}if(s){q.push("path="+s)}if(o){q.push("domain="+o)}if(k){q.push(k)}document.cookie=q.join(";")};SinaBlog680.cookie.deleteCookie=function(k){document.cookie=k+"=;expires=Fri, 31 Dec 1999 23:59:59 GMT;"};SinaBlog680.jsload={};SinaBlog680.Url=function(k){k=k||"";this.url=k;this.query={};this.parse()};SinaBlog680.Url.prototype={parse:function(k){if(k){this.url=k}this.parseAnchor();this.parseParam()},parseAnchor:function(){var k=this.url.match(/\#(.*)/);k=k?k[1]:null;this._anchor=k;if(k!=null){this.anchor=this.getNameValuePair(k);this.url=this.url.replace(/\#.*/,"")}},parseParam:function(){var k=this.url.match(/\?([^\?]*)/);k=k?k[1]:null;if(k!=null){this.url=this.url.replace(/\?([^\?]*)/,"");this.query=this.getNameValuePair(k)}},getNameValuePair:function(l){var k={};l.replace(/([^&=]*)(?:\=([^&]*))?/gim,function(m,p,o){if(p==""){return}k[p]=o||""});return k},getParam:function(k){return this.query[k]||""},clearParam:function(){this.query={}},setParam:function(k,l){if(k==null||k==""||typeof(k)!="string"){throw new Error("no param name set")}this.query=this.query||{};this.query[k]=l},setParams:function(k){this.query=k},serialize:function(m){var k=[];for(var l in m){if(m[l]==null||m[l]==""){k.push(l+"=")}else{k.push(l+"="+m[l])}}return k.join("&")},toString:function(){var k=this.serialize(this.query);return this.url+(k.length>0?"?"+k:"")+(this.anchor?"#"+this.serialize(this.anchor):"")},getHashStr:function(k){return this.anchor?"#"+this.serialize(this.anchor):(k?"#":"")}};function j(l,k){var m;try{if(typeof k!="undefined"){for(m in l){if(k[m]!=null){l[m]=k[m]}}}}finally{m=null;return l}}function h(k){if(typeof k!="string"){return k}return encodeURIComponent(k)}function f(r,n){var q=r.urls;var t=r.GET;var o,p=q.length;var s,l,k,m;for(o=0;o<p;o++){m=window.parseInt(Math.random()*100000000);l=new SinaBlog680.Url(q[o].url);for(s in t){if(r.noencode==true){l.setParam(s,t[s])}else{l.setParam(s,h(t[s]))}}k=l.getParam("varname")||"requestId_"+m;if(r.noreturn!=true){l.setParam("varname",k)}n.script_var_arr.push(k);q[o].url=l.toString();q[o].charset=q[o].charset||r.charset}}function a(p,m){f(p,m);var o=p.urls;var l,k=o.length;for(l=0;l<k;l++){var n=document.createElement("script");n.src=o[l].url;n.charset=o[l].charset;n.onload=n.onerror=n.onreadystatechange=function(){if(n&&n.readyState&&n.readyState!="loaded"&&n.readyState!="complete"){return}m.script_loaded_num++;n.onload=n.onreadystatechange=n.onerror=null;n.src="";n.parentNode.removeChild(n);n=null};document.getElementsByTagName("head")[0].appendChild(n)}}function g(m,n){var l={urls:[],charset:"utf-8",noreturn:false,noencode:false,timeout:-1,POST:{},GET:{},onComplete:null,onException:null};var k={script_loaded_num:0,is_timeout:false,is_loadcomplete:false,script_var_arr:[]};l.urls=typeof m=="string"?[{url:m}]:m;j(l,n);a(l,k);(function(){if(l.noreturn==true&&l.onComplete==null){return}var o,p=[];if(k.script_loaded_num==l.urls.length){k.is_loadcomplete=true;if(l.onComplete!=null){for(o=0;o<k.script_var_arr.length;o++){p.push(window[k.script_var_arr[o]])}if(k.script_var_arr.length<2){l.onComplete(p[0])}else{l.onComplete(p)}}return}if(k.is_timeout==true){return}setTimeout(arguments.callee,50)})();if(l.timeout>0){setTimeout(function(){if(k.is_loadcomplete!=true){if(l.onException!=null){l.onException()}k.is_timeout=true}},l.timeout)}}SinaBlog680.jsload.request=function(k,l){new g(k,l)};SinaBlog680.PPTBoxHelper={count:0,instance:{},getId:function(){return"_ppt_box-"+(this.count++)}};SinaBlog680.moveElement=function(k,n,m){if(!document.getElementById){return false}if(!document.getElementById(k)){return false}var o=document.getElementById(k);if(o.movement){clearTimeout(o.movement)}if(!o.style.left){o.style.left="0px"}var l=parseInt(o.style.left);if(l==n){return true}if(l<n){var q=Math.ceil((n-l)/5);l=l+q}if(l>n){var q=Math.ceil((l-n)/5);l=l-q}o.style.left=l+"px";var p="SinaBlog680.moveElement('"+k+"',"+n+","+m+")";o.movement=setTimeout(p,m)};function d(){this.uid=SinaBlog680.PPTBoxHelper.getId();SinaBlog680.PPTBoxHelper.instance[this.uid]=this;this._$=function(k){return document.getElementById(k)};this.width=400;this.height=300;this.picWidth=15;this.picHeight=12;this.autoplayer=0;this.target="_blank";this._box=[];this._curIndex=0;this.materialtype=1;this.slot=null;this.slottype=1;this.sourceid=null;this.sudakey=null;this.sudavalue=null}d.prototype={_createMainBox:function(){var m=this.width*this._box.length;var k="<div id='"+this.sourceid+"_mainbox' class='mainbox'  style='overflow:hidden;position:relative;width:"+(this.width)+"px;height:"+(this.height)+"px;'>";k+="<div id='"+this.sourceid+"_contentbox' class='flashbox' style='overflow:hidden;position:relative;width:"+m+"px;height:"+(this.height)+"px;'></div>";k+="</div>";var l=SinaBlog680.utils.htmlToDom(k);this.slot.appendChild(l[0])},_init:function(){var k="";var s="SinaBlog680.PPTBoxHelper.instance['"+this.uid+"']";var r="";var o="";var n;var m=this.sourceid+"_contentbox";var l=this.sudakey;var q=this.sudavalue;for(var p=0;p<this._box.length;p++){var t=this._box[p];o+=this.renderHTML(t,this.width,this.height,p)}if(o!=""){if(this.slot.style.display=="none"){this.slot.style.display=""}n=SinaBlog680.utils.htmlToDom(o);if(this.slot){this.slot.appendChild(n[0]);window.setTimeout(function(){if(typeof SUDA!="undefined"&&l&&q){SUDA.uaTrack(l,q)}},3000)}}},_play:function(){clearInterval(this._autoplay);var k=this._curIndex+1;if(k>=this._box.length){k=0}this.changeIndex(k);var l="SinaBlog680.PPTBoxHelper.instance['"+this.uid+"']._play()";this._autoplay=setInterval(l,this.autoplayer*1000)},renderHTML:function(n,q,l,k){var o="";if(this.materialtype===1){var m="SinaBlog680.PPTBoxHelper.instance['"+this.uid+"']";var p="";if(n.a_href){p="cursor:pointer"}console.log(n);o='<a target="_blank" href="'+n.a_href+'"><img '+n.a_c_suda+' title="'+n.a_title+'" src="'+n.imgurl+'" style="width:'+q+"px;height:"+l+'px;"></a>'}else{if(this.materialtype===2){var p="";if(n.a_style){p=n.a_style}o='<a style="'+p+'" title="'+n.a_title+'" href="'+n.a_href+'" '+n.a_c_suda+' target="_blank">'+n.words+"</a>"}}return o},changeIndex:function(k){var l=this._box[k];SinaBlog680.moveElement(this.sourceid+"_contentbox",-(k*this.width),1);this._curIndex=k},mouseoverPic:function(k){this.changeIndex(k);if(this.autoplayer>0){clearInterval(this._autoplay);var l="SinaBlog680.PPTBoxHelper.instance['"+this.uid+"']._play()";this._autoplay=setInterval(l,this.autoplayer*1000)}},clickPic:function(k){var l=this._box[k];if(l.a_href&&l.a_href!=""){window.open(l.a_href,this.target)}},add:function(k){this._box[this._box.length]=k},show:function(){if(!this.slot){return}this._init();if(this.autoplayer>0){var k="SinaBlog680.PPTBoxHelper.instance['"+this.uid+"']._play()";this._autoplay=setInterval(k,this.autoplayer*1000)}}};var b={};SinaBlog680.sourceArrCache=[];SinaBlog680.sourceurl="http://interface.blog.sina.com.cn/riaapi/pageslot/pageslot.php";var i=0;SinaBlog680.staticBox=function(m,t){var v=t.length;var u=[];var l=SinaBlog680.cookie;var o={id:u};var k="";if(typeof scope!="undefined"){k=scope.$private.articleclass}for(var p=0;p<v;p++){var q=t[p].split(",");var s=q.length;if(s>1){var r=parseInt(l.getCookie(m[p]+"_adindex")||0);if(s<=r){r=0}l.setCookie(m[p]+"_adindex",1+r,24,"/",".blog.sina.com.cn");u.push(q[r])}else{if(s==1){u.push(q[0])}}}if(t.join().indexOf("SLOT_41")!=-1||t.join().indexOf("SLOT_42")!=-1){o={id:u,articleclass:k}}else{o={id:u}}var n=window.setInterval(function(){if(document.readyState==="complete"||document.readyState==="interactive"||document.readyState==="loaded"){clearInterval(n);n=null;SinaBlog680.jsload.request(SinaBlog680.sourceurl,{GET:o,onComplete:function(w){if(w){SinaBlog680.renderBox(m,u,w)}},onException:function(w){}})}else{console.log(document.readyState)}},500);window.setTimeout(function(){if(n){clearInterval(n);n=null}},1000*10)};SinaBlog680.renderBox=function(m,u,t){var p=m.length;var k=SinaBlog680.cookie;for(var n=0;n<p;n++){var s=u[n];if(t[s].slottype==1){var l=document.getElementById(m[n]);if(typeof BLOG_AD_TIPS!="undefined"&&BLOG_AD_TIPS!=null&&m[n]==="loginBarActivity"){continue}if(l){var r=t[s].res;if(r.length){var o=new d();o.width=t[s].width;o.height=t[s].height;o.sourceid=s;o.materialtype=t[s].materialtype;o.autoplayer=0;o.slot=l;if(r.length===1){o.add(r[0]);o.sudakey=r[0].a_v_suda_key;o.sudavalue=r[0].a_v_suda_value;o.show()}else{if(r.length>1){var q=SinaBlog680.utils.getRandomInt(0,r.length-1);o.add(r[q]);o.sudakey=r[q].a_v_suda_key;o.sudavalue=r[q].a_v_suda_value;o.show()}}if(s==="SLOT_41"||s==="SLOT_42"){if(l.parentNode.style.display=="none"){l.parentNode.style.display=""}}if(l.style.display=="none"){l.style.display=""}}}}else{console.log("slottype error")}}};SinaBlog680.preloadSlots=function(k){for(var l=0;l<k.length;l++){SinaBlog680.sourceArrCache.push(k[l])}};SinaBlog680.reqAD=function(){i=1;SinaBlog680.jsload.request(SinaBlog680.sourceurl,{GET:{id:SinaBlog680.sourceArrCache},onComplete:function(l){for(var k in l){b[k]=l[k]}i=0},onException:function(k){}})};SinaBlog680.fillSlot=function(m,k){var n='<a id="placeEle_'+m+'"></a>';if(!k){document.write(n)}var l=window.setInterval(function(){if(document.readyState==="complete"){if(!SinaBlog680.utils.isEmptyObject(b)){clearInterval(l);var p=b;if(!p||!p[m]){return}var q=new d();q.width=p[m].width;q.height=p[m].height;q.sourceid=m;q.materialtype=p[m].materialtype;q.autoplayer=0;if(k){q.slot=document.getElementById(k)}else{q.slot=document.getElementById("placeEle_"+m).parentNode}for(var o=0;o<p[m].res.length;o++){q.add(p[m].res[o]);q.show();var s=p[m].res[o].a_v_suda_key;var r=p[m].res[o].a_v_suda_value;SinaBlog680.sudaView(m,s,r)}}else{if(i===0){SinaBlog680.reqAD()}}}},500);window.setTimeout(function(){if(l){clearInterval(l)}},1000*10)};SinaBlog680.fillTopBar=function(l){var k=window.setInterval(function(){var n=document.getElementById("loginBarActivity");var m=document.getElementById("divPopularize");if(document.readyState==="complete"){if(n){if(typeof BLOG_AD_TIPS==="undefined"||!BLOG_AD_TIPS){SinaBlog680.fillSlot(l,"loginBarActivity")}clearInterval(k)}if(m){if(typeof BLOG_AD_TIPS==="undefined"||!BLOG_AD_TIPS){SinaBlog680.fillSlot(l,"divPopularize")}clearInterval(k)}}},3000);window.setTimeout(function(){if(k){clearInterval(k)}},3000*10)};SinaBlog680.sudaView=function(l,k,m){window.setTimeout(function(){var n=document.getElementById(l+"_mainbox");if(typeof SUDA!=="undefined"&&n){SUDA.uaTrack(k,m)}},3000)}})(window);