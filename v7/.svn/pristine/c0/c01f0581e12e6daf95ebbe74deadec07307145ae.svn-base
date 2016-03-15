
$import("sina/core/dom/insertHTML.js");
$import("sina/utils/io/timeoutJsLoad.js");
$import("sina/utils/io/jsload.js");
$import("sina/core/string/j2o.js")
$registJob("tranVideo", function() {
	function detectBrowserType() {
		var ua=navigator.userAgent.toLowerCase();
		return {
			isIpad:ua.match(/ipad/i)!=null,
			isIphone:ua.match(/iphone/i)!=null,
			isIpod:ua.match(/ipod/i)!=null
		}
	}

	var isMac=detectBrowserType();
	if(!(isMac.isIpad || isMac.isIphone || isMac.isIpod))
		return;

	var __loadURL=Utils.Io.JsLoad.request;
	var __newTOJ=Utils.Io.TimeoutJsLoad;
	var __insertHTML=Core.Dom.insertHTML;
	var __toObj=Core.String.j2o;
	var tranVideo= {
		getVid: function(src) {
			var rep = new RegExp('vid=([^&]*)?&','i');

			var res = src.match(rep);
			if (res) {
				return res[1] || "";
			} else {
				return "";
			}
		},
		createVideoTag: function(obj) {

			//var src='http://qing.weibo.com/blog/api/recomuserslist.php?cate='
			//console.log(obj.src.replace('.swf',''))
			var src='http://video.sina.com.cn/api/getIpadUrl.php?url='+encodeURIComponent(obj.src.replace('.swf',''));

			new __newTOJ(src, {
				type:"blogScript",
				GET: {
					rmd:Math.random()
				},
				onComplete  : function(result) {

					if(result.ipad_url=='')
						return;
					//alert(result)
					obj.style.display='none';
					var vTag=$C('video');
					// vTag.id=Math.random();
					vTag.className='video';
					vTag.setAttribute('width','482px');
					vTag.setAttribute('height','388px');
					vTag.setAttribute('controls','controls');
					//vTag.setAttribute('src','http://v.iask.com/v_play_ipad.php?vid='+this.getVid(src));
					vTag.setAttribute('src',result.ipad_url);
					//vTag.setAttribute('src','http://i19.v.iask.com/f/1/5b40f537c9c0f1243cc238071246c48858881086.mp4');
					obj.parentNode.insertBefore(vTag,obj);

					//document.bodyElement.appendChild(vTag);
					// setTimeout(function (){
					//
					// $E(vTag.id).src=result.ipad_url;
					// },100);
				},
				onException : Function ()
			});
			// var appleSrc=__loadURL(src, {
			// onComplete  : function(result) {
			//
			// console.log(result);
			// obj.style.display='none';
			// var vTag=$C('video');
			// vTag.className='video';
			// vTag.setAttribute('width','482px');
			// vTag.setAttribute('height','388px');
			// vTag.setAttribute('controls','controls');
			// //vTag.setAttribute('src','http://v.iask.com/v_play_ipad.php?vid='+this.getVid(src));
			// vTag.setAttribute('src','http://sjs.sinajs.cn/blog7/mm.mp4');
			// obj.parentNode.insertBefore(vTag,obj);
			// },
			// onException : Function ()
			// })

		}
	}

	allEmbed=document.getElementsByTagName('embed');

	for(var i=0;i<allEmbed.length;i++) {
		if((allEmbed[i].src.indexOf('http://p.you.video.sina.com.cn')!=-1) || (allEmbed[i].src.indexOf('http://you.video.sina.com.cn')!=-1)) {
			//tranVideo.createVideoTag(allEmbed[i]);
			tranVideo.createVideoTag(allEmbed[i]);
		}

	}
});