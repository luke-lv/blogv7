/** 
 * @fileoverview 通过Image对象加载图片 图片onload成功后 设置对应的img标签
 * @author liming9@staff.sina.com.cn
 * @created 2018-08-21
 */
$import("mojie/_mojie.js");

Mojie.checkImageSize = function(imgList, callback){
	var i, len;
	for(i=0, len=imgList.length; i<len; i++){
		var imgObj = new Image();
		imgObj.oriImg = imgList[i];
		imgObj.onload = function(imgObj){
			return function(){
				typeof callback ==="function" && callback(imgObj);
				//imgObj.oriImg.src = imgObj.src;
			}
		}(imgObj);
		imgObj.src = imgList[i].src;
	}
};
