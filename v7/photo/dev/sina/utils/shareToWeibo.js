/**
*@description 分享到微博
*@author jiangwei5
*@create 2014-07-03
*/
$import("sina/utils/utils.js");

/*
params:
{
    content: "",
    url: "",
    source: "",
    sourceUrl: "",
    appkey: "",
    img: ""
}
*/
Utils.shareToWeibo = function (params){
    var c = params.content;
    var url = params.url || document.location;
    var source = params.source || "新浪-博客";
    var sourceUrl = params.sourceUrl || "http://blog.sina.com.cn";
    var appkey = params.appkey || 1617465124;
    var img = params.img;
    if(c && c.length>80){
        c = c.substr(0, 80) + "……";			
    }
    
    var u = 'http://v.t.sina.com.cn/share/share.php?searchPic=false&title='
          + encodeURIComponent(c) 
          + "&url=" + encodeURIComponent(url)
          + '&source=' + encodeURIComponent(source) 
          + '&sourceUrl=' + encodeURIComponent(sourceUrl) 
          + '&content=utf-8&appkey='
          + appkey;
    if(img){
        u = u + '&pic=' + img;
    }
    window.open(u, 'shareToWeibo', 'toolbar=0,status=0,resizable=1,width=440,height=430,left=' + (screen.width - 440) / 2 + ',top=' + (screen.height - 430) / 2);
}