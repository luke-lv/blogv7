/**
 * @fileoverview 微操盘浮层
 * @author Book liming9@staff.sina.com.cn
 * @date 2012-10-24
 */
$import("sina/sina.js");
//$import("sina/core/events/addEvent.js");
//$import("sina/core/events/stopEvent.js");
$import("sina/utils/cookie/getCookie.js");
$import("sina/utils/cookie/setCookie.js");
$import("sina/core/dom/getXY.js");
$import("sina/core/dom/findNode.js");
$import("sina/core/dom/createElement.js");
//$import("sina/core/string/trim.js");

$registJob("weicaopanLayer", function(){
	if( Utils.Cookie.getCookie("wcp"+scope.$uid) ){
        return;
    }
    
    var pagesetbtn = Core.Dom.findNode($E('SG_Publish'), 'nextSibling', 'nextSibling');
//    if( !pagesetbtn || (pagesetbtn.innerText||pagesetbtn.textContent)!=='页面设置'){
//        return;
//    }
	// 原本微操盘的弹出框变成了365模版的弹出框 2013-2-1 modify by gaolei
	// 运营不让改，又改回关注博主组件了，先留着365图片的地址 2013-2-4 modify by gaolei
	// http://www.sinaimg.cn/blog/qing/image/yimei/365_1.jpg
    var html = '' +
        '<div id="weicaopan_j7hf" class="weitip">' +
            '<div class="weitips">' +
                '<p><a href="'+pagesetbtn.href+'"><img src="http://simg.sinajs.cn/blog7style/images/common/layer/pc_bz.jpg" /></a></p>' +
                '<p><a href="'+pagesetbtn.href+'">分享我的关注</a></p>' +
                '<div class="tb_layer_arrow tip_arrow"></div>' +
                '<a title="关闭" href="javascript:;" class="close">关闭</a>' + // id="closeweicaopan_j7hf"
            '</div>' +
        '</div>';

    var wcp_layer = Core.Dom.createElement(html);
    $E("headarea").appendChild( wcp_layer );
    //var inputXY = Core.Dom.getXY(document.body);
    var inputBtnXY = Core.Dom.getXY($E("blogtopoption"));
    wcp_layer.style.left = '787px';//(inputXY[0]+787) +"px";
    wcp_layer.style.top = (inputBtnXY[1]-105)+"px";
	wcp_layer.style.zIndex = "210";//365模版浮层zIndex=200；绝对定位位置才准确 modified by gaolei 
	wcp_layer.style.position = "absolute";

    //关闭按钮
    wcp_layer.onclick = function(event){
        event = event || window.event;
        var t = event.target || event.srcElement,
            tn = t.nodeName.toLowerCase();
        if( tn==='a' || tn==='img'){
            Utils.Cookie.setCookie("wcp"+scope.$uid, 1, 24*30);
            $E("weicaopan_j7hf").style.display = 'none';
        }
    };
        
    pagesetbtn = null;
    wcp_layer = null;
});
