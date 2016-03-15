/**
 * @fileoverview	推荐博文和博主个人中心页商讯广告套餐，这是两个不同的广告
 * @author			dcw1123 | chengwei1@staff.sina.com.cn
 * @author			Qiangyee | wangqiang1@staff
 */
$import("lib/680/_blogAd.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/removeEvent.js");
$import("sina/core/system/br.js");
$import("lib/templateUtils.js");
$import("lib/oop2.js");
$import("sina/core/dom/insertAfter.js");
$import("sina/utils/cookie/setCookie.js");
$import("sina/utils/cookie/getCookie.js");
$import("lib/680/shareToWeibo.js");
$import("lib/commonLog.js");

/**
 * @param {Object} oParam 博客商讯广告的参数
 * @param {HTMLElement} beforeNode 商讯的前一个组件
 */
blogAd.OppAd = function(oParam, beforeNode){
	if(!oParam.isShow){
        return;
    }
	oParam = oParam.ads[0];
	var __this = this, weiboMsg = ("true" == oParam['isusewb']);
	//var __relNode = $E("module_904");			// 紧随推荐博文下端
    //<span style="float:right;float:right;margin-top:6px;margin-right:6px"><a style="display:inline-block; width:40px; height:18px;background:url(http://p4p.sina.com.cn/test/sina/ftp/xuyafeng/bolgDemo/40x18_1.jpg);" onclick="return false;" href="#" id="btnCls_6242163485"></a></span>
    
	var __template = [
	'<div class="SG_conn" style="display:none;" id="#{entity}">',
		'<div class="SG_connHead">',
			'<span class="title">'+(oParam.info?oParam.info.title:"商讯")+'</span>',
			weiboMsg?'<span style="float:right;float:right;margin-top:6px;margin-right:6px">':'',
            '<a style="display:inline-block; width:40px; height:18px; ',
            weiboMsg?'margin:0px;':'margin:6px 0px 0px 128px;',
            'background:url(http://simg.sinajs.cn/blog7style/images/special/asiangames/btn_tips.jpg);" onclick="return false;" href="#" id="#{btnCls}"></a>',
            weiboMsg?'</span>':'',
            weiboMsg?'<span class="title" style="float:right;margin-right:6px"><a id="#{btnShare}" href="javascript:void(0)" style="display: block; ">分享到微博</a></span>':'',
			'<span class="edit"> </span>',
		'</div>',
		'<div class="SG_connBody" id="#{content}" style="padding:5px 5px 5px;overflow:hidden;"></div>',
		'<div class="SG_connFoot"></div>',
	'</div>',].join("");
	
	this.MARK_ID = 1;
	this.LIMITED = 24;
	this.nodes = this.getTemplateNodes(__template);
	this.nodes.content.innerHTML = oParam.content;
	this.isICP = oParam.isICP;
	Core.Dom.insertAfter(this.nodes.entity, beforeNode);
	Core.Events.addEvent(this.nodes.btnCls, function(){
		__this.hide();
		// 统计用户关闭
		if(oParam.status.adclose){
            new Image().src = oParam.status.adclose;
        }
	}, "click");
    var btnShareBtn = this.nodes.btnShare
    if (btnShareBtn){
        Core.Events.addEvent(btnShareBtn, function(){
            blogAd.shareToWeibo(oParam["addata"]);
            
        }, "click");
        btnShareBtn = null;
    }
	if(!this.isMarked()){
		this.show();
		// 统计展现
		if(oParam.status && oParam.status.adstart){
		    new Image().src = oParam.status.adstart;
        }
        //liming9-2012年7月18日 添加好耶代码统计 66666
        commonLog('http://1091.adsina.allyes.com/main/adfshow?user=AFP6_for_SINA|2012_add|2012_blog_tjbw_zcan&db=sina&border=0&local=yes&js=ie');
	}
	
}.$defineProto({
	
	isMarked:function(){
        var cookieName = this.isICP?"blogAdICP":"blogAdRecord";
        var __coo = decodeURIComponent(Utils.Cookie.getCookie(cookieName));
        if (!__coo){
            return false;
        }
        var __arr = __coo.split(",");
        //trace("oppAd: "+__arr.join(","));
        return this.getCurHours()-__arr[this.MARK_ID] < this.LIMITED; // 小于就是在限制内，标记 true。
	},
	
	setMark:function(){			// top,left,comment
        var cookieName = this.isICP?"blogAdICP":"blogAdRecord";
        var __arr;
        var __coo = decodeURIComponent(Utils.Cookie.getCookie(cookieName));
        if(__coo){
            __arr = __coo.split(",");
        }else{
            __arr = [0,0,0,0,0,0,0];
        }
        __arr[this.MARK_ID] = this.getCurHours();
        //trace("oppAd: "+__arr.join(","));
        Utils.Cookie.setCookie(cookieName, __arr.join(","), 2400, "/", ".blog.sina.com.cn");
	},
	
	getCurHours:function(){
		var ms = new Date().getTime();
		return parseInt(ms/3600000, 10);
	},
	
	show:function(){
		this.nodes.entity.style.display = "block";
	},
	
	hide:function(){
		this.nodes.entity.style.display = "none";
		this.setMark();
	}
	
}).$mixProto(Lib.templateUtils);


