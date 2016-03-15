/** 
 * @fileoverview 加载图片callback函数
 * @author liming9@staff.sina.com.cn
 * @created 2018-08-21
 */
$import("mojie/_mojie.js");

Mojie.loadImgCallback = function(imgObj){
    var oriImg = imgObj.oriImg;
    var w = imgObj.width, h = imgObj.height;
    
    if( w>200 ){
        h = Math.floor(200*h/w);
        w = 200;
    }
    
    if( h>300 ){
        oriImg.parentNode.style.height = '300px';
        oriImg.parentNode.style.overflow = 'hidden';
    }
    
    oriImg.width = w;
    oriImg.height = h;
    
    imgObj = null;
};
