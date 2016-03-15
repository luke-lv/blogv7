/**
 * @fileoverview	托盘推广位豪华广告套餐，页面设置和发博文页没有此广告，其它页都有此套餐
 * @author			Qiangyee | wangqiang1@staff
 */
$import("sina/core/events/addEvent.js");
$import("sina/core/events/removeEvent.js");
$import("sina/core/system/br.js");
$import("sina/core/dom/insertHTML.js");
$import("sina/core/dom/insertAfter.js");
$import("sina/core/dom/setStyle.js");
$import("sina/utils/cookie/setCookie.js");
$import("sina/utils/cookie/getCookie.js");
$import("lib/templateUtils.js");
$import("lib/oop2.js");
$import("lib/680/_blogAd.js");
$import("lib/680/shareToWeibo.js");
$import("lib/commonLog.js");
$import("lib/sendLog.js");
/**
 * @param {Object} oParam 博客tips托盘广告的参数
 * @param {HTMLElement} relativeNode 显示tips广告托盘的推广链接
 */
blogAd.nickTrayAd = function(oParam, relativeNode){
    relativeNode.innerHTML = oParam["adLink"];
    var __this = this,
        __template = ['<div id="#{entity}" class="tips_layer1 tips_bg_a" style="z-index:150;position:absolute;top:23px;left:0px;display:none;">',
                '<div id="#{body}" class="tips_bd">',
                    '<a id="#{imageLink}" href="" class="link" title="" target="_blank"></a>',
                    '<div class="tips_detail"> <span id="#{closeBtn}" class="close" title="关闭">×</span>',
                        '<p id="#{userNick}" class="tips_nickname"></p>',
                        '<p id="#{tipsTitle}" class="tips_txt"></p>',
                        '<p id="#{tipsTxtLink}" class="tips_ad"></p>',
                        '<p id="#{tipsBtn}" class="tips_btn"></p>',
                    '</div>',
                '</div>',
            '</div>'].join("");
    this.relativeNodeId = relativeNode.id;
	this.MARK_ID = 1;
	this.LIMITED = 24;
    
	var nodes = this.nodes = this.getTemplateNodes(__template);

	Core.Dom.insertAfter(nodes.entity, document.body.lastChild);
    
    if ($IE6 && oParam.ie6BackgroundPic){
        
        nodes.entity.style.backgroundImage = "url("+oParam.ie6BackgroundPic+")";
    } else if (oParam.backgroundPic) {
        try{
            nodes.entity.style.backgroundImage = "url("+oParam.backgroundPic+")";
        }catch(e){}
    }
    
    nodes.imageLink.href =  oParam.imageLinkHref;
    var nick = typeof $nick;
    if ("undefined" == nick) {
        nick = "亲爱的网友";
    } else {
        nick = $nick;
    }
    nodes.userNick.innerHTML = 'HI，'+ nick.replace(/</g, "&lt;");
    nodes.tipsTitle.innerHTML = oParam.tipsTitle;
    if (oParam.tipsTxtLink) {
        nodes.tipsTxtLink.innerHTML = oParam.tipsTxtLink;
    }
    
    var link = nodes.tipsTxtLink.children[0],
        linkStyle = link.style;
    if (!$IE6 && oParam.tipsTxtLinkBgPic){
        linkStyle.backgroundImage  = "url("+oParam.tipsTxtLinkBgPic+")";
        linkStyle.backgroundRepeat = "no-repeat";
    } else if ($IE6 && oParam.ie6TipsTxtLinkBgPic){
        linkStyle.backgroundImage  = "url("+oParam.ie6TipsTxtLinkBgPic+")";
        linkStyle.backgroundRepeat = "no-repeat";
    }
    
    nodes.tipsBtn.innerHTML = oParam.tipsBtn;

	Core.Events.addEvent(nodes.closeBtn, function(){
		__this.hide();
        scope.$channel = null;
		var closeLog = oParam.status.adclose
        // 统计用户关闭
        if(closeLog){
            new Image().src = closeLog;
        }
	}, "click");
    setTimeout(function(){
        __this.setPos();
        __this.show();
        __this.initResizeEvent();
    }, 15);
    
    var adclose = oParam.status && oParam.status.adclose;

    Core.Events.addEvent(nodes.entity, function(e){
        var target = e.target || e.srcElement
            ,entity = nodes.entity;
        do {
            if ( "A" === target.nodeName.toUpperCase() 
                && (-1 != target.href.indexOf("http")) ) {
                __this.hide();
                scope.$channel = null;
                var closeLog = oParam.status.adclose
                // 统计用户关闭
                if(closeLog){
                    new Image().src = closeLog;
                }
                break;
            }
        } while (target && (target == entity));
    }, "click");
    // 统计展现
    if(oParam.status.adstart){
        new Image().src = oParam.status.adstart;
    }
    if (!oParam.blogTip) {
        //liming9-2012年7月18日 添加好耶代码统计 55555
        commonLog('http://1090.adsina.allyes.com/main/adfshow?user=AFP6_for_SINA|2012_add|2012_blog_tip&db=sina&border=0&local=yes&js=ie');
    } else {
        v7sendLog(oParam.logCode);
    }
    
}.$defineProto({
    //设置cookie表明套餐已经显示
	setMark:function(){
        var hours = new Date().getHours();
        var nextShowHours = 24-hours;
        Utils.Cookie.setCookie("blogTipsAd",1, nextShowHours, "/", ".blog.sina.com.cn");
	},

	setPos : function(){
        var relativeNode = $E(this.relativeNodeId);
        var xy = Core.Dom.getXY(relativeNode);
        var linkWidth = relativeNode.offsetWidth,
            nodeStyle = this.nodes.entity.style;
        nodeStyle.left = parseInt(xy[0])+(linkWidth-100)+'px';
        nodeStyle.top = parseInt(xy[1])+23+'px';
    },
    
	show:function(){
        this.isHidden = false;
        var tipsEl = this.nodes.entity
            ,_setStyle = Core.Dom.setStyle;
        
        var tween = new Ui.TweenStrategy(0, 1, 0.5, function(t, b, c, d){
			return -c*(t/=d)*(t-2)+b;
		});

		tween.onTween = function(val){
			_setStyle(tipsEl,"opacity",val);
		};

		tween.onEnd = function(){
            if (!$IE){
                _setStyle(tipsEl,"opacity","none");
            } else{
                tipsEl.style.filter = "none";
            }
		};

        _setStyle(tipsEl,"opacity",0);
		tipsEl.style.display = "block";
		tween.start();
	},
	
	hide:function(){
		this.setMark();
        this.isHidden = true;
         var tipsEl = this.nodes.entity, _setStyle = Core.Dom.setStyle;
        var tween = new Ui.TweenStrategy(1, 0, 0.5, function(t, b, c, d){
			return -c*(t/=d)*(t-2)+b;
		});
		tween.onTween = function(val){
			_setStyle(tipsEl,"opacity",val);
		};
		tween.onEnd = function(){
            if (!$IE){
                _setStyle(tipsEl,"opacity","none");
            } else{
                tipsEl.style.filter = "none";
            }
            tipsEl.style.display = "none";
		};
		tween.start();
	},
    
    initResizeEvent:function(){
        var me = this;
        Core.Events.addEvent(window, function(){
            if (!me.isHidden){
                me.setPos();
            }
        }, "resize");
    }
	
}).$mixProto(Lib.templateUtils);