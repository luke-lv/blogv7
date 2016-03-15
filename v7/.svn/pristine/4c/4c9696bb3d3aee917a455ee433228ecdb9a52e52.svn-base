/**
 * @fileoverview 此文件是微操盘广告和公告浮层共用接口，每个页面只需调用一次，返回的数据会放在全局里直接引用
 * @author   Liu Xiaoyue || xiaoyue3@staff.sina.com.cn
 * @created     2013-01-06
 * @vertion 0.01
 * @引用该job的conf文件比较多，关联度比较大，修改的时候注意下关联的conf
 */

/*
 * @fileoverview 在此接口上又添加了一个垃圾pv转换的数据内容
 * @modofied xiaoyue3
 * @vertion 0.02
 * @date 2013-06-18
*/ 
$import("lib/jobs.js");
$import("lib/checkAuthor.js");
$import("lib/listener.js");

$import("sina/utils/io/ajax.js");
$import("sina/core/string/j2o.js");

$registJob('adNoticeChannel', function() {
	var __addEvent = Core.Events.addEvent;
	var listener = Lib.Listener, pageId = scope.$pageid;
    var istj = window.location.href.indexOf("tj=1") > -1;
    var refer = document.referrer;
    if(refer){
        var host = refer.match(/(\:\/\/)(.*?)(\/)/g);
        refer = host && host[0].replace(/(\:\/\/){0,}(\/){0,}/g,"");
    }else{
        refer="";
    }

	Lib.checkAuthor();
	// var url = "http://blogtj.sinajs.cn/riaapi/afterLoadChannel/after_load_channel.php";
    var url = 'http://comet.blog.sina.com.cn/api?maintype=load_channel';
    Utils.Io.JsLoad.request(url, {
        GET : {
           	uid:$UID,
			bloguid: scope.$uid,
            refer: refer
        },
        onComplete  : function(result){
        	if(result && result.code === "A00006"){
                //使用此全局变量的时候，记得不用的时候要清空
        		scope.$channel = result.data;
                // debugger;
                // tj=1页面也显示推荐浮层
                if((pageId == 'article_new' || pageId == 'articleM_new' || pageId === 'article' || pageId === 'articleM' || pageId === 'index' || pageId === 'indexM' || pageId === 'articlelist' || pageId === 'articlelistM' || pageId === 'wanwan_index' || pageId === 'articlepreview_new')){
                    listener.notify("notice_ad_layer", scope.$channel || {});
                }
                // 用户赞助入口 下线 2014-04-28
                /*
                if(pageId === 'article' || pageId === 'articletj' || pageId === 'articletjTech' || pageId === "index"){
                    listener.notify("add_user_sponsor", scope.$channel || {});
                }
                */
                //此处不利因素：不知道scope.$channel什么时候被赋值，
                // 所以只好将通知写在接口请求之后
                listener.notify("ad_show_hide_conditions", scope.$channel || {});
                
                //此处增加垃圾pv转换流量 正文页添加图片广告
                // if(pageId === "article"){
                //     listener.notify("trashPvPic_transfer", scope.$channel || {});
                // }	
        	}
        }
    });
 });
