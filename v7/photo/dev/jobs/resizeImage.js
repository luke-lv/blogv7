/*
 * @author Jay Chan | chenjie@staff.sina.com.cn
 * @description 
 * @example
 * 
 * 
 */

$import("sina/core/dom/getElementsByClass.js");

$registJob("resizeImages", function(){
	
	function resizeImage(img, maxSize){
		if(img.complete){
			if(img.width == 0 || img.height == 0 || maxSize == 0){
				img.onload = null;
				return;
			}
			var max_current = Math.max(img.width,img.height);
			if(max_current > maxSize){
				var or = maxSize / max_current;
				var thisW = img.width;
				var thisH = img.height;
				img.style.width = (thisW > thisH ? maxSize : or * thisW) + "px";
				img.style.height = (thisH > thisW ? maxSize : or * thisH) + "px";
			}
			img.onload = null;
		}
	/*	else if(!/photo.sina.com.cn/i.test(img.src)){
			var or = img.height / img.width;
			var nr = h / w;
			img.style.width = (or > nr ? h / or : w) + "px";
			img.style.height = (or > nr ? h : w * or) + "px";
			img.onload = null;
		}*/
		else{
			var _arg = arguments;
			img.onload = function(){
				_arg.callee.call(null, img,maxSize);
			};
		}
	}
	function resizeImages(imgs, maxSize){
		for(var i = 0, l = imgs.length; i < l; i ++){
			resizeImage(imgs[i], maxSize);
		}
	}


	
	if($E("tbAllCtgPic")){
		resizeImages(
			Core.Dom.getElementsByClass(
				$E("tbAllCtgPic"),
				"img",
				"CP_brd"
			),
			200
		);
	}
	
});